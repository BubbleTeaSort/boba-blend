const express = require('express');
const http = require('http');
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const Env = require('./config/env');
const swaggerDocs = require("./docs/swagger");
const { initDatabase } = require('./db/postgres_pool');

const app = express();
app.use(express.json());
app.set('trust proxy', 1);

const routes = require("./routes");
app.use("/api", routes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.static(path.join(__dirname, "../../public")));
app.get("/openapi.json", (req, res) => {res.json(swaggerDocs);});

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