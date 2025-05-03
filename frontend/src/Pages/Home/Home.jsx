import { Button, ModelGrid, Category, UpButton } from '../../Components';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import Lottie from "lottie-react";
import particlesAnimation from "../../assets/lineas.json";


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
                    <p>¡Bienvenido!</p>
                    <p>Descubre, organiza y comparte<br></br>los assets que impulsan tus proyectos</p>
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
            <Marquee
                gradient={false}  // Desactiva el gradiente
                speed={40}  // Ajusta la velocidad de desplazamiento
                pauseOnHover={true}  // Pausa el desplazamiento cuando el ratón está encima
                direction="left"  // Dirección de izquierda a derecha
                loop={0}  // Hace que el Marquee repita de forma indefinida
                className={styles.marquee}
            >
               {/* Duplicamos las imágenes para lograr el ciclo continuo */}
               {[...publicaciones, ...publicaciones].map((pub, i) => (
                    <img
                        key={i}
                        src={`http://localhost:5000/api/publicaciones/${pub._id}/miniatura`} 
                        onError={(e) => { e.target.src = '/no-image.webp'; }}
                        alt={`preview ${i}`}
                        style={{
                            height: "100px",
                            marginRight: "30px",
                            borderRadius: "10px"
                        }}
                    />
                ))}
            </Marquee>

        </div>

    );
}

export default Home;
