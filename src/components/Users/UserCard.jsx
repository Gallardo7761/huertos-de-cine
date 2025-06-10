import '@/css/UserCard.css';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserCard = ({ user }) => {
    const handleDelete = async () => {

    }

    return (
        <div className="card rounded-4 user-card col-4">
            <div className="card-body d-flex justify-content-between align-items-center">
                <h5 className="card-title m-0">{user.display_name}</h5>
                <div className="m-0 p-0">
                    <button className="btn btn-link text-danger delete-button m-0 p-0"
                        onClick={handleDelete}
                    >
                        <FontAwesomeIcon icon={faTrashCan} className='fa-lg' />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserCard;