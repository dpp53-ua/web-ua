import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Button, InputField, DeleteableTag } from '../../Components';
import styles from "./PostForm.module.css";

function PostForm() {
  const { id } = useParams(); 
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ postTitle: "", postDescription: "" });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [initialFiles, setInitialFiles] = useState([]); // para detectar cambios
  const [arrOptions, setArrOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [initialTags, setInitialTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [fechaModificacion, setFechaModificacion] = useState(null);

  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const MAX_FILES = 10;

  const isDuplicate = (fileName) =>
    uploadedFiles.some((f) => f.name === fileName);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

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

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileInput = (e) => {
    addFiles(Array.from(e.target.files));
  };

  const handleDeleteFile = (fileName) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const addTag = (e) => {
    const newTag = e.target.value;
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags(prevTags => [...prevTags, newTag]);
    }
  };

  const deleteTag = (tagToDelete) => {
    setSelectedTags(prevTags => prevTags.filter(tag => tag !== tagToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("📦 Enviando datos:");
    console.log("Título:", formData.postTitle);
    console.log("Descripción:", formData.postDescription);
    console.log("Categorías:", selectedTags);
    console.log("Archivos nuevos:", uploadedFiles.map(f => f.name));
    console.log("Modo edición:", isEditMode);
  
    const newErrors = {};
    if (!formData.postTitle)       newErrors.postTitle = "El título es obligatorio";
    if (!formData.postDescription) newErrors.postDescription = "La descripción es obligatoria";
    if (!uploadedFiles.length && !initialFiles.length)
      newErrors.postFile = "Debe subir al menos un archivo";
    if (!selectedTags.length)      newErrors.postCategories = "Seleccione al menos una categoría";
  
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
  
    const formPayload = new FormData();
    formPayload.append("titulo", formData.postTitle);
    formPayload.append("descripcion", formData.postDescription);
    selectedTags.forEach(tag => formPayload.append("categoria", tag));
  
    // 🔍 Detectar archivos eliminados
    const filesToDelete = initialFiles.filter(initialFile =>
      !uploadedFiles.some(file => file.name === initialFile.nombre)
    );
    filesToDelete.forEach(file => formPayload.append("eliminarArchivo", file.nombre)); // opcional, si lo usas
  
    // ✅ Subir solo los archivos nuevos (instancias File reales)
    uploadedFiles.forEach(file => formPayload.append("archivo", file));
  
    const userId = sessionStorage.getItem("userId");
  
    if (isEditMode) {
      const sinCambios =
        formData.postTitle === initialFormData.postTitle &&
        formData.postDescription === initialFormData.postDescription &&
        JSON.stringify(selectedTags) === JSON.stringify(initialTags) &&
        uploadedFiles.length === 0 &&
        filesToDelete.length === 0;
  
      if (sinCambios) {
        alert("No se han realizado cambios.");
        return;
      }
    }
  
    try {
      const endpoint = isEditMode
        ? `http://localhost:5000/api/publicaciones/${id}`
        : `http://localhost:5000/api/publicaciones/${userId}`;
  
      const response = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        body: formPayload,
      });
  
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
      }
  
      const result = await response.json();
      alert(isEditMode ? "Publicación actualizada correctamente" : "Publicación creada correctamente");
      handleClear();
  
    } catch (err) {
      console.error("Error al enviar publicación:", err);
      setErrors(prev => ({ ...prev, general: err.message }));
    }
  };
  
  
  const handleClear = () => {
    setFormData({ postTitle: "", postDescription: "" });
    setUploadedFiles([]);
    setInitialFiles([]);
    setSelectedTags([]);
    setInitialTags([]);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categorias');
      const data = await response.json();

      if (Array.isArray(data)) {
        setArrOptions(data.map(category => ({
          label: category.nombre,
          value: category.id,
        })));
      }
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  };

  const [initialFormData, setInitialFormData] = useState({ postTitle: "", postDescription: "" });

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/publicaciones/${id}`);
      const data = await res.json();
  
      setFormData({
        postTitle: data.titulo,
        postDescription: data.descripcion,
      });
      setInitialFormData({
        postTitle: data.titulo,
        postDescription: data.descripcion,
      });
  
      const fakeFiles = data.archivos.map(file =>
        new File([""], file.nombre, { type: "application/octet-stream" })
      );
  
      setUploadedFiles(fakeFiles);  // Se usan archivos simulados
      setInitialFiles(data.archivos);
      setSelectedTags(data.categoria);
      setInitialTags(data.categoria);
      setFechaModificacion(new Date(data.fecha));
    } catch (err) {
      console.error("Error al cargar publicación:", err);
    }
  };
  
  useEffect(() => {
    fetchCategories();
    if (isEditMode) fetchPost();
  }, [id]);

  return (
    <div className={styles["post-main-container"]}>
      <section className={styles["left-section"]}>
        <h1>{isEditMode ? "Editar publicación" : "Nueva publicación"}</h1>
        {errors.general && <p className={styles["error"]}>{errors.general}</p>}
        <form onSubmit={handleSubmit} onReset={handleClear}>
          <InputField
            id="postTitle"
            type="text"
            label="Título"
            name="postTitle"
            placeholder="Título"
            value={formData.postTitle}
            onChange={handleChange}
            explicativeText={errors.postTitle}
          />
          <InputField
            id="postDescription"
            type="textarea"
            label="Descripción"
            name="postDescription"
            placeholder="Descripción"
            value={formData.postDescription}
            onChange={handleChange}
            explicativeText={errors.postDescription}
          />
          <InputField
            id="postFile"
            type="file"
            label="Archivos"
            name="postFile"
            placeholder="Seleccionar archivos"
            onChange={handleFileInput}
            explicativeText={errors.postFile}
            multiple // 👈 permite múltiples archivos
            ref={fileInputRef}
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
          <InputField
            id="postCategories"
            type="select"
            label="Categorías"
            name="postCategories"
            placeholder="Categoría"
            onChange={addTag}
            arrOptions={arrOptions}
          />
          <div className={styles["grid-list"]}>
            <ul>
              {selectedTags.map((tag) => (
                <DeleteableTag
                  key={tag}
                  tag={tag}
                  onDelete={() => deleteTag(tag)}
                />
              ))}
            </ul>
          </div>
          <div>
            <Button type="reset" variant="red" label="Limpiar"/>
            <Button type="submit" variant="red" label={isEditMode ? "Actualizar" : "Aceptar"} />
          </div>
        </form>
      </section>

      <section className={styles["right-section"]}>
        {isEditMode && fechaModificacion && (
          <h1>Última edición: {fechaModificacion.toLocaleDateString()}</h1>
        )}
        <div
          className={styles["droparea"]}
          ref={dropAreaRef}
          onClick={() => fileInputRef.current?.click()}
        >
          <FontAwesomeIcon className={styles["font-icon"]} icon={faCloudArrowUp} />
          <p>También puedes arrastrar aquí tus archivos</p>
          <small>Máximo 10 archivos</small>
        </div>
      </section>
    </div>
  );
}

export default PostForm;
