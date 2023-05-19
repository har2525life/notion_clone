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

type GetUserInfo = {
  id: string;
  username: string;
  password: string;
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
    // console.log("sql", sql);
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
    return res.status(500).json(error);
  }
}

export async function userLogin(req: express.Request, res: express.Response) {
  const user: UserRegister = req.body;

  try {
    const sql = `SELECT * FROM user WHERE username="${user.username}"`;
    mysqlConnection.query(sql, async (error: any, result: GetUserInfo[]) => {
      if (error) return res.status(500).json(error);
      if (Object.keys(result).length > 0) {
        const { id, username, password } = result[0];

        const decryptedPassword = await CryptoJS.AES.decrypt(
          password,
          process.env.SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);

        if (user.password !== decryptedPassword) {
          return res.status(401).json({
            errors: {
              param: "password",
              message: "パスワードが無効です",
            },
          });
        }

        // JWT 発行
        const secret_token_key = process.env.TOKEN_SECRET_KEY;
        const token = Jwt.sign({ id }, `${secret_token_key}`, {
          expiresIn: "24h",
        });

        return res.status(201).json({
          id,
          username,
          token,
        });
      } else {
        return res.status(401).json({
          errors: {
            param: "username",
            message: "ユーザー名が無効です",
          },
        });
      }
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}
