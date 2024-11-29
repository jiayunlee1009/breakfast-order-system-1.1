let cart = []; // 儲存購物車內容
let cartCount = 0; // 購物車內商品數量
let currentRandomCombo = null; // 記錄目前的隨機搭配

// 菜單內容
const menu = {
  toast: [
    { name: '豬排蛋吐司', price: 50 },
    { name: '鮪魚蛋吐司', price: 55 },
    { name: '火腿起司吐司', price: 60 },
    { name: '花生醬吐司', price: 20 },
    { name: '巧克力醬吐司', price: 20 },
    { name: '培根蛋吐司', price: 50 },
    { name: '起司肉鬆吐司', price: 50 },
    { name: '蔬菜總匯吐司', price: 60 },
    { name: '蛋沙拉吐司', price: 50 },
    { name: '牛肉蛋吐司', price: 70 },
    { name: '蜂蜜奶油吐司', price: 35}
  ],
  'egg-pie': [
    { name: '原味蛋餅', price: 30 },
    { name: '蔥花蛋餅', price: 35 },
    { name: '起司蛋餅', price: 35 },
    { name: '玉米蛋餅', price: 35 },
    { name: '起司玉米蛋餅', price: 45 },
    { name: '薯餅蛋餅', price: 45 },
    { name: '芋泥蛋餅', price: 60 },
    { name: '鮪魚蛋餅', price: 45 },
    { name: '培根蛋餅', price: 45 },
    { name: '辣味雞肉蛋餅', price: 55 },
    { name: '熱狗蛋餅', price: 55 },
    { name: '蔬菜蛋餅', price: 50 },
    { name: '牛肉蛋餅', price: 65 }
  ],
  burger: [
    { name: '牛肉漢堡', price: 80 },
    { name: '雞肉漢堡', price: 70 },
    { name: '魚排漢堡', price: 70 },
    { name: '培根漢堡', price: 60 },
    { name: '雙層牛肉漢堡', price: 100 },
    { name: '豬肉漢堡', price: 70 },
    { name: '起司蛋漢堡', price: 50 },
    { name: '薯餅漢堡', price: 50 },
    { name: '素食漢堡', price: 60 },
    { name: '總匯漢堡', price: 80 },
    { name: '辣味雞肉漢堡', price: 75 }
  ],
  noodle: [
    { name: '蘑菇麵', price: 50 },
    { name: '黑胡椒麵', price: 50 },
    { name: '陽春麵', price: 50 },
    { name: '麻醬麵', price: 50 },
    { name: '肉燥麵', price: 50 },
    { name: '豬排麵', price: 55 },
    { name: '素肉麵', price: 60 }
  ],
  drink: [
    { name: '柳橙汁', price: 30 },
    { name: '綠茶', price: 25 },
    { name: '紅茶', price: 25 },
    { name: '奶茶', price: 35 },
    { name: '檸檬紅茶', price: 30 },
    { name: '蜂蜜綠茶', price: 35 },
    { name: '巧克力牛奶', price: 35 },
    { name: '蘋果汁', price: 30 },
    { name: '咖啡', price: 50 },
    { name: '鮮奶茶', price: 50 },
    { name: '可可', price: 40 }
  ]
}

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

  

// 更新購物車數量顯示
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  cartCountElement.textContent = `(${cartCount})`;
}

