import express from "express";
import mysql from "mysql2";
import Jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { body, validationResult } from "express-validator";
const CryptoJS = require("crypto-js");
require("dotenv").config();
const app = express();
const PORT = 5000;

app.use(express.json());

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

type UserRegister = {
  username: string;
  password: string;
};

type ReturnUserInfo = {
  id: string;
  username: string;
};

type ReturnData = {
  id: string;
  username: string;
  password: string;
};

app.post(
  "/register",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上である必要があります"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  body("username").custom(async (value) => {
    console.log("value", value);
    const sql = `SELECT * FROM user WHERE username="${value}"`;
    return await connection
      .promise()
      .query(sql)
      .then((results) => {
        console.log("results", results[0]);
        if (Object.keys(results[0]).length) {
          return Promise.reject("このユーザーはすでに使われています");
        }
      });
  }),
  (req: express.Request, res: express.Response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  (req: express.Request, res: express.Response) => {
    // パスワードの受け取り
    const { username, password }: UserRegister = req.body;

    try {
      const encryptionPassword = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY
      ).toString();
      // console.log("encryptionPassword",encryptionPassword)
      const uid = uuid();
      const sql = `INSERT INTO user(id, username, password) VALUES("${uid}", "${username}", "${encryptionPassword}")`;
      connection.query(sql);
      console.log("sql", sql);
      // JWT 発行
      const token = Jwt.sign({ id: uid }, "notion_clone_token", {
        expiresIn: "24h",
      });

      // return user information
      const userInfo: ReturnUserInfo = {
        id: uid,
        username,
      };

      return res.status(200).json({ userInfo, token });
    } catch (error) {
      console.log(error);
    }
  }
);

app.listen(PORT, () => {
  console.log("port:5000にて稼働中");
});
