import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const uploadResume = async (formData) => {
  return axios.post(`${API_BASE_URL}/api/upload-resume`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const generateOptimizedResume = async (jobDescription, resumeFilename) => {
  return axios.post(`${API_BASE_URL}/api/generate-resume`, {
    jobDescription,
    resumeFilename,
  });
};

export const downloadOptimizedResume = async () => {
  return axios.get(`${API_BASE_URL}/api/download-resume`, {
    responseType: 'blob',
  });
};
