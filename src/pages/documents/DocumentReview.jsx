import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReviewList from '../../components/review/ReviewList';
import CreateReviewForm from '../../components/review/CreateReviewForm';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

const DocumentReview = () => {
  const { documentId } = useParams();
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Document Reviews</h1>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Review
        </Button>
      </div>

      {showCreateForm ? (
        <CreateReviewForm
          documentId={documentId}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : (
        <ReviewList documentId={documentId} />
      )}
    </div>
  );
};

export default DocumentReview; 