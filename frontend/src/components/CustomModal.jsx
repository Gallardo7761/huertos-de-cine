import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button } from "react-bootstrap";

const CustomModal = ({ show, onClose, title, children }) => {
    return (
        <Modal show={show} onHide={onClose} size="md" centered contentClassName="rounded-4 custom-modal-dark">
            <Modal.Header className='rounded-top-4 border-0'>
                <Modal.Title className="fw-bold">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0"
                style={{
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export default CustomModal;