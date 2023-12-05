const express = require("express");
const router = express.Router();
const {
  getAllDanhMuc,
  getDanhMucById,
  createDanhMuc,
  updateDanhMuc,
  deleteDanhMuc,
} = require("../controller/danhMucController");

router.get("/", getAllDanhMuc);
router.get("/:id", getDanhMucById);
router.post("/", createDanhMuc);
router.put("/", updateDanhMuc);
router.delete("/:id", deleteDanhMuc);

module.exports = router;
