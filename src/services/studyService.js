import axios from 'axios';
import { config } from '../config/config';

const API_URL = `${config.API_URL}/api/studies`;

export const studyService = {
  // Create a new study
  createStudy: async (studyData) => {
    try {
      const response = await axios.post(API_URL, studyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all studies with pagination and filtering
  getStudies: async ({ page = 1, limit = 10, status, search } = {}) => {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (status) params.append('status', status);
      if (search) params.append('search', search);

      const response = await axios.get(`${API_URL}?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single study by ID
  getStudy: async (studyId) => {
    try {
      const response = await axios.get(`${API_URL}/${studyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a study
  updateStudy: async (studyId, studyData) => {
    try {
      const response = await axios.put(`${API_URL}/${studyId}`, studyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a study
  deleteStudy: async (studyId) => {
    try {
      const response = await axios.delete(`${API_URL}/${studyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 