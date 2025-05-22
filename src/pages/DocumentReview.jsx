import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import ReviewList from '../components/review/ReviewList';
import ReviewForm from '../components/review/ReviewForm';

const DocumentReview = () => {
  const { documentId } = useParams();
  const [openReviewForm, setOpenReviewForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Document Review</CardTitle>
          <Button
            onClick={() => setOpenReviewForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Review
          </Button>
        </CardHeader>
        <CardContent>
          <ReviewList key={refreshKey} />
        </CardContent>
      </Card>

      <ReviewForm
        open={openReviewForm}
        onClose={() => setOpenReviewForm(false)}
        onReviewCreated={handleReviewCreated}
      />
    </div>
  );
};

export default DocumentReview; 