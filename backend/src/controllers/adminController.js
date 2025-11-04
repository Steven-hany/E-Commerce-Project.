import { AppDataSource } from '../data-source.js';
import asyncHandler from 'express-async-handler';
import { ProductSchema } from '../models/Product.js'; // تأكد إن اسم الموديل مطابق لتعريف الـ Entity

// 📊 إحصائيات لوحة التحكم
export const metrics = asyncHandler(async (_req, res) => {
  const productCount = await AppDataSource.getRepository(ProductSchema).count({
    where: { deleted_at: null }
  });

  // بيانات تجريبية — استبدلها لاحقًا باستعلامات حقيقية
  const totalSales = 0;
  const activeUsers = 0;
  const ordersByStatus = {
    PENDING: 0,
    PAID: 0,
    SHIPPED: 0,
    CANCELLED: 0
  };

  res.json({ totalSales, productCount, activeUsers, ordersByStatus });
});

// 🗑️ حذف منتج
export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const productRepo = AppDataSource.getRepository(ProductSchema);

  const product = await productRepo.findOneBy({ id: productId });

  if (!product) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }

  await productRepo.softDelete(productId); // أو .remove(product) لو مش بتستخدم soft delete

  res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
});

// 📈 نظرة عامة للوحة التحكم
export const getOverview = asyncHandler(async (_req, res) => {
  // بيانات تجريبية — استبدلها لاحقًا باستعلامات حقيقية
  const totalUsers = 0;
  const totalSales = 0;
  const topProducts = [];
  const recentOrders = [];

  res.json({
    totalUsers,
    totalSales,
    topProducts,
    recentOrders
  });
});