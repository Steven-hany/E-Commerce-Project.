import express from "express";
import "reflect-metadata";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { swaggerServe, swaggerSetup } from "./swagger.js";

const app = express();
app.use(express.json());

// طباعة الهيدر لكل طلب (اختياري للتتبع)
app.use((req, res, next) => {
  console.log("🧾 Full headers:", req.headers);
  next();
});

// ربط المسارات
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// ربط Swagger UI
app.use("/api-docs", swaggerServe, swaggerSetup);
console.log("📘 Swagger UI available at http://localhost:3000/api-docs");

// التعامل مع الأخطاء
app.use(errorHandler);



// ✅ إضافات بدون تعديل على الكود الأصلي:

// تحذير لو الراوتات مش متصدّرة صح
if (!authRoutes || !userRoutes) {
  console.warn("⚠️ تحذير: في راوت مش متصدّر بشكل صحيح");
}

// طباعة عدد الراوتات المحملة
const routeCount = app._router?.stack?.filter(r => r.route).length || 0;
console.log(`🛣️ عدد الراوتات المحملة: ${routeCount}`);

// طباعة وقت تشغيل التطبيق
console.log(`⏱️ وقت تشغيل التطبيق: ${new Date().toLocaleString("en-EG")}`);

export default app;
