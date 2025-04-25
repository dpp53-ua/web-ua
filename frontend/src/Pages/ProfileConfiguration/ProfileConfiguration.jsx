import { Button, InputField, ProfileMenu } from '../../Components';
import { useState, useEffect } from "react";
import { useAuth } from "../../Context";

/* Estilos */
import styles from "./ProfileConfiguration.module.css";

function ProfileConfiguration() {

  const { userId } = useAuth();
  
  return (
    <div className={styles["profile-main-container"]}>
      <section className={styles["left-content"]}>
        <ProfileMenu />
      </section>
      <section className={styles["right-section"]}>
       <h1>Configuración</h1>
       <hr></hr>
       <section>
          <h2>Cuenta</h2>
          <div>
            <section>
              <h3>Contraseña</h3>
              <small>Actualizada el: dd/mm/YYYY</small>
            </section>
            <Button label="Actualizar contraseña" variant="white"/>
          </div>
          <div>
            <section>
              <h3>Dar de baja la cuenta</h3>
              <small>Al darte de baja estarás eliminando todos tus assets y compras realizadas</small>
            </section>
            <Button label="Dar de baja" variant="white-red"/>
          </div>
        </section>
        <hr style={{ border: "1px solid #ccc" }} />
        <section>
          <h2>Preferencias de Interfaz</h2>
          <div>
            <section>
              <h3>Tema</h3>
              <small>Realiza cambios en los colores de las fuentes, fondos e iconos</small>
            </section>
            <select>
              <option>Noche</option>
              <option>Día</option>
            </select>
          </div>
          <div>
            <section>
              <h3>Tamaño de fuente</h3>
              <small>Cambia el tamaño de letra: grande, mediano, pequeño</small>
            </section>
            <select>
              <option>Grande</option>
              <option>Mediano</option>
              <option>Pequeño</option>
            </select>
          </div>
          <div>
            <section>
              <h3>Idioma</h3>
              <small>Idioma de la web</small>
            </section>
            <select>
              <option>Español</option>
              <option>Inglés</option>
            </select>
          </div>
        </section>
        <hr></hr>
      </section>
    </div>
  );
}

export default ProfileConfiguration;
