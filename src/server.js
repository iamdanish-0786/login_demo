require("dotenv").config();

const app = require("./app");
const mysql = require("mysql2/promise");

const PORT = process.env.PORT || 3000;

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function startServer() {
    try {
        const connection = await db.getConnection();

        await connection.query("SELECT 1");

        connection.release();

        console.log("MySQL connection successful");

        app.locals.db = db;

        app.listen(PORT, () => {
            console.log(`Server running on port http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("MySQL connection failed:");
        console.error(error);

        process.exit(1);
    }
}

startServer();