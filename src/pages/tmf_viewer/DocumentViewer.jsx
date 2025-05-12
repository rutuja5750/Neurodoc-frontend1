import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import documentService from '../../services/document.service';
import DocumentComments from '../../components/DocumentComments';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Download, FileText, Calendar, User, Tag, Info, MessageSquare } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TMFLayout from './TMFLayout';

function DocumentViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [documentContent, setDocumentContent] = useState(null);
    const [loadingContent, setLoadingContent] = useState(true);
    const [currentUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            console.error('No user found in localStorage');
            return null;
        }
        try {
            return JSON.parse(storedUser);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    });

    const { data: documentData, isLoading, error } = useQuery({
        queryKey: ['document', id],
        queryFn: () => documentService.getDocument(id),
        refetchInterval: 5000 // Refetch every 5 seconds to get new comments
    });

   
    useEffect(() => {
        const fetchDocumentContent = async () => {
            if (!documentData?.fileUrl) return;
            
            try {
                setLoadingContent(true);
                const response = await fetch(documentData.fileUrl);
                const blob = await response.blob();
                
                if (documentData.fileFormat.includes('pdf')) {
                    const url = URL.createObjectURL(blob);
                    setDocumentContent(url);
                } else if (documentData.fileFormat.includes('word') || 
                          documentData.fileFormat.includes('excel') || 
                          documentData.fileFormat.includes('powerpoint')) {
                    const encodedUrl = encodeURIComponent(documentData.fileUrl);
                    setDocumentContent(`https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`);
                } else {
                    setDocumentContent('unsupported');
                }
            } catch (error) {
                console.error('Error loading document:', error);
                setDocumentContent('error');
            } finally {
                setLoadingContent(false);
            }
        };

        if (documentData?.fileUrl) {
            fetchDocumentContent();
        }
    }, [documentData?.fileUrl, documentData?.fileFormat]);

    // Function to format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Function to get file type icon
    const getFileTypeIcon = (fileFormat) => {
        if (fileFormat.includes('pdf')) return '📄';
        if (fileFormat.includes('word')) return '📝';
        if (fileFormat.includes('excel')) return '📊';
        if (fileFormat.includes('powerpoint')) return '📑';
        return '📁';
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-gray-500">Loading document...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center space-y-4">
                <p className="text-red-500">Error loading document</p>
                <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                >
                    Try Again
                </Button>
            </div>
        </div>
    );

    return (
        <TMFLayout>
            <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/tmf-viewer')}
                                className="hover:bg-gray-100"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">{documentData.documentTitle}</h1>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant={documentData.status === 'Draft' ? 'warning' : 'success'}>
                                        {documentData.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500">Version {documentData.version}</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex min-h-0">
                    {/* Document Viewer */}
                    <div className="flex-1 p-6">
                        <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden">
                            {loadingContent ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                        <p className="text-gray-500">Loading document content...</p>
                                    </div>
                                </div>
                            ) : documentContent === 'error' ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <p className="text-red-500">Error loading document content</p>
                                        <Button 
                                            onClick={() => window.location.reload()}
                                            variant="outline"
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full w-full">
                                    <iframe
                                        src={documentContent}
                                        className="w-full h-full"
                                        title="Document Preview"
                                        style={{ border: 'none' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 border-l bg-white">
                        <Tabs defaultValue="metadata" className="h-full">
                            <TabsList className="w-full justify-start border-b rounded-none">
                                <TabsTrigger value="metadata" className="flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Metadata
                                </TabsTrigger>
                                <TabsTrigger value="comments" className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Comments
                                </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="metadata" className="h-[calc(100vh-180px)] m-0">
                                <ScrollArea className="h-full">
                                    <div className="p-6 space-y-6">
                                        {/* Document Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Document Information</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start space-x-3">
                                                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Document Title</p>
                                                        <p className="font-medium">{documentData.documentTitle}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">File Name</p>
                                                        <p className="font-medium">{documentData.fileName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">File Format</p>
                                                        <p className="font-medium">{documentData.fileFormat}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">File Size</p>
                                                        <p className="font-medium">{formatFileSize(documentData.fileSize)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Version & Status */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Version & Status</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start space-x-3">
                                                    <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Version</p>
                                                        <p className="font-medium">{documentData.version}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Status</p>
                                                        <p className="font-medium">{documentData.status}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Access Level</p>
                                                        <p className="font-medium">{documentData.accessLevel}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Classification */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Classification</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start space-x-3">
                                                    <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Zone</p>
                                                        <p className="font-medium">{documentData.zone?.zoneName || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Section</p>
                                                        <p className="font-medium">{documentData.section?.sectionName || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Artifact</p>
                                                        <p className="font-medium">{documentData.artifact?.artifactName || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Sub-Artifact</p>
                                                        <p className="font-medium">{documentData.subArtifact?.subArtifactName || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Study Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Study Information</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start space-x-3">
                                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Study</p>
                                                        <p className="font-medium">{documentData.study || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Site</p>
                                                        <p className="font-medium">{documentData.site || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Country</p>
                                                        <p className="font-medium">{documentData.country || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Indication</p>
                                                        <p className="font-medium">{documentData.indication || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Dates */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Dates</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start space-x-3">
                                                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Created At</p>
                                                        <p className="font-medium">{format(new Date(documentData.createdAt), 'PPP')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Document Date</p>
                                                        <p className="font-medium">{format(new Date(documentData.documentDate), 'PPP')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Expiration Date</p>
                                                        <p className="font-medium">{documentData.expirationDate ? format(new Date(documentData.expirationDate), 'PPP') : 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Audit Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Audit Information</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start space-x-3">
                                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Created By</p>
                                                        <p className="font-medium">{documentData.createdBy?.userName || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Last Modified By</p>
                                                        <p className="font-medium">{documentData.lastModifiedBy?.userName || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="comments" className="h-[calc(100vh-180px)] m-0">
                                <DocumentComments documentId={id} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </TMFLayout>
    );
}

export default DocumentViewer;
