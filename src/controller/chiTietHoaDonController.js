const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllChiTietHoaDon = async (req, res) => {
  try {
    const sqlQuery = `select ct.MaHoaDon as MaHoaDon, TenKhachHang, TenSanPham, GiaSanPham, SoLuong, SoLuong * GiaSanPham as ThanhTien, TenNhanVien, TenChiNhanh, NgayLap from CHITIETHOADON ct 
    inner join HOADON hd on hd.MaHoaDon = ct.MaHoaDon
    inner join KHACHHANG kh on kh.MaKhachHang = hd.MaKhachHang
    inner join NHANVIEN nv on nv.MaNhanVien = hd.MaNhanVien
    inner join CHINHANH cn on cn.MaChiNhanh = hd.MaChiNhanh
    inner join SANPHAM sp on sp.MaSanPham = ct.MaSanPham`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getChiTietHoaDonById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM ChiTietHoaDon WHERE MaHoaDon = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy chi tiết hóa đơn!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const getChiTietHoaDonByDetail = async (req, res) => {
  const MaHoaDon = req.query.MaHoaDon;
  const MaSanPham = req.query.MaSanPham;
  try {
    const sqlQuery = `SELECT * FROM ChiTietHoaDon WHERE MaHoaDon = '${MaHoaDon}' and MaSanPham = '${MaSanPham}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy chi tiết hóa đơn!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createChiTietHoaDon = async (req, res) => {
  const { MaHoaDon, MaSanPham, SoLuong } = req.body;
  const insertQuery = `INSERT INTO ChiTietHoaDon VALUES ('${MaHoaDon}', '${MaSanPham}', ${SoLuong})`;
  const checkChiTietHoaDon = `SELECT COUNT(*) as count FROM ChiTietHoaDon WHERE MaHoaDon = '${MaHoaDon}' AND MaSanPham = '${MaSanPham}'`;
  try {
    const CTHDExists = await checkInsert(checkChiTietHoaDon);
    if (CTHDExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(insertQuery, (mysqlError) => {
      if (mysqlError) {
        console.error(mysqlError);
        res.send({ message: "Lỗi khi thêm ở MySQL" });
      } else {
        sqlPool.request().query(insertQuery, (sqlError) => {
          if (sqlError) {
            console.error(sqlError);
            res.send({ message: "Lỗi khi thêm ở SQL Server" });
          } else {
            res.status(200).json({ message: "Đồng bộ thêm thành công" });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.send({ message: "Thêm không thành công" });
  }
};

const updateChiTietHoaDon = async (req, res) => {
  const { MaHoaDon, MaSanPham, SoLuong } = req.body;

  const updateQuery = `UPDATE ChiTietHoaDon SET SoLuong = ${SoLuong} WHERE MaHoaDon = '${MaHoaDon}' AND MaSanPham = '${MaSanPham}'`;
  const checkChiTietHoaDon = `SELECT COUNT(*) as count FROM ChiTietHoaDon WHERE MaHoaDon = '${MaHoaDon}' AND MaSanPham = '${MaSanPham}'`;

  try {
    const CTHDExists = await checkUpdate(checkChiTietHoaDon);
    if (!CTHDExists) {
      res.status(400).json({ error: "Không tìm thấy chi tiết hóa đơn" });
      return;
    }

    mysqlConnection.query(updateQuery, (mysqlError) => {
      if (mysqlError) {
        res.json({ error: "Lỗi khi cập nhật trên MySQL" });
      } else {
        sqlPool.request().query(updateQuery, (sqlError) => {
          if (sqlError) {
            console.error("Lỗi khi cập nhật trên SQL Server:", sqlError);
            res.json({ error: "Lỗi khi cập nhật trên SQL Server" });
          } else {
            res.status(200).json({
              message: "Đồng bộ cập nhật thành công!",
            });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json({ error: "Cập nhật không thành công!" });
  }
};

const deleteChiTietHoaDon = async (req, res) => {
  const MaHoaDon = req.query.MaHoaDon;
  const MaSanPham = req.query.MaSanPham;
  const deleteQuery = `DELETE FROM ChiTietHoaDon WHERE MaHoaDon = '${MaHoaDon}' AND MaSanPham = '${MaSanPham}'`;
  const checkChiTietHoaDon = `SELECT COUNT(*) as count FROM ChiTietHoaDon WHERE MaHoaDon = '${MaHoaDon}' AND MaSanPham = '${MaSanPham}'`;

  try {
    const CTHDExists = await checkInsert(checkChiTietHoaDon);
    if (!CTHDExists) {
      res.status(400).json({ error: "Không tìm thấy chi tiết hóa đơn" });
      return;
    }

    mysqlConnection.query(deleteQuery, (mysqlError) => {
      if (mysqlError) {
        res.json({ error: "Lỗi khi xóa trên MySQL" });
      } else {
        sqlPool.request().query(deleteQuery, (sqlError) => {
          if (sqlError) {
            res.json({ error: "Lỗi khi xóa trên SQL Server" });
          } else {
            res.status(200).json({
              message: "Đồng bộ xóa thành công!",
            });
          }
        });
      }
    });
  } catch (error) {
    res.json({ error: "Xóa không thành công!" });
  }
};

module.exports = {
  getAllChiTietHoaDon,
  getChiTietHoaDonById,
  createChiTietHoaDon,
  updateChiTietHoaDon,
  deleteChiTietHoaDon,
  getChiTietHoaDonByDetail,
};
