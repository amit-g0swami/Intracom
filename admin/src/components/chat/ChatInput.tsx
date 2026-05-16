import { useState } from 'react';
import { Input, Button } from 'intracom-ui';

interface ChatInputProps {
  isConnected: boolean;
  onSubmit: (text: string) => void;
}

export function ChatInput({ isConnected, onSubmit }: ChatInputProps) {
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    onSubmit(replyText.trim());
    setReplyText('');
  };

  return (
    <div className="p-4 bg-white border-t">
       <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type a reply..." 
            className="flex-1 text-md py-5 bg-gray-100 rounded-xl border-transparent focus-visible:bg-white focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200 transition-all shadow-none"
          />
          <Button 
             type="submit" 
             disabled={!replyText.trim() || !isConnected}
             className="px-6 rounded-xl transition-colors disabled:opacity-50"
             size="lg"
           >
             Send
          </Button>
       </form>
    </div>
  );
}
