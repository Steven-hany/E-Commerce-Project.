import { AppDataSource } from "../config/database.js";
import { Order } from "../models/Order.js";

export class OrderController {
    // إنشاء طلب جديد
    static async createOrder(req, res) {
        try {
            const { items, total, date, status } = req.body;
            const userId = req.user?.id || 'anonymous';

            const orderRepository = AppDataSource.getRepository(Order);
            
            const order = orderRepository.create({
                orderId: `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                items,
                total,
                status: status || 'pending',
                createdAt: new Date()
            });

            await orderRepository.save(order);

            res.status(201).json({
                success: true,
                message: 'تم إنشاء الطلب بنجاح',
                order: order
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'فشل في إنشاء الطلب'
            });
        }
    }

    // جلب جميع طلبات المستخدم
    static async getOrders(req, res) {
        try {
            const userId = req.user?.id || 'anonymous';

            const orderRepository = AppDataSource.getRepository(Order);
            const orders = await orderRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' }
            });

            res.json({
                success: true,
                orders: orders
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'فشل في جلب الطلبات'
            });
        }
    }
}