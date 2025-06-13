import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import '@/css/Navbar.css';

const _motion = motion;

const NavBar = ({ children, rightContent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark shadow-sm py-3">
      <div className="container">
        <button 
          className="navbar-toggler" 
          type="button" 
          aria-controls="navbarContent" 
          aria-expanded={isOpen} 
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <_motion.div
          className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
          id="navbarContent"
          initial="hidden"
          animate="visible"
          variants={navVariants}
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center gap-3">
            {children}
          </ul>
          {rightContent && (
            <div className="navbar-nav d-flex ms-auto align-items-center">
              {rightContent}
            </div>
          )}
        </_motion.div>
      </div>
    </nav>
  );
};

NavBar.propTypes = {
  children: PropTypes.node.isRequired,
  rightContent: PropTypes.node,
};

export default NavBar;
