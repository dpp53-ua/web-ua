import styles from "./Model.module.css";

function Model() {
    return (
        <article className={styles["article-category"]}>
            <div className={styles["category-image"]}>

            </div>
            <div className={styles["category-name"]}>
                <h3>Categoría</h3>
            </div>
        </article>
    );
}

export default Model;