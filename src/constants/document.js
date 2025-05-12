export const DOCUMENT_STATUS = {
  DRAFT: 'DRAFT',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  FINAL: 'FINAL',
  ARCHIVED: 'ARCHIVED'
};

export const DOCUMENT_TYPE = {
  PROTOCOL: 'PROTOCOL',
  CONSENT: 'CONSENT',
  REPORT: 'REPORT',
  OTHER: 'OTHER'
};

export const WORKFLOW_ACTIONS = {
  SUBMIT_FOR_REVIEW: 'SUBMIT_FOR_REVIEW',
  APPROVE_REVIEW: 'APPROVE_REVIEW',
  REJECT_REVIEW: 'REJECT_REVIEW',
  APPROVE_DOCUMENT: 'APPROVE_DOCUMENT',
  REJECT_DOCUMENT: 'REJECT_DOCUMENT',
  FINALIZE: 'FINALIZE',
  ARCHIVE: 'ARCHIVE'
};

export const STATUS_CONFIG = {
  [DOCUMENT_STATUS.DRAFT]: { 
    variant: 'secondary', 
    label: 'Draft', 
    icon: 'FileCheck' 
  },
  [DOCUMENT_STATUS.IN_REVIEW]: { 
    variant: 'warning', 
    label: 'In Review', 
    icon: 'AlertCircle' 
  },
  [DOCUMENT_STATUS.APPROVED]: { 
    variant: 'success', 
    label: 'Approved', 
    icon: 'CheckCircle' 
  },
  [DOCUMENT_STATUS.FINAL]: { 
    variant: 'default', 
    label: 'Final', 
    icon: 'FileCheck' 
  },
  [DOCUMENT_STATUS.ARCHIVED]: { 
    variant: 'destructive', 
    label: 'Archived', 
    icon: 'Archive' 
  }
}; 