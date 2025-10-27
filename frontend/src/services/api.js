import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('Error en API:', error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/usuarios/login', credentials)
};

export const productosService = {
  getAll: () => api.get('/productos'),
  getById: (id) => api.get(`/productos/${id}`),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
  getBajoStock: () => api.get('/productos/bajo-stock')
};

export const categoriasService = {
  getAll: () => api.get('/categorias'),
  getById: (id) => api.get(`/categorias/${id}`),
  create: (data) => api.post('/categorias', data),
  update: (id, data) => api.put(`/categorias/${id}`, data),
  delete: (id) => api.delete(`/categorias/${id}`)
};

export const proveedoresService = {
  getAll: () => api.get('/proveedores'),
  getById: (id) => api.get(`/proveedores/${id}`),
  create: (data) => api.post('/proveedores', data),
  update: (id, data) => api.put(`/proveedores/${id}`, data),
  delete: (id) => api.delete(`/proveedores/${id}`)
};

export const movimientosService = {
  getAll: () => api.get('/movimientos'),
  getById: (id) => api.get(`/movimientos/${id}`),
  create: (data) => api.post('/movimientos', data),
  getByProducto: (productoId) => api.get(`/movimientos/producto/${productoId}`)
};

export default api;

