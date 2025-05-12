import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reviewService from '../../services/reviewService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const CreateReviewForm = ({ documentId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    comments: '',
    amendments: [],
    complianceIssues: [],
  });

  const [newAmendment, setNewAmendment] = useState('');
  const [newComplianceIssue, setNewComplianceIssue] = useState({
    description: '',
    severity: 'low',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reviewService.createReview(documentId, formData);
      toast({
        title: "Review created successfully",
        description: "The review has been created and assigned.",
      });
      navigate(`/documents/${documentId}/reviews`);
    } catch (error) {
      toast({
        title: "Error creating review",
        description: error.message || "Failed to create review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAmendment = () => {
    if (newAmendment.trim()) {
      setFormData(prev => ({
        ...prev,
        amendments: [...prev.amendments, { description: newAmendment.trim() }],
      }));
      setNewAmendment('');
    }
  };

  const handleAddComplianceIssue = () => {
    if (newComplianceIssue.description.trim()) {
      setFormData(prev => ({
        ...prev,
        complianceIssues: [...prev.complianceIssues, { ...newComplianceIssue }],
      }));
      setNewComplianceIssue({ description: '', severity: 'low' });
    }
  };

  const removeAmendment = (index) => {
    setFormData(prev => ({
      ...prev,
      amendments: prev.amendments.filter((_, i) => i !== index),
    }));
  };

  const removeComplianceIssue = (index) => {
    setFormData(prev => ({
      ...prev,
      complianceIssues: prev.complianceIssues.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Review</CardTitle>
        <CardDescription>
          Add your review comments, amendments, and compliance issues.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Comments Section */}
          <div className="space-y-2">
            <Label htmlFor="comments">Review Comments</Label>
            <Textarea
              id="comments"
              placeholder="Enter your review comments..."
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          {/* Amendments Section */}
          <div className="space-y-4">
            <Label>Amendments</Label>
            <div className="flex gap-2">
              <Textarea
                placeholder="Enter amendment description..."
                value={newAmendment}
                onChange={(e) => setNewAmendment(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddAmendment}
              >
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {formData.amendments.map((amendment, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">{amendment.description}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAmendment(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Issues Section */}
          <div className="space-y-4">
            <Label>Compliance Issues</Label>
            <div className="flex gap-2">
              <Textarea
                placeholder="Enter compliance issue description..."
                value={newComplianceIssue.description}
                onChange={(e) => setNewComplianceIssue(prev => ({
                  ...prev,
                  description: e.target.value,
                }))}
                className="flex-1"
              />
              <Select
                value={newComplianceIssue.severity}
                onValueChange={(value) => setNewComplianceIssue(prev => ({
                  ...prev,
                  severity: value,
                }))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddComplianceIssue}
              >
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {formData.complianceIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <span className="text-sm">{issue.description}</span>
                    <span className="text-xs text-muted-foreground">
                      Severity: {issue.severity}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComplianceIssue(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/documents/${documentId}/reviews`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateReviewForm; 