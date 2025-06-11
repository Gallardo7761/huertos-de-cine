import { useState } from "react";
import CustomModal from "@/components/CustomModal";
import { Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCancel,
    faSave,
    faEye,
    faKey,
    faEyeSlash,
    faDice
} from "@fortawesome/free-solid-svg-icons";

const AddViewerModal = ({ show, onClose, onSubmit }) => {
    const [viewer, setViewer] = useState({
        display_name: "",
        password: "",
        status: 1,
        role: 0,
        global_status: 1,
        global_role: 0
    });

    const [errors, setErrors] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword((v) => !v);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setViewer((prev) => ({ ...prev, [name]: value }));
    };

    const generateRandomPassword = (length = 12) => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
        let pass = "";
        for (let i = 0; i < length; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    };

    const handleGeneratePassword = () => {
        const newPass = generateRandomPassword();
        setViewer((prev) => ({ ...prev, password: newPass }));
        setShowPassword(true);
    };

    const handleSubmit = () => {
        const validationErrors = [];
        const { display_name, password } = viewer;

        if (!display_name.trim()) validationErrors.push("El nombre para mostrar es obligatorio.");
        if (!password.trim()) validationErrors.push("La contraseña es obligatoria.");
        if (password.length < 6) validationErrors.push("La contraseña debe tener al menos 6 caracteres.");

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors(null);
        onSubmit?.(viewer);
        handleClose();
    };

    const handleClose = () => {
        setViewer({
            display_name: "",
            password: "",
            status: 1,
            role: 0,
            global_status: 1,
            global_role: 0
        });
        setErrors(null);
        onClose?.();
    };

    return (
        <CustomModal show={show} onClose={handleClose} title="Añadir usuario">
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

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <FontAwesomeIcon icon={faEye} className="me-2" />
                            Nombre para mostrar
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="display_name"
                            value={viewer.display_name}
                            onChange={e => {e.target.value = e.target.value.toUpperCase(); handleChange(e);}}
                            className="themed-input rounded-4"
                        />
                    </Form.Group>

                    {/* Password input con toggle show/hide */}
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                            <FontAwesomeIcon icon={faKey} className="me-2" />
                            Contraseña
                        </Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={viewer.password}
                                placeholder="Escribe tu contraseña"
                                onChange={handleChange}
                                className="rounded-4 pe-5 themed-input"
                            />
                            <div className="d-flex h-100 align-items-center gap-2 m-0 me-3 p-0 position-absolute end-0 top-0">
                                <Button
                                    type="button"
                                    variant="link"
                                    className="show-button h-100 p-0"
                                    onClick={handleGeneratePassword}
                                    aria-label="Generar contraseña aleatoria"
                                    tabIndex={-1}
                                    style={{ zIndex: 2, width: "2.5rem" }}
                                >
                                    <FontAwesomeIcon icon={faDice} className="fa-lg" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="link"
                                    className="show-button h-100 p-0"
                                    onClick={toggleShowPassword}
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    tabIndex={-1}
                                    style={{ zIndex: 2 }}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="fa-lg" />
                                </Button>
                            </div>
                        </div>
                    </Form.Group>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="danger" onClick={handleClose} className="me-2">
                            <FontAwesomeIcon icon={faCancel} className="me-2" />
                            Cancelar
                        </Button>
                        <Button variant="success" onClick={handleSubmit}>
                            <FontAwesomeIcon icon={faSave} className="me-2" />
                            Guardar
                        </Button>
                    </div>
                </Form>
            </div>
        </CustomModal>
    );
};

export default AddViewerModal;
