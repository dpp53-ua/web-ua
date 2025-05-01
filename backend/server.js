'use strict'

const PORT = 5000;

const express = require("express");
const logger = require("morgan");
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");

const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: 'uploads/' });
const path = require('path');

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017");
let bucket;
let publicacionesDB;
let usersCollection;
let categoriasCollection;
let comentariosCollection;



mongoClient.connect().then(client => {
    const database = client.db("miBaseDeDatos");
    bucket = new GridFSBucket(database, { bucketName: "archivos" });
    publicacionesDB = database.collection("publicaciones");
    usersCollection = database.collection("users"); // Cambié esto para usar mongodb en lugar de mongojs
    categoriasCollection = database.collection("categorias");
    comentariosCollection = database.collection("comentarios");


}).catch(console.error);

const cors = require("cors");

const app = express();

// Middleware
app.use(logger("dev")); // Logs de las peticiones
app.use(cors()); // Permitir CORS
app.use(express.json()); // Soporte para JSON

app.post("/api/users", (req, res) => {
    const { email, name, password } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({ message: "Faltan datos" });
    }

    usersCollection.findOne({ $or: [{ email }, { name }] }).then(existingUser => {
        if (existingUser) {
            return res.status(400).json({ message: "El usuario o el email ya existen" });
        }

        // Insertar usuario con valores por defecto
        const nuevoUsuario = {
            email,
            name,
            password,
            theme: "night",
            fontSize: "medium"
        };

        usersCollection.insertOne(nuevoUsuario)
            .then(result => {
                res.status(201).json({ message: "Usuario creado", user: result });
            })
            .catch(err => res.status(500).json({ message: "Error en el servidor", error: err }));
    }).catch(err => res.status(500).json({ message: "Error en el servidor", error: err }));
});

app.get("/api/users", (req, res) => {
    usersCollection.find().toArray()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: "Error en el servidor", error: err }));
});

app.get("/api/users/:id", (req, res) => {
    const { id } = req.params;

    usersCollection.findOne({ _id: new ObjectId(id) })
        .then(user => {
            if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

            // Excluir la contraseña por seguridad
            const { password, ...userWithoutPassword } = user;

            res.json(userWithoutPassword);
        })
        .catch(err => res.status(500).json({ message: "Error en el servidor", error: err }));
});

app.put("/api/users/:id", upload.single("foto"), (req, res) => {
    const { id } = req.params;
    const updateFields = {};

    // Filtrar solo los campos que vienen en el body
    const allowedFields = ["email", "name", "password", "biografia", "web", "twitter", "instagram", "theme", "fontSize"];
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updateFields[field] = req.body[field];
        }
    });

    // Si hay una nueva foto
    if (req.file) {
        // Subir la foto a GridFS y obtener el archivo ID
        const file = req.file;
        const filePath = file.path;
        const readStream = fs.createReadStream(filePath);

        const uploadResult = new Promise((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(file.originalname);
            readStream.pipe(uploadStream)
                .on("error", reject)
                .on("finish", () => resolve(uploadStream));
        });

        uploadResult.then(uploadStream => {
            // Eliminar el archivo temporal
            fs.unlinkSync(filePath);

            // Actualizar el campo 'foto' del usuario con el ID del archivo en GridFS
            updateFields.foto = uploadStream.id;

            // Ahora, realizamos la actualización del usuario con la nueva foto
            usersCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateFields }
            ).then(() => {
                res.json({ message: "Usuario actualizado" });
            }).catch(err => res.status(500).json({ message: "Error en el servidor", error: err }));
        }).catch((err) => {
            console.error("Error al subir la foto a GridFS:", err);
            res.status(500).json({ message: "Error al subir la foto", error: err });
        });
    } else {
        // Si no hay foto, solo actualizamos los campos disponibles
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No hay campos para actualizar" });
        }

        // Verificar si el nuevo email o nombre ya existen en otro usuario
        usersCollection.findOne(
            {
                $or: [{ email: updateFields.email }, { name: updateFields.name }],
                _id: { $ne: new ObjectId(id) }
            }
        ).then(existingUser => {
            if (existingUser) return res.status(400).json({ message: "El usuario o el email ya existen" });

            // Actualizar el usuario
            usersCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateFields }
            ).then(() => {
                res.json({ message: "Usuario actualizado" });
            }).catch(err => res.status(500).json({ message: "Error en el servidor", error: err }));
        }).catch(err => res.status(500).json({ message: "Error en el servidor", error: err }));
    }
});

