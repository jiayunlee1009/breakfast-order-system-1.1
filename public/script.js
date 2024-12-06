let cart = []; // 儲存購物車內容
let cartCount = 0; // 購物車內商品數量
let currentRandomCombo = null; // 記錄目前的隨機搭配

// 菜單內容
const menu = {
  toast: [
    { name: "豬排蛋吐司", price: 50 },
    { name: "鮪魚蛋吐司", price: 55 },
    { name: "火腿起司吐司", price: 60 },
    { name: "花生醬吐司", price: 20 },
    { name: "巧克力醬吐司", price: 20 },
    { name: "培根蛋吐司", price: 50 },
    { name: "起司肉鬆吐司", price: 50 },
    { name: "蔬菜總匯吐司", price: 60 },
    { name: "蛋沙拉吐司", price: 50 },
    { name: "牛肉蛋吐司", price: 70 },
    { name: "蜂蜜奶油吐司", price: 35 },
  ],
  "egg-pie": [
    { name: "原味蛋餅", price: 30 },
    { name: "蔥花蛋餅", price: 35 },
    { name: "起司蛋餅", price: 35 },
    { name: "玉米蛋餅", price: 35 },
    { name: "起司玉米蛋餅", price: 45 },
    { name: "薯餅蛋餅", price: 45 },
    { name: "芋泥蛋餅", price: 60 },
    { name: "鮪魚蛋餅", price: 45 },
    { name: "培根蛋餅", price: 45 },
    { name: "辣味雞肉蛋餅", price: 55 },
    { name: "熱狗蛋餅", price: 55 },
    { name: "蔬菜蛋餅", price: 50 },
    { name: "牛肉蛋餅", price: 65 },
  ],
  burger: [
    { name: "牛肉漢堡", price: 80 },
    { name: "雞肉漢堡", price: 70 },
    { name: "魚排漢堡", price: 70 },
    { name: "培根漢堡", price: 60 },
    { name: "雙層牛肉漢堡", price: 100 },
    { name: "豬肉漢堡", price: 70 },
    { name: "起司蛋漢堡", price: 50 },
    { name: "薯餅漢堡", price: 50 },
    { name: "素食漢堡", price: 60 },
    { name: "總匯漢堡", price: 80 },
    { name: "辣味雞肉漢堡", price: 75 },
  ],
  noodle: [
    { name: "蘑菇麵", price: 50 },
    { name: "黑胡椒麵", price: 50 },
    { name: "陽春麵", price: 50 },
    { name: "麻醬麵", price: 50 },
    { name: "肉燥麵", price: 50 },
    { name: "豬排麵", price: 55 },
    { name: "素肉麵", price: 60 },
  ],
  drink: [
    { name: "柳橙汁", price: 30 },
    { name: "綠茶", price: 25 },
    { name: "紅茶", price: 25 },
    { name: "奶茶", price: 35 },
    { name: "檸檬紅茶", price: 30 },
    { name: "蜂蜜綠茶", price: 35 },
    { name: "巧克力牛奶", price: 35 },
    { name: "蘋果汁", price: 30 },
    { name: "咖啡", price: 50 },
    { name: "鮮奶茶", price: 50 },
    { name: "可可", price: 40 },
  ],
};

/* 處理購物車邏輯：假定購物車中有奶茶，要加入奶茶跟紅茶
  如果你加入奶茶 -> 走 if 的案例，購物車有相同東西就加數量
  如果你加入紅茶 -> 走 else 的案例，如果沒有就加一個
*/

function addToCart(itemName, itemPrice) {
  if (cart[itemName]) {
    // 購物車有相同東西就加數量
    cart[itemName].quantity += 1;
  } else {
    // 如果沒有就加一個
    cart[itemName] = {
      price: itemPrice,
      quantity: 1,
    };
  }
  cartCount++;
  updateCartCount();
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const modalBackground = document.querySelector(".modal-background");
  sidebar.classList.remove("open");
  modalBackground.classList.remove("open");
  document.body.classList.remove("sidebar-open");
}

function displayOrders(orders) {
  if (orders.length === 0) {
    alert("沒有找到相關的訂單資料");
    return;
  }

  const contentContainer = document.getElementById("content");
  contentContainer.innerHTML = orders.map(generateOrderBlockHTML).join("");
}

