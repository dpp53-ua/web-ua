// import styles from "./NavBar.module.css";

// export default function Navbar() {
//     return (
//         <nav className={styles.nav}>
//           <ul>
//             <li><a href="/">Inicio</a></li>
//             <li><a href="/categorias">Categorías</a></li>
//             <li><a href="/comunidad">Comunidad</a></li>
//             <li><a href="/contacto">Contacto</a></li>
//           </ul>
//         </nav>
//       );
// }


import styles from "./NavBar.module.css";

export default function NavBar({ menuOpen }) {
    return (
        <nav className={`${styles.nav} ${menuOpen ? styles.showMenu : ""}`}>
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/categories">Categorías</a></li>
                <li><a href="/comunidad">Comunidad</a></li>
                <li><a href="/contacto">Contacto</a></li>
            </ul>
        </nav>
    );
}
