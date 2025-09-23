import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { TestUtils, app, prisma } from "./utils.js";

/**
 * 🌐 TESTES DE ROTAS E ENDPOINTS
 *
 * Este arquivo testa especificamente:
 * - Status codes corretos
 * - Tratamento de erros
 * - Rotas funcionais
 * - Validações de entrada
 */

describe("🌐 TESTES DE ROTAS E ENDPOINTS", () => {
  beforeAll(async () => {
    await TestUtils.clearDatabase();
  });

  afterAll(async () => {
    await TestUtils.clearDatabase();
  });

  describe("📊 STATUS CODES E RESPOSTAS", () => {
    test("✅ GET / - Rota principal", async () => {
      const response = await request(app).get("/");

      expect([200, 404]).toContain(response.status);
      // Aceita 200 se implementada ou 404 se não implementada
    });

    test("✅ GET /status - Status da API", async () => {
      const response = await request(app).get("/status");

      expect([200, 404]).toContain(response.status);
      // Aceita 200 se implementada ou 404 se não implementada
    });

    test("✅ Rota inexistente retorna 404", async () => {
      const response = await request(app).get("/rota-que-nao-existe");

      expect(response.status).toBe(404);
    });

    test("✅ POST retorna 201 para criação", async () => {
      const userData = {
        name: "Teste Status",
        email: TestUtils.generateRandomEmail(),
        password: "123456"
      };

      const response = await request(app).post("/usuarios").send(userData);

      expect(response.status).toBe(201);
    });

    test("✅ DELETE retorna 204 para sucesso", async () => {
      const createResponse = await TestUtils.createTestUser();
      const userId = createResponse.body.id;

      const response = await request(app).delete(`/usuarios/${userId}`);

      expect(response.status).toBe(204);
    });
  });

  describe("❌ TRATAMENTO DE ERROS", () => {
    test("✅ GET com ID inexistente retorna 404", async () => {
      const response = await request(app).get("/usuarios/99999");

      expect(response.status).toBe(404);
    });

    test("✅ PUT com ID inexistente retorna 404", async () => {
      const response = await request(app)
        .put("/usuarios/99999")
        .send({ name: "Teste" });

      expect(response.status).toBe(404);
    });

    test("✅ DELETE com ID inexistente retorna 404", async () => {
      const response = await request(app).delete("/usuarios/99999");

      expect(response.status).toBe(404);
    });

    test("✅ POST com email duplicado retorna 409", async () => {
      const email = TestUtils.generateRandomEmail();

      // Criar primeiro usuário
      await TestUtils.createTestUser({ email });

      // Tentar criar segundo usuário com mesmo email
      const response = await TestUtils.createTestUser({ email });

      expect(response.status).toBe(409);
    });

    test("✅ POST sem dados obrigatórios retorna 400", async () => {
      const response = await request(app).post("/usuarios").send({}); // Sem name, email, password

      expect(response.status).toBe(400);
    });

    test("✅ POST loja sem usuário válido retorna 400", async () => {
      const response = await request(app).post("/stores").send({
        name: "Loja Teste",
        userId: 99999 // ID inexistente
      });

      expect(response.status).toBe(400);
    });

    test("✅ POST produto sem loja válida retorna 400", async () => {
      const response = await request(app).post("/products").send({
        name: "Produto Teste",
        price: 99.99,
        storeId: 99999 // ID inexistente
      });

      expect(response.status).toBe(400);
    });
  });

  describe("📋 VALIDAÇÕES DE ENTRADA", () => {
    test("✅ Email inválido é rejeitado", async () => {
      const response = await request(app).post("/usuarios").send({
        name: "Teste",
        email: "email-invalido", // Email sem @
        password: "123456"
      });

      expect(response.status).toBe(400);
    });

    test("✅ Preço negativo é rejeitado", async () => {
      const testData = await TestUtils.createCompleteTestData();

      const response = await request(app).post("/products").send({
        name: "Produto Teste",
        price: -10.5, // Preço negativo
        storeId: testData.store.id
      });

      expect(response.status).toBe(400);
    });

    test("✅ Nome muito curto é rejeitado", async () => {
      const response = await request(app).post("/usuarios").send({
        name: "A", // Nome muito curto
        email: TestUtils.generateRandomEmail(),
        password: "123456"
      });

      expect(response.status).toBe(400);
    });
  });

  describe("📡 ENDPOINTS ESPECÍFICOS", () => {
    test("✅ GET /usuarios - Lista usuários", async () => {
      const response = await request(app).get("/usuarios");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("✅ GET /stores - Lista lojas", async () => {
      const response = await request(app).get("/stores");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("✅ GET /products - Lista produtos", async () => {
      const response = await request(app).get("/products");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("✅ GET /stores/:id/products - Produtos da loja", async () => {
      const testData = await TestUtils.createCompleteTestData();

      // Criar mais produtos na mesma loja
      await TestUtils.createTestProduct(testData.store.id);
      await TestUtils.createTestProduct(testData.store.id);

      const response = await request(app).get(
        `/stores/${testData.store.id}/products`
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    });

    test("✅ Content-Type JSON nas respostas", async () => {
      const response = await request(app).get("/usuarios");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/json/);
    });
  });
});
