
import db from "./db.js";

console.log("Testing DB Connection...");

try {
    const query = "SELECT * FROM users WHERE email = 'test@example.com'";
    db.query(query, (err, rows) => {
        if (err) {
            console.error("❌ DB Error:", err);
            process.exit(1);
        }
        console.log("✅ DB Connected! Solution:", rows[0].solution);

        // Check if users table exists
        db.query("DESCRIBE users", (err, rows) => {
            if (err) {
                console.error("❌ Error describing users table:", err);
            } else {
                console.log("✅ Users table exists. Columns:", rows.map(c => c.Field).join(", "));
            }
            process.exit(0);
        });
    });
} catch (e) {
    console.error("❌ Exception:", e);
}
