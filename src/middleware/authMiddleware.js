import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log("🧾 Real Express headers:", JSON.stringify(req.headers, null, 2));
  console.log("🔐 Incoming Authorization Header:", authHeader);
  console.log("🔑 JWT_SECRET from .env:", process.env.JWT_SECRET);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Missing or malformed Authorization header");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    if (!decoded.id) {
      console.log("❌ Token decoded but missing user ID");
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = {
      id: decoded.id,
      is_admin: decoded.is_admin || false,
      email: decoded.email || null,
      username: decoded.username || null,
      active: decoded.active !== false, // لو التوكن فيه active = false
    };

    next();
  } catch (err) {
    console.log("❌ JWT verification error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ حماية الراوتات الإدارية
export const adminOnly = (req, res, next) => {
  if (!req.user?.is_admin) {
    console.log("🚫 Access denied: not admin");
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
