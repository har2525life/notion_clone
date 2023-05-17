import express from "express";
import { body } from "express-validator";
import { mysqlConnection } from "../db/connection";
import { validate } from "../middleware/validation";
import { userLogin, userRegister } from "../controllers/user";
import { verifyToken } from "../middleware/tokenHandler";
require("dotenv").config();
// import CryptoJS from "crypto-js"

const router = express.Router();

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
  validate,
  userRegister
);

// ログイン用API
router.post(
  "/login",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上である必要があります"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  validate,
  userLogin
);

// JWT認証API
router.post(
  "/verify-token",
  verifyToken,
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // console.log("res.locals.user", res.locals.user);
    const { id, username } = res.locals.user;
    return res.status(200).json({ id, username });
  }
);

module.exports = router;
