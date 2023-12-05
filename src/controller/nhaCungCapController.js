const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllNhaCungCap = async (req, res) => {
  try {
    // Sử dụng mysqlConnection để thực hiện truy vấn trên MySQL
    const sqlQuery = "SELECT * FROM NhaCungCap"; // Đảm bảo tên bảng là chính xác
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getNhaCungCapById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM NhaCungCap WHERE MaNhaCungCap = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy nhà cung cấp!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createNhaCungCap = async (req, res) => {
  const { MaNhaCungCap, TenNhaCungCap, DiaChi } = req.body;
  const insertQuery = `INSERT INTO NhaCungCap VALUES ('${MaNhaCungCap}', N'${TenNhaCungCap}', N'${DiaChi}')`;
  const checkNhaCungCap = `SELECT COUNT(*) as count FROM NhaCungCap WHERE MaNhaCungCap = '${MaNhaCungCap}'`;

  try {
    const NCCExists = await checkInsert(checkNhaCungCap);
    if (NCCExists) {
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

const updateNhaCungCap = async (req, res) => {
  const { MaNhaCungCap, TenNhaCungCap, DiaChi } = req.body;

  // Tạo lệnh truy vấn chung
  const updateQuery = `UPDATE NhaCungCap SET TenNhaCungCap = N'${TenNhaCungCap}', DiaChi = N'${DiaChi}' WHERE MaNhaCungCap = '${MaNhaCungCap}'`;
  const checkNhaCungCap = `SELECT COUNT(*) as count FROM NhaCungCap WHERE MaNhaCungCap = '${MaNhaCungCap}'`;

  try {
    const NCCExists = await checkUpdate(checkNhaCungCap);
    if (!NCCExists) {
      res.status(400).json({ error: "Không tìm thấy nhà cung cấp" });
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

const deleteNhaCungCap = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM NhaCungCap WHERE MaNhaCungCap = '${id}'`;
  const checkNhaCungCap = `SELECT COUNT(*) as count FROM NhaCungCap WHERE MaNhaCungCap ='${id}'`;

  try {
    const NCCExists = await checkInsert(checkNhaCungCap);
    if (!NCCExists) {
      res.status(400).json({ error: "Không tìm thấy nhà cung cấp" });
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
  getAllNhaCungCap,
  getNhaCungCapById,
  createNhaCungCap,
  updateNhaCungCap,
  deleteNhaCungCap,
};
