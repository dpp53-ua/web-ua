import { useEffect, useState } from "react";
import styles from "./Model.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf, faHeart, faDownload } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getCSSVariable } from "../../Utils";

function Model({ _id, titulo, autor, imagen, mostrarBotonDescarga= false, mostrarBotonEditar = false }) {
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


  return (
    <article className={styles["article-model"]}>
      {mostrarBotonDescarga && (
        <button
        className={styles["download-button"]}
        onClick={()=>handleDownload()}
        title="Descargar"
        >
        <FontAwesomeIcon icon={faDownload} />
      </button>

      )}

      {mostrarBotonEditar && (
        <Link
          to={`/post-form/${_id}`}
          className={styles["edit-button"]}
          title="Editar publicación"
        >
          Editar
        </Link>
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
            <span>{renderStars(likes)}</span>
            <button
              className={styles["like-button"]}
              disabled={liked}
              onClick={handleLike}
              title={liked ? "Ya diste me gusta" : "Dar me gusta"}
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
