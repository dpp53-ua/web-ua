/* Modulos de librerías */

/* Componentes */

/* Estilos */

import { Link } from "react-router-dom";

export default function NotFound() {
    return(
        <>
            <h1>No page found</h1>
            <p>Haz click <Link to="/HomeTest">aquí</Link> para ir al menú principal</p>
        </> 
    )
}