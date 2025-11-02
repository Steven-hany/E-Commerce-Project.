const sql = require('mssql');
const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'your_database',
  options: { encrypt: true, trustServerCertificate: true }
};

// Function to create order from cart
async function createOrderFromCart(userId) {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('user_id', sql.Int, userId);
    const result = await request.execute('CreateOrderFromCart');
    return { success: true, orderNumber: result.output.order_number };
  } catch (err) {
    console.error('Error creating order:', err);
    return { success: false, error: err.message };
  }
}

// Function to process cash out (after payment confirmation)
async function processCashOut(orderId) {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('order_id', sql.Int, orderId);
    await request.execute('ProcessCashOut');
    return { success: true };
  } catch (err) {
    console.error('Error processing cash out:', err);
    return { success: false, error: err.message };
  }
}

// Example usage in an Express route for checkout
app.post('/api/checkout', async (req, res) => {
  const { userId } = req.body; // Assume authenticated user
  const orderResult = await createOrderFromCart(userId);
  if (!orderResult.success) {
    return res.status(500).json({ error: orderResult.error });
  }

  // Simulate payment gateway integration here
  // e.g., const paymentResult = await paymentGateway.charge(...);
  // If payment succeeds:
  // const cashOutResult = await processCashOut(newOrderId); // You'd need to retrieve orderId separately if needed

  res.json({ message: 'Order created', orderNumber: orderResult.orderNumber });
});