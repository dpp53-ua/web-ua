/* Componentes */
import { Link } from "react-router-dom";
import { Button, Category } from '../../Components';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faCircle, faCircleUp, faArrowUp } from "@fortawesome/free-solid-svg-icons";

/* Estilos */
import styles from "./Categories.module.css";

function Categories() {
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
                <Category/>
                <Category/>
                <Category/>
                <Category/>
                <Category/>
                <Category/>
                <Category/>
                <Category/>
                <Category/>

            </section>
            <footer className={styles["category-footer"]}>
                <Button variant="red-rounded" label="Mostrar más +" to="/home"/>
            </footer>
        </div>
    );
}

export default Categories;