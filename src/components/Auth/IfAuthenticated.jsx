import { useAuth } from "@/hooks/useAuth.js";

const IfAuthenticated = ({ children }) => {
  const { authStatus } = useAuth();
  return authStatus === "authenticated" ? children : null;
};

export default IfAuthenticated;
