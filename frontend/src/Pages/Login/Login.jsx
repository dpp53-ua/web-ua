/* Componentes */
import { Link } from "react-router-dom";
import { Button, InputField } from '../../Components';
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

/* Estilos */
import styles from "./Login.module.css";

function Login() {
  return (
    <>
      <section className={styles["left-section"]}>
        <h1>Inicia sesión</h1>
        <form method="POST" action="">
          <InputField id="user" type="text" label="Nombre de usuario" name="user" placeholder="Usuario" icon={faUser}/>
          <InputField id="password" type="password" label="Contraseña" name="password" placeholder="Contraseña" icon={faLock}/>
          <Link to="" className={styles["forgot-password-link"]}>¿Has olvidado tu contraseña?</Link>
          <div className={styles["button-container"]}>
            <Button type="reset" />
            <Button type="submit" />
          </div>
        </form>
      </section>
      <section className={styles["right-section"]}>
        <img alt="logo" src="/atom.png"/>
        <h1>Bienvenido</h1>
        <p>¿No tienes una cuenta?</p>
        <Link to="" className={styles["register-link"]}>Regístrate</Link>
      </section>
    </>
  );
}

export default Login;