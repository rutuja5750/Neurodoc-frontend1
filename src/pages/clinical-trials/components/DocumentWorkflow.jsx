import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  CheckCircle2,
  FileCheck,
  Archive,
  AlertCircle,
  Users,
  Send,
} from "lucide-react";
import ReviewerManagement from './ReviewerManagement';
import { useToast } from "@/components/ui/use-toast";
import clinicalTrialsService from '@/services/clinical-trials.service';

const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  FINAL: 'final',
  ARCHIVED: 'archived'
};

const WORKFLOW_STEPS = [
  {
    id: DOCUMENT_STATUS.DRAFT,
    title: 'Draft',
    description: 'Initial document creation or upload',
    icon: FileText,
    nextStatus: DOCUMENT_STATUS.IN_REVIEW,
    nextAction: 'Submit for Review',
    variant: 'secondary'
  },
  {
    id: DOCUMENT_STATUS.IN_REVIEW,
    title: 'In Review',
    description: 'Under review by assigned reviewers',
    icon: Clock,
    nextStatus: DOCUMENT_STATUS.APPROVED,
    nextAction: 'Approve',
    variant: 'warning'
  },
  {
    id: DOCUMENT_STATUS.APPROVED,
    title: 'Approved',
    description: 'Document has been approved',
    icon: CheckCircle2,
    nextStatus: DOCUMENT_STATUS.FINAL,
    nextAction: 'Finalize',
    variant: 'success'
  },
  {
    id: DOCUMENT_STATUS.FINAL,
    title: 'Final',
    description: 'Document is finalized and locked',
    icon: FileCheck,
    nextStatus: DOCUMENT_STATUS.ARCHIVED,
    nextAction: 'Archive',
    variant: 'default'
  },
  {
    id: DOCUMENT_STATUS.ARCHIVED,
    title: 'Archived',
    description: 'Document is archived',
    icon: Archive,
    variant: 'destructive'
  }
];

const DocumentWorkflow = ({ document, onStatusChange }) => {
  const { toast } = useToast();
  const currentStepIndex = WORKFLOW_STEPS.findIndex(step => step.id === document.status);
  const currentStep = WORKFLOW_STEPS[currentStepIndex];
  const [showReviewers, setShowReviewers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      setIsSubmitting(true);
      await clinicalTrialsService.updateDocumentStatus(document.id, newStatus);
      onStatusChange(document.id, newStatus);
      toast({
        title: "Success",
        description: `Document status updated to ${newStatus.replace('_', ' ')}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update document status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewUpdate = async (update) => {
    try {
      if (update.type === 'ADD_REVIEWER') {
        await clinicalTrialsService.addReviewer(document.id, update.reviewer);
      } else if (update.type === 'UPDATE_REVIEW') {
        await clinicalTrialsService.updateReview(document.id, update.reviewerId, {
          status: update.status,
          comment: update.comment,
          timestamp: update.timestamp
        });
      }
      toast({
        title: "Success",
        description: "Review updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update review",
        variant: "destructive",
      });
    }
  };

  const canProceedToNextStep = () => {
    if (document.status !== DOCUMENT_STATUS.IN_REVIEW) return true;
    
    // Check if all required reviewers have approved
    const requiredReviewers = document.reviewers?.filter(r => r.required) || [];
    const approvedReviewers = document.reviewers?.filter(r => r.status === 'approved') || [];
    
    return requiredReviewers.length > 0 && requiredReviewers.length === approvedReviewers.length;
  };

  const renderActionButton = () => {
    if (document.status === DOCUMENT_STATUS.DRAFT) {
      return (
        <Button
          onClick={() => handleStatusChange(DOCUMENT_STATUS.IN_REVIEW)}
          variant={currentStep.variant}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </Button>
      );
    }

    if (document.status === DOCUMENT_STATUS.IN_REVIEW) {
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowReviewers(!showReviewers)}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            {showReviewers ? 'Hide Reviewers' : 'Manage Reviewers'}
          </Button>
          <Button
            onClick={() => handleStatusChange(DOCUMENT_STATUS.APPROVED)}
            variant={currentStep.variant}
            disabled={!canProceedToNextStep() || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : currentStep.nextAction}
          </Button>
        </div>
      );
    }

    if (currentStep.nextStatus) {
      return (
        <Button
          onClick={() => handleStatusChange(currentStep.nextStatus)}
          variant={currentStep.variant}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : currentStep.nextAction}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Document Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{document.metadata?.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Current Status: {currentStep.title}
                </p>
              </div>
              <Badge variant={currentStep.variant} className="flex items-center gap-1">
                <currentStep.icon className="h-4 w-4" />
                {currentStep.title}
              </Badge>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-between">
                {WORKFLOW_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          isCompleted
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <StepIcon className="h-4 w-4" />
                      </div>
                      <div className="mt-2 text-xs font-medium text-center">
                        {step.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              {renderActionButton()}
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Workflow Information</h4>
              <p className="text-sm text-muted-foreground">
                {currentStep.description}
              </p>
              {document.metadata?.notes && (
                <div className="mt-2">
                  <h5 className="text-sm font-medium">Notes:</h5>
                  <p className="text-sm text-muted-foreground">
                    {document.metadata.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showReviewers && document.status === DOCUMENT_STATUS.IN_REVIEW && (
        <ReviewerManagement
          document={document}
          onReviewUpdate={handleReviewUpdate}
        />
      )}
    </div>
  );
};

export default DocumentWorkflow; 