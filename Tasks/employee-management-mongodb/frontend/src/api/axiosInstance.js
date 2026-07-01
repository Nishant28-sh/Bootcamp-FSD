import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://bootcamp-fsd-2.onrender.com';

const api = axios.create({
  baseURL: `${BASE_URL.replace(/\/+$/, '')}/employees`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
