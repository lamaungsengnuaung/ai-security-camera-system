import axios from 'axios';

// true unless REACT_APP_USE_MOCK is explicitly set to "false"
export const USE_MOCK = process.env.REACT_APP_USE_MOCK !== 'false';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const WS_BASE_URL =
  process.env.REACT_APP_WS_BASE_URL || API_BASE_URL.replace(/^http/, 'ws');

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Normalise every error into a plain Error with a readable message
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail;
    const message =
      typeof detail === 'string' ? detail : detail ? JSON.stringify(detail) : error.message;
    return Promise.reject(new Error(message || 'Network error'));
  }
);

export default client;
