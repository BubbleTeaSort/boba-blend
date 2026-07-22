const express = require('express');
const path = require("path");

const Env = require('./config/env');
const { initDatabase } = require('./db/postgresPool');

const app = express();
app.use(express.json());
app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname, "../../public")));

const server = http.createServer(app);

(async () => {
    try {
        await initDatabase();
    } catch (err) {
        console.error("Failed to initialize database:", err);
        process.exit(1);
    }
})();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Service health check
 *     responses:
 *       '200':
 *         description: Service is healthy
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: OK
 */
app.get('/health', (_, res) => {
    res.status(200).send('OK');
});

server.listen(Env.PORT, '0.0.0.0', () => {});