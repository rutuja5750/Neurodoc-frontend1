import React from 'react';
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from '@/constants/document';
import * as Icons from 'lucide-react';

const DocumentStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
  const Icon = Icons[config.icon];

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-4 w-4" />
      {config.label}
    </Badge>
  );
};

export default DocumentStatusBadge; 