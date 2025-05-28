import { useState, useEffect, createContext } from "react";
import createAxiosInstance from "../api/axiosInstance";
import { useConfig } from "../hooks/useConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const axios = createAxiosInstance();
  const { config } = useConfig();

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [authStatus, setAuthStatus] = useState("checking");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!config) return;

    if (!token) {
      setAuthStatus("unauthenticated");
      return;
    }

    const BASE_URL = config.apiConfig.baseUrl;
    const VALIDATE_URL = `${BASE_URL}${config.apiConfig.endpoints.auth.validateToken}`;

    const checkAuth = async () => {
      try {
        const res = await axios.get(VALIDATE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setAuthStatus("authenticated");
        } else {
          logout();
        }
      } catch (err) {
        console.error("Error validando token:", err);
        logout();
      }
    };

    checkAuth();
  }, [token, config]);

  const login = async (formData) => {
    setError(null);
    const BASE_URL = config.apiConfig.baseUrl;
    const LOGIN_URL = `${BASE_URL}${config.apiConfig.endpoints.auth.login}`;
  
    try {
      const res = await axios.post(LOGIN_URL, formData);
      const { token, member, tokenTime } = res.data.data;
  
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(member));
      localStorage.setItem("tokenTime", tokenTime);
  
      setToken(token);
      setUser(member);
      setAuthStatus("authenticated");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
  
      let message = "Ha ocurrido un error inesperado.";
  
      if (err.response) {
        const { status, data } = err.response;
  
        if (status === 400) {
          message = "Usuario o contraseña incorrectos.";
        } else if (status === 403) {
          message = "Tu cuenta está inactiva o ha sido suspendida.";
        } else if (status === 404) {
          message = "Usuario no encontrado.";
        } else if (data?.message) {
          message = data.message;
        }
      }
  
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setAuthStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ user, token, authStatus, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