app.delete("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // opcional: eliminar assets relacionados en GridFS y publicaciones
        await usersCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Usuario eliminado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al eliminar usuario", error: err });
    }
});

app.post("/api/login", (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: "Faltan nombre de usuario o contraseña" });
    }

    // Buscar usuario por nombre
    usersCollection.findOne({ name })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "El usuario no existe" });
            }

            // Comparar contraseña (sin seguridad)
            if (user.password !== password) {
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }

            // excluir la contraseña de la respuesta
            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({ message: "Login exitoso", user: userWithoutPassword });
        })
        .catch(err => res.status(500).json({ message: "Error en el servidor", error: err }));
});

app.get("/api/publicaciones", async (req, res) => {
    const { query, categories, formats, types, ratings } = req.query;
    console.log("🔎 Parámetros recibidos:", req.query);

    // Crea el objeto `match` que usaremos en la agregación para filtrar los resultados
    const match = {};

    // Filtro por categorías (si existe el parámetro `categories`)
    if (categories) {
        const categoryArray = categories.split(',').map(c => c.trim()); // 👈 Limpia espacios
        console.log("💡 categoryArray:", categoryArray);
        match.categoria = { $in: categoryArray };
    }
            

    // Filtro por formatos (si existe el parámetro `formats`)
    if (formats) {
        const formatArray = formats.split(',');
        match.formato = { $in: formatArray };  // Suponiendo que el campo 'formato' es un array
    }

    // Filtro por tipos (si existe el parámetro `types`)
    if (types) {
        const typeArray = types.split(',');
        match.tipo = { $in: typeArray };  // Suponiendo que el campo 'tipo' es un array
    }

    // Filtro por estrellas (si existe el parámetro `ratings`)
    if (ratings) {
        match.valoracion = { $gte: parseInt(ratings) };  // Filtra por valoraciones mayores o iguales a la proporcionada
    }

    // Búsqueda de texto (si existe el parámetro `query`)
    if (query) {
        match.$text = { $search: query };  // Suponiendo que tienes un índice de texto en el campo correspondiente
    }

    try {
        // Realiza la agregación con los filtros aplicados
        const publicaciones = await publicacionesDB.aggregate([
            { $match: match },  // Aplica el filtro basado en el objeto `match`
            {
                $addFields: {
                    usuarioId: { $toObjectId: "$usuarioId" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "usuarioId",
                    foreignField: "_id",
                    as: "usuario"
                }
            },
            { $unwind: "$usuario" },
            {
                $project: {
                    titulo: 1,
                    descripcion: 1,
                    categoria: 1,
                    archivos: 1, // Incluye el array de archivos [{ id, nombre }]
                    miniatura: 1,
                    fecha: 1,
                    "usuario._id": 1,
                    "usuario.name": 1,
                    "usuario.email": 1
                }
            },
            { $sort: { fecha: -1 } } // Ordena por fecha (de más reciente a más antigua)
        ]).toArray();

        res.json(publicaciones);
        console.log("🔎 Respuesta:", publicaciones);

    } catch (err) {
        console.error("❌ Error al obtener publicaciones:", err);
        res.status(500).json({ message: "Error al procesar la solicitud", error: err.message });
    }
});


app.get("/api/publicaciones/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const objectId = new ObjectId(id);

        const publicacion = await publicacionesDB.aggregate([
            { $match: { _id: objectId } },
            {
                $addFields: {
                    usuarioObjectId: { $toObjectId: "$usuarioId" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "usuarioObjectId",
                    foreignField: "_id",
                    as: "usuario"
                }
            },
            {
                $unwind: {
                    path: "$usuario",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    titulo: 1,
                    descripcion: 1,
                    categoria: 1,
                    archivos: 1,
                    miniatura: 1,
                    fecha: 1,
                    likes: 1,
                    "usuario._id": 1,
                    "usuario.name": 1,
                    "usuario.email": 1,
                    "usuario.foto": 1
                }
            }
        ]).toArray();

        if (!publicacion || publicacion.length === 0) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        res.json(publicacion[0]);

    } catch (err) {
        console.error("Error al obtener la publicación:", err);
        res.status(500).json({ message: "Error al procesar la solicitud", error: err.message });
    }
});

