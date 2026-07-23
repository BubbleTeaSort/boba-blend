const path = require("path");
//require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const http = require('http');
const cors = require('cors');

const Env = require('./config/env');
const { initDatabase } = require('./db/postgres_pool');

const app = express();
app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);

const routes = require("./routes");
app.use("/api", routes);
app.use(express.static(path.join(__dirname, "../../public")));
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