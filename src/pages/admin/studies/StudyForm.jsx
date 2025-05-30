import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { X, Plus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { studyService } from '@/services/studyService';

// Helper Functions
const generateStudyId = () => {
  const year = new Date().getFullYear();
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = letters[Math.floor(Math.random() * letters.length)] + 
                       letters[Math.floor(Math.random() * letters.length)];
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const sequence = Math.floor(Math.random() * 9) + 1; // 1-9
  return `STU-${year}-${randomLetters}${randomNum}-${sequence}`;
};

// Constants
const STUDY_PHASES = ['PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4', 'NOT_APPLICABLE'];
const STUDY_STATUSES = ['DRAFT', 'ACTIVE', 'COMPLETED', 'SUSPENDED', 'TERMINATED'];
const STUDY_TYPES = ['INTERVENTIONAL', 'OBSERVATIONAL'];
const USER_ROLES = ['Principal Investigator', 'Sub-Investigator', 'Study Coordinator'];

// Schema
const studySchema = z.object({
  studyId: z.string(),
  sponsorStudyId: z.string().min(1, 'Sponsor Study ID is required'),
  title: z.string().min(2, 'Title is required'),
  protocolNumber: z.string().min(1, 'Protocol Number is required'),
  clinicalTrialsGovId: z.string().optional(),
  studyType: z.enum(['INTERVENTIONAL', 'OBSERVATIONAL']),
  phase: z.enum(['PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4', 'NOT_APPLICABLE']),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'SUSPENDED', 'TERMINATED']),
  trialDrug: z.string().min(1, 'Trial Drug is required'),
  fdaIndSubmissionDate: z.string().min(1, 'FDA IND Submission Date is required'),
  fdaIndApprovalDate: z.string().min(1, 'FDA IND Approval Date is required'),
  startDate: z.string().min(1, 'Start Date is required'),
  estimatedEndDate: z.string().optional(),
  studySummary: z.string().min(10, 'Study Summary is required'),
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

// Helper Components
const FormSection = ({ title, children }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
);

const SiteSelectionDialog = ({ open, onClose, sites, selectedSites, onSiteSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Select Sites</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Input
            placeholder="Search sites..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-4">
            {filteredSites.map(site => (
              <div key={site.id} className="flex items-center border rounded-lg p-4">
                <Checkbox
                  checked={selectedSites.some(s => s.id === site.id)}
                  onCheckedChange={() => onSiteSelect(site)}
                  className="mr-4"
                />
                <div>
                  <div className="font-medium">{site.name}</div>
                  <div className="text-sm text-gray-600">{site.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Save Selection</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserSelectionDialog = ({ open, onClose, users, selectedUsers, onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Assign Users</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-4">
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center border rounded-lg p-4">
                <Checkbox
                  checked={selectedUsers.some(u => u.id === user.id)}
                  onCheckedChange={() => onUserSelect(user)}
                  className="mr-4"
                />
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-sm text-gray-600">{user.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Save Selection</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
const STEPS = [
  { key: 'basic', label: 'Basic Information' },
  { key: 'details', label: 'Study Details' },
  { key: 'sites', label: 'Sites & Team' },
];

const StudyForm = ({ study, onClose, onStudyCreated }) => {
  const queryClient = useQueryClient();
  const [selectedSites, setSelectedSites] = useState(study?.sites || []);
  const [selectedUsers, setSelectedUsers] = useState(study?.team || []);
  const [showSiteDialog, setShowSiteDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Fetch available sites
  const { data: availableSites = [] } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const response = await fetch('/api/sites');
      if (!response.ok) {
        throw new Error('Failed to fetch sites');
      }
      return response.json();
    }
  });

  // Fetch available users
  const { data: availableUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    }
  });

  const form = useForm({
    resolver: zodResolver(studySchema),
    defaultValues: {
      studyId: study?.studyId || generateStudyId(),
      sponsorStudyId: study?.sponsorStudyId || '',
      title: study?.title || '',
      protocolNumber: study?.protocolNumber || '',
      clinicalTrialsGovId: study?.clinicalTrialsGovId || '',
      studyType: study?.studyType || 'INTERVENTIONAL',
      phase: study?.phase || 'NOT_APPLICABLE',
      status: study?.status || 'DRAFT',
      trialDrug: study?.trialDrug || '',
      fdaIndSubmissionDate: study?.fdaIndSubmissionDate ? new Date(study.fdaIndSubmissionDate).toISOString().split('T')[0] : '',
      fdaIndApprovalDate: study?.fdaIndApprovalDate ? new Date(study.fdaIndApprovalDate).toISOString().split('T')[0] : '',
      startDate: study?.startDate ? new Date(study.startDate).toISOString().split('T')[0] : '',
      estimatedEndDate: study?.estimatedEndDate ? new Date(study.estimatedEndDate).toISOString().split('T')[0] : '',
      studySummary: study?.studySummary || '',
      sites: study?.sites || [],
      team: study?.team || []
    }
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (study) {
        // Update existing study
        return studyService.updateStudy(study.studyId, formData);
      } else {
        // Create new study
        return studyService.createStudy(formData);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['studies'] });
      if (onStudyCreated) {
        onStudyCreated(data.data);
      }
      onClose();
    },
    onError: (error) => {
      console.error('Error submitting form:', error);
      // You might want to show an error toast/notification here
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

  const handleSiteSelect = (site) => {
    setSelectedSites(prev => {
      const exists = prev.find(s => s.id === site.id);
      if (exists) {
        return prev.filter(s => s.id !== site.id);
      }
      return [...prev, site];
    });
  };

  const handleUserSelect = (user) => {
    setSelectedUsers(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (exists) {
        return prev.filter(u => u.id !== user.id);
      }
      return [...prev, { ...user, role: '' }];
    });
  };

  const handleRoleChange = (userId, role) => {
    setSelectedUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  // Stepper navigation
  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-screen h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            {study ? 'Edit Study' : 'Create New Study'}
          </DialogTitle>
        </DialogHeader>

    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex flex-1 min-h-0 overflow-y-auto p-6 max-h-[calc(90vh-140px)]">
              {/* Stepper (left) */}
              <div className="w-56 pr-8 border-r flex flex-col items-start">
                {STEPS.map((step, idx) => (
                  <div
                    key={step.key}
                    className={cn(
                      "flex items-center mb-6 cursor-pointer group",
                      idx === currentStep ? "font-bold text-primary" : "text-gray-500"
                    )}
                    onClick={() => setCurrentStep(idx)}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center border mr-3",
                      idx === currentStep ? "bg-primary text-white border-primary" : "bg-white border-gray-300 group-hover:border-primary"
                    )}>
                      {idx + 1}
                    </div>
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
              {/* Step Content (right) */}
              <div className="flex-1 min-h-0">
                {currentStep === 0 && (
                  <div className="space-y-6 min-h-0">
                    <FormSection title="Basic Information">
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
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sponsorStudyId"
                      render={({ field }) => (
                        <FormItem>
                              <FormLabel>Sponsor Study ID *</FormLabel>
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
                    </FormSection>
            </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-6 min-h-0">
                    <FormSection title="Study Details">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="studyType"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Study Type *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "INTERVENTIONAL"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select study type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STUDY_TYPES.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.replace('_', ' ')}
                          </SelectItem>
                        ))}
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
                  <FormItem className="min-w-0">
                    <FormLabel>Study Phase *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "NOT_APPLICABLE"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select study phase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STUDY_PHASES.map(phase => (
                          <SelectItem key={phase} value={phase}>
                            {phase.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Study Status *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "DRAFT"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select study status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STUDY_STATUSES.map(status => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
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
                            <FormItem className="min-w-0">
                          <FormLabel>Trial Drug/Intervention *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter trial drug/intervention" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                    </FormSection>
                    <FormSection title="Study Dates">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fdaIndSubmissionDate"
                      render={({ field }) => (
                            <FormItem className="min-w-0">
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
                            <FormItem className="min-w-0">
                          <FormLabel>FDA IND Approval Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                            <FormItem className="min-w-0">
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
                            <FormItem className="min-w-0">
                          <FormLabel>Estimated End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  </div>
                    </FormSection>
                    <FormSection title="Study Summary">
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
                    </FormSection>
              </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-6 min-h-0">
                    <FormSection title="Study Sites">
                      <div className="flex justify-end mb-4">
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
                      <div className="space-y-4">
                        {selectedSites.map(site => (
                          <div key={site.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                              <div className="font-medium">{site.name}</div>
                              <div className="text-sm text-gray-600">{site.location}</div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                              onClick={() => handleSiteSelect(site)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                          </div>
                            ))}
                        </div>
                    </FormSection>
                    <FormSection title="Study Team">
                      <div className="flex justify-end mb-4">
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
                    <div className="space-y-4">
                        {selectedUsers.map(user => (
                          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                              <Select
                                value={user.role}
                                onValueChange={(value) => handleRoleChange(user.id, value)}
                              >
                                <SelectTrigger className="w-48 mt-2">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {USER_ROLES.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUserSelect(user)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                        </div>
                      ))}
                    </div>
                    </FormSection>
                  </div>
                  )}
                </div>
            </div>
            {/* Navigation Buttons */}
            <div className="flex justify-between gap-3 p-4 border-t bg-white">
              <div>
                {currentStep > 0 && (
                  <Button type="button" variant="outline" onClick={goBack}>
                    Back
                  </Button>
                )}
              </div>
              <div>
                {currentStep < STEPS.length - 1 ? (
                  <Button type="button" onClick={goNext}>
                    Next
                </Button>
                ) : (
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
                )}
                <Button type="button" variant="outline" onClick={onClose} className="ml-2">
                  Cancel
                </Button>
              </div>
            </div>
        </form>
        </Form>

        <SiteSelectionDialog
          open={showSiteDialog}
          onClose={() => setShowSiteDialog(false)}
          sites={availableSites}
          selectedSites={selectedSites}
          onSiteSelect={handleSiteSelect}
        />

        <UserSelectionDialog
          open={showUserDialog}
          onClose={() => setShowUserDialog(false)}
          users={availableUsers}
          selectedUsers={selectedUsers}
          onUserSelect={handleUserSelect}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StudyForm; 