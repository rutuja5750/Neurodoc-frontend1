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
import { Search, Bell, User, Settings, LogOut, Shield, HelpCircle } from 'lucide-react';
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
    <header className="w-full border-b bg-white">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Left Section */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  <path d="M18 14h-8" />
                  <path d="M18 18h-8" />
                  <path d="M18 10h-8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Neurodoc TMF</span>
                <span className="text-xs text-gray-500">Enterprise Document Management</span>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:block w-[400px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search documents, folders, or users..."
                  className="pl-10 bg-gray-50/50 focus:bg-white transition-colors border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Help */}
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden md:flex hover:bg-gray-100 transition-colors"
            >
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Admin Dashboard Link */}
            {isAdmin && (
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors border-gray-200"
                onClick={() => navigate('/admin')}
              >
                <Shield className="h-4 w-4" />
                Admin Portal
              </Button>
            )}

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon"
              className="relative hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100 transition-colors">
                  <Avatar className="h-9 w-9 ring-2 ring-gray-100">
                    <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2 p-2">
                <div className="flex items-center px-3 py-2">
                  <Avatar className="h-10 w-10 mr-3 ring-2 ring-gray-100">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</span>
                    <span className="text-sm text-gray-500">{user?.email}</span>
                    <span className="text-xs text-blue-600 font-medium mt-1">{user?.role}</span>
                  </div>
                </div>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem className="py-2.5 cursor-pointer hover:bg-gray-50 rounded-md transition-colors">
                  <User className="mr-2 h-4 w-4 text-gray-500" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 cursor-pointer hover:bg-gray-50 rounded-md transition-colors">
                  <Settings className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem 
                    className="py-2.5 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => navigate('/admin')}
                  >
                    <Shield className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  className="py-2.5 cursor-pointer hover:bg-red-50 hover:text-red-600 rounded-md transition-colors" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;