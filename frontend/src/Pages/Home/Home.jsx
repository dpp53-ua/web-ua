/* Modulos de librerías */

/* Componentes */
import { Link } from "react-router-dom";
import { Button } from '../../Components';
import Model from "../../Components/Model/Model";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";


/* Estilos */
import styles from "./Home.module.css";


function Home() {
    return (
        <div className={styles["home-main-container"]}>

            <section className={styles["home-welcome"]}>
                <div>
                    <img alt="logo" src="/atom.png"/>
                </div>
                <div>
                    <h1>Bienvenido</h1>
                    <h1>Comienza a explorar assets</h1>
                </div>
            </section>

            <section className={styles["category"]}>
                <div className={styles["category-header"]}>
                    <h2>Categorías</h2>
                    <div className={styles["category-arrows"]}>
                        <button className={styles["circle-button"]}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button className={styles["circle-button"]}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </div>
                <Model/> 
            </section>

            <section className={styles["product"]}>
                <div className={styles["product-header"]}>
                    <h2>Todos los productos</h2>
                </div>
            </section>
        </div>
    );
}

export default Home;