import api from './api';

export const prescriptionService = {
    // Use Axios, but let it set the Content-Type automatically by passing the formData directly
    upload: (formData) => api.post('/prescriptions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
    getMy: () => api.get('/prescriptions/me'),
    getAll: (status) => api.get('/prescriptions', { params: { status } }),
    updateStatus: (id, data) => api.put(`/prescriptions/${id}`, data),
    delete: (id) => api.delete(`/prescriptions/${id}`),

};