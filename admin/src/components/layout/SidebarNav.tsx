import { MessageSquare, Users, Settings } from 'lucide-react';
import { Button, Avatar, AvatarFallback } from 'intracom-ui';

export function SidebarNav() {
  return (
    <nav className="w-16 bg-white border-r flex flex-col items-center py-4 gap-8 shrink-0">
      <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition">
        <AvatarFallback className="bg-blue-600 text-white font-bold">
          IC
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-4 w-full px-2">
        <Button variant="ghost" size="icon" className="w-full h-12 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl">
          <MessageSquare size={24} />
        </Button>
        <Button variant="ghost" size="icon" className="w-full h-12 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-xl">
          <Users size={24} />
        </Button>
        <Button variant="ghost" size="icon" className="w-full h-12 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-xl">
          <Settings size={24} />
        </Button>
      </div>
    </nav>
  );
}
