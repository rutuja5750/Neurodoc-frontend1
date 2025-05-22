import api from './api';

const reviewService = {
  // Get all reviews for a document
  getDocumentReviews: async (documentId) => {
    const response = await api.get(`/api/reviews/document/${documentId}`);
    return response.data;
  },

  // Create a new review
  createReview: async (documentId, reviewData) => {
    const response = await api.post(`/api/reviews/document/${documentId}`, reviewData);
    return response.data;
  },

  // Add a comment to a review
  addComment: async (reviewId, comment) => {
    const response = await api.post(`/api/reviews/${reviewId}/comments`, { content: comment });
    return response.data;
  },

  // Add an amendment to a review
  addAmendment: async (reviewId, amendment) => {
    const response = await api.post(`/api/reviews/${reviewId}/amendments`, amendment);
    return response.data;
  },

  // Add a compliance issue to a review
  addComplianceIssue: async (reviewId, issue) => {
    const response = await api.post(`/api/reviews/${reviewId}/compliance-issues`, issue);
    return response.data;
  },

  // Update review status
  updateReviewStatus: async (reviewId, status) => {
    const response = await api.patch(`/api/reviews/${reviewId}/status`, { status });
    return response.data;
  },

  // Update amendment status
  updateAmendmentStatus: async (reviewId, amendmentId, status) => {
    const response = await api.patch(
      `/api/reviews/${reviewId}/amendments/${amendmentId}/status`,
      { status }
    );
    return response.data;
  },

  // Update compliance issue status
  updateComplianceIssueStatus: async (reviewId, issueId, status) => {
    const response = await api.patch(
      `/api/reviews/${reviewId}/compliance-issues/${issueId}/status`,
      { status }
    );
    return response.data;
  },

  // Get a specific review
  getReview: async (reviewId) => {
    const response = await api.get(`/api/reviews/${reviewId}`);
    return response.data;
  },

  // Get all reviews by a reviewer
  getReviewerReviews: async (reviewerId) => {
    const response = await api.get(`/api/reviews/reviewer/${reviewerId}`);
    return response.data;
  }
};

export default reviewService; 