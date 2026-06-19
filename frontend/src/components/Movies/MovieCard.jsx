import '@/css/MovieCard.css';
import { useState } from 'react';
import CustomModal from '@/components/CustomModal';
import { faCancel, faEdit, faTrash, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import IfRole from '@/components/Auth/IfRole';
import MovieForm from './MovieForm';

const MovieCard = ({ movieId, title, description, cover, upvotes, downvotes, userVote, onVote, onEdit, onDelete, isAdmin }) => {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const totalScore = upvotes - downvotes;

  return (
    <>
      <div className="movie-card rounded-4 card h-100 m-0 p-0 shadow-sm">
        {isAdmin && (
          <IfRole roles={['ADMIN']}>
            <div className="d-flex m-0 p-2 position-absolute top-0 end-0 gap-2" style={{ zIndex: 10 }}>
              <button className="btn btn-light edit-button" onClick={() => setEditModal(true)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="btn btn-light delete-button" onClick={() => setDeleteTarget(movieId)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </IfRole>
        )}

        <img
          src={cover}
          alt={title}
          onClick={() => setModal(true)}
          className={!isAdmin ? `rounded-top-4` : `rounded-4`}
          style={{ cursor: 'pointer' }}
        />

        {!isAdmin && (
          <div className="card-footer movie-vote rounded-bottom-4">
            <div className="d-flex align-items-center justify-content-center gap-3">
              <span onClick={() => onVote(movieId, 1)} className={`vote-button ${userVote === 1 ? 'active-up' : ''}`}>
                <FontAwesomeIcon icon={faThumbsUp} />
              </span>

              <small className={`fw-bold vote-score ${userVote === 1 ? 'score-up' : userVote === -1 ? 'score-down' : ''}`}>
                {totalScore}
              </small>

              <span onClick={() => onVote(movieId, -1)} className={`vote-button ${userVote === -1 ? 'active-down' : ''}`}>
                <FontAwesomeIcon icon={faThumbsDown} />
              </span>
            </div>
          </div>
        )}
      </div>

      <CustomModal show={modal} onClose={() => setModal(false)} title={title}>
        <div className="p-3"><p>{description}</p></div>
      </CustomModal>

      <CustomModal show={editModal} onClose={() => setEditModal(false)} title="Editar Película">
        <MovieForm
          initialData={{ title, description, cover }}
          onSubmit={(formData) => {
            onEdit(movieId, formData);
            setEditModal(false);
          }}
          onCancel={() => setEditModal(false)}
        />
      </CustomModal>

      <CustomModal show={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Eliminar">
        <div className="p-3">
          <p>¿Seguro que quieres borrar <b>{title}</b>?</p>

          <div className="d-flex justify-content-end gap-3">
            <Button variant="outline-light" onClick={() => setDeleteTarget(null)} className="rounded-4">
              <FontAwesomeIcon icon={faCancel} className="me-2" /> Cancelar
            </Button>

            <Button variant="danger" type="submit" className="rounded-4" onClick={async () => {
              await onDelete(movieId);
              setDeleteTarget(null);
            }}>
              <FontAwesomeIcon icon={faTrash} className="me-2" /> Borrar
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default MovieCard;