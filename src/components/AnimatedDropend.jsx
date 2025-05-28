import { useState, useRef, useEffect, cloneElement } from 'react';
import { Button } from 'react-bootstrap';
import { AnimatePresence, motion as _motion } from 'framer-motion';
import '@/css/AnimatedDropdown.css';

const AnimatedDropend = ({
  trigger,
  icon,
  variant = "secondary",
  className = "",
  buttonStyle = "",
  show,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  children
}) => {
  const isControlled = show !== undefined;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const actualOpen = isControlled ? show : open;

  const toggle = (forceValue) => {
    const newState = typeof forceValue === "boolean" ? forceValue : !actualOpen;
    if (!isControlled) setOpen(newState);
    onToggle?.(newState);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        if (!isControlled) setOpen(false);
        onToggle?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isControlled, onToggle]);

  const handleMouseEnter = () => {
    if (!isControlled) setOpen(true);
    onToggle?.(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    if (!isControlled) setOpen(false);
    onToggle?.(false);
    onMouseLeave?.();
  };

  const triggerElement = trigger
    ? (typeof trigger === "function"
      ? trigger({ 
        onClick: e => {
          e.stopPropagation();
          toggle();
        }, 
        ref: triggerRef 
      })
      : cloneElement(trigger, { 
        onClick: e => {
          e.stopPropagation();
          toggle();
        }, 
        ref: triggerRef 
      }))
    : (
      <Button
        ref={triggerRef}
        variant={variant}
        className={`circle-btn ${buttonStyle}`}
        onClick={toggle}
      >
        {icon}
      </Button>
    );

  const dropdownClasses = `dropdown-menu show shadow rounded-4 px-2 py-2 ${className}`;

  return (
    <div
      className="position-relative d-inline-block dropend"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={triggerRef}
    >
      {triggerElement}

      <AnimatePresence>
        {actualOpen && (
          <_motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className={dropdownClasses}
            style={{
              position: 'absolute',
              top: '0',
              left: '100%',
              zIndex: 1000,
              whiteSpace: 'nowrap'
            }}
          >
            {typeof children === "function" ? children({ closeDropdown: () => toggle(false) }) : children}
          </_motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedDropend;
