import React, { useState, useEffect } from 'react';
import SidebarNav from './SidebarNav';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, Search, Filter, Grid, List, 
  Download, Upload, Share2, Star, 
  MoreVertical, ChevronDown, RefreshCw,
  FileText, FolderOpen, Clock, User
} from 'lucide-react';
import FacilityDialog from '../../components/dialogs/ZoneDialog';
import tmfService from '../../services/tmf.service';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import TMFLayout from './TMFLayout';
import ContentArea from './ContentArea';

const TMFViewer = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facilityDialogOpen, setFacilityDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'all'
  });
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      try {
        const data = await tmfService.zones.getAll();
        setFacilities(data);
        // Mock documents data - replace with actual API call
        setDocuments([
          {
            id: 1,
            name: 'Protocol Document',
            type: 'PDF',
            status: 'Approved',
            lastModified: '2024-03-15',
            modifiedBy: 'John Doe',
            size: '2.5 MB',
            version: '1.0'
          },
          // Add more mock documents...
        ]);
      } catch (error) {
        console.error('Error fetching facilities:', error);
        setFacilities([]);
      }
      setLoading(false);
    };
    fetchFacilities();
  }, []);

  const handleFacilitySubmit = async (facilityData) => {
    await tmfService.zones.create(facilityData);
    setLoading(true);
    const data = await tmfService.zones.getAll();
    setFacilities(data);
    setFacilityDialogOpen(false);
    setLoading(false);
  };

  return (
    <TMFLayout>
      <ContentArea>
        <div className="flex flex-col h-full bg-gray-50">
          {/* Header */}
          <div className="flex flex-col items-center px-8 py-5 bg-white border-b">
            <div className="w-full max-w-5xl flex flex-col items-center gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="text-2xl font-semibold text-gray-900">TMF Viewer</div>
                <div className="text-sm text-gray-500 mt-0.5">Manage and organize your trial master files</div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                  {documents.length} Documents
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                  Active
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setLoading(true)}
                  className="border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
                <Button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
                  onClick={() => setFacilityDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" /> Add New Facility
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-72 bg-white border-r h-full overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded" />
                  ))}
                </div>
              ) : (
                <SidebarNav
                  data={{ zones: facilities }}
                  loading={loading}
                  onCreate={() => setFacilityDialogOpen(true)}
                />
              )}
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-6 overflow-y-auto">
              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search documents..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select
                    value={selectedFilters.status}
                    onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedFilters.type}
                    onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="doc">DOC</SelectItem>
                      <SelectItem value="xls">XLS</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Document Grid/List View */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
                {documents.map((doc) => (
                  <Card
                    key={doc.id}
                    className={`p-4 cursor-pointer transition-colors`}
                    onClick={() => navigate(`/tmf-viewer/document/${doc.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{doc.name}</h3>
                        <div className="mt-1 space-y-1 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Modified {doc.lastModified}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{doc.modifiedBy}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline">{doc.type}</Badge>
                          <Badge variant={doc.status === 'Approved' ? 'success' : 'secondary'}>
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            Add to Favorites
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            </main>
          </div>

          {/* Facility Dialog */}
          <FacilityDialog 
            open={facilityDialogOpen} 
            onClose={() => setFacilityDialogOpen(false)} 
            onSubmit={handleFacilitySubmit} 
          />
        </div>
      </ContentArea>
    </TMFLayout>
  );
};

export default TMFViewer;