import { useAuth } from "../../hooks/useAuth.js";

const IfRole = ({ roles, children }) => {
  const { user, authStatus } = useAuth();

  if (authStatus !== "authenticated") return null;

  const userRole = user?.role;
  
  return roles.includes(userRole) ? children : null;
};

export default IfRole;
