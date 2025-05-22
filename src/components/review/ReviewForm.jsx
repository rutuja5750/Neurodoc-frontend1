import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import reviewService from '../../services/reviewService';
import { Button } from "@/components/ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";

const ReviewForm = ({ open, onClose, onReviewCreated }) => {
  const { documentId } = useParams();
  const [reviewerId, setReviewerId] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create the review
      const review = await reviewService.createReview(documentId, reviewerId);

      // Add initial amendment if description is provided
      if (description) {
        await reviewService.addAmendment(review._id, description);
      }

      // Add initial compliance issue if severity is provided
      if (severity) {
        await reviewService.addComplianceIssue(
          review._id,
          'Initial compliance check',
          severity
        );
      }

      onReviewCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create review');
      console.error('Error creating review:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Review</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reviewerId">Reviewer ID</Label>
            <Input
              id="reviewerId"
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Initial Amendment Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe any initial amendments needed..."
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="severity">Initial Compliance Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !reviewerId}
          >
            {loading ? 'Creating...' : 'Create Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm; 