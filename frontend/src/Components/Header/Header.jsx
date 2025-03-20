import { Link } from "react-router-dom";

import styles from "./Header.module.css";

export default function Header() { 
    return(
        <header>
            <ul>
                <li><Link to=""><img alt="logo" src="/atom.png"/></Link></li>
                <li><Link to="">Inicio</Link></li>
                <li><Link to="">Categorías</Link></li>
                <li><Link to="">Gratuitos</Link></li>
                <li><Link to="">Contacto</Link></li>
                <li><Link to=""><input type="text" placeholder="Busca algo..."></input></Link></li>
                <li><Link to=""><input type="checkbox"></input></Link></li>
            </ul>

            <ul>
                <li><Link to="">Iniciar sesión</Link></li>
                <li><Link to="">Regístrate</Link></li>
            </ul>
        </header>
    )
}