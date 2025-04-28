import { Button, ModelGrid, ProfileMenu, UpButton } from '../../Components';


/* Estilos */
import styles from "./MyDownloads.module.css";

function MyDownloads() {
  
  return (
    <div className={styles["profile-main-container"]}>
      <UpButton/>
      <section className={styles["left-content"]}>
        <ProfileMenu />
      </section>

      <section className={styles["right-content"]}>
        <header >
          <h1>Mis descargas</h1>
        </header>
        <ModelGrid/> 
        <footer className={styles["model-footer"]}>
            <Button variant="red-rounded" label="Mostrar más +" to="/home"/>
        </footer>
      </section>
    </div>
  );
}

export default MyDownloads;
