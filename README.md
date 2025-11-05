MyShop - E-Commerce Web App
Overview
MyShop is a pretty simple e-commerce web app built using HTML, CSS, and Vanilla JavaScript only.
It demonstrates core e-commerce features like authentication, product catalog, shopping cart, orders, and admin dashboard — all managed using localStorage.

Features
- Authentication
- Signup, login, and logout
- Store users in localStorage (username, email, password, isAdmin)
- Product Catalog
- Fetch products from FakeStore API
- Search and filter by category
- Add products to cart
- Shopping Cart & Checkout
- Add/remove products
- Show cart total
- Checkout creates an order and clears the cart
- Orders
- View order history with unique order IDs and timestamps
- Admin Dashboard
- Available only if isAdmin = true
- Displays total products, orders, and users
- General
- Responsive design
- Clean, minimal UI
- Navbar + Footer consistent across all pages



# 🛠️ MyShop Backend – Node.js + Express + SQL Server

الجزء الخلفي من تطبيق MyShop هو RESTful API مبني باستخدام Node.js و Express، ويعتمد على قاعدة بيانات SQL Server لإدارة المستخدمين، المنتجات، السلة، الطلبات، ولوحة التحكم. التوثيق متاح عبر Swagger، والتعامل مع البيانات يتم باستخدام TypeORM.

---

## 🚀 المميزات

- تسجيل الدخول وتسجيل المستخدمين باستخدام JWT
- إدارة المنتجات والفئات والمخزون
- سلة تسوق ديناميكية لكل مستخدم
- تنفيذ الطلبات وحفظها في قاعدة البيانات
- لوحة تحكم للمشرف لعرض الإحصائيات
- توثيق كامل للـ API باستخدام Swagger
- التحقق من البيانات باستخدام express-validator
- تحميل المتغيرات من ملف `.env`
- طباعة عدد الراوتات وأسمائها تلقائيًا عند التشغيل

---


---

## ⚙️ تشغيل المشروع

### 1. تثبيت الحزم

```bash
cd backend
npm install

اعدادات ال .env
DB_HOST=127.0.0.1
DB_PORT=1433
DB_USER=sa
DB_PASS=your_sql_password
DB_NAME=ecommercedb
PORT=3000
JWT_SECRET=your_super_secret_key

تشغيل السيرفر

npm start

Swagger UI متاح على:
http://localhost:3000/api

## 👥 Team 4

تم تنفيذ المشروع بواسطة:  
**Steven Hany Sadek**  
**Nouran Ashraf Elsayed**  
**Roaa Moustafa Elsheikh**




