-- migration_v1_full_schema.sql
-- Migration Script آمن، idempotent، بدون أخطاء GO أو متغيّرات مفقودة
SET NOCOUNT ON;

PRINT 'بدء تشغيل Migration Script...';
PRINT '----------------------------------------';

-- ========================================
-- 1. إنشاء جدول تتبع الـ Migrations
-- ========================================
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'DatabaseMigrations')
BEGIN
    CREATE TABLE DatabaseMigrations (
        MigrationId NVARCHAR(50) PRIMARY KEY,
        AppliedAt DATETIME2 DEFAULT GETDATE()
    );
    PRINT 'تم إنشاء جدول DatabaseMigrations';
END

-- ========================================
-- 2. التحقق من تطبيق الـ Migration
-- ========================================
IF NOT EXISTS (SELECT 1 FROM DatabaseMigrations WHERE MigrationId = 'v1_full_schema')
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @MigrationId NVARCHAR(50) = 'v1_full_schema';

        -- ========================================
        -- 3. جدول users
        -- ========================================
        IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'users')
        BEGIN
            CREATE TABLE users (
                id INT IDENTITY(1,1) PRIMARY KEY,
                username NVARCHAR(50),
                email NVARCHAR(100) UNIQUE NOT NULL,
                password NVARCHAR(255) NOT NULL,
                is_admin BIT DEFAULT 0,
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE()
            );
            PRINT 'تم إنشاء جدول users';
        END
        ELSE
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'username')
                ALTER TABLE users ADD username NVARCHAR(50);
            IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'is_admin')
                ALTER TABLE users ADD is_admin BIT DEFAULT 0;
            IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'created_at')
                ALTER TABLE users ADD created_at DATETIME2 DEFAULT GETDATE();
            IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'updated_at')
                ALTER TABLE users ADD updated_at DATETIME2 DEFAULT GETDATE();

            IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE type = 'UQ' AND parent_object_id = OBJECT_ID('users') AND name LIKE '%username%')
                ALTER TABLE users ADD CONSTRAINT UQ_users_username UNIQUE (username);
            PRINT 'تم تحديث جدول users';
        END

        -- ========================================
        -- 4. جدول categories
        -- ========================================
        IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'categories')
        BEGIN
            CREATE TABLE categories (
                id INT IDENTITY(1,1) PRIMARY KEY,
                name NVARCHAR(100) NOT NULL,
                description NVARCHAR(MAX),
                created_at DATETIME2 DEFAULT GETDATE()
            );
            PRINT 'تم إنشاء جدول categories';
        END
        ELSE IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('categories') AND name = 'created_at')
        BEGIN
            ALTER TABLE categories ADD created_at DATETIME2 DEFAULT GETDATE();
            PRINT 'تم إضافة created_at إلى categories';
        END

        -- ========================================
        -- 5. جدول products
        -- ========================================
        IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'products')
        BEGIN
            CREATE TABLE products (
                id INT IDENTITY(1,1) PRIMARY KEY,
                name NVARCHAR(255) NOT NULL,
                description NVARCHAR(MAX),
                price DECIMAL(10,2) NOT NULL,
                stock INT NOT NULL DEFAULT 0,
                category_id INT,
                image_url NVARCHAR(500),
                deleted_at DATETIME2 NULL,
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE(),
                CONSTRAINT FK_products_categories FOREIGN KEY (category_id) REFERENCES categories(id)
            );
            PRINT 'تم إنشاء جدول products';
        END
        ELSE
        BEGIN
            -- إضافة الأعمدة الناقصة
            DECLARE @col NVARCHAR(100);
            DECLARE cols CURSOR FOR
            SELECT name FROM (VALUES 
                ('stock', 'INT NOT NULL DEFAULT 0'),
                ('image_url', 'NVARCHAR(500)'),
                ('deleted_at', 'DATETIME2 NULL'),
                ('created_at', 'DATETIME2 DEFAULT GETDATE()'),
                ('updated_at', 'DATETIME2 DEFAULT GETDATE()')
            ) AS t(name, def)
            WHERE NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('products') AND name = t.name);

            OPEN cols;
            FETCH NEXT FROM cols INTO @col;
            WHILE @@FETCH_STATUS = 0
            BEGIN
                DECLARE @sql NVARCHAR(MAX) = 'ALTER TABLE products ADD ' + @col + ' ' + 
                    (SELECT def FROM (VALUES 
                        ('stock', 'INT NOT NULL DEFAULT 0'),
                        ('image_url', 'NVARCHAR(500)'),
                        ('deleted_at', 'DATETIME2 NULL'),
                        ('created_at', 'DATETIME2 DEFAULT GETDATE()'),
                        ('updated_at', 'DATETIME2 DEFAULT GETDATE()')
                    ) AS t(name, def) WHERE name = @col);
                EXEC sp_executesql @sql;
                PRINT 'تم إضافة عمود: ' + @col;
                FETCH NEXT FROM cols INTO @col;
            END
            CLOSE cols; DEALLOCATE cols;

            -- FK
            IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_products_categories')
            BEGIN
                ALTER TABLE products ADD CONSTRAINT FK_products_categories 
                FOREIGN KEY (category_id) REFERENCES categories(id);
                PRINT 'تم إضافة FK: products → categories';
            END
        END

        -- ========================================
        -- 6. جدول carts
        -- ========================================
        IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'carts')
        BEGIN
            CREATE TABLE carts (
                id INT IDENTITY(1,1) PRIMARY KEY,
                user_id INT NOT NULL,
                is_active BIT DEFAULT 1,
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE(),
                CONSTRAINT FK_carts_users FOREIGN KEY (user_id) REFERENCES users(id)
            );
            PRINT 'تم إنشاء جدول carts';
        END

        -- ========================================
        -- 7. جدول cart_items
        -- ========================================
        IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'cart_items')
        BEGIN
            CREATE TABLE cart_items (
                id INT IDENTITY(1,1) PRIMARY KEY,
                cart_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE(),
                CONSTRAINT FK_cart_items_carts FOREIGN KEY (cart_id) REFERENCES carts(id),
                CONSTRAINT FK_cart_items_products FOREIGN KEY (product_id) REFERENCES products(id),
                CONSTRAINT UQ_cart_product UNIQUE (cart_id, product_id)
            );
            PRINT 'تم إنشاء جدول cart_items';
        END

        -- ========================================
        -- 8. جدول orders
        -- ========================================
        IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'orders')
        BEGIN
            CREATE TABLE orders (
                id INT IDENTITY(1,1) PRIMARY KEY,
                user_id INT NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                status NVARCHAR(20) CONSTRAINT CHK_orders_status 
                    CHECK (status IN ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED')) DEFAULT 'PENDING',
                order_number NVARCHAR(50) UNIQUE NOT NULL,
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE(),
                CONSTRAINT FK_orders_users FOREIGN KEY (user_id) REFERENCES users(id)
            );
            PRINT 'تم إنشاء جدول orders';
        END

        -- ========================================
        -- 9. جدول order_items
        -- ========================================
        IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'order_items')
        BEGIN
            CREATE TABLE order_items (
                id INT IDENTITY(1,1) PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                unit_price DECIMAL(10,2) NOT NULL,
                created_at DATETIME2 DEFAULT GETDATE(),
                CONSTRAINT FK_order_items_orders FOREIGN KEY (order_id) REFERENCES orders(id),
                CONSTRAINT FK_order_items_products FOREIGN KEY (product_id) REFERENCES products(id)
            );
            PRINT 'تم إنشاء جدول order_items';
        END

        -- ========================================
        -- 10. Seed Data
        -- ========================================
        IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com')
        BEGIN
            INSERT INTO users (username, email, password, is_admin)
            VALUES 
            ('admin', 'admin@example.com', '$2a$12$Vb7n3xN9b3kqv0b2H8l0Ue4vQ2m7q9mPj8G8pF2UusZqb6qfY0m9K', 1),
            ('shopper', 'user@example.com', '$2a$12$Vb7n3xN9b3kqv0b2H8l0Ue4vQ2m7q9mPj8G8pF2UusZqb6qfY0m9K', 0);
            PRINT 'تم إدخال بيانات المستخدمين';
        END

        IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Electronics')
        BEGIN
            INSERT INTO categories (name, description) VALUES 
            ('Electronics', 'Electronic devices and accessories'),
            ('Clothing', 'Fashion and apparel'),
            ('Books', 'Books and educational materials');
            PRINT 'تم إدخال الفئات';
        END

        -- ========================================
        -- 11. الفهارس
        -- ========================================
        IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_products_category')
            CREATE INDEX idx_products_category ON products(category_id);
        IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_products_deleted')
            CREATE INDEX idx_products_deleted ON products(deleted_at);
        IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_orders_user')
            CREATE INDEX idx_orders_user ON orders(user_id);
        IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_orders_status')
            CREATE INDEX idx_orders_status ON orders(status);
        IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_cart_items_cart')
            CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
        PRINT 'تم إنشاء الفهارس';

        -- ========================================
        -- 12. تسجيل الـ Migration
        -- ========================================
        INSERT INTO DatabaseMigrations (MigrationId) VALUES (@MigrationId);

        COMMIT TRANSACTION;
        PRINT '----------------------------------------';
        PRINT 'تم تطبيق Migration بنجاح: v1_full_schema';

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        PRINT 'خطأ: ' + @ErrorMessage;
        THROW;  -- داخل CATCH فقط
    END CATCH
END
ELSE
BEGIN
    PRINT 'الـ Migration تم تطبيقه مسبقًا: v1_full_schema';
END

PRINT 'انتهى Migration Script.';