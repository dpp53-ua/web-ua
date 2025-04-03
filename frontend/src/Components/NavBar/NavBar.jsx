import styles from "./NavBar.module.css";

export default function NavBar({ menuOpen }) {
    return (
        <nav className={`${styles.nav} ${menuOpen ? styles.showMenu : ""}`}>
            <ul>
                <li><a href="/home">Inicio</a></li>
                <li><a href="/categories">Categorías</a></li>
                <li><a href="/comunidad">Comunidad</a></li>
                <li><a href="/contacto">Contacto</a></li>
            </ul>
        </nav>
    );
}
