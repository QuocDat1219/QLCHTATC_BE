const express = require("express");
const router = express.Router();
const {
  getAllTaiKhoan,
  getTaiKhoanById,
  createTaiKhoan,
  updateTaiKhoan,
  deleteTaiKhoan,
} = require("../controller/taiKhoanController");

router.get("/", getAllTaiKhoan);
router.get("/:id", getTaiKhoanById);
router.post("/", createTaiKhoan);
router.put("/", updateTaiKhoan);
router.delete("/:id", deleteTaiKhoan);

module.exports = router;
