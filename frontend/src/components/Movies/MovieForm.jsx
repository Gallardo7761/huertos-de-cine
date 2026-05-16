import { useState } from 'react';
import { Form, Button, Alert, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenFancy, faAlignCenter, faSave, faCancel, faLink } from '@fortawesome/free-solid-svg-icons';

const MovieForm = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [cover, setCover] = useState(initialData?.cover || "");
  const [errors, setErrors] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = [];
    
    if (!title.trim()) validationErrors.push("El título no puede estar vacío")
    if (!description.trim()) validationErrors.push("La descripción no puede estar vacía");
    if (!cover.trim()) validationErrors.push("El link de la portada no puede estar vacío");

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors(null);
    onSubmit({ title, description, cover });
  };

  return (
    <div className="p-3">
      <Form onSubmit={handleSubmit}>
        {errors && (
          <Alert variant="danger" className="rounded-4">
            <ul className="mb-0">
              {errors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          </Alert>
        )}

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">
            <FontAwesomeIcon icon={faPenFancy} className="me-2" /> Título
          </Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-4 themed-input"
            placeholder="Ej: Shrek 2"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">
            <FontAwesomeIcon icon={faAlignCenter} className="me-2" /> Descripción
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-4 themed-input"
            placeholder="De qué va la peli..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">
            <FontAwesomeIcon icon={faLink} className="me-2" /> URL del Cartel (IMDB)
          </Form.Label>
          <Form.Control
            type="text"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className="rounded-4 themed-input"
            placeholder="Pega aquí el enlace de la imagen..."
          />
        </Form.Group>

        {cover && cover.trim() !== "" && (
          <div className="text-center mb-3">
            <p className="small text-secondary mb-1">Previsualización en tiempo real:</p>
            <div className="d-inline-block position-relative">
              <Image 
                key={cover}
                src={cover} 
                alt="Preview" 
                thumbnail 
                className="rounded-4 shadow-sm" 
                style={{ maxHeight: '250px', minWidth: '150px', objectFit: 'contain' }}
                onError={(e) => {
                  const seed = title ? encodeURIComponent(title) : 'movie';
                  e.target.src = `https://picsum.photos/seed/${seed}/300/450`;
                }}
              />
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="outline-danger" onClick={onCancel} className="rounded-4 px-4">
            <FontAwesomeIcon icon={faCancel} className="me-2" /> Cancelar
          </Button>
          <Button variant="primary" type="submit" className="rounded-4 px-4 shadow-sm">
            <FontAwesomeIcon icon={faSave} className="me-2" /> Guardar Cambios
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default MovieForm;