import Header from "@/components/Header";
import { Route, Routes, Navigate, Link } from 'react-router-dom'
import Votar from "@/pages/Votar";
import NotFound from "@/pages/NotFound";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Admin from "@/pages/Admin";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";

const LoginRedirect = () => {
  const { login, authStatus } = useAuth();

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      login();
    }
  }, [authStatus, login]);

  if (authStatus === "authenticated") return <Navigate to="/votar" replace />;

  return <div className="text-center py-5">Redirigiendo a HuertosID...</div>;
};

const HomeTrafficCop = () => {
  const { authStatus } = useAuth();

  if (authStatus === "checking") {
    return (
      <div className="text-center py-5">
        <FontAwesomeIcon icon={faSpinner} spin size="2xl" />
      </div>
    );
  }

  if (authStatus === "authenticated") {
    return <Navigate to="/votar" replace />;
  }

  return (
    <div className="d-flex gap-3 align-items-center my-5 w-100 justify-content-center text-secondary">
      <FontAwesomeIcon icon={faLock} size="xl" />
      <h1 className="m-0">Inicia sesión para votar</h1>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomeTrafficCop />} />
        
        <Route path="/votar" element={
          <ProtectedRoute minimumRoles={["USER", "ADMIN"]}>
            <Votar />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/admin" element={
          <ProtectedRoute minimumRoles={["ADMIN"]}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;
