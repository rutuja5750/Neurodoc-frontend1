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

// Predefined list of zone names
const zoneNames = [
  "Central Trial Documents",
  "Site Management",
  "Statistics",
  "Regulatory",
  "IRB or IEC and other Approvals",
  "Trial Management",
  "IP and Trial Supplies",
  "Safety Reporting",
  "Central and Local Testing",
  "Third parties",
  "Data Management"
];

// Predefined list of section names
const sectionNames = [
  "Product and Trial Documentation",
  "Site Set-up",
  "Statistics Oversight",
  "Randomization",
  "Analysis",
  "Report",
  "General",
  "Subject Documentation",
  "Trial Approval",
  "Other Committees",
  "IRB or IEC Trial Approval",
  "Trial Status Reporting",
  "Trial Team",
  "Trial Committee",
  "Meetings",
  "Trial Oversight",
  "Reports",
  "Investigational Medicinal Product",
  "Site Selection",
  "Site Initiation",
  "Site Management",
  "IP Documentation",
  "IP Release Process Documentation",
  "IP Allocation Documentation",
  "Storage",
  "Non-IP Documentation",
  "Interactive Response Technology",
  "Safety Documentation",
  "Facility Documentation",
  "Sample Documentation",
  "Third Party Oversight",
  "Third Party Set-up",
  "Data Management Oversight",
  "Data Capture",
  "Database",
  "EDC Management"
];

