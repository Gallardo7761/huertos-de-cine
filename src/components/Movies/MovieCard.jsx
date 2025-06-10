import '@/css/MovieCard.css';
import { useState, useEffect, useRef } from 'react';
import CustomModal from '../CustomModal';
import { faAlignCenter, faCancel, faEdit, faImage, faPenFancy, faSave, faThumbsDown, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useData } from '@/hooks/useData';
import { useConfig } from '@/hooks/useConfig';
import { Button, Form, Alert } from 'react-bootstrap';
import FileUpload from '@/components/FileUpload';

const MovieCard = ({ movie_id, title, description, cover }) => {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(null); // 'up', 'down' o null
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { getData, putData, postData, deleteData, deleteDataWithBody } = useData();
  const { config } = useConfig();
  const userId = JSON.parse(localStorage.getItem('user') || '{}')?.user_id;

  useEffect(() => {
    if (!config) return;

    const fetchVotes = async () => {
      try {
        const url = `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.movies.getVotes}`.replace(':movie_id', movie_id);
        const response = await getData(url);

        const votesTotal = response.data.reduce((acc, v) => acc + v.vote, 0);
        setVotes(votesTotal);

        const myVote = response.data.find(v => v.user_id === userId)?.vote;
        setUserVote(myVote === 1 ? 'up' : myVote === -1 ? 'down' : null);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    fetchVotes();
  }, [movie_id, getData, config, userId]);

  const sendVote = async (type) => {
    if (!config) return;

    const voteValue = type === 'up' ? 1 : -1;
    const url = `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.movies.getVotes}`.replace(':movie_id', movie_id);

    try {
      await postData(url, { user_id: userId, vote: voteValue });

      let delta = voteValue;
      if (userVote === 'up' && type === 'down') delta = -2;
      else if (userVote === 'down' && type === 'up') delta = 2;

      setVotes(v => v + delta);
      setUserVote(type);
    } catch (err) {
      console.error('Error al votar:', err);
    }
  };

  const handleUnvote = async () => {
    if (!config) return;

    const url = `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.movies.getVotes}`.replace(':movie_id', movie_id);
    try {
      await deleteDataWithBody(url, { user_id: userId });
      setVotes(v => v + (userVote === 'up' ? -1 : 1));
      setUserVote(null);
    } catch (err) {
      console.error('Error al quitar voto:', err);
    }
  };

  const handleVoteClick = (type) => (userVote === type ? handleUnvote() : sendVote(type));

  const handleDelete = () => {
    setDeleteTarget(movie_id);
  }

  const handleEdit = async (formData) => {
    const editUrl = `${config.apiConfig.baseRawUrl}${config.apiConfig.endpoints.movies.getById}`.replace(':movie_id', movie_id);

    let coverUrl = cover;

    if (formData.coverFile) {
      // === Lógica de subida de archivo ===
      const file = formData.coverFile;
      const file_name = file.name;
      const mime_type = file.type || "application/octet-stream";
      const uploaded_by = JSON.parse(localStorage.getItem("user"))?.user_id;
      const context = 3;

      const fileFormData = new FormData();
      fileFormData.append("file", file);
      fileFormData.append("file_name", file_name);
      fileFormData.append("mime_type", mime_type);
      fileFormData.append("uploaded_by", uploaded_by);
      fileFormData.append("context", context);

      const uploadUrl = `${config.apiConfig.coreRawUrl}${config.apiConfig.endpoints.files.upload}`;

      try {
        await postData(uploadUrl, fileFormData);
        coverUrl = `https://miarma.net/files/cine/${file_name}`;
      } catch (err) {
        console.error("Error al subir archivo:", err);
        return; // no sigas si el archivo ha fallado
      }
      // =====================================
    }

    const data = {
      movie_id,
      title: formData.title,
      description: formData.description,
      cover: coverUrl,
    };

    try {
      await putData(editUrl, data);
    } catch (err) {
      console.error("Error al editar la película:", err.message);
    }
  };

  return (
    <>
      <div className="movie-card rounded-4 card m-0 p-0 col-md-4 col-xl-2 shadow-sm">
        <div className="d-flex m-0 p-0 position-absolute top-0 end-0">
          <button className="btn btn-primary edit-button"
            onClick={() => setEditModal(true)}
          >
            <FontAwesomeIcon icon={faEdit} className='fa-lg' />
          </button>
          <button className="btn btn-danger delete-button"
            onClick={handleDelete}
          >
            <FontAwesomeIcon icon={faTrash} className='fa-lg' />
          </button>
        </div>
        <img
          src={cover}
          alt={`Cartel de ${title}`}
          onClick={() => setModal(true)}
          className="rounded-top-4"
        />
        <div className="card-footer movie-vote rounded-bottom-4">
          <div className="px-3">
            <div className="d-flex align-items-center justify-content-between">
              <span
                onClick={e => { e.stopPropagation(); handleVoteClick('up'); }}
                className={`vote-button ${userVote === 'up' ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
              </span>
              <span className="vote-count">{votes || 0}</span>
              <span
                onClick={e => { e.stopPropagation(); handleVoteClick('down'); }}
                className={`vote-button ${userVote === 'down' ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <CustomModal show={modal} onClose={() => setModal(false)} title={title}>
        <div className="p-3 movie-description">
          <p>{description}</p>
        </div>
      </CustomModal>

      <CustomModal
        title="Confirmar eliminación"
        show={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
      >
        <p className='p-3'>¿Estás seguro de que quieres eliminar la película?</p>
        <div className="d-flex justify-content-end gap-2 mt-3 p-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button
            variant="danger"
            onClick={async () => {
              try {
                await deleteData(`${config.apiConfig.baseRawUrl}${config.apiConfig.endpoints.movies.getById}`.replace(':movie_id', deleteTarget));
                setDeleteTarget(null);
              } catch (err) {
                console.error("Error al eliminar:", err.message);
              }
            }}
          >
            Confirmar
          </Button>
        </div>
      </CustomModal>

      <CustomModal show={editModal} onClose={() => setEditModal(false)} title="Editar película">
        <EditMovieForm
          initialTitle={title}
          initialDescription={description}
          initialCover={cover}
          onSubmit={(formData) => {
            handleEdit(formData);
            setEditModal(false);
          }}
          onCancel={() => setEditModal(false)}
        />
      </CustomModal>
    </>
  );
};

const EditMovieForm = ({ initialTitle, initialDescription, initialCover, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState(null);
  const fileUploadRef = useRef();

  const handleSubmit = () => {
    const validationErrors = [];
    if (!title.trim()) validationErrors.push("El título es obligatorio.");
    if (!description.trim()) validationErrors.push("La descripción es obligatoria.");

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors(null);
    const formData = {
      title,
      description,
      coverFile: files[0] || null, // Solo mandas si cambió
    };

    onSubmit?.(formData);
  };

  return (
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="themed-input rounded-4"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faImage} className="me-2" />
            Nueva portada (opcional)
          </Form.Label>
          <FileUpload ref={fileUploadRef} onFilesSelected={setFiles} />
        </Form.Group>

        <div className="d-flex justify-content-end mt-4">
          <Button variant="danger" onClick={onCancel} className="me-2">
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
  );
};


export default MovieCard;
