import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, Eye, Users2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserForm from './UserForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { userService } from "@/services/user.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Update the dummyUsers data to include assigned studies and facilities
const dummyUsers = [
  {
    _id: "68097fa71faa7fdcaa35f125",
    firstName: "ERIN",
    lastName: "SIKAITIS",
    middleName: "",
    email: "erin.sikaitis@example.com",
    role: "FILING_LEVEL_MANAGER",
    status: "ACTIVE",
    organization: "Dizzaroo",
    department: "Physical Therapy",
    phoneNumber: "2484253540",
    npiNumber: "1659180511",
    npiType: "1",
    mailingAddress: {
      address: "5874 ANDOVER RD",
      city: "TROY",
      state: "MI",
      zip: "480982398",
      country: "US",
      phone: "2484253540"
    },
    practiceAddress: {
      address: "3090 PREMIERE PKWY STE 400",
      city: "DULUTH",
      state: "GA",
      zip: "300978915",
      country: "US",
      phone: "8774073422",
      fax: "8774074329"
    },
    permissions: ["UPLOAD_DOCUMENTS", "REVIEW_DOCUMENTS"],
    assignedStudies: [],
    assignedFacilities: [
      { _id: "1", name: "Mayo Clinic", city: "Rochester", country: "United States" }
    ],
    taxonomy: [
      {
        primary: true,
        code: "225X00000X",
        state: "",
        licenseNumber: "",
        _id: "6809873b53e3d80c14202db4"
      }
    ]
  },
  {
    _id: "68097fa71faa7fdcaa35f129",
    firstName: "CORTNEY",
    lastName: "YOUNG",
    middleName: "ANN",
    email: "cortney.young@example.com",
    role: "FILING_LEVEL_MANAGER",
    status: "ACTIVE",
    organization: "Dizzaroo",
    department: "Physical Therapy",
    phoneNumber: "5208849819",
    npiNumber: "1619207727",
    npiType: "1",
    mailingAddress: {
      address: "1777 W SAINT MARYS RD",
      city: "TUCSON",
      state: "AZ",
      zip: "857452687",
      country: "US",
      phone: "5208849819",
      fax: "5208840175"
    },
    practiceAddress: {
      address: "205 INDUSTRIAL CV",
      city: "RIDGELAND",
      state: "MS",
      zip: "391572715",
      country: "US",
      phone: "8774073422",
      fax: "8774074329"
    },
    permissions: ["UPLOAD_DOCUMENTS", "REVIEW_DOCUMENTS"],
    assignedStudies: [
      { _id: "STUDY001", title: "Phase III Clinical Trial for Alzheimer's Treatment" }
    ],
    assignedFacilities: [
      { _id: "2", name: "Johns Hopkins Hospital", city: "Baltimore", country: "United States" }
    ],
    taxonomy: [
      {
        primary: true,
        code: "225100000X",
        state: "AZ",
        licenseNumber: "LPT011206",
        _id: "6809873b53e3d80c14202dc6"
      }
    ],
    otherIdentifiers: [
      {
        issuer: "01",
        state: "MO",
        number: "47440011",
        _id: "6809873b53e3d80c14202dc7"
      }
    ]
  },
  {
    _id: "68097fa71faa7fdcaa35f12c",
    firstName: "JEHAN",
    lastName: "MATOZA",
    middleName: "ASIS",
    email: "jehan.matoza@example.com",
    role: "FILING_LEVEL_MANAGER",
    status: "ACTIVE",
    organization: "Dizzaroo",
    department: "Physical Therapy",
    phoneNumber: "2155570057",
    npiNumber: "1922339696",
    npiType: "1",
    mailingAddress: {
      address: "1628 JOHN F KENNEDY BLVD",
      city: "PHILADELPHIA",
      state: "PA",
      zip: "191032125",
      country: "US",
      phone: "2155570057",
      fax: "2155570061"
    },
    practiceAddress: {
      address: "1156 BOWMAN RD UNIT 105",
      city: "MT PLEASANT",
      state: "SC",
      zip: "294643803",
      country: "US",
      phone: "8774073422",
      fax: "8774074329"
    },
    permissions: ["UPLOAD_DOCUMENTS", "REVIEW_DOCUMENTS"],
    assignedStudies: [],
    assignedFacilities: [
      { _id: "3", name: "Cleveland Clinic", city: "Cleveland", country: "United States" }
    ],
    taxonomy: [
      {
        primary: true,
        code: "225100000X",
        state: "NY",
        licenseNumber: "049571",
        _id: "6809873b53e3d80c14202de3"
      }
    ]
  },
  {
    _id: "68097fa71faa7fdcaa35f12f",
    firstName: "WHITNEY",
    lastName: "OSBORN",
    middleName: "M",
    email: "whitney.osborn@example.com",
    role: "FILING_LEVEL_MANAGER",
    status: "ACTIVE",
    organization: "Dizzaroo",
    department: "Physical Therapy",
    phoneNumber: "4132726178",
    npiNumber: "1598203986",
    npiType: "1",
    mailingAddress: {
      address: "101 WASON AVE",
      city: "SPRINGFIELD",
      state: "MA",
      zip: "011071140",
      country: "US",
      phone: "4132726178",
      fax: "7743176206"
    },
    practiceAddress: {
      address: "391 COMMON ST",
      city: "DEDHAM",
      state: "MA",
      zip: "020264055",
      country: "US",
      phone: "8774073422",
      fax: "8774074329"
    },
    permissions: ["UPLOAD_DOCUMENTS", "REVIEW_DOCUMENTS"],
    assignedStudies: [
      { _id: "STUDY002", title: "Parkinson's Disease Treatment Study" }
    ],
    assignedFacilities: [],
    taxonomy: [
      {
        primary: true,
        code: "225100000X",
        state: "MA",
        licenseNumber: "16539",
        _id: "6809873b53e3d80c14202dba"
      }
    ]
  },
  {
    _id: "68097fa71faa7fdcaa35f131",
    firstName: "MARGARET",
    lastName: "CAPOTOSTO",
    middleName: "",
    email: "margaret.capotosto@example.com",
    role: "FILING_LEVEL_MANAGER",
    status: "ACTIVE",
    organization: "Dizzaroo",
    department: "Physical Therapy",
    phoneNumber: "8163925462",
    npiNumber: "1447065651",
    npiType: "1",
    mailingAddress: {
      address: "2609 CHARLOTTE ST",
      city: "KANSAS CITY",
      state: "MO",
      zip: "641082736",
      country: "US",
      phone: "8163925462"
    },
    practiceAddress: {
      address: "1650 HIGH ST",
      city: "WASHINGTON",
      state: "MO",
      zip: "630904365",
      country: "US",
      phone: "8774073422",
      fax: "8774074329"
    },
    permissions: ["UPLOAD_DOCUMENTS", "REVIEW_DOCUMENTS"],
    assignedStudies: [],
    assignedFacilities: [
      { _id: "4", name: "Massachusetts General Hospital", city: "Boston", country: "United States" }
    ],
    taxonomy: [
      {
        primary: true,
        code: "225X00000X",
        state: "MO",
        licenseNumber: "2025009628",
        _id: "6809873b53e3d80c14202dc0"
      }
    ]
  },
  {
    _id: "68097fa71faa7fdcaa35f134",
    firstName: "CAROLINE",
    lastName: "CHEESBOROUGH",
    middleName: "MARIA",
    email: "caroline.cheesborough@example.com",
    role: "FILING_LEVEL_MANAGER",
    status: "ACTIVE",
    organization: "Dizzaroo",
    department: "Physical Therapy",
    phoneNumber: "8436978633",
    npiNumber: "1285333617",
    permissions: ["UPLOAD_DOCUMENTS", "REVIEW_DOCUMENTS"],
    assignedStudies: [
      { _id: "STUDY003", title: "Multiple Sclerosis Treatment Research" }
    ],
    assignedFacilities: []
  },
  {
    _id: "68097fa71faa7fdcaa35f13c",
    firstName: "ANJALI",
    lastName: "KUMARI",
    middleName: "",
    email: "anjali.kumari@example.com",
    role: "FILING_LEVEL_MANAGER",
    status: "ACTIVE",
    organization: "Dizzaroo",
    department: "Physical Therapy",
    phoneNumber: "5757404509",
    npiNumber: "1134369309",
    permissions: ["UPLOAD_DOCUMENTS", "REVIEW_DOCUMENTS"],
    assignedStudies: [],
    assignedFacilities: [
      { _id: "5", name: "Stanford Medical Center", city: "Stanford", country: "United States" }
    ]
  },
  {
    _id: "68097fa71faa7fdcaa35f142",
    firstName: "PRESTON",
    lastName: "WARREN",
    middleName: "",
    email: "preston.warren@example.com",
    role: "FILING_LEVEL_MANAGER",
    status: "ACTIVE",
    organization: "Dizzaroo",
    department: "Physical Therapy",
    phoneNumber: "2514343626",
    npiNumber: "1235472135",
    permissions: ["UPLOAD_DOCUMENTS", "REVIEW_DOCUMENTS"],
    assignedStudies: [
      { _id: "STUDY004", title: "Epilepsy Treatment Study" }
    ],
    assignedFacilities: []
  },
  {
    _id: "68097fa71faa7fdcaa35f145",
    firstName: "AUDREY",
    lastName: "PHILLIPS",
    middleName: "",
    email: "audrey.phillips@example.com",
    role: "FILING_LEVEL_MANAGER",
    status: "ACTIVE",
    organization: "Dizzaroo",
    department: "Physical Therapy",
    phoneNumber: "4024361000",
    npiNumber: "1609660612",
    permissions: ["UPLOAD_DOCUMENTS", "REVIEW_DOCUMENTS"],
    assignedStudies: [],
    assignedFacilities: [
      { _id: "6", name: "UCLA Medical Center", city: "Los Angeles", country: "United States" }
    ]
  },
  {
    _id: "68097fa71faa7fdcaa35f147",
    firstName: "DAKOTA",
    lastName: "TURNBOUGH",
    middleName: "LORINA",
    email: "dakota.turnbough@example.com",
    role: "FILING_LEVEL_MANAGER",
    status: "ACTIVE",
    organization: "Dizzaroo",
    department: "Physical Therapy",
    phoneNumber: "6206392322",
    npiNumber: "1952195968",
    permissions: ["UPLOAD_DOCUMENTS", "REVIEW_DOCUMENTS"],
    assignedStudies: [
      { _id: "STUDY005", title: "Diabetes Type 2 Research Study" }
    ],
    assignedFacilities: []
  }
];

const UserManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: users } = {
    data: dummyUsers
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (userId) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleEdit = (user) => {
    setSelectedUser({
      ...user,
      id: user._id
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(userId._id);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">User Management</h1>
          <p className="text-gray-500">Manage and monitor user accounts</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-lg shadow-sm border px-3 py-2">
            <div className="flex items-center gap-2">
              <Users2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold">{users?.length || 0}</p>
              </div>
            </div>
          </div>
          <Button onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }} size="lg" className="shadow-sm">
            <Plus className="h-5 w-5 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <CardTitle>Users Directory</CardTitle>
              <CardDescription>View and manage all user accounts</CardDescription>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'ACTIVE' ? 'success' : 
                                user.status === 'SUSPENDED' ? 'warning' : 'destructive'}
                        className="font-normal"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(user)}
                          className="hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="hover:bg-gray-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          className="hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No users found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
          </DialogHeader>
          <UserForm
            user={selectedUser}
            onSuccess={() => {
              setIsFormOpen(false);
              queryClient.invalidateQueries(['users']);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-primary">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">
                      {selectedUser.firstName} {selectedUser.middleName} {selectedUser.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NPI Number</p>
                    <p className="font-medium">{selectedUser.npiNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NPI Type</p>
                    <p className="font-medium">{selectedUser.npiType}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-primary">Professional Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Organization</p>
                    <p className="font-medium">{selectedUser.organizationName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      selectedUser.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedUser.status === 'SUSPENDED'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-primary">Address Information</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2">Mailing Address</h5>
                    {selectedUser.mailingAddress ? (
                      <div className="space-y-1">
                        <p>{selectedUser.mailingAddress.address}</p>
                        <p>{selectedUser.mailingAddress.city}, {selectedUser.mailingAddress.state} {selectedUser.mailingAddress.zip}</p>
                        <p>{selectedUser.mailingAddress.country}</p>
                        {selectedUser.mailingAddress.phone && (
                          <p className="text-sm text-muted-foreground">
                            Phone: {selectedUser.mailingAddress.phone}
                          </p>
                        )}
                        {selectedUser.mailingAddress.fax && (
                          <p className="text-sm text-muted-foreground">
                            Fax: {selectedUser.mailingAddress.fax}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No mailing address provided</p>
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Practice Address</h5>
                    {selectedUser.practiceAddress ? (
                      <div className="space-y-1">
                        <p>{selectedUser.practiceAddress.address}</p>
                        <p>{selectedUser.practiceAddress.city}, {selectedUser.practiceAddress.state} {selectedUser.practiceAddress.zip}</p>
                        <p>{selectedUser.practiceAddress.country}</p>
                        {selectedUser.practiceAddress.phone && (
                          <p className="text-sm text-muted-foreground">
                            Phone: {selectedUser.practiceAddress.phone}
                          </p>
                        )}
                        {selectedUser.practiceAddress.fax && (
                          <p className="text-sm text-muted-foreground">
                            Fax: {selectedUser.practiceAddress.fax}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No practice address provided</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-primary">Taxonomy</h4>
                {selectedUser.taxonomy?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.taxonomy.map((item, index) => (
                      <div key={index} className="p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">Code: {item.code}</p>
                          {item.primary && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                        {item.state && (
                          <p className="text-sm text-muted-foreground">
                            State: {item.state}
                          </p>
                        )}
                        {item.licenseNumber && (
                          <p className="text-sm text-muted-foreground">
                            License: {item.licenseNumber}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No taxonomy information available</p>
                )}
              </div>

              {selectedUser.otherIdentifiers && selectedUser.otherIdentifiers.length > 0 && (
                <div className="bg-white rounded-lg border p-4 shadow-sm">
                  <h4 className="text-lg font-semibold mb-3 text-primary">Other Identifiers</h4>
                  <div className="space-y-2">
                    {selectedUser.otherIdentifiers.map((identifier, index) => (
                      <div key={index} className="p-3 bg-muted rounded-md">
                        <p className="font-medium">Number: {identifier.number}</p>
                        <p className="text-sm text-muted-foreground">
                          State: {identifier.state}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Issuer: {identifier.issuer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-primary">Assigned Studies</h4>
                {selectedUser.assignedStudies?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.assignedStudies.map(study => (
                      <div key={study._id} className="p-2 bg-muted rounded-md">
                        <p className="font-medium">{study.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No assigned studies</p>
                )}
              </div>

              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-primary">Assigned Facilities</h4>
                {selectedUser.assignedFacilities?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.assignedFacilities.map(facility => (
                      <div key={facility._id} className="p-2 bg-muted rounded-md">
                        <p className="font-medium">{facility.name}</p>
                        <p className="text-sm text-muted-foreground">{facility.city}, {facility.country}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No assigned facilities</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement; 
 