import styles from "./Model.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; 

function Model({ _id,titulo, autor, imagen }) {
    return (
        <article className={styles["article-model"]}>
           <Link to={`/detail/${_id}`}>  
                <header className={styles["model-header"]}>
                    <img className={styles["model-image"]} src={imagen || "imageholder.png"} alt="Imagen del modelo" />
                </header>
                <footer className={styles["model-footer"]}>
                    <h3>{titulo}</h3>
                    <p>{autor}</p>
                    <span>
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStarHalf} />
                    </span>
                </footer>
            </Link>
        </article>
    );
}

export default Model;
