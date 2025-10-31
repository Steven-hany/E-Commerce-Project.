// /backend/src/middleware/rateLimit.js
import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5, // أقصى عدد محاولات
  message: { error: "Too many login attempts. Try again later." },
});