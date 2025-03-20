/* Modulos de librerías */

/* Componentes */
import { Link } from "react-router-dom";
import { Button, InputField, LinkWrapper } from '../../Components';

/* Estilos */
import styles from "./Register.module.css";

function Register() {
    return (
        <main className={styles["main-container"]}>
        <section className={styles["top-level-section"]}>
          <h1>Registro de usuario</h1>
          <div className={styles["separator-div"]}>
            <section className = {styles["left-section"]}>
              <h2>Credenciales</h2>
              <form className={styles["form-container"]}>
                <ul>
                    <li><InputField id="email-register-form" label="Correo electrónico" name="email" type="email" placeholder="Correo electrónico" /></li>
                    <li><InputField id="username-register-form" label="Nombre de usuario" name="username" type="text" placeholder="Usuario" /></li>
                    <li><InputField id="password-register-form" label="Contraseña" explicativeText="La contraseña debe incluir  una mayúscula, una minúscula, un número y un carácter especial." name="password" type="password" placeholder="Contraseña" /></li>
                    <li><InputField id="password-again-register-form" label="Repetir Contraseña" name="password-again" type="password" placeholder="Contraseña" /></li>
                </ul>
                <div className={styles["buttons-container"]}>
                  <ul>
                    <li><Button type="submit" /></li>
                    <li><Button type="reset" /></li>
                  </ul>
                </div>
              </form>
            </section>
            <section className={styles["right-section"]}>
              <h2>Bienvenido</h2>
              <p>¿Ya tienes una cuenta?</p>
              <LinkWrapper className="" to="/Login" innerText="Inicia sesión" />
            </section>
          </div>
        </section>
      </main> 
    );
}

export default Register;