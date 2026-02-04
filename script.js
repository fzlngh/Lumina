// ====================
// STATE & SELECTOR
// ====================
let isLoggedIn = false;
let cart = [];

const categories = document.querySelectorAll(".cat-item");
const addCartBtns = document.querySelectorAll(".add-cart");
const orderMenu = document.querySelector(".item-bottom");
const userTitle = document.querySelector(".item-top h2");
const searchBox = document.querySelector(".search");
const searchInput = searchBox.querySelector("Input");
const heroTitle = document.querySelector(".text-opening");
const recommendationsList = document.getElementById("recommendationsList");
const hero = document.getElementById("hero");
const dashboard = document.getElementById("dashboard");
const foodOrder = document.getElementById("food-order");
const orderHistory = document.getElementById("order-history");
const setting = document.getElementById("setting");
const sidebarRight = document.querySelector(".navbar-right");
const orderFood = document.getElementById("order-food");
const qr = document.getElementById("qr");
const historyOrder = document.getElementById("history-order");
const settingItem = document.getElementById("setting-item");
const billBtn = document.getElementById("open-bill");
const closeQR = document.getElementById("close");
const qrImg = document.getElementById("qr-img");
const qrDownload = document.getElementById("download-qr");
const checkout = document.getElementById("checkout-btn");
const sate = document.getElementById("sate");
const cancel = document.getElementById("cancel-btn");
const navItems = [dashboard, foodOrder, orderHistory, setting];

cancel.disabled = true;
checkout.disabled = true;

// Popup
const loginPopup = document.getElementById("loginPopup");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.getElementById("closePopup");
const usernameInput = document.getElementById("username");

// ====================
// DUMMY LIST REKOMENDASI
// ====================
const allRecommendations = [
  "Pizza",
  "Burger",
  "Fried Rice",
  "Sushi",
  "Pasta",
  "Ice Cream",
  "Salad",
  "Steak",
  "Donut",
  "Ramen",
];

// ====================
// SWIPER INIT
// ====================
// Swiper for Food
const foodSwiper = new Swiper(".food-swiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  freeMode: true,
  grabCursor: true,
  loop : true,
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

// Swiper for Recent Order
const recentSwiper = new Swiper(".recent-swiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  freeMode: true,
  grabCursor: true,
  loop : true,
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

// ====================
// NAVBAR ACTIVE + LOGIN GUARD
// ====================
function handleNavClick(clickedItem) {
  // Cek login guard
  if (!isLoggedIn && !clickedItem.classList.contains("active")) {
    showLogin();
    return;
  }

  // Hapus active dari semua menu
  navItems.forEach((item) => item.classList.remove("active"));

  // Tambahkan active ke menu yang dipilih
  clickedItem.classList.add("active");

  // Jika dashboard aktif → aktifkan hero & sidebar right
  if (clickedItem === dashboard) {
    hero.classList.add("active");
    sidebarRight.classList.add("active");
  } else {
    hero.classList.remove("active");
    sidebarRight.classList.remove("active");
  }

  if (clickedItem === foodOrder) {
    orderFood.classList.add("active");
  } else {
    orderFood.classList.remove("active");
  }

  if (clickedItem === orderHistory) {
    historyOrder.classList.add("active");
  } else {
    historyOrder.classList.remove("active");
  }

  if (clickedItem === setting) {
    settingItem.classList.add("active");
  } else {
    settingItem.classList.remove("active");
  }
}

// Pasang event listener ke semua menu
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    handleNavClick(item);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  handleNavClick(dashboard); // dashboard aktif pertama kali
});

// ====================
// BILL BUTTON (OPEN MIDTRANS LINK)
// ====================
billBtn.addEventListener("click", () => {
  if (!isLoggedIn) {
    showLogin();
    return;
  }

  // langsung buka link midtrans
  window.open(
    "https://app.sandbox.midtrans.com/payment-links/1759286743747",
    "_blank"
  );
});

searchInput.addEventListener("focus", () => {
  searchBox.classList.add("active");
  heroTitle.classList.add("hidden");
  showRecommendations(allRecommendations);
});

searchInput.addEventListener("blur", () => {
  setTimeout(() => {
    // beri jeda supaya klik rekomendasi tidak langsung hilang
    searchBox.classList.remove("active");
    heroTitle.classList.remove("hidden");
    recommendationsList.innerHTML = ""; // clear
  }, 200);
});

// ====================
// RENDER REKOMENDASI KE LIST
// ===================

function showRecommendations(list) {
  recommendationsList.innerHTML = "";
  if (list.length === 0) {
    recommendationsList.innerHTML = "<li>No results found</li>";
    return;
  }
  list.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => {
      searchInput.value = item; // isi input
      recommendationsList.innerHTML = ""; // clear setelah dipilih
    });
    recommendationsList.appendChild(li);
  });
}

// ====================
// CATEGORY TOGGLE
// ====================
categories.forEach((cat) => {
  cat.addEventListener("click", () => {
    categories.forEach((c) => c.classList.remove("active-category"));
    cat.classList.add("active-category");
  });
});

// ====================
// ADD TO CART
// ====================
addCartBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!isLoggedIn) {
      showLogin();
      return;
    }

    const productName = btn.previousElementSibling.textContent;
    cart.push(productName);
    renderCart();
  });
});

function renderCart() {
  // Jika kosong
  if (cart.length === 0) {
    orderMenu.innerHTML = `<h4>Order Menu</h4><p>There's nothing to order</p>`;
    checkout.classList.add("disable");
    checkout.disabled = true;
    cancel.classList.add("disable");
    cancel.disabled = true;
    return;
  }

  // Jika ada isi cart
  orderMenu.innerHTML = `<h4>Order Menu</h4>`;
  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.marginBottom = "6px";

    const p = document.createElement("p");
    p.textContent = `${index + 1}. ${item}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.background = "transparent";
    removeBtn.style.border = "none";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.fontSize = "16px";

    // Event hapus item
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1); // hapus item berdasarkan index
      renderCart(); // render ulang tampilan cart
    });

    div.appendChild(p);
    div.appendChild(removeBtn);
    orderMenu.appendChild(div);
  });

  checkout.classList.remove("disable");
  checkout.disabled = false;
  cancel.classList.remove("disable");
  cancel.disabled = false;
}

// ====================
// CANCEL BUTTON
// ====================
cancel.addEventListener("click", () => {
  if (cart.length === 0) return;

  if (confirm("Yakin ingin membatalkan semua pesanan?")) {
    cart = [];
    renderCart();
    alert("Semua pesanan telah dibatalkan!");
  }
});

// ====================
// LOGIN POPUP
// ====================
function showLogin() {
  loginPopup.classList.remove("hidden");
}

closeBtn.addEventListener("click", () => {
  loginPopup.classList.add("hidden");
});

loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username) {
    isLoggedIn = true;
    localStorage.setItem("luminaUser", username);
    userTitle.textContent = `Hello, ${username}`;
    loginPopup.classList.add("hidden");
  } else {
    alert("Please enter your name!");
  }
});

// ====================
// CHECKOUT BUTTON
// ====================

checkout.addEventListener("click", () => {
  if (!isLoggedIn) {
    showLogin();
    return;
  }

  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  // Reset cart
  cart = [];
  renderCart();

  // Tambahkan class active ke sate
  sate.classList.add("active");

  alert("Checkout berhasil!");
});

// ====================
// RESTORE SESSION
// ====================
window.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("luminaUser");
  if (savedUser) {
    isLoggedIn = true;
    userTitle.textContent = `Hello, ${savedUser}`;
  }
});
