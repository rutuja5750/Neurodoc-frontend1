import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Search, FileText, Download, Eye, Send, MoreHorizontal, Filter, ChevronDown, ChevronUp, Archive, Trash2, FileEdit, History, AlertCircle, Upload, CheckCircle, Users } from 'lucide-react';
import clinicalTrialsService from '../../services/clinical-trials.service';
import UploadDocumentDialog from '../../components/documents/UploadDocumentDialog';
import { useToast } from '@/components/ui/use-toast';
import ApprovalDialog from '../../components/documents/ApprovalDialog';
import { Skeleton } from '@/components/ui/skeleton';

const EditDocumentDialog = ({ open, onClose, document, onUpdated }) => {
  const { toast } = useToast();
  const [form, setForm] = useState(document || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(document || {});
  }, [document]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clinicalTrialsService.updateDocument(document._id, form);
      toast({ title: 'Document updated', description: 'The document was updated successfully.' });
      onUpdated();
      onClose();
    } catch (err) {
      toast({ title: 'Update failed', description: err.message || 'Failed to update document', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input name="title" value={form.title || ''} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input name="description" value={form.description || ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Select
              name="type"
              value={form.type || ''}
              onValueChange={val => setForm({ ...form, type: val })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Protocol">Protocol</SelectItem>
                <SelectItem value="Informed Consent">Informed Consent</SelectItem>
                <SelectItem value="Report">Report</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Study</label>
            <Input name="study" value={form.study || ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              name="status"
              value={form.status || ''}
              onValueChange={val => setForm({ ...form, status: val })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="IN_REVIEW">IN_REVIEW</SelectItem>
                <SelectItem value="APPROVED">APPROVED</SelectItem>
                <SelectItem value="FINAL">FINAL</SelectItem>
                <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Add more fields as needed */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ManageReviewersDialog = ({ open, onClose, documentId }) => {
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newReviewer, setNewReviewer] = useState({ reviewerId: '', reviewerName: '' });
  const { toast } = useToast();

  // Example reviewer options (replace with real data as needed)
  const reviewerOptions = [
    { reviewerId: 'npi123', reviewerName: 'Dr. Alice Smith', npi: 'npi123', role: 'Principal Investigator' },
    { reviewerId: 'npi456', reviewerName: 'Dr. Bob Jones', npi: 'npi456', role: 'Sub-Investigator' },
    { reviewerId: 'npi789', reviewerName: 'Dr. Carol Lee', npi: 'npi789', role: 'Study Coordinator' },
  ];
  const [selectedReviewer, setSelectedReviewer] = useState(null);

  useEffect(() => {
    if (open && documentId) fetchReviewers();
    // eslint-disable-next-line
  }, [open, documentId]);

  const fetchReviewers = async () => {
    setLoading(true);
    try {
      const data = await clinicalTrialsService.getReviewers(documentId);
      setReviewers(data);
    } catch (err) {
      toast({ title: 'Failed to load reviewers', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReviewer = async () => {
    if (!newReviewer.reviewerId || !newReviewer.reviewerName) return;
    setLoading(true);
    try {
      await clinicalTrialsService.addReviewer(documentId, newReviewer);
      setNewReviewer({ reviewerId: '', reviewerName: '' });
      fetchReviewers();
      toast({ title: 'Reviewer added' });
    } catch (err) {
      toast({ title: 'Failed to add reviewer', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewerId, status) => {
    setLoading(true);
    try {
      await clinicalTrialsService.updateReviewer(documentId, reviewerId, { status });
      fetchReviewers();
      toast({ title: 'Reviewer status updated' });
    } catch (err) {
      toast({ title: 'Failed to update status', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewerSelect = (reviewerId) => {
    const reviewer = reviewerOptions.find(r => r.reviewerId === reviewerId);
    setSelectedReviewer(reviewer);
    setNewReviewer({ reviewerId: reviewer.reviewerId, reviewerName: reviewer.reviewerName, npi: reviewer.npi, role: reviewer.role });
  };

  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[60vw] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Manage Reviewers</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Add and manage reviewers for this document
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Reviewers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Current Reviewers</h3>
              <span className="text-xs text-gray-500">{reviewers.length} reviewer{reviewers.length !== 1 ? 's' : ''}</span>
            </div>
            
            {loading ? (
              <div className="text-center py-4 text-sm text-gray-500">Loading reviewers...</div>
            ) : reviewers.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500 bg-gray-50 rounded-lg">
                No reviewers assigned yet
              </div>
            ) : (
              <div className="space-y-3">
                {reviewers.map(r => (
                  <div key={r.reviewerId} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-grow min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{r.reviewerName}</div>
                      <div className="text-xs text-gray-500">{r.npi} • {r.role}</div>
                    </div>
                    <Select 
                      value={r.status} 
                      onValueChange={val => handleStatusChange(r.reviewerId, val)}
                      className="w-full sm:w-32"
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING" className="text-sm">Pending</SelectItem>
                        <SelectItem value="APPROVED" className="text-sm">Approved</SelectItem>
                        <SelectItem value="REJECTED" className="text-sm">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Reviewer Section */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Add New Reviewer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="sm:col-span-2 lg:col-span-1">
                <Select
                  value={selectedReviewer?.reviewerId || ''}
                  onValueChange={handleReviewerSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewerOptions.map(r => (
                      <SelectItem key={r.reviewerId} value={r.reviewerId}>{r.reviewerName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  value={selectedReviewer?.npi || ''}
                  readOnly
                  className="bg-gray-50"
                  placeholder="NPI Number"
                />
              </div>
              <div>
                <Input
                  value={selectedReviewer?.role || ''}
                  readOnly
                  className="bg-gray-50"
                  placeholder="Role"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Button 
                  onClick={handleAddReviewer} 
                  disabled={loading || !selectedReviewer}
                  className="w-full"
                >
                  {loading ? 'Adding...' : 'Add Reviewer'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DocumentList = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'documentDate', direction: 'desc' });
  const [filters, setFilters] = useState({
    status: 'all',
    documentType: 'all',
    study: 'all',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showAuditDialog, setShowAuditDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editDocument, setEditDocument] = useState(null);
  const [showReviewersDialog, setShowReviewersDialog] = useState(false);
  const [reviewersDocId, setReviewersDocId] = useState(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedDocumentForApproval, setSelectedDocumentForApproval] = useState(null);
  const [typeMulti] = useState([]);
  const [statusMulti] = useState([]);
  const [studyMulti] = useState([]);
  const [archiveReason, setArchiveReason] = useState('');
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  // Filtering
  const filtered = useMemo(() => documents.filter(doc => {
    return (
      (!searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.type.toLowerCase().includes(searchQuery.toLowerCase()) || doc.status.toLowerCase().includes(searchQuery.toLowerCase()) || doc.study.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (typeMulti.length === 0 || typeMulti.includes(doc.type)) &&
      (statusMulti.length === 0 || statusMulti.includes(doc.status)) &&
      (studyMulti.length === 0 || studyMulti.includes(doc.study))
    );
  }), [documents, searchQuery, typeMulti, statusMulti, studyMulti]);

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, itemsPerPage, sortConfig, filters]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await clinicalTrialsService.getDocuments({
        page: currentPage,
        limit: itemsPerPage,
        sort: sortConfig,
        filters
      });
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'DRAFT': { variant: 'secondary', label: 'Draft', color: 'bg-gray-200 text-gray-700', icon: <FileText className="h-4 w-4 mr-1 text-gray-400" /> },
      'IN_REVIEW': { variant: 'warning', label: 'In Review', color: 'bg-yellow-100 text-yellow-700', icon: <History className="h-4 w-4 mr-1 text-yellow-500" /> },
      'APPROVED': { variant: 'success', label: 'Approved', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="h-4 w-4 mr-1 text-green-600" /> },
      'FINAL': { variant: 'default', label: 'Final', color: 'bg-blue-100 text-blue-700', icon: <FileText className="h-4 w-4 mr-1 text-blue-600" /> },
      'ARCHIVED': { variant: 'destructive', label: 'Archived', color: 'bg-red-100 text-red-700', icon: <Archive className="h-4 w-4 mr-1 text-red-600" /> },
    };
    const config = statusConfig[status] || statusConfig['DRAFT'];
    return <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${config.color}`}>{config.icon}{config.label}</span>;
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDocuments(filtered.map(doc => doc._id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectDocument = (documentId, checked) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleBulkAction = async (action) => {
    try {
      switch (action) {
        case 'delete':
          setShowDeleteDialog(true);
          break;
        case 'archive':
          setShowArchiveDialog(true);
          break;
        case 'send_for_review':
          await Promise.all(selectedDocuments.map(id => clinicalTrialsService.sendForReview(id)));
          toast({
            title: "Documents Sent for Review",
            description: "The selected documents have been sent for review.",
          });
          fetchDocuments();
          setSelectedDocuments([]);
          break;
        default:
          break;
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to perform bulk action",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (reason) => {
    try {
      await clinicalTrialsService.bulkArchiveDocuments({ documentIds: selectedDocuments, reason });
      toast({
        title: "Documents Archived",
        description: "The selected documents have been archived successfully.",
      });
      fetchDocuments();
      setSelectedDocuments([]);
      setShowArchiveDialog(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to archive documents",
        variant: "destructive",
      });
    }
  };

  const handleSendForReview = async (documentId) => {
    try {
      const response = await clinicalTrialsService.sendForReview(documentId);
      if (response.success) {
        alert('Document sent for review successfully!');
        fetchDocuments();
      } else {
        alert('Failed to send document for review: ' + response.error);
      }
    } catch (err) {
      console.error('Error sending document for review:', err);
      alert('Error sending document for review: ' + err.message);
    }
  };

  const handleViewAuditTrail = async (documentId) => {
    try {
      const response = await clinicalTrialsService.getDocumentAuditTrail(documentId);
      setAuditTrail(response.data);
      setSelectedDocument(documents.find(doc => doc._id === documentId));
      setShowAuditDialog(true);
    } catch (err) {
      console.error('Error fetching audit trail:', err);
      alert('Error fetching audit trail: ' + err.message);
    }
  };

  const handleUploadComplete = async () => {
    try {
      await fetchDocuments();
      toast({
        title: "Document Uploaded",
        description: "The document has been uploaded successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to refresh documents",
        variant: "destructive",
      });
    }
  };

  const handleApprovalComplete = async () => {
    await fetchDocuments();
    setShowApprovalDialog(false);
    setSelectedDocumentForApproval(null);
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedDocuments = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl font-bold">Documents</CardTitle>
              <CardDescription className="text-base">Manage and track all clinical trial documents</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    {[...Array(7)].map((_, i) => (
                      <TableHead key={i}><Skeleton className="h-4 w-24" /></TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(8)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(7)].map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Dashboard Widgets Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-100">
          <div className="text-2xl font-bold text-blue-700">7</div>
          <div className="text-sm text-gray-500">Total Documents</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-100">
          <div className="text-2xl font-bold text-green-600">1</div>
          <div className="text-sm text-gray-500">Approved</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">4</div>
          <div className="text-sm text-gray-500">In Review</div>
        </div>
      </div>
      {/* Recent Activity Feed */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-100">
        <div className="font-semibold text-gray-700 mb-2">Recent Activity</div>
        <ul className="divide-y divide-gray-100 text-sm">
          <li className="py-2 flex items-center gap-2"><span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span> Document <b>Suvarna kulkarni</b> was <span className="text-green-700 font-medium">approved</span></li>
          <li className="py-2 flex items-center gap-2"><span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span> Document <b>AkshadaDisale_Resume_Modified</b> moved to <span className="text-yellow-700 font-medium">In Review</span></li>
          <li className="py-2 flex items-center gap-2"><span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span> Document <b>Arun Sharma</b> was created</li>
        </ul>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Documents</CardTitle>
            <CardDescription className="text-base">
              Manage and track all clinical trial documents
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowUploadDialog(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New Document
            </Button>
            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showFilters && (
            <div className="mb-4 p-4 border rounded-lg space-y-4 bg-gray-50">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">All Statuses</SelectItem>
                      <SelectItem value="DRAFT" className="text-sm">Draft</SelectItem>
                      <SelectItem value="IN_REVIEW" className="text-sm">In Review</SelectItem>
                      <SelectItem value="APPROVED" className="text-sm">Approved</SelectItem>
                      <SelectItem value="FINAL" className="text-sm">Final</SelectItem>
                      <SelectItem value="ARCHIVED" className="text-sm">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Document Type</label>
                  <Select
                    value={filters.documentType}
                    onValueChange={(value) => handleFilterChange('documentType', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">All Types</SelectItem>
                      <SelectItem value="PROTOCOL" className="text-sm">Protocol</SelectItem>
                      <SelectItem value="CRF" className="text-sm">CRF</SelectItem>
                      <SelectItem value="ICF" className="text-sm">ICF</SelectItem>
                      <SelectItem value="REPORT" className="text-sm">Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Study</label>
                  <Select
                    value={filters.study}
                    onValueChange={(value) => handleFilterChange('study', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select study" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">All Studies</SelectItem>
                      <SelectItem value="STUDY_001" className="text-sm">Study 001</SelectItem>
                      <SelectItem value="STUDY_002" className="text-sm">Study 002</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Date Range</label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) => handleFilterChange('dateRange', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">All Time</SelectItem>
                      <SelectItem value="today" className="text-sm">Today</SelectItem>
                      <SelectItem value="week" className="text-sm">This Week</SelectItem>
                      <SelectItem value="month" className="text-sm">This Month</SelectItem>
                      <SelectItem value="year" className="text-sm">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
            {selectedDocuments.length > 0 && (
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="text-sm font-medium">
                      Bulk Actions
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="text-sm" onClick={() => handleBulkAction('send_for_review')}>
                      Send for Review
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm" onClick={() => handleBulkAction('archive')}>
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm" onClick={() => handleBulkAction('delete')}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedDocuments([])}
                  className="text-sm font-medium"
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[50px] text-sm font-semibold text-gray-700">
                    <Checkbox
                      checked={selectedDocuments.length === filtered.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-sm font-semibold text-gray-700"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-2">
                      Title
                      {sortConfig.key === 'title' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-sm font-semibold text-gray-700"
                    onClick={() => handleSort('documentType')}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      {sortConfig.key === 'documentType' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-sm font-semibold text-gray-700"
                    onClick={() => handleSort('study')}
                  >
                    <div className="flex items-center gap-2">
                      Study
                      {sortConfig.key === 'study' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-sm font-semibold text-gray-700"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortConfig.key === 'status' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-sm font-semibold text-gray-700"
                    onClick={() => handleSort('documentDate')}
                  >
                    <div className="flex items-center gap-2">
                      Upload Date
                      {sortConfig.key === 'documentDate' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right text-sm font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-sm text-gray-500">
                      No documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDocuments.map((doc) => (
                    <TableRow
                      key={doc._id}
                      className={`group transition-all duration-150 hover:bg-blue-50 cursor-pointer ${selectedDocuments.includes(doc._id) ? 'bg-blue-100/60' : ''}`}
                      tabIndex={0}
                      aria-selected={selectedDocuments.includes(doc._id)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedDocuments.includes(doc._id)}
                          onCheckedChange={(checked) => handleSelectDocument(doc._id, checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span>{doc.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-4 w-4 text-gray-400" />
                          {doc.documentType}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{doc.study}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(doc.documentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                            title="View Document"
                            className="text-gray-600 hover:text-blue-600 transition-transform duration-150 group-hover:scale-110"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                            title="Download Document"
                            className="text-gray-600 hover:text-blue-600 transition-transform duration-150 group-hover:scale-110"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {doc.status === 'DRAFT' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSendForReview(doc._id)}
                              title="Send for Review"
                              className="text-gray-600 hover:text-blue-600 transition-transform duration-150 group-hover:scale-110"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <DropdownMenu open={dropdownOpenId === doc._id} onOpenChange={(open) => setDropdownOpenId(open ? doc._id : null)}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-sm">
                              <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => { setEditDocument(doc); setShowEditDialog(true); setDropdownOpenId(null); }} className="text-sm">
                                <FileEdit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { handleViewAuditTrail(doc._id); setDropdownOpenId(null); }} className="text-sm">
                                <History className="mr-2 h-4 w-4" />
                                View Audit Trail
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setReviewersDocId(doc._id); setShowReviewersDialog(true); setDropdownOpenId(null); }} className="text-sm">
                                <Users className="mr-2 h-4 w-4" />
                                Manage Reviewers
                              </DropdownMenuItem>
                              {doc.status === 'IN_REVIEW' && (
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedDocumentForApproval(doc);
                                    setShowApprovalDialog(true);
                                    setDropdownOpenId(null);
                                  }} 
                                  className="text-sm text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve/Reject
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-sm text-yellow-600"
                                onClick={() => { handleBulkAction('archive'); setDropdownOpenId(null); }}
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-sm text-red-600"
                                onClick={() => { handleBulkAction('delete'); setDropdownOpenId(null); }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Rows per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[70px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10" className="text-sm">10</SelectItem>
                  <SelectItem value="20" className="text-sm">20</SelectItem>
                  <SelectItem value="50" className="text-sm">50</SelectItem>
                  <SelectItem value="100" className="text-sm">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-sm font-medium"
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-sm font-medium"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail Dialog */}
      <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Audit Trail - {selectedDocument?.title}</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              View the complete history of changes for this document
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {auditTrail.map((entry, index) => (
                <div key={index} className="flex gap-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border">
                      {entry.action === 'CREATE' && <FileText className="h-4 w-4 text-blue-600" />}
                      {entry.action === 'UPDATE' && <FileEdit className="h-4 w-4 text-blue-600" />}
                      {entry.action === 'REVIEW' && <Users className="h-4 w-4 text-blue-600" />}
                      {entry.action === 'APPROVE' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {entry.action === 'REJECT' && <AlertCircle className="h-4 w-4 text-red-600" />}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium text-sm text-gray-900">{entry.action}</div>
                    <div className="text-sm text-gray-500">
                      {entry.userName} - {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    {entry.details && (
                      <div className="mt-2 text-sm text-gray-600">{entry.details}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAuditDialog(false)} className="text-sm font-medium">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Delete Documents</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Are you sure you want to delete the selected documents? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="text-sm font-medium">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleBulkAction('delete');
                setShowDeleteDialog(false);
              }}
              className="text-sm font-medium"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Archive Documents</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Are you sure you want to archive the selected documents? Please provide a reason for archiving.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reason for archiving..."
              className="min-h-[100px]"
              onChange={(e) => setArchiveReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveDialog(false)} className="text-sm font-medium">
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => handleArchive(archiveReason)}
              className="text-sm font-medium"
            >
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <UploadDocumentDialog
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Edit Document Dialog */}
      <EditDocumentDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        document={editDocument}
        onUpdated={fetchDocuments}
      />

      {/* Manage Reviewers Dialog */}
      <ManageReviewersDialog
        open={showReviewersDialog}
        onClose={() => setShowReviewersDialog(false)}
        documentId={reviewersDocId}
      />

      {/* Add ApprovalDialog */}
      <ApprovalDialog
        open={showApprovalDialog}
        onClose={() => {
          setShowApprovalDialog(false);
          setSelectedDocumentForApproval(null);
        }}
        document={selectedDocumentForApproval}
        onApproved={handleApprovalComplete}
      />
    </div>
  );
};

export default DocumentList; 