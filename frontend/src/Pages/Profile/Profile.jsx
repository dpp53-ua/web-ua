import { Button, InputField, ProfileMenu} from '../../Components';
import { faCheck , faRotateLeft} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

/* Estilos */
import styles from "./Profile.module.css";

function Profile() {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [errors, setErrors] = useState({});
  const handleSubmit = async (e) => {
   
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

return (
    <div className={styles["profile-main-container"]}>

      <section className={styles["left-content"]}>
        <ProfileMenu></ProfileMenu>
      </section>

      <section className={styles["right-content"]}>
        <h1>Perfil</h1>
        <form onSubmit={handleSubmit}>
            <h3>Información personal</h3>
            <div>
              <div className={styles["pic-name-email-input"]}>
                {/* Imagen de perfil con botón */}
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
                    placeholder="Usuario@gmail.com" 
                    value={formData.name} 
                    onChange={handleChange} 
                    explicativeText={errors.name}
                  />
                </div>
              </div>
            
               <InputField 
                id="bio" 
                type="textarea" 
                label="BIOGRAFÍA" 
                name="bio" 
                placeholder="Háblanos de ti" 
                value={formData.name} 
                onChange={handleChange} 
                explicativeText={errors.name}
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
                value={formData.name} 
                onChange={handleChange} 
                explicativeText={errors.name}
                className={styles["custom-input"]} 
              />
              <InputField 
                id="twitter" 
                type="text" 
                label="TWITTER" 
                name="twitter" 
                placeholder="@nombre twitter" 
                value={formData.name} 
                onChange={handleChange} 
                explicativeText={errors.name}
              />
            
               <InputField 
                id="insta" 
                type="text" 
                label="INSTAGRAM" 
                name="insta" 
                placeholder="@nombre instagram" 
                value={formData.name} 
                onChange={handleChange} 
                explicativeText={errors.name}
              />
            </div>
            <div  className={styles["profile-buttons"]}>
              <Button  className={styles.btn_regist}  variant="headerButtonBlack" label="Reestablecer" icon={faRotateLeft}/> 
              <Button  variant="headerButtonWhite" label="Actualizar" icon={faCheck}  /> 
            </div>
        </form>
      </section>
    </div>
  );
}

export default Profile;