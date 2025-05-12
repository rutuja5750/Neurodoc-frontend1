import React, { useState, useRef } from 'react';
import { generateStudyId, isValidStudyId } from '@/utils/idGenerator';
import { toast } from "@/components/ui/use-toast";
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Plus, Pencil, Trash2, Search, Filter,
  Download, FileText, Calendar, Eye, Building2, FlaskConical, MapPin, FolderX, Users
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import StudyForm from './StudyForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// Dummy data for studies
const dummyStudies = [
  {
    _id: "507f1f77bcf86cd799439011",
    studyId: "STU-2024-AB123-3",
    title: "Phase 3 Clinical Trial of Drug X for Advanced Non-Small Cell Lung Cancer",
    sponsor: {
      name: "Pharma Corp International",
      contactPerson: {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@pharmaco.com",
        phone: "+1-555-0123"
      }
    },
    phase: "PHASE_3",
    status: "ACTIVE",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    description: "A randomized, double-blind, placebo-controlled study to evaluate the efficacy and safety of Drug X in patients with advanced non-small cell lung cancer who have progressed on first-line therapy.",
    sites: [
      {
        id: 'SITE001',
        name: 'Mayo Clinic',
        siteId: 'SITE001',
        department: 'Oncology',
        departmentId: 'DEPT001',
        type: 'Hospital',
        location: 'Rochester, MN',
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
        email: 'john.smith@hospital.com'
      },
      {
        id: '2',
        name: 'Dr. Sarah Johnson',
        role: 'Sub-Investigator',
        email: 'sarah.johnson@hospital.com'
      }
    ]
  },
  {
    _id: "507f1f77bcf86cd799439012",
    studyId: "STU-2024-XY456-2",
    title: "Safety and Efficacy Study of Treatment Y for Early-Stage Alzheimer's Disease",
    sponsor: {
      name: "BioTech Innovations Inc",
      contactPerson: {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.j@biotech.com",
        phone: "+1-555-0124"
      }
    },
    phase: "PHASE_2",
    status: "DRAFT",
    startDate: "2024-03-01",
    endDate: "2024-12-31",
    description: "A phase 2 study investigating the safety and efficacy of Treatment Y in patients with early-stage Alzheimer's disease, focusing on cognitive improvement and disease progression markers.",
    sites: [],
    team: [
      {
        id: '3',
        name: 'Dr. Michael Brown',
        role: 'Study Coordinator',
        email: 'michael.brown@hospital.com'
      }
    ]
  },
  {
    _id: "507f1f77bcf86cd799439013",
    studyId: "STU-2023-PQ789-4",
    title: "Long-term Safety Follow-up Study of CardioMed for Chronic Heart Failure",
    sponsor: {
      name: "Global Research Labs",
      contactPerson: {
        firstName: "Michael",
        lastName: "Brown",
        email: "m.brown@labs.com",
        phone: "+1-555-0125"
      }
    },
    phase: "PHASE_4",
    status: "COMPLETED",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    description: "A post-marketing surveillance study to evaluate the long-term safety and effectiveness of CardioMed in patients with chronic heart failure in real-world clinical practice.",
    sites: [],
    team: []
  },
  {
    _id: "507f1f77bcf86cd799439014",
    studyId: "STU-2024-MN321-1",
    title: "First-in-Human Study of Novel Immunotherapy for Advanced Melanoma",
    sponsor: {
      name: "Immuno Therapeutics Ltd",
      contactPerson: {
        firstName: "David",
        lastName: "Lee",
        email: "d.lee@immunoth.com",
        phone: "+1-555-0126"
      }
    },
    phase: "PHASE_1",
    status: "ACTIVE",
    startDate: "2024-02-15",
    endDate: "2025-06-30",
    description: "A first-in-human, dose-escalation study to evaluate the safety, tolerability, and preliminary efficacy of a novel immunotherapy agent in patients with advanced melanoma.",
    sites: [],
    team: []
  }
];

const StudyManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    phase: null,
    status: null,
    therapeuticArea: null,
    startDate: '',
    endDate: '',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [view, setView] = useState('table'); // 'table' or 'grid'
  const [studies, setStudies] = useState(dummyStudies);
  const fileInputRef = useRef(null);
  const [showFacilitiesDialog, setShowFacilitiesDialog] = useState(false);
  const [showUsersDialog, setShowUsersDialog] = useState(false);

  // Filter options
  const phases = ['PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4', 'NOT_APPLICABLE'];
  const statuses = ['DRAFT', 'ACTIVE', 'COMPLETED', 'SUSPENDED', 'TERMINATED'];
  const therapeuticAreas = ['Oncology', 'Neurology', 'Cardiology', 'Immunology'];

  const filteredStudies = studies.filter(study => {
    const matchesSearch = !searchQuery || 
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.studyId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPhase = !filters.phase || study.phase === filters.phase;
    const matchesStatus = !filters.status || study.status === filters.status;

    return matchesSearch && matchesPhase && matchesStatus;
  });

  const handleEdit = (study) => {
    setSelectedStudy(study);
    setIsFormOpen(true);
  };

  const handleDelete = (studyId) => {
    if (window.confirm('Are you sure you want to delete this study?')) {
      console.log('Deleting study:', studyId);
    }
  };

  const handleCreateStudy = async (data) => {
    try {
      // Study ID is already generated in the form
      const newStudy = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add validation
      if (!isValidStudyId(data.studyId)) {
        throw new Error('Invalid study ID format');
      }

      // Add to studies
      setStudies(prev => [...prev, newStudy]);
      
      // Close dialog and show success message
      setIsFormOpen(false);
      toast({
        title: "Study Created",
        description: `Study ${data.studyId} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleImportStudies = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const importedStudies = results.data.map(row => ({
            ...row,
            _id: generateStudyId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));

          setStudies(prevStudies => [...prevStudies, ...importedStudies]);
          toast({
            title: "Success",
            description: `Successfully imported ${importedStudies.length} studies.`,
          });
        } catch (err) {
          toast({
            title: "Error",
            description: `Failed to import studies: ${err.message}`,
            variant: "destructive",
          });
        }
      },
      error: (error) => {
        toast({
          title: "Error",
          description: `Failed to parse CSV file: ${error.message}`,
          variant: "destructive",
        });
      }
    });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImportStudies(file);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Enhanced Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Management</h1>
          <p className="text-gray-500 mt-1">Manage and monitor your clinical studies</p>
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Studies
          </Button>
          <Button 
            onClick={() => setView(view === 'table' ? 'grid' : 'table')} 
            variant="outline"
            className="hover:bg-gray-50"
          >
            {view === 'table' ? 'Grid View' : 'Table View'}
          </Button>
          <Button 
            onClick={() => {/* Handle export */}} 
            variant="outline"
            className="hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => {
              setSelectedStudy(null);
              setIsFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Study
          </Button>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Search and Filters</h2>
          <Button
            variant="ghost"
            onClick={() => setFilters({
              phase: null,
              status: null,
              therapeuticArea: null,
              startDate: '',
              endDate: '',
            })}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear All Filters
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="col-span-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search studies by ID or title..."
                className="pl-10 bg-gray-50 border-gray-200 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Phase Filter */}
          <Select
            value={filters.phase}
            onValueChange={(value) => setFilters(prev => ({ ...prev, phase: value }))}
          >
            <SelectTrigger className="w-full bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select Phase" />
            </SelectTrigger>
            <SelectContent>
              {phases.map(phase => (
                <SelectItem key={phase} value={phase}>
                  {phase.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-full bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Therapeutic Area Filter */}
          <Select
            value={filters.therapeuticArea}
            onValueChange={(value) => setFilters(prev => ({ ...prev, therapeuticArea: value }))}
          >
            <SelectTrigger className="w-full bg-gray-50 border-gray-200">
              <SelectValue placeholder="Therapeutic Area" />
            </SelectTrigger>
            <SelectContent>
              {therapeuticAreas.map(area => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range */}
          <div className="flex gap-2 items-center">
            <Input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="flex-1 bg-gray-50 border-gray-200"
            />
            <span className="text-gray-400">to</span>
            <Input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="flex-1 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Studies List */}
      {view === 'table' ? (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Study ID</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Sponsor</TableHead>
                <TableHead className="font-semibold">Phase</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Facilities</TableHead>
                <TableHead className="font-semibold">Team</TableHead>
                <TableHead className="font-semibold">Start Date</TableHead>
                <TableHead className="font-semibold">End Date</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudies.map((study) => (
                <TableRow key={study.studyId} className="hover:bg-gray-50">
                  <TableCell className="font-mono font-medium">{study.studyId}</TableCell>
                  <TableCell className="max-w-md truncate">{study.title}</TableCell>
                  <TableCell>{study.sponsor.name}</TableCell>
                  <TableCell>{study.phase}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      study.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-700' 
                        : study.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-700'
                        : study.status === 'DRAFT'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {study.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-gray-100">
                        {study.sites?.length || 0} Facilities
                      </Badge>
                      {study.sites?.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedStudy(study);
                            setShowFacilitiesDialog(true);
                          }}
                          className="hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-gray-100">
                        {study.team?.length || 0} Team Members
                      </Badge>
                      {study.team?.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedStudy(study);
                            setShowUsersDialog(true);
                          }}
                          className="hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(study.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(study.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleEdit(study)} className="cursor-pointer">
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Study
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(study.studyId)} className="cursor-pointer text-red-600 focus:text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Study
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudies.map((study) => (
            <Card key={study.studyId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{study.studyId}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{study.title}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    study.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-700' 
                      : study.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-700'
                      : study.status === 'DRAFT'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {study.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>{study.sponsor.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FlaskConical className="h-4 w-4 mr-2" />
                    <span>{study.phase}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(study.startDate).toLocaleDateString()} - {new Date(study.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-gray-100">
                      {study.sites?.length || 0} Facilities
                    </Badge>
                    {study.sites?.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStudy(study);
                          setShowFacilitiesDialog(true);
                        }}
                        className="hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-gray-100">
                      {study.team?.length || 0} Team Members
                    </Badge>
                    {study.team?.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStudy(study);
                          setShowUsersDialog(true);
                        }}
                        className="hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(study)}
                    className="hover:bg-gray-50"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(study.studyId)}
                    className="text-red-600 hover:bg-red-50 hover:border-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Dialogs */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] p-0">
          <StudyForm
            study={selectedStudy}
            onClose={() => setIsFormOpen(false)}
            onStudyCreated={handleCreateStudy}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showFacilitiesDialog} onOpenChange={setShowFacilitiesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl">Assigned Facilities</DialogTitle>
            <DialogDescription className="text-gray-500">
              {selectedStudy?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            {selectedStudy?.sites?.length ? selectedStudy.sites.map((site) => (
              <div key={site.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{site.name}</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-white">
                        {site.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{site.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <FolderX className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No facilities assigned to this study yet.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showUsersDialog} onOpenChange={setShowUsersDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl">Assigned Users</DialogTitle>
            <DialogDescription className="text-gray-500">
              {selectedStudy?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            {selectedStudy?.team?.length ? selectedStudy.team.map((member) => (
              <div key={member.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-white">
                        {member.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No users assigned to this study yet.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudyManagement; 