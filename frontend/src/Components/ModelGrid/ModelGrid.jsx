/* Componentes */
import Model from "../Model/Model";
/* Estilos */
import styles from "./ModelGrid.module.css";

function ModelGrid() {
    return (
        <div className={styles["models"]}>
            <Model/> 
            <Model/> 
            <Model/> 
            <Model/> 
            <Model/> 
            <Model/> 
            <Model/> 
            <Model/> 
            <Model/> 
            <Model/> 
            <Model/> 
            <Model/> 
        </div>
    );
}
export default ModelGrid;