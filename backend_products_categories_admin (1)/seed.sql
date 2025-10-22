-- Insert sample admin & shopper (passwords are placeholders)
INSERT INTO users (email, password_hash, is_admin)
VALUES
('admin@example.com', '$2a$12$Vb7n3xN9b3kqv0b2H8l0Ue4vQ2m7q9mPj8G8pF2UusZqb6qfY0m9K', TRUE),
('user@example.com', '$2a$12$Vb7n3xN9b3kqv0b2H8l0Ue4vQ2m7q9mPj8G8pF2UusZqb6qfY0m9K', FALSE);

INSERT INTO categories (name) VALUES ('Electronics'), ('Fashion');

INSERT INTO products (name, description, price, stock_qty, categoryId)
VALUES
('Phone', 'Smart phone', 299.99, 50, 1),
('Headphones', 'Noise-cancelling', 99.90, 100, 1),
('T-Shirt', 'Cotton', 19.99, 200, 2),
('Sneakers', 'Running shoes', 79.50, 80, 2);
