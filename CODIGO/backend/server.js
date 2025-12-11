import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import pcRoutes from "./routes/pcRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import db from "./db.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const PORT = 5000;

// Necesario para rutas absolutas en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
//  SESSION STORE MySQL
// =========================
const MySQLStoreModule = await import("express-mysql-session");
const MySQLStore = MySQLStoreModule.default(session);

const sessionStore = new MySQLStore(
    {
        expiration: 1000 * 60 * 60 * 2,
        createDatabaseTable: true,
    },
    db.promise()
);

// =========================
//  MIDDLEWARES BÁSICOS
// =========================
app.use(express.json());
app.use(cookieParser());

// =========================
//  SERVIR FRONTEND ESTÁTICO (ANTES DE SESSION)
// =========================
// La carpeta public está un nivel arriba (en CODIGO, no en backend)
app.use(express.static(path.join(__dirname, "..", "public")));

// =========================
//  SESSION MIDDLEWARE
// =========================
app.use(
    session({
        key: "pokeimpact_session",
        secret: "PokeImpactSecretKey",
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,     // Ok en localhost (HTTP)
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 2,
        },
    })
);

// =========================
//  RUTAS API
// =========================
app.use("/api/users", userRoutes);
app.use("/api/pc", pcRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/admin", adminRoutes);

// =========================
//  FALLBACK SPA
// =========================
// Esto debe ir AL FINAL, después de archivos estáticos y rutas API
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// =========================
//  INICIO DEL SERVIDOR
// =========================
app.listen(PORT, () => {
    console.log(`🚀 Servidor PokéImpact corriendo en http://localhost:${PORT}`);
});