const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const db = require("../db"); // 假設已經有資料庫設定模組

// 建立新訂單
// router.post(
//   "/",
//   // [
//   //   // 使用 express-validator 進行請求資料的驗證
//   //   body("customerName").notEmpty().withMessage("姓名是必填的"),
//   //   body("contact").isMobilePhone().withMessage("請輸入有效的手機號碼"),
//   //   body("pickupTime").notEmpty().withMessage("取餐時間是必填的"),
//   //   body("orderItems").isArray({ min: 1 }).withMessage("訂單項目至少需要一個"),
//   // ],
//   async (req, res) => {
//     // 驗證請求資料
//     const errors = validationResult(req);
//     if (errors) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { customerName, contact, pickupTime, orderItems } = req.body;

//     console.log("============")
//     console.log("req.body", req.body)

//     try {
//       // 插入訂單資料到資料庫
//       const [orderResult] = await db.execute(
//         "INSERT INTO orders (customerName, contact, pickupTime) VALUES (?, ?, ?)",
//         [customerName, contact, pickupTime]
//       );
//       console.log(result); // 檢查返回值結構

//       const orderId = orderResult.insertId;

//       // 插入每個訂單項目到資料庫
//       for (const item of orderItems) {
//         const { itemName, quantity, price } = item;
//         await db.execute(
//           "INSERT INTO order_items (orderId, itemName, quantity, price) VALUES (?, ?, ?, ?)",
//           [orderId, itemName, quantity, price]
//         );
//       }

//       // 回應成功訊息
//       res.status(201).json({
//         status: "success",
//         message: "訂單建立成功！",
//         orderId,
//       });
//     } catch (error) {
//       console.error("插入資料庫失敗：", error);
//       res.status(500).json({ status: "error", message: "伺服器錯誤，請稍後再試" });
      
//     }
//   }
// );

// 查詢所有訂單
router.get("/", async (req, res) => {
  try {
    const [orders] = await db.execute("SELECT * FROM orders");
    res.json({ status: "success", orders });
  } catch (error) {
    console.error("查詢資料庫失敗：", error);
    res.status(500).json({ status: "error", message: "伺服器錯誤，請稍後再試" });
  }
});

module.exports = router;
