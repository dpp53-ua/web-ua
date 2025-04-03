import styles from "./Category.module.css";

function Category() {
    return (
        <article className={styles["article-category"]}>
            <header className={styles["category-header"]}>
                <img className={styles["category-image"]} src="imageholder.png" alt="Imagen del modelo" />
            </header>
            <footer className={styles["category-footer"]}>
                <h3>Categoría</h3>
            </footer>
        </article>
    );
}

export default Category;