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
  window.location.href = "index.html";
}

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