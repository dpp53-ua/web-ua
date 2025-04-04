import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Button, InputField, DeleteableTag } from '../../Components';
import styles from "./PostForm.module.css";

function PostForm() {
  const [formData, setFormData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const MAX_FILES = 10;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const isDuplicate = (fileName) =>
    uploadedFiles.some((f) => f.name === fileName);

  const addFiles = (files) => {
    const newFiles = [];

    for (const file of files) {
      if (isDuplicate(file.name)) continue;
      if (uploadedFiles.length + newFiles.length >= MAX_FILES) break;
      newFiles.push(file);
    }

    if (newFiles.length < files.length) {
      setErrors(prev => ({ ...prev, postFile: "Algunos archivos ya estaban añadidos." }));
    } else {
      setErrors(prev => ({ ...prev, postFile: "" }));
    }

    if (newFiles.length) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }

    // Limpia el input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const handleDeleteFile = (fileName) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name) newErrors.name = "El usuario es obligatorio";
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Archivos para enviar:", uploadedFiles);
    // Aquí tu lógica de envío
  };

  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const preventDefaults = (e) => e.preventDefault();
    const highlight = () => (dropArea.style.opacity = "0.6");
    const unhighlight = () => (dropArea.style.opacity = "1");
    const handleDrop = (e) => {
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    };

    ["dragenter", "dragover", "dragleave", "drop"].forEach(event =>
      dropArea.addEventListener(event, preventDefaults)
    );
    ["dragenter", "dragover"].forEach(event =>
      dropArea.addEventListener(event, highlight)
    );
    ["dragleave", "drop"].forEach(event =>
      dropArea.addEventListener(event, unhighlight)
    );
    dropArea.addEventListener("drop", handleDrop);

    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach(event =>
        dropArea.removeEventListener(event, preventDefaults)
      );
      ["dragenter", "dragover"].forEach(event =>
        dropArea.removeEventListener(event, highlight)
      );
      ["dragleave", "drop"].forEach(event =>
        dropArea.removeEventListener(event, unhighlight)
      );
      dropArea.removeEventListener("drop", handleDrop);
    };
  }, [uploadedFiles]);

  return (
    <div className={styles["post-main-container"]}>
      <section className={styles["left-section"]}>
        <h1>Formulario de publicación</h1>
        {errors.general && <p className={styles["error"]}>{errors.general}</p>}
        <form onSubmit={handleSubmit}>
          <InputField
            id="name"
            type="text"
            label="Usuario"
            name="name"
            placeholder="Tu usuario"
            value={formData.name || ""}
            onChange={handleChange}
            explicativeText={errors.name}
          />
          <InputField
            id="password"
            type="password"
            label="Contraseña"
            name="password"
            placeholder="Contraseña"
            value={formData.password || ""}
            onChange={handleChange}
            explicativeText={errors.password}
          />
          <InputField
            id="postFile"
            type="file"
            label="Archivo"
            name="postFile"
            placeholder="Seleccionar archivo"
            onChange={handleFileInput}
            explicativeText={errors.postFile}
            inputRef={fileInputRef}
          />
          <div className={styles["grid-list"]}>
            <ul>
              {uploadedFiles.map((file) => (
                <DeleteableTag
                  key={file.name}
                  file={file}
                  onDelete={() => handleDeleteFile(file.name)}
                />
              ))}
            </ul>
          </div>
          <Button type="submit" variant="red" label="Enviar" />
        </form>
      </section>

      <section className={styles["right-section"]}>
        <div className={styles["droparea"]} ref={dropAreaRef}>
          <FontAwesomeIcon className={styles["font-icon"]} icon={faCloudArrowUp} />
          <p>También puedes arrastrar aquí tus archivos</p>
          <small>Máximo 10 archivos</small>
        </div>
      </section>
    </div>
  );
}

export default PostForm;
