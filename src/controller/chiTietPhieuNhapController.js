const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllChiTietPhieuNhap = async (req, res) => {
  try {
    // Sử dụng mysqlConnection để thực hiện truy vấn trên MySQL
    const sqlQuery =
      "select MaPhieuNhap, TenSanPham, SoLuong,DonGia from CHITIETPHIEUNHAP ct inner join SANPHAM sp on sp.MaSanPham = ct.MaSanPham"; // Đảm bảo tên bảng là chính xác
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getChiTietPhieuNhapById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM ChiTietPhieuNhap WHERE MaPhieuNhap = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy chi tiết phiếu nhập!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const getChiTietPhieuNhapByDetail = async (req, res) => {
  const MaPhieuNhap = req.query.MaPhieuNhap;
  const MaSanPham = req.query.MaSanPham;
  try {
    const sqlQuery = `SELECT * FROM ChiTietPhieuNhap WHERE MaPhieuNhap = '${MaPhieuNhap}' and MaSanPham = '${MaSanPham}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy chi tiết phiếu nhập!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createChiTietPhieuNhap = async (req, res) => {
  const { MaPhieuNhap, MaSanPham, SoLuong, DonGia } = req.body;
  const insertQuery = `INSERT INTO ChiTietPhieuNhap VALUES ('${MaPhieuNhap}', '${MaSanPham}', ${SoLuong}, ${DonGia})`;
  const checkChiTietPhieuNhap = `SELECT COUNT(*) as count FROM ChiTietPhieuNhap WHERE MaPhieuNhap = '${MaPhieuNhap}' AND MaSanPham = '${MaSanPham}'`;
  try {
    const CTPNExists = await checkInsert(checkChiTietPhieuNhap);
    if (CTPNExists) {
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

const updateChiTietPhieuNhap = async (req, res) => {
  const { MaPhieuNhap, MaSanPham, SoLuong, DonGia } = req.body;

  // Tạo lệnh truy vấn chung
  const updateQuery = `UPDATE ChiTietPhieuNhap SET SoLuong = ${SoLuong}, DonGia = ${DonGia} WHERE MaPhieuNhap = '${MaPhieuNhap}' AND MaSanPham = '${MaSanPham}'`;
  const checkChiTietPhieuNhap = `SELECT COUNT(*) as count FROM ChiTietPhieuNhap WHERE MaPhieuNhap = '${MaPhieuNhap}' AND MaSanPham = '${MaSanPham}'`;

  try {
    const CTPNExists = await checkUpdate(checkChiTietPhieuNhap);
    if (!CTPNExists) {
      res.status(400).json({ error: "Không tìm thấy chi tiết phiếu nhập" });
      return;
    }

    // Sửa ở cả 2 cơ sở dữ liệu
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

const deleteChiTietPhieuNhap = async (req, res) => {
  const MaPhieuNhap = req.query.MaPhieuNhap;
  const MaSanPham = req.query.MaSanPham;
  const deleteQuery = `DELETE FROM ChiTietPhieuNhap WHERE MaPhieuNhap = '${MaPhieuNhap}' AND MaSanPham = '${MaSanPham}'`;
  const checkChiTietPhieuNhap = `SELECT COUNT(*) as count FROM ChiTietPhieuNhap WHERE MaPhieuNhap = '${MaPhieuNhap}' AND MaSanPham = '${MaSanPham}'`;
  console.log(deleteQuery);

  try {
    const CTPNExists = await checkInsert(checkChiTietPhieuNhap);
    if (!CTPNExists) {
      res.status(400).json({ error: "Không tìm thấy chi tiết phiếu nhập" });
      return;
    }
    // thực hiện xóa
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
  getAllChiTietPhieuNhap,
  getChiTietPhieuNhapById,
  createChiTietPhieuNhap,
  updateChiTietPhieuNhap,
  deleteChiTietPhieuNhap,
  getChiTietPhieuNhapByDetail,
};
