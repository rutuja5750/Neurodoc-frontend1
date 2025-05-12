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
import { Textarea } from "@/components/ui/textarea";
import { X, Search, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from 'lucide-react';

// Function to generate a unique study ID
const generateStudyId = () => {
  const year = new Date().getFullYear();
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = letters[Math.floor(Math.random() * letters.length)] + 
                       letters[Math.floor(Math.random() * letters.length)];
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const sequence = Math.floor(Math.random() * 9) + 1; // 1-9
  return `STU-${year}-${randomLetters}${randomNum}-${sequence}`;
};

const studySchema = z.object({
  studyId: z.string(),
  title: z.string().min(2, 'Title is required'),
  sponsor: z.object({
    name: z.string().min(2, 'Sponsor name is required'),
    contactPerson: z.object({
      firstName: z.string().min(2, 'First name is required'),
      lastName: z.string().min(2, 'Last name is required'),
      email: z.string().email('Invalid email'),
      phone: z.string().optional()
    })
  }),
  phase: z.enum(['PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4', 'NOT_APPLICABLE']),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'SUSPENDED', 'TERMINATED']),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().min(10, 'Description is required'),
  sites: z.array(z.object({
    id: z.string(),
    name: z.string(),
    siteId: z.string(),
    department: z.string(),
    departmentId: z.string(),
    type: z.string(),
    location: z.string(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      zipCode: z.string().optional()
    }).optional()
  })).default([]),
  team: z.array(z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    email: z.string()
  })).default([])
});

// Mock data for sites and users
  const availableSites = [
    {
      id: '1',
      name: 'Mayo Clinic',
    campusName: 'Rochester Campus',
      type: 'Hospital',
    country: 'USA',
    state: 'MN',
    city: 'Rochester',
      address: {
        street: '200 First St. SW',
        city: 'Rochester',
        state: 'MN',
        country: 'USA',
        zipCode: '55905'
    },
    departments: [
      {
        id: 'DEPT001',
        name: 'Neurology Department',
        address: 'Floor 3, East Wing',
        contact: {
          phone: '+1 507-284-2511',
          email: 'neurology@mayo.edu'
        }
      }
    ]
    },
    {
      id: '2',
      name: 'Johns Hopkins Hospital',
    campusName: 'Main Campus',
      type: 'Research Center',
    country: 'USA',
    state: 'MD',
    city: 'Baltimore',
      address: {
        street: '1800 Orleans St',
        city: 'Baltimore',
        state: 'MD',
        country: 'USA',
        zipCode: '21287'
    },
    departments: [
      {
        id: 'DEPT002',
        name: 'Cardiology Department',
        address: 'Floor 5, Heart Center',
        contact: {
          phone: '+1 410-955-5000',
          email: 'cardiology@jhmi.edu'
        }
      }
    ]
    },
    {
      id: '3',
      name: 'Cleveland Clinic',
      siteId: 'SITE003',
      type: 'Hospital',
      location: 'Cleveland, OH',
      department: 'Oncology',
      departmentId: 'DEPT003',
      address: {
        street: '9500 Euclid Ave',
        city: 'Cleveland',
        state: 'OH',
        country: 'USA',
        zipCode: '44195'
      }
    }
  ];

  const availableUsers = [
    {
      id: '1',
      name: 'Dr. John Smith',
      role: 'Principal Investigator',
      email: 'john.smith@hospital.com',
      department: 'Neurology'
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      role: 'Sub-Investigator',
      email: 'sarah.johnson@hospital.com',
      department: 'Cardiology'
    },
    {
      id: '3',
      name: 'Dr. Michael Brown',
      role: 'Study Coordinator',
      email: 'michael.brown@hospital.com',
      department: 'Research'
    }
  ];

