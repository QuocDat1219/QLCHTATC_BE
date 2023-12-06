const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { checkUpdate, checkInsert, checkLogin } = require("../auth/checkInfo");

const getAllNhanVien = async (req, res) => {
  try {
    // Sử dụng mysqlConnection để thực hiện truy vấn trên MySQL
    const sqlQuery = `select MaNhanVien, TenChiNhanh, TenNhanVien, DiaChi from NHANVIEN nv 
    inner join CHINHANH cn on cn.MaChiNhanh = nv.MaChiNhanh`; // Đảm bảo tên bảng là chính xác
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    res.json(rows);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getNhanVienById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM NhanVien WHERE MaNhanVien = '${req.params.id}'`;
    const [rows, fields] = await mysqlConnection.promise().query(sqlQuery);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send({ error: "Không tìm thấy nhân viên!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createNhanVien = async (req, res) => {
  const { MaNhanVien, MaChiNhanh, TenNhanVien, DiaChi } = req.body;
  const insertQuery = `INSERT INTO NhanVien VALUES ('${MaNhanVien}', '${MaChiNhanh}', N'${TenNhanVien}', N'${DiaChi}')`;
  const checkNhanVien = `SELECT COUNT(*) as count FROM NhanVien WHERE MaNhanVien = '${MaNhanVien}'`;

  try {
    const NVExists = await checkInsert(checkNhanVien);
    if (NVExists) {
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

const updateNhanVien = async (req, res) => {
  const { MaNhanVien, MaChiNhanh, TenNhanVien, DiaChi } = req.body;

  // Tạo lệnh truy vấn chung
  const updateQuery = `UPDATE NhanVien SET MaChiNhanh = '${MaChiNhanh}', TenNhanVien = N'${TenNhanVien}', DiaChi = N'${DiaChi}' WHERE MaNhanVien = '${MaNhanVien}'`;
  const checkNhanVien = `SELECT COUNT(*) as count FROM NhanVien WHERE MaNhanVien = '${MaNhanVien}'`;
  console.log(updateQuery);
  try {
    const NVExists = await checkUpdate(checkNhanVien);
    if (!NVExists) {
      res.status(400).json({ error: "Không tìm thấy nhân viên" });
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

const deleteNhanVien = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM NhanVien WHERE MaNhanVien = '${id}'`;
  const checkNhanVien = `SELECT COUNT(*) as count FROM NhanVien WHERE MaNhanVien = '${id}'`;

  try {
    const NVExists = await checkInsert(checkNhanVien);
    if (!NVExists) {
      res.status(400).json({ error: "Không tìm thấy nhân viên" });
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

const nhanVienLogin = async (req, res) => {
  try {
    const checkTaiKhoan = `SELECT cOUNT(*) as count FROM taikhoan WHERE TenTk = '${req.body.taikhoan}' and MatKhau = '${req.body.matkhau}'`;
    const recordExists = await checkLogin(checkTaiKhoan);

    if (!recordExists) {
      res.send({ message: "Sai tên tài khoản hoặc mật khẩu" });
    } else {
      const userInfo = `select nv.MaNhanVien as MaNhanVien, TenNhanVien,Quyen from taikhoan tk inner join nhanvien nv on tk.MaNhanVien = nv.MaNhanVien where tk.TenTK = '${req.body.taikhoan}' and tk.MatKhau = '${req.body.matkhau}'`;
      const nhanvien = await sqlPool.request().query(userInfo);
      res.status(200).json(nhanvien.recordset);
    }
  } catch (error) {
    console.error(error);
    res.send({ message: "Lỗi trong quá trình đăng nhập" });
  }
};

module.exports = {
  getAllNhanVien,
  getNhanVienById,
  createNhanVien,
  updateNhanVien,
  deleteNhanVien,
  nhanVienLogin,
};
