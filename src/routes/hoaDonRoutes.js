const express = require("express");
const router = express.Router();
const {
  getAllHoaDon,
  getHoaDonById,
  createHoaDon,
  updateHoaDon,
  deleteHoaDon,
} = require("../controller/hoaDonController");

router.get("/", getAllHoaDon);
router.get("/:id", getHoaDonById);
router.post("/", createHoaDon);
router.put("/", updateHoaDon);
router.delete("/:id", deleteHoaDon);

module.exports = router;
