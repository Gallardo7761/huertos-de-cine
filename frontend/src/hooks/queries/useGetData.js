import { useApiQuery } from './useApiQuery';

export const useGetData = (url, params = {}, options = {}) => {
  const { data, isLoading, error, refetch } = useApiQuery('getData', url, params, options);

  return {
    data,
    dataLoading: isLoading,
    dataError: error,
    refetch,
  };
};
