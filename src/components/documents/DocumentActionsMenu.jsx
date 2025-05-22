import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash, Archive, FileCheck, History } from 'lucide-react';
import DocumentDialog from '../dialogs/DocumentDialog';
import VersionHistory from './VersionHistory';

export default function DocumentActionsMenu({ document, onEdit, onDelete, onArchive, onVersionHistory }) {
  const [editOpen, setEditOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-blue-100">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Metadata
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>
            <Trash className="h-4 w-4 mr-2" /> Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onArchive}>
            <Archive className="h-4 w-4 mr-2" /> {document.status === 'archived' ? 'Unarchive' : 'Archive'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setVersionOpen(true)}>
            <History className="h-4 w-4 mr-2" /> Version History
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DocumentDialog 
        open={editOpen} 
        onClose={() => setEditOpen(false)} 
        initialSelectedItem={document} 
        onSubmit={onEdit} 
      />
      <VersionHistory open={versionOpen} onClose={() => setVersionOpen(false)} documentId={document._id} />
    </>
  );
} 