'use strict'

const PORT = 5000;

const express = require("express");
const logger = require("morgan");
const mongojs = require("mongojs");

const multer = require("multer");
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");
const fs = require("fs");

const upload = multer({ dest: 'uploads/' });

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017");
let bucket;
let publicacionesDB;

mongoClient.connect().then(client => {
    const database = client.db("miBaseDeDatos");
    bucket = new GridFSBucket(database, { bucketName: "archivos" });
    publicacionesDB = database.collection("publicaciones");
}).catch(console.error);

const cors = require("cors");






const app = express();
const db = mongojs("miBaseDeDatos", ["users"]); // Conectar a MongoDB y usar la colección "users"

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
    db.users.findOne({ $or: [{ email }, { name }] }, (err, existingUser) => {
        if (err) return res.status(500).json({ message: "Error en el servidor", error: err });
        if (existingUser) return res.status(400).json({ message: "El usuario o el email ya existen" });

        // Insertar usuario si no existe
        db.users.insert({ email, name, password }, (err, user) => {
            if (err) return res.status(500).json({ message: "Error en el servidor", error: err });
            res.status(201).json({ message: "Usuario creado", user });
        });
    });
});

// 🔵 GET: Obtener todos los usuarios
app.get("/api/users", (req, res) => {
    db.users.find((err, users) => {
        if (err) return res.status(500).json({ message: "Error en el servidor", error: err });
        res.json(users);
    });
});


// 🟡 UPDATE: Actualizar usuario parcialmente
app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const updateFields = {};

    // Filtrar solo los campos que vienen en el body
    const allowedFields = ["email", "name", "password", "biografia", "web", "twitter", "instagram", "foto"];
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updateFields[field] = req.body[field];
        }
    });

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No hay campos para actualizar" });
    }

    // Verificar si el nuevo email o nombre ya existen en otro usuario
    db.users.findOne(
        {
            $or: [{ email: updateFields.email }, { name: updateFields.name }],
            _id: { $ne: mongojs.ObjectId(id) } // Excluir al usuario actual de la búsqueda
        },
        (err, existingUser) => {
            if (err) return res.status(500).json({ message: "Error en el servidor", error: err });
            if (existingUser) return res.status(400).json({ message: "El usuario o el email ya existen" });

            // Actualizar el usuario
            db.users.update(
                { _id: mongojs.ObjectId(id) },
                { $set: updateFields },
                (err, user) => {
                    if (err) return res.status(500).json({ message: "Error en el servidor", error: err });
                    res.json({ message: "Usuario actualizado", user });
                }
            );
        }
    );
});




// 🔐 POST: Login básico sin encriptar
app.post("/api/login", (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: "Faltan nombre de usuario o contraseña" });
    }

    // Buscar usuario por nombre
    db.users.findOne({ name }, (err, user) => {
        if (err) return res.status(500).json({ message: "Error en el servidor", error: err });

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
    });
});

app.post("/api/publicacion/:idUsuario", upload.single("archivo"), async (req, res) => {
    try {
        const { titulo, descripcion, precio, categoria } = req.body;
        const file = req.file;
        const idUsuario = req.params.idUsuario;

        if (!titulo || !descripcion || !precio || !categoria || !file || !idUsuario) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        // Verificar si el usuario existe
        const usuario = await new Promise((resolve, reject) => {
            db.users.findOne({ _id: mongojs.ObjectId(idUsuario) }, (err, doc) => {
                if (err) return reject(err);
                resolve(doc);
            });
        });

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






app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
