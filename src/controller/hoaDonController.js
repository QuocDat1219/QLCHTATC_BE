const { mysqlConnection } = require("../config/connectMysql");
const { sqlPool } = require("../config/connectSqlserver");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllHoaDon = async (req, res) => {
  try {
    const sqlQuery = `select MaHoaDon, TenKhachHang, TenNhanVien, TenChiNhanh, NgayLap from HOADON hd
    inner join KHACHHANG kh on kh.MaKhachHang = hd.MaKhachHang
    inner join NHANVIEN nv on nv.MaNhanVien = hd.MaNhanVien
    inner join CHINHANH cn on cn.MaChiNhanh = hd.MaChiNhanh`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getHoaDonById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM HoaDon WHERE MaHoaDon = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy hóa đơn!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createHoaDon = async (req, res) => {
  const { MaHoaDon, MaKhachHang, MaNhanVien, MaChiNhanh, NgayLap } = req.body;
  const insertQuery = `INSERT INTO HoaDon VALUES ('${MaHoaDon}', '${MaKhachHang}', '${MaNhanVien}', '${MaChiNhanh}', '${NgayLap}')`;
  const checkHoaDon = `SELECT COUNT(*) as count FROM HoaDon WHERE MaHoaDon = '${MaHoaDon}'`;

  try {
    const HoaDonExists = await checkInsert(checkHoaDon);
    if (HoaDonExists) {
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

const updateHoaDon = async (req, res) => {
  const { MaHoaDon, MaKhachHang, MaNhanVien, MaChiNhanh, NgayLap } = req.body;

  const updateQuery = `UPDATE HoaDon SET MaKhachHang = '${MaKhachHang}', MaNhanVien = '${MaNhanVien}', MaChiNhanh = '${MaChiNhanh}', NgayLap = '${NgayLap}' WHERE MaHoaDon = '${MaHoaDon}'`;
  const checkHoaDon = `SELECT COUNT(*) as count FROM HoaDon WHERE MaHoaDon = '${MaHoaDon}'`;

  try {
    const HoaDonExists = await checkUpdate(checkHoaDon);
    if (!HoaDonExists) {
      res.status(400).json({ error: "Không tìm thấy hóa đơn" });
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

const deleteHoaDon = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM HoaDon WHERE MaHoaDon = '${id}'`;
  const checkHoaDon = `SELECT COUNT(*) as count FROM HoaDon WHERE MaHoaDon = '${id}'`;

  try {
    const HoaDonExists = await checkInsert(checkHoaDon);
    if (!HoaDonExists) {
      res.status(400).json({ error: "Không tìm thấy hóa đơn" });
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
  getAllHoaDon,
  getHoaDonById,
  createHoaDon,
  updateHoaDon,
  deleteHoaDon,
};
