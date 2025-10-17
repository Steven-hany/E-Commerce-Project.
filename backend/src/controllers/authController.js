import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source.js";
import { User } from "../models/User.js";

// ✅ تسجيل مستخدم جديد
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = userRepo.create({ username, email, password: hashed });
    await userRepo.save(user);

    const token = jwt.sign(
      {
        id: user.id,
        is_admin: user.is_admin,
        email: user.email,
        username: user.username,
        active: user.active,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ✅ تسجيل دخول
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        is_admin: user.is_admin,
        email: user.email,
        username: user.username,
        active: user.active,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ✅ عرض بيانات المستخدم الحالي
export const getMe = async (req, res, next) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: req.user.id });

    if (!user || user.active === false) {
      return res.status(404).json({ error: "User not found or inactive" });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ تعديل بيانات المستخدم الحالي
export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userId });

    if (!user || user.active === false) {
      return res.status(404).json({ message: "User not found or inactive" });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await userRepo.save(user);

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ حذف المستخدم الحالي (حذف منطقي)
export const deleteMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userId });

    if (!user || user.active === false) {
      return res.status(404).json({ message: "User not found or already deleted" });
    }

    user.active = false;
    await userRepo.save(user);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
