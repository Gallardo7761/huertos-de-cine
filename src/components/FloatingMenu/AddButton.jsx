import "@/css/AddButton.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddButton = () => {
    return (
        <button className="add-button">
            <FontAwesomeIcon icon={faPlus} className="fa-2x" />
        </button>
    );
}

export default AddButton;