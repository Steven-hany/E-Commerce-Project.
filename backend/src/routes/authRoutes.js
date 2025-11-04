import express from "express";
import {
  register,
  login,
  getMe,
  updateMe,
  deleteMe,
} from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimit.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/** * @swagger
 * tags:
 * - name: Auth
 * description: عمليات تسجيل المستخدمين وتفاصيل الحساب
 */

/** * @swagger
 * /auth/register:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username: { type: string, example: steve_jobs }
 * email: { type: string, example: steve@apple.com }
 * password: { type: string, example: mysecurepassword123 }
 * responses:
 * 201: { description: "User registered successfully, returns token" }
 * 400: { description: "Invalid input or user already exists" }
 */
router.post("/register", register);

/** * @swagger
 * /auth/login:
 * post:
 * summary: Login user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email: { type: string, example: user@example.com }
 * password: { type: string, example: password123 }
 * responses:
 * 200: { description: "User logged in successfully, returns token" }
 * 401: { description: "Invalid credentials" }
 */
router.post("/login", loginLimiter, login);

/**
 * @swagger
 * /auth/me:
 * get:
 * summary: Get current logged-in user info
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200: { description: "User info returned" }
 * 401: { description: "Unauthorized" }
 */
router.get("/me", protect, getMe);

/** * @swagger
 * /auth/me:
 * put:
 * summary: Update current user info
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username: { type: string, example: new_steve_jobs }
 * email: { type: string, example: new_steve@apple.com }
 * responses:
 * 200: { description: "User updated successfully" }
 * 401: { description: "Unauthorized" }
 */
router.put("/me", protect, updateMe);

/** * @swagger
 * /auth/me:
 * delete:
 * summary: Delete current user (soft delete)
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200: { description: "User deleted successfully" }
 * 401: { description: "Unauthorized" }
 */
router.delete("/me", protect, deleteMe);

export default router;
