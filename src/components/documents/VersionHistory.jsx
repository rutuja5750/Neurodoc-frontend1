import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

const VersionHistory = ({ versions = [], onViewVersion, onDownloadVersion }) => {
  const { toast } = useToast();

  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { variant: 'secondary', label: 'Draft' },
      REVIEW: { variant: 'warning', label: 'Under Review' },
      APPROVED: { variant: 'success', label: 'Approved' },
      ARCHIVED: { variant: 'destructive', label: 'Archived' },
    };

    const config = statusConfig[status] || statusConfig.DRAFT;

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const handleViewVersion = async (version) => {
    try {
      await onViewVersion(version);
    } catch (error) {
      console.error('Error viewing version:', error);
      toast({
        title: "Error",
        description: "Failed to view document version",
        variant: "destructive",
      });
    }
  };

  const handleDownloadVersion = async (version) => {
    try {
      await onDownloadVersion(version);
    } catch (error) {
      console.error('Error downloading version:', error);
      toast({
        title: "Error",
        description: "Failed to download document version",
        variant: "destructive",
      });
    }
  };

  if (!versions.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No version history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Version History</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Changes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={version.version}>
                <TableCell className="font-medium">v{version.version}</TableCell>
                <TableCell>{version.uploadedBy}</TableCell>
                <TableCell>
                  {format(new Date(version.uploadedAt), 'MMM d, yyyy HH:mm')}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {version.changes}
                </TableCell>
                <TableCell>
                  {getStatusBadge(version.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewVersion(version)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadVersion(version)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VersionHistory; 