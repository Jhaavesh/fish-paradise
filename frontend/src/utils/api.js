import axios from 'axios';
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api', timeout: 15000, headers: { 'Content-Type': 'application/json' } });
api.interceptors.response.use(res => res, err => { const msg = err.response?.data?.message || err.message || 'Something went wrong'; return Promise.reject(new Error(msg)); });
export const productAPI = { getAll: (p) => api.get('/products', { params: p }), getById: (id) => api.get('/products/' + id), getCategories: () => api.get('/products/categories'), create: (d) => api.post('/products', d), update: (id, d) => api.put('/products/' + id, d), delete: (id) => api.delete('/products/' + id), uploadImages: (fd) => api.post('/products/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }), deleteImage: (filename) => api.delete('/products/upload/' + filename) };
export const contactAPI = { submit: (d) => api.post('/contact', d), getAll: () => api.get('/contact') };
export const galleryAPI = { getAll: () => api.get('/gallery'), upload: (fd) => api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } }), delete: (id) => api.delete('/gallery/' + id), update: (id, d) => api.patch('/gallery/' + id, d) };
export const orderAPI = {
	create: (d) => api.post('/orders', d),
	getAll: () => api.get('/orders'),
	updateStatus: (id, s) => api.patch('/orders/' + id, { status: s }),
	getPaymentConfig: () => api.get('/orders/payment/config'),
	createPayment: (d) => api.post('/orders/payment/create', d),
	verifyPayment: (d) => api.post('/orders/payment/verify', d),
	markPaymentFailed: (d) => api.post('/orders/payment/failure', d),
};
export default api;
