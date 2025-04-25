import { Button, InputField, ProfileMenu } from '../../Components';
import { faCheck, faRotateLeft, faLock, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react"; // 🔄 CAMBIO
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../Context";
import Swal from "sweetalert2";
import styles from "./Profile.module.css";

function Profile() {
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    web: "",
    twitter: "",
    insta: "",
    currentPassword: "",
    newPassword: "",
  });
  const { userId } = useAuth();
  const [errors, setErrors] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const fileInputRef = useRef(null); // 🔄 CAMBIO

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error("No se encontró el ID del usuario en el contexto.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await response.json();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          bio: data.biografia || "",
          web: data.web || "",
          twitter: data.twitter || "",
          insta: data.instagram || "",
        });
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  //--------- SUBIDA DE FORMULARIO -----------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.email) newErrors.email = "El correo es obligatorio";
    if (showPasswordFields) {
      if (!formData.currentPassword) newErrors.currentPassword = "La contraseña actual es obligatoria";
      if (!formData.newPassword) newErrors.newPassword = "La nueva contraseña es obligatoria";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await Swal.fire({
      title: "¿Confirmar acción?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      background: "#1e1e1e",
      color: "#ffffff",
      customClass: {
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn"
      }
    });

    if (!result.isConfirmed) return;

    // 🔄 CAMBIO: Usamos FormData
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("biografia", formData.bio);
    formDataToSend.append("web", formData.web);
    formDataToSend.append("twitter", formData.twitter);
    formDataToSend.append("instagram", formData.insta);
    if (showPasswordFields && formData.newPassword) {
      formDataToSend.append("password", formData.newPassword);
    }

    if (fileInputRef.current?.files[0]) {
      formDataToSend.append("foto", fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setErrors((prevErrors) => ({ ...prevErrors, email: "Usuario no encontrado" }));
        } else {
          throw new Error(result.message || "Error al actualizar el perfil");
        }
      } else {
        Swal.fire({
          title: "¡Perfil actualizado!",
          text: "Tu perfil ha sido actualizado correctamente.",
          icon: "success",
          confirmButtonText: "OK",
          background: "#1e1e1e",      // 🖤 Fondo oscuro
          color: "#ffffff",           // 🤍 Texto blanco
          customClass: {
            confirmButton: "swal-confirm-btn",
          }
        }).then(() => {
          window.location.reload();
        });
        
      }
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, general: error.message }));
      console.error("Error inesperado:", error);
    }
  };
  //--------- CAMBIO DE VALORES -----------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
  };

  return (
    <div className={styles["profile-main-container"]}>
      <section className={styles["left-content"]}>
        <ProfileMenu />
      </section>

      <section className={styles["right-content"]}>
        <header>
          <h1>Perfil</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <h3>Información personal</h3>
          {errors.general && <p className={styles["error"]}>{errors.general}</p>}
          <div className={styles["seccion"]}>
            <div className={styles["pic-name-email-input"]}>
              <div className={styles["profile-pic-container"]}>
                <img
                  src={previewUrl || `http://localhost:5000/api/users/${userId}/foto`}
                  alt="Foto de perfil"
                  className={styles["profile-pic"]}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  id="fileUpload"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />
                <button
                  type="button"
                  className={styles["update-button"]}
                  onClick={() => fileInputRef.current?.click()} // ✅ Abrimos el input al hacer clic
                >
                  Cambiar foto
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
          <div className={styles["seccion"]}>
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

          <h4 onClick={togglePasswordFields} className={styles["change-password-header"]}>
            <FontAwesomeIcon icon={faLock} />
            <span> Cambiar contraseña </span>
            <FontAwesomeIcon icon={showPasswordFields ? faChevronDown : faChevronUp} />
          </h4>

          {showPasswordFields && (
            <div className={styles["seccion"]}>
              <InputField
                id="currentPassword"
                type="password"
                label="Contraseña actual"
                name="currentPassword"
                placeholder="Introduce tu contraseña actual"
                value={formData.currentPassword}
                onChange={handleChange}
                explicativeText={errors.currentPassword}
              />
              <InputField
                id="newPassword"
                type="password"
                label="Nueva contraseña"
                name="newPassword"
                placeholder="Introduce la nueva contraseña"
                value={formData.newPassword}
                onChange={handleChange}
                explicativeText={errors.newPassword}
              />
            </div>
          )}

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
                  currentPassword: "",
                  newPassword: "",
                })
              }
            />
            <Button variant="headerButtonWhite" label="Actualizar" icon={faCheck} type="submit" />
          </div>
        </form>
      </section>
    </div>
  );
}

export default Profile;
