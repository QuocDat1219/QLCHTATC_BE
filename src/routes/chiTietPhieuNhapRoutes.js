const express = require("express");
const router = express.Router();
const {
  getAllChiTietPhieuNhap,
  getChiTietPhieuNhapById,
  createChiTietPhieuNhap,
  updateChiTietPhieuNhap,
  deleteChiTietPhieuNhap,
  getChiTietPhieuNhapByDetail,
} = require("../controller/chiTietPhieuNhapController");

router.get("/detail", getChiTietPhieuNhapByDetail);
router.get("/", getAllChiTietPhieuNhap);
router.get("/:id", getChiTietPhieuNhapById);
router.post("/", createChiTietPhieuNhap);
router.put("/", updateChiTietPhieuNhap);
router.delete("/delete", deleteChiTietPhieuNhap);

module.exports = router;