function updateCartModal() {
  const cartModalItems = document.getElementById("cart-items-list");
  const modalTotalPriceElem = document.getElementById("modal-total-price");

  cartModalItems.innerHTML = "";

  if (Object.keys(cart).length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "購物車是空的";
    cartModalItems.appendChild(emptyMessage);
    modalTotalPriceElem.textContent = "0";
    return;
  }

  let totalPrice = 0;

  Object.keys(cart).forEach((itemName) => {
    const item = cart[itemName];
    const cartItemElement = createCartItemElement(itemName, item);
    cartModalItems.appendChild(cartItemElement);
    totalPrice += item.price * item.quantity;
  });

  modalTotalPriceElem.textContent = totalPrice;

  cartModalItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const itemName = e.target.dataset.itemName;
      removeItemFromCart(itemName);
      updateCartModal();
      updateCartCount();
    }
  });
}

function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  cartCountElement.textContent = `(${cartCount})`;
}

function closeCartModal() {
  document.getElementById("cart-modal").classList.remove("open");
  document.querySelector(".modal-background").classList.remove("open"); // 隱藏背景遮罩
}

function removeItemFromCart(itemName) {
  if (cart[itemName]) {
    cartCount -= cart[itemName].quantity;
    delete cart[itemName];
  }
}

function showHint(message) {
  const hint = document.getElementById("hint");
  hint.textContent = message;
  hint.style.opacity = "1";

  clearTimeout(hint.timeoutId);

  hint.timeoutId = setTimeout(() => {
    hint.style.opacity = "0";
  }, 2000);
}

function showCategory(category) {
  const content = document.getElementById("content");
  const categoryUpperCase = category.toUpperCase();
  const menuItems = menu[category];

  content.innerHTML = `
      <h2 class="category-title">${categoryUpperCase} 料理</h2>

    <section class="category-section">
        ${menuItems.map(generateFoodItemHTML).join("")}
    </section>
  `;

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const itemName = e.target.parentElement
        .querySelector("span")
        .textContent.split(" - ")[0];
      const itemPrice = parseInt(
        e.target.parentElement
          .querySelector("strong")
          .textContent.split("$")[1],
      );
      console.log("itemName, ", itemName);
      console.log("itemPrice, ", itemPrice);
      addToCart(itemName, itemPrice);
      updateCartModal();
      showHint("已加入購物車");
    });
  });
}

function showRandomCombo() {
  const randomFoodCategory = ["toast", "egg-pie", "burger", "noodle"];
  const randomFoodCategoryIndex = Math.floor(
    Math.random() * randomFoodCategory.length,
  );
  const randomFood =
    menu[randomFoodCategory[randomFoodCategoryIndex]][
      Math.floor(
        Math.random() *
          menu[randomFoodCategory[randomFoodCategoryIndex]].length,
      )
    ];
  const randomDrink =
    menu["drink"][Math.floor(Math.random() * menu["drink"].length)];

  const randomComboContainer = document.getElementById("content");
  randomComboContainer.innerHTML = generateRandomComboHTML(
    randomFood,
    randomDrink,
  );

  // 更新隨機搭配資料
  currentRandomCombo = {
    food: randomFood,
    drink: randomDrink,
  };

  // 綁定事件
  document
    .getElementById("random-again")
    .addEventListener("click", showRandomCombo);
  document
    .getElementById("add-random-to-cart")
    .addEventListener("click", () => {
      if (currentRandomCombo) {
        addToCart(currentRandomCombo.food.name, currentRandomCombo.food.price);
        addToCart(
          currentRandomCombo.drink.name,
          currentRandomCombo.drink.price,
        );
        updateCartModal();
        updateCartCount();
        showHint("已加入購物車");
      }
    });
}

