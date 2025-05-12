import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle, Clock, UserPlus } from "lucide-react";

const REVIEWER_ROLES = {
  LINE_MANAGER: 'Line Manager',
  QUALITY_TEAM: 'Quality Team',
  SME: 'Subject Matter Expert',
};

const REVIEW_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const ReviewerManagement = ({ document, onReviewUpdate }) => {
  const [newReviewer, setNewReviewer] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [reviewComment, setReviewComment] = useState('');

  const handleAddReviewer = () => {
    if (!newReviewer.name || !newReviewer.email || !newReviewer.role) return;

    onReviewUpdate({
      type: 'ADD_REVIEWER',
      reviewer: {
        ...newReviewer,
        status: REVIEW_STATUS.PENDING,
        assignedAt: new Date().toISOString(),
      },
    });

    setNewReviewer({ name: '', email: '', role: '' });
  };

  const handleReviewSubmit = (reviewerId, status) => {
    onReviewUpdate({
      type: 'UPDATE_REVIEW',
      reviewerId,
      status,
      comment: reviewComment,
      timestamp: new Date().toISOString(),
    });
    setReviewComment('');
  };

  const getReviewerStatusBadge = (status) => {
    const statusConfig = {
      [REVIEW_STATUS.PENDING]: { variant: 'secondary', icon: Clock },
      [REVIEW_STATUS.IN_PROGRESS]: { variant: 'warning', icon: Clock },
      [REVIEW_STATUS.APPROVED]: { variant: 'success', icon: CheckCircle2 },
      [REVIEW_STATUS.REJECTED]: { variant: 'destructive', icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-4 w-4" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-500" />
          Review Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add Reviewer Form */}
          <div className="space-y-4">
            <h3 className="font-medium">Add Reviewer</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Reviewer Name"
                value={newReviewer.name}
                onChange={(e) => setNewReviewer(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Reviewer Email"
                type="email"
                value={newReviewer.email}
                onChange={(e) => setNewReviewer(prev => ({ ...prev, email: e.target.value }))}
              />
              <Select
                value={newReviewer.role}
                onValueChange={(value) => setNewReviewer(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(REVIEWER_ROLES).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddReviewer} className="w-full">
              Add Reviewer
            </Button>
          </div>

          {/* Reviewers List */}
          <div className="space-y-4">
            <h3 className="font-medium">Assigned Reviewers</h3>
            <ScrollArea className="h-[300px]">
              {document.reviewers?.map((reviewer) => (
                <div key={reviewer.id} className="p-4 border rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{reviewer.name}</h4>
                      <p className="text-sm text-muted-foreground">{reviewer.email}</p>
                    </div>
                    {getReviewerStatusBadge(reviewer.status)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Role: {reviewer.role}
                  </div>
                  {reviewer.status === REVIEW_STATUS.PENDING && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Enter your review comments..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleReviewSubmit(reviewer.id, REVIEW_STATUS.APPROVED)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReviewSubmit(reviewer.id, REVIEW_STATUS.REJECTED)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                  {reviewer.comment && (
                    <div className="mt-2 p-2 bg-muted rounded">
                      <p className="text-sm">{reviewer.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(reviewer.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewerManagement; 