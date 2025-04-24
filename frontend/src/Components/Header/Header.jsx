import { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";
import Button from "../Button/Button";
import { faSignInAlt, faUserPlus, faBars , faUser, faFolder, faDownload, faCog, faSignOutAlt, faCaretDown, faArrowUpFromBracket} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../Context";  

export default function Header( ) { //{ isAuth, setIsAuth } antes lo usaba
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const profileButtonRef = useRef(null);

    // Usamos el hook useAuth para obtener isAuth y logout
    const { isAuth, logout } = useAuth();

    const handleLogout = () => {
        //setIsAuth(false); // Ahora sí actualiza el estado
        logout();  // Usamos la función logout del contexto para cerrar sesión
        setProfileMenuOpen(false);// Cierra el menú después del logout
      };
    
    useEffect(() => {
        // Función que se ejecuta cuando se hace clic en cualquier parte de la página
        const handleClickOutside = (event) => {
            if (
                profileMenuRef.current && !profileMenuRef.current.contains(event.target) && 
                !profileButtonRef.current.contains(event.target)
            ) {
                setProfileMenuOpen(false); // Cierra el menú si el clic es fuera de los dos elementos
            }
        };

        // Añadimos el event listener cuando el componente se monta
        document.addEventListener("click", handleClickOutside);

        // Limpiamos el event listener cuando el componente se desmonta
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    
    
    return (
        <header className={styles.header}>
            <div className={styles.leftContent}>
                <div className={styles.navigation}>
                     <div className={styles.topNav}>
                     <a href="/home"><img className={styles.logo} alt="logo" src="/atom.png"/></a>
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
                    <Button  variant="headerButtonWhite" label="Subir asset" icon={faArrowUpFromBracket} onClickFunction={() => console.log("Redirigiendo a subir asset...")} to="/PostForm"/> 

                    <div className={styles.drop} onClick={() => setProfileMenuOpen(!profileMenuOpen)} ref={profileButtonRef}>
                        <img alt="foto de perfil" src="/atom.png" />
                        <FontAwesomeIcon icon={faCaretDown} />
                    </div>

                        
                    {/* Menú desplegable */}
                    {profileMenuOpen && (
                        <div className={styles.profileMenu} ref={profileMenuRef}>
                            <p className={styles.menuTitle}>Tus opciones</p>
                            <ul>
                                <li><a href="/profile"><FontAwesomeIcon icon={faUser} /> Perfil</a></li>
                                <li><a href="/myassets"><FontAwesomeIcon icon={faFolder} /> Mis assets</a></li>
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