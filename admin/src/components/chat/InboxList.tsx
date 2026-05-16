import { ThreadMap } from '@/types/chat.types';
import { Badge, Avatar, AvatarFallback } from 'intracom-ui';

interface InboxListProps {
  isConnected: boolean;
  threads: ThreadMap;
  activeConversationIds: string[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string) => void;
}

export function InboxList({ isConnected, threads, activeConversationIds, activeThreadId, setActiveThreadId }: InboxListProps) {
  return (
    <aside className="w-80 bg-white border-r flex flex-col shrink-0">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inbox</h2>
        <Badge variant={isConnected ? "default" : "destructive"}>
           {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeConversationIds.length === 0 ? (
           <div className="p-8 text-center text-gray-400 text-sm">No active conversations</div>
        ) : (
          activeConversationIds.map((id) => {
            const latestMessage = threads[id][threads[id].length - 1];
            return (
              <div 
                key={id}
                onClick={() => setActiveThreadId(id)}
                className={`p-4 border-b cursor-pointer transition-colors flex gap-3 ${activeThreadId === id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
              >
                 <Avatar className="w-10 h-10 mt-1">
                   <AvatarFallback className="bg-gray-200 text-gray-600">
                     V
                   </AvatarFallback>
                 </Avatar>
                 <div className="flex-1 overflow-hidden">
                   <div className="font-medium text-sm text-gray-900 truncate">Visitor #{id.substring(0, 8)}</div>
                   <div className="text-xs text-gray-500 mt-1 truncate">
                      {latestMessage.text}
                   </div>
                 </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
