// /backend/src/middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
};