app.get("/api/publicaciones/usuario/:idUsuario", async (req, res) => {
    try {
        const idUsuario = req.params.idUsuario;

        const publicaciones = await publicacionesDB.aggregate([
            {
                $addFields: {
                    usuarioId: { $toObjectId: "$usuarioId" }
                }
            },
            {
                $match: {
                    usuarioId: new ObjectId(idUsuario)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "usuarioId",
                    foreignField: "_id",
                    as: "usuario"
                }
            },
            { $unwind: "$usuario" },
            {
                $project: {
                    titulo: 1,
                    descripcion: 1,
                    categoria: 1,
                    archivos: 1,
                    fecha: 1,
                    "usuario._id": 1,
                    "usuario.name": 1,
                    "usuario.email": 1
                }
            },
            { $sort: { fecha: -1 } }
        ]).toArray();

        res.json(publicaciones);

    } catch (err) {
        console.error("❌ Error al obtener publicaciones:", err);
        res.status(500).json({ message: "Error al procesar la solicitud", error: err.message });
    }
});

app.post("/api/publicaciones/:idUsuario", upload.fields([
    { name: "archivo", maxCount: 10 },
    { name: "miniatura", maxCount: 1 }
  ]), async (req, res) => {
    try {
      let { titulo, descripcion, categoria } = req.body;

        // Normalizar a array y limpiar falsy
        categoria = Array.isArray(categoria) ? categoria.filter(Boolean)
                : categoria ? [categoria]
                : [];

        // Si después de limpiar no hay categorías, poner "Sin categoría"
        if (categoria.length === 0) {
        categoria = ["Sin categoría"];
        } else {
        // Eliminar "Sin categoría" si llegan otras categorías válidas
        categoria = categoria.filter(c => c !== "Sin categoría");
        }
  
      const archivos = req.files["archivo"] || [];
      const miniatura = req.files["miniatura"]?.[0];
  
      const idUsuario = req.params.idUsuario;
      if (!titulo || !descripcion || !archivos.length || !miniatura || !idUsuario) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
      }
  
      const usuario = await usersCollection.findOne({ _id: new ObjectId(idUsuario) });
      if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
  
      // Subir archivos
      const archivoIds = [];
      for (const file of archivos) {
        const readStream = fs.createReadStream(file.path);
        const uploadStream = bucket.openUploadStream(file.originalname);
        await new Promise((ok, ko) => {
          readStream.pipe(uploadStream)
            .on("error", ko)
            .on("finish", () => ok());
        });
        archivoIds.push({ id: uploadStream.id, nombre: file.originalname });
        fs.unlinkSync(file.path);
      }
  
      // Subir miniatura
      const miniaturaStream = fs.createReadStream(miniatura.path);
      const miniaturaUpload = bucket.openUploadStream(miniatura.originalname);
      await new Promise((ok, ko) => {
        miniaturaStream.pipe(miniaturaUpload)
          .on("error", ko)
          .on("finish", () => ok());
      });
      fs.unlinkSync(miniatura.path);
  
      const nuevaPublicacion = {
        usuarioId: idUsuario,
        titulo,
        descripcion,
        categoria,
        archivos: archivoIds,
        miniatura: {
          id: miniaturaUpload.id,
          nombre: miniatura.originalname
        },
        fecha: new Date()
      };
  
      const insertResult = await publicacionesDB.insertOne(nuevaPublicacion);
      res.status(201).json({
        message: "Publicación creada",
        publicacion: { _id: insertResult.insertedId, ...nuevaPublicacion }
      });
  
    } catch (err) {
      console.error("Error en publicación:", err);
      res.status(500).json({ message: "Error al procesar la publicación", error: err.message });
    }
  });
  

  app.put("/api/publicaciones/:id", upload.fields([
    { name: "archivo", maxCount: 10 },
    { name: "miniatura", maxCount: 1 }
  ]), async (req, res) => {
    console.log("Archivos recibidos:", req.files);
    try {
      const { id } = req.params;
      let { titulo, descripcion, categoria } = req.body;
      if (!Array.isArray(categoria)) categoria = [categoria];
  
      const archivos = req.files["archivo"] || [];
      const miniatura = req.files["miniatura"]?.[0];
  
      const publicacion = await publicacionesDB.findOne({ _id: new ObjectId(id) });
      if (!publicacion) {
        return res.status(404).json({ message: "Publicación no encontrada" });
      }
  
      const updateFields = {};
      if (titulo) updateFields.titulo = titulo;
      if (descripcion) updateFields.descripcion = descripcion;
      if (categoria) updateFields.categoria = categoria;
  
      // Reemplazar archivos si hay nuevos
      if (archivos.length > 0) {
        const nuevosArchivos = [];
        for (const file of archivos) {
          const readStream = fs.createReadStream(file.path);
          const uploadStream = bucket.openUploadStream(file.originalname);
          await new Promise((resolve, reject) => {
            readStream.pipe(uploadStream)
              .on("error", reject)
              .on("finish", () => resolve());
          });
          nuevosArchivos.push({ id: uploadStream.id, nombre: file.originalname });
          fs.unlinkSync(file.path);
        }
        updateFields.archivos = nuevosArchivos;
      }
  
      // Reemplazar miniatura si se envió
      if (miniatura) {
        const readStream = fs.createReadStream(miniatura.path);
        const uploadStream = bucket.openUploadStream(miniatura.originalname);
        await new Promise((resolve, reject) => {
          readStream.pipe(uploadStream)
            .on("error", reject)
            .on("finish", () => resolve());
        });
        fs.unlinkSync(miniatura.path);
        updateFields.miniatura = { id: uploadStream.id, nombre: miniatura.originalname };
      }
  
      await publicacionesDB.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );
  
      res.json({ message: "Publicación actualizada correctamente" });
  
    } catch (err) {
      console.error("Error al actualizar publicación:", err);
      res.status(500).json({ message: "Error al actualizar publicación", error: err.message });
    }
});

