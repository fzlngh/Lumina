// ====================
// STATE & SELECTOR
// ====================
let isLoggedIn = false;
let cart = [];

const navItems = document.querySelectorAll(".nav-item");
const categories = document.querySelectorAll(".cat-item");
const addCartBtns = document.querySelectorAll(".add-cart");
const orderMenu = document.querySelector(".item-bottom");
const userTitle = document.querySelector(".item-top h2");
const searchBox = document.querySelector(".search");
const searchInput = searchBox.querySelector("Input");
const heroTitle = document.querySelector(".text-opening");
const recommendationsList = document.getElementById("recommendationsList");

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
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

// ====================
// NAVBAR ACTIVE + LOGIN GUARD
// ====================
navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    if (!isLoggedIn && !item.classList.contains("active")) {
      e.preventDefault();
      showLogin();
      return;
    }
    navItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
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
  if (cart.length === 0) {
    orderMenu.innerHTML = `<h4>Order Menu</h4><p>There's nothing to order</p>`;
    return;
  }

  orderMenu.innerHTML = `<h4>Order Menu</h4>`;
  cart.forEach((item, index) => {
    const p = document.createElement("p");
    p.textContent = `${index + 1}. ${item}`;
    orderMenu.appendChild(p);
  });
}

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
// RESTORE SESSION
// ====================
window.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("luminaUser");
  if (savedUser) {
    isLoggedIn = true;
    userTitle.textContent = `Hello, ${savedUser}`;
  }
});
