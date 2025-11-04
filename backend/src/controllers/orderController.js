import { AppDataSource } from "../database config.js";
import { Order } from "../models/Order.js";
import asyncHandler from "express-async-handler";

// إنشاء طلب جديد
export const createOrder = asyncHandler(async (req, res) => {
  const { items, total, date, status } = req.body;
  const userId = req.user?.id || "anonymous";

  const orderRepository = AppDataSource.getRepository(Order);

  const order = orderRepository.create({
    orderId: `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    items,
    total,
    status: status || "pending",
    createdAt: new Date()
  });

  await orderRepository.save(order);

  res.status(201).json({
    success: true,
    message: "تم إنشاء الطلب بنجاح",
    order
  });
});

// جلب جميع طلبات المستخدم
export const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.id || "anonymous";

  const orderRepository = AppDataSource.getRepository(Order);
  const orders = await orderRepository.find({
    where: { userId },
    order: { createdAt: "DESC" }
  });

  res.json({
    success: true,
    orders
  });
});