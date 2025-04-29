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

// 🟢 POST: Crear usuario evitando duplicados
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
                    categoria: 1,
                    archivos: 1, // Incluye el array de archivos [{ id, nombre }]
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
                    categoria: 1,
                    archivos: 1, // Incluye el array de archivos [{ id, nombre }]
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



// Reemplaza upload.single(...) por upload.array(...)
app.post("/api/publicaciones/:idUsuario", upload.array("archivo", 10), async (req, res) => {
    try {
        let { titulo, descripcion, categoria } = req.body;
        if (!Array.isArray(categoria)) categoria = [categoria];

        const files = req.files;    // ahora es array
        const idUsuario = req.params.idUsuario;
        if (!titulo || !descripcion || !categoria.length || !files.length || !idUsuario) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        const usuario = await usersCollection.findOne({ _id: new ObjectId(idUsuario) });
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

        // Subir cada fichero a GridFS
        const archivoIds = [];
        for (const file of files) {
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

        const nuevaPublicacion = {
            usuarioId: idUsuario,
            titulo,
            descripcion,
            categoria,
            archivos: archivoIds,
            fecha: new Date()
        };

        const insertResult = await publicacionesDB.insertOne(nuevaPublicacion);
        res.status(201).json({
            message: "Publicación creada",
            publicacion: { _id: insertResult.insertedId, ...nuevaPublicacion }
        });

    } catch (err) {
        console.error("❌ Error en publicación:", err);
        res.status(500).json({ message: "Error al procesar la publicación", error: err.message });
    }
}
);

// 🟡 PUT: Editar publicación (reemplazar completamente los archivos)
app.put("/api/publicaciones/:id", upload.array("archivo", 10), async (req, res) => {
    console.log("Archivos recibidos:", req.files);
    try {
        const { id } = req.params;
        let { titulo, descripcion, categoria } = req.body;
        if (!Array.isArray(categoria)) categoria = [categoria];

        // Buscar la publicación original
        const publicacion = await publicacionesDB.findOne({ _id: new ObjectId(id) });
        if (!publicacion) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        const updateFields = {};
        if (titulo) updateFields.titulo = titulo;
        if (descripcion) updateFields.descripcion = descripcion;
        if (categoria) updateFields.categoria = categoria;

        // Vaciamos los archivos actuales en la base de datos
        updateFields.archivos = [];

        // Subir los archivos nuevos
        if (req.files && req.files.length > 0) {
            const nuevosArchivos = [];

            for (const file of req.files) {
                const readStream = fs.createReadStream(file.path);
                const uploadStream = bucket.openUploadStream(file.originalname);
                await new Promise((resolve, reject) => {
                    readStream.pipe(uploadStream)
                        .on("error", reject)
                        .on("finish", () => resolve());
                });

                nuevosArchivos.push({ id: uploadStream.id, nombre: file.originalname });
                fs.unlinkSync(file.path);  // Eliminar el archivo temporal después de subirlo
            }

            // Reemplazamos los archivos en la base de datos con los nuevos
            updateFields.archivos = nuevosArchivos;
        }

        // Actualizamos la publicación con los nuevos campos, incluidos los archivos
        await publicacionesDB.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        res.json({ message: "Publicación actualizada correctamente" });
    } catch (err) {
        console.error("❌ Error al actualizar publicación:", err);
        res.status(500).json({ message: "Error al actualizar publicación", error: err.message });
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


