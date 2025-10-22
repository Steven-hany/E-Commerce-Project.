import { AppDataSource } from '../data-source.js';

export const AdminController = {
  metrics: async (_req, res) => {
    const productCount = await AppDataSource.getRepository('Product').count({ where: { deleted_at: null } });
    // Placeholders — replace with real queries if you have orders table
    const totalSales = 0;
    const activeUsers = 0;
    const ordersByStatus = { PENDING: 0, PAID: 0, SHIPPED: 0, CANCELLED: 0 };
    res.json({ totalSales, productCount, activeUsers, ordersByStatus });
  }
};
