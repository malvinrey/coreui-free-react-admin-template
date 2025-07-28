import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
})

// Ini adalah INTERCEPTOR. Seperti "satpam" yang mencegat setiap request
// sebelum dikirim. Tugasnya adalah menambahkan token ke header.
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') // Ambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// --- Fungsi API ---

export const register = (userData) => {
  return apiClient.post('/register', userData)
}

export const login = (email, password) => {
  return apiClient.post('/login', { email, password })
}

export const getVendors = () => apiClient.get('/vendors')
export const createVendor = (vendorData) => apiClient.post('/vendors', vendorData)
export const updateVendor = (id, vendorData) => apiClient.put(`/vendors/${id}`, vendorData)
export const deleteVendor = (id) => apiClient.delete(`/vendors/${id}`)

export const getProducts = () => apiClient.get('/products')
export const createProduct = (productData) => apiClient.post('/products', productData)
export const updateProduct = (id, productData) => apiClient.put(`/products/${id}`, productData)
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`)

export const addStockToProduct = (productId, stockData) => {
  return apiClient.post(`/products/${productId}/add-stock`, stockData)
}

export const createStockOut = (transactionData) => {
  return apiClient.post('/stock-out', transactionData)
}

export const logout = () => {
  return apiClient.post('/logout')
}

export const startNewOpname = () => {
  return apiClient.post('/stock-opnames')
}

export const getOpnameSession = (id) => {
  return apiClient.get(`/stock-opnames/${id}`)
}

export const updateOpnameDetail = (opnameId, detailData) => {
  return apiClient.post(`/stock-opnames/${opnameId}/details`, detailData)
}

export const completeOpnameSession = (id) => {
  return apiClient.put(`/stock-opnames/${id}/complete`)
}

export const getOpnameSessions = () => apiClient.get('/stock-opnames')

// Tambahkan fungsi lain sesuai kebutuhan
