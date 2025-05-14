import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Dummy data for development/demo
const dummyZones = [
  { id: 1, name: "Core Documents", code: "CORE", description: "Essential TMF documents" },
  { id: 2, name: "Country Documents", code: "COUNTRY", description: "Country-specific TMF documents" },
  { id: 3, name: "Site Documents", code: "SITE", description: "Site-level TMF documents" },
  { id: 4, name: "Investigator Documents", code: "INVESTIGATOR", description: "Investigator-specific TMF documents" }
];

const dummyDocuments = [
  {
    id: 1,
    name: "Protocol v1.0",
    status: "APPROVED",
    version: "1.0",
    study: "STUDY-2024-001",
    country: "US",
    site: "Site 101",
    createdBy: "Dr. Alice Smith",
    zone: "Core Documents",
    section: "Protocol",
    artifact: "Protocol",
    subArtifact: "Initial",
    createdAt: "4/15/2024",
    expirationDate: "4/15/2026"
  },
  {
    id: 2,
    name: "Informed Consent Form",
    status: "IN_REVIEW",
    version: "2.1",
    study: "STUDY-2024-001",
    country: "US",
    site: "Site 101",
    createdBy: "Jane Doe",
    zone: "Core Documents",
    section: "Consent",
    artifact: "ICF",
    subArtifact: "Adult",
    createdAt: "4/20/2024",
    expirationDate: "4/20/2026"
  },
  {
    id: 3,
    name: "Site Initiation Checklist",
    status: "DRAFT",
    version: "0.9",
    study: "STUDY-2024-002",
    country: "UK",
    site: "Site 202",
    createdBy: "John Lee",
    zone: "Site Documents",
    section: "Initiation",
    artifact: "Checklist",
    subArtifact: "Site",
    createdAt: "5/1/2024",
    expirationDate: "5/1/2025"
  },
  {
    id: 4,
    name: "Investigator CV",
    status: "APPROVED",
    version: "1.2",
    study: "STUDY-2024-003",
    country: "DE",
    site: "Site 303",
    createdBy: "Dr. Eva Müller",
    zone: "Investigator Documents",
    section: "CV",
    artifact: "Curriculum Vitae",
    subArtifact: "Investigator",
    createdAt: "3/10/2024",
    expirationDate: "3/10/2027"
  },
  {
    id: 5,
    name: "Financial Disclosure Form",
    status: "IN_REVIEW",
    version: "1.0",
    study: "STUDY-2024-002",
    country: "UK",
    site: "Site 202",
    createdBy: "Jane Doe",
    zone: "Site Documents",
    section: "Finance",
    artifact: "Disclosure",
    subArtifact: "Financial",
    createdAt: "5/2/2024",
    expirationDate: "5/2/2025"
  },
  {
    id: 6,
    name: "Ethics Committee Approval",
    status: "APPROVED",
    version: "1.0",
    study: "STUDY-2024-001",
    country: "US",
    site: "Site 101",
    createdBy: "Dr. Alice Smith",
    zone: "Core Documents",
    section: "Ethics",
    artifact: "Approval",
    subArtifact: "Committee",
    createdAt: "4/25/2024",
    expirationDate: "4/25/2026"
  },
  {
    id: 7,
    name: "Monitoring Visit Report",
    status: "DRAFT",
    version: "0.8",
    study: "STUDY-2024-003",
    country: "DE",
    site: "Site 303",
    createdBy: "John Lee",
    zone: "Site Documents",
    section: "Monitoring",
    artifact: "Report",
    subArtifact: "Visit",
    createdAt: "5/5/2024",
    expirationDate: "5/5/2025"
  },
  {
    id: 8,
    name: "Delegation Log",
    status: "IN_REVIEW",
    version: "1.0",
    study: "STUDY-2024-001",
    country: "US",
    site: "Site 101",
    createdBy: "Jane Doe",
    zone: "Core Documents",
    section: "Delegation",
    artifact: "Log",
    subArtifact: "Staff",
    createdAt: "4/30/2024",
    expirationDate: "4/30/2026"
  },
  {
    id: 9,
    name: "Insurance Certificate",
    status: "APPROVED",
    version: "1.0",
    study: "STUDY-2024-002",
    country: "UK",
    site: "Site 202",
    createdBy: "Dr. Eva Müller",
    zone: "Country Documents",
    section: "Insurance",
    artifact: "Certificate",
    subArtifact: "Site",
    createdAt: "5/3/2024",
    expirationDate: "5/3/2025"
  },
  {
    id: 10,
    name: "Subject Enrollment Log",
    status: "DRAFT",
    version: "0.7",
    study: "STUDY-2024-003",
    country: "DE",
    site: "Site 303",
    createdBy: "John Lee",
    zone: "Site Documents",
    section: "Enrollment",
    artifact: "Log",
    subArtifact: "Subject",
    createdAt: "5/6/2024",
    expirationDate: "5/6/2025"
  }
];

const tmfService = {
  zones: {
    getAll: async () => {
      // Return dummy zones for development/demo
      return dummyZones;
      // Uncomment below for real API
      // try {
      //   const response = await axios.get(`${API_URL}/tmf/zones`);
      //   return response.data;
      // } catch (error) {
      //   console.error('Error fetching zones:', error);
      //   throw error;
      // }
    },

    create: async (zoneData) => {
      try {
        const response = await axios.post(`${API_URL}/tmf/zones`, zoneData);
        return response.data;
      } catch (error) {
        console.error('Error creating zone:', error);
        throw error;
      }
    },

    update: async (zoneId, zoneData) => {
      try {
        const response = await axios.put(`${API_URL}/tmf/zones/${zoneId}`, zoneData);
        return response.data;
      } catch (error) {
        console.error('Error updating zone:', error);
        throw error;
      }
    },

    delete: async (zoneId) => {
      try {
        const response = await axios.delete(`${API_URL}/tmf/zones/${zoneId}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting zone:', error);
        throw error;
      }
    }
  },

  documents: {
    getAll: async (zoneId) => {
      // Return dummy documents for development/demo
      return dummyDocuments;
      // Uncomment below for real API
      // try {
      //   const response = await axios.get(`${API_URL}/tmf/zones/${zoneId}/documents`);
      //   return response.data;
      // } catch (error) {
      //   console.error('Error fetching documents:', error);
      //   throw error;
      // }
    },

    upload: async (zoneId, file, metadata) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify(metadata));

        const response = await axios.post(`${API_URL}/tmf/zones/${zoneId}/documents`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
      }
    },

    download: async (documentId) => {
      try {
        const response = await axios.get(`${API_URL}/tmf/documents/${documentId}/download`, {
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        console.error('Error downloading document:', error);
        throw error;
      }
    },

    update: async (documentId, metadata) => {
      try {
        const response = await axios.put(`${API_URL}/tmf/documents/${documentId}`, metadata);
        return response.data;
      } catch (error) {
        console.error('Error updating document:', error);
        throw error;
      }
    },

    delete: async (documentId) => {
      try {
        const response = await axios.delete(`${API_URL}/tmf/documents/${documentId}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
      }
    },

    search: async (query, filters) => {
      try {
        const response = await axios.get(`${API_URL}/tmf/documents/search`, {
          params: {
            query,
            ...filters,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error searching documents:', error);
        throw error;
      }
    }
  }
};

export default tmfService; 