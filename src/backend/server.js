const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '.env') });

const cookieParser = require("cookie-parser");
const cors = require('cors');
const express = require('express');
const helmet = require("helmet");
const http = require('http');
const rateLimit = require("express-rate-limit");

const Env = require('./config/env');
const { initDatabase } = require('./db/postgres_pool');

if (Env.PRODUCTION === "0") { require("dotenv").config({ path: path.join(__dirname, ".env") }); }

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(cors({
    origin: Env.PRODUCTION !== "1"
        ? ["http://localhost:5173", Env.FRONTEND_URL]
        : [Env.FRONTEND_URL],
    credentials: true
}));
app.use(express.json());
app.set('trust proxy', 1);

const routes = require("./routes");
app.use("/api", routes);
app.use("/api", (req, res) => {
    res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
});
app.use(express.static(path.join(__dirname, '../../dist')));
app.get('/*splat', (_, res) => { res.sendFile(path.join(__dirname, '../../dist/index.html')); });
app.use((err, _, res, __) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || "Internal server error."
    });
});

const server = http.createServer(app);

(async () => {
    try {
        await initDatabase();
    } catch (err) {
        console.error("Failed to initialize database:", err);
        process.exit(1);
    }
})();

server.listen(Env.PORT, '0.0.0.0', () => {});