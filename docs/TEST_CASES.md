# 🧪 Test Cases

## Authentication
- **Signup new user** → User data saved to localStorage
- **Login with correct credentials** → Redirects to Home
- **Login with wrong password** → Show error message
- **Logout** → currentUser removed from localStorage

## Products
- **Fetch products** → Products display on products.html
- **Search by keyword** → Filters correctly
- **Filter by category** → Shows only matching products
- **Add to cart** → Product appears in cart

## Cart & Checkout
- **Increase quantity** → Quantity updates in localStorage
- **Remove item** → Item disappears from cart
- **Checkout** → Creates new order, clears cart

## Orders
- **View orders** → Order cards show with items + date

## Admin
- **Login as admin** → Dashboard accessible
- **View stats** → Numbers update correctly
