/* Componentes */
import { Button, InputField } from '../../Components';
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";

/* Estilos */
import styles from "./Register.module.css";

function Register() {
  return (
    <div className={styles["login-main-container"]}>

      <section className={styles["left-section"]}>
        <h1>Regístrate</h1>
        <form method="POST" action="">
          <InputField id="correo" type="email" label="Correo electrónico" name="correo" placeholder="Correo" icon={faEnvelope}/>
          <InputField id="user" type="text" label="Nombre de usuario" name="user" placeholder="Usuario" icon={faUser}/>
          <InputField id="password" type="password" label="Contraseña" name="password" placeholder="Contraseña" icon={faLock}/>
          <InputField id="password_rep" type="password" label="Repertir contraseña" name="password_rep" placeholder="Contraseña" icon={faLock}/>
          <div>
            <Button type="reset" variant="red" label="Limpiar"/>
            <Button type="submit" variant="red" label="Aceptar" />
          </div>
        </form>
      </section>

      <section className={styles["right-section"]}>
        <img alt="logo" src="/atom.png"/>
        <h1>Bienvenido</h1>
        <p>¿Ya tienes una cuenta?</p>
        <Button  variant="headerButtonWhite" label="Inicia sesión" to="/login"/>
      </section>

    </div>
  );
}

export default Register;