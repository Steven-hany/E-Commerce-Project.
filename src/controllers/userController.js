import { AppDataSource } from "../data-source.js";
import { User } from "../models/User.js";

// ✅ دالة getMe — ترجع بيانات المستخدم الحالي
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: req.user.id, active: true },
      select: ["id", "username", "email", "is_admin", "created_at"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ عرض كل المستخدمين (Admin فقط)
export const getAllUsers = async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find({
      where: { active: true },
      select: ["id", "username", "email", "is_admin", "created_at"],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ عرض مستخدم معين بالـ ID
export const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId, active: true },
      select: ["id", "username", "email", "is_admin", "created_at"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ تعديل بيانات مستخدم بالـ ID
export const updateUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userId });

    if (!user || user.active === false) {
      return res.status(404).json({ message: "User not found or inactive" });
    }

    const { username, email, is_admin } = req.body;
    if (username) user.username = username;
    if (email) user.email = email;
    if (typeof is_admin === "boolean") user.is_admin = is_admin;

    await userRepo.save(user);

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ حذف مستخدم بالـ ID (حذف منطقي)
export const deleteUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

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
