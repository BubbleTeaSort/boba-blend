const express = require("express");

const router = express.Router();

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
router.get("/", (_, res) => {
    res.status(200).send("OK");
});

module.exports = router;