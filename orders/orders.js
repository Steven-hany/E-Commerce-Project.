const ordersList = document.getElementById("orders-list");

function renderOrders() {
  const orders = getData("orders") || [];
  ordersList.innerHTML = "";

  if (!orders.length) {
    ordersList.innerHTML = "<p>No orders found.</p>";
    return;
  }

  orders.forEach(o => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-card";
    orderDiv.innerHTML = `
      <h4>Order #${o.id}</h4>
      <p>Date: ${o.date}</p>
      <ul>
        ${o.items.map(i => `<li>${i.title} (x${i.quantity})</li>`).join("")}
      </ul>
    `;
    ordersList.appendChild(orderDiv);
  });
}

renderOrders();