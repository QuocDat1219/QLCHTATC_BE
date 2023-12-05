const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllPhieuNhap = async (req, res) => {
  try {
    // Sử dụng mysqlConnection để thực hiện truy vấn trên MySQL
    const sqlQuery = `select MaPhieuNhap, TenNhaCungCap, TenChiNhanh, NgayNhap, TongTien from PHIEUNHAP pn 
    inner join NHACUNGCAP ncc on ncc.MaNhaCungCap = pn.MaNhaCungCap
    inner join CHINHANH cn on cn.MaChiNhanh = pn.MaChiNhanh`; // Đảm bảo tên bảng là chính xác
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getPhieuNhapById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM PhieuNhap WHERE MaPhieuNhap = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy phiếu nhập!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createPhieuNhap = async (req, res) => {
  const { MaPhieuNhap, MaNhaCungCap, MaChiNhanh, NgayNhap, TongTien } =
    req.body;
  const insertQuery = `INSERT INTO PhieuNhap VALUES ('${MaPhieuNhap}', '${MaNhaCungCap}', '${MaChiNhanh}', '${NgayNhap}', ${TongTien})`;
  const checkPhieuNhap = `SELECT COUNT(*) as count FROM PhieuNhap WHERE MaPhieuNhap = '${MaPhieuNhap}'`;

  try {
    const PNExists = await checkInsert(checkPhieuNhap);
    if (PNExists) {
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

const updatePhieuNhap = async (req, res) => {
  const { MaPhieuNhap, MaNhaCungCap, MaChiNhanh, NgayNhap, TongTien } =
    req.body;

  // Tạo lệnh truy vấn chung
  const updateQuery = `UPDATE PhieuNhap SET MaNhaCungCap = '${MaNhaCungCap}', MaChiNhanh = '${MaChiNhanh}', NgayNhap = '${NgayNhap}', TongTien = ${TongTien} WHERE MaPhieuNhap = '${MaPhieuNhap}'`;
  const checkPhieuNhap = `SELECT COUNT(*) as count FROM PhieuNhap WHERE MaPhieuNhap = '${MaPhieuNhap}'`;

  try {
    const PNExists = await checkUpdate(checkPhieuNhap);
    if (!PNExists) {
      res.status(400).json({ error: "Không tìm thấy phiếu nhập" });
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

const deletePhieuNhap = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM PhieuNhap WHERE MaPhieuNhap = '${id}'`;
  const checkPhieuNhap = `SELECT COUNT(*) as count FROM PhieuNhap WHERE MaPhieuNhap ='${id}'`;

  try {
    const PNExists = await checkInsert(checkPhieuNhap);
    if (!PNExists) {
      res.status(400).json({ error: "Không tìm thấy phiếu nhập" });
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
  getAllPhieuNhap,
  getPhieuNhapById,
  createPhieuNhap,
  updatePhieuNhap,
  deletePhieuNhap,
};
