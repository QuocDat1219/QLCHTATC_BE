const express = require("express");
const router = express.Router();
const {
  getAllChiNhanh,
  getChiNhanhById,
  createChiNhanh,
  updateChiNhanh,
  deleteChiNhanh,
} = require("../controller/chiNhanhController");

router.get("/", getAllChiNhanh);
router.get("/:id", getChiNhanhById);
router.post("/", createChiNhanh);
router.put("/", updateChiNhanh);
router.delete("/:id", deleteChiNhanh);

module.exports = router;
