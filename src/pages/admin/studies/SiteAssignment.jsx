import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Users, Building2 } from 'lucide-react';

const SiteAssignment = ({ studyId }) => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [isAssignUsersOpen, setIsAssignUsersOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch sites assigned to this study
  const { data: sites, isLoading: sitesLoading } = useQuery({
    queryKey: ['studySites', studyId],
    queryFn: async () => {
      const response = await fetch(`/api/studies/${studyId}/sites`);
      if (!response.ok) throw new Error('Failed to fetch sites');
      return response.json();
    }
  });

  // Fetch available users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  // Mutation for assigning a site to the study
  const assignSiteMutation = useMutation({
    mutationFn: async (siteData) => {
      const response = await fetch(`/api/studies/${studyId}/sites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData)
      });
      if (!response.ok) throw new Error('Failed to assign site');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['studySites', studyId]);
    }
  });

  // Mutation for assigning users to a site
  const assignUsersMutation = useMutation({
    mutationFn: async ({ siteId, userIds }) => {
      const response = await fetch(`/api/sites/${siteId}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds })
      });
      if (!response.ok) throw new Error('Failed to assign users');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['studySites', studyId]);
      setIsAssignUsersOpen(false);
    }
  });

  const handleAssignSite = async (siteId) => {
    try {
      await assignSiteMutation.mutateAsync({ siteId });
    } catch (error) {
      console.error('Failed to assign site:', error);
    }
  };

  const handleAssignUsers = async (userIds) => {
    if (!selectedSite) return;
    try {
      await assignUsersMutation.mutateAsync({
        siteId: selectedSite._id,
        userIds
      });
    } catch (error) {
      console.error('Failed to assign users:', error);
    }
  };

  if (sitesLoading || usersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Site Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Assign Site
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign New Site</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select onValueChange={handleAssignSite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Add available sites here */}
                  </SelectContent>
                </Select>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Users</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites?.map((site) => (
              <TableRow key={site._id}>
                <TableCell>{site.name}</TableCell>
                <TableCell>
                  {site.address.city}, {site.address.country}
                </TableCell>
                <TableCell>{site.status}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSite(site);
                      setIsAssignUsersOpen(true);
                    }}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {site.investigators?.length || 0} Users
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSite(site);
                      setIsAssignUsersOpen(true);
                    }}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* User Assignment Dialog */}
        <Dialog open={isAssignUsersOpen} onOpenChange={setIsAssignUsersOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Assign Users to {selectedSite?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select
                multiple
                onValueChange={handleAssignUsers}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select users" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SiteAssignment; 