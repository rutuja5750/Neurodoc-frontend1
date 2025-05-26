import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Clock, 
  Archive, 
  Send, 
  AlertCircle,
  FileSignature
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowActionsPanelProps {
  currentStatus: string;
  userRole: string;
  onAction: (action: { action: string; comment?: string; signature?: string }) => void;
}

const WorkflowActionsPanel: React.FC<WorkflowActionsPanelProps> = ({
  currentStatus,
  userRole,
  onAction,
}) => {
  const [comment, setComment] = useState('');
  const [signature, setSignature] = useState('');
  const [showSignature, setShowSignature] = useState(false);

  const getAvailableActions = () => {
    const actions = [];

    switch (currentStatus) {
      case 'uploaded':
        if (userRole === 'CRA' || userRole === 'Admin') {
          actions.push({
            action: 'send_for_review',
            label: 'Send for Review',
            icon: <Send className="h-4 w-4" />,
            requiresComment: true,
            requiresSignature: false,
          });
        }
        break;
      case 'under_review':
        if (userRole === 'Reviewer' || userRole === 'Admin') {
          actions.push(
            {
              action: 'approve',
              label: 'Approve',
              icon: <CheckCircle2 className="h-4 w-4" />,
              requiresComment: true,
              requiresSignature: true,
            },
            {
              action: 'request_changes',
              label: 'Request Changes',
              icon: <AlertCircle className="h-4 w-4" />,
              requiresComment: true,
              requiresSignature: false,
            }
          );
        }
        break;
      case 'approved':
        if (userRole === 'Admin') {
          actions.push({
            action: 'archive',
            label: 'Archive',
            icon: <Archive className="h-4 w-4" />,
            requiresComment: true,
            requiresSignature: true,
          });
        }
        break;
    }

    return actions;
  };

  const handleAction = (action: string) => {
    const actionConfig = getAvailableActions().find(a => a.action === action);
    
    if (actionConfig?.requiresSignature && !signature) {
      setShowSignature(true);
      return;
    }

    onAction({
      action,
      comment: actionConfig?.requiresComment ? comment : undefined,
      signature: actionConfig?.requiresSignature ? signature : undefined,
    });

    // Reset form
    setComment('');
    setSignature('');
    setShowSignature(false);
  };

  const availableActions = getAvailableActions();

  if (availableActions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          No actions available for the current document status.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableActions.map((action) => (
          <Card key={action.action} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  action.action === 'approve' && "bg-green-100",
                  action.action === 'request_changes' && "bg-yellow-100",
                  action.action === 'archive' && "bg-gray-100",
                  action.action === 'send_for_review' && "bg-blue-100"
                )}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{action.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.requiresSignature 
                      ? "This action requires your signature and a comment."
                      : action.requiresComment 
                        ? "Please provide a comment for this action."
                        : "No additional information required."}
                  </p>
                </div>
              </div>

              {action.requiresComment && (
                <div className="mt-4">
                  <Label htmlFor={`comment-${action.action}`}>Comment</Label>
                  <Textarea
                    id={`comment-${action.action}`}
                    value={comment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                    placeholder="Enter your comment here..."
                    className="mt-1"
                  />
                </div>
              )}

              {action.requiresSignature && showSignature && (
                <div className="mt-4">
                  <Label htmlFor={`signature-${action.action}`}>
                    <div className="flex items-center space-x-2">
                      <FileSignature className="h-4 w-4" />
                      <span>Digital Signature</span>
                    </div>
                  </Label>
                  <Input
                    id={`signature-${action.action}`}
                    type="password"
                    value={signature}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignature(e.target.value)}
                    placeholder="Enter your signature"
                    className="mt-1"
                  />
                </div>
              )}

              <div className="mt-4">
                <Button
                  onClick={() => handleAction(action.action)}
                  className="w-full"
                  disabled={action.requiresComment && !comment}
                >
                  {action.label}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkflowActionsPanel; 