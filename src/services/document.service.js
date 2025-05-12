import { config } from '../config/config';
import axios from 'axios';

const API_URL = `${config.API_URL}/api/documents`;

const documentService = {
    create: async (userId, formData) => {
        try {
            const response = await axios.post(`${API_URL}/${userId}`, formData, {
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
            const response = await axios.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error("Error in documentService.getAllDocuments:", error);
            throw error;
        }
    },
};

export default documentService;
  