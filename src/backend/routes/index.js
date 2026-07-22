const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../docs/swagger");

const router = express.Router();

router.get("/openapi.json", (_, res) => { res.json(swaggerDocs); });
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
router.use("/health", require("./health"));
router.use("/v1", require("./v1"));

module.exports = router;