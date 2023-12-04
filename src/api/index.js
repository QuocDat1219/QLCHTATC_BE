require("dotenv").config();
const { connectSQL } = require("../config/connectSqlserver");
const { connectMysql } = require("../config/connectMysql");
const { connectOracle } = require("../config/connectOracle");
const { connectPostgres } = require("../config/connectPostgresql");
const express = require("express");
const cors = require("cors");

connectSQL();
connectMysql();
connectOracle();
connectPostgres();

const phanTanRoutes = require("../routes/phanTanRoutes");

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());

app.use("/api/phantan", phanTanRoutes);

app.use((req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).send({ message: err, message });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
