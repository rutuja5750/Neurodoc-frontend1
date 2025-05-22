import axios from 'axios';

const API_URL = 'http://localhost:3000/api/tmf';

class ClinicalTrialsService {
    async getDocuments() {
        try {
            console.log('Fetching all documents...');
            
            const response = await axios.get(`${API_URL}/documents`);
            console.log('Documents API response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw error;
        }
    }

    async uploadDocument(file: File, metadata: {
        title: string;
        category: string;
        studyId: string;
        version?: string;
        notes?: string;
    }, onUploadProgress?: (progressEvent: any) => void) {
        try {
            // Create form data
    const formData = new FormData();
    formData.append('file', file);

            // Add required fields directly to form data
            formData.append('title', metadata.title.trim());
            formData.append('type', metadata.category.toUpperCase());
            formData.append('study', metadata.studyId);
            formData.append('site', 'DEFAULT_SITE'); // Required field
            formData.append('country', 'US'); // Required field
            formData.append('documentType', metadata.category); // Required field
            formData.append('documentId', `DOC-${Date.now()}`); // Generate unique document ID
            formData.append('documentDate', new Date().toISOString()); // Required field
            formData.append('mimeType', file.type); // Required field
            formData.append('fileSize', file.size.toString()); // Required field
            formData.append('tmfReference', `TMF-${Date.now()}`); // Required field
            formData.append('uploadedBy', 'system'); // Required field
            formData.append('author', 'system'); // Required field

            // Add additional metadata as a separate field
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

            // Log what we're sending
            console.log('Sending form data with fields:', {
                title: metadata.title.trim(),
                type: metadata.category.toUpperCase(),
                study: metadata.studyId,
                site: 'DEFAULT_SITE',
                country: 'US',
                documentType: metadata.category,
                documentId: `DOC-${Date.now()}`,
                documentDate: new Date().toISOString(),
                mimeType: file.type,
                fileSize: file.size,
                tmfReference: `TMF-${Date.now()}`,
                uploadedBy: 'system',
                author: 'system'
            });

            try {
                const response = await axios.post(`${API_URL}/documents/upload`, formData, {
      headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress
                });

                console.log('Upload response:', response.data);
                return response.data;
            } catch (axiosError) {
                console.error('Axios error:', {
                    status: axiosError.response?.status,
                    statusText: axiosError.response?.statusText,
                    data: axiosError.response?.data,
                    headers: axiosError.response?.headers
                });
                throw new Error(axiosError.response?.data?.message || 'Failed to upload document');
            }
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    async updateDocumentStatus(documentId: string, status: string) {
        const response = await axios.patch(`${API_URL}/documents/${documentId}/status`, {
            status,
        });
        return response.data;
    }

    async deleteDocument(documentId: string) {
        const response = await axios.delete(`${API_URL}/documents/${documentId}`);
        return response.data;
    }

    async getDocument(documentId: string) {
        const response = await axios.get(`${API_URL}/documents/${documentId}`);
        return response.data;
    }

    async downloadDocument(documentId: string) {
        const response = await axios.get(`${API_URL}/documents/${documentId}/download`, {
            responseType: 'blob',
        });
        return response.data;
    }
}

export default new ClinicalTrialsService(); 