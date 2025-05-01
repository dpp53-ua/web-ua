import { useEffect, useState } from "react";
import { Button, ModelGrid, ProfileMenu, UpButton } from "../../Components";
import styles from "./MyAssets.module.css";
import { useAuth } from "../../Context"; 

function MyAssets() {
  const [publicaciones, setPublicaciones] = useState([]);
  const { userId } = useAuth();
  const [visibleCount, setVisibleCount] = useState(4);

  const handleMostrarMas = () => {
    setVisibleCount(prev => prev + 4);
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/publicaciones/usuario/${userId}`)
      .then(res => res.json())
      .then(data => setPublicaciones(data))
      .catch(err => console.error("❌ Error al cargar publicaciones:", err));
  }, [userId]);

  return (
    <div className={styles["profile-main-container"]}>
      <UpButton />
      <section className={styles["left-content"]}>
        <ProfileMenu />
      </section>
      <section className={styles["right-content"]}>
        <header>
          <h1>Mis assets</h1>
        </header>
        <ModelGrid publicaciones={publicaciones.slice(0, visibleCount)} />
        <footer className={styles["model-footer"]}>
                            <Button variant="red-rounded" label="Mostrar más +" onClick={handleMostrarMas} />
                        </footer>
      </section>
    </div>
  );
}

export default MyAssets;
