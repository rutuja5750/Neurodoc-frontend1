console.log('All VITE env:', import.meta.env);
console.log('VITE_AZURE_STORAGE_CONNECTION_STRING:', import.meta.env.VITE_AZURE_STORAGE_CONNECTION_STRING);
console.log('VITE_AZURE_STORAGE_CONTAINER_NAME:', import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME);

import { BlobServiceClient } from '@azure/storage-blob';
import axios from 'axios';

class AzureStorageService {
  constructor() {
    this.connectionString = import.meta.env.VITE_AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME;
    
    if (!this.connectionString || !this.containerName) {
      console.error('Azure Storage configuration is missing. Please check your environment variables.');
    }
  }

  async uploadDocument(file, metadata) {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // POST to your backend API endpoint
    const response = await axios.post('http://localhost:3000/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data; // Should include blob URL or document info
  }

  async deleteDocument(blobName) {
    try {
      if (!this.connectionString || !this.containerName) {
        throw new Error('Azure Storage configuration is missing');
      }

      const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
      const containerClient = blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.delete();
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  async getDocumentUrl(blobName) {
    try {
      if (!this.connectionString || !this.containerName) {
        throw new Error('Azure Storage configuration is missing');
      }

      const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
      const containerClient = blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Generate a SAS token for temporary access
      const sasToken = await this.generateSasToken(blobName);
      return `${blockBlobClient.url}?${sasToken}`;
    } catch (error) {
      console.error('Error getting document URL:', error);
      throw new Error(`Failed to get document URL: ${error.message}`);
    }
  }

  async generateSasToken(blobName) {
    try {
      if (!this.connectionString || !this.containerName) {
        throw new Error('Azure Storage configuration is missing');
      }

      const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
      const containerClient = blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Generate SAS token with 1 hour expiry
      const sasOptions = {
        permissions: 'r', // Read permission
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour from now
      };

      const sasToken = await blockBlobClient.generateSasUrl(sasOptions);
      return sasToken.split('?')[1]; // Return only the token part
    } catch (error) {
      console.error('Error generating SAS token:', error);
      throw new Error(`Failed to generate SAS token: ${error.message}`);
    }
  }
}

export const azureStorageService = new AzureStorageService(); 