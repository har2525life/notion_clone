import express from "express";
import mysql from "mysql2";
require("dotenv").config();

const app = express();
const PORT = 5000;

// DB接続
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "notion_clone",
});

try {
  connection.connect();
  console.log("接続中");
} catch (error) {
  console.log(error);
}

app.listen(PORT, () => {
  console.log("port:5000にて稼働中");
});
