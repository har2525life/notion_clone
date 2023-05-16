import mysql from "mysql2";
require("dotenv").config();

export const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "notion_clone",
});
