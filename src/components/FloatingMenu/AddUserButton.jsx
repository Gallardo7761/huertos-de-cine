import "@/css/FloatingMenuButton.css";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddUserButton = () => {
    return (
        <button className="floating-menu-button">
            <FontAwesomeIcon icon={faUserPlus} className="fa-lg" />
        </button>
    );
}

export default AddUserButton;