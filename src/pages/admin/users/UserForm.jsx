import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Search } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { userService } from "@/services/user.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { searchNPI } from '@/services/npiService';

const userSchema = z.object({
  npi: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional()
  }).optional(),
  role: z.enum([
    'ETMF_ADMIN',
    'SYSTEM_ADMIN',
    'STUDY_MANAGER',
    'PROJECT_MANAGER',
    'QUALITY_ASSURANCE',
    'FILING_LEVEL_MANAGER',
    'FILING_LEVEL_UPLOADER',
    'FILING_LEVEL_VIEWER',
    'FILING_LEVEL_APPROVER',
    'FILING_LEVEL_UNBLINDED',
    'INVESTIGATOR',
    'STUDY_COORDINATOR',
    'GENERAL_SITE_USER',
    'MONITOR_CRA',
    'COUNTRY_MANAGER',
    'CRO_PERSONNEL',
    'REGULATORY_INSPECTOR',
    'REVIEWER',
    'UNBLINDED_TEAM_MEMBER',
    'NON_USER_PROFILE'
  ]),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_APPROVAL']),
  department: z.string().optional(),
  organization: z.string().min(2, 'Organization is required'),
  medicalCredentials: z.object({
    licenseNumber: z.string().optional(),
    specialty: z.string().optional(),
    taxonomies: z.array(z.object({
      code: z.string(),
      desc: z.string(),
      primary: z.boolean(),
      state: z.string().optional(),
      license: z.string().optional(),
    })).optional(),
    certifications: z.array(z.string()).optional(),
  }).optional(),
  permissions: z.array(z.enum([
    'CREATE_STUDY',
    'MANAGE_STUDY',
    'VIEW_STUDY',
    'ARCHIVE_STUDY',
    'MANAGE_USERS',
    'MANAGE_PERMISSIONS',
    'UPLOAD_DOCUMENTS',
    'APPROVE_DOCUMENTS',
    'REVIEW_DOCUMENTS',
    'VIEW_AUDIT_TRAILS',
    'EXPORT_DATA',
    'MANAGE_WORKFLOWS',
    'OVERRIDE_WORKFLOWS',
    'ACCESS_UNBLINDED_DATA'
  ])).optional(),
  preferences: z.object({
    language: z.string().default('en'),
    timezone: z.string().default('UTC'),
    notifications: z.object({
      email: z.boolean().default(true),
      inApp: z.boolean().default(true)
    }),
    documentView: z.object({
      defaultView: z.enum(['GRID', 'LIST', 'HIERARCHY']).default('LIST'),
      showMetadata: z.boolean().default(true)
    })
  }).optional()
});

