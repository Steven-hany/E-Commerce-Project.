# 📊 Data Dictionary

## Users
| Field     | Type    | Description                        |
|-----------|---------|------------------------------------|
| id        | string  | Unique user ID                     |
| username  | string  | Username chosen by user            |
| email     | string  | User email                         |
| password  | string  | Hashed password (here plain text)  |
| isAdmin   | boolean | True if user is admin              |

---

## Products
| Field     | Type    | Description                        |
|-----------|---------|------------------------------------|
| id        | number  | Product ID from API                |
| title     | string  | Product name                       |
| price     | number  | Product price                      |
| category  | string  | Product category                   |
| image     | string  | Product image URL                  |

---

## Cart
| Field     | Type    | Description                        |
|-----------|---------|------------------------------------|
| id        | number  | Product ID                         |
| title     | string  | Product name                       |
| price     | number  | Product price                      |
| quantity  | number  | Quantity in cart                   |

---

## Orders
| Field     | Type    | Description                        |
|-----------|---------|------------------------------------|
| id        | string  | Unique order ID                    |
| items     | array   | List of products (from cart)       |
| date      | string  | Checkout timestamp                 |
