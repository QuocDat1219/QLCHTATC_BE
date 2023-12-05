const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllThuongHieu = async (req, res) => {
  try {
    // Sử dụng mysqlConnection để thực hiện truy vấn trên MySQL
    const sqlQuery = "SELECT * FROM ThuongHieu"; // Đảm bảo tên bảng là chính xác
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getThuongHieuById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM ThuongHieu WHERE MaThuongHieu = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy thương hiệu!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createThuongHieu = async (req, res) => {
  const { MaThuongHieu, TenThuongHieu } = req.body;
  const insertQuery = `INSERT INTO ThuongHieu VALUES ('${MaThuongHieu}', N'${TenThuongHieu}')`;
  const checkThuongHieu = `SELECT COUNT(*) as count FROM ThuongHieu WHERE MaThuongHieu = '${MaThuongHieu}'`;

  try {
    const THExists = await checkInsert(checkThuongHieu);
    if (THExists) {
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

const updateThuongHieu = async (req, res) => {
  const { MaThuongHieu, TenThuongHieu } = req.body;

  // Tạo lệnh truy vấn chung
  const updateQuery = `UPDATE ThuongHieu SET TenThuongHieu = N'${TenThuongHieu}' WHERE MaThuongHieu = '${MaThuongHieu}'`;
  const checkThuongHieu = `SELECT COUNT(*) as count FROM ThuongHieu WHERE MaThuongHieu = '${MaThuongHieu}'`;

  try {
    const THExists = await checkUpdate(checkThuongHieu);
    if (!THExists) {
      res.status(400).json({ error: "Không tìm thấy thương hiệu" });
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

const deleteThuongHieu = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM ThuongHieu WHERE MaThuongHieu = '${id}'`;
  const checkThuongHieu = `SELECT COUNT(*) as count FROM ThuongHieu WHERE MaThuongHieu ='${id}'`;

  try {
    const THExists = await checkInsert(checkThuongHieu);
    if (!THExists) {
      res.status(400).json({ error: "Không tìm thấy thương hiệu" });
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
  getAllThuongHieu,
  getThuongHieuById,
  createThuongHieu,
  updateThuongHieu,
  deleteThuongHieu,
};
