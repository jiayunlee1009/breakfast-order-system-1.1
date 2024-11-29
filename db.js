const mysql = require("mysql2/promise");
require("dotenv").config(); // 使用 dotenv 讀取環境變數



//測試連線
async () => {

    // 建立 MySQL 連線池
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST, // 資料庫主機
        user: process.env.DB_USER, // 資料庫使用者名稱
        password: process.env.DB_PASSWORD, // 資料庫密碼
        database: process.env.DB_NAME, // 資料庫名稱
        port: process.env.DB_PORT
    });

    await connection.connect((err) => {

        if (err) {
            console.error('資料庫連接失敗:', err);
            return;
        }
        // console.log('成功連接資料庫');
    });

}

// 匯出 connection 物件
module.exports = connection;
