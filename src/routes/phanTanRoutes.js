const express = require("express");
const router = express.Router();

const { migrateData } = require("../controller/phanTanController");

router.post("/", migrateData);

module.exports = router;
