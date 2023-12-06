const { mysqlConnection } = require("../config/connectMysql");
const { sqlPool } = require("../config/connectSqlserver");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");
const bcrypt = require("bcrypt");

const getAllTaiKhoan = async (req, res) => {
  try {
    const sqlQuery =
      "SELECT TenTK,TenNhanVien, Matkhau,CASE WHEN tk.Quyen = 1 THEN 'admin' ELSE 'user' END as Quyen FROM taikhoan tk inner join nhanvien nv on tk.MaNhanVien = nv.MaNhanVien";
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getTaiKhoanById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM TaiKhoan WHERE TenTK = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy tài khoản!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createTaiKhoan = async (req, res) => {
  const { TenTK, MaNhanVien, MatKhau, Quyen } = req.body;
  const insertQuery = `INSERT INTO TaiKhoan VALUES ('${TenTK}', '${MaNhanVien}', ${MatKhau}, '${Quyen}')`;
  const checkTaiKhoan = `SELECT COUNT(*) as count FROM TaiKhoan WHERE TenTK = '${TenTK}' and MaNhanVien = '${MaNhanVien}'`;
  try {
    const TKExists = await checkInsert(checkTaiKhoan);
    if (TKExists) {
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

const updateTaiKhoan = async (req, res) => {
  const { TenTK, MaNhanVien, MatKhau, Quyen } = req.body;

  const updateQuery = `UPDATE TaiKhoan SET MaNhanVien = '${MaNhanVien}', MatKhau = '${MatKhau}', Quyen = '${Quyen}' WHERE TenTK = '${TenTK}'`;
  const checkTaiKhoan = `SELECT COUNT(*) as count FROM TaiKhoan WHERE TenTK = '${TenTK}'`;

  try {
    const TKExists = await checkUpdate(checkTaiKhoan);
    if (!TKExists) {
      res.status(400).json({ error: "Không tìm thấy tài khoản" });
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

const deleteTaiKhoan = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM TaiKhoan WHERE TenTK = '${id}'`;
  const checkTaiKhoan = `SELECT COUNT(*) as count FROM TaiKhoan WHERE TenTK = '${id}'`;

  try {
    const TKExists = await checkInsert(checkTaiKhoan);
    if (!TKExists) {
      res.status(400).json({ error: "Không tìm thấy tài khoản" });
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
  getAllTaiKhoan,
  getTaiKhoanById,
  createTaiKhoan,
  updateTaiKhoan,
  deleteTaiKhoan,
};
