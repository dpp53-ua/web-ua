/* Componentes */
import { Link } from "react-router-dom";
import { Button, InputField } from '../../Components';
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

/* Estilos */
import styles from "./Login.module.css";

function Login() {
  const [formData, setFormData] = useState({ user: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error en el login");
      console.log("Login exitoso", result);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles["login-main-container"]}>
      <section className={styles["left-section"]}>
        <h1>Inicia sesión</h1>
        {error && <p className={styles["error"]}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <InputField 
            id="user" 
            type="text" 
            label="Nombre de usuario" 
            name="user" 
            placeholder="Usuario" 
            icon={faUser} 
            value={formData.user} 
            onChange={handleChange} 
          />
          <InputField 
            id="password" 
            type="password" 
            label="Contraseña" 
            name="password" 
            placeholder="Contraseña" 
            icon={faLock} 
            value={formData.password} 
            onChange={handleChange} 
          />
          <Link to="">¿Has olvidado tu contraseña?</Link>
          <div>
            <Button type="reset" variant="red" label="Limpiar" onClick={() => setFormData({ user: "", password: "" })}/>
            <Button type="submit" variant="red" label="Aceptar" />
          </div>
        </form>
      </section>
      <section className={styles["right-section"]}>
        <img alt="logo" src="/atom.png"/>
        <h1>Bienvenido</h1>
        <p>¿No tienes una cuenta?</p>
        <Button variant="white" label="Regístrate" to="/register"/>
      </section>
    </div>
  );
}

export default Login;
