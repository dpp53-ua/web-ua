import { Button, InputField, ProfileMenu } from '../../Components';
import { faCheck, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

/* Estilos */
import styles from "./Profile.module.css";

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    web: "",
    twitter: "",
    insta: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = sessionStorage.getItem("userId");
  
      if (!userId) {
        console.error("No se encontró el ID del usuario en sessionStorage.");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await response.json();
  
        setFormData({
          id: userId,
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          web: data.web || "",
          twitter: data.twitter || "",
          insta: data.insta || "",
        });
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };
  
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
  
    // Validaciones básicas
    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.email) newErrors.email = "El correo es obligatorio";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setErrors({ general: "No se encontró el ID del usuario. Intenta iniciar sesión de nuevo." });
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        if (response.status === 404) {
          setErrors((prevErrors) => ({ ...prevErrors, email: "Usuario no encontrado" }));
        } else {
          throw new Error(result.message || "Error al actualizar el perfil");
        }
        console.log("Error al actualizar", result);
      } else {
        console.log("Perfil actualizado correctamente", result);
        // Podés mostrar un mensaje de éxito o redireccionar
      }
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, general: error.message }));
      console.error("Error inesperado:", error);
    }
  };
  
    
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };
 

  return (
    <div className={styles["profile-main-container"]}>
      <section className={styles["left-content"]}>
        <ProfileMenu />
      </section>

      <section className={styles["right-content"]}>
        <h1>Perfil</h1>
        <form onSubmit={handleSubmit}>
          <h3>Información personal</h3>
          {errors.general && <p className={styles["error"]}>{errors.general}</p>}
          <div>
            <div className={styles["pic-name-email-input"]}>
              <div className={styles["profile-pic-container"]}>
                <img src="/atom.png" alt="Foto de perfil" className={styles["profile-pic"]} />
                <button type="button" className={styles["update-button"]}>
                  Actualizar
                </button>
              </div>

              <div className={styles["name-email-input"]}>
                <InputField
                  id="name"
                  type="text"
                  label="NOMBRE *"
                  name="name"
                  placeholder="Usuario"
                  value={formData.name}
                  onChange={handleChange}
                  explicativeText={errors.name}
                />
                <InputField
                  id="email"
                  type="text"
                  label="EMAIL *"
                  name="email"
                  placeholder="usuario@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  explicativeText={errors.email}
                />
              </div>
            </div>

            <InputField
              id="bio"
              type="textarea"
              label="BIOGRAFÍA"
              name="bio"
              placeholder="Háblanos de ti"
              value={formData.bio}
              onChange={handleChange}
              explicativeText={errors.bio}
            />
          </div>

          <h3>Social</h3>
          <div>
            <InputField
              id="web"
              type="text"
              label="WEB"
              name="web"
              placeholder="Tu sitio web"
              value={formData.web}
              onChange={handleChange}
              explicativeText={errors.web}
              className={styles["custom-input"]}
            />
            <InputField
              id="twitter"
              type="text"
              label="TWITTER"
              name="twitter"
              placeholder="@nombre twitter"
              value={formData.twitter}
              onChange={handleChange}
              explicativeText={errors.twitter}
            />
            <InputField
              id="insta"
              type="text"
              label="INSTAGRAM"
              name="insta"
              placeholder="@nombre instagram"
              value={formData.insta}
              onChange={handleChange}
              explicativeText={errors.insta}
            />
          </div>

          <div className={styles["profile-buttons"]}>
            <Button
              className={styles.btn_regist}
              variant="headerButtonBlack"
              label="Reestablecer"
              icon={faRotateLeft}
              type="button"
              onClick={() =>
                setFormData({
                  name: "",
                  email: "",
                  bio: "",
                  web: "",
                  twitter: "",
                  insta: "",
                })
              }
            />
            <Button
              variant="headerButtonWhite"
              label="Actualizar"
              icon={faCheck}
              type="submit"
            />
          </div>
        </form>
      </section>
    </div>
  );
}

export default Profile;
