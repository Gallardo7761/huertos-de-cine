import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { handleAxiosError } from '../../util/apiUtils';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  headers['Content-Type'] = 'application/json';
  return headers;
};

export const useApiQuery = (queryKey, url, params = {}, options = {}) => {
  return useQuery({
    queryKey: [queryKey, url, params],
    queryFn: async () => {
      const headers = getAuthHeaders();
      try {
        const response = await axios.get(url, { 
          headers,
          params,
        });
        return response.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    enabled: !!url,
    ...options,
  });
};
