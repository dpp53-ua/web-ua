import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Button, InputField, DeleteableTag } from '../../Components';
import styles from "./PostForm.module.css";

function PostForm() {
  const [formData, setFormData] = useState({
    postTitle: "",
    postDescription: "",
  });
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [arrOptions, setArrOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
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
      setUploadedFiles(prev => {
        const updatedFiles = [...prev, ...newFiles];
        console.log(updatedFiles); 
        return updatedFiles;
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
    console.log(uploadedFiles);
  };

  const handleDeleteFile = (fileName) => {
    setUploadedFiles(prev => {
      const updatedFiles = prev.filter(f => f.name !== fileName);
      console.log(updatedFiles);
      return updatedFiles;
    });
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
    const newErrors = {};
  
    if (!formData.postTitle)       newErrors.postTitle       = "El título es obligatorio";
    if (!formData.postDescription) newErrors.postDescription = "La descripción es obligatoria";
    if (!uploadedFiles.length)     newErrors.postFile        = "Debe subir al menos un archivo";
    if (!selectedTags.length)      newErrors.postCategories  = "Seleccione al menos una categoría";
  
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const formPayload = new FormData();
      formPayload.append("titulo", formData.postTitle);
      formPayload.append("descripcion", formData.postDescription);
      // cada categoría bajo el mismo nombre 'categoria'
      selectedTags.forEach(tag => formPayload.append("categoria", tag));
      // ¡solo un archivo y con la clave 'archivo'!
      formPayload.append("archivo", uploadedFiles[0]);
  
      const idUsuario = sessionStorage.getItem("userId");

      console.log("Datos del formulario a enviar:");
      for (let [key, val] of formPayload.entries()) {
        console.log(key, val);
      }
      

      const response = await fetch(
        `http://localhost:5000/api/publicaciones/${idUsuario}`,
        { method: "POST", body: formPayload }
      );
  
      if (!response.ok) {
        // para debug: imprime el HTML o error que venga
        const text = await response.text();
        console.error("Respuesta cruda del servidor:", text);
        throw new Error(`Error ${response.status}`);
      }
  
      const result = await response.json();
      console.log("✅ Publicación creada:", result);
      alert("Publicación creada correctamente");
      handleClear();
    } catch (err) {
      console.error("Error al enviar publicación:", err);
      setErrors(prev => ({ ...prev, general: err.message }));
    }
  };
  

  /*const fetchCategories = async () => {
    // try {
    //   const response = await fetch('URL_DE_TU_API'); // Reemplaza con la URL de tu API
    //   const data = await response.json();
      
    //   // Suponiendo que las categorías vienen como un array en la propiedad 'categories' de la respuesta.
    //   if (data && Array.isArray(data.categories)) {
    //     setArrOptions(data.categories.map(category => ({
    //       label: category.name,  // Suponiendo que cada categoría tiene una propiedad 'name'
    //       value: category.id     // Suponiendo que cada categoría tiene una propiedad 'id'
    //     })));
    //   }
    // } catch (error) {
    //   console.error('Error al obtener las categorías:', error);
    // }
    await setArrOptions([
      { label: "Opcion1", value: "Opción 1" },
      { label: "Opcion2", value: "Opción 2" }
    ]);
  }*/

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categorias'); // Reemplaza si tu endpoint es otro
      const data = await response.json();
  
      if (data && Array.isArray(data)) {
        setArrOptions(data.map(category => ({
          label: category.nombre, 
          value: category.id
        })));
      }
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  }
  

  const handleClear = () => {
    setFormData({ postTitle: "", postDescription: "" });
    setUploadedFiles([]);
    setSelectedTags([]);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  

  useEffect(() => {
    fetchCategories();
  }, []);

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
            label="Archivo"
            name="postFile"
            placeholder="Seleccionar archivo"
            onChange={handleFileInput}
            explicativeText={errors.postFile}
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
            <Button type="submit" variant="red" label="Aceptar" />
          </div>
        </form>
      </section>

      <section className={styles["right-section"]}>
        <h1>Última editado: XX/XX/XXXX</h1>
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
