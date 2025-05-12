import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { FileText, Calendar, User, Tag, Building2, Hash } from "lucide-react";
import DocumentStatusBadge from './common/DocumentStatusBadge';

const MetadataItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-2">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  </div>
);

const VersionHistoryItem = ({ version }) => (
  <div className="border-b pb-4 last:border-0">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <Badge variant="outline">v{version.version}</Badge>
        <span className="text-sm text-muted-foreground">
          {format(new Date(version.uploadedAt), 'PPP')}
        </span>
      </div>
      <DocumentStatusBadge status={version.status} />
    </div>
    <div className="space-y-2">
      <p className="text-sm">
        <span className="font-medium">Uploaded by:</span> {version.uploadedBy}
      </p>
      {version.changes && (
        <p className="text-sm">
          <span className="font-medium">Changes:</span> {version.changes}
        </p>
      )}
      {version.reviews && version.reviews.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Reviews:</p>
          <div className="space-y-1">
            {version.reviews.map((review, reviewIndex) => (
              <div key={reviewIndex} className="text-sm pl-2 border-l-2 border-muted">
                <p>
                  <span className="font-medium">{review.reviewerName}</span> - {review.status}
                </p>
                {review.comments && (
                  <p className="text-muted-foreground">{review.comments}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {version.approvals && version.approvals.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Approvals:</p>
          <div className="space-y-1">
            {version.approvals.map((approval, approvalIndex) => (
              <div key={approvalIndex} className="text-sm pl-2 border-l-2 border-muted">
                <p>
                  <span className="font-medium">{approval.approverName}</span> - {approval.status}
                </p>
                {approval.comments && (
                  <p className="text-muted-foreground">{approval.comments}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const AuditTrailItem = ({ entry }) => (
  <div className="flex items-start space-x-2">
    <div className="mt-1">
      <Badge variant="outline" className="text-xs">
        {entry.action}
      </Badge>
    </div>
    <div>
      <p className="text-sm">
        <span className="font-medium">{entry.userName}</span> - {entry.details}
      </p>
      <p className="text-xs text-muted-foreground">
        {format(new Date(entry.timestamp), 'PPP p')}
      </p>
    </div>
  </div>
);

const DocumentMetadata = ({ document }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <MetadataItem
              icon={<FileText className="h-4 w-4" />}
              label="Title"
              value={document.title}
            />
            <MetadataItem
              icon={<Tag className="h-4 w-4" />}
              label="Type"
              value={document.type}
            />
            <MetadataItem
              icon={<User className="h-4 w-4" />}
              label="Author"
              value={document.metadata.author}
            />
            <MetadataItem
              icon={<Calendar className="h-4 w-4" />}
              label="Created"
              value={format(new Date(document.metadata.createdAt), 'PPP')}
            />
            <MetadataItem
              icon={<Building2 className="h-4 w-4" />}
              label="Site"
              value={document.metadata.siteId}
            />
            <MetadataItem
              icon={<Hash className="h-4 w-4" />}
              label="Study ID"
              value={document.metadata.studyId}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {document.versionHistory.map((version) => (
              <VersionHistoryItem key={version.version} version={version} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {document.auditTrail.map((entry, index) => (
              <AuditTrailItem key={index} entry={entry} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentMetadata; 