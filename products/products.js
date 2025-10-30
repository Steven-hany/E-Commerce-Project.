const productsGrid = document.getElementById("all-products");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

async function loadProducts() {
  let products = getData("products");

  if (!products) {
    const res = await fetch("https://fakestoreapi.com/products");
    products = await res.json();
    saveData("products", products);
  }

  displayProducts(products);
  loadCategories(products);
}

function displayProducts(products) {
  productsGrid.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3 class="product-title">${p.title}</h3>
      <p class="product-price">$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    productsGrid.appendChild(card);
  });
}

function loadCategories(products) {
  const categories = [...new Set(products.map(p => p.category))];
  categoryFilter.innerHTML = `<option value="">All</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

searchInput?.addEventListener("input", () => {
  const products = getData("products") || [];
  const keyword = searchInput.value.toLowerCase();
  displayProducts(products.filter(p => p.title.toLowerCase().includes(keyword)));
});

categoryFilter?.addEventListener("change", () => {
  const products = getData("products") || [];
  displayProducts(categoryFilter.value ? products.filter(p => p.category === categoryFilter.value) : products);
});

loadProducts();
