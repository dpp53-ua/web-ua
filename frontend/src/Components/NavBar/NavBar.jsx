import styles from "./NavBar.module.css";

export default function NavBar({ menuOpen }) {
    return (
        <nav className={`${styles.nav} ${menuOpen ? styles.showMenu : ""}`} role="navigation">
            <ul>
                <a href="/home"><li>Inicio</li></a>
                <a href="/categories"><li>Categorías</li></a>
                <a href="/projects"><li>Proyectos</li></a>
                <a href="/support"><li>Soporte</li></a>
            </ul>
        </nav>
    );
}
