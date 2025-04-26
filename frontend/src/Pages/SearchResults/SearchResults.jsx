/* Componentes */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ModelGrid } from '../../Components';
import styles from "./SearchResults.module.css";

function SearchResults() {
  const { categoryId } = useParams(); // 👈 obtenemos el id de la categoría desde la URL
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/modelos/categoria/${categoryId}`)
      .then(response => response.json())
      .then(data => setModels(data))
      .catch(error => console.error('Error al traer los modelos:', error));
  }, [categoryId]);

  return (
    <div className={styles["search-results-container"]}>
      <h1>Resultados de búsqueda</h1>
      <ModelGrid models={models}/>
    </div>
  );
}

export default SearchResults;
