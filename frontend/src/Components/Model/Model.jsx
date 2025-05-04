import { useEffect, useState } from "react";
import styles from "./Model.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf, faHeart, faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getCSSVariable } from "../../Utils";

function Model({ _id, titulo, autor, imagen, mostrarBotonDescarga= false, mostrarBotonEditar = false, mostrarBotonBorrar = false, onDelete }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Obtener cantidad actual de likes al montar
    fetch(`http://localhost:5000/api/publicaciones/${_id}`)
      .then(res => res.json())
      .then(data => setLikes(data.likes || 0))
      .catch(err => console.error("Error al obtener likes:", err));
  }, [_id]);

  const renderStars = (likes) => {
    const fullStars = Math.floor(likes);
    const hasHalfStar = likes % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} />);
    }

    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalf} />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={["far", "star"]} />);
    }

    return stars;
  };

  const handleLike = (e) => {
    e.preventDefault(); // Previene navegación si se hace clic dentro del <Link>
    if (liked) return;

    fetch(`http://localhost:5000/api/publicaciones/${_id}/like`, {
      method: "PATCH"
    })
      .then(res => res.json())
      .then(() => {
        setLikes(prev => Math.min(prev + 1, 5)); // Límite de 5 estrellas visuales
        setLiked(true);
      })
      .catch(err => console.error("Error al dar like:", err));
  };

  const handleDownload = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return await Swal.fire({
        title: 'Permiso denegado',
        text: 'Inicia sesión para poder realizar descargas',
        icon: 'warning',
        background: getCSSVariable('--dark-grey'),
        color: getCSSVariable('--white'),
        customClass: {
          confirmButton: "swal-confirm-btn",
        }
      });
  
      const response = await fetch(`http://localhost:5000/api/publicaciones/${_id}/descargar/${userId}`);
  
      if (!response.ok) {
        throw new Error("Error en la descarga");
      }
  
      const fileName = "descarga";
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error en la descarga:", error);
      await Swal.fire({
        title: 'Error',
        text: 'No se ha podido realizar la descarga',
        icon: 'error',
        background: getCSSVariable('--dark-grey'),
        color: getCSSVariable('--white'),
        customClass: {
          confirmButton: "swal-confirm-btn",
        }
      });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Borrar publicación?",
        text: "¿Deseas eliminar esta publicación, con todos los archivos asociados?",
        icon: "warning",
        background: getCSSVariable("--dark-grey"),
        color: getCSSVariable("--white"),
        customClass: {
          confirmButton: "swal-confirm-btn",
          cancelButton: "swal-cancel-btn", // Optional: Style cancel button too
        },
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar",
      });
  
      if (result.isConfirmed) {
        console.log("[Model] User confirmed deletion for ID:", _id); // Log 1
  
        const response = await fetch(
          `http://localhost:5000/api/publicaciones/${_id}`,
          {
            method: "DELETE",
          }
        );
  
        console.log("[Model] DELETE request sent. Response status:", response.status); // Log 2
  
        // --- IMPORTANT: Check if the API deletion was actually successful ---
        if (!response.ok) {
          // Throw an error to be caught by the catch block below
          throw new Error(`API error! status: ${response.status}`);
        }
  
        console.log("[Model] API deletion successful. Checking onDelete prop."); // Log 3
  
        // --- Call the onDelete prop function IMMEDIATELY after successful deletion ---
        if (typeof onDelete === "function") {
          console.log("[Model] Calling onDelete prop function with ID:", _id); // Log 4
          onDelete(_id); // <--- Call the parent's update function
        } else {
          console.warn("[Model] onDelete prop is missing or not a function."); // Warning if prop is wrong
        }
  
        // --- Now show the success message (optional, happens after UI update) ---
        await Swal.fire({
          title: "Eliminada",
          text: "La publicación fue eliminada correctamente",
          icon: "success",
          background: getCSSVariable("--dark-grey"),
          color: getCSSVariable("--white"),
          customClass: {
            confirmButton: "swal-confirm-btn",
          },
        });
         console.log("[Model] Success Swal shown."); // Log 5
      } else {
         console.log("[Model] User cancelled deletion."); // Log 6
      }
    } catch (err) {
      // Catch errors from Swal, fetch, response checking, or the onDelete call itself
      console.error("[Model] Error during handleDelete process:", err); // Log 7 - See the actual error
      await Swal.fire({
          title: 'Error',
          text: 'No se pudo completar la eliminación.',
          icon: 'error',
          background: getCSSVariable('--dark-grey'),
          color: getCSSVariable('--white'),
          customClass: {
            confirmButton: "swal-confirm-btn",
          }
        });
    }
  };
  

  return (
    <article className={styles["article-model"]}>
      {mostrarBotonDescarga && (
        <button
        className={styles["download-button"]}
        onClick={()=>handleDownload()}
        title="Descargar publicación"
        aria-label="Descargar publicación"
        >
        <FontAwesomeIcon icon={faDownload} />
      </button>

      )}

      {mostrarBotonEditar && (
        <Link
          to={`/post-form/${_id}`}
          className={styles["edit-button"]}
          title="Editar publicación"
          aria-label="Descargar publicación"
        >
          <FontAwesomeIcon icon={faEdit} />
        </Link>
      )}

      {mostrarBotonBorrar && (
        <button
        className={styles["delete-button"]}
        onClick={()=>handleDelete()}
        title="Eliminar publicación"
        aria-label="Descargar publicación"
        >
        <FontAwesomeIcon icon={faTrash} />
      </button>

      )}

      <Link to={`/detail/${_id}`}>
        <header className={styles["model-header"]}>
          <img
            className={styles["model-image"]}
            src={imagen || '/no-image.webp'}
            alt="Imagen del modelo"
            onError={(e) => { e.target.src = '/no-image.webp'; }}
          />
        </header>
        <footer className={styles["model-footer"]}>
          <h3>{titulo}</h3>
          <div className={styles["likes-container"]}>
            <span aria-label="Contador de likes" title="Contador de likes">{renderStars(likes)}</span>
            <button
              className={styles["like-button"]}
              disabled={liked}
              onClick={handleLike}
              title={liked ? "Ya diste me gusta" : "Dar me gusta"}
              aria-label="Botón de like"
            >
              <FontAwesomeIcon icon={faHeart} style={{ color: liked ? "red" : "gray" }} />
            </button>
          </div>
        </footer>
      </Link>
    </article>
  );
}

export default Model;
