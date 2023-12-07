const { sqlPool } = require("../config/connectSqlserver");
const { mysqlConnection } = require("../config/connectMysql");
const { executeOracleQuery } = require("../config/connectOracle");
const { postgresClient } = require("../config/connectPostgresql");
const {
  isTableExistMysql,
  isTableExistOra,
  isTableExistPg,
} = require("../auth/checkTable");
const dayjs = require("dayjs");
const migrateData = async (req, res) => {
  const {
    bangMysql,
    cotMysql,
    phantanMysql,
    bangOracle,
    cotOracle,
    phantanOracle,
  } = req.body;

  let tinhMysql,
    tinhOra,
    tinhPg,
    chinhanhMysql,
    chinhanhOra,
    chinhanhPg,
    khoMysql,
    khoOra,
    khoPg,
    danhmuc,
    thuonghieu,
    sanPhamMysql,
    sanPhamOra,
    sanPhamPg,
    nhaCungCap,
    phieuNhapMysql,
    phieuNhapOra,
    phieuNhapPg,
    chiTietPhieuNhapMysql,
    chiTietPhieuNhapOra,
    chiTietPhieuNhapPg,
    nhanVienMysql,
    nhanVienOra,
    nhanVienPg,
    taiKhoanMysql,
    taiKhoanOra,
    taiKhoanPg,
    loaiKhachHang,
    khachHangMysql,
    khachHangOra,
    khachHangPg,
    hoaDonMysql,
    hoaDonOra,
    hoaDonPg,
    chiTietHoaDonMysql,
    chiTietHoaDonOra,
    chiTietHoaDonPg = "";

  if (
    bangMysql &&
    cotMysql &&
    phantanMysql &&
    bangOracle &&
    cotOracle &&
    phantanOracle
  ) {
    danhmuc = "Select * from danhmuc";
    thuonghieu = "Select * from thuonghieu";
    nhaCungCap = "Select * from nhacungcap";
    loaiKhachHang = "Select * from loaikhachhang";
    //Phân tán Mysql
    tinhMysql = `Select * from ${bangMysql} where ${cotMysql} = '${phantanMysql}'`;
    chinhanhMysql = `select cn.* from CHINHANH cn inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}'`;
    khoMysql = `select kho.* from kho inner join chinhanh cn on cn.MaChiNhanh = kho.MaChiNhanh inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}'`;
    sanPhamMysql = `select sp.* from SANPHAM sp 
    inner join KHO on kho.MaSanPham = sp.MaSanPham
    inner join CHINHANH cn on cn.MaChiNhanh = KHO.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}'`;
    phieuNhapMysql = `select sp.* from phieunhap sp 
    inner join CHINHANH cn on cn.MaChiNhanh = sp.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}'`;
    chiTietPhieuNhapMysql = `select ct.* from CHITIETPHIEUNHAP ct 
    inner join PHIEUNHAP sp on ct.MaPhieuNhap = sp.MaPhieuNhap
      inner join CHINHANH cn on cn.MaChiNhanh = sp.MaChiNhanh
      inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}'`;
    nhanVienMysql = `select nv.* from NHANVIEN nv
    inner join CHINHANH cn on cn.MaChiNhanh = nv.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}'`;
    taiKhoanMysql = `select tk.* from TAIKHOAN tk inner join NHANVIEN nv on nv.MaNhanVien = tk.MaNhanVien
    inner join CHINHANH cn on cn.MaChiNhanh = nv.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}'`;
    khachHangMysql = `select kh.* from KHACHHANG kh inner join HOADON hd on hd.MaKhachHang = kh.MaKhachHang
    inner join CHINHANH cn on cn.MaChiNhanh = hd.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}'`;
    hoaDonMysql = `select hd.* from HOADON hd 
    inner join CHINHANH cn on cn.MaChiNhanh = hd.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}'`;
    chiTietHoaDonMysql = `select ct.* from CHITIETHOADON ct 
    inner join HOADON hd on ct.MaHoaDon = hd.MaHoaDon
      inner join CHINHANH cn on cn.MaChiNhanh = hd.MaChiNhanh
      inner join TINH on TINH.MaTinh = cn.MaTinh  where ${cotMysql} = '${phantanMysql}'`;

    //Phân tán Oracle
    tinhOra = `Select * from ${bangOracle} where ${cotOracle} = '${phantanOracle}'`;
    chinhanhOra = `select cn.* from CHINHANH cn inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotOracle} = '${phantanOracle}'`;
    khoOra = `select kho.* from kho inner join chinhanh cn on cn.MaChiNhanh = kho.MaChiNhanh inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotOracle} = '${phantanOracle}'`;
    sanPhamOra = `select sp.* from SANPHAM sp 
    inner join KHO on kho.MaSanPham = sp.MaSanPham
    inner join CHINHANH cn on cn.MaChiNhanh = KHO.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotOracle} = '${phantanOracle}'`;
    phieuNhapOra = `select sp.* from phieunhap sp 
    inner join CHINHANH cn on cn.MaChiNhanh = sp.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotOracle} = '${phantanOracle}'`;
    chiTietPhieuNhapOra = `select ct.* from CHITIETPHIEUNHAP ct 
    inner join PHIEUNHAP sp on ct.MaPhieuNhap = sp.MaPhieuNhap
      inner join CHINHANH cn on cn.MaChiNhanh = sp.MaChiNhanh
      inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotOracle} = '${phantanOracle}'`;
    nhanVienOra = `select nv.* from NHANVIEN nv
    inner join CHINHANH cn on cn.MaChiNhanh = nv.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotOracle} = '${phantanOracle}'`;
    taiKhoanOra = `select tk.* from TAIKHOAN tk inner join NHANVIEN nv on nv.MaNhanVien = tk.MaNhanVien
    inner join CHINHANH cn on cn.MaChiNhanh = nv.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotOracle} = '${phantanOracle}'`;
    khachHangOra = `select kh.* from KHACHHANG kh inner join HOADON hd on hd.MaKhachHang = kh.MaKhachHang
    inner join CHINHANH cn on cn.MaChiNhanh = hd.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotOracle} = '${phantanOracle}'`;
    hoaDonOra = `select hd.* from HOADON hd 
    inner join CHINHANH cn on cn.MaChiNhanh = hd.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotOracle} = '${phantanOracle}'`;
    chiTietHoaDonOra = `select ct.* from CHITIETHOADON ct 
    inner join HOADON hd on ct.MaHoaDon = hd.MaHoaDon
      inner join CHINHANH cn on cn.MaChiNhanh = hd.MaChiNhanh
      inner join TINH on TINH.MaTinh = cn.MaTinh  where ${cotOracle} = '${phantanOracle}'`;

    //Phân tán PostgreSQL
    tinhPg = `Select * from tinh except Select * from tinh where ${cotMysql} = '${phantanMysql}' or  ${cotOracle} = '${phantanOracle}'`;
    chinhanhPg = `select cn.* from CHINHANH cn inner join TINH on TINH.MaTinh = cn.MaTinh except select cn.* from CHINHANH  cn inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}' or  ${cotOracle} = '${phantanOracle}'`;
    khoPg = `select * from kho except select kho.* from kho inner join chinhanh cn on cn.MaChiNhanh = kho.MaChiNhanh inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}' or  ${cotOracle} = '${phantanOracle}'`;
    sanPhamPg = `select * from sanpham except select sp.* from SANPHAM sp 
    inner join KHO on kho.MaSanPham = sp.MaSanPham
    inner join CHINHANH cn on cn.MaChiNhanh = KHO.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where  ${cotMysql} = '${phantanMysql}' or  ${cotOracle} = '${phantanOracle}'`;
    phieuNhapPg = `select * from phieunhap except select sp.* from phieunhap sp 
    inner join CHINHANH cn on cn.MaChiNhanh = sp.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where  ${cotMysql} = '${phantanMysql}' or  ${cotOracle} = '${phantanOracle}'`;
    chiTietPhieuNhapPg = `select * from CHITIETPHIEUNHAP except select ct.* from CHITIETPHIEUNHAP ct 
    inner join PHIEUNHAP sp on ct.MaPhieuNhap = sp.MaPhieuNhap
      inner join CHINHANH cn on cn.MaChiNhanh = sp.MaChiNhanh
      inner join TINH on TINH.MaTinh = cn.MaTinh where  ${cotMysql} = '${phantanMysql}' or  ${cotOracle} = '${phantanOracle}'`;
    nhanVienPg = `select * from nhanvien except select nv.* from NHANVIEN nv
        inner join CHINHANH cn on cn.MaChiNhanh = nv.MaChiNhanh
        inner join TINH on TINH.MaTinh = cn.MaTinh where  ${cotMysql} = '${phantanMysql}' or  ${cotOracle} = '${phantanOracle}'`;
    taiKhoanPg = `select * from TAIKHOAN except select tk.* from TAIKHOAN tk inner join NHANVIEN nv on nv.MaNhanVien = tk.MaNhanVien
    inner join CHINHANH cn on cn.MaChiNhanh = nv.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where  ${cotMysql} = '${phantanMysql}' or  ${cotOracle} = '${phantanOracle}'`;
    khachHangPg = `select * from KHACHHANG except select kh.* from KHACHHANG kh inner join HOADON hd on hd.MaKhachHang = kh.MaKhachHang
    inner join CHINHANH cn on cn.MaChiNhanh = hd.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}' or  ${cotOracle} = '${phantanOracle}'`;
    hoaDonPg = `select * from HOADON except select hd.* from HOADON hd 
    inner join CHINHANH cn on cn.MaChiNhanh = hd.MaChiNhanh
    inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}' or  ${cotOracle} = '${phantanOracle}'`;
    chiTietHoaDonPg = `select * from CHITIETHOADON except select ct.* from CHITIETHOADON ct 
    inner join HOADON hd on ct.MaHoaDon = hd.MaHoaDon
      inner join CHINHANH cn on cn.MaChiNhanh = hd.MaChiNhanh
      inner join TINH on TINH.MaTinh = cn.MaTinh where ${cotMysql} = '${phantanMysql}' or  ${cotOracle} = '${phantanOracle}'`;
  } else {
    res.json({ message: "Chọn đủ điều kiện phân mảnh cho các site!" });
  }

  //Tạo bảng và thêm vào mysql
  try {
    // Tán bảng tỉnh đến MySQL
    const resultTinhMysql = await sqlPool.request().query(tinhMysql);
    const resultsTinhMysql = resultTinhMysql.recordset;

    const resultTinhOra = await sqlPool.request().query(tinhOra);
    const resultsTinhOra = resultTinhOra.recordset;

    const resultTinhPg = await sqlPool.request().query(tinhPg);
    const resultsTinhPg = resultTinhPg.recordset;

    const countTinhMysql = await isTableExistMysql("TINH");
    const countTinhOra = await isTableExistOra("TINH");
    const countTinhPg = await isTableExistPg("TINH");

    if (countTinhMysql && countTinhOra && countTinhPg) {
      res.send({ message: "Tỉnh đã tồn tại trong các site" });
    } else {
      const createTinhMysql =
        "CREATE TABLE TINH (MaTinh varchar(20) primary key , TenTinh varchar(50))";
      await mysqlConnection.promise().query(createTinhMysql);

      const insertTinhMysql = `INSERT INTO TINH (MaTinh, TenTinh) VALUES ?`;

      const values = resultsTinhMysql.map((row) => [row.MaTinh, row.TenTinh]);

      await mysqlConnection.promise().query(insertTinhMysql, [values]);

      //Phân tán oracle
      const oracleQueryTinh =
        "CREATE TABLE TINH (MaTinh VARCHAR2(20) PRIMARY KEY, TenTinh VARCHAR2(50))";
      await executeOracleQuery(oracleQueryTinh);

      // Lấy dữ liệu truy vấn được từ SQL Server
      for (const row of resultsTinhOra) {
        const MaTinh = row.MaTinh;
        const TenTinh = row.TenTinh;

        // Thêm vào bảng tỉnh ở Oracle
        const oraInsertTinh =
          "INSERT INTO TINH (MaTinh, TenTinh) VALUES (:MaTinh, :TenTinh)";
        const oraParamsTinh = [MaTinh, TenTinh];
        await executeOracleQuery(oraInsertTinh, oraParamsTinh);

        //Phân tán postgresl
      }
      const pgQueryTinh =
        "CREATE TABLE TINH (MaTinh VARCHAR(20) PRIMARY KEY, TenTinh VARCHAR(50))";
      await postgresClient.query(pgQueryTinh);
    }

    // Lấy dữ liệu truy vấn được từ SQL Server
    for (const row of resultsTinhPg) {
      const MaTinh = row.MaTinh;
      const TenTinh = row.TenTinh;

      // Thêm vào bảng tỉnh ở PostgreSQL
      const pgInsertTinh = "INSERT INTO TINH (MaTinh, TenTinh) VALUES ($1, $2)";
      const pgParamsTinh = [MaTinh, TenTinh];
      await postgresClient.query(pgInsertTinh, pgParamsTinh);
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán tỉnh ở MySQL" });
  }

  try {
    // Tán bảng chi nhanh đến MySQL
    const resultChiNhanhMysql = await sqlPool.request().query(chinhanhMysql);
    const resultsChiNhanhMysql = resultChiNhanhMysql.recordset;

    const resultChiNhanhOra = await sqlPool.request().query(chinhanhOra);
    const resultsChiNhanhOra = resultChiNhanhOra.recordset;

    const resultChiNhanhPg = await sqlPool.request().query(chinhanhPg);
    const resultsChiNhanhPg = resultChiNhanhPg.recordset;

    const countChiNhanhMysql = await isTableExistMysql("CHINHANH");
    const countChiNhanhOra = await isTableExistOra("CHINHANH");
    const countChiNhanhPg = await isTableExistPg("CHINHANH");

    if (countChiNhanhMysql && countChiNhanhOra && countChiNhanhPg) {
      res.send({ message: "Chi nhánh đã tồn tại trong các site" });
    } else {
      // Tạo bảng chi nhánh ở MySQL
      const createChiNhanhMysql =
        "CREATE TABLE CHINHANH (MaChiNhanh varchar(20) PRIMARY KEY, TenChiNhanh varchar(50), MaTinh varchar(20), FOREIGN KEY (MaTinh) REFERENCES TINH(MaTinh))";
      await mysqlConnection.promise().query(createChiNhanhMysql);

      // Insert dữ liệu vào bảng chi nhánh ở MySQL
      const insertChiNhanhMysql = `INSERT INTO CHINHANH (MaChiNhanh, TenChiNhanh, MaTinh) VALUES ?`;
      const valuesChiNhanhMysql = resultsChiNhanhMysql.map((row) => [
        row.MaChiNhanh,
        row.TenChiNhanh,
        row.MaTinh,
      ]);
      await mysqlConnection
        .promise()
        .query(insertChiNhanhMysql, [valuesChiNhanhMysql]);

      // Tạo bảng chi nhánh ở Oracle
      const oracleQueryChiNhanh =
        "CREATE TABLE CHINHANH (MaChiNhanh VARCHAR2(20) PRIMARY KEY, TenChiNhanh VARCHAR2(50), MaTinh VARCHAR2(20), FOREIGN KEY (MaTinh) REFERENCES TINH(MaTinh))";
      await executeOracleQuery(oracleQueryChiNhanh);

      // Insert dữ liệu vào bảng chi nhánh ở Oracle
      for (const row of resultsChiNhanhOra) {
        const MaChiNhanh = row.MaChiNhanh;
        const TenChiNhanh = row.TenChiNhanh;
        const MaTinh = row.MaTinh;

        const oraInsertChiNhanh =
          "INSERT INTO CHINHANH (MaChiNhanh, TenChiNhanh, MaTinh) VALUES (:MaChiNhanh, :TenChiNhanh, :MaTinh)";
        const oraParamsChiNhanh = [MaChiNhanh, TenChiNhanh, MaTinh];
        await executeOracleQuery(oraInsertChiNhanh, oraParamsChiNhanh);

        //Phân tán PostgreSQL
      }
      const pgQueryChiNhanh =
        "CREATE TABLE CHINHANH (MaChiNhanh VARCHAR(20) PRIMARY KEY, TenChiNhanh VARCHAR(50), MaTinh VARCHAR(20), FOREIGN KEY (MaTinh) REFERENCES TINH(MaTinh))";
      await postgresClient.query(pgQueryChiNhanh);

      // Insert dữ liệu vào bảng chi nhánh ở PostgreSQL
      for (const row of resultsChiNhanhPg) {
        const MaChiNhanh = row.MaChiNhanh;
        const TenChiNhanh = row.TenChiNhanh;
        const MaTinh = row.MaTinh;

        const pgInsertChiNhanh =
          "INSERT INTO CHINHANH (MaChiNhanh, TenChiNhanh, MaTinh) VALUES ($1, $2, $3)";
        const pgParamsChiNhanh = [MaChiNhanh, TenChiNhanh, MaTinh];
        await postgresClient.query(pgInsertChiNhanh, pgParamsChiNhanh);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán chi nhánh" });
  }

  try {
    // Tán bảng kho đến MySQL
    const resultKhoMysql = await sqlPool.request().query(khoMysql);
    const resultsKhoMysql = resultKhoMysql.recordset;

    const resultKhoOra = await sqlPool.request().query(khoOra);
    const resultsKhoOra = resultKhoOra.recordset;

    const resultKhoPg = await sqlPool.request().query(khoPg);
    const resultsKhoPg = resultKhoPg.recordset;

    const countKhoMysql = await isTableExistMysql("KHO");
    const countKhoOra = await isTableExistOra("KHO");
    const countKhoPg = await isTableExistPg("KHO");

    if (countKhoMysql && countKhoOra && countKhoPg) {
      res.send({ message: "Kho đã tồn tại trong các site" });
    } else {
      // Tạo bảng kho ở MySQL
      const createKhoMysql =
        "CREATE TABLE KHO (MaKho varchar(20) PRIMARY KEY, TenKho varchar(50), MaChiNhanh varchar(20), MaSanPham varchar(20), SoLuong int, FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await mysqlConnection.promise().query(createKhoMysql);

      // Insert dữ liệu vào bảng kho ở MySQL
      const insertKhoMysql = `INSERT INTO KHO (MaKho, TenKho, MaChiNhanh, MaSanPham, SoLuong) VALUES ?`;
      const valuesKhoMysql = resultsKhoMysql.map((row) => [
        row.MaKho,
        row.TenKho,
        row.MaChiNhanh,
        row.MaSanPham,
        row.SoLuong,
      ]);
      await mysqlConnection.promise().query(insertKhoMysql, [valuesKhoMysql]);

      // Tạo bảng kho ở Oracle
      const oracleQueryKho =
        "CREATE TABLE KHO (MaKho VARCHAR2(20) PRIMARY KEY, TenKho VARCHAR2(50), MaChiNhanh VARCHAR2(20), MaSanPham VARCHAR2(20), SoLuong NUMBER, FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await executeOracleQuery(oracleQueryKho);

      // Insert dữ liệu vào bảng kho ở Oracle
      for (const row of resultsKhoOra) {
        const MaKho = row.MaKho;
        const TenKho = row.TenKho;
        const MaChiNhanh = row.MaChiNhanh;
        const MaSanPham = row.MaSanPham;
        const SoLuong = row.SoLuong;

        const oraInsertKho =
          "INSERT INTO KHO (MaKho, TenKho, MaChiNhanh, MaSanPham, SoLuong) VALUES (:MaKho, :TenKho, :MaChiNhanh, :MaSanPham, :SoLuong)";
        const oraParamsKho = [MaKho, TenKho, MaChiNhanh, MaSanPham, SoLuong];
        await executeOracleQuery(oraInsertKho, oraParamsKho);

        // Phân tán PostgreSQL
      }
      const pgQueryKho =
        "CREATE TABLE KHO (MaKho VARCHAR(20) PRIMARY KEY, TenKho VARCHAR(50), MaChiNhanh VARCHAR(20), MaSanPham VARCHAR(20), SoLuong INTEGER, FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await postgresClient.query(pgQueryKho);

      // Insert dữ liệu vào bảng kho ở PostgreSQL
      for (const row of resultsKhoPg) {
        const MaKho = row.MaKho;
        const TenKho = row.TenKho;
        const MaChiNhanh = row.MaChiNhanh;
        const MaSanPham = row.MaSanPham;
        const SoLuong = row.SoLuong;

        const pgInsertKho =
          "INSERT INTO KHO (MaKho, TenKho, MaChiNhanh, MaSanPham, SoLuong) VALUES ($1, $2, $3, $4, $5)";
        const pgParamsKho = [MaKho, TenKho, MaChiNhanh, MaSanPham, SoLuong];
        await postgresClient.query(pgInsertKho, pgParamsKho);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán kho" });
  }

  //Phân tán danh mục
  try {
    // Tán bảng danhmuc đến MySQL
    const resultDanhMucMysql = await sqlPool.request().query(danhmuc);
    const resultsDanhMucMysql = resultDanhMucMysql.recordset;

    const countDanhMucMysql = await isTableExistMysql("DANHMUC");
    const countDanhMucOra = await isTableExistOra("DANHMUC");
    const countDanhMucPg = await isTableExistPg("DANHMUC");

    if (countDanhMucMysql && countDanhMucOra && countDanhMucPg) {
      res.send({ message: "Danh mục đã tồn tại trong các site" });
    } else {
      // Tạo bảng danhmuc ở MySQL
      const createDanhMucMysql =
        "CREATE TABLE DANHMUC (MaDanhMuc varchar(20) PRIMARY KEY, TenDanhMuc varchar(50))";
      await mysqlConnection.promise().query(createDanhMucMysql);

      // Insert dữ liệu vào bảng danhmuc ở MySQL
      const insertDanhMucMysql = `INSERT INTO DANHMUC (MaDanhMuc, TenDanhMuc) VALUES ?`;
      const valuesDanhMucMysql = resultsDanhMucMysql.map((row) => [
        row.MaDanhMuc,
        row.TenDanhMuc,
      ]);
      await mysqlConnection
        .promise()
        .query(insertDanhMucMysql, [valuesDanhMucMysql]);

      // Tạo bảng danhmuc ở Oracle
      const oracleQueryDanhMuc =
        "CREATE TABLE DANHMUC (MaDanhMuc VARCHAR2(20) PRIMARY KEY, TenDanhMuc VARCHAR2(50))";
      await executeOracleQuery(oracleQueryDanhMuc);

      // Insert dữ liệu vào bảng danhmuc ở Oracle
      for (const row of resultsDanhMucMysql) {
        const MaDanhMuc = row.MaDanhMuc;
        const TenDanhMuc = row.TenDanhMuc;

        const oraInsertDanhMuc =
          "INSERT INTO DANHMUC (MaDanhMuc, TenDanhMuc) VALUES (:MaDanhMuc, :TenDanhMuc)";
        const oraParamsDanhMuc = [MaDanhMuc, TenDanhMuc];
        await executeOracleQuery(oraInsertDanhMuc, oraParamsDanhMuc);

        // Phân tán PostgreSQL
      }
      const pgQueryDanhMuc =
        "CREATE TABLE DANHMUC (MaDanhMuc VARCHAR(20) PRIMARY KEY, TenDanhMuc VARCHAR(50))";
      await postgresClient.query(pgQueryDanhMuc);

      // Insert dữ liệu vào bảng danhmuc ở PostgreSQL
      for (const row of resultsDanhMucMysql) {
        const MaDanhMuc = row.MaDanhMuc;
        const TenDanhMuc = row.TenDanhMuc;

        const pgInsertDanhMuc =
          "INSERT INTO DANHMUC (MaDanhMuc, TenDanhMuc) VALUES ($1, $2)";
        const pgParamsDanhMuc = [MaDanhMuc, TenDanhMuc];
        await postgresClient.query(pgInsertDanhMuc, pgParamsDanhMuc);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán danh mục" });
  }

  //Phân tán thương hiệu
  try {
    // Tán bảng thuonghieu đến MySQL
    const resultThuongHieuMysql = await sqlPool.request().query(thuonghieu);
    const resultsThuongHieuMysql = resultThuongHieuMysql.recordset;

    const countThuongHieuMysql = await isTableExistMysql("THUONGHIEU");
    const countThuongHieuOra = await isTableExistOra("THUONGHIEU");
    const countThuongHieuPg = await isTableExistPg("THUONGHIEU");

    if (countThuongHieuMysql && countThuongHieuOra && countThuongHieuPg) {
      res.send({ message: "Thương hiệu đã tồn tại trong các site" });
    } else {
      // Tạo bảng thuonghieu ở MySQL
      const createThuongHieuMysql =
        "CREATE TABLE THUONGHIEU (MaThuongHieu varchar(20) PRIMARY KEY, TenThuongHieu varchar(50))";
      await mysqlConnection.promise().query(createThuongHieuMysql);

      // Insert dữ liệu vào bảng thuonghieu ở MySQL
      const insertThuongHieuMysql = `INSERT INTO THUONGHIEU (MaThuongHieu, TenThuongHieu) VALUES ?`;
      const valuesThuongHieuMysql = resultsThuongHieuMysql.map((row) => [
        row.MaThuongHieu,
        row.TenThuongHieu,
      ]);
      await mysqlConnection
        .promise()
        .query(insertThuongHieuMysql, [valuesThuongHieuMysql]);

      // Tạo bảng thuonghieu ở Oracle
      const oracleQueryThuongHieu =
        "CREATE TABLE THUONGHIEU (MaThuongHieu VARCHAR2(20) PRIMARY KEY, TenThuongHieu VARCHAR2(50))";
      await executeOracleQuery(oracleQueryThuongHieu);

      // Insert dữ liệu vào bảng thuonghieu ở Oracle
      for (const row of resultsThuongHieuMysql) {
        const MaThuongHieu = row.MaThuongHieu;
        const TenThuongHieu = row.TenThuongHieu;

        const oraInsertThuongHieu =
          "INSERT INTO THUONGHIEU (MaThuongHieu, TenThuongHieu) VALUES (:MaThuongHieu, :TenThuongHieu)";
        const oraParamsThuongHieu = [MaThuongHieu, TenThuongHieu];
        await executeOracleQuery(oraInsertThuongHieu, oraParamsThuongHieu);

        // Phân tán PostgreSQL
      }
      const pgQueryThuongHieu =
        "CREATE TABLE THUONGHIEU (MaThuongHieu VARCHAR(20) PRIMARY KEY, TenThuongHieu VARCHAR(50))";
      await postgresClient.query(pgQueryThuongHieu);

      // Insert dữ liệu vào bảng thuonghieu ở PostgreSQL
      for (const row of resultsThuongHieuMysql) {
        const MaThuongHieu = row.MaThuongHieu;
        const TenThuongHieu = row.TenThuongHieu;

        const pgInsertThuongHieu =
          "INSERT INTO THUONGHIEU (MaThuongHieu, TenThuongHieu) VALUES ($1, $2)";
        const pgParamsThuongHieu = [MaThuongHieu, TenThuongHieu];
        await postgresClient.query(pgInsertThuongHieu, pgParamsThuongHieu);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán thương hiệu" });
  }

  //Phân tán sản phẩm
  try {
    // Tán bảng sanpham đến MySQL
    const resultSanPhamMysql = await sqlPool.request().query(sanPhamMysql);
    const resultsSanPhamMysql = resultSanPhamMysql.recordset;

    const resultSanPhamOra = await sqlPool.request().query(sanPhamOra);
    const resultsSanPhamOra = resultSanPhamOra.recordset;

    const resultSanPhamPg = await sqlPool.request().query(sanPhamPg);
    const resultsSanPhamPg = resultSanPhamPg.recordset;

    const countSanPhamMysql = await isTableExistMysql("SANPHAM");
    const countSanPhamOra = await isTableExistOra("SANPHAM");
    const countSanPhamPg = await isTableExistPg("SANPHAM");

    if (countSanPhamMysql && countSanPhamOra && countSanPhamPg) {
      res.send({ message: "Sản phẩm đã tồn tại trong các site" });
    } else {
      // Tạo bảng sanpham ở MySQL
      const createSanPhamMysql =
        "CREATE TABLE SANPHAM (MaSanPham varchar(20) PRIMARY KEY, MaChiNhanh varchar(20), TenSanPham varchar(100), GiaSanPham decimal(18, 2), MaDanhMuc varchar(20), MaThuongHieu varchar(20), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh), FOREIGN KEY (MaDanhMuc) REFERENCES DANHMUC(MaDanhMuc), FOREIGN KEY (MaThuongHieu) REFERENCES THUONGHIEU(MaThuongHieu))";
      await mysqlConnection.promise().query(createSanPhamMysql);

      // Insert dữ liệu vào bảng sanpham ở MySQL
      const insertSanPhamMysql = `INSERT INTO SANPHAM (MaSanPham, MaChiNhanh, TenSanPham, GiaSanPham, MaDanhMuc, MaThuongHieu) VALUES ?`;
      const valuesSanPhamMysql = resultsSanPhamMysql.map((row) => [
        row.MaSanPham,
        row.MaChiNhanh,
        row.TenSanPham,
        row.GiaSanPham,
        row.MaDanhMuc,
        row.MaThuongHieu,
      ]);
      await mysqlConnection
        .promise()
        .query(insertSanPhamMysql, [valuesSanPhamMysql]);

      // Tạo bảng sanpham ở Oracle
      const oracleQuerySanPham =
        "CREATE TABLE SANPHAM (MaSanPham VARCHAR2(20) PRIMARY KEY, MaChiNhanh VARCHAR2(20), TenSanPham VARCHAR2(100), GiaSanPham NUMBER(18,2), MaDanhMuc VARCHAR2(20), MaThuongHieu VARCHAR2(20), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh), FOREIGN KEY (MaDanhMuc) REFERENCES DANHMUC(MaDanhMuc), FOREIGN KEY (MaThuongHieu) REFERENCES THUONGHIEU(MaThuongHieu))";
      await executeOracleQuery(oracleQuerySanPham);

      // Insert dữ liệu vào bảng sanpham ở Oracle
      for (const row of resultsSanPhamOra) {
        const MaSanPham = row.MaSanPham;
        const MaChiNhanh = row.MaChiNhanh;
        const TenSanPham = row.TenSanPham;
        const GiaSanPham = row.GiaSanPham;
        const MaDanhMuc = row.MaDanhMuc;
        const MaThuongHieu = row.MaThuongHieu;

        const oraInsertSanPham =
          "INSERT INTO SANPHAM (MaSanPham, MaChiNhanh, TenSanPham, GiaSanPham, MaDanhMuc, MaThuongHieu) VALUES (:MaSanPham, :MaChiNhanh, :TenSanPham, :GiaSanPham, :MaDanhMuc, :MaThuongHieu)";
        const oraParamsSanPham = [
          MaSanPham,
          MaChiNhanh,
          TenSanPham,
          GiaSanPham,
          MaDanhMuc,
          MaThuongHieu,
        ];
        await executeOracleQuery(oraInsertSanPham, oraParamsSanPham);

        // Phân tán PostgreSQL
      }
      const pgQuerySanPham =
        "CREATE TABLE SANPHAM (MaSanPham VARCHAR(20) PRIMARY KEY, MaChiNhanh VARCHAR(20), TenSanPham VARCHAR(100), GiaSanPham DECIMAL(18,2), MaDanhMuc VARCHAR(20), MaThuongHieu VARCHAR(20), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh), FOREIGN KEY (MaDanhMuc) REFERENCES DANHMUC(MaDanhMuc), FOREIGN KEY (MaThuongHieu) REFERENCES THUONGHIEU(MaThuongHieu))";
      await postgresClient.query(pgQuerySanPham);

      // Insert dữ liệu vào bảng sanpham ở PostgreSQL
      for (const row of resultsSanPhamPg) {
        const MaSanPham = row.MaSanPham;
        const MaChiNhanh = row.MaChiNhanh;
        const TenSanPham = row.TenSanPham;
        const GiaSanPham = row.GiaSanPham;
        const MaDanhMuc = row.MaDanhMuc;
        const MaThuongHieu = row.MaThuongHieu;

        const pgInsertSanPham =
          "INSERT INTO SANPHAM (MaSanPham, MaChiNhanh, TenSanPham, GiaSanPham, MaDanhMuc, MaThuongHieu) VALUES ($1, $2, $3, $4, $5, $6)";
        const pgParamsSanPham = [
          MaSanPham,
          MaChiNhanh,
          TenSanPham,
          GiaSanPham,
          MaDanhMuc,
          MaThuongHieu,
        ];
        await postgresClient.query(pgInsertSanPham, pgParamsSanPham);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán sản phẩm" });
  }

  try {
    // Tán bảng nhacungcap đến MySQL
    const resultNhaCungCapMysql = await sqlPool.request().query(nhaCungCap);
    const resultsNhaCungCapMysql = resultNhaCungCapMysql.recordset;

    const countNhaCungCapMysql = await isTableExistMysql("NHACUNGCAP");
    const countNhaCungCapOra = await isTableExistOra("NHACUNGCAP");
    const countNhaCungCapPg = await isTableExistPg("NHACUNGCAP");

    if (countNhaCungCapMysql && countNhaCungCapOra && countNhaCungCapPg) {
      res.send({ message: "Nhà cung cấp đã tồn tại trong các site" });
    } else {
      // Tạo bảng nhacungcap ở MySQL
      const createNhaCungCapMysql =
        "CREATE TABLE NHACUNGCAP (MaNhaCungCap varchar(20) PRIMARY KEY, TenNhaCungCap varchar(50), DiaChi varchar(100))";
      await mysqlConnection.promise().query(createNhaCungCapMysql);

      // Insert dữ liệu vào bảng nhacungcap ở MySQL
      const insertNhaCungCapMysql = `INSERT INTO NHACUNGCAP (MaNhaCungCap, TenNhaCungCap, DiaChi) VALUES ?`;
      const valuesNhaCungCapMysql = resultsNhaCungCapMysql.map((row) => [
        row.MaNhaCungCap,
        row.TenNhaCungCap,
        row.DiaChi,
      ]);
      await mysqlConnection
        .promise()
        .query(insertNhaCungCapMysql, [valuesNhaCungCapMysql]);

      // Tạo bảng nhacungcap ở Oracle
      const oracleQueryNhaCungCap =
        "CREATE TABLE NHACUNGCAP (MaNhaCungCap VARCHAR2(20) PRIMARY KEY, TenNhaCungCap VARCHAR2(50), DiaChi VARCHAR2(100))";
      await executeOracleQuery(oracleQueryNhaCungCap);

      // Insert dữ liệu vào bảng nhacungcap ở Oracle
      for (const row of resultsNhaCungCapMysql) {
        const MaNhaCungCap = row.MaNhaCungCap;
        const TenNhaCungCap = row.TenNhaCungCap;
        const DiaChi = row.DiaChi;

        const oraInsertNhaCungCap =
          "INSERT INTO NHACUNGCAP (MaNhaCungCap, TenNhaCungCap, DiaChi) VALUES (:MaNhaCungCap, :TenNhaCungCap, :DiaChi)";
        const oraParamsNhaCungCap = [MaNhaCungCap, TenNhaCungCap, DiaChi];
        await executeOracleQuery(oraInsertNhaCungCap, oraParamsNhaCungCap);

        // Phân tán PostgreSQL
      }
      const pgQueryNhaCungCap =
        "CREATE TABLE NHACUNGCAP (MaNhaCungCap VARCHAR(20) PRIMARY KEY, TenNhaCungCap VARCHAR(50), DiaChi VARCHAR(100))";
      await postgresClient.query(pgQueryNhaCungCap);

      // Insert dữ liệu vào bảng nhacungcap ở PostgreSQL
      for (const row of resultsNhaCungCapMysql) {
        const MaNhaCungCap = row.MaNhaCungCap;
        const TenNhaCungCap = row.TenNhaCungCap;
        const DiaChi = row.DiaChi;

        const pgInsertNhaCungCap =
          "INSERT INTO NHACUNGCAP (MaNhaCungCap, TenNhaCungCap, DiaChi) VALUES ($1, $2, $3)";
        const pgParamsNhaCungCap = [MaNhaCungCap, TenNhaCungCap, DiaChi];
        await postgresClient.query(pgInsertNhaCungCap, pgParamsNhaCungCap);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán nhà cung cấp" });
  }

  //Phân tán phiếu nhập
  try {
    // Tán bảng phieunhap đến MySQL
    const resultPhieuNhapMysql = await sqlPool.request().query(phieuNhapMysql);
    const resultsPhieuNhapMysql = resultPhieuNhapMysql.recordset;

    const resultPhieuNhapOra = await sqlPool.request().query(phieuNhapOra);
    const resultsPhieuNhapOra = resultPhieuNhapOra.recordset;

    const resultPhieuNhapPg = await sqlPool.request().query(phieuNhapPg);
    const resultsPhieuNhapPg = resultPhieuNhapPg.recordset;

    const countPhieuNhapMysql = await isTableExistMysql("PHIEUNHAP");
    const countPhieuNhapOra = await isTableExistOra("PHIEUNHAP");
    const countPhieuNhapPg = await isTableExistPg("PHIEUNHAP");

    if (countPhieuNhapMysql && countPhieuNhapOra && countPhieuNhapPg) {
      res.send({ message: "Phiếu nhập đã tồn tại trong các site" });
    } else {
      // Tạo bảng phieunhap ở MySQL
      const createPhieuNhapMysql =
        "CREATE TABLE PHIEUNHAP (MaPhieuNhap varchar(20) PRIMARY KEY, MaNhaCungCap varchar(20), MaChiNhanh varchar(20), NgayNhap DATE, TongTien DECIMAL(18, 2), FOREIGN KEY (MaNhaCungCap) REFERENCES NHACUNGCAP(MaNhaCungCap), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await mysqlConnection.promise().query(createPhieuNhapMysql);

      // Insert dữ liệu vào bảng phieunhap ở MySQL
      const insertPhieuNhapMysql = `INSERT INTO PHIEUNHAP (MaPhieuNhap, MaNhaCungCap, MaChiNhanh, NgayNhap, TongTien) VALUES ?`;
      const valuesPhieuNhapMysql = resultsPhieuNhapMysql.map((row) => [
        row.MaPhieuNhap,
        row.MaNhaCungCap,
        row.MaChiNhanh,
        row.NgayNhap,
        row.TongTien,
      ]);
      await mysqlConnection
        .promise()
        .query(insertPhieuNhapMysql, [valuesPhieuNhapMysql]);

      // Tạo bảng phieunhap ở Oracle
      const oracleQueryPhieuNhap =
        "CREATE TABLE PHIEUNHAP (MaPhieuNhap VARCHAR2(20) PRIMARY KEY, MaNhaCungCap VARCHAR2(20), MaChiNhanh VARCHAR2(20), NgayNhap DATE, TongTien NUMBER(18, 2), FOREIGN KEY (MaNhaCungCap) REFERENCES NHACUNGCAP(MaNhaCungCap), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await executeOracleQuery(oracleQueryPhieuNhap);

      // Insert dữ liệu vào bảng phieunhap ở Oracle
      for (const row of resultsPhieuNhapOra) {
        const MaPhieuNhap = row.MaPhieuNhap;
        const MaNhaCungCap = row.MaNhaCungCap;
        const MaChiNhanh = row.MaChiNhanh;
        const NgayNhap = row.NgayNhap;
        const TongTien = row.TongTien;

        const oraInsertPhieuNhap =
          "INSERT INTO PHIEUNHAP (MaPhieuNhap, MaNhaCungCap, MaChiNhanh, NgayNhap, TongTien) VALUES (:MaPhieuNhap, :MaNhaCungCap, :MaChiNhanh, TO_DATE(:NgayNhap, 'yyyy-mm-dd'), :TongTien)";
        const oraParamsPhieuNhap = [
          MaPhieuNhap,
          MaNhaCungCap,
          MaChiNhanh,
          dayjs(NgayNhap).format("YYYY/MM/DD"),
          TongTien,
        ];
        await executeOracleQuery(oraInsertPhieuNhap, oraParamsPhieuNhap);

        // Phân tán PostgreSQL
      }
      const pgQueryPhieuNhap =
        "CREATE TABLE PHIEUNHAP (MaPhieuNhap VARCHAR(20) PRIMARY KEY, MaNhaCungCap VARCHAR(20), MaChiNhanh VARCHAR(20), NgayNhap DATE, TongTien DECIMAL(18, 2), FOREIGN KEY (MaNhaCungCap) REFERENCES NHACUNGCAP(MaNhaCungCap), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await postgresClient.query(pgQueryPhieuNhap);

      // Insert dữ liệu vào bảng phieunhap ở PostgreSQL
      for (const row of resultsPhieuNhapPg) {
        const MaPhieuNhap = row.MaPhieuNhap;
        const MaNhaCungCap = row.MaNhaCungCap;
        const MaChiNhanh = row.MaChiNhanh;
        const NgayNhap = row.NgayNhap;
        const TongTien = row.TongTien;

        const pgInsertPhieuNhap =
          "INSERT INTO PHIEUNHAP (MaPhieuNhap, MaNhaCungCap, MaChiNhanh, NgayNhap, TongTien) VALUES ($1, $2, $3, $4, $5)";
        const pgParamsPhieuNhap = [
          MaPhieuNhap,
          MaNhaCungCap,
          MaChiNhanh,
          NgayNhap,
          TongTien,
        ];
        await postgresClient.query(pgInsertPhieuNhap, pgParamsPhieuNhap);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán phiếu nhập" });
  }

  try {
    // Tán bảng chitietphieunhap đến MySQL
    const resultChiTietPhieuNhapMysql = await sqlPool
      .request()
      .query(chiTietPhieuNhapMysql);
    const resultsChiTietPhieuNhapMysql = resultChiTietPhieuNhapMysql.recordset;

    const resultChiTietPhieuNhapOra = await sqlPool
      .request()
      .query(chiTietPhieuNhapOra);
    const resultsChiTietPhieuNhapOra = resultChiTietPhieuNhapOra.recordset;

    const resultChiTietPhieuNhapPg = await sqlPool
      .request()
      .query(chiTietPhieuNhapPg);
    const resultsChiTietPhieuNhapPg = resultChiTietPhieuNhapPg.recordset;

    const countChiTietPhieuNhapMysql = await isTableExistMysql(
      "CHITIETPHIEUNHAP"
    );
    const countChiTietPhieuNhapOra = await isTableExistOra("CHITIETPHIEUNHAP");
    const countChiTietPhieuNhapPg = await isTableExistPg("CHITIETPHIEUNHAP");

    if (
      countChiTietPhieuNhapMysql &&
      countChiTietPhieuNhapOra &&
      countChiTietPhieuNhapPg
    ) {
      res.send({ message: "Chi tiết phiếu nhập đã tồn tại trong các site" });
    } else {
      // Tạo bảng chitietphieunhap ở MySQL
      const createChiTietPhieuNhapMysql =
        "CREATE TABLE CHITIETPHIEUNHAP (MaPhieuNhap varchar(20), MaSanPham varchar(20), SoLuong INT, DonGia DECIMAL(18, 2), PRIMARY KEY (MaPhieuNhap, MaSanPham), FOREIGN KEY (MaPhieuNhap) REFERENCES PHIEUNHAP(MaPhieuNhap), FOREIGN KEY (MaSanPham) REFERENCES SANPHAM(MaSanPham))";
      await mysqlConnection.promise().query(createChiTietPhieuNhapMysql);

      // Insert dữ liệu vào bảng chitietphieunhap ở MySQL
      const insertChiTietPhieuNhapMysql = `INSERT INTO CHITIETPHIEUNHAP (MaPhieuNhap, MaSanPham, SoLuong, DonGia) VALUES ?`;
      const valuesChiTietPhieuNhapMysql = resultsChiTietPhieuNhapMysql.map(
        (row) => [row.MaPhieuNhap, row.MaSanPham, row.SoLuong, row.DonGia]
      );
      await mysqlConnection
        .promise()
        .query(insertChiTietPhieuNhapMysql, [valuesChiTietPhieuNhapMysql]);

      // Tạo bảng chitietphieunhap ở Oracle
      const oracleQueryChiTietPhieuNhap =
        "CREATE TABLE CHITIETPHIEUNHAP (MaPhieuNhap VARCHAR2(20), MaSanPham VARCHAR2(20), SoLuong NUMBER, DonGia NUMBER(18, 2), PRIMARY KEY (MaPhieuNhap, MaSanPham), FOREIGN KEY (MaPhieuNhap) REFERENCES PHIEUNHAP(MaPhieuNhap), FOREIGN KEY (MaSanPham) REFERENCES SANPHAM(MaSanPham))";
      await executeOracleQuery(oracleQueryChiTietPhieuNhap);

      // Insert dữ liệu vào bảng chitietphieunhap ở Oracle
      for (const row of resultsChiTietPhieuNhapOra) {
        const MaPhieuNhap = row.MaPhieuNhap;
        const MaSanPham = row.MaSanPham;
        const SoLuong = row.SoLuong;
        const DonGia = row.DonGia;

        const oraInsertChiTietPhieuNhap =
          "INSERT INTO CHITIETPHIEUNHAP (MaPhieuNhap, MaSanPham, SoLuong, DonGia) VALUES (:MaPhieuNhap, :MaSanPham, :SoLuong, :DonGia)";
        const oraParamsChiTietPhieuNhap = [
          MaPhieuNhap,
          MaSanPham,
          SoLuong,
          DonGia,
        ];
        await executeOracleQuery(
          oraInsertChiTietPhieuNhap,
          oraParamsChiTietPhieuNhap
        );

        // Phân tán PostgreSQL
      }
      const pgQueryChiTietPhieuNhap =
        "CREATE TABLE CHITIETPHIEUNHAP (MaPhieuNhap VARCHAR(20), MaSanPham VARCHAR(20), SoLuong INT, DonGia DECIMAL(18, 2), PRIMARY KEY (MaPhieuNhap, MaSanPham), FOREIGN KEY (MaPhieuNhap) REFERENCES PHIEUNHAP(MaPhieuNhap), FOREIGN KEY (MaSanPham) REFERENCES SANPHAM(MaSanPham))";
      await postgresClient.query(pgQueryChiTietPhieuNhap);

      // Insert dữ liệu vào bảng chitietphieunhap ở PostgreSQL
      for (const row of resultsChiTietPhieuNhapPg) {
        const MaPhieuNhap = row.MaPhieuNhap;
        const MaSanPham = row.MaSanPham;
        const SoLuong = row.SoLuong;
        const DonGia = row.DonGia;

        const pgInsertChiTietPhieuNhap =
          "INSERT INTO CHITIETPHIEUNHAP (MaPhieuNhap, MaSanPham, SoLuong, DonGia) VALUES ($1, $2, $3, $4)";
        const pgParamsChiTietPhieuNhap = [
          MaPhieuNhap,
          MaSanPham,
          SoLuong,
          DonGia,
        ];
        await postgresClient.query(
          pgInsertChiTietPhieuNhap,
          pgParamsChiTietPhieuNhap
        );
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán chi tiết phiếu nhập" });
  }

  //Phân tán nhân viên
  try {
    // Tán bảng nhanvien đến MySQL
    const resultNhanVienMysql = await sqlPool.request().query(nhanVienMysql);
    const resultsNhanVienMysql = resultNhanVienMysql.recordset;

    const resultNhanVienOra = await sqlPool.request().query(nhanVienOra);
    const resultsNhanVienOra = resultNhanVienOra.recordset;

    const resultNhanVienPg = await sqlPool.request().query(nhanVienPg);
    const resultsNhanVienPg = resultNhanVienPg.recordset;

    const countNhanVienMysql = await isTableExistMysql("NHANVIEN");
    const countNhanVienOra = await isTableExistOra("NHANVIEN");
    const countNhanVienPg = await isTableExistPg("NHANVIEN");

    if (countNhanVienMysql && countNhanVienOra && countNhanVienPg) {
      res.send({ message: "Nhân viên đã tồn tại trong các site" });
    } else {
      // Tạo bảng nhanvien ở MySQL
      const createNhanVienMysql =
        "CREATE TABLE NHANVIEN (MaNhanVien varchar(20) primary key, MaChiNhanh varchar(20), TenNhanVien varchar(50), DiaChi varchar(100), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await mysqlConnection.promise().query(createNhanVienMysql);

      // Insert dữ liệu vào bảng nhanvien ở MySQL
      const insertNhanVienMysql = `INSERT INTO NHANVIEN (MaNhanVien, MaChiNhanh, TenNhanVien, DiaChi) VALUES ?`;
      const valuesNhanVienMysql = resultsNhanVienMysql.map((row) => [
        row.MaNhanVien,
        row.MaChiNhanh,
        row.TenNhanVien,
        row.DiaChi,
      ]);
      await mysqlConnection
        .promise()
        .query(insertNhanVienMysql, [valuesNhanVienMysql]);

      // Tạo bảng nhanvien ở Oracle
      const oracleQueryNhanVien =
        "CREATE TABLE NHANVIEN (MaNhanVien VARCHAR2(20) PRIMARY KEY, MaChiNhanh VARCHAR2(20), TenNhanVien VARCHAR2(50), DiaChi VARCHAR2(100), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await executeOracleQuery(oracleQueryNhanVien);

      // Insert dữ liệu vào bảng nhanvien ở Oracle
      for (const row of resultsNhanVienOra) {
        const MaNhanVien = row.MaNhanVien;
        const MaChiNhanh = row.MaChiNhanh;
        const TenNhanVien = row.TenNhanVien;
        const DiaChi = row.DiaChi;

        const oraInsertNhanVien =
          "INSERT INTO NHANVIEN (MaNhanVien, MaChiNhanh, TenNhanVien, DiaChi) VALUES (:MaNhanVien, :MaChiNhanh, :TenNhanVien, :DiaChi)";
        const oraParamsNhanVien = [MaNhanVien, MaChiNhanh, TenNhanVien, DiaChi];
        await executeOracleQuery(oraInsertNhanVien, oraParamsNhanVien);

        // Phân tán PostgreSQL
      }
      const pgQueryNhanVien =
        "CREATE TABLE NHANVIEN (MaNhanVien VARCHAR(20) PRIMARY KEY, MaChiNhanh VARCHAR(20), TenNhanVien VARCHAR(50), DiaChi VARCHAR(100), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await postgresClient.query(pgQueryNhanVien);

      // Insert dữ liệu vào bảng nhanvien ở PostgreSQL
      for (const row of resultsNhanVienPg) {
        const MaNhanVien = row.MaNhanVien;
        const MaChiNhanh = row.MaChiNhanh;
        const TenNhanVien = row.TenNhanVien;
        const DiaChi = row.DiaChi;

        const pgInsertNhanVien =
          "INSERT INTO NHANVIEN (MaNhanVien, MaChiNhanh, TenNhanVien, DiaChi) VALUES ($1, $2, $3, $4)";
        const pgParamsNhanVien = [MaNhanVien, MaChiNhanh, TenNhanVien, DiaChi];
        await postgresClient.query(pgInsertNhanVien, pgParamsNhanVien);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán nhân viên" });
  }

  //Phân tán tài khoản người dùng
  try {
    // Tán bảng taikhoan đến MySQL
    const resultTaiKhoanMysql = await sqlPool.request().query(taiKhoanMysql);
    const resultsTaiKhoanMysql = resultTaiKhoanMysql.recordset;

    const resultTaiKhoanOra = await sqlPool.request().query(taiKhoanOra);
    const resultsTaiKhoanOra = resultTaiKhoanOra.recordset;

    const resultTaiKhoanPg = await sqlPool.request().query(taiKhoanPg);
    const resultsTaiKhoanPg = resultTaiKhoanPg.recordset;

    const countTaiKhoanMysql = await isTableExistMysql("TAIKHOAN");
    const countTaiKhoanOra = await isTableExistOra("TAIKHOAN");
    const countTaiKhoanPg = await isTableExistPg("TAIKHOAN");

    if (countTaiKhoanMysql && countTaiKhoanOra && countTaiKhoanPg) {
      res.send({ message: "Tài khoản đã tồn tại trong các site" });
    } else {
      // Tạo bảng taikhoan ở MySQL
      const createTaiKhoanMysql =
        "CREATE TABLE TAIKHOAN (TenTK varchar(50) primary key, MaNhanVien varchar(20), MatKhau varchar(50), Quyen varchar(10), FOREIGN KEY (MaNhanVien) REFERENCES NHANVIEN(MaNhanVien))";
      await mysqlConnection.promise().query(createTaiKhoanMysql);

      // Insert dữ liệu vào bảng taikhoan ở MySQL
      const insertTaiKhoanMysql = `INSERT INTO TAIKHOAN (TenTK, MaNhanVien, MatKhau, Quyen) VALUES ?`;
      const valuesTaiKhoanMysql = resultsTaiKhoanMysql.map((row) => [
        row.TenTK,
        row.MaNhanVien,
        row.MatKhau,
        row.Quyen,
      ]);
      await mysqlConnection
        .promise()
        .query(insertTaiKhoanMysql, [valuesTaiKhoanMysql]);

      // Tạo bảng taikhoan ở Oracle
      const oracleQueryTaiKhoan =
        "CREATE TABLE TAIKHOAN (TenTK VARCHAR2(50) PRIMARY KEY, MaNhanVien VARCHAR2(20), MatKhau VARCHAR2(50), Quyen VARCHAR2(10), FOREIGN KEY (MaNhanVien) REFERENCES NHANVIEN(MaNhanVien))";
      await executeOracleQuery(oracleQueryTaiKhoan);

      // Insert dữ liệu vào bảng taikhoan ở Oracle
      for (const row of resultsTaiKhoanOra) {
        const TenTK = row.TenTK;
        const MaNhanVien = row.MaNhanVien;
        const MatKhau = row.MatKhau;
        const Quyen = row.Quyen;

        const oraInsertTaiKhoan =
          "INSERT INTO TAIKHOAN (TenTK, MaNhanVien, Matkhau, Quyen) VALUES (:TenTK, :MaNhanVien, :MatKhau, :Quyen)";
        const oraParamsTaiKhoan = [TenTK, MaNhanVien, MatKhau, Quyen];
        await executeOracleQuery(oraInsertTaiKhoan, oraParamsTaiKhoan);

        // Phân tán PostgreSQL
      }
      const pgQueryTaiKhoan =
        "CREATE TABLE TAIKHOAN (TenTK VARCHAR(50) PRIMARY KEY, MaNhanVien VARCHAR(20), MatKhau VARCHAR(50), Quyen VARCHAR(10), FOREIGN KEY (MaNhanVien) REFERENCES NHANVIEN(MaNhanVien))";
      await postgresClient.query(pgQueryTaiKhoan);

      // Insert dữ liệu vào bảng taikhoan ở PostgreSQL
      for (const row of resultsTaiKhoanPg) {
        const TenTK = row.TenTK;
        const MaNhanVien = row.MaNhanVien;
        const MatKhau = row.MatKhau;
        const Quyen = row.Quyen;

        const pgInsertTaiKhoan =
          "INSERT INTO TAIKHOAN (TenTK, MaNhanVien, MatKhau, Quyen) VALUES ($1, $2, $3, $4)";
        const pgParamsTaiKhoan = [TenTK, MaNhanVien, MatKhau, Quyen];
        await postgresClient.query(pgInsertTaiKhoan, pgParamsTaiKhoan);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán tài khoản" });
  }

  //Phân tán loại khách hàng
  try {
    // Tán bảng loaikhachhang đến MySQL
    const resultLoaiKhachHangMysql = await sqlPool
      .request()
      .query(loaiKhachHang);
    const resultsLoaiKhachHangMysql = resultLoaiKhachHangMysql.recordset;

    const countLoaiKhachHangMysql = await isTableExistMysql("LOAIKHACHHANG");
    const countLoaiKhachHangOra = await isTableExistOra("LOAIKHACHHANG");
    const countLoaiKhachHangPg = await isTableExistPg("LOAIKHACHHANG");

    if (
      countLoaiKhachHangMysql &&
      countLoaiKhachHangOra &&
      countLoaiKhachHangPg
    ) {
      res.send({ message: "Loại khách hàng đã tồn tại trong các site" });
    } else {
      // Tạo bảng loaikhachhang ở MySQL
      const createLoaiKhachHangMysql =
        "CREATE TABLE LOAIKHACHHANG (MaLoaiKhachHang varchar(20) primary key, TenLoaiKhachHang varchar(50))";
      await mysqlConnection.promise().query(createLoaiKhachHangMysql);

      // Insert dữ liệu vào bảng loaikhachhang ở MySQL
      const insertLoaiKhachHangMysql = `INSERT INTO LOAIKHACHHANG (MaLoaiKhachHang, TenLoaiKhachHang) VALUES ?`;
      const valuesLoaiKhachHangMysql = resultsLoaiKhachHangMysql.map((row) => [
        row.MaLoaiKhachHang,
        row.TenLoaiKhachHang,
      ]);
      await mysqlConnection
        .promise()
        .query(insertLoaiKhachHangMysql, [valuesLoaiKhachHangMysql]);

      // Tạo bảng loaikhachhang ở Oracle
      const oracleQueryLoaiKhachHang =
        "CREATE TABLE LOAIKHACHHANG (MaLoaiKhachHang VARCHAR2(20) PRIMARY KEY, TenLoaiKhachHang VARCHAR2(50))";
      await executeOracleQuery(oracleQueryLoaiKhachHang);

      // Insert dữ liệu vào bảng loaikhachhang ở Oracle
      for (const row of resultsLoaiKhachHangMysql) {
        const MaLoaiKhachHang = row.MaLoaiKhachHang;
        const TenLoaiKhachHang = row.TenLoaiKhachHang;

        const oraInsertLoaiKhachHang =
          "INSERT INTO LOAIKHACHHANG (MaLoaiKhachHang, TenLoaiKhachHang) VALUES (:MaLoaiKhachHang, :TenLoaiKhachHang)";
        const oraParamsLoaiKhachHang = [MaLoaiKhachHang, TenLoaiKhachHang];
        await executeOracleQuery(
          oraInsertLoaiKhachHang,
          oraParamsLoaiKhachHang
        );

        // Phân tán PostgreSQL
      }
      const pgQueryLoaiKhachHang =
        "CREATE TABLE LOAIKHACHHANG (MaLoaiKhachHang VARCHAR(20) PRIMARY KEY, TenLoaiKhachHang VARCHAR(50))";
      await postgresClient.query(pgQueryLoaiKhachHang);

      // Insert dữ liệu vào bảng loaikhachhang ở PostgreSQL
      for (const row of resultsLoaiKhachHangMysql) {
        const MaLoaiKhachHang = row.MaLoaiKhachHang;
        const TenLoaiKhachHang = row.TenLoaiKhachHang;

        const pgInsertLoaiKhachHang =
          "INSERT INTO LOAIKHACHHANG (MaLoaiKhachHang, TenLoaiKhachHang) VALUES ($1, $2)";
        const pgParamsLoaiKhachHang = [MaLoaiKhachHang, TenLoaiKhachHang];
        await postgresClient.query(
          pgInsertLoaiKhachHang,
          pgParamsLoaiKhachHang
        );
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán loại khách hàng" });
  }

  //Phân tán khách hàng
  try {
    // Tán bảng khachhang đến MySQL
    const resultKhachHangMysql = await sqlPool.request().query(khachHangMysql);
    const resultsKhachHangMysql = resultKhachHangMysql.recordset;

    const resultKhachHangOra = await sqlPool.request().query(khachHangOra);
    const resultsKhachHangOra = resultKhachHangOra.recordset;

    const resultKhachHangPg = await sqlPool.request().query(khachHangPg);
    const resultsKhachHangPg = resultKhachHangPg.recordset;

    const countKhachHangMysql = await isTableExistMysql("KHACHHANG");
    const countKhachHangOra = await isTableExistOra("KHACHHANG");
    const countKhachHangPg = await isTableExistPg("KHACHHANG");

    if (countKhachHangMysql && countKhachHangOra && countKhachHangPg) {
      res.send({ message: "Khách hàng đã tồn tại trong các site" });
    } else {
      // Tạo bảng khachhang ở MySQL
      const createKhachHangMysql =
        "CREATE TABLE KHACHHANG (MaKhachHang varchar(20) primary key, TenKhachHang varchar(50), DiaChi varchar(100), MaLoaiKhachHang varchar(20), FOREIGN KEY (MaLoaiKhachHang) REFERENCES LOAIKHACHHANG(MaLoaiKhachHang))";
      await mysqlConnection.promise().query(createKhachHangMysql);

      // Insert dữ liệu vào bảng khachhang ở MySQL
      const insertKhachHangMysql = `INSERT INTO KHACHHANG (MaKhachHang, TenKhachHang, DiaChi, MaLoaiKhachHang) VALUES ?`;
      const valuesKhachHangMysql = resultsKhachHangMysql.map((row) => [
        row.MaKhachHang,
        row.TenKhachHang,
        row.DiaChi,
        row.MaLoaiKhachHang,
      ]);
      await mysqlConnection
        .promise()
        .query(insertKhachHangMysql, [valuesKhachHangMysql]);

      // Tạo bảng khachhang ở Oracle
      const oracleQueryKhachHang =
        "CREATE TABLE KHACHHANG (MaKhachHang VARCHAR2(20) PRIMARY KEY, TenKhachHang VARCHAR2(50), DiaChi VARCHAR2(100), MaLoaiKhachHang VARCHAR2(20), FOREIGN KEY (MaLoaiKhachHang) REFERENCES LOAIKHACHHANG(MaLoaiKhachHang))";
      await executeOracleQuery(oracleQueryKhachHang);

      // Insert dữ liệu vào bảng khachhang ở Oracle
      for (const row of resultsKhachHangOra) {
        const MaKhachHang = row.MaKhachHang;
        const TenKhachHang = row.TenKhachHang;
        const DiaChi = row.DiaChi;
        const MaLoaiKhachHang = row.MaLoaiKhachHang;

        const oraInsertKhachHang =
          "INSERT INTO KHACHHANG (MaKhachHang, TenKhachHang, DiaChi, MaLoaiKhachHang) VALUES (:MaKhachHang, :TenKhachHang, :DiaChi, :MaLoaiKhachHang)";
        const oraParamsKhachHang = [
          MaKhachHang,
          TenKhachHang,
          DiaChi,
          MaLoaiKhachHang,
        ];
        await executeOracleQuery(oraInsertKhachHang, oraParamsKhachHang);

        // Phân tán PostgreSQL
      }
      const pgQueryKhachHang =
        "CREATE TABLE KHACHHANG (MaKhachHang VARCHAR(20) PRIMARY KEY, TenKhachHang VARCHAR(50), DiaChi VARCHAR(100), MaLoaiKhachHang VARCHAR(20), FOREIGN KEY (MaLoaiKhachHang) REFERENCES LOAIKHACHHANG(MaLoaiKhachHang))";
      await postgresClient.query(pgQueryKhachHang);

      // Insert dữ liệu vào bảng khachhang ở PostgreSQL
      for (const row of resultsKhachHangPg) {
        const MaKhachHang = row.MaKhachHang;
        const TenKhachHang = row.TenKhachHang;
        const DiaChi = row.DiaChi;
        const MaLoaiKhachHang = row.MaLoaiKhachHang;

        const pgInsertKhachHang =
          "INSERT INTO KHACHHANG (MaKhachHang, TenKhachHang, DiaChi, MaLoaiKhachHang) VALUES ($1, $2, $3, $4)";
        const pgParamsKhachHang = [
          MaKhachHang,
          TenKhachHang,
          DiaChi,
          MaLoaiKhachHang,
        ];
        await postgresClient.query(pgInsertKhachHang, pgParamsKhachHang);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán khách hàng" });
  }

  //Phân tán hóa đơn
  try {
    // Tán bảng hoadon đến MySQL
    const resultHoaDonMysql = await sqlPool.request().query(hoaDonMysql);
    const resultsHoaDonMysql = resultHoaDonMysql.recordset;

    const resultHoaDonOra = await sqlPool.request().query(hoaDonOra);
    const resultsHoaDonOra = resultHoaDonOra.recordset;

    const resultHoaDonPg = await sqlPool.request().query(hoaDonPg);
    const resultsHoaDonPg = resultHoaDonPg.recordset;

    const countHoaDonMysql = await isTableExistMysql("HOADON");
    const countHoaDonOra = await isTableExistOra("HOADON");
    const countHoaDonPg = await isTableExistPg("HOADON");

    if (countHoaDonMysql && countHoaDonOra && countHoaDonPg) {
      res.send({ message: "Hóa đơn đã tồn tại trong các site" });
    } else {
      // Tạo bảng hoadon ở MySQL
      const createHoaDonMysql =
        "CREATE TABLE HOADON (MaHoaDon varchar(20) primary key, MaKhachHang varchar(20), MaNhanVien varchar(20), MaChiNhanh varchar(20), NgayLap date, FOREIGN KEY (MaKhachHang) REFERENCES KHACHHANG(MaKhachHang), FOREIGN KEY (MaNhanVien) REFERENCES NHANVIEN(MaNhanVien), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await mysqlConnection.promise().query(createHoaDonMysql);

      // Insert dữ liệu vào bảng hoadon ở MySQL
      const insertHoaDonMysql = `INSERT INTO HOADON (MaHoaDon, MaKhachHang, MaNhanVien, MaChiNhanh, NgayLap) VALUES ?`;
      const valuesHoaDonMysql = resultsHoaDonMysql.map((row) => [
        row.MaHoaDon,
        row.MaKhachHang,
        row.MaNhanVien,
        row.MaChiNhanh,
        row.NgayLap,
      ]);
      await mysqlConnection
        .promise()
        .query(insertHoaDonMysql, [valuesHoaDonMysql]);

      // Tạo bảng hoadon ở Oracle
      const oracleQueryHoaDon =
        "CREATE TABLE HOADON (MaHoaDon VARCHAR2(20) PRIMARY KEY, MaKhachHang VARCHAR2(20), MaNhanVien VARCHAR2(20), MaChiNhanh VARCHAR2(20), NgayLap DATE, FOREIGN KEY (MaKhachHang) REFERENCES KHACHHANG(MaKhachHang), FOREIGN KEY (MaNhanVien) REFERENCES NHANVIEN(MaNhanVien), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await executeOracleQuery(oracleQueryHoaDon);

      // Insert dữ liệu vào bảng hoadon ở Oracle
      for (const row of resultsHoaDonOra) {
        const MaHoaDon = row.MaHoaDon;
        const MaKhachHang = row.MaKhachHang;
        const MaNhanVien = row.MaNhanVien;
        const MaChiNhanh = row.MaChiNhanh;
        const NgayLap = row.NgayLap;

        const oraInsertHoaDon =
          "INSERT INTO HOADON (MaHoaDon, MaKhachHang, MaNhanVien, MaChiNhanh, NgayLap) VALUES (:MaHoaDon, :MaKhachHang, :MaNhanVien, :MaChiNhanh, :NgayLap)";
        const oraParamsHoaDon = [
          MaHoaDon,
          MaKhachHang,
          MaNhanVien,
          MaChiNhanh,
          NgayLap,
        ];
        await executeOracleQuery(oraInsertHoaDon, oraParamsHoaDon);

        // Phân tán PostgreSQL
      }
      const pgQueryHoaDon =
        "CREATE TABLE HOADON (MaHoaDon VARCHAR(20) PRIMARY KEY, MaKhachHang VARCHAR(20), MaNhanVien VARCHAR(20), MaChiNhanh VARCHAR(20), NgayLap DATE, FOREIGN KEY (MaKhachHang) REFERENCES KHACHHANG(MaKhachHang), FOREIGN KEY (MaNhanVien) REFERENCES NHANVIEN(MaNhanVien), FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH(MaChiNhanh))";
      await postgresClient.query(pgQueryHoaDon);

      // Insert dữ liệu vào bảng hoadon ở PostgreSQL
      for (const row of resultsHoaDonPg) {
        const MaHoaDon = row.MaHoaDon;
        const MaKhachHang = row.MaKhachHang;
        const MaNhanVien = row.MaNhanVien;
        const MaChiNhanh = row.MaChiNhanh;
        const NgayLap = row.NgayLap;

        const pgInsertHoaDon =
          "INSERT INTO HOADON (MaHoaDon, MaKhachHang, MaNhanVien, MaChiNhanh, NgayLap) VALUES ($1, $2, $3, $4, $5)";
        const pgParamsHoaDon = [
          MaHoaDon,
          MaKhachHang,
          MaNhanVien,
          MaChiNhanh,
          NgayLap,
        ];
        await postgresClient.query(pgInsertHoaDon, pgParamsHoaDon);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán hóa đơn" });
  }

  //Phân tán chi tiết hóa đơn
  try {
    // Tán bảng chitiethoadon đến MySQL
    const resultChiTietHoaDonMysql = await sqlPool
      .request()
      .query(chiTietHoaDonMysql);
    const resultsChiTietHoaDonMysql = resultChiTietHoaDonMysql.recordset;

    const resultChiTietHoaDonOra = await sqlPool
      .request()
      .query(chiTietHoaDonOra);
    const resultsChiTietHoaDonOra = resultChiTietHoaDonOra.recordset;

    const resultChiTietHoaDonPg = await sqlPool
      .request()
      .query(chiTietHoaDonPg);
    const resultsChiTietHoaDonPg = resultChiTietHoaDonPg.recordset;

    const countChiTietHoaDonMysql = await isTableExistMysql("CHITIETHOADON");
    const countChiTietHoaDonOra = await isTableExistOra("CHITIETHOADON");
    const countChiTietHoaDonPg = await isTableExistPg("CHITIETHOADON");

    if (
      countChiTietHoaDonMysql &&
      countChiTietHoaDonOra &&
      countChiTietHoaDonPg
    ) {
      res.send({ message: "Chi tiết hóa đơn đã tồn tại trong các site" });
    } else {
      // Tạo bảng chitiethoadon ở MySQL
      const createChiTietHoaDonMysql =
        "CREATE TABLE CHITIETHOADON (MaHoaDon varchar(20), MaSanPham varchar(20), SoLuong int, PRIMARY KEY (MaHoaDon, MaSanPham), FOREIGN KEY (MaHoaDon) REFERENCES HOADON(MaHoaDon), FOREIGN KEY (MaSanPham) REFERENCES SANPHAM(MaSanPham))";
      await mysqlConnection.promise().query(createChiTietHoaDonMysql);

      // Insert dữ liệu vào bảng chitiethoadon ở MySQL
      const insertChiTietHoaDonMysql = `INSERT INTO CHITIETHOADON (MaHoaDon, MaSanPham, SoLuong) VALUES ?`;
      const valuesChiTietHoaDonMysql = resultsChiTietHoaDonMysql.map((row) => [
        row.MaHoaDon,
        row.MaSanPham,
        row.SoLuong,
      ]);
      await mysqlConnection
        .promise()
        .query(insertChiTietHoaDonMysql, [valuesChiTietHoaDonMysql]);

      // Tạo bảng chitiethoadon ở Oracle
      const oracleQueryChiTietHoaDon =
        "CREATE TABLE CHITIETHOADON (MaHoaDon VARCHAR2(20), MaSanPham VARCHAR2(20), SoLuong NUMBER, PRIMARY KEY (MaHoaDon, MaSanPham), FOREIGN KEY (MaHoaDon) REFERENCES HOADON(MaHoaDon), FOREIGN KEY (MaSanPham) REFERENCES SANPHAM(MaSanPham))";
      await executeOracleQuery(oracleQueryChiTietHoaDon);

      // Insert dữ liệu vào bảng chitiethoadon ở Oracle
      for (const row of resultsChiTietHoaDonOra) {
        const MaHoaDon = row.MaHoaDon;
        const MaSanPham = row.MaSanPham;
        const SoLuong = row.SoLuong;

        const oraInsertChiTietHoaDon =
          "INSERT INTO CHITIETHOADON (MaHoaDon, MaSanPham, SoLuong) VALUES (:MaHoaDon, :MaSanPham, :SoLuong)";
        const oraParamsChiTietHoaDon = [MaHoaDon, MaSanPham, SoLuong];
        await executeOracleQuery(
          oraInsertChiTietHoaDon,
          oraParamsChiTietHoaDon
        );

        // Phân tán PostgreSQL
      }
      const pgQueryChiTietHoaDon =
        "CREATE TABLE CHITIETHOADON (MaHoaDon VARCHAR(20), MaSanPham VARCHAR(20), SoLuong INTEGER, PRIMARY KEY (MaHoaDon, MaSanPham), FOREIGN KEY (MaHoaDon) REFERENCES HOADON(MaHoaDon), FOREIGN KEY (MaSanPham) REFERENCES SANPHAM(MaSanPham))";
      await postgresClient.query(pgQueryChiTietHoaDon);

      // Insert dữ liệu vào bảng chitiethoadon ở PostgreSQL
      for (const row of resultsChiTietHoaDonPg) {
        const MaHoaDon = row.MaHoaDon;
        const MaSanPham = row.MaSanPham;
        const SoLuong = row.SoLuong;

        const pgInsertChiTietHoaDon =
          "INSERT INTO CHITIETHOADON (MaHoaDon, MaSanPham, SoLuong) VALUES ($1, $2, $3)";
        const pgParamsChiTietHoaDon = [MaHoaDon, MaSanPham, SoLuong];
        await postgresClient.query(
          pgInsertChiTietHoaDon,
          pgParamsChiTietHoaDon
        );
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi khi phân tán chi tiết hóa đơn" });
  }

  res.send({ message: "Phân tán thành công" });
};

const deleteAllTableInOtherSite = async (req, res, next) => {
  // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  try {
    const tableToDrops = [
      "drop table chitiethoadon",
      "drop table hoadon",
      "drop TABLE khachhang",
      "drop table loaikhachhang",
      "drop table taikhoan", //
      "drop table nhanvien",
      "drop table chitietphieunhap",
      "drop table phieunhap",
      "drop table nhacungcap",
      "drop table sanpham",
      "drop table thuonghieu",
      "drop table danhmuc",
      "drop table kho",
      "drop table chinhanh",
      " drop table tinh",
    ];
    for (const sqlQuery of tableToDrops) {
      await mysqlConnection.promise().query(sqlQuery);
      await executeOracleQuery(sqlQuery);
      await postgresClient.query(sqlQuery);
    }
    res.status(200).send({ message: "Bảng ở các site đã được xóa!" });
  } catch (error) {
    res.send({ message: "Đã xảy ra lỗi khi xóa bảng: " + error.message });
  }
};

module.exports = {
  migrateData,
  deleteAllTableInOtherSite,
};
