import { useState, useEffect } from "react"; // Añadimos useEffect
import { Link } from "react-router-dom";
import { Button, Category } from '../../Components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faCircle, faCircleUp, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./Categories.module.css";

function Categories() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/categorias')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error al traer las categorías:', error));
    }, []);

    return (
        <div className={styles["category-main-container"]}>
            <section className={styles["type-section"]}>
                <Button variant="red-rounded" label="3D" to="/home"/>
                <Button variant="red-rounded" label="2D" to="/home"/>
                <Button variant="red-rounded" label="Vídeo" to="/home"/>
                <Button variant="red-rounded" label="Audio" to="/home"/>
                <Button variant="red-rounded" label="Script" to="/home"/>
            </section>
            <h2 className={styles["category-title"]}>Categorías</h2>
            <section className={styles["category-grid"]}>
                {categories.map((category) => (
                    <Category key={category.id} id={category.id} nombre={category.nombre}/>
                ))}
            </section>
            <footer className={styles["category-footer"]}>
                <Button variant="red-rounded" label="Mostrar más +" to="/home"/>
            </footer>
        </div>
    );
}

export default Categories;
