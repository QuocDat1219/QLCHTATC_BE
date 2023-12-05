const express = require("express");
const router = express.Router();
const {
  getAllNhaCungCap,
  getNhaCungCapById,
  createNhaCungCap,
  updateNhaCungCap,
  deleteNhaCungCap,
} = require("../controller/nhaCungCapController");

router.get("/", getAllNhaCungCap);
router.get("/:id", getNhaCungCapById);
router.post("/", createNhaCungCap);
router.put("/", updateNhaCungCap);
router.delete("/:id", deleteNhaCungCap);

module.exports = router;
