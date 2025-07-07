// frontend/src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://172.29.80.1:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
