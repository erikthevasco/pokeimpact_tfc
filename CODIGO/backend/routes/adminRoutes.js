import express from "express";
import db from "../db.js";

const router = express.Router();

// Middleware para verificar que es admin
const requireAdmin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "No autorizado - debe iniciar sesión" });
    }
    if (req.session.username !== 'admin') {
        return res.status(403).json({ message: "Acceso denegado - requiere privilegios de administrador" });
    }
    next();
};

// Obtener estadísticas del dashboard
router.get("/stats", requireAdmin, (req, res) => {

    const stats = {};

    // Total usuarios
    db.query("SELECT COUNT(*) as total FROM users", (err, result) => {
        if (err) return res.status(500).json({ message: "Error obteniendo usuarios" });
        stats.totalUsers = result[0].total;

        // Total pokemon en PC
        db.query("SELECT COUNT(*) as total FROM pokemon_pc", (err, result) => {
            if (err) return res.status(500).json({ message: "Error obteniendo PCs" });
            stats.totalPC = result[0].total;

            // Total en equipos
            db.query("SELECT COUNT(*) as total FROM pokemon_team", (err, result) => {
                if (err) return res.status(500).json({ message: "Error obteniendo equipos" });
                stats.totalTeams = result[0].total;
                res.json(stats);
            });
        });
    });
});

// Obtener todos los usuarios con conteos de Pokémon
router.get("/users", requireAdmin, (req, res) => {
    // Primero obtenemos los usuarios
    db.query("SELECT id, username, email FROM users ORDER BY id DESC", (err, users) => {
        if (err) {
            console.error("Error obteniendo usuarios:", err);
            return res.status(500).json({ message: "Error obteniendo usuarios" });
        }

        // Para cada usuario, contamos sus pokemons
        const promises = users.map(user => {
            return new Promise((resolve) => {
                db.query("SELECT COUNT(*) as pc_count FROM pokemon_pc WHERE user_id = ?", [user.id], (err, pcResult) => {
                    const pcCount = err ? 0 : pcResult[0].pc_count;

                    db.query("SELECT COUNT(*) as team_count FROM pokemon_team WHERE user_id = ?", [user.id], (err, teamResult) => {
                        const teamCount = err ? 0 : teamResult[0].team_count;

                        resolve({
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            pokemon_pc_count: pcCount,
                            pokemon_team_count: teamCount
                        });
                    });
                });
            });
        });

        Promise.all(promises).then(results => {
            res.json(results);
        });
    });
});

// Obtener todos los Pokémon en PCs con info de usuarios
router.get("/pcs", requireAdmin, (req, res) => {
    const query = `
        SELECT 
            pc.id,
            pc.user_id,
            u.username,
            pc.pokemon_name,
            pc.pokemon_id,
            pc.sprite_url,
            pc.box_number,
            pc.is_shiny,
            pc.created_at
        FROM pokemon_pc pc
        INNER JOIN users u ON pc.user_id = u.id
        ORDER BY pc.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error obteniendo PCs:", err);
            return res.status(500).json({ message: "Error obteniendo PCs" });
        }
        res.json(results);
    });
});

// Obtener todos los Pokémon en equipos con info de usuarios
router.get("/teams", requireAdmin, (req, res) => {
    const query = `
        SELECT 
            pt.id,
            pt.user_id,
            u.username,
            pt.pokemon_name,
            pt.pokemon_id,
            pt.sprite_url,
            pt.position,
            pt.is_shiny,
            pt.created_at
        FROM pokemon_team pt
        INNER JOIN users u ON pt.user_id = u.id
        ORDER BY u.username, pt.position
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error obteniendo equipos:", err);
            return res.status(500).json({ message: "Error obteniendo equipos" });
        }
        res.json(results);
    });
});

// Eliminar usuario
router.delete("/users/:id", requireAdmin, (req, res) => {
    const userId = req.params.id;

    db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
        if (err) {
            console.error("Error eliminando usuario:", err);
            return res.status(500).json({ message: "Error eliminando usuario" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario eliminado correctamente" });
    });
});

// Eliminar Pokémon de PC
router.delete("/pcs/:id", requireAdmin, (req, res) => {
    const pcId = req.params.id;

    db.query("DELETE FROM pokemon_pc WHERE id = ?", [pcId], (err, result) => {
        if (err) {
            console.error("Error eliminando Pokémon de PC:", err);
            return res.status(500).json({ message: "Error eliminando Pokémon" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pokémon no encontrado" });
        }

        res.json({ message: "Pokémon eliminado correctamente" });
    });
});

// Eliminar Pokémon de equipo
router.delete("/teams/:id", requireAdmin, (req, res) => {
    const teamId = req.params.id;

    db.query("DELETE FROM pokemon_team WHERE id = ?", [teamId], (err, result) => {
        if (err) {
            console.error("Error eliminando Pokémon de equipo:", err);
            return res.status(500).json({ message: "Error eliminando Pokémon" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pokémon no encontrado" });
        }

        res.json({ message: "Pokémon eliminado correctamente" });
    });
});

export default router;