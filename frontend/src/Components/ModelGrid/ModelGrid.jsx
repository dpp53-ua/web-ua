import Model from "../Model/Model";
import styles from "./ModelGrid.module.css";

function ModelGrid({ publicaciones = [] }) {  // Inicializamos publicaciones como un arreglo vacío
    return (
        <div className={styles["models"]}>
            {publicaciones.length > 0 ? (
                publicaciones.map(pub => (
                    <Model
                        key={pub._id}
                        _id={pub._id}
                        titulo={pub.titulo}
                        autor={pub.usuario?.name || "Desconocido"}
                        imagen={`api/archivo/${pub.archivos?.[0]?.id}`} // depende cómo sirvas tus imágenes
                    />
                ))
            ) : (
                <div>No se encontraron resultados.</div>  // Mensaje si no hay publicaciones
            )}
        </div>
    );
}

export default ModelGrid;
