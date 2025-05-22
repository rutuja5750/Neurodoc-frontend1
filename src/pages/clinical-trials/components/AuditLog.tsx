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

interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  role: string;
  comment?: string;
  hasSignature: boolean;
}

interface AuditLogProps {
  entries: AuditLogEntry[];
}

const AuditLog: React.FC<AuditLogProps> = ({ entries }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Audit Log</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Signature</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <Badge variant="outline">{entry.action}</Badge>
                </TableCell>
                <TableCell>{entry.actor}</TableCell>
                <TableCell>{entry.role}</TableCell>
                <TableCell>{entry.timestamp}</TableCell>
                <TableCell>{entry.comment || '-'}</TableCell>
                <TableCell>
                  {entry.hasSignature ? (
                    <Badge variant="secondary">Signed</Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuditLog; 