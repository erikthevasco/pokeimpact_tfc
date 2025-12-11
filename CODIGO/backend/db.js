import mysql from "mysql2";

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "pokeimpact_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Error conectando al pool de MySQL:", err);
    } else {
        console.log("✅ Conectado al pool de MySQL");
        connection.release();
    }
});

export default db;
