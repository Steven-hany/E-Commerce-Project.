# 🏗️ Project Architecture – MyShop E-Commerce

## 📌 Overview
The application is structured into feature-based folders.  
Each feature has its own **HTML, CSS, and JS** file, while shared logic and styles are stored globally in the root directory.

This separation makes the codebase organized, easy to maintain, and scalable.

---

## 📂 Folder Structure

ecommerce-project/
│
├── index.html # Home Page
├── style.css # Global styles (navbar, footer, theme)
├── script.js # Global helpers (localStorage, addToCart, auth)
│
├── auth/ # Authentication
│ ├── auth.html # Login & Signup page
│ ├── auth.css # Auth page styles
│ └── auth.js # Auth logic (signup/login/logout)
│
├── products/ # Product Catalog
│ ├── products.html # Product listing
│ ├── products.css # Product card styles, search & filter UI
│ └── products.js # Fetch API, search, filter, add to cart
│
├── cart/ # Shopping Cart
│ ├── cart.html # Cart page
│ ├── cart.css # Cart layout & styles
│ └── cart.js # Render cart items, checkout logic
│
├── orders/ # Orders History
│ ├── orders.html # Orders page
│ ├── orders.css # Orders layout
│ └── orders.js # Show past orders, order details
│
├── admin/ # Admin Dashboard
│ ├── admin.html # Dashboard page
│ ├── admin.css # Stats card styles
│ └── admin.js # Render stats (users, orders, products)

markdown
Copy code

---

## 🔄 Application Flow

1. **User Authentication**
   - User signs up or logs in via `auth.html`
   - User info saved in `localStorage`
   - Admins flagged with `isAdmin = true`

2. **Product Catalog**
   - Products fetched from FakeStore API (`products.js`)
   - Search/filter available
   - Clicking **Add to Cart** calls global `addToCart()` in `script.js`

3. **Shopping Cart**
   - `cart.html` displays items from localStorage
   - Users can remove items or checkout
   - Checkout generates order + clears cart

4. **Orders**
   - Orders stored in localStorage
   - `orders.html` displays history with order IDs + dates

5. **Admin Dashboard**
   - Accessible only if logged-in user is admin
   - `admin.js` shows stats: total products, orders, users

---

## ⚙️ Technologies Used
- **HTML5** – structure  
- **CSS3** – styling & responsiveness  
- **Vanilla JavaScript (ES6)** – logic  
- **localStorage** – data persistence  
- **FakeStore API** – product data  

---

## 📝 Notes
- Navbar + Footer are consistent across all pages  
- All logic is client-side only (no backend)  
- Data is persisted locally using localStorage