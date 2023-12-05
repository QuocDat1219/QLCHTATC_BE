const express = require("express");
const router = express.Router();
const {
  getAllChiTietHoaDon,
  getChiTietHoaDonById,
  createChiTietHoaDon,
  updateChiTietHoaDon,
  deleteChiTietHoaDon,
  getChiTietHoaDonByDetail,
} = require("../controller/chiTietHoaDonController");

router.get("/detail", getChiTietHoaDonByDetail);
router.get("/", getAllChiTietHoaDon);
router.get("/:id", getChiTietHoaDonById);
router.post("/", createChiTietHoaDon);
router.put("/", updateChiTietHoaDon);
router.delete("/delete", deleteChiTietHoaDon);

module.exports = router;
