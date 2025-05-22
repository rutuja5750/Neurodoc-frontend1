import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import UserManagement from './UserManagement';
import SponsorManagement from './SponsorManagement';
import { dummyUsers, dummySponsors } from '../services/dummyData';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load dummy data directly without authentication check
    setUsers(dummyUsers);
    setSponsors(dummySponsors);
  }, []);

  const handleUserUpdate = (updatedUser) => {
    setUsers(users.map(user => 
      user._id === updatedUser._id ? updatedUser : user
    ));
    toast({
      title: "Success",
      description: "User updated successfully"
    });
  };

  const handleUserDelete = (userId) => {
    setUsers(users.filter(user => user._id !== userId));
    toast({
      title: "Success",
      description: "User deleted successfully"
    });
  };

  const handleSponsorUpdate = (updatedSponsor) => {
    setSponsors(sponsors.map(sponsor => 
      sponsor._id === updatedSponsor._id ? updatedSponsor : sponsor
    ));
    toast({
      title: "Success",
      description: "Sponsor updated successfully"
    });
  };

  const handleSponsorDelete = (sponsorId) => {
    setSponsors(sponsors.filter(sponsor => sponsor._id !== sponsorId));
    toast({
      title: "Success",
      description: "Sponsor deleted successfully"
    });
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Super Admin Dashboard</h1>
          <p className="text-gray-500">Manage users and sponsors</p>
        </div>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <CardTitle>System Management</CardTitle>
              <CardDescription>Manage users and sponsor organizations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsor Management</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="mt-6">
              <UserManagement 
                users={users}
                onUpdate={handleUserUpdate}
                onDelete={handleUserDelete}
              />
            </TabsContent>
            <TabsContent value="sponsors" className="mt-6">
              <SponsorManagement 
                sponsors={sponsors}
                onUpdate={handleSponsorUpdate}
                onDelete={handleSponsorDelete}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard; 