const UserForm = ({ user, onClose }) => {
  const queryClient = useQueryClient();
  const [isSearchingNPI, setIsSearchingNPI] = useState(false);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: user || {
      npi: '',
      email: '',
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
      },
      organization: '',
      role: 'GENERAL_SITE_USER',
      status: 'PENDING_APPROVAL',
      department: '',
      medicalCredentials: {
        licenseNumber: '',
        specialty: '',
        taxonomies: [],
        certifications: [],
      },
      permissions: [],
      preferences: {
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          inApp: true
        },
        documentView: {
          defaultView: 'LIST',
          showMetadata: true
        }
      }
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return user
        ? userService.updateUser(user._id, data)
        : userService.createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast({
        title: "Success",
        description: user ? "User updated successfully" : "User created successfully"
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSearch = async (searchData) => {
    setIsSearchingNPI(true);
    try {
      const response = await searchNPI({
        npiNumber: searchData.npi,
        firstName: searchData.firstName,
        lastName: searchData.lastName
      });
      
      if (response.results?.length > 0) {
        const result = response.results[0];
        const basic = result.basic;
        
        // Set basic information
        form.setValue('firstName', basic.first_name || '');
        form.setValue('lastName', basic.last_name || '');
        form.setValue('middleName', basic.middle_name || '');
        form.setValue('npi', result.number || '');
        
        toast({
          title: "Success",
          description: "Provider information found and auto-filled"
        });
      } else {
        toast({
          title: "No Results",
          description: "No provider found with the provided information",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to search provider",
        variant: "destructive"
      });
    } finally {
      setIsSearchingNPI(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (user) {
        await userService.updateUser(user.id, data);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        await userService.createUser(data);
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }
      queryClient.invalidateQueries('users');
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${user ? 'update' : 'create'} user: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="max-h-[80vh] overflow-y-auto px-1">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="sticky top-0 bg-white pb-4 mb-4 border-b">
            <h2 className="text-lg font-semibold">
              {user ? 'Edit User' : 'Create New User'}
            </h2>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">NPI Search</h3>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="npi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NPI Number</FormLabel>
                    <FormDescription>
                      Search by NPI number or provider name
                    </FormDescription>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="Enter NPI number" {...field} />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => handleSearch({ npi: field.value })}
                        disabled={!field.value || isSearchingNPI}
                      >
                        {isSearchingNPI ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Search by first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Search by last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="button" 
                  variant="outline"
                  className="mt-8"
                  onClick={() => handleSearch({
                    firstName: form.getValues('firstName'),
                    lastName: form.getValues('lastName')
                  })}
                  disabled={isSearchingNPI || (!form.getValues('firstName') && !form.getValues('lastName'))}
                >
                  {isSearchingNPI ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address*</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!user && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Contact Information</h3>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Organization Details</h3>
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization/Facility*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Role & Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ETMF_ADMIN">ETMF Admin</SelectItem>
                        <SelectItem value="SYSTEM_ADMIN">System Admin</SelectItem>
                        <SelectItem value="STUDY_MANAGER">Study Manager</SelectItem>
                        <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                        <SelectItem value="QUALITY_ASSURANCE">Quality Assurance</SelectItem>
                        <SelectItem value="FILING_LEVEL_MANAGER">Filing Level Manager</SelectItem>
                        <SelectItem value="FILING_LEVEL_UPLOADER">Filing Level Uploader</SelectItem>
                        <SelectItem value="FILING_LEVEL_VIEWER">Filing Level Viewer</SelectItem>
                        <SelectItem value="FILING_LEVEL_APPROVER">Filing Level Approver</SelectItem>
                        <SelectItem value="FILING_LEVEL_UNBLINDED">Filing Level Unblinded</SelectItem>
                        <SelectItem value="INVESTIGATOR">Investigator</SelectItem>
                        <SelectItem value="STUDY_COORDINATOR">Study Coordinator</SelectItem>
                        <SelectItem value="GENERAL_SITE_USER">General Site User</SelectItem>
                        <SelectItem value="MONITOR_CRA">Monitor CRA</SelectItem>
                        <SelectItem value="COUNTRY_MANAGER">Country Manager</SelectItem>
                        <SelectItem value="CRO_PERSONNEL">CRO Personnel</SelectItem>
                        <SelectItem value="REGULATORY_INSPECTOR">Regulatory Inspector</SelectItem>
                        <SelectItem value="REVIEWER">Reviewer</SelectItem>
                        <SelectItem value="UNBLINDED_TEAM_MEMBER">Unblinded Team Member</SelectItem>
                        <SelectItem value="NON_USER_PROFILE">Non User Profile</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Medical Credentials</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="medicalCredentials.licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalCredentials.specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Specialty</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch('medicalCredentials.taxonomies')?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Provider Taxonomies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {form.watch('medicalCredentials.taxonomies').map((taxonomy, index) => (
                      <div key={index} className="text-sm border rounded-lg p-3">
                        <div className="font-medium">{taxonomy.desc}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          <span>Code: {taxonomy.code}</span>
                          {taxonomy.license && (
                            <span className="ml-2">License: {taxonomy.license}</span>
                          )}
                          {taxonomy.state && (
                            <span className="ml-2">State: {taxonomy.state}</span>
                          )}
                          {taxonomy.primary && (
                            <span className="ml-2 text-blue-500">Primary</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Permissions</h3>
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 border rounded-lg p-4">
                    {[
                      { value: 'CREATE_STUDY', label: 'Create Study' },
                      { value: 'MANAGE_STUDY', label: 'Manage Study' },
                      { value: 'VIEW_STUDY', label: 'View Study' },
                      { value: 'ARCHIVE_STUDY', label: 'Archive Study' },
                      { value: 'MANAGE_USERS', label: 'Manage Users' },
                      { value: 'MANAGE_PERMISSIONS', label: 'Manage Permissions' },
                      { value: 'UPLOAD_DOCUMENTS', label: 'Upload Documents' },
                      { value: 'APPROVE_DOCUMENTS', label: 'Approve Documents' },
                      { value: 'REVIEW_DOCUMENTS', label: 'Review Documents' },
                      { value: 'VIEW_AUDIT_TRAILS', label: 'View Audit Trails' },
                      { value: 'EXPORT_DATA', label: 'Export Data' },
                      { value: 'MANAGE_WORKFLOWS', label: 'Manage Workflows' },
                      { value: 'OVERRIDE_WORKFLOWS', label: 'Override Workflows' },
                      { value: 'ACCESS_UNBLINDED_DATA', label: 'Access Unblinded Data' }
                    ].map((permission) => (
                      <div key={permission.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.value}
                          checked={(field.value || []).includes(permission.value)}
                          onCheckedChange={(checked) => {
                            const currentPermissions = field.value || [];
                            if (checked) {
                              field.onChange([...currentPermissions, permission.value]);
                            } else {
                              field.onChange(currentPermissions.filter(p => p !== permission.value));
                            }
                          }}
                        />
                        <Label
                          htmlFor={permission.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sticky bottom-0 bg-white pt-4 mt-6 border-t flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {user ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default UserForm; 