import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Comment, ModelViewer } from '../../Components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf, faDownload, faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./Detail.module.css";

function Detail() {
    const { id } = useParams();
    const [publicacion, setPublicacion] = useState(null);
    console.log("ID de la publicación:", id);

    useEffect(() => {
        console.log('useEffect ejecutado para el id:', id); // Log adicional
        fetch(`http://localhost:5000/api/publicaciones/${id}`)
            .then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Error ${res.status}: ${errorText}`);
                }
                return res.json();
            })
            .then(data => {
                if (!data || Object.keys(data).length === 0) {
                    alert("Publicación no encontrada");
                    console.warn("⚠️ Publicación vacía:", data);
                }
                setPublicacion(data);
            })
            .catch(err => {
                console.error("❌ Error al obtener la publicación:", err);
                alert("Error al cargar la publicación. Consulta la consola para más detalles.");
            });
    }, [id]);
    

    if (!publicacion) {
        return <p>Cargando publicación...</p>;
    }

    return (
        <div className={styles["detail-main-container"]}>
            {/* Parte Izquierda: Visor 3D */}
            <section className={styles["detail-images"]}>
                <ModelViewer modelUrl={`http://localhost:5000/api/publicaciones/${id}/modelo`} />
            </section>

            {/* Parte Derecha: Información */}
            <section className={styles["detail-info"]}>

                <section className={styles["author-block"]}>
                    <div className={styles["author"]}>
                        <img className={styles["author-image"]} src="imageholder.png" alt="Imagen del autor" />
                        <h3>{publicacion.usuario?.[0]?.name || "Autor desconocido"}</h3>
                    </div>

                    <div className={styles["buttons"]}>
                        <Button variant="blue-rounded" label=" Descargar" icon={faDownload} />
                        <Button variant="green-rounded" label=" Me gusta" icon={faHeart} />
                    </div>

                    <h2 className={styles["title"]}>{publicacion.titulo}</h2>

                    <p className={styles["description"]}>
                        {publicacion.descripcion}
                    </p>
                </section>

                <section className={styles["details"]}>
                    <h2>Detalles</h2>
                    <div className={styles["span"]}>
                        <p>Formato:</p>
                        <p>.glb</p>
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

                <section className={styles["tags"]}>
                    <h2>Tags</h2>
                    <div className={styles["tag-cloud"]}>
                        <Button variant="grey-rounded" label="Digital 3D" to="/home" />
                        <Button variant="grey-rounded" label="Fan Art" to="/home" />
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
                        <Comment />
                        <Comment />
                    </div>
                </section>

            </section>
        </div>
    );
}
export default Detail;
