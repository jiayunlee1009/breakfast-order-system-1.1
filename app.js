const express = require("express");
const path = require("path");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

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
//
// const validateOrder = (req, res, next) => {
//   const { customerName, contact, pickupTime, orderItems } = req.body;
//
//   if (!customerName) return res.status(400).json({ message: "請填入您的姓名" });
//   if (!/^\d{10}$/.test(contact))
//     return res.status(400).json({ message: "請填入您的手機號碼" });
//   if (!pickupTime)
//     return res.status(400).json({ message: "請填入您希望的取餐時間" });
//   if (!Array.isArray(orderItems) || orderItems.length < 1) {
//     return res.status(400).json({ message: "至少要點一份餐喔" });
//   }
//
//   next();
// };

// router for placing new order.
app.post("/test", async (req, res) => {
  console.log("req.body", req.body);

  const { customerName, contact, pickupTime, orderItems } = req.body;

  let connection;
  try {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const formattedPickupTime = `${formattedDate} ${pickupTime}:00`;

    // 建立資料庫連線
    connection = await mysql.createConnection(connectionConfig);

    // 開始交易
    await connection.beginTransaction();

    // 插入訂單資料
    const orderSQL =
      "INSERT INTO `orders` (`customerName`, `contact`, `pickupTime`) VALUES (?, ?, ?)";
    const orderValues = [customerName, contact, formattedPickupTime];
    const [orderResult] = await connection.execute(orderSQL, orderValues);

    const orderId = orderResult.insertId;

    // 插入訂單項目資料
    const orderItemsSQL =
      "INSERT INTO `order_items` (`orderId`, `itemName`, `quantity`, `price`) VALUES (?, ?, ?, ?)";
    for (const item of orderItems) {
      const orderItemsValues = [
        orderId,
        item.itemName,
        item.quantity,
        item.price,
      ];
      await connection.execute(orderItemsSQL, orderItemsValues);
    }

    // 提交交易
    await connection.commit();

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

app.post("/query", async (req, res) => {
  const { contact, startDateTime, endDateTime } = req.body;
  console.log("contact", contact);
  console.log("startDateTime", startDateTime);
  console.log("endDateTime", endDateTime);

  if (!contact) {
    return res.status(400).json({
      status: "failed",
      message: "請輸入手機號碼",
    });
  }

  try {
    const connection = await mysql.createConnection(connectionConfig);

    let orderSQL = "SELECT * FROM `orders` WHERE 1=1";
    const params = [];

    if (contact) {
      orderSQL += " AND `contact` = ?";
      params.push(contact);
    }

    if (startDateTime) {
      orderSQL += " AND `pickupTime` >= ?";
      params.push(startDateTime);
    }

    if (endDateTime) {
      orderSQL += " AND `pickupTime` <= ?";
      params.push(endDateTime);
    }

    const [orderResult] = await connection.execute(orderSQL, params);

    if (orderResult.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "未找到符合條件的訂單。",
      });
    }

    const orderIds = orderResult.map((order) => order.id);
    const placeholders = orderIds.map(() => "?").join(", ");
    const orderItemsSQL = `SELECT * FROM \`order_items\` WHERE \`orderId\` IN (${placeholders})`;
    const [orderItemsResult] = await connection.execute(
      orderItemsSQL,
      orderIds,
    );

    const orders = orderResult.map((order) => {
      const items = orderItemsResult.filter(
        (item) => item.orderId === order.id,
      );
      return {
        orderId: order.id,
        customerName: order.customerName,
        contact: order.contact,
        pickupTime: order.pickupTime,
        items: items.map((item) => ({
          itemName: item.itemName,
          quantity: item.quantity,
          price: item.price,
        })),
      };
    });

    console.log("orders\n", JSON.stringify(orders, null, 2));

    res.status(200).json({
      status: "success",
      message: "查詢成功！",
      data: orders,
    });
  } catch (error) {
    console.error("查詢資料庫失敗：", error);
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤，請稍後再試。",
    });
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
