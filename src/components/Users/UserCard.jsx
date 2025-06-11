import '@/css/UserCard.css';
import { faTrashCan, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserCard = ({ renderMode, user, onAdd, onDelete }) => {
    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 my-2 p-1">
            <div className="card rounded-4 user-card h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <h5 className="card-title m-0">{user.display_name}</h5>
                    <div className="m-0 p-0">
                        {renderMode === 'add' ? (
                            <button className="btn btn-link text-success delete-button m-0 p-0" onClick={onAdd}>
                                <FontAwesomeIcon icon={faUserPlus} className="fa-lg" />
                            </button>
                        ) : (
                            <button className="btn btn-link text-danger delete-button m-0 p-0" onClick={onDelete}>
                                <FontAwesomeIcon icon={faTrashCan} className="fa-lg" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>


    );
}

export default UserCard;