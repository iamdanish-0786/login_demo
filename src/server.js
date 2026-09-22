require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await pool.query("SELECT 1");

        console.log("MySQL connection successful");

        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MySQL connection failed:");
        console.error(error);
        process.exit(1);
    }
}

startServer();