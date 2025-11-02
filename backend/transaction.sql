-- Stored Procedure for Creating an Order from Cart (Checkout Process)
CREATE PROCEDURE CreateOrderFromCart
    @user_id INT,
    @order_number NVARCHAR(50) OUTPUT  -- Output the generated order number
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @cart_id INT;
    DECLARE @total_amount DECIMAL(10,2);
    DECLARE @new_order_id INT;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Find the active cart for the user
        SELECT @cart_id = id
        FROM carts
        WHERE user_id = @user_id AND is_active = 1;

        IF @cart_id IS NULL
        BEGIN
            RAISERROR('No active cart found for the user.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Calculate total amount
        SELECT @total_amount = SUM(ci.quantity * p.price)
        FROM cart_items ci
        INNER JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = @cart_id AND p.deleted_at IS NULL;

        IF @total_amount IS NULL OR @total_amount <= 0
        BEGIN
            RAISERROR('Cart is empty or invalid.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Generate unique order number (e.g., 'ORD-' + timestamp + random)
        SET @order_number = 'ORD-' + CONVERT(NVARCHAR(8), GETDATE(), 112) + '-' + RIGHT(NEWID(), 8);

        -- Insert the order
        INSERT INTO orders (user_id, total_amount, status, order_number)
        VALUES (@user_id, @total_amount, 'PENDING', @order_number);

        SET @new_order_id = SCOPE_IDENTITY();

        -- Insert order items and update stock
        DECLARE @product_id INT, @quantity INT, @unit_price DECIMAL(10,2);

        --DECLARE cart_cursor CURSOR FOR
        --SELECT ci.product_id, ci.quantity, p.price
        --FROM cart_items ci
        --INNER JOIN products p ON ci.product_id = p.id
        --WHERE ci.cart_id = @cart_id AND p.deleted_at IS NULL;

        -- استخدام GROUP BY بدلاً من Cursor
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        SELECT @new_order_id, ci.product_id, ci.quantity, p.price
        FROM cart_items ci
        INNER JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = @cart_id AND p.deleted_at IS NULL;

       -- تحديث المخزون بجميع المنتجات مرة واحدة
       UPDATE p
       SET p.stock = p.stock - ci.quantity,
    p.updated_at = GETDATE()
       FROM products p
       INNER JOIN cart_items ci ON p.id = ci.product_id
       WHERE ci.cart_id = @cart_id;

        OPEN cart_cursor;
        FETCH NEXT FROM cart_cursor INTO @product_id, @quantity, @unit_price;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Check stock availability
            IF (SELECT stock FROM products WHERE id = @product_id) < @quantity
            BEGIN
                RAISERROR('Insufficient stock for product ID %d.', 16, 1, @product_id);
                ROLLBACK TRANSACTION;
                CLOSE cart_cursor;
                DEALLOCATE cart_cursor;
                RETURN;
            END

            -- Insert order item
            INSERT INTO order_items (order_id, product_id, quantity, unit_price)
            VALUES (@new_order_id, @product_id, @quantity, @unit_price);

            -- Update product stock
            UPDATE products
            SET stock = stock - @quantity,
                updated_at = GETDATE()
            WHERE id = @product_id;

            FETCH NEXT FROM cart_cursor INTO @product_id, @quantity, @unit_price;
        END

        CLOSE cart_cursor;
        DEALLOCATE cart_cursor;

        -- Deactivate the cart (or optionally delete cart_items)
        UPDATE carts
        SET is_active = 0,
            updated_at = GETDATE()
        WHERE id = @cart_id;

        -- Clear cart items
        DELETE FROM cart_items WHERE cart_id = @cart_id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

-- Stored Procedure for Cash Out (Updating Order to PAID Status)
-- This assumes payment is confirmed externally (e.g., via payment gateway callback)
CREATE PROCEDURE ProcessCashOut
    @order_id INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Check if order exists and is in PENDING status
        IF NOT EXISTS (SELECT 1 FROM orders WHERE id = @order_id AND status = 'PENDING')
        BEGIN
            RAISERROR('Order not found or not in PENDING status.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Update order status to PAID
        UPDATE orders
        SET status = 'PAID',
            updated_at = GETDATE()
        WHERE id = @order_id;

        -- Optionally, trigger further actions like notifications or shipping prep

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO