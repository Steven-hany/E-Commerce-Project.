// tests/helpers/transactionHelpers.js (النسخة المبسطة)
import { db } from "../src/config/database.js";

export async function createOrderFromCartWithForcedError(userId) {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // 1. أنشئ طلب جديد
    const orderResult = await connection.execute(
      `INSERT INTO orders (user_id, total_amount, status, order_number)
       VALUES (?, 100, 'PENDING', 'TEST-ORDER')`,
      [userId]
    );
    
    console.log('✅ تم إنشاء الطلب بنجاح');

    // 2. ⚠️ فشل متعمد هنا!
    throw new Error('فشل متعمد في منتصف الـ Transaction');

    // 3. ❌ هذا الكود لن ينفذ
    await connection.commit();
    return { success: true };
    
  } catch (error) {
    await connection.rollback();
    console.log('🔄 تم التراجع عن كل العمليات');
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
}