'use strict'

const PORT = 5000;

const express = require("express");
const logger = require("morgan");
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");

const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: 'uploads/' });

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

// 🟢 POST: Crear usuario evitando duplicados
app.post("/api/users", (req, res) => {
    const { email, name, password } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({ message: "Faltan datos" });
    }

    // Verificar si el usuario ya existe por email o nombre
    usersCollection.findOne({ $or: [{ email }, { name }] }).then(existingUser => {
        if (existingUser) {
            return res.status(400).json({ message: "El usuario o el email ya existen" });
        }

        // Insertar usuario si no existe
        usersCollection.insertOne({ email, name, password })
            .then(user => {
                res.status(201).json({ message: "Usuario creado", user });
            })
            .catch(err => res.status(500).json({ message: "Error en el servidor", error: err }));
    }).catch(err => res.status(500).json({ message: "Error en el servidor", error: err }));
});

// 🔵 GET: Obtener todos los usuarios
app.get("/api/users", (req, res) => {
    usersCollection.find().toArray()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: "Error en el servidor", error: err }));
});

// 🔵 GET: Obtener un usuario por ID
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

// 🟡 UPDATE: Actualizar usuario parcialmente
app.put("/api/users/:id", upload.single("foto"), (req, res) => {
    const { id } = req.params;
    const updateFields = {};

    // Filtrar solo los campos que vienen en el body
    const allowedFields = ["email", "name", "password", "biografia", "web", "twitter", "instagram"];
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

// DELETE: Dar de baja usuario
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
  

// 🔐 POST: Login básico sin encriptar
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


// BLOQUE DE PUBLICACIONES

// 🔵 GET: Obtener todas las publicaciones con datos del usuario
app.get("/api/publicaciones", async (req, res) => {
    try {
        const publicaciones = await publicacionesDB.aggregate([
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
                    precio: 1,
                    categoria: 1,
                    archivoId: 1,
                    archivoNombre: 1,
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

// 🔵 GET: Obtener una publicación por ID con datos del usuario
app.get("/api/publicaciones/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const objectId = new ObjectId(id);

        const publicacion = await publicacionesDB.aggregate([
            { $match: { _id: objectId } },
            {
                $lookup: {
                    from: "users",
                    localField: "usuarioId",
                    foreignField: "_id",
                    as: "usuario"
                }
            },
            // { $unwind: "$usuario" }, // para obtener solo un usuario (no array)
            {
                $project: {
                    titulo: 1,
                    descripcion: 1,
                    precio: 1,
                    categoria: 1,
                    archivoId: 1,
                    archivoNombre: 1,
                    fecha: 1,
                    "usuario._id": 1,
                    "usuario.name": 1,
                    "usuario.email": 1
                }
            }
        ]).toArray();

        if (!publicacion || publicacion.length === 0) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        res.json(publicacion[0]);

    } catch (err) {
        console.error("❌ Error al obtener la publicación:", err);
        res.status(500).json({ message: "Error al procesar la solicitud", error: err.message });
    }
});



// POST: Crear publicación
app.post("/api/publicaciones/:idUsuario", upload.single("archivo"), async (req, res) => {
    try {
        let { titulo, descripcion, precio, categoria } = req.body;

        // Asegurar que categoria sea un array (por si solo se envía una)
        if (!Array.isArray(categoria)) {
            categoria = [categoria];
        }

        const file = req.file;
        const idUsuario = req.params.idUsuario;

        if (!titulo || !descripcion || !precio || !categoria.length || !file || !idUsuario) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        // Verificar si el usuario existe
        const usuario = await usersCollection.findOne({ _id: new ObjectId(idUsuario) });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        console.log("📥 Archivo recibido:", file.originalname);

        const filePath = file.path;
        const readStream = fs.createReadStream(filePath);

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(file.originalname);
            readStream.pipe(uploadStream)
                .on("error", reject)
                .on("finish", () => resolve(uploadStream));
        });

        fs.unlinkSync(filePath);
        console.log("✅ Archivo subido a GridFS");

        const nuevaPublicacion = {
            usuarioId: idUsuario, // ID del usuario que publica
            titulo,
            descripcion,
            precio: parseFloat(precio),
            categoria,
            archivoId: uploadResult.id,
            archivoNombre: file.originalname,
            fecha: new Date()
        };

        const insertResult = await publicacionesDB.insertOne(nuevaPublicacion);

        console.log("📝 Publicación guardada correctamente");

        res.status(201).json({
            message: "Publicación creada",
            publicacion: {
                _id: insertResult.insertedId,
                ...nuevaPublicacion
            }
        });

    } catch (err) {
        console.error("❌ Error en publicación:", err);
        res.status(500).json({ message: "Error al procesar la publicación", error: err.message });
    }
});

// Endpoint para obtener la imagen del perfil desde GridFS
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


// BLOQUE DE CATEGORIAS

// 🟢 POST: Crear una categoría
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

// 🔵 GET: Obtener todas las categorías
app.get("/api/categorias", async (req, res) => {
    try {
        const categorias = await categoriasCollection.find().toArray();
        res.json(categorias);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener categorías", error: err });
    }
});

// BLOQUE DE COMENTARIOS

// 🟢 POST: Crear un comentario sobre una publicación
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
        console.error("❌ Error al crear comentario:", err);
        res.status(500).json({ message: "Error al crear comentario", error: err.message });
    }
});



app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
