import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Phone, Mail, Building2, MapPin, User2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserForm from "@/pages/admin/users/UserForm";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  studyId: z.string({
    required_error: "Please select a study",
  }),
  facilityId: z.string({
    required_error: "Please select a facility",
  }),
  principalInvestigatorId: z.string({
    required_error: "Please select a principal investigator",
  }),
  confirmFacilityDetails: z.boolean().optional(),
  confirmUserDetails: z.boolean().optional(),
});

// Schema for new facility - matching the facility schema from StudyForm
const facilitySchema = z.object({
  name: z.string().min(1, "Facility name is required"),
  campusName: z.string().optional(),
  address: z.string().min(1, "Facility address is required"),
  department: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    contact: z.object({
      phone: z.string().optional(),
      email: z.string().email("Invalid email address").optional(),
    }).optional(),
  }).optional(),
});

const SiteAssignmentForm = ({ studies, facilities, users, onSubmit, onCancel }) => {
  const [showNewFacilityDialog, setShowNewFacilityDialog] = useState(false);
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [isSearchingNPI, setIsSearchingNPI] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studyId: "",
      facilityId: "",
      principalInvestigatorId: "",
      confirmFacilityDetails: false,
      confirmUserDetails: false,
    },
  });

  const facilityForm = useForm({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: "",
      campusName: "",
      address: "",
      department: {
        name: "",
        address: "",
        contact: {
          phone: "",
          email: "",
        },
      },
    },
  });

  const handleSubmit = (data) => {
    onSubmit(data);
  };

  const handleNewFacilitySubmit = (data) => {
    // Here you would typically make an API call to create a new facility
    console.log('New facility data:', data);
    setShowNewFacilityDialog(false);
    facilityForm.reset();
  };

  const searchNPI = async (npi) => {
    setIsSearchingNPI(true);
    try {
      const response = await fetch(
        `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${npi}&pretty=true`
      );
      const data = await response.json();

      if (data.result_count > 0) {
        const result = data.results[0];
        const addresses = result.addresses[0];
        
        facilityForm.setValue('name', result.basic.organization_name || '');
        facilityForm.setValue('address', [
          addresses.address_1,
          addresses.address_2,
          `${addresses.city}, ${addresses.state} ${addresses.postal_code}`
        ].filter(Boolean).join(', '));

        // Set other fields if available
        if (result.taxonomies && result.taxonomies[0]) {
          facilityForm.setValue('department.name', result.taxonomies[0].desc || '');
        }

        toast({
          title: "Facility Found",
          description: "Facility information has been auto-filled from NPI Registry.",
        });
      } else {
        toast({
          title: "No Results",
          description: "No facility found with the provided NPI number.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch facility information: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSearchingNPI(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Study Selection */}
          <FormField
            control={form.control}
            name="studyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Study *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a study" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {studies.map((study) => (
                      <SelectItem key={study.id} value={study.id}>
                        {study.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Facility Selection with Add New Option */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel>Facility *</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNewFacilityDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Facility
              </Button>
            </div>
            <FormField
              control={form.control}
              name="facilityId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a facility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Facility Details */}
          {form.watch("facilityId") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Facility Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {facilities.find(f => f.id === form.watch("facilityId")) && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Building2 className="h-4 w-4 mr-2" />
                            <span>Name:</span>
                          </div>
                          <div className="font-medium">
                            {facilities.find(f => f.id === form.watch("facilityId"))?.name}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>Location:</span>
                          </div>
                          <div className="font-medium">
                            {facilities.find(f => f.id === form.watch("facilityId"))?.location}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>Phone:</span>
                          </div>
                          <div className="font-medium">
                            {facilities.find(f => f.id === form.watch("facilityId"))?.contact.phone}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>Email:</span>
                          </div>
                          <div className="font-medium">
                            {facilities.find(f => f.id === form.watch("facilityId"))?.contact.email}
                          </div>
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name="confirmFacilityDetails"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm">
                              I confirm that the facility details are correct
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Principal Investigator Selection with Add New Option */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel>Principal Investigator *</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNewUserDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </div>
            <FormField
              control={form.control}
              name="principalInvestigatorId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a principal investigator" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* PI Details */}
          {form.watch("principalInvestigatorId") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">PI Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.find(u => u.id === form.watch("principalInvestigatorId")) && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <User2 className="h-4 w-4 mr-2" />
                            <span>Name:</span>
                          </div>
                          <div className="font-medium">
                            {users.find(u => u.id === form.watch("principalInvestigatorId"))?.name}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Building2 className="h-4 w-4 mr-2" />
                            <span>Role:</span>
                          </div>
                          <div className="font-medium">
                            {users.find(u => u.id === form.watch("principalInvestigatorId"))?.role}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>Phone:</span>
                          </div>
                          <div className="font-medium">
                            {users.find(u => u.id === form.watch("principalInvestigatorId"))?.phone}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>Email:</span>
                          </div>
                          <div className="font-medium">
                            {users.find(u => u.id === form.watch("principalInvestigatorId"))?.email}
                          </div>
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name="confirmUserDetails"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm">
                              I confirm that the PI details are correct
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Create Site</Button>
          </div>
        </form>
      </Form>

      {/* New Facility Dialog */}
      <Dialog open={showNewFacilityDialog} onOpenChange={setShowNewFacilityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Facility</DialogTitle>
          </DialogHeader>
          <Form {...facilityForm}>
            <form onSubmit={facilityForm.handleSubmit(handleNewFacilitySubmit)} className="space-y-4">
              {/* NPI Search Field */}
              <div className="flex gap-2">
                <FormField
                  control={facilityForm.control}
                  name="npi"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>NPI Number</FormLabel>
                      <FormDescription>
                        Enter the facility's NPI number to auto-fill information
                      </FormDescription>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Enter NPI number" {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => searchNPI(field.value)}
                          disabled={!field.value || isSearchingNPI}
                        >
                          {isSearchingNPI ? (
                            <span className="animate-spin">⌛</span>
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Existing facility form fields */}
              <FormField
                control={facilityForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter facility name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={facilityForm.control}
                name="campusName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Campus Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter campus name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={facilityForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter facility address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h4 className="font-medium">Department Information</h4>
                <FormField
                  control={facilityForm.control}
                  name="department.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter department name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={facilityForm.control}
                  name="department.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter department address (floor/wing)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={facilityForm.control}
                    name="department.contact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={facilityForm.control}
                    name="department.contact.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setShowNewFacilityDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Facility</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* New User Dialog */}
      <Dialog open={showNewUserDialog} onOpenChange={setShowNewUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <UserForm onClose={() => setShowNewUserDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SiteAssignmentForm; 