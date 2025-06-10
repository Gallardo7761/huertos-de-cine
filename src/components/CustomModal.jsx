import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button } from "react-bootstrap";

const CustomModal = ({ show, onClose, title, children }) => {
    return (
        <Modal show={show} onHide={onClose} size="md" centered>
            <Modal.Header className='justify-content-between'>
                <Modal.Title>{title}</Modal.Title>
                <Button variant='transparent' onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} className='close-button fa-xl' />
                </Button>
            </Modal.Header>
            <Modal.Body className="p-0"
                style={{
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    padding: '1rem',
                }}>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export default CustomModal;