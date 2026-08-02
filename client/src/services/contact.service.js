import api from './api';

export const contactService = {
    submitForm: (data) => api.post('/contact', data),
};