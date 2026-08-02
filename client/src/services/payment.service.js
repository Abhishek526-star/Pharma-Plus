import api from './api';

export const paymentService = {
    createOrder: (orderId) => api.post('/payments/create-order', { orderId }),
    verifyPayment: (data) => api.post('/payments/verify', data),
};