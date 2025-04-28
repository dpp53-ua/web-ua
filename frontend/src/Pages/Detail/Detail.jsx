/* Componentes */
import { Link } from "react-router-dom";
import { Button, ModelGrid, Category, Comment } from '../../Components';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf, faDownload, faHeart } from "@fortawesome/free-solid-svg-icons";

/* Estilos */
import styles from "./Detail.module.css";

function Detail() {
    return (
        <div className={styles["detail-main-container"]}>

            <section className={styles["detail-images"]}>
                <img className={styles["detail-image"]} src="imageholder.png" alt="Imagen del modelo" />
                <img className={styles["detail-image"]} src="imageholder.png" alt="Imagen del modelo" />
            </section>

            <section className={styles["detail-info"]}>
                <section className={styles["details"]}>
                    <h2>Título del modelo</h2>
                    <p>Descripción  nwvoennownonoooooooooooooooooooooooooooooooooooooooooooooo
                        oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
                        oooooooooooooooooooooooooo
                    </p>
                    <span className={styles["span"]}>
                        <p>Formato: </p>
                        <p>.blend</p>
                    </span>
                    <span className={styles["span"]}>
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStarHalf} />
                    </span>
                    <div className={styles["buttons"]}>
                        <Button  variant="blue-rounded" label=" Descargar" icon={faDownload} /> 
                        <Button variant="green-rounded" label=" Me gusta" icon={faHeart}/>
                    </div>
                </section>

                <section className={styles["author"]}>
                    <img className={styles["author-image"]} src="imageholder.png" alt="Imagen del modelo" />
                    <h3>Trece</h3>
                </section>
                
                <section className={styles["tags"]}>
                    <h2>Etiquetas</h2>
                    <div className={styles["tag-cloud"]}>
                        <Button variant="grey-rounded" label="tag" to="/home"/>
                        <Button variant="grey-rounded" label="tag" to="/home"/>
                        <Button variant="grey-rounded" label="tag" to="/home"/>
                        <Button variant="grey-rounded" label="tag" to="/home"/>
                        <Button variant="grey-rounded" label="tag" to="/home"/>
                        <Button variant="grey-rounded" label="tag" to="/home"/>
                    </div>
                </section>

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
                        <Comment/>
                        <Comment/>
                        <Comment/>
                    </div>
                </section>
            </section>
            
        </div>
    );
}

export default Detail;