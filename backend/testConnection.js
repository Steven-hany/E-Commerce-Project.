import sql from "mssql";

const config = {
  user: "sa",
  password: "your_sql_password",
  server: "127.0.0.1", // ← أو اسم الجهاز الحقيقي
  port: 1433,
  database: "ecommerce_db",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

sql.connect(config)
  .then(() => {
    console.log("✅ Connected to SQL Server");
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err);
  });