import express from "express";
import db from "../db.js";

const router = express.Router();

// Middleware para verificar autenticación
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "No autorizado" });
    }
    next();
};

// ===============================
// OBTENER TODO EL EQUIPO DEL USUARIO
// ===============================
router.get("/", requireAuth, (req, res) => {
    const userId = req.session.userId;

    db.query(
        "SELECT * FROM pokemon_team WHERE user_id = ? ORDER BY position",
        [userId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error al obtener equipo" });
            }
            res.json(results);
        }
    );
});

// ===============================
// AGREGAR UN POKÉMON AL EQUIPO
// ===============================
router.post("/", requireAuth, (req, res) => {
    const userId = req.session.userId;
    const { pokemon_id, pokemon_name, sprite_url, position, is_shiny = false } = req.body;

    if (!pokemon_id || !pokemon_name || position === undefined) {
        return res.status(400).json({ message: "Faltan datos del pokémon" });
    }

    // Verificar que la posición esté entre 0 y 5
    if (position < 0 || position > 5) {
        return res.status(400).json({ message: "Posición inválida (0-5)" });
    }

    // Verificar si ya hay un Pokémon en esa posición
    db.query(
        "SELECT * FROM pokemon_team WHERE user_id = ? AND position = ?",
        [userId, position],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error al verificar posición" });
            }

            if (result.length > 0) {
                return res.status(400).json({ message: "Ya hay un Pokémon en esa posición" });
            }

            // Insertar el pokémon en el equipo
            db.query(
                "INSERT INTO pokemon_team (user_id, pokemon_id, pokemon_name, sprite_url, position, is_shiny) VALUES (?, ?, ?, ?, ?, ?)",
                [userId, pokemon_id, pokemon_name, sprite_url, position, is_shiny],
                (err, insertResult) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: "Error al agregar pokémon al equipo" });
                    }

                    res.status(201).json({
                        message: "Pokémon agregado al equipo",
                        pokemon: {
                            id: insertResult.insertId,
                            pokemon_id,
                            pokemon_name,
                            sprite_url,
                            position,
                            is_shiny
                        }
                    });
                }
            );
        }
    );
});

// ===============================
// ELIMINAR UN POKÉMON DEL EQUIPO
// ===============================
router.delete("/:id", requireAuth, (req, res) => {
    const userId = req.session.userId;
    const pokemonId = req.params.id;

    db.query(
        "DELETE FROM pokemon_team WHERE id = ? AND user_id = ?",
        [pokemonId, userId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error al eliminar pokémon" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Pokémon no encontrado en el equipo" });
            }

            res.json({ message: "Pokémon removido del equipo" });
        }
    );
});

// ===============================
// ACTUALIZAR NOMBRE DE POKÉMON EN EL EQUIPO
// ===============================
router.put("/:id", requireAuth, (req, res) => {
    const userId = req.session.userId;
    const pokemonId = req.params.id;
    const { pokemon_name } = req.body;

    if (!pokemon_name) {
        return res.status(400).json({ message: "Falta el nombre del pokémon" });
    }

    db.query(
        "UPDATE pokemon_team SET pokemon_name = ? WHERE id = ? AND user_id = ?",
        [pokemon_name, pokemonId, userId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error al actualizar nombre" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Pokémon no encontrado" });
            }

            res.json({ message: "Nombre actualizado correctamente" });
        }
    );
});

export default router;