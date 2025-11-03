-- =============================================
-- Stored Procedure: CreateOrder (Checkout)
-- =============================================
CREATE OR ALTER PROCEDURE CreateOrder
    @UserId INT,
    @CartId INT = NULL  -- إذا NULL → تُنشئ من السلة النشطة للمستخدم
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OrderId INT;
    DECLARE @TotalAmount DECIMAL(10,2) = 0;
    DECLARE @Error NVARCHAR(500);

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. تحديد السلة (إذا لم تُحدد)
        IF @CartId IS NULL
        BEGIN
            SELECT @CartId = id 
            FROM carts 
            WHERE user_id = @UserId AND is_active = 1;

            IF @CartId IS NULL
                THROW 50001, N'لا توجد سلة نشطة لهذا المستخدم.', 1;
        END

        -- 2. التحقق من وجود السلة وأنها نشطة
        IF NOT EXISTS (SELECT 1 FROM carts WHERE id = @CartId AND is_active = 1)
            THROW 50002, N'السلة غير موجودة أو غير نشطة.', 1;

        -- 3. التحقق من توفر الكميات في المخزون
        IF EXISTS (
            SELECT 1
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = @CartId
              AND (p.stock < ci.quantity OR p.deleted_at IS NOT NULL)
        )
        BEGIN
            SELECT 
                p.name AS ProductName,
                p.stock AS Available,
                ci.quantity AS Requested
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = @CartId
              AND (p.stock < ci.quantity OR p.deleted_at IS NOT NULL);

            THROW 50003, N'كمية غير كافية أو منتج محذوف.', 1;
        END

        -- 4. خصم الكميات من المخزون
        UPDATE p
        SET stock = stock - ci.quantity,
            updated_at = GETDATE()
        FROM products p
        JOIN cart_items ci ON p.id = ci.product_id
        WHERE ci.cart_id = @CartId;

        -- 5. إنشاء الطلبية
        INSERT INTO orders (user_id, total_amount, status, order_number)
        VALUES (
            @UserId,
            0, -- سيُحدث لاحقًا
            'PENDING',
            'ORD-' + FORMAT(GETDATE(), 'yyyyMMdd-HHmmss-') + CAST(@@IDENTITY + 1 AS NVARCHAR(10))
        );

        SET @OrderId = SCOPE_IDENTITY();

        -- 6. إضافة العناصر إلى order_items + حساب المجموع
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        SELECT 
            @OrderId,
            ci.product_id,
            ci.quantity,
            p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = @CartId;

        -- 7. حساب المجموع النهائي
        SELECT @TotalAmount = SUM(quantity * unit_price)
        FROM order_items
        WHERE order_id = @OrderId;

        -- 8. تحديث total_amount في الطلبية
        UPDATE orders
        SET total_amount = @TotalAmount,
            status = 'PAID',  -- أو 'PENDING' حسب الدفع
            updated_at = GETDATE()
        WHERE id = @OrderId;

        -- 9. تعطيل السلة (اختياري)
        UPDATE carts
        SET is_active = 0, updated_at = GETDATE()
        WHERE id = @CartId;

        COMMIT TRANSACTION;

        -- إرجاع نتيجة نجاح
        SELECT 
            @OrderId AS OrderId,
            @TotalAmount AS TotalAmount,
            'PAID' AS Status,
            N'تم إنشاء الطلبية بنجاح!' AS Message;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        SET @Error = ERROR_MESSAGE();

        -- إرجاع الخطأ
        SELECT 
            NULL AS OrderId,
            0 AS TotalAmount,
            'ERROR' AS Status,
            @Error AS Message;

        -- إعادة رمي الخطأ (اختياري)
        -- THROW;
    END CATCH
END
GO

-- test--
-- 1. أنشئ مستخدم وسلة
INSERT INTO users (username, email, password, is_admin) VALUES ('test', 'test@shop.com', 'xxx', 0);
DECLARE @UserId INT = SCOPE_IDENTITY();

-- 2. أضف منتجات
INSERT INTO categories (name) VALUES ('Electronics');
INSERT INTO products (name, price, stock, category_id) VALUES ('Phone', 500, 10, 1);