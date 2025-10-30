// services/orderService.js - للتعامل مع Backend فقط
const API_BASE = 'http://localhost:5000/api';

export class OrderService {
    // حفظ الطلب في Backend
    static async saveOrder(orderData) {
        try {
            const response = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('فشل في حفظ الطلب');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('خطأ في حفظ الطلب في Backend:', error);
            // نسخة احتياطية في LocalStorage
            return this.saveOrderToLocal(orderData);
        }
    }

    // جلب جميع الطلبات من Backend
    static async getOrders() {
        try {
            const response = await fetch(`${API_BASE}/orders`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('فشل في جلب الطلبات');
            }

            const result = await response.json();
            return result.orders || [];
        } catch (error) {
            console.error('خطأ في جلب الطلبات من Backend:', error);
            // نسخة احتياطية من LocalStorage
            return this.getOrdersFromLocal();
        }
    }

    // نسخة احتياطية في LocalStorage
    static saveOrderToLocal(orderData) {
        const orders = JSON.parse(localStorage.getItem('orders_backup') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders_backup', JSON.stringify(orders));
        return { success: true, source: 'local_backup' };
    }

    static getOrdersFromLocal() {
        return JSON.parse(localStorage.getItem('orders_backup') || '[]');
    }

    static getToken() {
        return localStorage.getItem('authToken') || 'demo-token';
    }
}