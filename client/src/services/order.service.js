import api from './api';

export const orderService = {
    createOrder: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/my-orders'),
    getAllOrders: () => api.get('/orders'), // Admin
    updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}`, { status }), // Admin
};