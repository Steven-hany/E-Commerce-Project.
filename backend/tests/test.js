import request from "supertest";
import app from "../src/app.js";

describe("Auth Routes", () => {
  it("should return 404 for unknown route", async () => {
    const res = await request(app).get("/api/v1/auth/unknown");
    expect(res.statusCode).toBe(404);
  });

  it("should return Swagger UI", async () => {
   const res = await request(app).get("/api-docs/");
   expect(res.statusCode).toBe(200);
   expect(res.text).toContain("Swagger UI");
  });
});
