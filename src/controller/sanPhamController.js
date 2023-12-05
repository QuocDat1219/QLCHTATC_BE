const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { checkUpdate, checkInsert } = require("../auth/checkInfo");

const getAllSanPham = async (req, res) => {
  try {
    // Sử dụng mysqlConnection để thực hiện truy vấn trên MySQL
    const sqlQuery = `select MaSanPham, TenChiNhanh, TenSanPham, GiaSanPham, TenDanhMuc, TenThuongHieu from SANPHAM sp inner join CHINHANH cn on cn.MaChiNhanh = sp.MaChiNhanh
    inner join DANHMUC dm on dm.MaDanhMuc = sp.MaDanhMuc
    inner join THUONGHIEU th on th.MaThuongHieu = sp.MaThuongHieu`; // Đảm bảo tên bảng là chính xác
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getSanPhamById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM SanPham WHERE MaSanPham = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy sản phẩm!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createSanPham = async (req, res) => {
  const {
    MaSanPham,
    MaChiNhanh,
    TenSanPham,
    GiaSanPham,
    MaDanhMuc,
    MaThuongHieu,
  } = req.body;
  const insertQuery = `INSERT INTO SanPham VALUES ('${MaSanPham}', '${MaChiNhanh}', N'${TenSanPham}', ${GiaSanPham}, '${MaDanhMuc}', '${MaThuongHieu}')`;
  const checkSanPham = `SELECT COUNT(*) as count FROM SanPham WHERE MaSanPham = '${MaSanPham}'`;

  try {
    const SPExists = await checkInsert(checkSanPham);
    if (SPExists) {
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

const updateSanPham = async (req, res) => {
  const { MaSanPham, TenSanPham, GiaSanPham, MaDanhMuc, MaThuongHieu } =
    req.body;

  // Tạo lệnh truy vấn chung
  const updateQuery = `UPDATE SanPham SET TenSanPham = N'${TenSanPham}', GiaSanPham = ${GiaSanPham}, MaDanhMuc = '${MaDanhMuc}', MaThuongHieu = '${MaThuongHieu}' WHERE MaSanPham = '${MaSanPham}'`;
  const checkSanPham = `SELECT COUNT(*) as count FROM SanPham WHERE MaSanPham = '${MaSanPham}'`;

  try {
    const SPExists = await checkUpdate(checkSanPham);
    if (!SPExists) {
      res.status(400).json({ error: "Không tìm thấy sản phẩm" });
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

const deleteSanPham = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM SanPham WHERE MaSanPham = '${id}'`;
  const checkSanPham = `SELECT COUNT(*) as count FROM SanPham WHERE MaSanPham ='${id}'`;

  try {
    const SPExists = await checkInsert(checkSanPham);
    if (!SPExists) {
      res.status(400).json({ error: "Không tìm thấy sản phẩm" });
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
  getAllSanPham,
  getSanPhamById,
  createSanPham,
  updateSanPham,
  deleteSanPham,
};
