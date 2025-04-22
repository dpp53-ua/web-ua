import styles from "./SearchBar.module.css";
import { Button } from '../../Components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function SearchBar() {

  const [showFilters, setShowFilters] = useState(false);
  
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

            <section className={styles.filterSection}>
              <h5>Formato</h5>
              <label><input type="checkbox" /> .blend</label>
              <label><input type="checkbox" /> .OBJ</label>
              <label><input type="checkbox" /> .FBX</label>
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

            <Button variant="white-rounded" label="Aplicar filtros" to="/home"/>
          </div>
        )}
      </div>
      );
}
