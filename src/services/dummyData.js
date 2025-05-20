export const dummyUsers = [
  {
    _id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'ADMIN',
    status: 'ACTIVE',
    organization: 'PharmaCorp',
    department: 'Clinical Operations',
    phoneNumber: '+1-555-0123',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'SPONSOR',
    status: 'ACTIVE',
    organization: 'MedTech Inc',
    department: 'Regulatory Affairs',
    phoneNumber: '+1-555-0124',
    createdAt: '2024-01-16T11:00:00Z'
  },
  {
    _id: '3',
    email: 'mike.wilson@example.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'INVESTIGATOR',
    status: 'PENDING',
    organization: 'City Hospital',
    department: 'Research',
    phoneNumber: '+1-555-0125',
    createdAt: '2024-01-17T12:00:00Z'
  }
];

export const dummySponsors = [
  {
    _id: '1',
    sponsorId: 'SP001',
    name: 'PharmaCorp International',
    type: 'PHARMACEUTICAL',
    status: 'ACTIVE',
    contactInfo: {
      address: {
        street: '123 Pharma Street',
        city: 'Boston',
        state: 'MA',
        country: 'USA',
        postalCode: '02108'
      },
      phone: '+1-555-0001',
      email: 'contact@pharmacorp.com',
      website: 'https://pharmacorp.com'
    },
    regulatoryInfo: {
      dunsNumber: '123456789',
      feiNumber: '987654321',
      gcpComplianceStatus: 'COMPLIANT',
      lastAuditDate: '2024-01-15T00:00:00Z',
      auditFindings: [
        {
          date: '2024-01-15T00:00:00Z',
          findings: 'Minor documentation issues',
          severity: 'LOW'
        }
      ]
    },
    contacts: [
      {
        name: 'John Smith',
        role: 'Regulatory Affairs Manager',
        email: 'john.smith@pharmacorp.com',
        phone: '+1-555-0002',
        isPrimary: true
      }
    ]
  },
  {
    _id: '2',
    sponsorId: 'SP002',
    name: 'MedTech Solutions',
    type: 'MEDICAL_DEVICE',
    status: 'ACTIVE',
    contactInfo: {
      address: {
        street: '456 Tech Avenue',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94105'
      },
      phone: '+1-555-0003',
      email: 'info@medtech.com',
      website: 'https://medtech.com'
    },
    regulatoryInfo: {
      dunsNumber: '234567890',
      feiNumber: '876543210',
      gcpComplianceStatus: 'PENDING_REVIEW',
      lastAuditDate: '2024-01-10T00:00:00Z',
      auditFindings: []
    },
    contacts: [
      {
        name: 'Sarah Johnson',
        role: 'Clinical Operations Director',
        email: 'sarah.j@medtech.com',
        phone: '+1-555-0004',
        isPrimary: true
      }
    ]
  },
  {
    _id: '3',
    sponsorId: 'SP003',
    name: 'BioResearch Labs',
    type: 'BIOTECHNOLOGY',
    status: 'PENDING_APPROVAL',
    contactInfo: {
      address: {
        street: '789 Research Park',
        city: 'San Diego',
        state: 'CA',
        country: 'USA',
        postalCode: '92121'
      },
      phone: '+1-555-0005',
      email: 'contact@bioresearch.com',
      website: 'https://bioresearch.com'
    },
    regulatoryInfo: {
      dunsNumber: '345678901',
      feiNumber: '765432109',
      gcpComplianceStatus: 'NON_COMPLIANT',
      lastAuditDate: '2024-01-05T00:00:00Z',
      auditFindings: [
        {
          date: '2024-01-05T00:00:00Z',
          findings: 'Major protocol deviations',
          severity: 'HIGH'
        }
      ]
    },
    contacts: [
      {
        name: 'Michael Brown',
        role: 'Quality Assurance Manager',
        email: 'michael.b@bioresearch.com',
        phone: '+1-555-0006',
        isPrimary: true
      }
    ]
  }
]; 