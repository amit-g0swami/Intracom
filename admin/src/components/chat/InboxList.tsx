import { ThreadMap } from '@/types/chat.types';
import { Badge, Avatar, AvatarFallback, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemTitle, ListItemDescription } from 'intracom-ui';

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
        <Typography variant="h4" className="m-0 p-0 border-0">Inbox</Typography>
        <Badge variant={isConnected ? "default" : "destructive"}>
           {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>
      <List className="flex-1 overflow-y-auto gap-0">
        {activeConversationIds.length === 0 ? (
           <div className="p-8 text-center text-gray-400 text-sm">No active conversations</div>
        ) : (
          activeConversationIds.map((id) => {
            const latestMessage = threads[id][threads[id].length - 1];
            return (
              <ListItem 
                key={id}
                onClick={() => setActiveThreadId(id)}
                className={`p-4 border-b rounded-none cursor-pointer flex gap-3 ${activeThreadId === id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
              >
                 <ListItemIcon>
                   <Avatar className="w-10 h-10 mt-1">
                     <AvatarFallback className="bg-gray-200 text-gray-600">
                       V
                     </AvatarFallback>
                   </Avatar>
                 </ListItemIcon>
                 <ListItemText className="flex-1 overflow-hidden">
                   <ListItemTitle className="truncate">Visitor #{id.substring(0, 8)}</ListItemTitle>
                   <ListItemDescription className="truncate mt-1">
                      {latestMessage.text}
                   </ListItemDescription>
                 </ListItemText>
              </ListItem>
            );
          })
        )}
      </List>
    </aside>
  );
}
