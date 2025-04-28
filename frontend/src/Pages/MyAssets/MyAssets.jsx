import { Button, ModelGrid, ProfileMenu, UpButton } from '../../Components';


/* Estilos */
import styles from "./MyAssets.module.css";

function MyAssets() {

  return (
    <div className={styles["profile-main-container"]}>
      <UpButton/>
      <section className={styles["left-content"]}>
        <ProfileMenu />
      </section>

      <section className={styles["right-content"]}>
        <header >
          <h1>Mis assets</h1>
        </header>
        <ModelGrid/> 
        <footer className={styles["model-footer"]}>
            <Button variant="red-rounded" label="Mostrar más +" to="/home"/>
        </footer>
      </section>
    </div>
  );
}

export default MyAssets;
