import styles from "./SearchBar.module.css";
import { Button, InputField, DeleteableTag } from '../../Components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faStar } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function SearchBar() {

  const [showFilters, setShowFilters] = useState(false);
  const [arrOptions, setArrOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categorias'); // Reemplaza si tu endpoint es otro
      const data = await response.json();
  
      if (data && Array.isArray(data)) {
        setArrOptions(data.map(category => ({
          label: category.nombre,  // Esto depende de cómo venga tu objeto de categoría
          value: category.id       // El ID de la categoría
        })));
      }
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  }

  const addTag = (e) => {
    const newTag = e.target.value;
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags(prevTags => [...prevTags, newTag]);
    }
  };

  const deleteTag = (tagToDelete) => {
    setSelectedTags(prevTags => prevTags.filter(tag => tag !== tagToDelete));
  };

  useEffect(() => {
    fetchCategories();
  }, []); // <<--- ACÁ LO AGREGÁS
  
    return (
      <div className={styles.searchBarWrapper}>

        <div className={styles.searchBar}>
          <div>
            <button>
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <input type="text" placeholder="Buscar..." />
          </div>
          <button className={styles.filter} onClick={() => setShowFilters(!showFilters)}>
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className={styles.filterPanel}>
            <h4>Filtros</h4>
            <form >
              <div className={styles.filters}>

                {/* Sección de categoría */}
                <section className={styles.filterSection}>
                  <h5>Categoría</h5>
                  <InputField
                    id="postCategories"
                    type="select"
                    name="postCategories"
                    placeholder="Categoría"
                    onChange={addTag}
                    arrOptions={arrOptions}
                  />
                  <div className={styles["grid-list"]}>
                    <ul>
                      {selectedTags.map((tag) => (
                        <DeleteableTag
                          key={tag}
                          tag={tag}
                          onDelete={() => deleteTag(tag)}
                        />
                      ))}
                    </ul>
                  </div>
                </section>

                <section className={styles.filterSection}>
                  <h5>Formato</h5>
                  <label><input type="checkbox" /> .blend</label>
                  <label><input type="checkbox" /> .OBJ</label>
                  <label><input type="checkbox" /> .FBX</label>
                </section>

                <section className={styles.filterSection}>
                  <h5>Formato</h5>
                  <label><input type="checkbox" /> 3D</label>
                  <label><input type="checkbox" /> Vídeo</label>
                  <label><input type="checkbox" /> Audio</label>
                  <label><input type="checkbox" /> Audio</label>
                  <label><input type="checkbox" /> Script</label>
                </section>

                <section className={styles.filterSection}>
                  <h5>Licencia</h5>
                  <label><input type="checkbox" /> 
                    <span className={styles["span"]}>
                        <FontAwesomeIcon icon={faStar} />
                        <p>o más</p>
                    </span>
                  </label>
                  <label><input type="checkbox" /> 
                    <span className={styles["span"]}>
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <p>o más</p>
                    </span>
                  </label>
                  <label><input type="checkbox" /> 
                    <span className={styles["span"]}>
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <p>o más</p>
                    </span>
                  </label>
                  <label><input type="checkbox" /> 
                    <span className={styles["span"]}>
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                    </span>
                  </label>
                </section>
              </div>
              <Button variant="white-rounded" label="Aplicar filtros" to="/home"/>
            </form>
          </div>
        )}
      </div>
      );
}
