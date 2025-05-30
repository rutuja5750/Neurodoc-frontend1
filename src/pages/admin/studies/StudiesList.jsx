import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studyService } from '@/services/studyService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Search } from 'lucide-react';
import StudyForm from './StudyForm';

const StudiesList = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState(null);

  // Fetch studies
  const { data, isLoading, error } = useQuery({
    queryKey: ['studies', { page, search, status }],
    queryFn: () => studyService.getStudies({ page, search, status })
  });

  // Delete study mutation
  const deleteMutation = useMutation({
    mutationFn: studyService.deleteStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] });
    }
  });

  const handleEdit = (study) => {
    setSelectedStudy(study);
    setShowForm(true);
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
    setShowForm(false);
    setSelectedStudy(null);
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
      <div className="text-red-500">
        Error loading studies: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Studies</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Study
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search studies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="TERMINATED">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Study ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((study) => (
              <TableRow key={study.studyId}>
                <TableCell>{study.studyId}</TableCell>
                <TableCell>{study.title}</TableCell>
                <TableCell>{study.studyType}</TableCell>
                <TableCell>{study.phase}</TableCell>
                <TableCell>{study.status}</TableCell>
                <TableCell>{new Date(study.startDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(study)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleDelete(study.studyId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex justify-between items-center">
          <div>
            Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{' '}
            {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
            {data.pagination.total} entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= data.pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Study Form Dialog */}
      {showForm && (
        <StudyForm
          study={selectedStudy}
          onClose={() => {
            setShowForm(false);
            setSelectedStudy(null);
          }}
          onStudyCreated={handleStudyCreated}
        />
      )}
    </div>
  );
};

export default StudiesList; 