import axios from 'axios';

// Khởi tạo một instance của axios với URL mặc định của Backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Thay bằng URL deploy sau này
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động gắn token vào header trước khi gửi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;