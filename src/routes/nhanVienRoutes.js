const express = require("express");
const router = express.Router();
const {
  getAllNhanVien,
  getNhanVienById,
  createNhanVien,
  updateNhanVien,
  deleteNhanVien,
  nhanVienLogin,
} = require("../controller/nhanVienController");

router.get("/", getAllNhanVien);
router.get("/:id", getNhanVienById);
router.post("/", createNhanVien);
router.post("/login", nhanVienLogin);
router.put("/", updateNhanVien);
router.delete("/:id", deleteNhanVien);

module.exports = router;
