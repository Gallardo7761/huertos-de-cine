import "@/css/FloatingMenuButton.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddMovieButton = () => {
    return (
        <button className="floating-menu-button">
            <FontAwesomeIcon icon={faPlus} className="fa-2x" />
        </button>
    );
}

export default AddMovieButton;