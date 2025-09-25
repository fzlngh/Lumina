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

// Popup
const loginPopup = document.getElementById("loginPopup");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.getElementById("closePopup");
const usernameInput = document.getElementById("username");

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
    1024: { slidesPerView: 3 }
  }
});

// Swiper for Recent Order
const recentSwiper = new Swiper(".recent-swiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  freeMode: true,
  grabCursor: true,
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});


// ====================
// NAVBAR ACTIVE + LOGIN GUARD
// ====================
navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    if (!isLoggedIn && !item.classList.contains("active")) {
      e.preventDefault();
      showLogin();
      return;
    }
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  });
});

// ====================
// CATEGORY TOGGLE
// ====================
categories.forEach(cat => {
  cat.addEventListener("click", () => {
    categories.forEach(c => c.classList.remove("active-category"));
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
