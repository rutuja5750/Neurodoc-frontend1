import { config } from '../config/config';
import axios from 'axios';

const API_URL = `${config.API_URL}/api/tmf/documents`

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

    getDocument: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error in documentService.getDocument:", error);
            throw error;
        }
    },

    // Get all comments for a document
    getComments: async (documentId) => {
        try {
            const response = await axios.get(`${API_URL}/${documentId}/comments`);
            return response.data;
        } catch (error) {
            console.error("Error in documentService.getComments:", error);
            throw error;
        }
    },

    // Add a comment to a document
    addComment: async (documentId, content, userId) => {
        try {
            const response = await axios.post(`${API_URL}/${documentId}/comments`, {
                content,
                userId
            });
            return response.data;
        } catch (error) {
            console.error("Error in documentService.addComment:", error);
            throw error;
        }
    },

    // Add a reply to a comment
    addReply: async (documentId, commentId, content, userId) => {
        try {
            const response = await axios.post(`${API_URL}/${documentId}/comments/${commentId}/replies`, {
                content,
                userId
            });
            return response.data;
        } catch (error) {
            console.error("Error in documentService.addReply:", error);
            throw error;
        }
    }
};

export default documentService;
  