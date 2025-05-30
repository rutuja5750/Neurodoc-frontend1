import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studyService } from '@/services/studyService';
import { toast } from "@/components/ui/use-toast";
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Plus, Pencil, Trash2, Search, Filter,
  Download, FileText, Calendar, Eye, Building2, FlaskConical, MapPin, FolderX, Users, MoreHorizontal
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
import StudyForm from './StudyForm.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from 'lucide-react';

const StudyManagement = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    phase: '',
    status: '',
    page: 1,
    limit: 10
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch studies
  const { data, isLoading, error } = useQuery({
    queryKey: ['studies', filters],
    queryFn: () => studyService.getStudies(filters)
  });

  // Delete study mutation
  const deleteMutation = useMutation({
    mutationFn: studyService.deleteStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] });
      toast({
        title: "Success",
        description: "Study deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete study",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (study) => {
    setSelectedStudy(study);
    setIsFormOpen(true);
  };

  const handleDelete = async (studyId) => {
    if (window.confirm('Are you sure you want to delete this study?')) {
      try {
        await deleteMutation.mutateAsync(studyId);
      } catch (error) {
        console.error('Error deleting study:', error);
      }
    }
  };

  const handleStudyCreated = () => {
      setIsFormOpen(false);
    setSelectedStudy(null);
    queryClient.invalidateQueries({ queryKey: ['studies'] });
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading studies: {error.message}
      </div>
    );
  }

  const studies = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Management</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Study
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                // Handle CSV import
                Papa.parse(file, {
                  header: true,
                  complete: (results) => {
                    // Process imported data
                    console.log('Imported data:', results.data);
                  }
                });
              }
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
              <Input
            placeholder="Search studies..."
                value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
              />
            </div>
          <Select
          value={filters.status || "ALL"}
          onValueChange={(value) => handleFilterChange('status', value === "ALL" ? "" : value)}
          >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="TERMINATED">Terminated</SelectItem>
            </SelectContent>
          </Select>
          <Select
          value={filters.phase || "ALL"}
          onValueChange={(value) => handleFilterChange('phase', value === "ALL" ? "" : value)}
          >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Phase" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="ALL">All Phases</SelectItem>
            <SelectItem value="PHASE_1">Phase 1</SelectItem>
            <SelectItem value="PHASE_2">Phase 2</SelectItem>
            <SelectItem value="PHASE_3">Phase 3</SelectItem>
            <SelectItem value="PHASE_4">Phase 4</SelectItem>
            <SelectItem value="NOT_APPLICABLE">Not Applicable</SelectItem>
            </SelectContent>
          </Select>
      </div>

      {/* Studies Table */}
      <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
            <TableRow>
              <TableHead>Study ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {studies.map((study) => (
              <TableRow key={study._id}>
                <TableCell>{study.studyId}</TableCell>
                <TableCell>{study.title}</TableCell>
                  <TableCell>{study.phase}</TableCell>
                  <TableCell>
                  <Badge
                    variant={
                      study.status === 'ACTIVE' 
                        ? 'success'
                        : study.status === 'COMPLETED'
                        ? 'info'
                        : study.status === 'DRAFT'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                      {study.status}
                      </Badge>
                  </TableCell>
                  <TableCell>{new Date(study.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(study)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                        </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(study.studyId)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
                  <div>
          Showing page {currentPage} of {totalPages}
                  </div>
        <div className="flex gap-2">
                  <Button 
                    variant="outline" 
            onClick={() => handleFilterChange('page', currentPage - 1)}
            disabled={currentPage === 1}
                  >
            Previous
                  </Button>
                  <Button 
                    variant="outline" 
            onClick={() => handleFilterChange('page', currentPage + 1)}
            disabled={currentPage === totalPages}
                  >
            Next
                  </Button>
        </div>
      </div>

      {/* Study Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStudy ? 'Edit Study' : 'Create New Study'}
            </DialogTitle>
          </DialogHeader>
          <StudyForm
            study={selectedStudy}
            onClose={() => setIsFormOpen(false)}
            onStudyCreated={handleStudyCreated}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudyManagement; 