import styles from "./Header.module.css";
import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";
import Button from "../Button/Button";
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

export default function Header() { 
    return (
        <header className={styles.header}>
            <div className={styles.leftContent}>
                <img className={styles.logo} alt="logo" src="/atom.png"/>
                 
                <NavBar />
                <SearchBar />
                
            </div>
            <div className={styles.rightContent}>
                <Button  variant="headerButtonWhite" label="Iniciar sesión" icon={faSignInAlt} onClickFunction={() => console.log("Redirigiendo a inicio de sesión...")} to="/login"/> 
                <Button  variant="headerButtonBlack" label="Registrarse" icon={faUserPlus} onClickFunction={() => console.log("Redirigiendo a registro...")} to="/register"/> 
            </div>
        </header>
      );
}