
import axios from 'axios';
import { FileData } from '../types/file';

const API_BASE_URL = 'https://bit-camp-2025.onrender.com/'

const api = axios.create({
  baseURL: API_BASE_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // adjust as needed
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));


export const registerUser = async (email: string, password: string) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const sendFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/send', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getReviewFiles = () => api.get<{ files: FileData[] }>("/review");

export const getFileDetail = (fileId: string) =>
    api.get(`/review/${fileId}`);
  

// src/services/api.ts
export const decideOnFile = (
    fileId: string,
    action: "approved" | "denied"
  ) => {
    const form = new URLSearchParams();
    form.append("action", action);
    return api.post(
      `/decision/${fileId}`,
      form,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
  };
  
  

export default api;
