import { Link } from "react-router-dom";
import styles from "./Category.module.css";

function Category({ id, nombre }) {
  return (
    // <Link to={`/buscar/${id}`} className={styles["article-category-link"]}>
    <Link to={`/buscar?categories=${nombre}`} className={styles["article-category-link"]} >

      <article className={styles["article-category"]}>
        <header className={styles["category-header"]}>
          <img className={styles["category-image"]} src="imageholder.png" alt="Imagen de categoría" />
        </header>
        <footer className={styles["category-footer"]}>
          <h3>{nombre}</h3>
        </footer>
      </article>
    </Link>
  );
}

export default Category;