function showQueryForm() {
  document.getElementById("sidebar").style.left = "-250px";
  const queryContainer = document.getElementById("content");
  queryContainer.innerHTML = generateQueryFormHTML();
  queryContainer.addEventListener("click", (e) => {
    if (e.target.id === "clear-button") {
      const foodInput = document.getElementById("food-input");
      if (foodInput) {
        foodInput.value = "";
      }
    }
  });

  // const queryForm = document.getElementById("query-form");
  document.getElementById("query-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const contact = document.getElementById("phone-input").value.trim();
    const startDate = document.getElementById("start-date-input").value;
    const startTime = document.getElementById("start-time-input").value;
    const endDate = document.getElementById("end-date-input").value;
    const endTime = document.getElementById("end-time-input").value;

    const startDateTime =
      startDate && startTime ? `${startDate}T${startTime}` : null;
    const endDateTime = endDate && endTime ? `${endDate}T${endTime}` : null;

    queryOrders(contact, startDateTime, endDateTime).then((r) =>
      console.log(r),
    );
  });
}

function generateRandomComboHTML(food, drink) {
  return `
    <section id="random-combo-container" class="modal-content centered-container">
      <h2 class="random-combo-title">隨機搭配</h2>
      <div class="random-combo-details">
        <p class="random-combo-item">食物：${food.name} 單價為 $${food.price}</p>
        <p class="random-combo-item">飲料：${drink.name} 單價為 $${drink.price}</p>
        <div class="button-group">
          <button id="random-again" class="action-button">再隨機搭配一次</button>
          <button id="add-random-to-cart" class="action-button">加入隨機搭配至購物車</button>
        </div>
      </div>
    </section>
  `;
}

function generateFoodItemHTML(item) {
  return `
    <li class="menu-item">
      <h3>${item.name}</h3>
      <strong class="price">$${item.price}</strong>
      <button class="add-to-cart">加入購物車</button>
    </li>
  `;
}

function generateOrderBlockHTML(order) {
  const itemsHTML = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.itemName}</td>
        <td>${item.quantity}</td>
        <td>$${item.price}</td>
        <td>$${item.quantity * item.price}</td>
      </tr>
    `,
    )
    .join("");

  return `
    <article class="order-block">
      <header class="order-header">
        <h3>訂單編號：${order.orderId}</h3>
      </header>
      <section>
        <table class="order-info-table">
          <thead>
            <tr>
              <th>客戶姓名</th>
              <th>聯絡方式</th>
              <th>取餐時間</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${order.customerName}</td>
              <td>${order.contact}</td>
              <td>${new Date(order.pickupTime).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <table class="order-table">
        <thead>
          <tr>
            <th>餐點名稱</th>
            <th>數量</th>
            <th>單價</th>
            <th>小計</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
      <footer class="order-footer">
        <p class="order-total">訂單總計：<strong>$${order.items.reduce(
          (total, item) => total + item.quantity * item.price,
          0,
        )}</strong></p>
      </footer>
    </article>

  `;
}

function generateQueryFormHTML() {
  return `
    <h2>查詢表單測試</h2>
      <section id="query-container" class="modal-content centered-container">
        <h2 class="form-title">查詢訂單</h2>
        <form id="query-form">
          <div class="form-group">
            <label for="phone-input">電話號碼（可選）：</label>
            <input type="text" id="phone-input" name="phone" class="form-input" placeholder="請輸入電話號碼">
          </div>
          <div class="form-group date-time-group">
            <div class="date-time-row">
              <label for="start-date-input" class="date-time-label">From:</label>
              <input type="date" id="start-date-input" name="start-date" class="form-input">
              <input type="time" id="start-time-input" name="start-time" class="form-input">
            </div>
            <div class="date-time-row">
              <label for="end-date-input" class="date-time-label">To:</label>
              <input type="date" id="end-date-input" name="end-date" class="form-input">
              <input type="time" id="end-time-input" name="end-time" class="form-input">
            </div>
          </div>
          <div class="form-actions">
            <button type="reset" id="clear-button" class="action-button">清空</button>
            <button type="submit" id="submit-button" class="action-button">送出</button>
          </div>
        </form>
      </section>
  `;
}

function createCartItemElement(itemName, item) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${itemName} ： $${item.price} x ${item.quantity} = $${item.price * item.quantity}
  `;

  const button = document.createElement("button");
  button.className = "remove-item";
  button.textContent = "刪除";
  button.dataset.itemName = itemName;
  li.appendChild(button);

  return li;
}