app.patch("/api/publicaciones/:id/like", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await publicacionesDB.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { likes: 1 } } // Incrementa el campo "likes"
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Publicación no encontrada o sin cambios" });
        }

        res.json({ message: "Me gusta añadido correctamente" });
    } catch (err) {
        console.error("Error al dar like:", err);
        res.status(500).json({ message: "Error al procesar el like", error: err.message });
    }
});
  

app.get("/api/users/:id/foto", async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar el usuario para obtener el ID del archivo
        usersCollection.findOne({ _id: new ObjectId(id) })
            .then(user => {
                if (!user || !user.foto) {
                    return res.status(404).json({ message: "Imagen no encontrada" });
                }

                // Abrir un stream de lectura desde GridFS
                const downloadStream = bucket.openDownloadStream(user.foto);

                res.set("Content-Type", "image/jpeg"); // Ajusta el tipo si sabes el formato real
                downloadStream.pipe(res).on("error", (err) => {
                    console.error("Error al leer la imagen desde GridFS:", err);
                    res.status(500).json({ message: "Error al leer la imagen" });
                });
            })
            .catch(err => res.status(500).json({ message: "Error al procesar la imagen", error: err }));
    } catch (err) {
        res.status(500).json({ message: "Error al procesar la imagen", error: err });
    }
});

