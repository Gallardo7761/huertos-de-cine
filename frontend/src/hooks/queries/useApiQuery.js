import { useQuery } from '@tanstack/react-query';
import { handleAxiosError } from '../../util/apiUtils';
import axiosInstance from '../../api/axiosInstance'; 

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  headers['Content-Type'] = 'application/json';
  return headers;
};

export const useApiQuery = (queryKey, url, params = {}, options = {}) => {
  const normalizedKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  return useQuery({
    queryKey: [...normalizedKey, url, params],
    queryFn: async () => {
      const headers = getAuthHeaders();
      try {
        const response = await axiosInstance.get(url, { 
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
