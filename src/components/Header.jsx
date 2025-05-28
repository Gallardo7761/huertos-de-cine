import '@/css/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className={`text-center header p-4 d-flex flex-column justify-content-center align-items-center`}>
            <Link to='/' className='text-decoration-none'>
                <h1>Huertos de Cine</h1>
            </Link>
        </header>
    );
}

export default Header;