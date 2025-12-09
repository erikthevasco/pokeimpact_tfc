import express from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";

const router = express.Router();

// Registrar usuario
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ message: "Campos vacíos" });

        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
            if (err) {
                console.error("❌ Error en SELECT users (register):", err);
                return res.status(500).json({ message: "Error de servidor" });
            }
            if (result.length > 0) return res.status(400).json({ message: "El usuario ya existe" });

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                [username, email, hashedPassword],
                (err, insertResult) => {
                    if (err) {
                        console.error("❌ Error en INSERT users:", err);
                        return res.status(500).json({ message: "Error al registrar usuario" });
                    }

                    req.session.userId = insertResult.insertId;
                    req.session.username = username;

                    res.status(201).json({ message: "Usuario registrado con éxito", username });
                }
            );
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el registro" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        db.query("SELECT * FROM users WHERE username = ?", [username], async (err, result) => {
            if (err) {
                console.error("❌ Error en SELECT users (login):", err);
                return res.status(500).json({ message: "Error de servidor" });
            }
            if (result.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

            const user = result[0];
            console.log("🔍 Usuario encontrado:", user); // DEBUG

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

            req.session.userId = user.id;
            req.session.username = user.username;

            console.log("💾 Sesión guardada:", { userId: req.session.userId, username: req.session.username }); // DEBUG

            res.status(200).json({
                message: "Inicio de sesión exitoso",
                username: user.username,
                debug: {
                    userId: user.id,
                    userKeys: Object.keys(user)
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el inicio de sesión" });
    }
});

// Logout
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: "Error al cerrar sesión" });
        res.clearCookie("pokeimpact_session");
        res.json({ message: "Sesión cerrada correctamente" });
    });
});

// Comprobar usuario logueado
router.get("/me", (req, res) => {
    if (req.session.username) {
        res.json({
            username: req.session.username,
            userId: req.session.userId
        });
    } else {
        res.status(401).json({ message: "No autorizado" });
    }
});

export default router;
