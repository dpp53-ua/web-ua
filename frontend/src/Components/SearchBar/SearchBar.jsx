import styles from "./SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter} from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {
    return (
        <div className={styles.searchBar}>
          <div>
            <button>
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <input type="text" placeholder="Buscar..." />
          </div>
          <button className={styles.filter}>
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
      );
}
