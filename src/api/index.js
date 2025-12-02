import axios from 'axios';



const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});



API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});



export const testApi = () => API.get('/test');
export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);
export const fetchAllUserEmails = () => API.get('/admin/users/emails');
export const fetchVendorAnalytics = (shopId, range = 30) => API.get(`/vendors/${shopId}/analytics?range=${range}`);
export const fetchVendorRating = (shopId) => API.get(`/vendors/${shopId}/rating`);
export const fetchMyShop = () => API.get('/vendor/my-shop');





export const createReview = (productId, reviewData) => API.post(`/products/${productId}/reviews`, reviewData);



export const fetchProducts = () => API.get('/products');
export const fetchProductById = (id) => API.get(`/products/${id}`);



export const createProduct = (productData) => API.post('/products', productData);
export const fetchVendorProducts = () => API.get('/vendor/my-products');
export const updateProduct = (productId, updateData) => API.put(`/products/${productId}`, updateData);



export const createOrder = (cartData) => API.post('/orders', cartData);
export const createPaymentIntent = (cartData) => API.post('/payments/create-payment-intent');
export const fetchCustomerOrders = () => API.get('/orders/my-orders');
export const fetchOrderById = (orderId) => API.get(`/orders/${orderId}`);
export const fetchVendorSales = () => API.get('/vendor/my-sales');
