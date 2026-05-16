import { MessageSquare, Users, Settings } from 'lucide-react';
import { Button, Avatar, AvatarFallback, Sidebar, SidebarContent } from 'intracom-ui';

export function SidebarNav({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) {
  return (
    <Sidebar className="w-16 flex !lg:w-16 !xl:w-16 border-r flex-col items-center py-4 gap-8 shrink-0 bg-white">
      <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition" onClick={() => onTabChange('chat')}>
        <AvatarFallback className="bg-blue-600 text-white font-bold">
          IC
        </AvatarFallback>
      </Avatar>
      
      <SidebarContent className="flex flex-col gap-4 w-full px-2 overflow-visible">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onTabChange('chat')}
          className={`w-full h-12 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-blue-600 hover:bg-gray-50'}`}
        >
          <MessageSquare size={24} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onTabChange('stats')}
          className={`w-full h-12 rounded-xl transition-all ${activeTab === 'stats' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-blue-600 hover:bg-gray-50'}`}
        >
          <Users size={24} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-full h-12 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-xl"
        >
          <Settings size={24} />
        </Button>
      </SidebarContent>
    </Sidebar>
  );
}
