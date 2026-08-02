import api from './api';
import { store } from '../redux/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const medicineService = {
    getAllMedicines: (params) => api.get('/medicines', { params }),
    getMedicineById: (id) => api.get(`/medicines/${id}`),
    
    // Using native fetch for file upload to bypass Axios boundary issues
    createMedicine: async (formData) => {
        const token = store.getState().auth.accessToken;
        const response = await fetch(`${API_BASE_URL}/medicines`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add medicine');
        }
        return { data };
    },

    deleteMedicine: (id) => api.delete(`/medicines/${id}`),
    restockMedicine: (id, amount) => api.put(`/medicines/${id}/restock`, { additionalStock: amount }), // <-- Add this

};