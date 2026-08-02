import api from './api';

export const cartService = {
    getCart: () => api.get('/cart'),
    addToCart: (medicineId, quantity = 1) => api.post('/cart', { medicineId, quantity }),
    updateCart: (medicineId, quantity) => api.put('/cart', { medicineId, quantity }),
    removeFromCart: (medicineId) => api.delete(`/cart/${medicineId}`),
};