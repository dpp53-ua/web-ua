/* Componentes */
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
    setErrors({ ...errors, [e.target.name]: "" });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
  
    if (!formData.email) newErrors.correo = "El correo es obligatorio";
    if (!formData.name) newErrors.user = "El usuario es obligatorio";
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    if (formData.password !== formData.password_rep) newErrors.password_rep = "Las contraseñas no coinciden";
  
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // Si hay errores, no continuar
  
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        if (response.status === 400) {
          setErrors({ ...newErrors, userDuplicated: "Este usuario ya existe" });
        } else {
          throw new Error(result.message || "Error en el registro");
        }
      }
  
      console.log("Registro exitoso", result);
    } catch (error) {
      setErrors({ general: error.message });
    }
  };
  

  return (
    <div className={styles["login-main-container"]}>
      <section className={styles["left-section"]}>
        <h1>Regístrate</h1>
        {errors.general && <p className={styles["error"]}>{errors.general}</p>}
        <form onSubmit={handleSubmit}>
          <InputField 
            id="correo"
            type="email"
            label="Correo electrónico"
            name="email"
            placeholder="Correo"
            icon={faEnvelope}
            value={formData.correo}
            onChange={handleChange}
            explicativeText={[errors.correo, errors.userDuplicated].filter(Boolean).join(". ")} // Mostrar error si existe
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
            explicativeText={errors.user} // Mostrar error si existe
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
            explicativeText={errors.password} // Mostrar error si existe
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
            explicativeText={errors.password_rep} // Mostrar error si existe
          />
          <div>
            <Button type="reset" variant="red" label="Limpiar" onClick={() => setFormData({ correo: "", user: "", password: "", password_rep: "" })}/>
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
