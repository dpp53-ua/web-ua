import Model from "../Model/Model";
import styles from "./ModelGrid.module.css";

function ModelGrid({ publicaciones = [], mostrarBotonDescarga = false, mostrarBotonEditar = false }) {  // Inicializamos publicaciones como un arreglo vacío
    return (
        <div className={styles["models"]}>
            {publicaciones.length > 0 ? (
                publicaciones.map(pub => (
                    <Model
                        key={pub._id}
                        _id={pub._id}
                        titulo={pub.titulo}
                        autor={pub.usuario?.name || "Desconocido"}
                        imagen={`http://localhost:5000/api/publicaciones/${pub._id}/miniatura`} 
                        likes={pub.likes}
                        mostrarBotonDescarga={mostrarBotonDescarga}
                        mostrarBotonEditar={mostrarBotonEditar}
                    />
                ))
            ) : (
                <div>No se encontraron resultados.</div>  // Mensaje si no hay publicaciones
            )}
        </div>
    );
}

export default ModelGrid;
