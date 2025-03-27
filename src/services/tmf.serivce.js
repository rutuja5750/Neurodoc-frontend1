import { config } from '../config/config';
import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: `${config.API_URL}/api/tmf`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Zone endpoints
export const zoneService = {
  getAll: async () => (await api.get('/zones')).data,
  getById: async (id) => (await api.get(`/zones/${id}`)).data,
  create: async (zoneData) => (await api.post('/zones', zoneData)).data,
  update: async (id, zoneData) => (await api.put(`/zones/${id}`, zoneData)).data,
  delete: async (id) => (await api.delete(`/zones/${id}`)).data,
};

// Section endpoints
export const sectionService = {
  getAllByZone: async (zoneId) => (await api.get(`/zones/${zoneId}/sections`)).data,
  getById: async (id) => (await api.get(`/sections/${id}`)).data,
  create: async (zoneId, sectionData) => (await api.post(`/zones/${zoneId}/sections`, sectionData)).data,
  update: async (id, sectionData) => (await api.put(`/sections/${id}`, sectionData)).data,
  delete: async (id) => (await api.delete(`/sections/${id}`)).data,
};

// Artifact endpoints
export const artifactService = {
  getAllBySection: async (sectionId) => (await api.get(`/sections/${sectionId}/artifacts`)).data,
  getById: async (id) => (await api.get(`/artifacts/${id}`)).data,
  create: async (sectionId, artifactData) => (await api.post(`/sections/${sectionId}/artifacts`, artifactData)).data,
  update: async (id, artifactData) => (await api.put(`/artifacts/${id}`, artifactData)).data,
  delete: async (id) => (await api.delete(`/artifacts/${id}`)).data,
};

// SubArtifact endpoints
export const subArtifactService = {
  getAllByArtifact: async (artifactId) => (await api.get(`/artifacts/${artifactId}/subartifacts`)).data,
  getById: async (id) => (await api.get(`/subartifacts/${id}`)).data,
  create: async (artifactId, subArtifactData) => (await api.post(`/artifacts/${artifactId}/subartifacts`, subArtifactData)).data,
  update: async (id, subArtifactData) => (await api.put(`/subartifacts/${id}`, subArtifactData)).data,
  delete: async (id) => (await api.delete(`/subartifacts/${id}`)).data,
};


const documentService = {
  create: async (userId, formData) => {
      try {
          const response = await axios.post(`${config.API_URL}/api/tmf/documents/${userId}`, formData, {
              headers: { "Content-Type": "multipart/form-data" }
          });
          return response.data;
      } catch (error) {
          console.error("Error in documentService.create:", error);
          throw error;
      }
  },

  getAllDocuments: async () => {
      try {
          const response = await axios.get(`${config.API_URL}/api/tmf/documents`);
          return response.data;
      } catch (error) {
          console.error("Error in documentService.getAllDocuments:", error);
          throw error;
      }
  }
};




// Export a combined service object
const tmfService = {
  zones: zoneService,
  sections: sectionService,
  artifacts: artifactService,
  subArtifacts: subArtifactService,
  document: documentService,
};

export default tmfService;
