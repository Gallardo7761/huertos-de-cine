import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import PasswordInput from './PasswordInput.jsx';

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext.jsx";

import CustomContainer from '@/components/CustomContainer.jsx';
import ContentWrapper from '@/components/ContentWrapper.jsx';

import '@/css/LoginForm.css';

const LoginForm = () => {
    const { login, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        emailOrUserName: "",
        password: "",
        keepLoggedIn: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.emailOrUserName);

        const loginBody = {
            password: formState.password,
            keepLoggedIn: Boolean(formState.keepLoggedIn),
        };
    
        if (isEmail) {
            loginBody.email = formState.emailOrUserName;
        } else {
            loginBody.userName = formState.emailOrUserName;
        }
    
        try {
            await login(loginBody);
            navigate("/");
        } catch (err) {
            console.error("Error de login:", err.message);
        }
    };

    return (
        <CustomContainer>
            <ContentWrapper>
                <div className="login-card card shadow p-5 rounded-5 mx-auto col-12 col-md-8 col-lg-6 col-xl-5 d-flex flex-column gap-4">
                    <h1 className="text-center">Inicio de sesión</h1>
                    <Alert dismissible variant="info" className="py-2 mb-0">
                        <p className='text-dark m-0 p-0'>Los socios que lleven registrados desde antes del <strong>20/04/25</strong> mantienen su contraseña antigua.</p>
                    </Alert>
                    <Form className="d-flex flex-column gap-5" onSubmit={handleSubmit}>
                        <div className="d-flex flex-column gap-3">
                            <FloatingLabel
                                controlId="floatingUsuario"
                                label={
                                    <>
                                        <FontAwesomeIcon icon={faUser} className="me-2" />
                                        Usuario o Email
                                    </>
                                }
                            >
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    name="emailOrUserName"
                                    value={formState.emailOrUserName}
                                    onChange={handleChange}
                                    className="rounded-4"
                                />
                            </FloatingLabel>

                            <PasswordInput
                                value={formState.password}
                                onChange={handleChange}
                                name="password"
                            />

                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                                <Form.Check
                                    type="checkbox"
                                    name="keepLoggedIn"
                                    label="Mantener sesión iniciada"
                                    className="text-secondary"
                                    value={formState.keepLoggedIn}
                                    onChange={(e) => { formState.keepLoggedIn = e.target.checked; setFormState({ ...formState }) }}
                                />
                                {/*<Link disabled to="#" className="muted">
                                    Olvidé mi contraseña
                                </Link>*/}
                            </div>
                        </div>

                        {error && (
                            <Alert variant="danger" className="text-center py-2 mb-0">
                                {error}
                            </Alert>
                        )}

                        <div className="text-center">
                            <Button type="submit" className="w-75 padding-4 rounded-4 border-0 shadow-sm login-button">
                                Iniciar sesión
                            </Button>
                        </div>
                    </Form>
                </div>
            </ContentWrapper>
        </CustomContainer>
    );
};


export default LoginForm;
