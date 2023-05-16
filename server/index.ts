import express from "express";
import { mysqlConnection } from "./db/connection";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/api", require("./routes/auth"));

try {
  mysqlConnection.connect();
  console.log("接続中");
} catch (error) {
  console.log(error);
}

app.listen(PORT, () => {
  console.log("port:5000にて稼働中");
});
