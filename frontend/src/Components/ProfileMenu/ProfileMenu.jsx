import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFolder, faDownload, faCog } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context"; // o desde donde lo tengas
import { useEffect, useState } from "react";

import styles from "./ProfileMenu.module.css";

export default function ProfileMenu() {
    const { userId } = useAuth();
    const [userData, setUserData] = useState({
        name: "",
        foto: "",
        uploads: 0,
        downloads: 0,
    });

    useEffect(() => {
        const fetchUserData = async () => {
          if (!userId) return;
    
          try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`);
            const data = await response.json();
            setUserData({
              name: data.name || "Usuario",
              foto: data.foto || "",
            //   uploads: data.uploads || 0,
            //   downloads: data.downloads || 0,
            });
          } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
          }
        };
    
        fetchUserData();
      }, [userId]);

    return (
        <div className={styles.profilemenu}>
            <div className={styles.profilebox}>
                <div className={styles.photoname}>
                    <img alt="foto de perfil" src={`http://localhost:5000/api/users/${userId}/foto`} onError={(e) => {e.target.src = '/profile.png';}}></img>
                    <p>{userData.name}</p>
                </div>
                <div className={styles.uploadsdownloads}>
                    <p>x subidos</p>
                    <p>x descargas</p>
                </div>
            </div>
            <Link to="/profile">
                <FontAwesomeIcon icon={faUser} /> Perfil
            </Link>
            <Link to="/my-assets">
                <FontAwesomeIcon icon={faFolder} /> Mis Assets
            </Link>
            <Link to="/my-downloads">
                <FontAwesomeIcon icon={faDownload} /> Mis descargas
            </Link>
            <Link to="/settings">
                <FontAwesomeIcon icon={faCog} /> Configuración
            </Link>
        </div>
      );
}
