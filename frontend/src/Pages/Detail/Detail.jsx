/* Componentes */
import { Link } from "react-router-dom";
import { Button, Comment } from '../../Components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf, faDownload, faHeart } from "@fortawesome/free-solid-svg-icons";

/* Estilos */
import styles from "./Detail.module.css";

function Detail() {
    return (
        <div className={styles["detail-main-container"]}>
            
            {/* Parte Izquierda: Imágenes */}
            <section className={styles["detail-images"]}>
                <img className={styles["detail-image"]} src="imageholder.png" alt="Imagen del modelo" />
            </section>

            {/* Parte Derecha: Información */}
            <section className={styles["detail-info"]}>

               {/* 🔵 Bloque Autor + Botones + Título + Descripción */}
               <section className={styles["author-block"]}>
                    <div className={styles["author"]}>
                        <img className={styles["author-image"]} src="imageholder.png" alt="Imagen del autor" />
                        <h3>Trece</h3>
                    </div>

                    <div className={styles["buttons"]}>
                        <Button variant="blue-rounded" label=" Descargar" icon={faDownload} />
                        <Button variant="green-rounded" label=" Me gusta" icon={faHeart} />
                    </div>

                    <h2 className={styles["title"]}>Título del modelo</h2>

                    <p className={styles["description"]}>
                        Descripción nueva del modelo con texto de prueba para simular el contenido real
                        y comprobar el ajuste en el diseño. Aquí iría la descripción larga.
                    </p>
                </section>

                {/* Bloque Detalles */}
                <section className={styles["details"]}>
                    <h2>Detalles</h2>
                    <div className={styles["span"]}>
                        <p>Formato:</p>
                        <p>.blend</p>
                    </div>
                    <div className={styles["span"]}>
                        <p>Me gusta:</p>
                        <div>
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStarHalf} />
                        </div>
                    </div>
                </section>

                {/* Bloque Tags */}
                <section className={styles["tags"]}>
                    <h2>Tags</h2>
                    <div className={styles["tag-cloud"]}>
                        <Button variant="grey-rounded" label="Digital 3D" to="/home" />
                        <Button variant="grey-rounded" label="Fan Art" to="/home" />
                    </div>
                </section>

                {/* Bloque Comentarios */}
                <section className={styles["comments"]}>
                    <h2>Comentarios</h2>
                    <form className={styles["comment-form"]}>
                        <textarea 
                            placeholder="Escribe tu comentario..." 
                            className={styles["comment-textarea"]}
                        />
                        <Button variant="red-rounded" label="Publicar" type="submit" />
                    </form>

                    <div className={styles["comment-div"]}>
                        <Comment />
                        <Comment />
                    </div>
                </section>

            </section>
        </div>
    );
}

export default Detail;
