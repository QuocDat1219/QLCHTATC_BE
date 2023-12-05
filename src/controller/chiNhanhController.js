const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllChiNhanh = async (req, res) => {
  try {
    // Sử dụng mysqlConnection để thực hiện truy vấn trên MySQL
    const sqlQuery =
      "SELECT MaChiNhanh,TenChiNhanh,TenTinh FROM ChiNhanh cn inner join tinh on cn.MaTinh = tinh.MaTinh"; // Đảm bảo tên bảng là chính xác
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getChiNhanhById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM ChiNhanh WHERE MaChiNhanh = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy chi nhánh!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createChiNhanh = async (req, res) => {
  const { MaChiNhanh, TenChiNhanh, MaTinh } = req.body;
  const insertQuery = `INSERT INTO ChiNhanh VALUES ('${MaChiNhanh}', N'${TenChiNhanh}', '${MaTinh}')`;
  const checkChiNhanh = `SELECT COUNT(*) as count FROM ChiNhanh WHERE MaChiNhanh = '${MaChiNhanh}'`;

  try {
    const CNExists = await checkInsert(checkChiNhanh);
    if (CNExists) {
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

const updateChiNhanh = async (req, res) => {
  const { MaChiNhanh, TenChiNhanh, MaTinh } = req.body;

  // Tạo lệnh truy vấn chung
  const updateQuery = `UPDATE ChiNhanh SET TenChiNhanh = N'${TenChiNhanh}', MaTinh = '${MaTinh}' WHERE MaChiNhanh = '${MaChiNhanh}'`;
  const checkChiNhanh = `SELECT COUNT(*) as count FROM ChiNhanh WHERE MaChiNhanh = '${MaChiNhanh}'`;

  try {
    const CNExists = await checkUpdate(checkChiNhanh);
    if (!CNExists) {
      res.status(400).json({ error: "Không tìm thấy chi nhánh" });
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

const deleteChiNhanh = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM ChiNhanh WHERE MaChiNhanh = '${id}'`;
  const checkChiNhanh = `SELECT COUNT(*) as count FROM ChiNhanh WHERE MaChiNhanh ='${id}'`;

  try {
    const CNExists = await checkInsert(checkChiNhanh);
    if (!CNExists) {
      res.status(400).json({ error: "Không tìm thấy chi nhánh" });
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
  getAllChiNhanh,
  getChiNhanhById,
  createChiNhanh,
  updateChiNhanh,
  deleteChiNhanh,
};
