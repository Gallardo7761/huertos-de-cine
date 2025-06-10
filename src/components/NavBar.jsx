import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import '@/css/Navbar.css';

const _motion = motion;

const NavBar = ({ children, rightContent }) => {

  const navVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <nav className="navbar navbar-expand sticky-top navbar-dark shadow-sm py-3">
      <div className="container-fluid">
        <_motion.div
          className="collapse navbar-collapse"
          id="navbarContent"
          initial="hidden"
          animate="visible"
          variants={navVariants}
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {children}
          </ul>
          {rightContent && (
            <div className="navbar-nav d-flex ms-auto">
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