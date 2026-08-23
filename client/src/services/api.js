import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://e-waste-collection-mwmq.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isAdmin')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Methods

// Auth API
const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  adminLogin: (data) => api.post('/api/auth/admin/login', data),
}

// User API
const userAPI = {
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
}

// Pickup / Collection API
const pickupAPI = {
  createRequest: (data) => api.post('/api/collections', data),
  getUserRequests: () => api.get('/api/collections/user'),
  getAllRequests: () => api.get('/api/collections/admin/all'),
  updateRequestStatus: (id, data) => api.put(`/api/collections/admin/${id}/status`, data),
}

// Rewards API
const rewardsAPI = {
  getRewards: () => api.get('/api/rewards'),
  getUserRewards: () => api.get('/api/rewards/user'),
  redeemReward: (data) => api.post('/api/rewards/redeem', data),
}

// Admin API
const adminAPI = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getReports: (params) => api.get(`/api/admin/reports?from=${params.from}&to=${params.to}`),
}

export default api
export { authAPI, userAPI, pickupAPI, rewardsAPI, adminAPI }
