import { useEffect, useState } from "react";
import { parseJwt } from "../util/tokenUtils.js";
import NotificationModal from "../components/NotificationModal.jsx";
import axios from "axios";
import { useAuth } from "./useAuth.js";
import { useConfig } from "./useConfig.js";

const useSessionRenewal = () => {
  const { logout } = useAuth();
  const { config } = useConfig();

  const [showModal, setShowModal] = useState(false);
  const [alreadyWarned, setAlreadyWarned] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      const decoded = parseJwt(token);

      if (!token || !decoded?.exp) return;

      const now = Date.now();
      const expTime = decoded.exp * 1000;
      const timeLeft = expTime - now;

      if (timeLeft <= 60000 && timeLeft > 0 && !alreadyWarned) {
        setShowModal(true);
        setAlreadyWarned(true);
      }

      if (timeLeft <= 0) {
        clearInterval(interval);
        logout();
      }
    }, 10000); // revisa cada 10 segundos

    return () => clearInterval(interval);
  }, [alreadyWarned, logout]);

  const handleRenew = async () => {
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    const now = Date.now();
    const expTime = decoded?.exp * 1000;

    if (!token || !decoded || now > expTime) {
      logout();
      return;
    }

    try {
      const response = await axios.get(
        `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.auth.refreshToken}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newToken = response.data.data.token;
      localStorage.setItem("token", newToken);
      setShowModal(false);
      setAlreadyWarned(false);
    } catch (err) {
      console.error("Error renovando sesión:", err);
      logout();
    }
  };

  const modal = showModal && (
    <NotificationModal
      show={true}
      onClose={() => {
        setShowModal(false);
        logout();
      }}
      title="¿Quieres seguir conectado?"
      message="Tu sesión está a punto de expirar. ¿Quieres renovarla 1 hora más?"
      variant="info"
      buttons={[
        {
          label: "Renovar sesión",
          variant: "success",
          onClick: handleRenew,
        },
        {
          label: "Cerrar sesión",
          variant: "danger",
          onClick: () => {
            logout();
            setShowModal(false);
          },
        },
      ]}
    />
  );

  return { modal };
};

export default useSessionRenewal;
