import { useState } from "react";
import styles from "./Header.module.css";
import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";
import Button from "../Button/Button";
import { faSignInAlt, faUserPlus, faBars , faUser, faFolder, faDownload, faCog, faSignOutAlt, faCaretDown, faArrowUpFromBracket} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLess } from "@fortawesome/free-brands-svg-icons";

export default function Header( { isAuth, setIsAuth } ) { 
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        setIsAuth(false); // Ahora sí actualiza el estado
        setProfileMenuOpen(false); // Cierra el menú después del logout
      };

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
                <SearchBar />
            </div>
            <div className={styles.rightContent}>
                {!isAuth ? 
                    <>
                        <Button  variant="headerButtonWhite" label="Iniciar sesión" icon={faSignInAlt} onClickFunction={() => console.log("Redirigiendo a inicio de sesión...")} to="/login"/> 
                        <Button  className={styles.btn_regist}  variant="headerButtonBlack" label="Registrarse" icon={faUserPlus} onClickFunction={() => console.log("Redirigiendo a registro...")} to="/register"/> 
                    </>
                :
                    <>  
                    <Button  variant="headerButtonWhite" label="Subir asset" icon={faArrowUpFromBracket} onClickFunction={() => console.log("Redirigiendo a subir asset...")} to="/post-form"/> 

                        <div className={styles.drop} onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                            <img alt="foto de perfil" src="/atom.png" ></img>
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                        
                        {/* Menú desplegable */}
                        {profileMenuOpen && (
                            <div className={styles.profileMenu}>
                                <p className={styles.menuTitle}>Tus opciones</p>
                                <ul>
                                    <li><a href="/profile"><FontAwesomeIcon icon={faUser} /> Perfil</a></li>
                                    <li><FontAwesomeIcon icon={faFolder} /> Mis assets</li>
                                    <li><FontAwesomeIcon icon={faDownload} /> Mis descargas</li>
                                    <li><FontAwesomeIcon icon={faCog} /> Configuración</li>
                                    <li className={styles.logout} onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesión</li>
                                </ul>
                            </div>
                        )}
                    </>
                }
            </div>
            
                
        </header>
      );
}