// 更新購物車彈窗
function updateCartModal() {
  const cartModalItems = document.getElementById('cart-modal-items');
  const modalTotalPriceElem = document.getElementById('modal-total-price');
  const cartCountElement = document.getElementById('cart-count');

  // 清空彈窗購物車內容
  cartModalItems.innerHTML = '';

  if (Object.keys(cart).length === 0) {
    cartModalItems.innerHTML = '<li>購物車是空的</li>';
    modalTotalPriceElem.textContent = '0';
    return;
  }

  // 顯示購物車項目，加入刪除按鈕
  let totalPrice = 0;
  for (let itemName in cart) {
    const item = cart[itemName];
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      ${itemName} - $${item.price} x ${item.quantity} = $${item.price * item.quantity}
      <button class="remove-item" data-item-name="${itemName}">刪除</button>
    `;
    cartModalItems.appendChild(listItem);
    totalPrice += item.price * item.quantity;
  }
  modalTotalPriceElem.textContent = totalPrice;

  //更新數量
  cartCountElement.textContent = `(${cartCount})`;

  // 為每個刪除按鈕新增事件監聽
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
      const itemName = e.target.dataset.itemName;
      removeItemFromCart(itemName);
      updateCartModal(); // 更新彈窗顯示
      updateCartCount(); // 更新購物車數量
    });
  });
}

// 顯示購物車彈窗
document.getElementById('cart-link').addEventListener('click', () => {
  updateCartModal();
  document.getElementById('cart-modal').style.display = 'block';
  document.getElementById('sidebar').style.left = '-250px';
});



// 關閉購物車彈窗
document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'none';
});



// 顯示提示訊息
function showHint(message) {
  const hint = document.getElementById('hint');
  hint.textContent = message;
  hint.style.opacity = '1';

   // 清除先前的隱藏計時器，避免重疊顯示問題
   clearTimeout(hint.timeoutId);

   // 設定隱藏提示的計時器
   hint.timeoutId = setTimeout(() => {
     hint.style.opacity = '0';
   }, 2000);
}

// 點擊開啟側邊菜單
document.getElementById('open-menu').addEventListener('click', () => {
  document.getElementById('sidebar').style.left = '0';
});

// 點擊關閉側邊菜單
document.getElementById('close-menu').addEventListener('click', () => {
  document.getElementById('sidebar').style.left = '-250px';
});

// 刪除餐點功能
/*  從購物車裡面把餐點刪掉 
    如果購物車中存在「奶茶」，就扣奶茶陣列的數量
    然後從購物車中把奶茶刪掉
    其他商品亦同
*/
function removeItemFromCart(itemName) {
  if (cart[itemName]) {
    cartCount -= cart[itemName].quantity; 
    delete cart[itemName];
  }
}
// 點擊餐點分類選單
const categoryLinks = document.querySelectorAll('[data-category]');
categoryLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const category = e.target.getAttribute('data-category');
    showCategory(category);
    // 在選擇分類後自動關閉側邊菜單
    document.getElementById('sidebar').style.left = '-250px';
  });
});

// 顯示餐點類別
function showCategory(category) {
  const content = document.getElementById('content');
  let categoryHTML = `<h2>${category} 料理</h2><ul>`;

  // console.log("menu.category", menu.category) // undefined
  const menuItems = menu[category];
  // console.log("menuItems", menuItems) // 有 menu

  menuItems.forEach( item => {
    categoryHTML += `
      <li>
        <span>${item.name} - $${item.price}</span>
        <button class="add-to-cart">加入購物車</button>
      </li>
    `;
  });

  categoryHTML += `</ul>`;
  content.innerHTML = categoryHTML;

  // 當使用者點擊加入購物車時
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const itemName = e.target.parentElement.querySelector('span').textContent.split(' - ')[0];
      const itemPrice = parseInt(e.target.parentElement.querySelector('span').textContent.split('$')[1]);
      
      // 新增到購物車
      addToCart(itemName, itemPrice);
      // cart.push({ name: itemName, price: itemPrice });
      // // cartCount++;

      // /* 1. 這部份需要調整到可以做基礎統計，例如
      //       火腿蛋土司 $50 * 7個 共 350 元
      //       培根蛋吐司 $50 * 5個 共 250 元
            
      //       這樣你前面就要先透過陣列來紀錄數量。 
      // */

      // console.log("cart", ...cart)

      // 更新彈窗購物車
      updateCartModal();
      // updateCartCount();

      // 顯示提示訊息
      showHint('已加入購物車');
    });
  });
}

// 顯示隨機搭配餐點
function showRandomCombo() {
  // 隨機選擇食物和飲料
  const randomFoodCategory = ['toast', 'egg-pie', 'burger', 'noodle'];
  const randomFoodCategoryIndex = Math.floor(Math.random() * randomFoodCategory.length);
  const randomFood = menu[randomFoodCategory[randomFoodCategoryIndex]][Math.floor(Math.random() * menu[randomFoodCategory[randomFoodCategoryIndex]].length)];
  
  const randomDrink = menu['drink'][Math.floor(Math.random() * menu['drink'].length)];

  console.log("randomFood", randomFood)
  console.log("randomDrink", randomDrink)

  // 更新隨機搭配區域內容
  const randomComboContainer = document.getElementById('content');
  randomComboContainer.innerHTML = `
    <h2>隨機搭配</h2>
    <p>食物: ${randomFood.name} - $${randomFood.price}</p>
    <p>飲料: ${randomDrink.name} - $${randomDrink.price}</p>
    <button id="random-again">再隨機搭配一次</button>
    <button id="add-to-cart">加入隨機搭配至購物車</button>
  `;

  // 記錄目前的隨機搭配
  currentRandomCombo = { 
    food: {
      name: randomFood.name,
      price: randomFood.price
    }, 
    drink: {
      name: randomDrink.name,
      price: randomDrink.price
    }
  };
  console.log("currentRandomCombo", currentRandomCombo)
  console.log("currentRandomCombo.food.name", currentRandomCombo.food.name)


  // 自動關閉側拉選單
  document.getElementById('sidebar').style.left = '-250px';
  
  // 綁定事件
  bindRandomComboEvents();
}

// 綁定隨機搭配按鈕事件
function bindRandomComboEvents() {

  // 點擊再隨機搭配一次
  document.getElementById('random-again').addEventListener('click', showRandomCombo);

  // 點擊加入隨機搭配至購物車
  document.getElementById('add-to-cart').addEventListener('click', () => {
    if (currentRandomCombo) {
      
      addToCart(currentRandomCombo.food.name, currentRandomCombo.food.price)
      addToCart(currentRandomCombo.drink.name, currentRandomCombo.drink.price)
      // cart.push(currentRandomCombo.food.name);
      // cart = [辣味雞肉蛋餅,] 
      // cart.push(currentRandomCombo.drink.name);
      // cart = [辣味雞肉蛋餅, 鮮奶茶] 
    
      console.log("currentRandomCombo", currentRandomCombo);
      cartCount += 2; // 更新購物車數量
      updateCartModal();  // 更新購物車數量
      updateCartCount();
      showHint('已加入購物車');
    }
  });
}

// 點擊"隨機搭配"選單項目
document.querySelector('[data-category="random"]').addEventListener('click', () => {
  showRandomCombo();
});


document.getElementById("cart-submit").addEventListener("click", async (e) => {
  e.preventDefault();

  // 取得表單資料
  const customerName = document.getElementById("order-name").value;
  const contact = document.getElementById("order-phone").value;
  const pickupTime = document.getElementById("order-time").value;

  /* 2. 這部份要改成可以直接從購物車陣列中抓資料，用 cart 物件來處理 */
  const orderItems = Object.keys(cart).map(itemName => {
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
    orderItems: orderItems
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
        "Content-Type": "application/json"
      },
      /* 透過 JavaScript 內建的 method 
       * 把 orderData 轉換為真正的 JSON 格式，送到 req.body 裡面
       * 這就是你在 Developer tool 裡面會看到的 Payload
      */
      body: JSON.stringify(orderData)
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


