const express = require("express");
const router = express.Router();
const {
  getAllLoaiKhachHang,
  getLoaiKhachHangById,
  createLoaiKhachHang,
  updateLoaiKhachHang,
  deleteLoaiKhachHang,
} = require("../controller/loaiKhachHangController");

router.get("/", getAllLoaiKhachHang);
router.get("/:id", getLoaiKhachHangById);
router.post("/", createLoaiKhachHang);
router.put("/", updateLoaiKhachHang);
router.delete("/:id", deleteLoaiKhachHang);

module.exports = router;
