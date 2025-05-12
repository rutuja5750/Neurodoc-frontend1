import { Document, AuditLogEntry } from './clinical-trials.service';

// Sample PDF files encoded in base64 (minimal valid PDFs)
const samplePDFs = {
  protocol: 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
             'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
             'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
             'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
             'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
             'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
             'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
             'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
             'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIFdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
             'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
             'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
             'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
             'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G',
  consent: 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
           'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
           'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
           'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
           'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
           'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
           'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
           'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
           'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIFdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
           'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
           'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
           'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
           'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G',
  safety: 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
          'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
          'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
          'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
          'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
          'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
          'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
          'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
          'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIFdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
          'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
          'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
          'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
          'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G'
};

// Sample documents with more diverse examples
export const mockDocuments = [
  {
    id: '1',
    url: `data:application/pdf;base64,${samplePDFs.protocol}`,
    metadata: {
      title: 'Clinical Trial Protocol v1.0',
      category: 'Protocol',
      version: '1.0',
      site: 'Site A',
      studyId: 'STUDY-001',
      country: 'United States',
      description: 'Initial protocol for Phase III clinical trial',
      keywords: ['protocol', 'phase3', 'clinical'],
      language: 'English',
      fileSize: '2.5 MB',
      fileType: 'pdf',
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-03-15T10:00:00Z',
      uploadedBy: 'John Doe',
      status: 'under_review',
      userRole: 'CRA',
      reviewStartedAt: '2024-03-15T11:00:00Z',
      reviewer: 'Jane Smith',
      priority: 'High',
      department: 'Clinical Operations',
      sponsor: 'PharmaCorp Inc.',
      phase: 'Phase III',
      estimatedDuration: '24 months',
      targetEnrollment: 500,
      currentEnrollment: 150,
      protocolVersion: '1.0',
      lastModifiedBy: 'John Doe',
      lastModifiedAt: '2024-03-15T10:00:00Z',
      reviewDeadline: '2024-03-22T10:00:00Z',
      reviewStatus: 'In Progress',
      reviewComments: 'Initial review pending',
      attachments: ['Appendix A', 'Appendix B'],
      relatedDocuments: ['2', '3']
    }
  },
  {
    id: '2',
    url: `data:application/pdf;base64,${samplePDFs.consent}`,
    metadata: {
      title: 'Informed Consent Form',
      category: 'Consent',
      version: '2.1',
      site: 'Site B',
      studyId: 'STUDY-001',
      country: 'United Kingdom',
      description: 'Updated informed consent form for participants',
      keywords: ['consent', 'participant', 'form'],
      language: 'English',
      fileSize: '1.8 MB',
      fileType: 'pdf',
      createdAt: '2024-03-14T09:00:00Z',
      updatedAt: '2024-03-14T09:00:00Z',
      uploadedBy: 'Alice Johnson',
      status: 'approved',
      userRole: 'Reviewer',
      approvedAt: '2024-03-14T15:00:00Z',
      approver: 'Dr. Robert Brown',
      priority: 'Medium',
      department: 'Regulatory Affairs',
      sponsor: 'PharmaCorp Inc.',
      phase: 'Phase III',
      estimatedDuration: '24 months',
      targetEnrollment: 500,
      currentEnrollment: 150,
      protocolVersion: '2.1',
      lastModifiedBy: 'Alice Johnson',
      lastModifiedAt: '2024-03-14T09:00:00Z',
      reviewDeadline: '2024-03-21T09:00:00Z',
      reviewStatus: 'Completed',
      reviewComments: 'All changes approved',
      attachments: ['Appendix C'],
      relatedDocuments: ['1', '3']
    }
  },
  {
    id: '3',
    url: `data:application/pdf;base64,${samplePDFs.safety}`,
    metadata: {
      title: 'Safety Report Q1 2024',
      category: 'Safety',
      version: '1.0',
      site: 'Site C',
      studyId: 'STUDY-001',
      country: 'Germany',
      description: 'Quarterly safety monitoring report',
      keywords: ['safety', 'report', 'monitoring'],
      language: 'English',
      fileSize: '3.2 MB',
      fileType: 'pdf',
      createdAt: '2024-03-13T14:00:00Z',
      updatedAt: '2024-03-13T14:00:00Z',
      uploadedBy: 'Michael Wilson',
      status: 'archived',
      userRole: 'Admin',
      archivedAt: '2024-03-13T16:00:00Z',
      archivedBy: 'Sarah Davis',
      priority: 'Low',
      department: 'Safety & Pharmacovigilance',
      sponsor: 'PharmaCorp Inc.',
      phase: 'Phase III',
      estimatedDuration: '24 months',
      targetEnrollment: 500,
      currentEnrollment: 150,
      protocolVersion: '1.0',
      lastModifiedBy: 'Michael Wilson',
      lastModifiedAt: '2024-03-13T14:00:00Z',
      reviewDeadline: '2024-03-20T14:00:00Z',
      reviewStatus: 'Archived',
      reviewComments: 'Report processed and archived',
      attachments: ['Appendix D', 'Appendix E'],
      relatedDocuments: ['1', '2']
    }
  },
  {
    id: '4',
    url: `data:application/pdf;base64,${samplePDFs.protocol}`,
    metadata: {
      title: 'Clinical Trial Protocol v1.1',
      category: 'Protocol',
      version: '1.1',
      site: 'Site D',
      studyId: 'STUDY-002',
      country: 'France',
      description: 'Updated protocol with new inclusion criteria',
      keywords: ['protocol', 'phase2', 'clinical'],
      language: 'English',
      fileSize: '2.8 MB',
      fileType: 'pdf',
      createdAt: '2024-03-16T09:00:00Z',
      updatedAt: '2024-03-16T09:00:00Z',
      uploadedBy: 'Emma Thompson',
      status: 'uploaded',
      userRole: 'CRA',
      priority: 'High',
      department: 'Clinical Operations',
      sponsor: 'MediTech Solutions',
      phase: 'Phase II',
      estimatedDuration: '18 months',
      targetEnrollment: 300,
      currentEnrollment: 0,
      protocolVersion: '1.1',
      lastModifiedBy: 'Emma Thompson',
      lastModifiedAt: '2024-03-16T09:00:00Z',
      reviewDeadline: '2024-03-23T09:00:00Z',
      reviewStatus: 'Pending',
      reviewComments: 'Awaiting initial review',
      attachments: ['Appendix F'],
      relatedDocuments: []
    }
  },
  {
    id: '5',
    url: `data:application/pdf;base64,${samplePDFs.consent}`,
    metadata: {
      title: 'Informed Consent Form - Spanish',
      category: 'Consent',
      version: '1.0',
      site: 'Site E',
      studyId: 'STUDY-002',
      country: 'Spain',
      description: 'Spanish version of informed consent form',
      keywords: ['consent', 'participant', 'form', 'spanish'],
      language: 'Spanish',
      fileSize: '1.9 MB',
      fileType: 'pdf',
      createdAt: '2024-03-16T11:00:00Z',
      updatedAt: '2024-03-16T11:00:00Z',
      uploadedBy: 'Carlos Rodriguez',
      status: 'under_review',
      userRole: 'Reviewer',
      reviewStartedAt: '2024-03-16T12:00:00Z',
      reviewer: 'Dr. Maria Garcia',
      priority: 'Medium',
      department: 'Regulatory Affairs',
      sponsor: 'MediTech Solutions',
      phase: 'Phase II',
      estimatedDuration: '18 months',
      targetEnrollment: 300,
      currentEnrollment: 0,
      protocolVersion: '1.0',
      lastModifiedBy: 'Carlos Rodriguez',
      lastModifiedAt: '2024-03-16T11:00:00Z',
      reviewDeadline: '2024-03-23T11:00:00Z',
      reviewStatus: 'In Progress',
      reviewComments: 'Translation review in progress',
      attachments: ['Appendix G'],
      relatedDocuments: ['4']
    }
  }
];

