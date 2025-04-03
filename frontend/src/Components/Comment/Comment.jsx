/* Componentes */
import { Link } from "react-router-dom";
import { Button } from '../../Components';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf, faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";

/* Estilos */
import styles from "./Comment.module.css";

function Comment() {
    return (

        <article className={styles["comment"]}>
            <div className={styles["author"]}>
                <img className={styles["author-image"]} src="imageholder.png" alt="Imagen del modelo" />
                <h3>Trece</h3>
            </div>
            <div className={styles["comment-content"]}> 
                <FontAwesomeIcon icon={faArrowTurnUp} rotation={90} />
                <p className={styles["text-comment"]}>Me gusta mucho XD  oooooooooooo
                    oooooooooooooooooooooo
                    oooooooooooooooooooooooooo ooooooooooooooooo
                    iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
                    sdddddddddddddddddddddddd
                </p>
            </div>
        </article>
    );
}
export default Comment;