app.post("/api/categorias", async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    }

    try {
        // Verifica si ya existe una categoría con ese nombre (ignorando mayúsculas/minúsculas)
        const categoriaExistente = await categoriasCollection.findOne({ nombre: { $regex: `^${nombre}$`, $options: "i" } });

        if (categoriaExistente) {
            return res.status(400).json({ message: "La categoría ya existe" });
        }

        const nuevaCategoria = { nombre };

        const resultado = await categoriasCollection.insertOne(nuevaCategoria);

        res.status(201).json({ message: "Categoría creada", categoria: { _id: resultado.insertedId, nombre } });
    } catch (err) {
        res.status(500).json({ message: "Error al crear la categoría", error: err });
    }
});

app.get("/api/categorias", async (req, res) => {
    try {
        const categorias = await categoriasCollection.find().toArray();
        res.json(categorias);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener categorías", error: err });
    }
});

app.post("/api/comentarios", async (req, res) => {
    const { usuarioId, publicacionId, titulo, mensaje } = req.body;

    if (!usuarioId || !publicacionId || !titulo || !mensaje) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    try {
        // Verificar que el usuario existe
        const usuario = await usersCollection.findOne({ _id: new ObjectId(usuarioId) });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar que la publicación existe
        const publicacion = await publicacionesDB.findOne({ _id: new ObjectId(publicacionId) });
        if (!publicacion) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        // Crear el comentario
        const nuevoComentario = {
            usuarioId: new ObjectId(usuarioId),
            publicacionId: new ObjectId(publicacionId),
            titulo,
            mensaje,
            fecha: new Date()
        };

        const resultado = await comentariosCollection.insertOne(nuevoComentario);

        res.status(201).json({
            message: "Comentario creado",
            comentario: {
                _id: resultado.insertedId,
                ...nuevoComentario
            }
        });
    } catch (err) {
        console.error("Error al crear comentario:", err);
        res.status(500).json({ message: "Error al crear comentario", error: err.message });
    }
});

app.get("/api/publicaciones/:id/comentarios", async (req, res) => {
    const { id } = req.params;

    try {
        const comentarios = await comentariosCollection
            .find({ publicacionId: new ObjectId(id) })
            .sort({ fecha: -1 })
            .toArray();

        // Opcional: incluir datos del usuario
        const comentariosConUsuario = await Promise.all(
            comentarios.map(async (comentario) => {
                const usuario = await usersCollection.findOne(
                    { _id: comentario.usuarioId },
                    { projection: { name: 1, foto: 1 } }
                );
                return { ...comentario, usuario };
            })
        );

        res.json(comentariosConUsuario);
    } catch (err) {
        console.error("Error al obtener comentarios:", err);
        res.status(500).json({ message: "Error al obtener comentarios" });
    }
});


// BLOQUE DE BÚSQUEDAS


app.get("/api/publicaciones/:id/modelo", async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar la publicación
        const publicacion = await publicacionesDB.findOne({ _id: new ObjectId(id) });

        if (!publicacion || !publicacion.archivos || !publicacion.archivos.some(file => file.nombre.endsWith('.glb'))) {
            return res.status(404).json({ message: "Modelo no encontrado" });
        }

        // Buscar el archivo .glb relacionado
        const archivo = publicacion.archivos.find(file => file.nombre.endsWith(".glb"));

        // Buscar en GridFS por filename
        const files = await bucket.find({ filename: archivo.nombre }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ message: "Archivo no encontrado en GridFS" });
        }

        // Establecer el tipo de contenido correcto
        res.setHeader('Content-Type', 'model/gltf-binary');
        res.setHeader('Content-Disposition', `inline; filename="${archivo.nombre}"`);

        // Stream desde GridFS
        const downloadStream = bucket.openDownloadStreamByName(archivo.nombre);
        downloadStream.pipe(res).on("error", (err) => {
            console.error("Error al leer el archivo desde GridFS:", err);
            res.status(500).json({ message: "Error al leer el archivo" });
        });

    } catch (error) {
        console.error("Error al obtener el modelo 3D:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});






app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));