// Sample audit logs with more detailed entries
export const mockAuditLogs = {
  '1': [
    {
      id: '1-1',
      action: 'Document uploaded',
      actor: 'John Doe',
      timestamp: '2024-03-15T10:00:00Z',
      role: 'CRA',
      hasSignature: false,
      comment: 'Initial protocol upload',
      details: {
        fileSize: '2.5 MB',
        fileType: 'pdf',
        version: '1.0'
      }
    },
    {
      id: '1-2',
      action: 'Document sent for review',
      actor: 'John Doe',
      timestamp: '2024-03-15T11:00:00Z',
      role: 'CRA',
      hasSignature: true,
      comment: 'Ready for review by medical team',
      details: {
        assignedTo: 'Jane Smith',
        deadline: '2024-03-22T10:00:00Z',
        priority: 'High'
      }
    },
    {
      id: '1-3',
      action: 'Review started',
      actor: 'Jane Smith',
      timestamp: '2024-03-15T11:30:00Z',
      role: 'Reviewer',
      hasSignature: false,
      comment: 'Beginning initial review of protocol',
      details: {
        reviewType: 'Initial Review',
        estimatedCompletion: '2024-03-18T10:00:00Z'
      }
    }
  ],
  '2': [
    {
      id: '2-1',
      action: 'Document uploaded',
      actor: 'Alice Johnson',
      timestamp: '2024-03-14T09:00:00Z',
      role: 'CRA',
      hasSignature: false,
      comment: 'Updated consent form upload',
      details: {
        fileSize: '1.8 MB',
        fileType: 'pdf',
        version: '2.1'
      }
    },
    {
      id: '2-2',
      action: 'Document approved',
      actor: 'Dr. Robert Brown',
      timestamp: '2024-03-14T15:00:00Z',
      role: 'Reviewer',
      hasSignature: true,
      comment: 'All changes reviewed and approved',
      details: {
        approvalType: 'Final Approval',
        changesRequested: false,
        approvalDate: '2024-03-14T15:00:00Z'
      }
    }
  ],
  '3': [
    {
      id: '3-1',
      action: 'Document uploaded',
      actor: 'Michael Wilson',
      timestamp: '2024-03-13T14:00:00Z',
      role: 'CRA',
      hasSignature: false,
      comment: 'Q1 safety report upload',
      details: {
        fileSize: '3.2 MB',
        fileType: 'pdf',
        reportPeriod: 'Q1 2024'
      }
    },
    {
      id: '3-2',
      action: 'Document archived',
      actor: 'Sarah Davis',
      timestamp: '2024-03-13T16:00:00Z',
      role: 'Admin',
      hasSignature: true,
      comment: 'Report processed and archived',
      details: {
        archiveReason: 'Retention Period Completed',
        archiveLocation: 'Secure Storage',
        retentionPeriod: '10 years'
      }
    }
  ],
  '4': [
    {
      id: '4-1',
      action: 'Document uploaded',
      actor: 'Emma Thompson',
      timestamp: '2024-03-16T09:00:00Z',
      role: 'CRA',
      hasSignature: false,
      comment: 'New protocol version upload',
      details: {
        fileSize: '2.8 MB',
        fileType: 'pdf',
        version: '1.1',
        changes: 'Updated inclusion criteria'
      }
    }
  ],
  '5': [
    {
      id: '5-1',
      action: 'Document uploaded',
      actor: 'Carlos Rodriguez',
      timestamp: '2024-03-16T11:00:00Z',
      role: 'Reviewer',
      hasSignature: false,
      comment: 'Spanish consent form upload',
      details: {
        fileSize: '1.9 MB',
        fileType: 'pdf',
        language: 'Spanish',
        translationVersion: '1.0'
      }
    },
    {
      id: '5-2',
      action: 'Review started',
      actor: 'Dr. Maria Garcia',
      timestamp: '2024-03-16T12:00:00Z',
      role: 'Reviewer',
      hasSignature: false,
      comment: 'Beginning translation review',
      details: {
        reviewType: 'Translation Review',
        language: 'Spanish',
        estimatedCompletion: '2024-03-19T12:00:00Z'
      }
    }
  ]
}; 