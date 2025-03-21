import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { authService } from '../../services/user.service';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-gradient-to-r from-blue-600 to-blue-500 text-white z-50 shadow-lg">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold tracking-wider">eTMF</h1>
        </div>
        
        {/* Search */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 rounded-full bg-white/95 hover:bg-white focus:bg-white text-gray-800 text-sm border-none ring-offset-0 ring-0 focus-visible:ring-1 focus-visible:ring-white transition-all duration-200"
            />
          </div>
        </div>
        
        {/* User Controls */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-400 transition-colors">
            <Bell className="h-5 w-5" />
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-400 transition-colors">
                <Avatar className="h-9 w-9 border-2 border-white">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-blue-800 text-white font-medium">
                    {user?.userName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-1 w-56">
              <div className="flex items-center px-3 py-2">
                <Avatar className="h-9 w-9 mr-2">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {user?.userName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.displayName || 'User'}</span>
                  <span className="text-xs text-gray-500">{user?.email || 'user@example.com'}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;