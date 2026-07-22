const express = require("express");

const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/users", require("./users"));
router.use("/usercontent", require("./items"));

module.exports = router;