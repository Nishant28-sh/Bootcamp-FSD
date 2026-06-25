import axios from 'axios';

const api = axios.create({
  baseURL: '/employees',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
