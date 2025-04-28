/* Componentes */
import { Button, ModelGrid, Category, UpButton } from '../../Components';
import { useState, useEffect } from "react"; // Añadimos useEffect
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faCircle} from "@fortawesome/free-solid-svg-icons";

/* Estilos */
import styles from "./Home.module.css";

function Home() {

    const [categories, setCategories] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:5000/api/categorias')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error al traer las categorías:', error));
    }, []);


    return (
        <div className={styles["home-main-container"]}>
            
            <UpButton/>

            <section className={styles["home-welcome"]}>
                <div>
                    <img alt="logo" src="/atom.png"/>
                </div>
                <div>
                    <h1>Bienvenido</h1>
                    <h1>Comienza a explorar assets</h1>
                </div>
            </section>

            <section className={styles["type-section"]}>
                <Button variant="red-rounded" label="3D" to="/home"/>
                <Button variant="red-rounded" label="2D" to="/home"/>
                <Button variant="red-rounded" label="Vídeo" to="/home"/>
                <Button variant="red-rounded" label="Audio" to="/home"/>
                <Button variant="red-rounded" label="Script" to="/home"/>
            </section>

            <section className={styles["category-section"]}>
                <header className={styles["category-header"]}>
                    <h2>Categorías</h2>
                    <div className={styles["category-arrows"]}>
                        <button className={styles["circle-button"]}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button className={styles["circle-button"]}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </header>
                <div className={styles["categories"]}>
                    {categories.map((category) => (
                        <Category key={category._id} id={category._id} nombre={category.nombre}/>
                    ))}
                </div>
                <footer className={styles["category-footer"]}>
                    <span>
                        <FontAwesomeIcon icon={faCircle} />
                        <FontAwesomeIcon icon={faCircle} />
                        <FontAwesomeIcon icon={faCircle} />
                    </span>
                </footer>
                
            </section>

            <section className={styles["product-section"]}>
                <header className={styles["product-header"]}>
                    <h2>Todos los productos</h2>
                </header>
                <ModelGrid/>
                <footer className={styles["model-footer"]}>
                    <Button variant="red-rounded" label="Mostrar más +" to="/home"/>
                </footer>
            </section>
        </div>
    );
}

export default Home;