// Mock study data for testing
const mockStudy = {
  studyId: 'STU-2024-AB123-1',
  sponsorStudyId: 'SP-2024-001',
  title: 'Phase 3 Clinical Trial of New Drug X',
  protocolNumber: 'PROT-2024-001',
  clinicalTrialsGovId: 'NCT12345678',
  studyType: 'INTERVENTIONAL',
  phase: 'PHASE_3',
  status: 'ACTIVE',
  fdaIndSubmissionDate: '2024-01-15',
  fdaIndApprovalDate: '2024-03-01',
  startDate: '2024-04-01',
  estimatedEndDate: '2025-12-31',
  studySummary: 'This is a Phase 3, randomized, double-blind, placebo-controlled study to evaluate the efficacy and safety of New Drug X in patients with condition Y. The study will enroll approximately 500 patients across multiple sites.',
  trialDrug: 'New Drug X',
  sites: [
    {
      id: '1',
      name: 'Mayo Clinic',
      siteId: 'SITE001',
      type: 'Hospital',
      location: 'Rochester, MN',
      department: 'Neurology',
      departmentId: 'DEPT001',
      address: {
        street: '200 First St. SW',
        city: 'Rochester',
        state: 'MN',
        country: 'USA',
        zipCode: '55905'
      }
    }
  ],
  team: [
    {
      id: '1',
      name: 'Dr. John Smith',
      role: 'Principal Investigator',
      email: 'john.smith@hospital.com',
      department: 'Neurology'
    },
    {
      id: '3',
      name: 'Dr. Michael Brown',
      role: 'Study Coordinator',
      email: 'michael.brown@hospital.com',
      department: 'Research'
    }
  ]
};

// Add mockSites, mockCountries, mockRoles at the top (if not already present)
const mockSites = [
  { id: 'SITE001', name: 'Mayo Clinic', country: 'USA' },
  { id: 'SITE002', name: 'Johns Hopkins Hospital', country: 'USA' },
  { id: 'SITE003', name: 'Cleveland Clinic', country: 'USA' },
  { id: 'SITE004', name: 'Charité Berlin', country: 'Germany' },
];
const mockCountries = ['USA', 'Germany'];
const mockRoles = ['Principal Investigator', 'Sub-Investigator', 'Study Coordinator'];

