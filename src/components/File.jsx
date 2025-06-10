import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import '@/css/File.css';

const File = ({ file, onDelete }) => {
  const getIcon = (type) => {
    const dir = "/images/icons/filetype/";
    switch (type) {
      case "image/jpeg":
        return dir + "jpg_64.svg";
      case "image/png":
        return dir + "png_64.svg";
      case "video/mp4":
        return dir + "mp4_64.svg";
      case "application/pdf":
        return dir + "pdf_64.svg";
      case "text/plain":
        return dir + "txt_64.svg";
      default:
        return dir + "file_64.svg";
    }
  };

  return (
    <Card
      className="file-card col-sm-3 col-lg-2 col-xxl-1 m-0 p-0 position-relative text-decoration-none bg-transparent"
      onClick={() => window.open(`https://miarma.net/files/huertos/${file.file_name}`, "_blank")}
    >
      <Card.Body className="text-center">
        <img
          src={getIcon(file.mime_type)}
          alt={file.file_name}
          className="img-fluid mb-2"
        />
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>{file.file_name}</Tooltip>}
        >
          <p className="m-0 p-0 text-truncate">{file.file_name}</p>
        </OverlayTrigger>
      </Card.Body>

      <Button
        variant="transparent"
        size="md"
        color="text-danger"
        className="delete-btn position-absolute top-0 end-0 m-0"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(file);
        }}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </Button>
    </Card>
  );
};

export default File;
