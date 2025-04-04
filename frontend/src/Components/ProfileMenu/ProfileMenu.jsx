import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFolder, faDownload, faCog } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


import styles from "./ProfileMenu.module.css";

export default function ProfileMenu() {
    return (
        <div className={styles.profilemenu}>
            <div className={styles.profilebox}>
                <div className={styles.photoname}>
                    <img alt="foto de perfil" src="/atom.png"></img>
                    {/* aqui iria el nombre del usuario */}
                    <p>UsuarioX</p>
                </div>
                <div className={styles.uploadsdownloads}>
                    <p>x subidos</p>
                    <p>x descargas</p>
                </div>
            </div>
            <Link to="/profile">
                <FontAwesomeIcon icon={faUser} /> Perfil
            </Link>
            <Link to="/myassets">
                <FontAwesomeIcon icon={faFolder} /> Mis Assets
            </Link>
            <Link to="/downloads">
                <FontAwesomeIcon icon={faDownload} /> Mis descargas
            </Link>
            <Link to="/settings">
                <FontAwesomeIcon icon={faCog} /> Configuración
            </Link>
        </div>
      );
}
