import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { handleAxiosError } from '../../util/apiUtils';

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const usePostMutation = (onError) => {  
  return useMutation({
    mutationFn: async ({ url, data }) => {
      const isFormData = data instanceof FormData;
      const headers = getAuthHeaders(isFormData);
      const response = await axios.post(url, data, { headers });
      return response.data;
    },
    onError: (error) => {
      const parsedError = handleAxiosError(error);
      if (parsedError.status !== 422 && onError) {
        onError(parsedError);
      }
      throw parsedError;
    },
  });
};

export const usePutMutation = (onError) => {  
  return useMutation({
    mutationFn: async ({ url, data }) => {
      const isFormData = data instanceof FormData;
      const headers = getAuthHeaders(isFormData);
      const response = await axios.put(url, data, { headers });
      return response.data;
    },
    onError: (error) => {
      const parsedError = handleAxiosError(error);
      if (parsedError.status !== 422 && onError) {
        onError(parsedError);
      }
      throw parsedError;
    },
  });
};

export const useDeleteMutation = (onError) => {
  return useMutation({
    mutationFn: async ({ url, data = null }) => {
      const headers = getAuthHeaders(false);
      const config = { headers };
      if (data) {
        config.data = data;
      }
      const response = await axios.delete(url, config);
      return response.data;
    },
    onError: (error) => {
      const parsedError = handleAxiosError(error);
      if (parsedError.status !== 422 && onError) {
        onError(parsedError);
      }
      throw parsedError;
    },
  });
};
