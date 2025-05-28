import api from './api';

const sponsorService = {
  // Get all sponsors with pagination and filters
  getSponsors: async (params = {}) => {
    const response = await api.get('/sponsors', { params });
    return response.data;
  },

  // Get a single sponsor by ID
  getSponsor: async (id) => {
    const response = await api.get(`/sponsors/${id}`);
    return response.data;
  },

  // Create a new sponsor
  createSponsor: async (sponsorData) => {
    const response = await api.post('/sponsors', sponsorData);
    return response.data;
  },

  // Update an existing sponsor
  updateSponsor: async (id, sponsorData) => {
    const response = await api.put(`/sponsors/${id}`, sponsorData);
    return response.data;
  },

  // Delete a sponsor
  deleteSponsor: async (id) => {
    const response = await api.delete(`/sponsors/${id}`);
    return response.data;
  },

  // Send invitation to join sponsor
  sendInvitation: async (sponsorId, invitationData) => {
    const response = await api.post(`/sponsors/${sponsorId}/invitations`, invitationData);
    return response.data;
  },

  // Remove pending invitation
  removeInvitation: async (sponsorId, inviteId) => {
    const response = await api.delete(`/sponsors/${sponsorId}/invitations/${inviteId}`);
    return response.data;
  }
};

export default sponsorService; 