import request from "supertest";
import app from "../src/app.js";

describe("Auth Routes", () => {
  it("should return 404 for unknown route", async () => {
    const res = await request(app).get("/api/v1/auth/unknown");
    expect(res.statusCode).toBe(404);
  });
  });

  it("should return Swagger UI", async () => {
   const res = await request(app).get("/api-docs/");
   expect(res.statusCode).toBe(200);
   expect(res.text).toContain("Swagger UI");
  });

  // ===================== Products Routes =====================
describe('Products Routes', () => {
  const API = process.env.API_PREFIX || ''; // مثال: '/api' لو عندك prefix

  it('GET /products => 200 ويرجع Array', async () => {
    const res = await request(app).get('${API}/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /products/:id => 200 أو 404', async () => {
    // عدّلي الـ id لو عندك منتج seed معروف
    const res = await request(app).get('$ API}/products/1');
    expect([200, 404]).toContain(res.status);
}) ;

// ===================== Categories Routes =====================
describe('Categories Routes', () => {
  const API = process.env.API_PREFIX || '';

  it('GET /categories => 200 ويرجع Array', async () => {
    const res = await request(app).get('${API}/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /categories/:id => 200 أو 404', async () => {
    const res = await request(app).get('${API}/categories/1');
    expect([200, 404]).toContain(res.status);
  });

   it('DELETE /admin/products/:id بدون توكن => 401', async () => {
    const res = await request(app).delete('${API}/admin/products/1');
    expect([401, 403]).toContain(res.status);
  });
});

// ===== Admin Routes =====
describe('Admin Routes', () => {
  it('GET /admin/health => 200 & {status:"ok"}', async () => {
    const res = await request(app).get('${API}/admin/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
  });
})
});
