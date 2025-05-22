import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

const clinicalTrialsService = {
  // Basic Document Operations
  async getDocuments() {
    try {
      const response = await axios.get(`${API_URL}/documents`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getDocument(documentId) {
    try {
      const response = await axios.get(`${API_URL}/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async uploadDocument(file, metadata) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));
      
      const response = await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Document Review Workflow
  async addReviewer(documentId, reviewer) {
    try {
      const response = await axios.post(`${API_URL}/documents/${documentId}/reviewers`, reviewer);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async updateReview(documentId, reviewerId, reviewData) {
    try {
      const response = await axios.put(
        `${API_URL}/documents/${documentId}/reviewers/${reviewerId}`,
        reviewData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getReviewers(documentId) {
    try {
      const response = await axios.get(`${API_URL}/documents/${documentId}/reviewers`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async updateDocumentStatus(documentId, status, metadata = {}) {
    try {
      const response = await axios.put(`${API_URL}/documents/${documentId}/status`, {
        status,
        metadata
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async sendForReview(documentId) {
    try {
      const response = await axios.post(`${API_URL}/documents/${documentId}/send-for-review`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async updateDocument(documentId, data) {
    return axios.put(`${API_URL}/documents/${documentId}`, data)
      .then(res => res.data)
      .catch(err => { throw err.response?.data || err; });
  },

  submitDocumentApproval: async (documentId, approvalData) => {
    try {
      const response = await fetch(`${API_URL}/documents/${documentId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(approvalData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit approval');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting approval:', error);
      throw error;
    }
  },

  getDocumentApprovals: async (documentId) => {
    try {
      const response = await fetch(`${API_URL}/documents/${documentId}/approvals`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch approvals');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching approvals:', error);
      throw error;
    }
  },

  // Document approval
  async approveDocument(documentId, comments) {
    const response = await axios.post(`${API_URL}/documents/${documentId}/approve`, { comments });
    return response.data;
  },

  // Document rejection
  async rejectDocument(documentId, comments) {
    const response = await axios.post(`${API_URL}/documents/${documentId}/reject`, { comments });
    return response.data;
  },

  // Document archiving
  async archiveDocument(documentId, reason) {
    const response = await axios.post(`${API_URL}/documents/${documentId}/archive`, { reason });
    return response.data;
  },

  // Bulk archive documents
  async bulkArchiveDocuments(documentIds, reason) {
    const response = await axios.post(`${API_URL}/documents/bulk-archive`, { documentIds, reason });
    return response.data;
  },

  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error(error.message || 'An error occurred');
    }
  }
};

export default clinicalTrialsService; 