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

  if (cart.length === 0) {
    cartModalItems.innerHTML = '<li>購物車是空的</li>';
    modalTotalPriceElem.textContent = '0';
    return;
  }

  // 顯示購物車項目，加入刪除按鈕
  cart.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      ${item.name} - $${item.price} 
      <button class="remove-item" data-index="${index}">刪除</button>
    `;
    cartModalItems.appendChild(listItem);
  });

  // 更新總價
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  modalTotalPriceElem.textContent = totalPrice;

  //更新數量
  cartCountElement.textContent = `(${cartCount})`;

  // 為每個刪除按鈕新增事件監聽
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1); // 刪除對應項目
      cartCount--;
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
function removeItemFromCart(index) {
  cart.splice(index, 1); // 移除該餐點
  cartCount--;
  updateCartModal(); // 更新顯示的購物車內容
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

  const menuItems = menu[category];

  menuItems.forEach(item => {
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
      cart.push({ name: itemName, price: itemPrice });
      cartCount++;

      // 更新彈窗購物車
      updateCartModal();
      updateCartCount();

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
  currentRandomCombo = { food: randomFood, drink: randomDrink };

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
      cart.push(currentRandomCombo.food);
      cart.push(currentRandomCombo.drink);
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



// // 點擊送出購物車
// document.getElementById('cart-submit').addEventListener('click', (e) => {
//   e.preventDefault(); // 防止表單默認提交行為

//   // 獲取表單欄位的值
//   const name = document.getElementById('order-name').value.trim();
//   const phone = document.getElementById('order-phone').value.trim();
//   const time = document.getElementById('order-time').value;

//   // 驗證表單是否填寫完整
//   if (!name || !phone || !time) {
//     showHint('請完整填寫所有訂購資訊！');
//     return;
//   }

//   // 驗證電話格式 (假設為 10 位數字)
//   if (!/^[0-9]{10}$/.test(phone)) {
//     showHint('請輸入有效的電話號碼！');
//     return;
//   }

//   // 驗證成功，顯示提示訊息
//   showHint(`訂單已成功送出！\n取餐時間：${time}`);

//   // 清空購物車內容
//   cart = [];
//   cartCount = 0;
//   updateCartModal(); // 更新購物車顯示
//   updateCartCount(); // 更新購物車數量顯示

//   // 自動關閉購物車彈窗
//   const cartModal = document.getElementById('cart-modal');
//   cartModal.style.display = 'none';
// });


document.getElementById("cart-submit").addEventListener("click", async (e) => {
  e.preventDefault();

  // 取得表單資料
  const customerName = document.getElementById("order-name").value;
  const contact = document.getElementById("order-phone").value;
  const pickupTime = document.getElementById("order-time").value;

  // 假設訂單項目是靜態的，您可以根據實際情況來取得
  const orderItems = [
    { itemName: "餐點A", quantity: 1, price: 100 },
    { itemName: "餐點B", quantity: 2, price: 150 }
  ];
  

  // 構建訂單資料
  const orderData = {
    customerName: customerName,
    contact: contact,
    pickupTime: pickupTime,
    orderItems: orderItems
  };

  try {
    // 發送 POST 請求到後端
    const response = await fetch("/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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


