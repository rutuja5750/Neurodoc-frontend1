import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import reviewService from '../../services/reviewService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, AlertTriangle, FileEdit } from 'lucide-react';

const ReviewList = () => {
  const { documentId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadReviews();
  }, [documentId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getDocumentReviews(documentId);
      setReviews(data);
      setError(null);
    } catch (err) {
      setError('Failed to load reviews');
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    try {
      await reviewService.addComment(selectedReview._id, newComment);
      setOpenCommentDialog(false);
      setNewComment('');
      loadReviews();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { variant: 'secondary', label: 'Pending' },
      'in_progress': { variant: 'warning', label: 'In Progress' },
      'completed': { variant: 'success', label: 'Completed' },
      'rejected': { variant: 'destructive', label: 'Rejected' },
    };

    const config = statusConfig[status] || statusConfig['pending'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      'low': { variant: 'secondary', label: 'Low' },
      'medium': { variant: 'warning', label: 'Medium' },
      'high': { variant: 'destructive', label: 'High' },
      'critical': { variant: 'destructive', label: 'Critical' },
    };

    const config = severityConfig[severity] || severityConfig['low'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No reviews found for this document.
        </div>
      ) : (
        reviews.map((review) => (
          <Card key={review._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Review by {review.reviewerId?.name || 'Unknown Reviewer'}</CardTitle>
                  <CardDescription>
                    Created on {new Date(review.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                {getStatusBadge(review.status)}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {/* Comments Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4" />
                      <h3 className="text-lg font-semibold">Comments ({review.comments.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {review.comments.map((comment, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">{comment.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            By {comment.createdBy?.name || 'Unknown'} on{' '}
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amendments Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileEdit className="h-4 w-4" />
                      <h3 className="text-lg font-semibold">Amendments ({review.amendments.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {review.amendments.map((amendment, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">{amendment.description}</p>
                          <div className="mt-2">
                            {getStatusBadge(amendment.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Issues Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <h3 className="text-lg font-semibold">
                        Compliance Issues ({review.complianceIssues.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {review.complianceIssues.map((issue, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">{issue.description}</p>
                          <div className="mt-2">
                            {getSeverityBadge(issue.severity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedReview(review);
                    setOpenCommentDialog(true);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={openCommentDialog} onOpenChange={setOpenCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Add a new comment to this review.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCommentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddComment}>
              Add Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewList; 