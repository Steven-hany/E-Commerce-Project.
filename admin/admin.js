function renderAdmin() {
  document.getElementById("total-products").textContent =
    (getData("products") || []).length;

  document.getElementById("total-orders").textContent =
    (getData("orders") || []).length;

  document.getElementById("total-users").textContent =
    (getData("users") || []).length;
}

renderAdmin();
