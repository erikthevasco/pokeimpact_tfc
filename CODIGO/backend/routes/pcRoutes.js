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
// OBTENER TODOS LOS POKÉMON DEL PC DEL USUARIO
// ===============================
router.get("/", requireAuth, (req, res) => {
    const userId = req.session.userId;

    db.query(
        "SELECT * FROM pokemon_pc WHERE user_id = ? ORDER BY box_number, position_in_box",
        [userId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error al obtener pokémon" });
            }
            res.json(results);
        }
    );
});

// ===============================
// AGREGAR UN POKÉMON AL PC
// ===============================
router.post("/", requireAuth, (req, res) => {
    const userId = req.session.userId;
    const { pokemon_id, pokemon_name, sprite_url, box_number = 1, is_shiny = false } = req.body;

    if (!pokemon_id || !pokemon_name) {
        return res.status(400).json({ message: "Faltan datos del pokémon" });
    }

    // Obtener la siguiente posición disponible en la caja
    db.query(
        "SELECT COALESCE(MAX(position_in_box), -1) + 1 AS next_position FROM pokemon_pc WHERE user_id = ? AND box_number = ?",
        [userId, box_number],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error al calcular posición" });
            }

            const position = result[0].next_position;

            // Insertar el pokémon
            db.query(
                "INSERT INTO pokemon_pc (user_id, pokemon_id, pokemon_name, sprite_url, box_number, position_in_box, is_shiny) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [userId, pokemon_id, pokemon_name, sprite_url, box_number, position, is_shiny],
                (err, insertResult) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: "Error al agregar pokémon" });
                    }

                    res.status(201).json({
                        message: "Pokémon agregado al PC",
                        pokemon: {
                            id: insertResult.insertId,
                            pokemon_id,
                            pokemon_name,
                            sprite_url,
                            box_number,
                            position_in_box: position,
                            is_shiny
                        }
                    });
                }
            );
        }
    );
});

// ===============================
// ELIMINAR UN POKÉMON DEL PC
// ===============================
router.delete("/:id", requireAuth, (req, res) => {
    const userId = req.session.userId;
    const pokemonId = req.params.id;

    db.query(
        "DELETE FROM pokemon_pc WHERE id = ? AND user_id = ?",
        [pokemonId, userId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error al eliminar pokémon" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Pokémon no encontrado" });
            }

            res.json({ message: "Pokémon liberado del PC" });
        }
    );
});

// ===============================
// MOVER POKÉMON A OTRA CAJA/POSICIÓN
// ===============================
router.put("/:id/move", requireAuth, (req, res) => {
    const userId = req.session.userId;
    const pokemonId = req.params.id;
    const { box_number, position_in_box } = req.body;

    if (box_number === undefined || position_in_box === undefined) {
        return res.status(400).json({ message: "Faltan datos de destino" });
    }

    db.query(
        "UPDATE pokemon_pc SET box_number = ?, position_in_box = ? WHERE id = ? AND user_id = ?",
        [box_number, position_in_box, pokemonId, userId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error al mover pokémon" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Pokémon no encontrado" });
            }

            res.json({ message: "Pokémon movido exitosamente" });
        }
    );
});

// ===============================
// OBTENER POKÉMON DE UNA CAJA ESPECÍFICA
// ===============================
router.get("/box/:boxNumber", requireAuth, (req, res) => {
    const userId = req.session.userId;
    const boxNumber = req.params.boxNumber;

    db.query(
        "SELECT * FROM pokemon_pc WHERE user_id = ? AND box_number = ? ORDER BY position_in_box",
        [userId, boxNumber],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error al obtener pokémon de la caja" });
            }
            res.json(results);
        }
    );
});

export default router;
