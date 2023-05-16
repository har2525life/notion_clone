import express from "express";
import { body } from "express-validator";
import { mysqlConnection } from "../db/connection";
import { validate } from "../middleware/validation";
import { userRegister } from "../controllers/user";
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

module.exports = router;