document.getElementById("cart-link").addEventListener("click", () => {
  updateCartModal();
  document.getElementById("cart-modal").classList.add("open");
  document.querySelector(".modal-background").classList.add("open");
  document.getElementById("sidebar").style.left = "-250px";
});

document.getElementById("close-cart").addEventListener("click", closeCartModal);

document
  .querySelector(".modal-background")
  .addEventListener("click", closeCartModal);

// close the order-form if `Esc` is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("cart-modal").style.display = "none";
  }
});

document.getElementById("open-menu").addEventListener("click", () => {
  document.getElementById("sidebar").style.left = "0";
});

document.getElementById("close-menu").addEventListener("click", () => {
  document.getElementById("sidebar").style.left = "-250px";
});

// 刪除餐點功能
/*  從購物車裡面把餐點刪掉
    如果購物車中存在「奶茶」，就扣奶茶陣列的數量
    然後從購物車中把奶茶刪掉
    其他商品亦同
*/
// 點擊餐點分類選單
const categoryLinks = document.querySelectorAll("[data-category]");

categoryLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const category = e.target.getAttribute("data-category");
    showCategory(category);
    document.getElementById("sidebar").style.left = "-250px";
  });
});

document
  .querySelector('[data-category="random"]')
  .addEventListener("click", () => {
    showRandomCombo();
  });

document
  .getElementById("cart-submit-btn")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    // 取得表單資料
    const customerName = document.getElementById("cart-order-name").value;
    const contact = document.getElementById("cart-order-phone").value;
    const pickupTime = document.getElementById("cart-order-time").value;

    /* 2. 這部份要改成可以直接從購物車陣列中抓資料，用 cart 物件來處理 */
    const orderItems = Object.keys(cart).map((itemName) => {
      return {
        itemName: itemName,
        quantity: cart[itemName].quantity,
        price: cart[itemName].price,
      };
    });

    // 我們把訂單資料定義為一個物件，類似於 JSON 的形式，注意這不是真的 JSON
    const orderData = {
      customerName: customerName,
      contact: contact,
      pickupTime: pickupTime,
      orderItems: orderItems,
    };

    /** 這是真正的 JSON 檔案，注意 JSON 檔案不會有分號，也不能加註解
   * JSON = JavaScript Object Notation = JavaScript 物件標記
  const orderData = {
      "customerName": "customerName",
      "contact": "contact",
      "pickupTime": "pickupTime",
      "orderItems": "orderItems"
  }
   */

    try {
      // 發送 POST 請求到後端
      const response = await fetch("/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        /* 透過 JavaScript 內建的 method
         * 把 orderData 轉換為真正的 JSON 格式，送到 req.body 裡面
         * 這就是你在 Developer tool 裡面會看到的 Payload
         */
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`訂單成功！訂單ID: ${result.orderId}`);
      } else {
        alert(`錯誤：${result.message}`);
      }
    } catch (err) {
      alert("網路錯誤，請稍後再試！");
      console.error(err);
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const queryButton = document.getElementById("query");

  if (queryButton) {
    queryButton.addEventListener("click", (e) => {
      e.preventDefault();
      // const QueryContainer = document.getElementById("content");
      showQueryForm();
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const closeButton = document.getElementById("close-menu");
  const modalBackground = document.querySelector(".modal-background");

  document.getElementById("open-menu").addEventListener("click", () => {
    sidebar.classList.add("open");
    modalBackground.classList.add("open");
    document.body.classList.add("sidebar-open");
  });

  closeButton.addEventListener("click", closeSidebar);
  modalBackground.addEventListener("click", closeSidebar);

  closeSidebar();
});

async function queryOrders(contact, startDateTime, endDateTime) {
  // If all query conditions are empty, prompt the user
  if (!contact && !startDateTime && !endDateTime) {
    alert("請至少輸入一個查詢條件！");
    return;
  }

  try {
    const response = await fetch("/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact, startDateTime, endDateTime }),
    });

    const result = await response.json();

    if (response.ok) {
      // Display the query results
      displayOrders(result.data);
    } else {
      alert(`錯誤：${result.message}`);
    }
  } catch (err) {
    alert("(500) Internal Server Error");
    console.error(err);
  }
}
