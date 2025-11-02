/**
 * Initial E-commerce Database Schema Migration
 * Creates all tables for the e-commerce platform
 */

exports.up = function(knex) {
  return knex.schema
    // Create users table
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username', 50).unique().notNullable();
      table.string('email', 100).unique().notNullable();
      table.string('password_hash', 255).notNullable();
      table.boolean('is_admin').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.comment('Stores user accounts and authentication data');
    })
    
    // Create categories table
    .createTable('categories', function(table) {
      table.increments('id').primary();
      table.string('name', 255).unique().notNullable();
      table.text('description').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.comment('Product categories for organization');
    })
    
    // Create products table (with soft delete)
    .createTable('products', function(table) {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.text('description').nullable();
      table.decimal('price', 10, 2).notNullable();
      table.integer('stock_qty').unsigned().defaultTo(0);
      table.integer('category_id').unsigned().nullable();
      table.string('image_url', 500).nullable();
      table.timestamp('deleted_at').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Foreign key constraint
      table.foreign('category_id')
           .references('id')
           .inTable('categories')
           .onDelete('SET NULL');
      
      table.index(['category_id', 'deleted_at']);
      table.comment('Products available for purchase with soft delete support');
    })
    
    // Create carts table
    .createTable('carts', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Foreign key constraint
      table.foreign('user_id')
           .references('id')
           .inTable('users')
           .onDelete('CASCADE');
      
      table.unique(['user_id', 'is_active']);
      table.index(['user_id', 'is_active']);
      table.comment('Shopping carts for users - only one active cart per user');
    })
    
    // Create cart_items table
    .createTable('cart_items', function(table) {
      table.increments('id').primary();
      table.integer('cart_id').unsigned().notNullable();
      table.integer('product_id').unsigned().notNullable();
      table.integer('quantity').unsigned().notNullable().defaultTo(1);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Foreign key constraints
      table.foreign('cart_id')
           .references('id')
           .inTable('carts')
           .onDelete('CASCADE');
           
      table.foreign('product_id')
           .references('id')
           .inTable('products')
           .onDelete('CASCADE');
      
      // Unique constraint to prevent duplicate products in same cart
      table.unique(['cart_id', 'product_id']);
      table.index(['cart_id', 'product_id']);
      table.comment('Items added to shopping carts');
    })
    
    // Create orders table
    .createTable('orders', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.decimal('total_amount', 10, 2).notNullable();
      table.enum('status', [
        'PENDING', 
        'PAID', 
        'SHIPPED', 
        'DELIVERED', 
        'CANCELLED'
      ]).defaultTo('PENDING');
      table.string('order_number', 50).unique().notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Foreign key constraint
      table.foreign('user_id')
           .references('id')
           .inTable('users')
           .onDelete('CASCADE');
      
      table.index(['user_id', 'status']);
      table.index(['order_number']);
      table.comment('Customer orders with status tracking');
    })
    
    // Create order_items table
    .createTable('order_items', function(table) {
      table.increments('id').primary();
      table.integer('order_id').unsigned().notNullable();
      table.integer('product_id').unsigned().notNullable();
      table.integer('quantity').unsigned().notNullable();
      table.decimal('unit_price', 10, 2).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      // Foreign key constraints
      table.foreign('order_id')
           .references('id')
           .inTable('orders')
           .onDelete('CASCADE');
           
      table.foreign('product_id')
           .references('id')
           .inTable('products')
           .onDelete('RESTRICT');
      
      table.index(['order_id']);
      table.index(['product_id']);
      table.comment('Individual items within orders with snapshot pricing');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('order_items')
    .dropTableIfExists('orders')
    .dropTableIfExists('cart_items')
    .dropTableIfExists('carts')
    .dropTableIfExists('products')
    .dropTableIfExists('categories')
    .dropTableIfExists('users');
};

//2 //
/**
 * Additional indexes and constraints for performance
 */

exports.up = function(knex) {
  return knex.schema
    // Add indexes for better query performance
    .raw('CREATE INDEX idx_products_price_stock ON products(price, stock_qty) WHERE deleted_at IS NULL')
    .raw('CREATE INDEX idx_orders_created_status ON orders(created_at, status)')
    .raw('CREATE INDEX idx_users_email_admin ON users(email, is_admin)')
    .raw('CREATE INDEX idx_categories_name ON categories(name)')
    
    // Add check constraints
    .raw('ALTER TABLE products ADD CONSTRAINT chk_products_price_positive CHECK (price >= 0)')
    .raw('ALTER TABLE products ADD CONSTRAINT chk_products_stock_non_negative CHECK (stock_qty >= 0)')
    .raw('ALTER TABLE cart_items ADD CONSTRAINT chk_cart_items_quantity_positive CHECK (quantity > 0)')
    .raw('ALTER TABLE order_items ADD CONSTRAINT chk_order_items_quantity_positive CHECK (quantity > 0)')
    .raw('ALTER TABLE order_items ADD CONSTRAINT chk_order_items_unit_price_positive CHECK (unit_price >= 0)')
    .raw('ALTER TABLE orders ADD CONSTRAINT chk_orders_total_amount_positive CHECK (total_amount >= 0)');
};

exports.down = function(knex) {
  return knex.schema
    .raw('DROP INDEX IF EXISTS idx_products_price_stock')
    .raw('DROP INDEX IF EXISTS idx_orders_created_status')
    .raw('DROP INDEX IF EXISTS idx_users_email_admin')
    .raw('DROP INDEX IF EXISTS idx_categories_name')
    .raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS chk_products_price_positive')
    .raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS chk_products_stock_non_negative')
    .raw('ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS chk_cart_items_quantity_positive')
    .raw('ALTER TABLE order_items DROP CONSTRAINT IF EXISTS chk_order_items_quantity_positive')
    .raw('ALTER TABLE order_items DROP CONSTRAINT IF EXISTS chk_order_items_unit_price_positive')
    .raw('ALTER TABLE orders DROP CONSTRAINT IF EXISTS chk_orders_total_amount_positive');
};

// 3 //
/**
 * Seed data for initial setup
 */

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('order_items').del()
    .then(() => knex('orders').del())
    .then(() => knex('cart_items').del())
    .then(() => knex('carts').del())
    .then(() => knex('products').del())
    .then(() => knex('categories').del())
    .then(() => knex('users').del())
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        // Users
        knex('users').insert([
          {
            username: 'admin',
            email: 'admin@eshop.com',
            password_hash: '$2b$10$ExampleHashForAdminUser',
            is_admin: true
          },
          {
            username: 'john_doe',
            email: 'john@example.com',
            password_hash: '$2b$10$ExampleHashForRegularUser',
            is_admin: false
          }
        ]),
        
        // Categories
        knex('categories').insert([
          { name: 'Electronics', description: 'Electronic devices and accessories' },
          { name: 'Clothing', description: 'Fashion and apparel' },
          { name: 'Books', description: 'Books and educational materials' },
          { name: 'Home & Garden', description: 'Home improvement and gardening' }
        ])
      ]);
    })
    .then(function() {
      // Products (insert after categories)
      return knex('products').insert([
        {
          name: 'Smartphone X',
          description: 'Latest smartphone with advanced features',
          price: 699.99,
          stock_qty: 50,
          category_id: 1,
          image_url: '/images/smartphone-x.jpg'
        },
        {
          name: 'Laptop Pro',
          description: 'High-performance laptop for professionals',
          price: 1299.99,
          stock_qty: 25,
          category_id: 1,
          image_url: '/images/laptop-pro.jpg'
        },
        {
          name: 'Cotton T-Shirt',
          description: 'Comfortable cotton t-shirt',
          price: 19.99,
          stock_qty: 100,
          category_id: 2,
          image_url: '/images/tshirt.jpg'
        },
        {
          name: 'Programming Book',
          description: 'Learn JavaScript programming',
          price: 39.99,
          stock_qty: 75,
          category_id: 3,
          image_url: '/images/programming-book.jpg'
        }
      ]);
    });
};