import { useEffect, useState } from 'react';
import { AnimatePresence, motion as _motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import '@/css/Navbar.css';

const NavBar = ({ children, rightContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const drawerVariants = {
    hidden: { x: '100%', opacity: 0.98 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 360, damping: 35 }
    },
    exit: {
      x: '100%',
      opacity: 0.98,
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleNavbar = () => setIsOpen((prevIsOpen) => !prevIsOpen);

  const closeNavbar = () => setIsOpen(false);

  const handleDrawerClick = (event) => {
    if (event.target.closest('a')) {
      closeNavbar();
    }
  };

  return (
    <nav className="navbar sticky-top shadow-sm py-3">
      <div className="container d-flex align-items-center gap-3">
        <ul className="navbar-nav navbar-main-links d-none d-lg-flex flex-row align-items-center gap-3 mb-0">
          {children}
        </ul>

        {rightContent && (
          <div className="navbar-nav navbar-right-content d-none d-lg-flex flex-row align-items-center gap-3 mb-0">
            {rightContent}
          </div>
        )}

        <button
          className="navbar-trigger d-lg-none ms-auto"
          type="button"
          aria-controls="navbarDrawer"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Cerrar navegación' : 'Abrir navegación'}
          onClick={toggleNavbar}
        >
          <span className="navbar-trigger-line" />
          <span className="navbar-trigger-line" />
          <span className="navbar-trigger-line" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <_motion.button
                className="navbar-overlay d-lg-none"
                aria-label="Cerrar navegación"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeNavbar}
                type="button"
              />

              <_motion.aside
                className="navbar-drawer d-lg-none"
                id="navbarDrawer"
                role="dialog"
                aria-modal="true"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={drawerVariants}
                onClick={handleDrawerClick}
              >
                <div className="navbar-drawer-header">
                  <p className="m-0">Menú</p>
                  <button
                    type="button"
                    className="navbar-close-btn"
                    onClick={closeNavbar}
                    aria-label="Cerrar navegación"
                  >
                    ×
                  </button>
                </div>

                <ul className="navbar-nav navbar-mobile-links d-flex flex-column gap-3">
                  {children}
                </ul>

                {rightContent && (
                  <div className="navbar-nav navbar-mobile-right d-flex flex-column gap-3">
                    {rightContent}
                  </div>
                )}
              </_motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

NavBar.propTypes = {
  children: PropTypes.node.isRequired,
  rightContent: PropTypes.node,
};

export default NavBar;
