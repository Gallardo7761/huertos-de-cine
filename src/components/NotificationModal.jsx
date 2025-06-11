import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleXmark,
  faCircleExclamation,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  success: faCircleCheck,
  danger: faCircleXmark,
  warning: faCircleExclamation,
  info: faCircleInfo
};

const NotificationModal = ({
  show,
  onClose,
  title,
  message,
  variant = "info",
  buttons = [{ label: "Aceptar", variant: "primary", onClick: onClose }]
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className={`bg-${variant} ${variant === 'info' ? 'text-dark' : 'text-white'}`}>
        <Modal.Title>
          <FontAwesomeIcon icon={iconMap[variant] || faCircleInfo} className="me-2" />
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>

      <Modal.Footer>
        {buttons.map((btn, index) => (
          <Button
            key={index}
            variant={btn.variant || "primary"}
            onClick={btn.onClick || onClose}
          >
            {btn.label}
          </Button>
        ))}
      </Modal.Footer>
    </Modal>
  );
};

NotificationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['success', 'danger', 'warning', 'info']),
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      variant: PropTypes.string,
      onClick: PropTypes.func
    })
  )
};

export default NotificationModal;
