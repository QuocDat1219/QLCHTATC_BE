const { mysqlConnection } = require("../config/connectMysql");
const { sqlPool } = require("../config/connectSqlserver");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllLoaiKhachHang = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM LoaiKhachHang";
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getLoaiKhachHangById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM LoaiKhachHang WHERE MaLoaiKhachHang = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy loại khách hàng!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createLoaiKhachHang = async (req, res) => {
  const { MaLoaiKhachHang, TenLoaiKhachHang } = req.body;
  const insertQuery = `INSERT INTO LoaiKhachHang VALUES ('${MaLoaiKhachHang}', N'${TenLoaiKhachHang}')`;
  const checkLoaiKhachHang = `SELECT COUNT(*) as count FROM LoaiKhachHang WHERE MaLoaiKhachHang = '${MaLoaiKhachHang}'`;

  try {
    const LoaiKhachHangExists = await checkInsert(checkLoaiKhachHang);
    if (LoaiKhachHangExists) {
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

const updateLoaiKhachHang = async (req, res) => {
  const { MaLoaiKhachHang, TenLoaiKhachHang } = req.body;

  const updateQuery = `UPDATE LoaiKhachHang SET TenLoaiKhachHang = N'${TenLoaiKhachHang}' WHERE MaLoaiKhachHang = '${MaLoaiKhachHang}'`;
  const checkLoaiKhachHang = `SELECT COUNT(*) as count FROM LoaiKhachHang WHERE MaLoaiKhachHang = '${MaLoaiKhachHang}'`;

  try {
    const LoaiKhachHangExists = await checkUpdate(checkLoaiKhachHang);
    if (!LoaiKhachHangExists) {
      res.status(400).json({ error: "Không tìm thấy loại khách hàng" });
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

const deleteLoaiKhachHang = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM LoaiKhachHang WHERE MaLoaiKhachHang = '${id}'`;
  const checkLoaiKhachHang = `SELECT COUNT(*) as count FROM LoaiKhachHang WHERE MaLoaiKhachHang = '${id}'`;

  try {
    const LoaiKhachHangExists = await checkInsert(checkLoaiKhachHang);
    if (!LoaiKhachHangExists) {
      res.status(400).json({ error: "Không tìm thấy loại khách hàng" });
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
  getAllLoaiKhachHang,
  getLoaiKhachHangById,
  createLoaiKhachHang,
  updateLoaiKhachHang,
  deleteLoaiKhachHang,
};
