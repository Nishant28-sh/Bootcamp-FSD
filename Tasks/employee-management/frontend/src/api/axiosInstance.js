import axios from 'axios';

// Deployed backend on Render
const BASE_URL = import.meta.env.VITE_API_URL || 'https://bootcamp-fsd.onrender.com/employees';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
