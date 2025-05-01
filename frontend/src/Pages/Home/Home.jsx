import { Button, ModelGrid, Category, UpButton } from '../../Components';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "./Home.module.css";

function Home() {
    const [categories, setCategories] = useState([]);
    const [publicaciones, setPublicaciones] = useState([]);
    const [visibleCount, setVisibleCount] = useState(4);

    const handleMostrarMas = () => {
        setVisibleCount(prev => prev + 4);
    };

    useEffect(() => {
        fetch('http://localhost:5000/api/categorias')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error al traer las categorías:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/api/publicaciones')
            .then(response => response.json())
            .then(data => setPublicaciones(data))
            .catch(error => console.error('Error al traer las publicaciones:', error));
    }, []);

    return (
        <div className={styles["home-main-container"]}>
            <UpButton />

            <section className={styles["home-welcome"]}>
                <div>
                    <img alt="logo" src="/logo.png" />
                </div>
                <div>
                    <h1>Bienvenido</h1>
                    <h1>Comienza a explorar assets</h1>
                </div>
            </section>

            <section className={styles["type-section"]}>
                <Link to="/buscar?types=3D">
                    <Button variant="red-rounded" label="3D" />
                </Link>
                <Link to="/buscar?types=2D">
                    <Button variant="red-rounded" label="2D" />
                </Link>
                <Link to="/buscar?types=Vídeo">
                    <Button variant="red-rounded" label="Vídeo" />
                </Link>
                <Link to="/buscar?types=Audio">
                    <Button variant="red-rounded" label="Audio" />
                </Link>
                <Link to="/buscar?types=Script">
                    <Button variant="red-rounded" label="Script" />
                </Link>
            </section>

            <section className={styles["category-section"]}>
                <header className={styles["category-header"]}>
                    <h2>Categorías</h2>
                    {/* <div className={styles["category-arrows"]}>
                        <button className={styles["circle-button"]}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button className={styles["circle-button"]}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div> */}
                </header>
                <div className={styles["categories"]}>
                    {categories.map((category) => (
                        <Category key={category._id} id={category._id} nombre={category.nombre} fotoURL={`http://localhost:5000/api/categorias/foto/${category.fotoId}`} />
                    ))}
                </div>
                {/* <footer className={styles["category-footer"]}>
                    <span>
                        <FontAwesomeIcon icon={faCircle} />
                        <FontAwesomeIcon icon={faCircle} />
                        <FontAwesomeIcon icon={faCircle} />
                    </span>
                </footer> */}
            </section>

            <section className={styles["product-section"]}>
                <header className={styles["product-header"]}>
                    <h2>Todas las publicaciones</h2>
                </header>
                <ModelGrid publicaciones={publicaciones.slice(0, visibleCount)} />
                <footer className={styles["model-footer"]}>
                    <Button variant="red-rounded" label="Mostrar más +" onClick={handleMostrarMas} />
                </footer>
            </section>
        </div>
    );
}

export default Home;
