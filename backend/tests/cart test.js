
//cart and checkout test //
import request from "supertest";
import app from "../src/app.js";

describe("Cart & Checkout Routes", () => {
  let authToken;
  let productId;
  let cartId;

  beforeAll(async () => {
    // Login to get auth token
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@example.com",
        password: "password123"
      });
    
    authToken = loginRes.body.token;

    // Get a product ID for testing
    const productsRes = await request(app)
      .get("/api/v1/products")
      .set("Authorization", `Bearer ${authToken}`);
    
    productId = productsRes.body.products[0]?.id;
  });

  describe("Cart Management", () => {
    it("should add item to cart", async () => {
      const res = await request(app)
        .post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          productId: productId,
          quantity: 2
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("cartItem");
      expect(res.body.cartItem.quantity).toBe(2);
      expect(res.body.cartItem.productId).toBe(productId);
    });

    it("should return 400 when adding item with invalid quantity", async () => {
      const res = await request(app)
        .post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          productId: productId,
          quantity: 0
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should get user cart", async () => {
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("cart");
      expect(res.body.cart).toHaveProperty("items");
      expect(Array.isArray(res.body.cart.items)).toBe(true);
      cartId = res.body.cart.id;
    });

    it("should update cart item quantity", async () => {
      const res = await request(app)
        .put(`/api/v1/cart/items/${productId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          quantity: 3
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.cartItem.quantity).toBe(3);
    });

    it("should remove item from cart", async () => {
      const res = await request(app)
        .delete(`/api/v1/cart/items/${productId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Item removed from cart");
    });

    it("should clear entire cart", async () => {
      // First add an item
      await request(app)
        .post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          productId: productId,
          quantity: 1
        });

      // Then clear cart
      const res = await request(app)
        .delete("/api/v1/cart/clear")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Cart cleared");
    });
  });

  describe("Checkout Process", () => {
    beforeEach(async () => {
      // Ensure cart has items before checkout tests
      await request(app)
        .post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          productId: productId,
          quantity: 2
        });
    });

    it("should initiate checkout", async () => {
      const res = await request(app)
        .post("/api/v1/checkout/initiate")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("checkoutSession");
      expect(res.body.checkoutSession).toHaveProperty("totalAmount");
      expect(res.body.checkoutSession).toHaveProperty("items");
    });

    it("should validate cart before checkout", async () => {
      // Clear cart first to test validation
      await request(app)
        .delete("/api/v1/cart/clear")
        .set("Authorization", `Bearer ${authToken}`);

      const res = await request(app)
        .post("/api/v1/checkout/initiate")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Cart is empty");
    });

    it("should process checkout with shipping address", async () => {
      const checkoutData = {
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA"
        },
        paymentMethod: "credit_card",
        shippingMethod: "standard"
      };

      const res = await request(app)
        .post("/api/v1/checkout/process")
        .set("Authorization", `Bearer ${authToken}`)
        .send(checkoutData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("order");
      expect(res.body.order).toHaveProperty("id");
      expect(res.body.order).toHaveProperty("status");
      expect(res.body.order).toHaveProperty("totalAmount");
    });

    it("should return 400 for incomplete checkout data", async () => {
      const res = await request(app)
        .post("/api/v1/checkout/process")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          // Missing required fields
          shippingAddress: {
            street: "123 Main St"
            // Missing city, state, etc.
          }
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should apply discount code", async () => {
      const res = await request(app)
        .post("/api/v1/checkout/apply-discount")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          discountCode: "SAVE10"
        });

      expect([200, 400]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("discountApplied", true);
        expect(res.body).toHaveProperty("discountedAmount");
      }
    });

    it("should calculate shipping costs", async () => {
      const res = await request(app)
        .post("/api/v1/checkout/calculate-shipping")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          zipCode: "10001",
          country: "USA"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("shippingOptions");
      expect(Array.isArray(res.body.shippingOptions)).toBe(true);
    });
  });

  describe("Order Management", () => {
    it("should get order history", async () => {
      const res = await request(app)
        .get("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("orders");
      expect(Array.isArray(res.body.orders)).toBe(true);
    });

    it("should get order by ID", async () => {
      // First create an order
      const checkoutRes = await request(app)
        .post("/api/v1/checkout/process")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          shippingAddress: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA"
          },
          paymentMethod: "credit_card",
          shippingMethod: "standard"
        });

      const orderId = checkoutRes.body.order.id;

      const res = await request(app)
        .get(`/api/v1/orders/${orderId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.order.id).toBe(orderId);
    });

    it("should return 404 for non-existent order", async () => {
      const res = await request(app)
        .get("/api/v1/orders/nonexistent-order-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("Error Handling", () => {
    it("should return 401 for unauthorized cart access", async () => {
      const res = await request(app)
        .get("/api/v1/cart");

      expect(res.statusCode).toBe(401);
    });

    it("should return 404 for unknown cart route", async () => {
      const res = await request(app)
        .get("/api/v1/cart/unknown-route")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });

    it("should return 404 for unknown checkout route", async () => {
      const res = await request(app)
        .get("/api/v1/checkout/unknown-route")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("Swagger Documentation", () => {
    it("should return Swagger UI", async () => {
      const res = await request(app).get("/api-docs/");
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("Swagger UI");
    });
  });
});
