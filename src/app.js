const express = require("express");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Login API is running");
});

app.use("/api/auth", authRoutes);

module.exports = app;