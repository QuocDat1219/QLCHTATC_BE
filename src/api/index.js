require("dotenv").config();
const { connectSQL } = require("../config/connectSqlserver");
const { connectMysql } = require("../config/connectMysql");
const { connectOracle } = require("../config/connectOracle");
const { connectPostgres } = require("../config/connectPostgresql");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

connectSQL();
connectMysql();
connectOracle();
connectPostgres();

const phanTanRoutes = require("../routes/phanTanRoutes");
const tinhRoutes = require("../routes/tinhRoutes");
const chiNhanhRoutes = require("../routes/chiNhanhRoutes");
const khoRoutes = require("../routes/khoRoutes");
const danhMucRoutes = require("../routes/danhMucRoutes");
const thuongHieuRoutes = require("../routes/thuongHieuRoutes");
const sanPhamRoutes = require("../routes/sanPhamRoutes");
const nhaCungCapRoutes = require("../routes/nhaCungCapRoutes");
const phieuNhapRoutes = require("../routes/phieuNhapRoutes");
const chiTietPhieuNhapRoutes = require("../routes/chiTietPhieuNhapRoutes");

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use("/api/phantan", phanTanRoutes);
app.use("/api/tinh", tinhRoutes);
app.use("/api/chinhanh", chiNhanhRoutes);
app.use("/api/kho", khoRoutes);
app.use("/api/danhmuc", danhMucRoutes);
app.use("/api/thuonghieu", thuongHieuRoutes);
app.use("/api/sanpham", sanPhamRoutes);
app.use("/api/nhacungcap", nhaCungCapRoutes);
app.use("/api/phieunhap", phieuNhapRoutes);
app.use("/api/chitietphieunhap", chiTietPhieuNhapRoutes);

app.use((req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).send({ message: err, message });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
