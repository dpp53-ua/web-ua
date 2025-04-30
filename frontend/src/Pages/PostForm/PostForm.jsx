import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Button, InputField, DeleteableTag } from '../../Components';
import { getCSSVariable } from "../../Utils";
import Swal from "sweetalert2";
import styles from "./PostForm.module.css";


function PostForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ postTitle: "", postDescription: "" });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [initialFiles, setInitialFiles] = useState([]);
  const [arrOptions, setArrOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [initialTags, setInitialTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [fechaModificacion, setFechaModificacion] = useState(null);
  const [initialFormData, setInitialFormData] = useState({ postTitle: "", postDescription: "" });

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
      setErrors(prev => ({ ...prev, postFile: "Algunos archivos ya estaban añadidos o exceden el límite." }));
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
  
    const filesToDelete = initialFiles.filter(initialFile =>
      !uploadedFiles.some(file => file.name === initialFile.nombre)
    );
  
    const hasNewFiles = uploadedFiles.some(file => file instanceof File);
    const hasRemainingInitialFiles = initialFiles.some(initialFile =>
      uploadedFiles.some(file => file.name === initialFile.nombre)
    );
  
    // Validaciones
    const newErrors = {};
    if (!formData.postTitle)       newErrors.postTitle = "El título es obligatorio";
    if (!formData.postDescription) newErrors.postDescription = "La descripción es obligatoria";
    if (!hasNewFiles && !hasRemainingInitialFiles) {
      newErrors.postFile = "Debe subir al menos un archivo";
    }
    if (!selectedTags.length)      newErrors.postCategories = "Seleccione al menos una categoría";
  
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
  
    const compareTags = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
      }
      return true;
    };
    
    if (isEditMode) {
      const sinCambios =
      formData.postTitle === initialFormData.postTitle &&
      formData.postDescription === initialFormData.postDescription &&
      compareTags(selectedTags.sort(), initialTags.sort()) &&
      filesToDelete.length === 0; // Solo verificamos si hay archivos para eliminar
    
    
  
      console.log("SIN CAMBIOS:", sinCambios);

      console.log('Selected Tags:', selectedTags);
      console.log('Initial Tags:', initialTags);
      console.log('Form Data:', formData);
      console.log('Initial Form Data:', initialFormData);
      console.log('Uploaded Files:', uploadedFiles);
      console.log('Files to Delete:', filesToDelete);

  
      if (sinCambios) {
        return Swal.fire({
          title: 'Sin cambios',
          text: 'No hay modificaciones para guardar',
          icon: 'info',
          background: getCSSVariable('--dark-grey'),
          color: getCSSVariable('--white'),
          customClass: {
            confirmButton: "swal-confirm-btn",
          },
        });
      }
  
      const result = await Swal.fire({
        title: '¿Desea actualizar la publicación?',
        text: 'Se sustituirán los datos antiguos por los nuevos',
        icon: 'warning',
        background: getCSSVariable('--dark-grey'),
        color: getCSSVariable('--white'),
        customClass: {
          confirmButton: "swal-confirm-btn",
        },
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar cambios',
        cancelButtonText: 'Cancelar'
      });
  
      if (!result.isConfirmed) {
        return;
      }
    }
  
    // Construir FormData
    const formPayload = new FormData();
    formPayload.append("titulo", formData.postTitle);
    formPayload.append("descripcion", formData.postDescription);
    selectedTags.forEach(tag => formPayload.append("categoria", tag));
  
    filesToDelete.forEach(file =>
      formPayload.append("eliminarArchivo", file.nombre)
    );
  
    uploadedFiles.forEach(file => {
      if (file instanceof File) {
        formPayload.append("archivo", file);
      }
    });
  
    const userId = sessionStorage.getItem("userId");
  
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
      Swal.fire({
        title: "¡Listo!",
        text: isEditMode
          ? 'La publicación se ha actualizado'
          : 'Se ha añadido una nueva publicación',
        icon: 'success',
        background: getCSSVariable('--dark-grey'),
        color: getCSSVariable('--white'),
        customClass: {
          confirmButton: "swal-confirm-btn",
        }
      });
  
      handleClear(false);
  
    } catch (err) {
      console.error("Error al enviar publicación:", err);
      setErrors(prev => ({ ...prev, general: err.message }));
    }
  };
  

  const handleClear = async (swal) => {
    // Si no se desea mostrar el SweetAlert, limpiar directamente
    if (!swal) {
      clearForm();
      return;
    }
  
    // Mostrar SweetAlert y esperar confirmación
    const result = await Swal.fire({
      title: '¿Limpiar formulario?',
      text: '¿Deseas borrar todos los campos introducidos?',
      icon: 'warning',
      background: getCSSVariable('--dark-grey'),
      color: getCSSVariable('--white'),
      customClass: {
        confirmButton: "swal-confirm-btn",
      },
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    });
  
    if (result.isConfirmed) {
      clearForm();
    }
  };
  
  // Función auxiliar para limpiar el formulario
  const clearForm = () => {
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

      setUploadedFiles(fakeFiles);
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
        <form onSubmit={handleSubmit} onReset={() => handleClear(true)}>
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
            multiple
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
            <Button type="reset" variant="red" label="Limpiar" />
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
