import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit2, Trash2, Mail, UserPlus, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import sponsorService from '../services/sponsor.service';

const SponsorManagement = () => {
  const [open, setOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'PENDING_APPROVAL',
    contactInfo: {
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      },
      phone: '',
      email: '',
      website: ''
    },
    regulatoryInfo: {
      dunsNumber: '',
      feiNumber: '',
      gcpComplianceStatus: 'PENDING_REVIEW',
      certifications: []
    },
    contacts: [],
    pendingInvites: []
  });

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('SPONSOR_ADMIN');
  const { toast } = useToast();

  const sponsorTypes = [
    'PHARMACEUTICAL',
    'MEDICAL_DEVICE',
    'BIOTECHNOLOGY',
    'CRO',
    'ACADEMIC',
    'OTHER'
  ];

  const sponsorStatuses = ['ACTIVE', 'INACTIVE', 'PENDING_APPROVAL'];
  const adminRoles = ['SPONSOR_ADMIN', 'SPONSOR_MONITOR', 'SPONSOR_CRA'];
  const gcpComplianceStatuses = ['COMPLIANT', 'NON_COMPLIANT', 'PENDING_REVIEW'];

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const response = await sponsorService.getSponsors();
      setSponsors(response.data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch sponsors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (sponsor = null) => {
    if (sponsor) {
      setEditingSponsor(sponsor);
      setFormData(sponsor);
    } else {
      setEditingSponsor(null);
      setFormData({
        name: '',
        type: '',
        status: 'PENDING_APPROVAL',
        contactInfo: {
          address: {
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: ''
          },
          phone: '',
          email: '',
          website: ''
        },
        regulatoryInfo: {
          dunsNumber: '',
          feiNumber: '',
          gcpComplianceStatus: 'PENDING_REVIEW',
          certifications: []
        },
        contacts: [],
        pendingInvites: []
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSponsor(null);
    setInviteEmail('');
    setInviteRole('SPONSOR_ADMIN');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        address: {
          ...prev.contactInfo.address,
          [name]: value
        }
      }
    }));
  };

  const handleSendInvite = async () => {
    if (!inviteEmail || !inviteRole) {
      toast({
        title: "Error",
        description: "Please provide both email and role",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await sponsorService.sendInvitation(editingSponsor._id, {
        email: inviteEmail,
        role: inviteRole
      });

      setFormData(prev => ({
        ...prev,
        pendingInvites: [...(prev.pendingInvites || []), response.data]
      }));

      toast({
        title: "Success",
        description: `Invitation sent to ${inviteEmail}`
      });

      setInviteEmail('');
      setInviteRole('SPONSOR_ADMIN');
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to send invitation",
        variant: "destructive"
      });
    }
  };

  const handleRemoveInvite = async (inviteId) => {
    try {
      await sponsorService.removeInvitation(editingSponsor._id, inviteId);
      setFormData(prev => ({
        ...prev,
        pendingInvites: prev.pendingInvites.filter(invite => invite._id !== inviteId)
      }));
      toast({
        title: "Success",
        description: "Invitation removed successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to remove invitation",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Transform the data to match backend requirements exactly
      const transformedData = {
        name: formData.name.trim(),
        type: formData.type,
        status: formData.status,
        contactInfo: {
          email: formData.contactInfo.email.trim(),
          phone: formData.contactInfo.phone.trim(),
          website: formData.contactInfo.website?.trim() || undefined,
          address: {
            street: formData.contactInfo.address.street.trim(),
            city: formData.contactInfo.address.city.trim(),
            state: formData.contactInfo.address.state.trim(),
            country: formData.contactInfo.address.country.trim(),
            postalCode: formData.contactInfo.address.postalCode.trim()
          }
        },
        regulatoryInfo: {
          dunsNumber: formData.regulatoryInfo.dunsNumber.replace(/\D/g, '').slice(0, 9),
          feiNumber: formData.regulatoryInfo.feiNumber.replace(/\D/g, '').slice(0, 10),
          gcpComplianceStatus: formData.regulatoryInfo.gcpComplianceStatus || 'PENDING_REVIEW',
          certifications: formData.regulatoryInfo.certifications || []
        },
        contacts: formData.contacts || [],
        pendingInvites: formData.pendingInvites || []
      };

      // Remove undefined and empty values
      const cleanData = JSON.parse(JSON.stringify(transformedData, (key, value) => {
        if (value === '' || value === null || value === undefined) {
          return undefined;
        }
        return value;
      }));

      if (editingSponsor) {
        const response = await sponsorService.updateSponsor(editingSponsor._id, cleanData);
        setSponsors(sponsors.map(sponsor => 
          sponsor._id === editingSponsor._id ? response.data : sponsor
        ));
        toast({
          title: "Success",
          description: "Sponsor updated successfully"
        });
      } else {
        const response = await sponsorService.createSponsor(cleanData);
        setSponsors([...sponsors, response.data]);
        toast({
          title: "Success",
          description: "Sponsor created successfully"
        });
      }
      handleClose();
    } catch (error) {
      console.error('Validation Error:', error.response?.data);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to save sponsor",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (sponsorId) => {
    if (window.confirm('Are you sure you want to delete this sponsor?')) {
      try {
        await sponsorService.deleteSponsor(sponsorId);
        setSponsors(sponsors.filter(sponsor => sponsor._id !== sponsorId));
        toast({
          title: "Success",
          description: "Sponsor deleted successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to delete sponsor",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => handleOpen()} size="lg" className="shadow-sm">
          <Plus className="h-5 w-5 mr-2" />
          Add New Sponsor
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Compliance Status</TableHead>
                <TableHead>Pending Invites</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sponsors.map((sponsor) => (
                <TableRow key={sponsor._id}>
                  <TableCell>{sponsor.name}</TableCell>
                  <TableCell>{sponsor.type}</TableCell>
                  <TableCell>{sponsor.status}</TableCell>
                  <TableCell>{sponsor.contactInfo?.email}</TableCell>
                  <TableCell>{sponsor.regulatoryInfo?.gcpComplianceStatus}</TableCell>
                  <TableCell>
                    {sponsor.pendingInvites?.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>{sponsor.pendingInvites.length} pending</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">No pending invites</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpen(sponsor)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(sponsor._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}</DialogTitle>
            <DialogDescription>
              {editingSponsor ? 'Update sponsor information' : 'Create a new sponsor organization'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sponsorTypes.map(type => (
                      <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="contactInfo.email"
                    type="email"
                    value={formData.contactInfo?.email || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="contactInfo.phone"
                    value={formData.contactInfo?.phone || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="contactInfo.website"
                  value={formData.contactInfo?.website || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.contactInfo?.address?.street || ''}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.contactInfo?.address?.city || ''}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.contactInfo?.address?.state || ''}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.contactInfo?.address?.country || ''}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.contactInfo?.address?.postalCode || ''}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Regulatory Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dunsNumber">DUNS Number</Label>
                  <Input
                    id="dunsNumber"
                    name="regulatoryInfo.dunsNumber"
                    value={formData.regulatoryInfo?.dunsNumber || ''}
                    onChange={handleInputChange}
                    placeholder="9 digits"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feiNumber">FEI Number</Label>
                  <Input
                    id="feiNumber"
                    name="regulatoryInfo.feiNumber"
                    value={formData.regulatoryInfo?.feiNumber || ''}
                    onChange={handleInputChange}
                    placeholder="10 digits"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GCP Compliance Status</Label>
                  <Select
                    value={formData.regulatoryInfo?.gcpComplianceStatus || 'PENDING_REVIEW'}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      regulatoryInfo: {
                        ...prev.regulatoryInfo,
                        gcpComplianceStatus: value
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {gcpComplianceStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Team Management</h3>
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inviteEmail">Email Address *</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role *</Label>
                    <Select
                      value={inviteRole}
                      onValueChange={setInviteRole}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {adminRoles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleSendInvite}
                  className="w-full md:w-auto"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>

                {formData.pendingInvites?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Pending Invitations</h4>
                    <div className="space-y-2">
                      {formData.pendingInvites.map((invite) => (
                        <div
                          key={invite.id}
                          className="flex items-center justify-between p-2 bg-white rounded-md border"
                        >
                          <div>
                            <p className="font-medium">{invite.email}</p>
                            <p className="text-sm text-gray-500">{invite.role}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveInvite(invite.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {sponsorStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSponsor ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorManagement; 