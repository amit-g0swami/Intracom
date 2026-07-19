import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class KnowledgeBaseService implements OnModuleInit {
  private readonly logger = new Logger(KnowledgeBaseService.name);
  private pinecone: Pinecone | null = null;
  private ai: GoogleGenAI;
  private readonly indexName = process.env.PINECONE_INDEX_NAME || 'intracom-kb';

  // Fallback mock documents if Pinecone is not configured
  private readonly fallbackDocuments = [
    {
      id: 'doc-1',
      title: 'Refund Policy',
      content: 'Customers can request a refund within 30 days of purchase. Refunds are processed to the original payment method within 5-7 business days. Software licenses that have been activated are not eligible for a refund unless defective.',
    },
    {
      id: 'doc-2',
      title: 'Business Hours & Support',
      content: 'Our support team is available Monday through Friday from 9 AM to 5 PM Eastern Time. We are closed on all major US holidays. For enterprise customers, 24/7 phone support is available on the Enterprise SLA plan.',
    },
    {
      id: 'doc-3',
      title: 'Shipping and Tracking',
      content: 'Physical orders ship within 1-2 business days. Tracking numbers are automatically emailed to the customer once the package is handed to the carrier. Standard shipping takes 3-5 days in the US.',
    }
  ];

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async onModuleInit() {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      this.logger.warn('PINECONE_API_KEY is not set. Falling back to mock RAG mode.');
      return;
    }

    try {
      this.pinecone = new Pinecone({ apiKey });
      this.logger.log(`Pinecone client initialized. Checking index: ${this.indexName}`);
      await this.seedKnowledgeBase();
    } catch (error) {
      this.logger.error('Failed to initialize Pinecone. Ensure your API key is valid.', error);
      this.pinecone = null; // Fallback to mock mode
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    });
    
    // The google SDK returns a slightly nested structure depending on the version,
    // usually response.embeddings[0].values
    const values = response.embeddings?.[0]?.values;
    if (!values) {
      throw new Error('Failed to generate embedding array from Gemini.');
    }
    return values;
  }

  /**
   * Seeds the Pinecone index if it is empty.
   */
  private async seedKnowledgeBase() {
    if (!this.pinecone) return;

    try {
      const index = this.pinecone.Index(this.indexName);
      const stats = await index.describeIndexStats();
      
      if (stats.totalRecordCount === 0) {
        this.logger.log('Pinecone index is empty. Seeding default knowledge base documents...');
        
        const vectors = [];
        for (const doc of this.fallbackDocuments) {
          const textToEmbed = `Title: ${doc.title}\nContent: ${doc.content}`;
          const embedding = await this.generateEmbedding(textToEmbed);
          
          vectors.push({
            id: doc.id,
            values: embedding,
            metadata: {
              title: doc.title,
              content: doc.content,
            },
          });
        }
        
        await index.upsert(vectors as any);
        this.logger.log(`Successfully seeded ${vectors.length} documents into Pinecone.`);
      } else {
        this.logger.log(`Pinecone index already contains ${stats.totalRecordCount} records. Skipping seed.`);
      }
    } catch (error) {
      this.logger.error('Error seeding Pinecone knowledge base:', error);
    }
  }

  /**
   * Performs semantic search using Pinecone, or falls back to mock search.
   */
  async search(query: string): Promise<string> {
    this.logger.log(`Searching knowledge base for query: "${query}"`);

    if (!this.pinecone) {
      this.logger.warn('Pinecone not configured. Using fallback mock search.');
      return this.mockSearch(query);
    }

    try {
      // 1. Embed the search query
      const queryEmbedding = await this.generateEmbedding(query);

      // 2. Query Pinecone
      const index = this.pinecone.Index(this.indexName);
      const searchResults = await index.query({
        vector: queryEmbedding,
        topK: 2,
        includeMetadata: true,
      });

      if (!searchResults.matches || searchResults.matches.length === 0) {
        return "No relevant documents found in the knowledge base.";
      }

      // 3. Format the results for the LLM
      return searchResults.matches
        .filter(match => match.score && match.score > 0.6) // Only return reasonably confident matches
        .map(match => {
          const metadata = match.metadata as { title: string, content: string };
          return `--- [${metadata.title}] ---\n${metadata.content}`;
        })
        .join('\n\n') || "No relevant documents found in the knowledge base.";

    } catch (error) {
      this.logger.error('Pinecone search failed, falling back to mock search.', error);
      return this.mockSearch(query);
    }
  }

  private async mockSearch(query: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const lowerQuery = query.toLowerCase();
    
    const matches = this.fallbackDocuments.filter(doc => 
      doc.content.toLowerCase().includes(lowerQuery) || 
      doc.title.toLowerCase().includes(lowerQuery) ||
      (lowerQuery.includes('refund') && doc.title.includes('Refund')) ||
      (lowerQuery.includes('hour') && doc.title.includes('Hours')) ||
      (lowerQuery.includes('ship') && doc.title.includes('Shipping'))
    );

    if (matches.length === 0) {
      return "No relevant documents found in the knowledge base.";
    }

    return matches.map(m => `--- [${m.title}] ---\n${m.content}`).join('\n\n');
  }
}
