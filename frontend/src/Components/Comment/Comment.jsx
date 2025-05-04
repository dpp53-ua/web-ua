/* Componentes */
import { Link } from "react-router-dom";
import { Button } from '../../Components';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf, faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";

/* Estilos */
import styles from "./Comment.module.css";

function Comment({ autor, mensaje, foto }) {
    return (
      <article className={styles["comment"]}>
        <div className={styles["author"]}>
          <img
            className={styles["author-image"]}
            src={foto || "imageholder.png"}
            alt={`Foto de perfil de ${autor}`}
            onError={(e) => { e.target.src = '/profile.png'; }}
          />
          <h3>{autor}</h3>
        </div>
        <div className={styles["comment-content"]}>
          <p className={styles["text-comment"]}>{mensaje}</p>
        </div>
      </article>
    );
  }
export default Comment;