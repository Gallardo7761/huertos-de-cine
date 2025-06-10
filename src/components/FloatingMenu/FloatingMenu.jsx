import { useState } from "react";
import { motion as _motion, AnimatePresence } from "framer-motion";
import "@/css/FloatingMenu.css";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddMovieModal from "../Movies/AddMovieModal";
import { useData } from "@/hooks/useData";
import { useConfig } from "@/hooks/useConfig";
import LoadingIcon from "@/components/LoadingIcon";
import AddMovieButton from "./AddMovieButton";
import AddUserButton from "./AddUserButton";
import { useLocation } from "react-router-dom";

const FloatingMenu = () => {
  const [open, setOpen] = useState(false);
  const [movieModal, setMovieModal] = useState(null);
  const [userModal, setUserModal] = useState(null);
  const { postData } = useData();
  const location = useLocation();

  const { config, configLoading } = useConfig();
  if (configLoading) return <p><LoadingIcon /></p>;

  const uploadUrl = `${config.apiConfig.coreRawUrl}${config.apiConfig.endpoints.files.upload}`;
  const moviesUrl = `${config.apiConfig.baseRawUrl}${config.apiConfig.endpoints.movies.getAll}`;

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, type: "spring", stiffness: 300 }
    }),
    exit: { opacity: 0, y: 10, transition: { duration: 0.1 } }
  };

  let buttons = [];

  if (location.pathname.includes("/votar")) {
    buttons.push({
      component: <AddMovieButton />,
      key: "add-movie",
      onClick: () => setMovieModal(true)
    });
  }

  if (location.pathname.includes("/usuarios")) {
    buttons.push({
      component: <AddUserButton />,
      key: "add-user",
      onClick: () => setUserModal(true)
    });
  }


  const sanitizeForSQL = (str) => {
    if (typeof str !== "string") return "";

    return str
      .trim()
      .replace(/\s+/g, " ") // quita saltos de línea y dobles espacios
      .replace(/\\/g, "\\\\") // escapa \
      .replace(/'/g, "\\'")   // escapa '
      .replace(/"/g, '\\"');  // escapa "
  };

  const handleMovieSubmit = async (data) => {

    // Cover upload logic =================
    const file = data.coverFile;
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

    try {
      await postData(uploadUrl, fileFormData);
    } catch (err) {
      console.error("Error al subir archivo:", err);
    }
    // ====================================

    let coverUrl = `https://miarma.net/files/cine/${file_name}`;
    const cleanTitle = sanitizeForSQL(data.title);
    const cleanDescription = sanitizeForSQL(data.description);

    try {
      await postData(moviesUrl, {
        title: cleanTitle,
        description: cleanDescription,
        cover: coverUrl
      });
    } catch (err) {
      console.error("Error al añadir película:", err);
    }

  }

  return (
    <div className="floating-menu">
      <AnimatePresence>
        {open && (
          <_motion.div
            className="menu-buttons"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {buttons.map((btn, i) => (
              <_motion.div
                key={btn.key}
                custom={i}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={btn.onClick}
              >
                {btn.component}
              </_motion.div>
            ))}
          </_motion.div>
        )}
      </AnimatePresence>

      <AddMovieModal show={movieModal} onClose={() => setMovieModal(false)} onSubmit={handleMovieSubmit} />

      <button className="menu-toggle" onClick={() => setOpen(prev => !prev)}>
        <FontAwesomeIcon icon={faEllipsisVertical} className="fa-2x" />
      </button>
    </div>
  );
};

export default FloatingMenu;