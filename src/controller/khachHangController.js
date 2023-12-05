const { mysqlConnection } = require("../config/connectMysql");
const { sqlPool } = require("../config/connectSqlserver");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllKhachHang = async (req, res) => {
  try {
    const sqlQuery =
      "select MaKhachHang, TenKhachHang,DiaChi,TenLoaiKhachHang from KHACHHANG kh inner join LOAIKHACHHANG l on l.MaLoaiKhachHang = kh.MaLoaiKhachHang";
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getKhachHangById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM KhachHang WHERE MaKhachHang = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy khách hàng!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createKhachHang = async (req, res) => {
  const { MaKhachHang, TenKhachHang, DiaChi, MaLoaiKhachHang } = req.body;
  const insertQuery = `INSERT INTO KhachHang VALUES ('${MaKhachHang}', N'${TenKhachHang}', N'${DiaChi}', '${MaLoaiKhachHang}')`;
  const checkKhachHang = `SELECT COUNT(*) as count FROM KhachHang WHERE MaKhachHang = '${MaKhachHang}'`;

  try {
    const KhachHangExists = await checkInsert(checkKhachHang);
    if (KhachHangExists) {
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

const updateKhachHang = async (req, res) => {
  const { MaKhachHang, TenKhachHang, DiaChi, MaLoaiKhachHang } = req.body;

  const updateQuery = `UPDATE KhachHang SET TenKhachHang = N'${TenKhachHang}', DiaChi = N'${DiaChi}', MaLoaiKhachHang = '${MaLoaiKhachHang}' WHERE MaKhachHang = '${MaKhachHang}'`;
  const checkKhachHang = `SELECT COUNT(*) as count FROM KhachHang WHERE MaKhachHang = '${MaKhachHang}'`;

  try {
    const KhachHangExists = await checkUpdate(checkKhachHang);
    if (!KhachHangExists) {
      res.status(400).json({ error: "Không tìm thấy khách hàng" });
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

const deleteKhachHang = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM KhachHang WHERE MaKhachHang = '${id}'`;
  const checkKhachHang = `SELECT COUNT(*) as count FROM KhachHang WHERE MaKhachHang = '${id}'`;

  try {
    const KhachHangExists = await checkInsert(checkKhachHang);
    if (!KhachHangExists) {
      res.status(400).json({ error: "Không tìm thấy khách hàng" });
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
  getAllKhachHang,
  getKhachHangById,
  createKhachHang,
  updateKhachHang,
  deleteKhachHang,
};
