import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useDocument } from '@/hooks/useDocument';
import DocumentStatusBadge from './common/DocumentStatusBadge';
import { WORKFLOW_ACTIONS } from '@/constants/document';

const DocumentWorkflow = ({ document, onStatusChange }) => {
  const { isSubmitting, handleWorkflowAction, handleReview, handleApproval } = useDocument(document, onStatusChange);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [reviewData, setReviewData] = useState({ status: 'APPROVED', comments: '' });
  const [approvalData, setApprovalData] = useState({ status: 'APPROVED', comments: '', signature: '' });

  const renderWorkflowActions = () => {
    switch (document.status) {
      case 'DRAFT':
        return (
          <Button
            onClick={() => handleWorkflowAction(WORKFLOW_ACTIONS.SUBMIT_FOR_REVIEW)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for Review'
            )}
          </Button>
        );
      case 'IN_REVIEW':
        return (
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(true)}
              disabled={isSubmitting}
            >
              Submit Review
            </Button>
          </div>
        );
      case 'APPROVED':
        return (
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowApprovalDialog(true)}
              disabled={isSubmitting}
            >
              Submit Approval
            </Button>
            <Button
              onClick={() => handleWorkflowAction(WORKFLOW_ACTIONS.FINALIZE)}
              disabled={isSubmitting}
            >
              Finalize Document
            </Button>
          </div>
        );
      case 'FINAL':
        return (
          <Button
            variant="destructive"
            onClick={() => handleWorkflowAction(WORKFLOW_ACTIONS.ARCHIVE)}
            disabled={isSubmitting}
          >
            Archive Document
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Document Workflow</span>
            <DocumentStatusBadge status={document.status} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Current Version</p>
                <p className="text-sm text-muted-foreground">
                  v{document.currentVersion}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(document.versionHistory[document.versionHistory.length - 1]?.uploadedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              {renderWorkflowActions()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Review</DialogTitle>
            <DialogDescription>
              Provide your review feedback for this document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Review Decision</Label>
              <div className="flex space-x-2">
                <Button
                  variant={reviewData.status === 'APPROVED' ? 'default' : 'outline'}
                  onClick={() => setReviewData(prev => ({ ...prev, status: 'APPROVED' }))}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant={reviewData.status === 'REJECTED' ? 'destructive' : 'outline'}
                  onClick={() => setReviewData(prev => ({ ...prev, status: 'REJECTED' }))}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Comments</Label>
              <Textarea
                value={reviewData.comments}
                onChange={(e) => setReviewData(prev => ({ ...prev, comments: e.target.value }))}
                placeholder="Enter your review comments..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                const success = await handleReview(reviewData);
                if (success) setShowReviewDialog(false);
              }} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Approval</DialogTitle>
            <DialogDescription>
              Provide your approval decision for this document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Approval Decision</Label>
              <div className="flex space-x-2">
                <Button
                  variant={approvalData.status === 'APPROVED' ? 'default' : 'outline'}
                  onClick={() => setApprovalData(prev => ({ ...prev, status: 'APPROVED' }))}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant={approvalData.status === 'REJECTED' ? 'destructive' : 'outline'}
                  onClick={() => setApprovalData(prev => ({ ...prev, status: 'REJECTED' }))}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Comments</Label>
              <Textarea
                value={approvalData.comments}
                onChange={(e) => setApprovalData(prev => ({ ...prev, comments: e.target.value }))}
                placeholder="Enter your approval comments..."
              />
            </div>
            <div className="space-y-2">
              <Label>Digital Signature</Label>
              <Textarea
                value={approvalData.signature}
                onChange={(e) => setApprovalData(prev => ({ ...prev, signature: e.target.value }))}
                placeholder="Enter your digital signature..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                const success = await handleApproval(approvalData);
                if (success) setShowApprovalDialog(false);
              }} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Approval'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentWorkflow; 