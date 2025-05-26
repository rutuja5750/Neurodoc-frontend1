import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:3000/api/tmf';

export interface Document {
  id: string;
  title: string;
  status: string;
  lastModified: string;
  // Add other document properties as needed
}

export interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details: string;
  // Add other audit log properties as needed
}

class ClinicalTrialsService {
    async getDocuments() {
        try {
            const response = await axios.get(`${API_URL}/documents`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async uploadDocument(file: File, metadata: {
        title: string;
        category: string;
        studyId: string;
        version?: string;
        notes?: string;
    }, onUploadProgress?: (progressEvent: any) => void) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', metadata.title.trim());
        formData.append('type', metadata.category.toUpperCase());
        formData.append('study', metadata.studyId);
        formData.append('site', 'DEFAULT_SITE');
        formData.append('country', 'US');
        formData.append('documentType', metadata.category);
        formData.append('documentId', `DOC-${Date.now()}`);
        formData.append('documentDate', new Date().toISOString());
        formData.append('mimeType', file.type);
        formData.append('fileSize', file.size.toString());
        formData.append('tmfReference', `TMF-${Date.now()}`);
        formData.append('uploadedBy', 'system');
        formData.append('author', 'system');

        const additionalMetadata = {
            version: metadata.version || '1.0',
            notes: metadata.notes || '',
            status: 'DRAFT',
            category: metadata.category,
            studyId: metadata.studyId,
            mimeType: file.type,
            fileSize: file.size,
            documentDate: new Date().toISOString(),
            uploadedBy: 'system',
            author: 'system'
        };
        formData.append('metadata', JSON.stringify(additionalMetadata));

        try {
            const response = await axios.post(`${API_URL}/documents/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateDocumentStatus(documentId: string, status: string) {
        try {
            const response = await axios.patch(`${API_URL}/documents/${documentId}/status`, { status });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteDocument(documentId: string) {
        try {
            const response = await axios.delete(`${API_URL}/documents/${documentId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getDocument(documentId: string) {
        try {
            const response = await axios.get(`${API_URL}/documents/${documentId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async downloadDocument(documentId: string) {
        try {
            const response = await axios.get(`${API_URL}/documents/${documentId}/download`, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: unknown): never {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || error.message);
        }
        throw new Error('An unexpected error occurred');
    }
}

export default new ClinicalTrialsService(); 