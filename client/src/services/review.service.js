// client/src/services/review.service.js
import api from './api';

export const reviewService = {
    getReviews: (medicineId) => api.get(`/reviews/${medicineId}`),
    addReview: (data) => api.post('/reviews', data),
    deleteReview: (id) => api.delete(`/reviews/${id}`),
};