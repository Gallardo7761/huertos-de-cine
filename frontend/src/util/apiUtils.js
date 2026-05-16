import axios from 'axios';

const fetchDataGeneric = async (url) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  const response = await axios.get(url, { headers });
  return response.data;
}

const fetchDataWithBlob = async (url) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  const response = await axios.get(url, {
    headers,
    responseType: 'blob'
  });
  return await response.data;
}

const handleAxiosError = (err) => {
  if (err.response && err.response.data) {
    const data = err.response.data;

    if (data.status === 422 && data.errors) {
      return {
        status: 422,
        errors: data.errors,
        path: data.path ?? null,
        timestamp: data.timestamp ?? null,
      };
    }

    return {
      status: data.status ?? err.response.status,
      error: data.error ?? null,
      message: data.message ?? err.response.statusText ?? 'Error desconocido',
      path: data.path ?? null,
      timestamp: data.timestamp ?? null,
    };
  }

  if (err.request) {
    return {
      status: null,
      error: 'Network Error',
      message: 'No se pudo conectar al servidor',
      path: null,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    status: null,
    error: 'Client Error',
    message: err.message || 'Error desconocido',
    path: null,
    timestamp: new Date().toISOString(),
  };
}

const invalidateKeys = async (queryClient, refreshKeys) => {
  if (!queryClient || !refreshKeys) return;

  const keysToInvalidate = Array.isArray(refreshKeys) ? refreshKeys : [refreshKeys];

  for (const key of keysToInvalidate) {
    try {
      await queryClient.invalidateQueries({
        queryKey: [key],
        exact: false
      });
    } catch (err) {
      console.error(`Error invalidando la key: ${key}`, err);
    }
  }
}

export { fetchDataGeneric, fetchDataWithBlob, handleAxiosError, invalidateKeys }