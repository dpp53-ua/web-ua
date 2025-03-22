'use strict'

const PORT = 5000;

const express = require("express");
const logger = require("morgan");
const mongojs = require("mongojs");
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


app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
