import { useState } from 'react';
import { Form } from 'react-bootstrap';
import '../../css/PasswordInput.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

const PasswordInput = ({ value, onChange, name = "password" }) => {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow(prev => !prev);

  return (
    <div className="position-relative w-100">
      <Form.Label htmlFor="passwordInput" className="fw-semibold">
        <FontAwesomeIcon icon={faKey} className="me-2" />
        Contraseña
      </Form.Label>

      <div className="position-relative">
        <Form.Control
          id="passwordInput"
          type={show ? "text" : "password"}
          name={name}
          value={value}
          placeholder="Escribe tu contraseña"
          onChange={onChange}
          className="rounded-4 pe-5" // padding-end para que no tape el texto
        />

        <Button
          type="button"
          variant="link"
          className="show-button position-absolute end-0 top-0 h-100 me-2"
          onClick={toggleShow}
          aria-label="Mostrar contraseña"
          tabIndex={-1}
          style={{ zIndex: 2 }}
        >
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} className='fa-lg' />
        </Button>
      </div>
    </div>
  );
};

export default PasswordInput;
