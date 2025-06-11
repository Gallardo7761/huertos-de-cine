import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

export const useData = (config) => {
  const [data, setData] = useState(null);
  const [dataLoading, setLoading] = useState(true);
  const [dataError, setError] = useState(null);
  const configRef = useRef(config); // inicializa directamente

  useEffect(() => {
    if (config?.baseUrl) {
      configRef.current = config; // actualiza la referencia al nuevo config
    }
  }, [config]);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchData = useCallback(async () => {
    const current = configRef.current; // usa el ref más actualizado
    if (!current?.baseUrl) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(current.baseUrl, {
        headers: getAuthHeaders(),
        params: current.params,
      });
      setData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []); // <- sin dependencias porque usamos configRef y funciones puras

  // este useEffect se ejecuta una vez al montar o cuando cambie el config.baseUrl
  useEffect(() => {
    if (config?.baseUrl) {
      fetchData(); // safe: fetchData está memoizado
    }
  }, [config?.baseUrl, fetchData]); // <- dependencia estable y limpia

  // función pública para forzar refetch
  const refetch = () => {
    fetchData();
  };

  const getData = async (url, params = {}) => {
    try {
      const response = await axios.get(url, {
        headers: getAuthHeaders(),
        params,
      });
      return { data: response.data.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err.response?.data?.message || err.message,
      };
    }
  };

  const postData = async (endpoint, payload) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...(payload instanceof FormData ? {} : { "Content-Type": "application/json" }),
    };
    const response = await axios.post(endpoint, payload, { headers });
    await fetchData();
    return response.data.data;
  };

  const postDataValidated = async (endpoint, payload) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...(payload instanceof FormData ? {} : { "Content-Type": "application/json" }),
      };
      const response = await axios.post(endpoint, payload, { headers });
      return { data: response.data.data, errors: null };
    } catch (err) {
      const raw = err.response?.data?.message;
      let parsed = {};
      try {
        parsed = JSON.parse(raw);
      } catch {
        return { data: null, errors: { general: raw || err.message } };
      }
      return { data: null, errors: parsed };
    }
  };

  const putData = async (endpoint, payload) => {
    const response = await axios.put(endpoint, payload, {
      headers: getAuthHeaders(),
    });
    await fetchData();
    return response.data.data;
  };

  const deleteData = async (endpoint) => {
    const response = await axios.delete(endpoint, {
      headers: getAuthHeaders(),
    });
    await fetchData();
    return response.data.data;
  };

  const deleteDataWithBody = async (endpoint, payload) => {
    const response = await axios.delete(endpoint, {
      headers: getAuthHeaders(),
      data: payload,
    });
    await fetchData();
    return response.data.data;
  };

  return {
    data,
    dataLoading,
    dataError,
    getData,
    postData,
    postDataValidated,
    putData,
    deleteData,
    deleteDataWithBody,
    refetch, // el refetch usable desde fuera
  };
};
