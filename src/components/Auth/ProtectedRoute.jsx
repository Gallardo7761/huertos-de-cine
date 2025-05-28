import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ProtectedRoute = ({ minimumRoles, children }) => {
  const { authStatus } = useAuth();

  if (authStatus === "checking") return <FontAwesomeIcon icon={faSpinner} />; // o un loader si quieres
  if (authStatus === "unauthenticated") return <Navigate to="/login" replace />;
  if (authStatus === "authenticated" && minimumRoles) {
    const userRole = JSON.parse(localStorage.getItem("user"))?.role;
    if (!minimumRoles.includes(userRole)) return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
