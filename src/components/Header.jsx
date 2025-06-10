import '@/css/Header.css';
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import IfAuthenticated from "@/components/Auth/IfAuthenticated";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    }

    return (
        <>
            <header className={`text-center header p-4 d-flex flex-column justify-content-center align-items-center`}>
                <Link to='/' className='text-decoration-none'>
                    <h1>Huertos de Cine</h1>
                </Link>
            </header>
            <IfAuthenticated>
                <Navbar
                    rightContent={
                        <Link to="/login" onClick={handleLogout} className="nav-link p-0">
                            <FontAwesomeIcon icon={faSignOut} className="me-2" />
                            Cerrar sesión
                        </Link>
                    }
                >
                </Navbar>
            </IfAuthenticated>
        </>
    );
}

export default Header;