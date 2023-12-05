const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllTinh = async (req, res) => {
  try {
    // Sử dụng mysqlConnection để thực hiện truy vấn trên MySQL
    const sqlQuery = "SELECT * FROM TINH"; // Đảm bảo tên bảng là chính xác
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getTinhById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM tinh WHERE MaTinh = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy tỉnh!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createTinh = async (req, res) => {
  const { MaTinh, TenTinh } = req.body;
  const insertQuery = `INSERT INTO Tinh VALUES ('${MaTinh}',N'${TenTinh}')`;
  const checkChiNhanh = `SELECT cOUNT(*) as count FROM tinh WHERE MaTinh = '${MaTinh}'`;

  try {
    const TKExists = await checkInsert(checkChiNhanh);
    if (TKExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    mysqlConnection.query(insertQuery, (mysqlError) => {
      if (mysqlError) {
        console.error(sqlError);
        res.send({ message: "Lỗi khi thêm ở Mysql" });
      } else {
        sqlPool.request().query(insertQuery, (sqlError) => {
          if (sqlError) {
            res.send({ message: "Lỗi khi thêm ở Sql Server" });
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

const updateTinh = async (req, res) => {
  const { MaTinh, TenTinh } = req.body;

  // Tạo lệnh truy vấn chung
  const updateQuery = `UPDATE tinh set TenTinh='${TenTinh}' WHERE MaTinh='${MaTinh}'`;
  const checkChiNhanh = `SELECT cOUNT(*) as count FROM tinh WHERE MaTinh = '${MaTinh}'`;

  try {
    const CNExists = await checkUpdate(checkChiNhanh);
    if (!CNExists) {
      res.status(400).json({ error: "Không tìm thấy tỉnh" });
      return;
    }

    // Sửa ở cả 2 cơ sở dữ liệu
    mysqlConnection.query(updateQuery, (mysqlError) => {
      if (mysqlError) {
        res.json({ error: "Lỗi khi cập nhật trên Mysql" });
      } else {
        sqlPool.request().query(updateQuery, (sqlError) => {
          if (sqlError) {
            console.error("Lỗi khi cập nhật trên Sql server:", sqlError);
            res.json({ error: "Lỗi khi cập nhật trên Sql server" });
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

const deleteTinh = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM tinh WHERE MaTinh = '${id}'`;
  const checkChiNhanh = `SELECT cOUNT(*) as count FROM tinh WHERE MaTinh ='${id}'`;

  try {
    const CNExists = await checkInsert(checkChiNhanh);
    if (!CNExists) {
      res.status(400).json({ error: "Không tìm thấy tỉnh" });
      return;
    }
    // thực hiện xóa
    mysqlConnection.query(deleteQuery, (mysqlError) => {
      if (mysqlError) {
        res.json({ error: "Lỗi khi xóa trên Mysql" });
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
  getAllTinh,
  getTinhById,
  createTinh,
  updateTinh,
  deleteTinh,
};
