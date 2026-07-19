# Senior-Level Agentic AI

This document explains the advanced Multi-Agent architecture implemented in Intracom. It moves beyond a simple "prompt and reply" script and introduces industry-standard agentic patterns.

## 1. Multi-Agent Routing (Semantic Classification)
Instead of throwing every user message at a single massive prompt, we use an **Orchestrator** or **Router** (`AiRouterService`). 
The Router's job is purely to classify the intent of the user. It uses **Structured JSON Output** to ensure the LLM always replies with a predictable format: `{ "intent": "support", "confidence": 0.95 }`.

This allows our backend (`AiProcessor`) to conditionally route the logic:
- If `intent === 'escalate'`, we immediately halt AI execution and keep the ticket open for a human.
- If `intent === 'support'`, we pass the conversation to the specialized Support Agent (`AiService`) with a specific persona.

## 2. The ReAct Loop (Reason + Act)
The core `AiService` no longer just asks for a single completion. It runs a `while` loop known as the **ReAct pattern**.
1. **Thought:** The LLM looks at the conversation history and reasons about what to do next.
2. **Action:** The LLM decides it needs to search the Knowledge Base, so it outputs a Function Call.
3. **Observation:** Our NestJS server actually executes the function (e.g., `kbService.search()`) and injects the result back into the prompt history.
4. **Repeat:** The loop continues. The LLM sees the new observation and can either call another tool or give the final answer.

We enforce a maximum loop count (e.g., 3 loops) to prevent infinite loops if the LLM gets confused.

## 3. RAG (Retrieval-Augmented Generation)
RAG is the standard way to give an LLM external knowledge without retraining the model. We implemented a `KnowledgeBaseService` that simulates a Vector Database. 
When the LLM calls the `searchKnowledgeBase` tool, it queries this service. The service finds the most relevant documents (e.g., "Refund Policy") and feeds them into the LLM's context window.

## 4. Human-in-the-Loop (HITL)
An autonomous agent is dangerous if it doesn't know when to quit. We implemented a robust handoff strategy:
- **Router Escapes:** If the user asks for a human, the router immediately flags it as an escalation.
- **Fail-Safes:** If the ReAct loop exceeds 3 attempts or crashes, it automatically falls back to an `escalate: true` state.
- **Database Status:** When escalated, the backend updates the conversation status so it appears prominently in the human Admin's Inbox.

---

### How to trace the logic
Start by reading `src/ai/processors/ai.processor.ts`. This is the entry point that pulls the history, calls the Router, and then invokes the ReAct loop in `AiService`.
