import mysql from "mysql2";

const db = mysql.createPool({
    host: "localhost",
    user: "root",       // tu usuario MySQL
    password: "",       // tu contraseña si la tienes
    database: "pokeimpact_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Pool no requiere .connect(), maneja conexiones automáticamente.
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Error conectando al pool de MySQL:", err);
    } else {
        console.log("✅ Conectado al pool de MySQL");
        connection.release();
    }
});

export default db;
