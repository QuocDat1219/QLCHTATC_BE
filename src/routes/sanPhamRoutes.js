const express = require("express");
const router = express.Router();
const {
  getAllSanPham,
  getSanPhamById,
  createSanPham,
  updateSanPham,
  deleteSanPham,
} = require("../controller/sanPhamController");

router.get("/", getAllSanPham);
router.get("/:id", getSanPhamById);
router.post("/", createSanPham);
router.put("/", updateSanPham);
router.delete("/:id", deleteSanPham);

module.exports = router;
