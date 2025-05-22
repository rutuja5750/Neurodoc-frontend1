import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FolderOpen,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  ChevronDown,
  Star,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Share2,
  Lock,
  Unlock,
  History,
  GitBranch,
  MessageSquare,
  UserPlus,
  Tag,
  X
} from 'lucide-react';

const TMFLibrary = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFolder, setSelectedFolder] = useState('All Documents');
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [quickFilters, setQuickFilters] = useState({
    recent: false,
    starred: false,
    pending: false,
    approved: false
  });
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const folders = [
    { name: 'All Documents', count: 2458 },
    { name: 'Essential Documents', count: 856 },
    { name: 'Regulatory Documents', count: 432 },
    { name: 'Study Documents', count: 678 },
    { name: 'Quality Documents', count: 492 }
  ];

  const documents = [
    {
      id: 1,
      name: 'Protocol Amendment v2.1',
      type: 'PDF',
      size: '2.4 MB',
      lastModified: '2024-03-20',
      status: 'Approved',
      version: '2.1',
      owner: 'Dr. Sarah Johnson',
      category: 'Essential Documents',
      tags: ['Protocol', 'Amendment', 'High Priority']
    },
    {
      id: 2,
      name: 'Safety Report Q2 2024',
      type: 'DOCX',
      size: '1.8 MB',
      lastModified: '2024-03-18',
      status: 'Pending Review',
      version: '1.0',
      owner: 'John Smith',
      category: 'Regulatory Documents',
      tags: ['Safety', 'Report', 'Quarterly']
    },
    {
      id: 3,
      name: 'Informed Consent Form',
      type: 'PDF',
      size: '3.2 MB',
      lastModified: '2024-03-15',
      status: 'In Revision',
      version: '3.0',
      owner: 'Dr. Michael Brown',
      category: 'Study Documents',
      tags: ['Consent', 'Patient', 'Required']
    }
  ];

  const statusColors = {
    'Approved': 'bg-green-100 text-green-700',
    'Pending Review': 'bg-yellow-100 text-yellow-700',
    'In Revision': 'bg-blue-100 text-blue-700',
    'Rejected': 'bg-red-100 text-red-700'
  };

  const documentWorkflow = {
    currentStage: 'Review',
    stages: [
      { name: 'Draft', status: 'completed', date: '2024-03-15', user: 'Dr. Sarah Johnson' },
      { name: 'Internal Review', status: 'completed', date: '2024-03-18', user: 'John Smith' },
      { name: 'Review', status: 'current', date: '2024-03-20', user: 'Dr. Michael Brown' },
      { name: 'Approval', status: 'pending', date: null, user: null },
      { name: 'Final', status: 'pending', date: null, user: null }
    ]
  };

  const versionHistory = [
    {
      version: '2.1',
      date: '2024-03-20',
      user: 'Dr. Sarah Johnson',
      changes: 'Updated protocol endpoints',
      status: 'Current'
    },
    {
      version: '2.0',
      date: '2024-03-15',
      user: 'John Smith',
      changes: 'Major protocol amendments',
      status: 'Previous'
    },
    {
      version: '1.0',
      date: '2024-03-01',
      user: 'Dr. Michael Brown',
      changes: 'Initial version',
      status: 'Archived'
    }
  ];

  const collaborationData = {
    currentReviewers: [
      { name: 'Dr. Sarah Johnson', role: 'Primary Reviewer', status: 'Reviewing' },
      { name: 'John Smith', role: 'Medical Reviewer', status: 'Pending' }
    ],
    comments: [
      {
        user: 'Dr. Sarah Johnson',
        date: '2024-03-20 14:30',
        text: 'Please review the updated endpoints section',
        attachments: ['endpoints_review.pdf']
      },
      {
        user: 'John Smith',
        date: '2024-03-20 15:45',
        text: 'Safety parameters need revision',
        attachments: []
      }
    ]
  };

  const auditTrail = [
    {
      action: 'Document Created',
      user: 'Dr. Sarah Johnson',
      date: '2024-03-01 09:00',
      details: 'Initial document creation'
    },
    {
      action: 'Version Updated',
      user: 'John Smith',
      date: '2024-03-15 14:30',
      details: 'Updated to version 2.0'
    },
    {
      action: 'Review Started',
      user: 'Dr. Michael Brown',
      date: '2024-03-20 10:15',
      details: 'Internal review initiated'
    }
  ];

  const advancedFilters = {
    status: ['Approved', 'Pending Review', 'In Revision', 'Rejected'],
    documentType: ['Protocol', 'Report', 'Form', 'Amendment'],
    dateRange: { start: null, end: null },
    owner: [],
    tags: [],
    version: null
  };

  const handleDocumentAction = (doc, action) => {
    setSelectedDocument(doc);
    switch (action) {
      case 'preview':
        setShowPreview(true);
        break;
      case 'workflow':
        setShowWorkflow(true);
        break;
      case 'version':
        setShowVersionHistory(true);
        break;
      case 'collaboration':
        setShowCollaboration(true);
        break;
      case 'audit':
        setShowAuditTrail(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">TMF Library</h1>
          <p className="text-gray-600">Manage and organize your trial master file documents</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={quickFilters.recent ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQuickFilters(prev => ({ ...prev, recent: !prev.recent }))}
        >
          <Clock className="w-4 h-4 mr-2" />
          Recent
        </Button>
        <Button
          variant={quickFilters.starred ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQuickFilters(prev => ({ ...prev, starred: !prev.starred }))}
        >
          <Star className="w-4 h-4 mr-2" />
          Starred
        </Button>
        <Button
          variant={quickFilters.pending ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQuickFilters(prev => ({ ...prev, pending: !prev.pending }))}
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Pending
        </Button>
        <Button
          variant={quickFilters.approved ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQuickFilters(prev => ({ ...prev, approved: !prev.approved }))}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Approved
        </Button>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button 
          variant="outline"
          onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filter
        </Button>
        <div className="flex border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDocuments.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">{selectedDocuments.length} documents selected</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Tag className="w-4 h-4 mr-2" />
              Add Tags
            </Button>
            <Button variant="outline" size="sm" className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Advanced Filter Panel */}
      {showAdvancedFilter && (
        <Card className="mb-8 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select className="w-full p-2 border rounded-lg">
                {advancedFilters.status.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Document Type</label>
              <select className="w-full p-2 border rounded-lg">
                {advancedFilters.documentType.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <div className="flex gap-2">
                <input type="date" className="flex-1 p-2 border rounded-lg" />
                <input type="date" className="flex-1 p-2 border rounded-lg" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline">Reset</Button>
            <Button>Apply Filters</Button>
          </div>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Folders</h2>
            <div className="space-y-2">
              {folders.map((folder, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 ${
                    selectedFolder === folder.name ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                  onClick={() => setSelectedFolder(folder.name)}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <span>{folder.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{folder.count}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Document Grid/List */}
        <div className="col-span-9">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedDocuments(prev => 
                          prev.includes(doc.id) 
                            ? prev.filter(id => id !== doc.id)
                            : [...prev, doc.id]
                        )}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${
                          selectedDocuments.includes(doc.id) ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{doc.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Type: {doc.type}</p>
                    <p>Size: {doc.size}</p>
                    <p>Version: {doc.version}</p>
                    <p>Owner: {doc.owner}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {doc.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`text-sm px-2 py-1 rounded-full ${statusColors[doc.status]}`}>
                      {doc.status}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDocumentAction(doc, 'preview')}
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDocumentAction(doc, 'workflow')}
                        title="Workflow"
                      >
                        <GitBranch className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDocumentAction(doc, 'version')}
                        title="Version History"
                      >
                        <History className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDocumentAction(doc, 'collaboration')}
                        title="Collaboration"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDocumentAction(doc, 'audit')}
                        title="Audit Trail"
                      >
                        <Clock className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDocuments(documents.map(doc => doc.id));
                            } else {
                              setSelectedDocuments([]);
                            }
                          }}
                        />
                      </th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Size</th>
                      <th className="text-left py-3 px-4">Last Modified</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Owner</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selectedDocuments.includes(doc.id)}
                            onChange={() => setSelectedDocuments(prev => 
                              prev.includes(doc.id) 
                                ? prev.filter(id => id !== doc.id)
                                : [...prev, doc.id]
                            )}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span>{doc.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{doc.type}</td>
                        <td className="py-3 px-4">{doc.size}</td>
                        <td className="py-3 px-4">{doc.lastModified}</td>
                        <td className="py-3 px-4">
                          <span className={`text-sm px-2 py-1 rounded-full ${statusColors[doc.status]}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{doc.owner}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDocumentAction(doc, 'preview')}
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDocumentAction(doc, 'workflow')}
                              title="Workflow"
                            >
                              <GitBranch className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDocumentAction(doc, 'version')}
                              title="Version History"
                            >
                              <History className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDocumentAction(doc, 'collaboration')}
                              title="Collaboration"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDocumentAction(doc, 'audit')}
                              title="Audit Trail"
                            >
                              <Clock className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Document Preview Panel */}
      {showPreview && selectedDocument && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white border-l shadow-lg overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Document Preview</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-medium">{selectedDocument.name}</h3>
                  <p className="text-sm text-gray-600">{selectedDocument.type} • {selectedDocument.size}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Document Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span>{selectedDocument.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Modified</span>
                  <span>{selectedDocument.lastModified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner</span>
                  <span>{selectedDocument.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span>{selectedDocument.category}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDocument.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowWorkflow(true)}>
                  <GitBranch className="w-4 h-4 mr-2" />
                  Workflow
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowVersionHistory(true)}>
                  <History className="w-4 h-4 mr-2" />
                  Versions
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowCollaboration(true)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Comments
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAuditTrail(true)}>
                  <Clock className="w-4 h-4 mr-2" />
                  Audit Trail
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Modal */}
      {showWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-3/4 max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Document Workflow</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowWorkflow(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {documentWorkflow.stages.map((stage, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stage.status === 'completed' ? 'bg-green-100 text-green-700' :
                    stage.status === 'current' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {stage.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                     stage.status === 'current' ? <Clock className="w-4 h-4" /> :
                     <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{stage.name}</h3>
                    {stage.date && (
                      <p className="text-sm text-gray-600">
                        {stage.date} by {stage.user}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-3/4 max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Version History</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowVersionHistory(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {versionHistory.map((version, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Version {version.version}</h3>
                      <p className="text-sm text-gray-600">{version.changes}</p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      version.status === 'Current' ? 'bg-green-100 text-green-700' :
                      version.status === 'Previous' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {version.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {version.date} by {version.user}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Collaboration Modal */}
      {showCollaboration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-3/4 max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Collaboration</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCollaboration(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Current Reviewers</h3>
                <div className="space-y-4">
                  {collaborationData.currentReviewers.map((reviewer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{reviewer.name}</p>
                        <p className="text-sm text-gray-600">{reviewer.role}</p>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        reviewer.status === 'Reviewing' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {reviewer.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-4">Comments</h3>
                <div className="space-y-4">
                  {collaborationData.comments.map((comment, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{comment.user}</p>
                          <p className="text-sm text-gray-600">{comment.date}</p>
                        </div>
                      </div>
                      <p className="mt-2">{comment.text}</p>
                      {comment.attachments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Attachments:</p>
                          <ul className="mt-1">
                            {comment.attachments.map((attachment, i) => (
                              <li key={i} className="text-sm text-blue-600">
                                {attachment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Audit Trail Modal */}
      {showAuditTrail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-3/4 max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Audit Trail</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAuditTrail(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {auditTrail.map((entry, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{entry.action}</h3>
                      <p className="text-sm text-gray-600">{entry.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{entry.user}</p>
                      <p className="text-sm text-gray-600">{entry.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TMFLibrary;