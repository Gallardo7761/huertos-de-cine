import Header from "@/components/Header";
import { Route, Routes, Navigate, Link } from 'react-router-dom'
import Login from "@/pages/Login";
import Votar from "@/pages/Votar";
import NotFound from "@/pages/NotFound";
import Footer from "@/components/Footer";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { CONSTANTS } from "./util/constants";
import FloatingMenu from "./components/FloatingMenu/FloatingMenu";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/votar" replace />} />
        <Route path="/votar" element={
          <ProtectedRoute minimumRoles={[CONSTANTS.ROLE_USER, CONSTANTS.ROLE_ADMIN]}>
            <Votar />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
      <FloatingMenu />
    </>
  )
}

export default App;
