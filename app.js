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

let verify = async (req, res, next) => {
  // [
  //   // 使用 express-validator 進行請求資料的驗證
  //   body("customerName").notEmpty().withMessage("姓名是必填的"),
  //   body("contact").isMobilePhone().withMessage("請輸入有效的手機號碼"),
  //   body("pickupTime").notEmpty().withMessage("取餐時間是必填的"),
  //   body("orderItems").isArray({ min: 1 }).withMessage("訂單項目至少需要一個"),
  // ],
  next();
}

// 把以下的東西塞到上面去，做成另外一個 middleware

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

    const { customerName, contact, pickupTime, itemName } = req.body;

    console.log("============")
    console.log("req.body is:\n", req.body)
    console.log("------------")
    console.log("req.body.customerName is:\n", req.body.customerName)
    console.log("------------")
    console.log("req.body.orderItems are:\n", req.body.orderItems)  
    console.log("------------")
    console.log("req.body.orderItems[1].itemName is:\n", req.body.orderItems[1].itemName)  
    console.log("============")
    

    try {

      // 由於 SQL 資料庫定義 Datetime 資料，格式為 yyyy-mm-dd hh:mm:ss，因此我們將格式進行處理使得符合資料表定義的格式
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      const formattedPickupTime = `${formattedDate} ${pickupTime}:00`;

      console.log("pickupTime", pickupTime)
      console.log("formattedDate", formattedDate)
      console.log("formattedPickupTime", formattedPickupTime) // formattedPickupTime yyyy-mm-dd hh:mm:ss
      
      // 做 MySQL 資料庫連線的 Method，await 的意思是此列程式完成執行後，才做接下來的動作（指令）
      const connection = await mysql.createConnection(connectionConfig);

      const orderSQL = "INSERT INTO `orders` (`customerName`, `contact`, `pickupTime`) VALUES (?, ?, ?)";
      // 寫 ? 的意思是防止一階注入式攻擊（1st-order SQL injection），將準備 insert 到資料庫的查詢字串定義為「真正的字串」
      const orderValues = [customerName, contact, formattedPickupTime];
      const [orderResult, orderFields] = await connection.execute(orderSQL, orderValues);

      console.log("orderResult", orderResult);
      console.log("orderFields", orderFields);
      console.log("------------")

      const orderId = orderResult.insertId;

      const orderItemsSQL = "INSERT INTO `order_items` (`orderId`, `itemName`, `quantity`, `price`) VALUES (?, ?, ?, ?)";
      
      // 我們要把每一項 item 分別存到資料表，所以要寫 for 迴圈幫他印出每一項資料（iterate 遍歷物件中的資料），然後進行 insert
      for (i=0; i<req.body.orderItems.length; i++) {
        const orderItemsValues = [orderId, req.body.orderItems[i].itemName, req.body.orderItems[i].quantity, req.body.orderItems[i].price] ;  
        console.log("req.body.orderItems", req.body.orderItems[i]);
        const [orderItemsResult, orderItemsFields] = await connection.execute(orderItemsSQL, orderItemsValues);
        console.log("orderItemsResult", orderItemsResult);
        console.log("orderItemsFields", orderItemsFields);
        }


      console.log("============")

      // 回應成功訊息
      res.status(201).json({
        status: "success",
        message: "訂單建立成功！",
        orderId,
      });
    } catch (error) {
      console.error("插入資料庫失敗：", error);
      res.status(500).json({ status: "error", message: error });
      
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
