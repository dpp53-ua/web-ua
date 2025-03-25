import { Button, InputField } from '../../Components';
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

/* Estilos */
import styles from "./Register.module.css";

function Register() {
  const [formData, setFormData] = useState({ email: "", name: "", password: "", password_rep: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.email) newErrors.email = "El correo es obligatorio";
    if (!formData.name) newErrors.name = "El usuario es obligatorio";
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    if (formData.password !== formData.password_rep) newErrors.password_rep = "Las contraseñas no coinciden";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 400) {
          setErrors((prevErrors) => ({ ...prevErrors, name: "Este usuario o correo electrónico ya existe" }));
        } else {
          throw new Error(result.message || "Error en el registro");
        }
      }

      console.log("Registro exitoso", result);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, general: error.message }));
    }
  };

  return (
    <div className={styles["login-main-container"]}>
      <section className={styles["left-section"]}>
        <h1>Regístrate</h1>
        <form onSubmit={handleSubmit}>
          <InputField 
            id="email"
            type="email"
            label="Correo electrónico"
            name="email"
            placeholder="Correo"
            icon={faEnvelope}
            value={formData.email}
            onChange={handleChange}
            explicativeText={errors.email}
          />
          <InputField 
            id="user"
            type="text"
            label="Nombre de usuario"
            name="name"
            placeholder="Usuario"
            icon={faUser}
            value={formData.name}
            onChange={handleChange}
            explicativeText={errors.name}
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
            explicativeText={errors.password}
          />
          <InputField 
            id="password_rep"
            type="password"
            label="Repetir contraseña"
            name="password_rep"
            placeholder="Contraseña"
            icon={faLock}
            value={formData.password_rep}
            onChange={handleChange}
            explicativeText={errors.password_rep} 
          />
          <div>
            <Button type="reset" variant="red" label="Limpiar" onClick={() => setFormData({ email: "", name: "", password: "", password_rep: "" })}/>
            <Button type="submit" variant="red" label="Aceptar" />
          </div>
        </form>
      </section>
      <section className={styles["right-section"]}>
        <img alt="logo" src="/atom.png"/>
        <h1>Bienvenido</h1>
        <p>¿Ya tienes una cuenta?</p>
        <Button variant="white" label="Inicia sesión" to="/login"/>
      </section>
    </div>
  );
}

export default Register;
