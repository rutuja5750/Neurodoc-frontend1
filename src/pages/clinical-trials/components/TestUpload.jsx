import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import clinicalTrialsService from '@/services/clinical-trials.service';
import { toast } from "@/components/ui/use-toast";

export default function TestUpload() {
    const [file, setFile] = useState(null);
    const [metadata, setMetadata] = useState({
        title: '',
        category: '',
        studyId: '',
        version: '1.0',
        notes: ''
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Set default title from filename if not already set
            if (!metadata.title) {
                setMetadata(prev => ({
                    ...prev,
                    title: selectedFile.name
                }));
            }
        }
    };

    const handleMetadataChange = (field, value) => {
        setMetadata(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            toast({
                title: "Error",
                description: "Please select a file to upload",
                variant: "destructive"
            });
            return;
        }

        // Validate required fields
        if (!metadata.title || !metadata.category || !metadata.studyId) {
            toast({
                title: "Error",
                description: "Please fill in all required fields (Title, Category, Study ID)",
                variant: "destructive"
            });
            return;
        }

        try {
            setIsUploading(true);
            const response = await clinicalTrialsService.uploadDocument(file, metadata, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`Upload Progress: ${percentCompleted}%`);
            });

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Document uploaded successfully",
                });
                // Reset form
                setFile(null);
                setMetadata({
                    title: '',
                    category: '',
                    studyId: '',
                    version: '1.0',
                    notes: ''
                });
            } else {
                throw new Error(response.error || 'Upload failed');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to upload document",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Test Document Upload</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="file">File</Label>
                    <Input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        value={metadata.title}
                        onChange={(e) => handleMetadataChange('title', e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                        value={metadata.category}
                        onValueChange={(value) => handleMetadataChange('category', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Informed Consent">Informed Consent</SelectItem>
                            <SelectItem value="Protocol">Protocol</SelectItem>
                            <SelectItem value="Case Report Form">Case Report Form</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="studyId">Study ID *</Label>
                    <Input
                        id="studyId"
                        value={metadata.studyId}
                        onChange={(e) => handleMetadataChange('studyId', e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input
                        id="version"
                        value={metadata.version}
                        onChange={(e) => handleMetadataChange('version', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                        id="notes"
                        value={metadata.notes}
                        onChange={(e) => handleMetadataChange('notes', e.target.value)}
                    />
                </div>

                <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Document'}
                </Button>
            </form>
        </div>
    );
} 