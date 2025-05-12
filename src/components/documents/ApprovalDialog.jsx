import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import clinicalTrialsService from '../../services/clinical-trials.service';

const ApprovalDialog = ({ open, onClose, document, onApproved }) => {
  const [comments, setComments] = useState('');
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const approverId = user.id || 'demo-approver-id';
  const approverName = user.name || 'Demo Approver';

  const handleApprove = async () => {
    try {
      setLoading(true);
      await clinicalTrialsService.submitDocumentApproval(document._id, {
        approverId,
        approverName,
        status: 'APPROVED',
        comments,
        signature: signature || 'Signed by ' + approverName
      });
      toast({
        title: "Document Approved",
        description: "The document has been approved successfully.",
      });
      onApproved();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await clinicalTrialsService.submitDocumentApproval(document._id, {
        approverId,
        approverName,
        status: 'REJECTED',
        comments,
        signature: signature || 'Signed by ' + approverName
      });
      toast({
        title: "Document Rejected",
        description: "The document has been rejected and returned to draft status.",
      });
      onApproved();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review Document</DialogTitle>
          <DialogDescription>
            Review and provide feedback for {document?.title}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="comments" className="text-sm font-medium">
              Comments
            </label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter your review comments..."
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="signature" className="text-sm font-medium">
              Digital Signature
            </label>
            <Textarea
              id="signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Enter your digital signature..."
              className="min-h-[50px]"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={loading}
          >
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            disabled={loading}
          >
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalDialog; 