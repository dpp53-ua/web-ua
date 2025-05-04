import { useEffect, useState } from "react";
import { Button, ModelGrid, ProfileMenu, UpButton } from "../../Components";
import styles from "./MyAssets.module.css";
import { useAuth } from "../../Context"; 

function MyAssets() {
  const [publicaciones, setPublicaciones] = useState([]);
  const { userId } = useAuth();
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    if (userId) {
      cargarPublicaciones();
    }
  }, [userId]);

  const cargarPublicaciones = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/publicaciones/usuario/${userId}`);
      const data = await res.json();
      setPublicaciones(data);
    } catch (err) {
      console.error("Error al cargar publicaciones:", err);
    }
  };
  
  const handleDeleteLocal = (idEliminado) => {
    console.log("handleDeleteLocal called with ID:", idEliminado);
    setPublicaciones(prev => {
      console.log("Updating state. Previous length:", prev.length);
      const nuevas = prev.filter(pub => pub._id !== idEliminado);
      console.log("New array length:", nuevas.length);
      if (nuevas.length < visibleCount) {
        console.log("Adjusting visibleCount to:", nuevas.length);
        setVisibleCount(nuevas.length);
      }
      return nuevas;
    });
  };
  
  const handleMostrarMas = () => {
    setVisibleCount(prev => prev + 4);
  };

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
        <ModelGrid publicaciones={publicaciones.slice(0, visibleCount)} mostrarBotonEditar={true} mostrarBotonBorrar={true} onDelete={handleDeleteLocal}/>
        <footer className={styles["model-footer"]}>
          <Button variant="red-rounded" label="Mostrar más +" onClick={handleMostrarMas} />
        </footer>
      </section>
    </div>
  );
}

export default MyAssets;
