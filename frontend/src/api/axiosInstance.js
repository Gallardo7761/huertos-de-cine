import axios from "axios";
import { OIDC_STORAGE_KEY } from "@/util/oidc";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'production'
          ? "https://api.huertosbellavista.es/v2/cine"
          : "http://localhost:10000/v2/cine",
});

// La API solo acepta el access token, no el id_token
axiosInstance.interceptors.request.use((config) => {
  const oidcStorage = localStorage.getItem(OIDC_STORAGE_KEY);
  if (oidcStorage) {
    const user = JSON.parse(oidcStorage);
    if (user && user.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
