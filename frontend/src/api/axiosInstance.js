import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'production'
          ? "https://api.miarma.net/v2/cine"
          : "http://localhost:10000/v2/cine",
});

axiosInstance.interceptors.request.use((config) => {
  const oidcStorage = localStorage.getItem("oidc.user:https://id.miarma.net:hdc-frontend-id");
  if (oidcStorage) {
    const user = JSON.parse(oidcStorage);
    if (user && user.id_token) {
      config.headers.Authorization = `Bearer ${user.id_token}`;
    }
    if (user && user.access_token) {
      config.headers['X-Access-Token'] = user.access_token;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;