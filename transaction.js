// src/server.js
import "reflect-metadata";
import express from "express";
import { DataSource, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import dotenv from "dotenv";

console.log("جاري تحميل .env...");
dotenv.config();

// === طباعة البيئة للتأكد ===
console.log("البيئة:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

// === 1. الكيانات ===
@Entity("orders")
class Order {
  @PrimaryGeneratedColumn()
  id;

  @Column("decimal", { precision: 10, scale: 2 })
  total;

  @CreateDateColumn()
  date;
}

@Entity("payments")
class Payment {
  @PrimaryGeneratedColumn()
  id;

  @ManyToOne(() => Order, { onDelete: "CASCADE" })
  order;

  @Column("decimal", { precision: 10, scale: 2 })
  amount;

  @Column()
  method;

  @CreateDateColumn()
  paidAt;
}

// === 2. DataSource ===
console.log("جاري إعداد الاتصال بـ SQL Server...");
const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 1433,
  username: process.env.DB_USER || "sa",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "ecommerce_db",
  synchronize: true,
  logging: true, // مهم: اطبع كل استعلام
  entities: [Order, Payment],
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});

// === 3. دالة الـ Transaction ===
async function createOrderWithCashOut(total) {
  console.log("بدء Transaction...");
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const order = new Order();
    order.total = total;
    await queryRunner.manager.save(order);
    console.log("تم حفظ الطلب:", order.id);

    const payment = new Payment();
    payment.order = order;
    payment.amount = total;
    payment.method = "cash";
    await queryRunner.manager.save(payment);
    console.log("تم حفظ الدفع:", payment.id);

    await queryRunner.commitTransaction();
    console.log("تم تأكيد العملية");
    return { success: true, orderId: order.id };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error("فشل العملية، تم التراجع");
    throw err;
  } finally {
    await queryRunner.release();
  }
}

// === 4. Express ===
const app = express();
app.use(express.json());

app.post("/api/checkout", async (req, res) => {
  console.log("طلب checkout:", req.body);
  const { total } = req.body;
  if (!total || total <= 0) {
    return res.status(400).json({ error: "المبلغ غير صالح" });
  }
  try {
    const result = await createOrderWithCashOut(parseFloat(total));
    res.json({ message: "نجح!", orderId: result.orderId });
  } catch (err) {
    res.status(500).json({ error: "فشل" });
  }
});

// === 5. بدء الاتصال والسيرفر ===
console.log("جاري الاتصال بقاعدة البيانات...");
AppDataSource.initialize()
  .then(() => {
    console.log("تم الاتصال بـ SQL Server بنجاح!");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`السيرفر يعمل على http://localhost:${PORT}`);
      console.log("جرب: POST /api/checkout مع { total: 99.99 }");
    });
  })
  .catch((err) => {
    console.error("فشل الاتصال بـ SQL Server:");
    console.error(err);
    process.exit(1); // إيقاف البرنامج فورًا
  });