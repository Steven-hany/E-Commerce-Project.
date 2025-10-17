document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();

  // Protect admin page
  if (!user || !user.is_admin) {
    alert("Access denied. Admins only.");
    window.location.href = "../index.html";
    return;
  }

  renderAdmin();
});

function renderAdmin() {
  const products = getData("products") || [];
  const orders = getData("orders") || [];
  const users = getData("users") || [];

  const totalProductsEl = document.getElementById("total-products");
  const totalOrdersEl = document.getElementById("total-orders");
  const totalUsersEl = document.getElementById("total-users");

  if (totalProductsEl) totalProductsEl.textContent = products.length;
  if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
  if (totalUsersEl) totalUsersEl.textContent = users.length;
}