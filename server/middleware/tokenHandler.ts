// JWTを検証するミドルウェア
import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { mysqlConnection } from "../db/connection";
require("dotenv").config();

type Decoded =
  | {
      id: string;
      iat: number;
      ext: number;
    }
  | false;

type GetUserInfo = {
  id: string;
  username: string;
  password: string;
};

const tokenDecode = (req: Request): Decoded => {
  const bearerHandler = req.headers["authorization"];
  if (bearerHandler) {
    const bearer = bearerHandler.split(" ")[1];
    // let decodedToken:
    try {
      const decodedToken = Jwt.verify(
        bearer,
        `${process.env.TOKEN_SECRET_KEY}`
      );
      return decodedToken as Decoded;
    } catch {
      return false;
    }
  } else {
    return false;
  }
};

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  console.log("verifyToken");
  const tokenDecoded = tokenDecode(req);
  console.log(typeof tokenDecoded);
  console.log(tokenDecode);
  if (tokenDecoded) {
    console.log("tokenDecoded", tokenDecoded.id);
    const sql = `SELECT * FROM user WHERE id="${tokenDecoded.id}"`;
    mysqlConnection.query(sql, async (error: any, result: GetUserInfo[]) => {
      if (error) return res.status(500).json(error);
      if (Object.keys(result).length > 0) {
        res.locals.user = result[0]
        next();
      } else {
        return res.status(401).json("権限がありません");
      }
    });
  } else {
    return res.status(401).json("権限がありません");
  }
}
