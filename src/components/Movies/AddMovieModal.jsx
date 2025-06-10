import { useState, useRef } from "react";
import CustomModal from "@/components/CustomModal";
import FileUpload from "@/components/FileUpload";
import { Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter, faCancel, faImage, faPenFancy, faSave } from "@fortawesome/free-solid-svg-icons";

const AddMovieModal = ({ show, onClose, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState(null);
    const fileUploadRef = useRef();

    const handleSubmit = () => {
        const validationErrors = [];
        if (!title.trim()) validationErrors.push("El título es obligatorio.");
        if (!description.trim()) validationErrors.push("La descripción es obligatoria.");
        if (files.length === 0) validationErrors.push("Debes subir una portada.");

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors(null);
        const formData = {
            title,
            description,
            coverFile: files[0], // Solo 1 portada
        };

        onSubmit?.(formData);
        handleClose();
    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setFiles([]);
        fileUploadRef.current?.resetSelectedFiles();
        setErrors(null);
        onClose?.();
    };

    return (
        <CustomModal show={show} onClose={handleClose} title="Añadir película">
            <div className="p-3">
                <Form>
                    {errors && (
                        <Alert variant="danger">
                            <ul className="mb-0">
                                {errors.map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                ))}
                            </ul>
                        </Alert>
                    )}

                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label>
                            <FontAwesomeIcon icon={faPenFancy} className="me-2" />
                            Título
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduce el título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="themed-input rounded-4"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>
                        <FontAwesomeIcon icon={faAlignCenter} className="me-2" />
                            Descripción
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Introduce una descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="themed-input rounded-4"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <FontAwesomeIcon icon={faImage} className="me-2" />
                            Portada
                        </Form.Label>
                        <FileUpload ref={fileUploadRef} onFilesSelected={setFiles} />
                    </Form.Group>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="danger" onClick={handleClose} className="me-2">
                            <FontAwesomeIcon icon={faCancel} className="me-2" />
                            Cancelar
                        </Button>
                        <Button variant="warning" onClick={handleSubmit}>
                            <FontAwesomeIcon icon={faSave} className="me-2" />
                            Guardar
                        </Button>
                    </div>
                </Form>
            </div>
        </CustomModal>
    );
};

export default AddMovieModal;
