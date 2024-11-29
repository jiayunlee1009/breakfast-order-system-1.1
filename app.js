const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require('mysql2/promise');
require('dotenv').config();
// const connection = require("./db.js");


const app = express();
const port = 3000;

// 啟用 CORS
app.use(cors());

// 使用 JSON 解析中介軟體
app.use(express.json());
app.use(bodyParser.json());

// Connecting to MySQL
const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

// 設定靜態檔案的根目錄
app.use(express.static(path.join(__dirname, "public")));


app.post("/test",
  // [
  //   // 使用 express-validator 進行請求資料的驗證
  //   body("customerName").notEmpty().withMessage("姓名是必填的"),
  //   body("contact").isMobilePhone().withMessage("請輸入有效的手機號碼"),
  //   body("pickupTime").notEmpty().withMessage("取餐時間是必填的"),
  //   body("orderItems").isArray({ min: 1 }).withMessage("訂單項目至少需要一個"),
  // ],
  async (req, res) => {
    // 驗證請求資料

    const { customerName, contact, pickupTime } = req.body;

    console.log("============")
    console.log("req.body", req.body)

    try {

      const today = new Date();

      const formattedDate = today.toISOString().split('T')[0];
      const formattedPickupTime = `${formattedDate} ${pickupTime}:00`;
      console.log("formattedPickupTime", formattedPickupTime)
      // formattedPickupTime yyyy-mm-dd hh:mm:ss

      const connection = await mysql.createConnection(connectionConfig);

      const sql = "INSERT INTO `orders` (`customerName`, `contact`, `pickupTime`) VALUES (?, ?, ?)";
      const values = [customerName, contact, formattedPickupTime];
      const [result, fields] = await connection.execute(sql, values);

      console.log("result", result);
      console.log("fields", fields);

      const orderId = result.insertId;

      // 回應成功訊息
      res.status(201).json({
        status: "success",
        message: "訂單建立成功！",
        orderId,
      });
    } catch (error) {
      console.error("插入資料庫失敗：", error);
      res.status(500).json({ status: "error", message: "伺服器錯誤，請稍後再試" });
      
    }
  }
);


// 根路由：回傳首頁
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 上運行`);
});