// Predefined list of artifact names
const artifactNames = [
  "Trial Master File Plan",
  "Trial Management Plan",
  "Quality Plan",
  "List of SOPs Current During Trial",
  "Operational Procedure Manual",
  "Recruitment Plan",
  "Communication Plan",
  "Monitoring Plan",
  "Medical Monitoring Plan",
  "Publication Policy",
  "Debarment Statement",
  "Trial Status Report",
  "Investigator Newsletter",
  "Audit Certificate",
  "Filenote Master List",
  "Risk Management Plan",
  "Vendor Management Plan",
  "Roles and Responsibility Matrix",
  "Transfer of Regulatory Obligations",
  "Operational Oversight",
  "Trial Team Details",
  "Trial Team Curriculum Vitae",
  "Committee Process",
  "Committee Member List",
  "Committee Output",
  "Committee Member Curriculum Vitae",
  "Committee Member Financial Disclosure Form",
  "Committee Member Contract",
  "Committee Member Confidentiality Disclosure Agreement",
  "Kick-off Meeting Material",
  "Trial Team Training Material",
  "Investigators Meeting Material",
  "Trial Team Evidence of Training",
  "Relevant Communications",
  "Tracking Information",
  "Other Meeting Material",
  "Filenote",
  "Investigator's Brochure",
  "Protocol",
  "Protocol Synopsis",
  "Protocol Amendment",
  "Financial Disclosure Summary",
  "Insurance",
  "Sample Case Report Form",
  "Report of Prior Investigations",
  "Marketed Product Material",
  "Subject Diary",
  "Subject Questionnaire",
  "Informed Consent Form",
  "Subject Information Sheet",
  "Subject Participation Card",
  "Advertisements for Subject Recruitment",
  "Other Information Given to Subjects",
  "Clinical Study Report",
  "Bioanalytical Report",
  "Regulatory Submission",
  "Regulatory Authority Decision",
  "Notification of Regulatory Identification Number",
  "Public Registration",
  "Import or Export License Application",
  "Import or Export Documentation",
  "Notification of Safety or Trial Information",
  "Regulatory Progress Report",
  "Regulatory Notification of Trial Termination",
  "IRB or IEC Submission",
  "IRB or IEC Decision",
  "IRB or IEC Composition",
  "IRB or IEC Documentation of Non-Voting Status",
  "IRB or IEC Compliance Documentation",
  "Other Submissions",
  "Other Approvals",
  "Notification to IRB or IEC of Safety Information",
  "IRB or IEC Progress Report",
  "IRB or IEC Notification of Trial Termination",
  "Site Contact Details",
  "Confidentiality Agreement",
  "Feasibility Documentation",
  "Pre Trial Monitoring Report",
  "Sites Evaluated but not Selected",
  "Acceptance of Investigator Brochure",
  "Protocol Signature Page",
  "Protocol Amendment Signature Page",
  "Principal Investigator Curriculum Vitae",
  "Sub-Investigator Curriculum Vitae",
  "Other Curriculum Vitae",
  "Site Staff Qualification Supporting Information",
  "Form FDA 1572",
  "Investigator Regulatory Agreement",
  "Financial Disclosure Form",
  "Data Privacy Agreement",
  "Clinical Trial Agreement",
  "Indemnity",
  "Other Financial Agreement",
  "IP Site Release Documentation",
  "Site Signature Sheet",
  "Investigators Agreement (Device)",
  "Coordinating Investigator Documentation",
  "Trial Initiation Monitoring Report",
  "Site Training Material",
  "Site Evidence of Training",
  "Subject Log",
  "Source Data Verification",
  "Monitoring Visit Report",
  "Visit Log",
  "Additional Monitoring Activity",
  "Protocol Deviations",
  "Financial Documentation",
  "Final Trial Close Out Monitoring Report",
  "Notification to Investigators of Safety Information",
  "Subject Identification Log",
  "Source Data",
  "Monitoring Visit Follow-up Documentation",
  "Subject Eligibility Verification Forms and Worksheets",
  "IP Supply Plan",
  "IP Instructions for Handling",
  "IP Sample Label",
  "IP Shipment Documentation",
  "IP Accountability Documentation",
  "IP Transfer Documentation",
  "IP Re-labeling Documentation",
  "IP Recall Documentation",
  "IP Quality Complaint Form",
  "IP Return Documentation",
  "IP Certificate of Destruction",
  "IP Retest and Expiry Documentation",
  "QP (Qualified Person) Certification",
  "IP Regulatory Release Documentation",
  "IP Verification Statements",
  "Certificate of Analysis",
  "IP Treatment Allocation Documentation",
  "IP Unblinding Plan",
  "IP Treatment Decoding Documentation",
  "IP Storage Condition Documentation",
  "IP Storage Condition Excursion Documentation",
  "Maintenance Logs",
  "Non-IP Supply Plan",
  "Non-IP Shipment Documentation",
  "Non-IP Return Documentation",
  "Non-IP Storage Documentation",
  "IRT User Requirement Specification",
  "IRT Validation Certification",
  "IRT User Acceptance Testing (UAT) Certification",
  "IRT User Manual",
  "IRT User Account Management",
  "Safety Management Plan",
  "Pharmacovigilance Database Line Listing",
  "Expedited Safety Report",
  "SAE Report",
  "Pregnancy Report",
  "Special Events of Interest",
  "Certification or Accreditation",
  "Laboratory Validation Documentation",
  "Laboratory Results Documentation",
  "Normal Ranges",
  "Manual",
  "Supply Import Documentation",
  "Head of Facility Curriculum Vitae",
  "Standardization Methods",
  "Specimen Label",
  "Shipment Records",
  "Sample Storage Condition Log",
  "Sample Import or Export Documentation",
  "Record of Retained Samples",
  "Qualification and Compliance",
  "Third Party Curriculum Vitae",
  "Ongoing Third Party Oversight",
  "Confidentiality Agreement",
  "Vendor Selection",
  "Contractual Agreement",
  "Data Management Plan",
  "CRF Completion Requirements",
  "Annotated CRF",
  "Documentation of Corrections to Entered Data",
  "Final Subject Data",
  "Database Requirements",
  "Edit Check Plan",
  "Edit Check Programming",
  "Edit Check Testing",
  "Approval for Database Activation",
  "External Data Transfer Specifications",
  "Data Entry Guidelines (Paper)",
  "SAE Reconciliation",
  "Dictionary Coding",
  "Data Review Documentation",
  "Database Lock and Unlock Approval",
  "Database Change Control",
  "System Account Management",
  "Technical Design Document",
  "Validation Documentation",
  "Statistical Analysis Plan",
  "Sample Size Calculation",
  "Randomization Plan",
  "Randomization Procedure",
  "Master Randomization List",
  "Randomization Programming",
  "Randomization Sign Off",
  "End of Trial or Interim Unblinding",
  "Data Definitions for Analysis Datasets",
  "Analysis QC Documentation",
  "Interim Analysis Raw Datasets",
  "Interim Analysis Programs",
  "Interim Analysis Datasets",
  "Interim Analysis Output",
  "Final Analysis Raw Datasets",
  "Final Analysis Programs",
  "Final Analysis Datasets",
  "Final Analysis Output",
  "Subject Evaluability Criteria and Subject Classification",
  "Interim Statistical Report(s)",
  "Statistical Report"
];

// Predefined list of sub-artifact names
const subArtifactNames = [
  "Version 1.0",
  "Version 2.0",
  "Version 3.0",
  "Draft",
  "Final",
  "Approved",
  "Pending Review",
  "Under Review",
  "Revision 1",
  "Revision 2",
  "Revision 3",
  "Initial Submission",
  "Updated Submission",
  "Final Submission",
  "Interim Report",
  "Final Report",
  "Annual Report",
  "Quarterly Report",
  "Monthly Report",
  "Weekly Report",
  "Daily Report",
  "Summary Report",
  "Detailed Report",
  "Technical Report",
  "Progress Report",
  "Status Report",
  "Compliance Report",
  "Quality Report",
  "Safety Report",
  "Efficacy Report"
];

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
                        zoneNames.map((zoneName, index) => (
                          <SelectItem key={index} value={zoneName}>
                            {zoneName}
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
                    sectionNames.map((sectionName, index) => (
                      <SelectItem key={index} value={sectionName}>
                        {sectionName}
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
                    artifactNames.map((artifactName, index) => (
                      <SelectItem key={index} value={artifactName}>
                        {artifactName}
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
                    subArtifactNames.map((subArtifactName, index) => (
                      <SelectItem key={index} value={subArtifactName}>
                        {subArtifactName}
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