const express = require("express");
const router = express.Router();
const {
  getAllTinh,
  getTinhById,
  createTinh,
  updateTinh,
  deleteTinh,
} = require("../controller/tinhController");

router.get("/", getAllTinh);
router.get("/:id", getTinhById);
router.post("/", createTinh);
router.put("/", updateTinh);
router.delete("/:id", deleteTinh);

module.exports = router;
