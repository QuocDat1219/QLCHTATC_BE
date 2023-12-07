const express = require("express");
const router = express.Router();

const {
  migrateData,
  deleteAllTableInOtherSite,
} = require("../controller/phanTanController");

router.post("/", migrateData);
router.delete("/drop", deleteAllTableInOtherSite);

module.exports = router;
