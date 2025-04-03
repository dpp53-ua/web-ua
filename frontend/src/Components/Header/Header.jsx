import { useState } from "react";
import styles from "./Header.module.css";
import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";
import Button from "../Button/Button";
import { faSignInAlt, faUserPlus, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header( {isAuth} ) { 

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.leftContent}>

                <div className={styles.navigation}>
                     <div className={styles.topNav}>
                        <img className={styles.logo} alt="logo" src="/atom.png"/>
                        <FontAwesomeIcon icon={faBars} className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}/>
                    </div> 

                    
                    <NavBar menuOpen={menuOpen} />  {/* Pasamos el estado a NavBar */}

                </div> 


                {isAuth ? <div>Ejemplo</div> : null}
                
                <SearchBar />
                
            </div>
            <div className={styles.rightContent}>
                <Button  variant="headerButtonWhite" label="Iniciar sesión" icon={faSignInAlt} onClickFunction={() => console.log("Redirigiendo a inicio de sesión...")} to="/login"/> 
                <Button  className={styles.btn_regist}  variant="headerButtonBlack" label="Registrarse" icon={faUserPlus} onClickFunction={() => console.log("Redirigiendo a registro...")} to="/register"/> 
            </div>
        </header>
      );
}