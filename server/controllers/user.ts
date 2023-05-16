import express from "express";
import Jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { mysqlConnection } from "../db/connection";
const CryptoJS = require("crypto-js");

type UserRegister = {
  username: string;
  password: string;
};

type ReturnUserInfo = {
  id: string;
  username: string;
};

export function userRegister(req: express.Request, res: express.Response) {
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
