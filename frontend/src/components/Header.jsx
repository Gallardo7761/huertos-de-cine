import '@/css/Header.css';
import { Link } from 'react-router-dom';
import Navbar from "@/components/NavBar";
import IfAuthenticated from "@/components/Auth/IfAuthenticated";
import { useAuth } from "@/hooks/useAuth";
import IfRole from '@/components/Auth/IfRole';
import IfNotAuthenticated from './Auth/IfNotAuthenticated';

const Header = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    }

    return (
        <>
            <header className={`text-center header p-4 d-flex flex-column justify-content-center align-items-center`}>
                <Link to='/' className='text-decoration-none'>
                    <h1>Huer🌱os de 🎬ine</h1>
                </Link>
            </header>
            <Navbar
                rightContent={
                    <div className='d-flex m-0 p-0 gap-4 flex-column flex-lg-row align-items-lg-center'>
                        <IfAuthenticated>
                            <li className="nav-item">
                                <Link to="/votar" className="nav-link p-0">
                                    votos
                                </Link>
                            </li>
                            <IfRole roles={['ADMIN']}>
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link p-0">
                                        admin
                                    </Link>
                                </li>
                            </IfRole>
                            <button 
                                onClick={handleLogout} 
                                className="nav-link p-0 bg-transparent border-0 text-start"
                            >
                                Cerrar sesión
                            </button>
                        </IfAuthenticated>
                        <IfNotAuthenticated>
                            <Link to="/login" className="nav-link p-0">
                                Iniciar sesión
                            </Link>
                        </IfNotAuthenticated>
                    </div>
                }
            >
                <IfAuthenticated>
                    <li className="nav-item user-name nav-link p-0">{`@${user?.preferred_username}`}</li>
                </IfAuthenticated>
            </Navbar>
        </>
    );
}

export default Header;