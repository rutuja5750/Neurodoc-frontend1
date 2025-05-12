import React, { useState, useEffect } from 'react';
import SidebarNav from './SidebarNav';
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Info } from 'lucide-react';

// Fixed imports with relative paths
import ZoneDialog from '../../components/dialogs/ZoneDialog ';
import SectionDialog from '../../components/dialogs/SectionDialog ';
import ArtifactDialog from '../../components/dialogs/ArtifactDialog ';
import SubArtifactDialog from '../../components/dialogs/SubArtifactDialog';
import DocumentDialog from '../../components/dialogs/DocumentDialog ';
import ContentArea from './ContentArea ';
import tmfService from '../../services/tmf.serivce';
import documentService  from '../../services/document.service';

const TMFViewer = () => {
  const [data, setData] = useState({
    zones: [],
    sections: {},
    artifacts: {},
    subArtifacts: {},
    documents: {}
  });
  
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState({
    zone: false,
    section: false,
    artifact: false,
    subArtifact: false,
    document: false
  });
  const [parentId, setParentId] = useState(null);

  // Load initial data
  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        const zones = await tmfService.zones.getAll();
        setData(prev => ({ ...prev, zones }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching zones:", error);
        setLoading(false);
      }
    };
    
    fetchZones();
  }, []);

  // Load sections when zone is expanded
  const loadSections = async (zoneId) => {
    if (data.sections[zoneId]) return; // Already loaded
    
    try {
      const sections = await tmfService.sections.getAllByZone(zoneId);
      setData(prev => ({
        ...prev,
        sections: { ...prev.sections, [zoneId]: sections }
      }));
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  // Load artifacts when section is expanded
  const loadArtifacts = async (sectionId) => {
    if (data.artifacts[sectionId]) return; // Already loaded
    
    try {
      const artifacts = await tmfService.artifacts.getAllBySection(sectionId);
      setData(prev => ({
        ...prev,
        artifacts: { ...prev.artifacts, [sectionId]: artifacts }
      }));
    } catch (error) {
      console.error("Error fetching artifacts:", error);
    }
  };

  // Load sub-artifacts when artifact is expanded
  const loadSubArtifacts = async (artifactId) => {
    if (data.subArtifacts[artifactId]) return; // Already loaded
    
    try {
      const subArtifacts = await tmfService.subArtifacts.getAllByArtifact(artifactId);
      setData(prev => ({
        ...prev,
        subArtifacts: { ...prev.subArtifacts, [artifactId]: subArtifacts }
      }));
    } catch (error) {
      console.error("Error fetching sub-artifacts:", error);
    }
  };

  // Load documents
  // const loadDocuments = async (parentId) => {
  //   if (data.documents[parentId]) return; // Already loaded
    
  //   try {
  //     const documents = await tmfService.documents.getAllByParent(parentId);
  //     setData(prev => ({
  //       ...prev,
  //       documents: { ...prev.documents, [parentId]: documents }
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching documents:", error);
  //   }
  // };

  // Handle item selection
  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  // Open dialog to create new items
  const handleCreate = (type, parentId = null) => {
    setParentId(parentId);
    setDialogOpen(prev => ({ ...prev, [type]: true }));
  };

  // Handle dialog submission for Zone
  const handleZoneSubmit = async (zoneData) => {
    try {
      const newZone = await tmfService.zones.create(zoneData);
      setData(prev => ({
        ...prev,
        zones: [...prev.zones, newZone]
      }));
      setDialogOpen(prev => ({ ...prev, zone: false }));
    } catch (error) {
      console.error("Error creating zone:", error);
    }
  };

  // Handle dialog submission for Section
  const handleSectionSubmit = async (sectionData) => {
    try {
      const newSection = await tmfService.sections.create(parentId, sectionData);
      setData(prev => ({
        ...prev,
        sections: { 
          ...prev.sections, 
          [parentId]: prev.sections[parentId] ? 
            [...prev.sections[parentId], newSection] : 
            [newSection] 
        }
      }));
      setDialogOpen(prev => ({ ...prev, section: false }));
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  // Handle dialog submission for Artifact
  const handleArtifactSubmit = async (artifactData) => {
    try {
      const newArtifact = await tmfService.artifacts.create(parentId, artifactData);
      setData(prev => ({
        ...prev,
        artifacts: { 
          ...prev.artifacts, 
          [parentId]: prev.artifacts[parentId] ? 
            [...prev.artifacts[parentId], newArtifact] : 
            [newArtifact] 
        }
      }));
      setDialogOpen(prev => ({ ...prev, artifact: false }));
    } catch (error) {
      console.error("Error creating artifact:", error);
    }
  };

  // Handle dialog submission for SubArtifact
  const handleSubArtifactSubmit = async (subArtifactData) => {
    try {
      const newSubArtifact = await tmfService.subArtifacts.create(parentId, subArtifactData);
      setData(prev => ({
        ...prev,
        subArtifacts: { 
          ...prev.subArtifacts, 
          [parentId]: prev.subArtifacts[parentId] ? 
            [...prev.subArtifacts[parentId], newSubArtifact] : 
            [newSubArtifact] 
        }
      }));
      setDialogOpen(prev => ({ ...prev, subArtifact: false }));
    } catch (error) {
      console.error("Error creating sub-artifact:", error);
    }
  };

  const handleDocumentSubmit = async (documentData) => {
    try {
        const formData = new FormData();

        // console.log("Original Document data:", documentData);

        // Extract metadata from document data
        const metadata = { ...documentData };

        // Handle file upload
        if (documentData.file) {
            formData.append('file', documentData.file, documentData.file.name);
        }

        // Remove file object from metadata
        delete metadata.file;

        // Convert date fields to ISO format
        ['documentDate', 'effectiveDate', 'expirationDate'].forEach(field => {
            if (metadata[field]) {
                metadata[field] = new Date(metadata[field]).toISOString();
            }
        });

        // Append metadata as JSON
        formData.append('metadata', JSON.stringify(metadata));

        // Get user ID from local storage
        const user = localStorage.getItem('user');
        const userId = user ? JSON.parse(user)._id : null;

        if (!userId) throw new Error("User not authenticated");

        // console.log("User ID:", userId);
        // console.log("FormData entries:");
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        // Call document creation service
        const newDocument = await documentService.create(userId, formData)

        // Update state with new document
        setData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [userId]: [...(prev.documents[userId] || []), newDocument]
            }
        }));

        // Close dialog and show success toast
        setDialogOpen(prev => ({ ...prev, document: false }));
        
        toast({ title: "Success", description: "Document created successfully", variant: "default" });
    } catch (error) {
        console.error("Error creating document:", error);
        toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to create document",
            variant: "destructive"
        });
    }
  };

  // Handle dialog close
  const handleDialogClose = (type) => {
    setDialogOpen(prev => ({ ...prev, [type]: false }));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
        <div className="text-2xl font-bold text-blue-800">TMF Viewer</div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => handleCreate('zone')}
        >
          <Plus className="h-4 w-4" /> Add Zone
        </button>
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
              data={data}
              onSelect={handleSelect}
              loadSections={loadSections}
              loadArtifacts={loadArtifacts}
              loadSubArtifacts={loadSubArtifacts}
              selectedItem={selectedItem}
            />
          )}
        </aside>
        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Info Panel for Selected Item */}
          {selectedItem ? (
            <div className="mb-6 p-4 bg-white rounded shadow flex items-center gap-4 border border-gray-100">
              <Info className="h-6 w-6 text-blue-500" />
              <div>
                <div className="font-semibold text-lg text-gray-800">{selectedItem.name || selectedItem.title}</div>
                <div className="text-sm text-gray-500">Type: {selectedItem.type || selectedItem.level || 'Unknown'}</div>
                {selectedItem.description && (
                  <div className="text-sm text-gray-600 mt-1">{selectedItem.description}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-white rounded shadow text-gray-500 border border-gray-100">Select a zone, section, or artifact to see details.</div>
          )}
          {/* Existing Content Area */}
          <ContentArea
            selectedItem={selectedItem}
            data={data}
            onCreate={handleCreate}
            onDialogOpen={setDialogOpen}
            parentId={parentId}
            setParentId={setParentId}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            handleZoneSubmit={handleZoneSubmit}
            handleSectionSubmit={handleSectionSubmit}
            handleArtifactSubmit={handleArtifactSubmit}
            handleSubArtifactSubmit={handleSubArtifactSubmit}
            handleDocumentSubmit={handleDocumentSubmit}
          />
        </main>
      </div>
      {/* Dialogs */}
      <ZoneDialog open={dialogOpen.zone} onClose={() => handleDialogClose('zone')} onSubmit={handleZoneSubmit} />
      <SectionDialog open={dialogOpen.section} onClose={() => handleDialogClose('section')} onSubmit={handleSectionSubmit} />
      <ArtifactDialog open={dialogOpen.artifact} onClose={() => handleDialogClose('artifact')} onSubmit={handleArtifactSubmit} />
      <SubArtifactDialog open={dialogOpen.subArtifact} onClose={() => handleDialogClose('subArtifact')} onSubmit={handleSubArtifactSubmit} />
      <DocumentDialog open={dialogOpen.document} onClose={() => handleDialogClose('document')} onSubmit={handleDocumentSubmit} />
    </div>
  );
};

export default TMFViewer;