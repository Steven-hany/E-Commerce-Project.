let cart = getData("cart") || [];
const cartItemsDiv = document.getElementById("cart-items");
const cartTotalDiv = document.getElementById("cart-total");

function addToCart(id) {
  const products = getData("products") || [];
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(c => c.id === id);
  existing ? existing.quantity++ : cart.push({...product, quantity: 1});

  saveData("cart", cart);
  renderCart();
}

function renderCart() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    cartItemsDiv.innerHTML += `
      <div class="cart-item">
        <span>${item.title} (x${item.quantity})</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  });

  cartTotalDiv.textContent = `Total: $${total.toFixed(2)}`;
}

document.getElementById("checkout-btn")?.addEventListener("click", () => {
  if (!cart.length) return alert("Cart is empty!");

  const orders = getData("orders") || [];
  orders.push({
    id: generateId("order"),
    items: cart,
    date: new Date().toLocaleString()
  });

  saveData("orders", orders);
  cart = [];
  saveData("cart", cart);
  renderCart();
  alert("Order placed successfully!");
});

renderCart();
