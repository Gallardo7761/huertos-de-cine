import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ProtectedRoute = ({ minimumRoles, children }) => {
  const { authStatus, user } = useAuth();

  if (authStatus === "checking") return <FontAwesomeIcon icon={faSpinner} />;
  if (authStatus === "unauthenticated") return <Navigate to="/" replace />;

  if (authStatus === "authenticated" && minimumRoles) {
    const userRole = user?.role;
    if (!minimumRoles.includes(userRole)) return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
