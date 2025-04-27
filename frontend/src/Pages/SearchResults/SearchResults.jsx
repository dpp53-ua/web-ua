/* Componentes */
import { useState, useEffect } from "react"; // Añadimos useEffect
import { Button, ModelGrid, Category } from '../../Components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faCircle, faCircleUp, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import styles from "./SearchResults.module.css";

function SearchResults() {

    const [categories, setCategories] = useState([]);

    // BUSQUEDA
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const selectedCategories = searchParams.get('categories') ? searchParams.get('categories').split(',') : [];
    const selectedFormats = searchParams.get('formats') ? searchParams.get('formats').split(',') : [];
    const selectedTypes = searchParams.get('types') ? searchParams.get('types').split(',') : [];
    const selectedStars = searchParams.get('ratings') || '';

    // Eliminar un filtro específico
    const navigate = useNavigate();

    const removeFilter = (filterType) => {
        // Eliminar el filtro de los parámetros de búsqueda
        const newSearchParams = new URLSearchParams(searchParams);

        switch (filterType) {
        case 'query':
            newSearchParams.delete('query');
            break;
        case 'categories':
            newSearchParams.delete('categories');
            break;
        case 'formats':
            newSearchParams.delete('formats');
            break;
        case 'types':
            newSearchParams.delete('types');
            break;
        case 'stars':
            newSearchParams.delete('ratings');
            break;
        default:
            break;
        }
        navigate({ pathname: '/buscar', search: `?${newSearchParams.toString()}` });  // Actualizar la URL con los nuevos parámetros
    };

    const handleTypeClick = (filterType) => {
        // Obtenemos los parámetros actuales de búsqueda
        const currentParams = new URLSearchParams(window.location.search);
        const existingFilters = currentParams.get('types') ? currentParams.get('types').split(',') : [];
    
        // Añadimos el nuevo filtro
        if (!existingFilters.includes(filterType)) {
          existingFilters.push(filterType);
        }
    
        // Actualizamos la URL con los nuevos parámetros
        currentParams.set('types', existingFilters.join(','));
    
        // Navegamos a la página de resultados con los parámetros actualizados
        navigate(`/buscar?${currentParams.toString()}`);
      };

    
    useEffect(() => {
        fetch('http://localhost:5000/api/categorias')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error al traer las categorías:', error));
    }, []);


    return (
        <div className={styles["searchResults-main-container"]}>
            
            <FontAwesomeIcon 
                icon={faArrowUp} 
                className={styles.upButton} 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />

            <section className={styles["home-welcome"]}>
                <div>
                    <img alt="logo" src="/atom.png"/>
                </div>
                <div>
                    <h1>Bienvenido</h1>
                    <h1>Comienza a explorar assets</h1>
                </div>
            </section>

            {/* <section className={styles.activeFilters}>
                <h3>Filtros activos:</h3>
                <ul>
                    {query && <li>Buscando: <strong>{query}</strong></li>}
                    {selectedCategories.length > 0 && (
                    <li>Categorías: {selectedCategories.map(c => <strong key={c}>{c}</strong>)}</li>
                    )}
                    {selectedFormats.length > 0 && (
                    <li>Formatos: {selectedFormats.map(f => <strong key={f}>{f}</strong>)}</li>
                    )}
                    {selectedTypes.length > 0 && (
                    <li>Tipos: {selectedTypes.map(t => <strong key={t}>{t}</strong>)}</li>
                    )}
                    {selectedStars && <li>Valoración mínima: <strong>{selectedStars} estrellas</strong></li>}
                </ul>
            </section> */}

            <section className={styles["filter-section"]}>
                <h3>Filtros activos:</h3>
                <div className={styles.filterTags}>
                    {/* Filtro de búsqueda */}
                    {query && (
                    <div className={styles.filterTag}>
                        <span>Buscando: <strong> {query}</strong></span>
                        <button className={styles.clearFilter} onClick={() => removeFilter('query')}>✖</button>
                    </div>
                    )}

                    {/* Categorías */}
                    {selectedCategories.length > 0 && (
                    <div className={styles.filterTag}>
                        <span>Categorías: {selectedCategories.map(c => (
                            <strong key={c}> {c} </strong>))}
                        </span>
                        <button className={styles.clearFilter} onClick={() => removeFilter('categories')}>✖</button>
                    </div>
                    )}

                    {/* Formatos */}
                    {selectedFormats.length > 0 && (
                    <div className={styles.filterTag}>
                        <span>Formatos: {selectedFormats.map(f => (
                            <strong key={f}> {f} </strong>))}
                        </span>
                        <button className={styles.clearFilter} onClick={() => removeFilter('formats')}>✖</button>
                    </div>
                    )}

                    {/* Tipos */}
                    {selectedTypes.length > 0 && (
                    <div className={styles.filterTag}>
                        <span>Tipos: {selectedTypes.map(t => (
                        <strong key={t}> {t} </strong>))}
                        </span>
                        <button className={styles.clearFilter} onClick={() => removeFilter('types')}>✖</button>
                    </div>
                    )}

                    {/* Valoración mínima */}
                    {selectedStars && (
                    <div className={styles.filterTag}>
                        <span>Valoración mínima: <strong> {selectedStars} estrellas</strong></span>
                        <button className={styles.clearFilter} onClick={() => removeFilter('stars')}>✖</button>
                    </div>
                    )}
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
                        <Category key={category.id} id={category._id} nombre={category.nombre}/>
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

export default SearchResults;