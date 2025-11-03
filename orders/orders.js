// orders.js - بدون import/export
const ordersList = document.getElementById("orders-list");

// دالة بديلة لـ OrderService.getOrders()
async function getOrdersFromBackend() {
    try {
        console.log('🔄 جلب الطلبات من Backend...');
        const response = await fetch('http://localhost:3000/api/orders');
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ بيانات الـ Backend:', result);
        
        return result.orders || result.data || [];
        
    } catch (error) {
        console.error('❌ فشل في جلب الطلبات:', error);
        
        // نسخة احتياطية من localStorage
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        console.log('📋 استخدام النسخة المحلية:', localOrders);
        
        return localOrders;
    }
}

async function renderOrders() {
    try {
        // استخدام الدالة المحلية بدل import
        const orders = await getOrdersFromBackend();
        ordersList.innerHTML = "";

        console.log('📦 البيانات المستلمة:', orders);

        if (!orders || !orders.length) {
            ordersList.innerHTML = "<p>No orders found.</p>";
            return;
        }

        orders.forEach(order => {
            const orderDiv = document.createElement("div");
            orderDiv.className = "order-card";
            
            // استخدام البيانات بشكل آمن
            orderDiv.innerHTML = `
                <h4>Order #${order.orderId || order.id || 'N/A'}</h4>
                <p>Date: ${order.createdAt || order.date || 'Unknown date'}</p>
                <ul>
                    ${(order.items || []).map(item => `
                        <li>${item.title || item.name} (x${item.quantity})</li>
                    `).join("")}
                </ul>
            `;
            ordersList.appendChild(orderDiv);
        });

    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = "<p>Error loading orders. Please try again.</p>";
    }
}

// تحميل الطلبات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', renderOrders);