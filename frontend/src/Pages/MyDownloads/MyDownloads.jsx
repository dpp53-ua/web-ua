import { useEffect, useState } from "react";
import { Button, ModelGrid, ProfileMenu, UpButton } from '../../Components';
import styles from "./MyDownloads.module.css";

function MyDownloads() {
  const [descargas, setDescargas] = useState([]);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId"); // Asegúrate de que esté disponible

    if (!userId) return;

    fetch(`http://localhost:5000/api/users/${userId}/descargas`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener descargas");
        }
        return response.json();
      })
      .then(data => {
        setDescargas(data);
      })
      .catch(error => {
        console.error("Error al cargar descargas:", error);
      });
  }, []);

  return (
    <div className={styles["profile-main-container"]}>
      <UpButton />
      <section className={styles["left-content"]}>
        <ProfileMenu />
      </section>

      <section className={styles["right-content"]}>
        <header>
          <h1>Mis descargas</h1>
        </header>
        <ModelGrid publicaciones={descargas} />
        <footer className={styles["model-footer"]}>
          <Button variant="red-rounded" label="Mostrar más +" to="/home" />
        </footer>
      </section>
    </div>
  );
}

export default MyDownloads;
