import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Upload, Loader2 } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast"
import tmfService from '../../services/tmf.serivce';

const DocumentDialog = ({ 
  open, 
  initialSelectedItem,
  onClose, 
  onSubmit 
}) => {
  // File state management
  const [fileState, setFileState] = useState({
    file: null,
    fileName: '',
    fileSize: 0,
    fileType: '',
    error: ''
  });

  const { toast } = useToast()

  // Hierarchy state management
  const [hierarchyState, setHierarchyState] = useState({
    zones: [],
    sections: {},
    artifacts: {},
    subArtifacts: {},
    loading: {
      zones: false,
      sections: false,
      artifacts: false,
      subArtifacts: false
    }
  });

  // Selected hierarchy tracking
  const [selectedHierarchy, setSelectedHierarchy] = useState({
    zone: null,
    section: null,
    artifact: null,
    subArtifact: null
  });

  // Form management with react-hook-form
  const { 
    register, 
    handleSubmit, 
    reset, 
    control,
    setValue,
    formState: { errors, isSubmitting }, 
    watch 
  } = useForm({
    defaultValues: {
      documentTitle: '',
      effectiveDate: null,
      expirationDate: null,
      accessLevel: 'Restricted',
      version: '1.0',
      study: '',
      site: '',
      country: '',
      indication: ''
    }
  });

  // Watchers for dynamic form updates
  const accessLevel = watch('accessLevel');
  const effectiveDate = watch('effectiveDate');
  const expirationDate = watch('expirationDate');

  // Initial data loading effect
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch zones
        setHierarchyState(prev => ({ 
          ...prev, 
          loading: { ...prev.loading, zones: true } 
        }));
        const zones = await tmfService.zones.getAll();
        
        setHierarchyState(prev => ({ 
          ...prev, 
          zones, 
          loading: { ...prev.loading, zones: false } 
        }));

        // Handle initial selection if provided
        if (initialSelectedItem && initialSelectedItem.type && initialSelectedItem.item) {
          const { type, item } = initialSelectedItem;
          
          // Set initial hierarchy based on the selected item type
          switch (type) {
            case 'zone':
              setSelectedHierarchy(prev => ({ ...prev, zone: item }));
              if (item._id) {
                await handleZoneChange(item._id);
              }
              break;
            case 'section':
              if (item.zone && item.zone._id) {
                setSelectedHierarchy(prev => ({ 
                  ...prev, 
                  zone: item.zone,
                  section: item 
                }));
                await handleZoneChange(item.zone._id);
                if (item._id) {
                  await handleSectionChange(item._id);
                }
              }
              break;
            case 'artifact':
              if (item.section && item.section.zone && item.section.zone._id) {
                setSelectedHierarchy(prev => ({ 
                  ...prev, 
                  zone: item.section.zone,
                  section: item.section,
                  artifact: item 
                }));
                await handleZoneChange(item.section.zone._id);
                if (item.section._id) {
                  await handleSectionChange(item.section._id);
                }
                if (item._id) {
                  await handleArtifactChange(item._id);
                }
              }
              break;
            case 'subArtifact':
              if (item.artifact && item.artifact.section && item.artifact.section.zone && item.artifact.section.zone._id) {
                setSelectedHierarchy(prev => ({ 
                  ...prev, 
                  zone: item.artifact.section.zone,
                  section: item.artifact.section,
                  artifact: item.artifact,
                  subArtifact: item 
                }));
                await handleZoneChange(item.artifact.section.zone._id);
                if (item.artifact.section._id) {
                  await handleSectionChange(item.artifact.section._id);
                }
                if (item.artifact._id) {
                  await handleArtifactChange(item.artifact._id);
                }
              }
              break;
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive"
        });
        setHierarchyState(prev => ({ 
          ...prev, 
          loading: { ...prev.loading, zones: false } 
        }));
      }
    };

    if (open) {
      fetchInitialData();
    }
  }, [open, initialSelectedItem]);

  // Hierarchy change handlers
  const handleZoneChange = async (zoneId) => {
    if (!zoneId) return;
    
    try {
      setHierarchyState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, sections: true },
        sections: {},
        artifacts: {},
        subArtifacts: {}
      }));

      const sections = await tmfService.sections.getAllByZone(zoneId);
      
      setHierarchyState(prev => ({ 
        ...prev, 
        sections: { [zoneId]: sections }, 
        loading: { ...prev.loading, sections: false } 
      }));

      // Reset dependent selections
      setSelectedHierarchy(prev => ({ 
        ...prev, 
        section: null,
        artifact: null,
        subArtifact: null 
      }));
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast({
        title: "Error",
        description: "Failed to load sections",
        variant: "destructive"
      });
      setHierarchyState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, sections: false } 
      }));
    }
  };

  const handleSectionChange = async (sectionId) => {
    if (!sectionId) return;
    
    try {
      setHierarchyState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, artifacts: true },
        artifacts: {},
        subArtifacts: {}
      }));

      const artifacts = await tmfService.artifacts.getAllBySection(sectionId);
      
      setHierarchyState(prev => ({ 
        ...prev, 
        artifacts: { [sectionId]: artifacts }, 
        loading: { ...prev.loading, artifacts: false } 
      }));

      // Reset dependent selections
      setSelectedHierarchy(prev => ({ 
        ...prev, 
        artifact: null,
        subArtifact: null 
      }));
    } catch (error) {
      console.error("Error fetching artifacts:", error);
      toast({
        title: "Error",
        description: "Failed to load artifacts",
        variant: "destructive"
      });
      setHierarchyState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, artifacts: false } 
      }));
    }
  };

  const handleArtifactChange = async (artifactId) => {
    if (!artifactId) return;
    
    try {
      setHierarchyState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, subArtifacts: true },
        subArtifacts: {}
      }));

      const subArtifacts = await tmfService.subArtifacts.getAllByArtifact(artifactId);
      
      setHierarchyState(prev => ({ 
        ...prev, 
        subArtifacts: { [artifactId]: subArtifacts }, 
        loading: { ...prev.loading, subArtifacts: false } 
      }));

      // Reset dependent selections
      setSelectedHierarchy(prev => ({ 
        ...prev, 
        subArtifact: null 
      }));
    } catch (error) {
      console.error("Error fetching sub-artifacts:", error);
      toast({
        title: "Error",
        description: "Failed to load sub-artifacts",
        variant: "destructive"
      });
      setHierarchyState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, subArtifacts: false } 
      }));
    }
  };



  const handleAccessLevelChange = (value) => {
    setValue('accessLevel', value);
  };

  const handleEffectiveDateChange = (date) => {
    setValue('effectiveDate', date);
  };

  const handleExpirationDateChange = (date) => {
    setValue('expirationDate', date);
  };

  // File upload handler
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      // Set max file size to 50MB
      const maxSize = 50 * 1024 * 1024; 
      
      if (selectedFile.size > maxSize) {
        setFileState({
          file: null,
          fileName: '',
          fileSize: 0,
          fileType: '',
          error: 'File size exceeds 50MB limit'
        });
        return;
      }
      
      // Update document type based on file extension
      const fileExtension = selectedFile.name.split('.').pop().toUpperCase();
      if (['PDF', 'DOCX', 'XLSX', 'PPTX', 'TXT'].includes(fileExtension)) {
        setValue('documentType', fileExtension);
      }
      
      setFileState({
        file: selectedFile,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        error: ''
      });
    }
  };

  // Form submission handler
  const submitForm = async (data) => {
    if (!fileState.file) {
      toast({
        title: "Error",
        description: "Please upload a document file",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Prepare document data to match schema
      const documentData = {
        // Identification
        documentTitle: data.documentTitle,
        version: data.version,
        
        // Hierarchy references
        ...(selectedHierarchy.zone && { zone: selectedHierarchy.zone._id }),
        ...(selectedHierarchy.section && { section: selectedHierarchy.section._id }),
        ...(selectedHierarchy.artifact && { artifact: selectedHierarchy.artifact._id }),
        ...(selectedHierarchy.subArtifact && { subArtifact: selectedHierarchy.subArtifact._id }),
        
        // Status and Access
        status: data.status,
        accessLevel: data.accessLevel,
        
        // Dates
        documentDate: new Date(),
        effectiveDate: data.effectiveDate,
        expirationDate: data.expirationDate,
        
        // Study and Context Information
        study: data.study,
        site: data.site,
        country: data.country,
        indication: data.indication,
        
        // File Information
        fileName: fileState.fileName,
        fileSize: fileState.fileSize,
        fileFormat: fileState.fileType,
        
        // File object for upload
        file: fileState.file
      };
      
      // Call onSubmit with the prepared document data
      await onSubmit(documentData);
      
      // Reset form after successful submission
      resetForm();
    } catch (error) {
      console.error("Document submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create document",
        variant: "destructive"
      });
    }
  };

  // Form reset handler
  const resetForm = () => {
    reset();
    setFileState({
      file: null,
      fileName: '',
      fileSize: 0,
      fileType: '',
      error: ''
    });
    setSelectedHierarchy({
      zone: null,
      section: null,
      artifact: null,
      subArtifact: null
    });
    setHierarchyState(prev => ({
      ...prev,
      sections: {},
      artifacts: {},
      subArtifacts: {}
    }));
    onClose();
  };

  // File size formatting utility
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={resetForm}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>
            Add a new document to the selected location
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          {/* Hierarchical Dropdowns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Zone Dropdown */}
            <div className="grid gap-2">
              <Label>Zone</Label>
              <Controller
                name="zone"
                control={control}
                render={({ field }) => (
                  <Select
                    value={selectedHierarchy.zone?._id}
                    onValueChange={(zoneId) => {
                      const selectedZone = hierarchyState.zones.find(z => z._id === zoneId);
                      setSelectedHierarchy(prev => ({ 
                        ...prev, 
                        zone: selectedZone,
                        section: null,
                        artifact: null,
                        subArtifact: null
                      }));
                      handleZoneChange(zoneId);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {hierarchyState.loading.zones ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        hierarchyState.zones.map(zone => (
                          <SelectItem key={zone._id} value={zone._id}>
                            {zone.zoneNumber}. {zone.zoneName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Section Dropdown */}
            <div className="grid gap-2">
              <Label>Section</Label>
              <Select
                value={selectedHierarchy.section?._id}
                onValueChange={(sectionId) => {
                  const selectedSection = hierarchyState.sections[selectedHierarchy.zone?._id]?.find(s => s._id === sectionId);
                  setSelectedHierarchy(prev => ({ 
                    ...prev, 
                    section: selectedSection,
                    artifact: null,
                    subArtifact: null
                  }));
                  handleSectionChange(sectionId);
                }}
                disabled={!selectedHierarchy.zone}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {hierarchyState.loading.sections ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    hierarchyState.sections[selectedHierarchy.zone?._id]?.map(section => (
                      <SelectItem key={section._id} value={section._id}>
                        {section.sectionNumber} {section.sectionName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Artifact Dropdown */}
            <div className="grid gap-2">
              <Label>Artifact</Label>
              <Select
                value={selectedHierarchy.artifact?._id}
                onValueChange={(artifactId) => {
                  const selectedArtifact = hierarchyState.artifacts[selectedHierarchy.section?._id]?.find(a => a._id === artifactId);
                  setSelectedHierarchy(prev => ({ 
                    ...prev, 
                    artifact: selectedArtifact,
                    subArtifact: null
                  }));
                  handleArtifactChange(artifactId);
                }}
                disabled={!selectedHierarchy.section}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Artifact" />
                </SelectTrigger>
                <SelectContent>
                  {hierarchyState.loading.artifacts ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    hierarchyState.artifacts[selectedHierarchy.section?._id]?.map(artifact => (
                      <SelectItem key={artifact._id} value={artifact._id}>
                        {artifact.artifactNumber} {artifact.artifactName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Sub-Artifact Dropdown */}
            <div className="grid gap-2">
              <Label>Sub-Artifact</Label>
              <Select
                value={selectedHierarchy.subArtifact?._id}
                onValueChange={(subArtifactId) => {
                  const selectedSubArtifact = hierarchyState.subArtifacts[selectedHierarchy.artifact?._id]?.find(sa => sa._id === subArtifactId);
                  setSelectedHierarchy(prev => ({ 
                    ...prev, 
                    subArtifact: selectedSubArtifact
                  }));
                }}
                disabled={!selectedHierarchy.artifact}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sub-Artifact" />
                </SelectTrigger>
                <SelectContent>
                  {hierarchyState.loading.subArtifacts ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    hierarchyState.subArtifacts[selectedHierarchy.artifact?._id]?.map(subArtifact => (
                      <SelectItem key={subArtifact._id} value={subArtifact._id}>
                        {subArtifact.subArtifactNumber} {subArtifact.subArtifactName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Document Title Input */}
          <div className="grid gap-2">
            <Label htmlFor="documentTitle">Document Title <span className="text-red-500">*</span></Label>
            <Input
              id="documentTitle"
              placeholder="e.g., Site Management Plan"
              {...register('documentTitle', { required: 'Document title is required' })}
            />
            {errors.documentTitle && (
              <p className="text-sm text-red-500">{errors.documentTitle.message}</p>
            )}
          </div>
          
          {/* Effective and Expiration Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="effectiveDate"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {effectiveDate ? format(effectiveDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={effectiveDate}
                    onSelect={handleEffectiveDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="expirationDate"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? format(expirationDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={handleExpirationDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Access Level */}
          <div className="grid gap-2">
            <Label htmlFor="accessLevel">Access Level</Label>
            <Select 
              value={accessLevel} 
              onValueChange={handleAccessLevelChange}
            >
              <SelectTrigger id="accessLevel">
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Restricted">Restricted</SelectItem>
                <SelectItem value="Confidential">Confidential</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator className="my-2" />
          
          <h4 className="text-sm font-semibold">Document Properties</h4>
          
          {/* Document Properties Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                placeholder="e.g., 1.0"
                {...register('version', { required: 'Version is required' })}
              />
              {errors.version && (
                <p className="text-sm text-red-500">{errors.version.message}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="study">Study</Label>
              <Input
                id="study"
                placeholder="e.g., CLINICAL-001"
                {...register('study')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="site">Site</Label>
              <Input
                id="site"
                placeholder="e.g., SITE-001"
                {...register('site')}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="e.g., US"
                {...register('country')}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="indication">Indication</Label>
            <Input
              id="indication"
              placeholder="e.g., Type 2 Diabetes"
              {...register('indication')}
            />
          </div>

          {/* File Upload Section */}
          <div className="grid gap-2">
            <Label htmlFor="fileUpload">Document File <span className="text-red-500">*</span></Label>
            <div 
              className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors" 
              onClick={() => document.getElementById('fileUpload').click()}
            >
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                {fileState.fileName ? fileState.fileName : 'Click to upload or drag and drop'}
              </p>
              {fileState.fileSize > 0 && (
                <p className="text-xs text-gray-400 mt-1">{formatFileSize(fileState.fileSize)}</p>
              )}
              <input
                id="fileUpload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {fileState.error && (
              <p className="text-sm text-red-500">{fileState.error}</p>
            )}
          </div>
          
          {/* Form Submission Buttons */}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;