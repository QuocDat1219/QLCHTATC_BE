const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllKho = async (req, res) => {
  try {
    // Sử dụng mysqlConnection để thực hiện truy vấn trên MySQL
    const sqlQuery =
      "SELECT MaKho, TenKho, TenChiNhanh, TenSanPham, SoLuong from kho inner join CHINHANH cn on cn.MaChiNhanh = kho.MaChiNhanh inner join SANPHAM sp on sp.MaSanPham = kho.MaSanPham"; // Đảm bảo tên bảng là chính xác
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getKhoById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM Kho WHERE MaKho = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy kho!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createKho = async (req, res) => {
  const { MaKho, TenKho, MaChiNhanh, MaSanPham, SoLuong } = req.body;
  const insertQuery = `INSERT INTO Kho VALUES ('${MaKho}', N'${TenKho}', '${MaChiNhanh}', '${MaSanPham}', '${SoLuong}')`;
  const checkKho = `SELECT COUNT(*) as count FROM Kho WHERE MaKho = '${MaKho}'`;

  try {
    const KExists = await checkInsert(checkKho);
    if (KExists) {
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

const updateKho = async (req, res) => {
  const { MaKho, TenKho, MaChiNhanh, MaSanPham, SoLuong } = req.body;

  // Tạo lệnh truy vấn chung
  const updateQuery = `UPDATE Kho SET TenKho = N'${TenKho}', MaChiNhanh = '${MaChiNhanh}', MaSanPham = '${MaSanPham}', SoLuong = '${SoLuong}' WHERE MaKho = '${MaKho}'`;
  const checkKho = `SELECT COUNT(*) as count FROM Kho WHERE MaKho = '${MaKho}'`;

  try {
    const KExists = await checkUpdate(checkKho);
    if (!KExists) {
      res.status(400).json({ error: "Không tìm thấy kho" });
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

const deleteKho = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM Kho WHERE MaKho = '${id}'`;
  const checkKho = `SELECT COUNT(*) as count FROM Kho WHERE MaKho ='${id}'`;

  try {
    const KExists = await checkInsert(checkKho);
    if (!KExists) {
      res.status(400).json({ error: "Không tìm thấy kho" });
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
  getAllKho,
  getKhoById,
  createKho,
  updateKho,
  deleteKho,
};
