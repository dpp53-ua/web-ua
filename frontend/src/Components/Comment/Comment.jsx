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
                {/* <FontAwesomeIcon icon={faArrowTurnUp} rotation={90} /> */}
                <p className={styles["text-comment"]}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.
                    Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. 
                    Praesent et diam eget libero egestas mattis sit amet vitae augue.
                </p>
            </div>
        </article>
    );
}
export default Comment;