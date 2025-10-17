// LocalStorage helpers
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getData(key) {
  const d = localStorage.getItem(key);
  return d ? JSON.parse(d) : null;
}

function removeData(key) {
  localStorage.removeItem(key);
}

function generateId(prefix = "id") {
  return prefix + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

// Auth helpers
function getCurrentUser() {
  return getData("currentUser");
}

function setCurrentUser(u) {
  saveData("currentUser", u);
}

function logoutUser() {
  removeData("currentUser");
  window.location.href = "login/login.html"; // رجّع المستخدم لصفحة تسجيل الدخول
}

// Cart helper
function addToCart(id) {
  let cart = getData("cart") || [];
  const products = getData("products") || [];
  const product = products.find(p => p.id === id);

  if (!product) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveData("cart", cart);
  alert("Added to cart!");
}

// Navbar logic
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const loginLink = document.getElementById("loginLink");
  const adminLink = document.getElementById("adminLink");
  const user = getCurrentUser();

  if (user) {
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (loginLink) loginLink.style.display = "none";

    if (adminLink && !user.is_admin) {
      adminLink.style.display = "none";
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        logoutUser();
      });
    }
  } else {
    if (logoutBtn) logoutBtn.style.display = "none";
    if (adminLink) adminLink.style.display = "none";
  }
  function logoutUser() {
  removeData("currentUser");
  window.location.href = "../auth/auth.html"; 
}
});