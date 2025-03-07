import axios from 'axios';
import { API_URL } from '../config';

const getAuthToken = async () => {
  const response = await axios.post(`${API_URL}/token`, 
    'username=tejuice&password=7889&grant_type=password',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data.access_token;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to get fresh token for each request
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const startScan = async (url) => {
  try {
    const response = await api.post('/scan', { 
      url, 
      scan_type: 'full' 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to start scan');
  }
};

export const getScanResults = async (scanId) => {
  try {
    const response = await api.get(`/results/${scanId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch results');
  }
};
