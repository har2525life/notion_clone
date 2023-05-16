import express from "express";
import Jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { body, validationResult } from "express-validator";
import { mysqlConnection } from "../db/connection";
require("dotenv").config();
// import CryptoJS from "crypto-js"
const CryptoJS = require("crypto-js");
const router = express.Router();

type UserRegister = {
  username: string;
  password: string;
};

type ReturnUserInfo = {
  id: string;
  username: string;
};

router.post(
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
    return await mysqlConnection
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
      mysqlConnection.query(sql);
      console.log("sql", sql);
      // JWT 発行
      const secret_token_key = process.env.TOKEN_SECRET_KEY;
      const token = Jwt.sign({ id: uid }, `${secret_token_key}`, {
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

module.exports = router;
