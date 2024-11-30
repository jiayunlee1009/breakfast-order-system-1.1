const express = require("express");
const path = require("path");
const cors = require("cors");
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

// Connecting to MySQL
const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

// root dir for static files
app.use(express.static(path.join(__dirname, "public")));

// middleware

const validateOrder = (req, res, next) => {
  const { customerName, contact, pickupTime, orderItems } = req.body;

  if (!customerName) return res.status(400).json({ message: "請填入您的姓名" });
  if (!/^\d{10}$/.test(contact)) return res.status(400).json({ message: "請填入您的手機號碼" });
  if (!pickupTime) return res.status(400).json({ message: "請填入您希望的取餐時間" });
  if (!Array.isArray(orderItems) || orderItems.length < 1) {
    return res.status(400).json({ message: "至少要點一份餐喔" });
  }

  next();
};

// router for placing new order.
app.post("/test", validateOrder, async (req, res) => {
  const { customerName, contact, pickupTime, orderItems } = req.body;

  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedPickupTime = `${formattedDate} ${pickupTime}:00`;

    const connection = await mysql.createConnection(connectionConfig);

    const orderSQL = "INSERT INTO `orders` (`customerName`, `contact`, `pickupTime`) VALUES (?, ?, ?)";
    const orderValues = [customerName, contact, formattedPickupTime];
    const [orderResult] = await connection.execute(orderSQL, orderValues);

    const orderId = orderResult.insertId;

    const orderItemsSQL = "INSERT INTO `order_items` (`orderId`, `itemName`, `quantity`, `price`) VALUES (?, ?, ?, ?)";
    for (const item of orderItems) {
      const orderItemsValues = [orderId, item.itemName, item.quantity, item.price];
      await connection.execute(orderItemsSQL, orderItemsValues);
    }

    res.status(201).json({
      status: "success",
      message: "訂單建立成功！",
      orderId,
    });
  } catch (error) {
    console.error("插入資料庫失敗：", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// 根路由
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 上運行`);
});
