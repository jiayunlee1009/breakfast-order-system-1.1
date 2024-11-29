const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const ordersRouter = require("./routes/orders");
const db = require("./db"); // 假設已經有資料庫設定模組
const connection = require("./db");


const app = express();
const port = 3000;

// 啟用 CORS
app.use(cors());

// 使用 JSON 解析中介軟體
app.use(express.json());
app.use(bodyParser.json());

// 設定靜態檔案的根目錄
app.use(express.static(path.join(__dirname, "public")));

// 掛載 /api/orders 路由
// app.use("/api/orders", ordersRouter);

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

    const { customerName, contact, pickupTime, orderItems } = req.body;

    console.log("============")
    console.log("req.body", req.body)

    try {
      // 插入訂單資料到資料庫
      // const [customerName, contact, pickupTime] = await connection.query(
      //   "INSERT INTO 'orders' ('customerName', 'contact', 'pickupTime') VALUES (?, ?, ?)",
      //   [customerName, contact, pickupTime]
      // );
      // console.log(result); // 檢查返回值結構

      const sql = "INSERT INTO `orders` (`customerName`, `contact`, `pickupTime`) VALUES (?, ?, ?)";
      const values = [customerName, contact, pickupTime];
      const [result, fields] = await connection.execute(sql, values);

      console.log("result", result);
      console.log("fields", fields);

      const orderId = orderResult.insertId;

      // 插入每個訂單項目到資料庫
    //   for (const item of orderItems) {
    //     const { itemName, quantity, price } = item;
    //     await db.execute(
    //       "INSERT INTO order_items (orderId, itemName, quantity, price) VALUES (?, ?, ?, ?)",
    //       [orderId, itemName, quantity, price]
    //     );
    //   }

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
