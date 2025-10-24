import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const customerApi = {
  getAll: (companyName = '') => api.get(`/customer?companyName=${companyName}`),
  getById: (id) => api.get(`/customer/${id}`),
  create: (data) => api.post('/customer', data),
  update: (id, data) => api.patch(`/customer/${id}`, data),
  delete: (id) => api.delete(`/customer/${id}`)
}

export const machineApi = {
  getAll: () => api.get('/machine'),
  getById: (id) => api.get(`/machine/${id}`),
  create: (data) => api.post('/machine', data),
  update: (id, data) => api.patch(`/machine/${id}`, data),
  delete: (id) => api.delete(`/machine/${id}`),
  assignToCustomer: (id, customerId) => api.put(`/machine/${id}/assign`, { customerId }),
  toggleProducing: (id) => api.put(`/machine/${id}/toggle-producing`)
}

export default api
