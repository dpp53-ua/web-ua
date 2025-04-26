import styles from "./NavBar.module.css";

export default function NavBar({ menuOpen }) {
    return (
        <nav className={`${styles.nav} ${menuOpen ? styles.showMenu : ""}`}>
            <ul>
                <a href="/home"><li>Inicio</li></a>
                <a href="/categories"><li>Categorías</li></a>
                <a href="/comunity"><li>Comunidad</li></a>
                <a href="/contact"><li>Contacto</li></a>
            </ul>
        </nav>
    );
}
