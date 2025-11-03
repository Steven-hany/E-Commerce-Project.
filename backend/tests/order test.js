
// order //
import request from "supertest";
import app from "../src/app.js";

describe("Order Routes", () => {
  let authToken;
  let orderId;
  let testProductId = "prod_123";
  let testUserId = "user_123";

  // Login before running order tests
  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@example.com",
        password: "password123"
      });
    
    authToken = loginRes.body.token;
  });

  describe("Order Creation", () => {
    it("should create a new order successfully", async () => {
      const orderData = {
        items: [
          {
            productId: testProductId,
            quantity: 2,
            price: 29.99,
            name: "Test Product"
          }
        ],
        shippingAddress: {
          street: "123 Main St",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "Test Country"
        },
        paymentMethod: "credit_card",
        totalAmount: 59.98
      };

      const res = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order).toHaveProperty("id");
      expect(res.body.order.status).toBe("pending");
      expect(res.body.order.totalAmount).toBe(59.98);
      
      orderId = res.body.order.id;
    });

    it("should reject order creation without authentication", async () => {
      const res = await request(app)
        .post("/api/v1/orders")
        .send({ items: [] });

      expect(res.statusCode).toBe(401);
    });

    it("should reject order with empty items", async () => {
      const res = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          items: [],
          shippingAddress: {},
          totalAmount: 0
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("items");
    });

    it("should validate order data", async () => {
      const res = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          // Missing required fields
          items: [{ productId: testProductId, quantity: 1 }]
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("Get Order Details", () => {
    it("should get order by ID", async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${orderId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.order.id).toBe(orderId);
      expect(res.body.order).toHaveProperty("items");
      expect(res.body.order).toHaveProperty("shippingAddress");
      expect(res.body.order).toHaveProperty("status");
    });

    it("should reject unauthorized access to order", async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${orderId}`)
        .set("Authorization", "Bearer invalid-token");

      expect(res.statusCode).toBe(401);
    });

    it("should return 404 for non-existent order", async () => {
      const res = await request(app)
        .get("/api/v1/orders/nonexistent-order")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("Get User Orders", () => {
    it("should get all orders for authenticated user", async () => {
      const res = await request(app)
        .get("/api/v1/orders/user/my-orders")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.orders).toBeInstanceOf(Array);
      expect(res.body.pagination).toHaveProperty("total");
      expect(res.body.pagination).toHaveProperty("page");
      expect(res.body.pagination).toHaveProperty("limit");
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v1/orders/user/my-orders?page=1&limit=10")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(10);
    });
  });

  describe("Order Updates", () => {
    it("should update order status", async () => {
      const res = await request(app)
        .patch(`/api/v1/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          status: "processing"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.order.status).toBe("processing");
    });

    it("should cancel an order", async () => {
      const res = await request(app)
        .post(`/api/v1/orders/${orderId}/cancel`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.order.status).toBe("cancelled");
    });

    it("should reject cancelling shipped order", async () => {
      // First update order to shipped
      await request(app)
        .patch(`/api/v1/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "shipped" });

      const res = await request(app)
        .post(`/api/v1/orders/${orderId}/cancel`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("cannot cancel");
    });
  });

  describe("Admin Order Management", () => {
    let adminToken;

    beforeAll(async () => {
      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "admin@example.com",
          password: "admin123"
        });
      
      adminToken = loginRes.body.token;
    });

    it("should get all orders (admin only)", async () => {
      const res = await request(app)
        .get("/api/v1/orders")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.orders).toBeInstanceOf(Array);
    });

    it("should reject non-admin users from accessing all orders", async () => {
      const res = await request(app)
        .get("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(403);
    });

    it("should update order by admin", async () => {
      const res = await request(app)
        .put(`/api/v1/orders/${orderId}/admin`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "delivered",
          trackingNumber: "TRACK123456"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.order.status).toBe("delivered");
      expect(res.body.order.trackingNumber).toBe("TRACK123456");
    });
  });

  describe("Order Payments", () => {
    it("should process payment for order", async () => {
      const paymentData = {
        paymentMethod: "credit_card",
        paymentDetails: {
          cardNumber: "4111111111111111",
          expiryDate: "12/25",
          cvv: "123"
        }
      };

      const res = await request(app)
        .post(`/api/v1/orders/${orderId}/payment`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(paymentData);

      expect(res.statusCode).toBe(200);
      expect(res.body.payment).toHaveProperty("id");
      expect(res.body.payment.status).toBe("completed");
    });

    it("should get payment status", async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${orderId}/payment`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.payment).toHaveProperty("status");
    });
  });

  describe("Error Handling", () => {
    it("should return 404 for unknown order route", async () => {
      const res = await request(app)
        .get("/api/v1/orders/unknown/route")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });

    it("should handle invalid order ID format", async () => {
      const res = await request(app)
        .get("/api/v1/orders/invalid-id-format")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe("Order Analytics", () => {
    it("should get order statistics", async () => {
      const res = await request(app)
        .get("/api/v1/orders/analytics/summary")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.analytics).toHaveProperty("totalOrders");
      expect(res.body.analytics).toHaveProperty("totalSpent");
      expect(res.body.analytics).toHaveProperty("averageOrderValue");
    });
  });
});