const StudyForm = ({ study, onClose, onStudyCreated }) => {
  const queryClient = useQueryClient();
  const [selectedSites, setSelectedSites] = useState(study?.sites || []);
  const [selectedUsers, setSelectedUsers] = useState(study?.team || []);
  const [showSiteDialog, setShowSiteDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [siteSearchQuery, setSiteSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const filteredSites = availableSites.filter(site =>
    site.name.toLowerCase().includes(siteSearchQuery.toLowerCase()) ||
    site.location.toLowerCase().includes(siteSearchQuery.toLowerCase()) ||
    site.type.toLowerCase().includes(siteSearchQuery.toLowerCase()) ||
    site.department?.toLowerCase().includes(siteSearchQuery.toLowerCase()) ||
    site.departmentId?.toLowerCase().includes(siteSearchQuery.toLowerCase())
  );

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleSiteSelection = (site) => {
    setSelectedSites(prev => {
      const exists = prev.find(s => s.id === site.id);
      if (exists) {
        return prev.filter(s => s.id !== site.id);
      }
      return [...prev, site];
    });
  };

  const handleUserCheckbox = (user) => {
    setSelectedUsers(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (exists) {
        return prev.filter(u => u.id !== user.id);
      }
      return [...prev, { ...user, role: '', siteAssignmentType: 'all', assignedSites: [], assignedCountry: '' }];
    });
  };

  const handleRoleChange = (userId, role) => {
    setSelectedUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  const handleSiteAssignmentTypeChange = (userId, type) => {
    setSelectedUsers(prev => prev.map(u => u.id === userId ? { ...u, siteAssignmentType: type, assignedSites: [], assignedCountry: '' } : u));
  };

  const handleCountryChange = (userId, country) => {
    setSelectedUsers(prev => prev.map(u => u.id === userId ? { ...u, assignedCountry: country, assignedSites: [] } : u));
  };

  const handleSitesChange = (userId, sites) => {
    setSelectedUsers(prev => prev.map(u => u.id === userId ? { ...u, assignedSites: sites } : u));
  };

  const handleSiteDialogClose = () => {
    setShowSiteDialog(false);
    setSiteSearchQuery('');
    form.setValue('sites', selectedSites);
  };

  const handleUserDialogClose = () => {
    setShowUserDialog(false);
    setUserSearchQuery('');
    form.setValue('team', selectedUsers);
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      // TODO: Replace with actual API call
      console.log('Submitting form data:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      return formData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['studies'] });
      if (onStudyCreated) {
        onStudyCreated(data);
      }
      onClose();
    },
    onError: (error) => {
      console.error('Error submitting form:', error);
    }
  });

  const form = useForm({
    resolver: zodResolver(studySchema),
    defaultValues: {
      studyId: study?.studyId || generateStudyId(),
      title: study?.title || '',
      sponsor: study?.sponsor || {
        name: '',
        contactPerson: {
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        }
      },
      phase: study?.phase || 'NOT_APPLICABLE',
      status: study?.status || 'DRAFT',
      startDate: study?.startDate || '',
      endDate: study?.endDate || '',
      description: study?.description || '',
      sites: study?.sites || [],
      team: study?.team || []
    }
  });

  const onSubmit = (data) => {
    const formData = {
      ...data,
      sites: selectedSites,
      team: selectedUsers
    };
    mutation.mutate(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">
            {study ? 'Edit Study' : 'Create New Study'}
          </DialogTitle>
        </DialogHeader>

    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 space-y-8">
                {/* Basic Study Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Study Information</h3>
                  <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studyId"
                render={({ field }) => (
                  <FormItem>
                          <FormLabel>System Generated Study ID</FormLabel>
                    <FormControl>
                            <Input {...field} disabled className="bg-gray-50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sponsorStudyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sponsor Provided Study ID *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter sponsor study ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  </div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                        <FormLabel>Study Title *</FormLabel>
                <FormControl>
                      <Input placeholder="Enter study title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                      name="protocolNumber"
                render={({ field }) => (
                  <FormItem>
                          <FormLabel>Protocol Number *</FormLabel>
                    <FormControl>
                            <Input placeholder="Enter protocol number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                      name="clinicalTrialsGovId"
                render={({ field }) => (
                  <FormItem>
                          <FormLabel>ClinicalTrials.gov ID</FormLabel>
                    <FormControl>
                            <Input placeholder="Enter ClinicalTrials.gov ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  </div>
            </div>

                {/* Study Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Study Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                      name="studyType"
                render={({ field }) => (
                  <FormItem>
                          <FormLabel>Study Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select study type" />
                              </SelectTrigger>
                    </FormControl>
                            <SelectContent>
                              <SelectItem value="INTERVENTIONAL">Interventional Studies</SelectItem>
                              <SelectItem value="OBSERVATIONAL">Observational Studies</SelectItem>
                            </SelectContent>
                          </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phase"
                render={({ field }) => (
                  <FormItem>
                          <FormLabel>Study Phase *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                                <SelectValue placeholder="Select study phase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PHASE_1">Phase 1</SelectItem>
                        <SelectItem value="PHASE_2">Phase 2</SelectItem>
                        <SelectItem value="PHASE_3">Phase 3</SelectItem>
                        <SelectItem value="PHASE_4">Phase 4</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                          <FormLabel>Study Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                                <SelectValue placeholder="Select study status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        <SelectItem value="TERMINATED">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                    <FormField
                      control={form.control}
                      name="trialDrug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trial Drug/Intervention *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter trial drug/intervention" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
            </div>

                {/* Study Dates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Study Dates</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fdaIndSubmissionDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FDA IND Submission Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fdaIndApprovalDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FDA IND Approval Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                          <FormLabel>Study Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                      name="estimatedEndDate"
                render={({ field }) => (
                  <FormItem>
                          <FormLabel>Estimated End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  </div>
            </div>

                {/* Study Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Study Summary</h3>
            <FormField
              control={form.control}
                    name="studySummary"
              render={({ field }) => (
                <FormItem>
                        <FormLabel>Study Summary *</FormLabel>
                  <FormControl>
                        <Textarea 
                            placeholder="Enter study summary"
                          className="min-h-[100px]"
                          {...field} 
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>

                {/* Study Facilities */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Sites</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSiteDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                    Add Sites
                  </Button>
                </div>
                  <div className="border rounded-lg p-4">
                  {selectedSites.length > 0 ? (
                      <div className="space-y-4">
                      {selectedSites.map((site) => (
                          <div
                            key={site.id}
                            className="flex flex-col space-y-3 p-4 bg-gray-50 rounded-md"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-lg">{site.name}</h4>
                                {site.campusName && (
                                  <p className="text-sm text-gray-600">{site.campusName}</p>
                                )}
                                <p className="text-sm text-gray-600">
                                  {site.address.street}, {site.city}, {site.state}, {site.country}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSiteSelection(site)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {site.departments?.map((dept) => (
                              <div key={dept.id} className="ml-4 pl-4 border-l-2 border-gray-200">
                                <h5 className="font-medium">{dept.name}</h5>
                                <p className="text-sm text-gray-600">Location: {dept.address}</p>
                                <div className="text-sm text-gray-600">
                                  <p>Phone: {dept.contact.phone}</p>
                                  <p>Email: {dept.contact.email}</p>
                            </div>
                          </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                      <p className="text-gray-500 text-center py-4">No sites selected</p>
                  )}
                </div>
              </div>

                {/* Team Members */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowUserDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                    Assign Users
                  </Button>
                </div>
                  <div className="border rounded-lg p-4">
                  {selectedUsers.length > 0 ? (
                    <div className="space-y-4">
                      {selectedUsers.map((user) => (
                        <div key={user.id} className="border rounded p-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-auto"
                              onClick={() => handleUserCheckbox(user)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="mt-2 space-y-2">
                            <div className="flex gap-2 items-center">
                              <span>Role:</span>
                              <Select value={user.role || ''} onValueChange={val => handleRoleChange(user.id, val)}>
                                <SelectTrigger className="w-56">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockRoles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                      <p className="text-gray-500 text-center py-4">No users assigned</p>
                  )}
                </div>
              </div>
          </div>
        </div>

            <div className="flex-shrink-0 border-t px-6 py-4 bg-white">
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Study'
                  )}
                </Button>
            </div>
          </div>
        </form>
        </Form>
      </DialogContent>

      {/* Site Selection Dialog */}
      <Dialog open={showSiteDialog} onOpenChange={setShowSiteDialog}>
        <DialogContent className="max-w-3xl h-[80vh] p-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle>Select Sites</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="mb-4">
              <Input
                placeholder="Search sites..."
                value={siteSearchQuery}
                onChange={e => setSiteSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-4">
              {filteredSites.length > 0 ? (
                filteredSites.map(site => (
                  <div key={site.id} className="flex items-center border rounded-lg p-4 bg-gray-50">
                    <Checkbox
                      checked={!!selectedSites.find(s => s.id === site.id)}
                      onCheckedChange={() => handleSiteSelection(site)}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-lg">{site.name}</div>
                      {site.campusName && <div className="text-sm text-gray-600">{site.campusName}</div>}
                      <div className="text-sm text-gray-600">
                        {site.address.street}, {site.address.city}, {site.address.state}, {site.address.country}
                  </div>
                      {site.departments?.map(dept => (
                        <div key={dept.id} className="ml-4 pl-4 border-l-2 border-gray-200 mt-2">
                          <div className="font-medium">{dept.name}</div>
                          <div className="text-sm text-gray-600">Location: {dept.address}</div>
                          <div className="text-sm text-gray-600">Phone: {dept.contact.phone}</div>
                          <div className="text-sm text-gray-600">Email: {dept.contact.email}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">No sites found</div>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 border-t px-6 py-4 flex justify-end gap-3 bg-white">
            <Button variant="outline" onClick={() => setShowSiteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSiteDialogClose}>
              Save Selection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Assignment Dialog (for picking users) */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-3xl h-[80vh] p-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle>Assign Users</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="mb-4">
              <Input
                placeholder="Search users..."
                value={userSearchQuery}
                onChange={e => setUserSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div key={user.id} className="flex items-center border rounded-lg p-4 bg-gray-50">
                    <Checkbox
                      checked={!!selectedUsers.find(u => u.id === user.id)}
                      onCheckedChange={() => handleUserCheckbox(user)}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-lg">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.role}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-sm text-gray-600">{user.department}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">No users found</div>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 border-t px-6 py-4 flex justify-end gap-3 bg-white">
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUserDialogClose}>
              Save Selection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default StudyForm; 