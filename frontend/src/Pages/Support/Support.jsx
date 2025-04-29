import { Button, InputField } from '../../Components';
import styles from "./Support.module.css";
import { useState } from 'react';
import { faCheck, faRotateLeft} from "@fortawesome/free-solid-svg-icons";

function Support() {
  const [form, setForm] = useState({
    issueType: "",
    description: "",
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar lógica para enviar el formulario
  };
  return (
    <div className={styles["profile-main-container"]}>

      <section className={styles["right-content"]}>
        <header>
          <h1>Soporte</h1>
          <p>Encuentra respuestas o reporta un problema relacionado con los assets o la plataforma.</p>
        </header>

        {/* FAQs */}
        <div className={styles["faq-section"]}>
          <h2>Preguntas Frecuentes</h2>
          <ul>
            <li><strong>¿Qué tipo de archivos puedo subir?</strong> Se permiten .fbx, .obj, .png, .tga, .wav, .mp3, entre otros.</li>
            <li><strong>¿Cómo versiono correctamente un asset?</strong> Usa nombres como `modelo_v2.fbx` o `textura-final.tga`.</li>
            <li><strong>¿Cómo asigno un asset a un proyecto?</strong> Al subirlo, selecciona el proyecto en el formulario.</li>
            <li><strong>No puedo previsualizar un asset</strong> Asegúrate de que el formato sea compatible o contacta soporte.</li>
          </ul>
        </div>

        {/* Formulario de reporte */}
        <div className={styles["form-section"]}>
          <h2>Reportar un problema</h2>
          <form className={styles["support-form"]} onSubmit={handleSubmit}>
            <InputField
              id="issue-type"
              type="select"
              name="issueType"
              label="Tipo de problema:"
              arrOptions={[
                { value: "bug", label: "Bug" },
                { value: "mejora", label: "Sugerencia" },
                { value: "duda", label: "Duda" },
              ]}
              value={form.issueType}
              onChange={handleChange}
            />

            <InputField
              id="description"
              type="textarea"
              name="description"
              label="Descripción:"
              placeholder="Describe el problema o sugerencia..."
              value={form.description}
              onChange={handleChange}
            />

            <InputField
              id="attachment"
              type="file"
              name="attachment"
              label="Adjuntar archivo (opcional):"
              onChange={handleFileChange}
            />

            <div className={styles["profile-buttons"]}>
              <Button
                className={styles.btn_regist}
                variant="headerButtonBlack"
                label="Limpiar"
                icon={faRotateLeft}
                type="button"
              />
              <Button variant="headerButtonWhite" label="Enviar" icon={faCheck} type="submit" />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Support;
