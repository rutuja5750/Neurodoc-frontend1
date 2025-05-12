import axios from 'axios';

// Update the base URL to point to the backend server
const API_BASE_URL = '/api';

export const searchNPI = async (params) => {
  const response = await axios.get(`${API_BASE_URL}/npi/search`, { params });
  return response.data;
};

export const getNPIDetails = async (npiNumber) => {
  const response = await axios.get(`${API_BASE_URL}/npi/${npiNumber}`);
  return response.data;
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 