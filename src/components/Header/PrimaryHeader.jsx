import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { userService } from '../../services/user.service';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const user = userService.getCurrentUser();

  const handleLogout = () => {
    userService.logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ETMF_ADMIN';

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">Dizzaroo</span>
        </div>

        {/* Search */}
        <div className="flex-1 flex items-center">
          <form className="flex-1 flex items-center max-w-lg">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-4">
          {/* Admin Dashboard Link */}
          {isAdmin && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/admin')}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Button>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-1 w-56">
              <div className="flex items-center px-3 py-2">
                <Avatar className="h-9 w-9 mr-2">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
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
              {isAdmin && (
                <DropdownMenuItem 
                  className="py-2 cursor-pointer"
                  onClick={() => navigate('/admin')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </DropdownMenuItem>
              )}
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