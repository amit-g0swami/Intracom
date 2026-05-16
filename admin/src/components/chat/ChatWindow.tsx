import { MessagePayload } from '@/types/chat.types';
import { ChatInput } from './ChatInput';
import { MessageSquare } from 'lucide-react';

interface ChatWindowProps {
  activeThreadId: string | null;
  activeMessages: MessagePayload[];
  isConnected: boolean;
  handleReply: (text: string) => void;
}

export function ChatWindow({ activeThreadId, activeMessages, isConnected, handleReply }: ChatWindowProps) {
  if (!activeThreadId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
         <MessageSquare size={48} className="mx-auto mb-4 text-blue-200" />
         <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-white">
      <header className="p-4 border-b bg-white flex justify-between items-center shadow-sm z-10">
         <h3 className="font-semibold text-gray-800">Thread: {activeThreadId}</h3>
      </header>

      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-gray-50">
         {activeMessages.map((msg: MessagePayload, i: number) => {
            const isAdmin = msg.isAdmin;
            return (
              <div key={i} className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isAdmin ? 'bg-blue-600 text-white rounded-br-sm shadow-md' : 'bg-white border text-gray-800 rounded-bl-sm shadow-sm'}`}>
                    {msg.text}
                 </div>
              </div>
            )
         })}
      </div>

      <ChatInput isConnected={isConnected} onSubmit={handleReply} />
    </main>
  );
}
