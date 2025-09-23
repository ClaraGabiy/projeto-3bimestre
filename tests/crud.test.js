import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { TestUtils, app, prisma } from "./utils.js";

/**
 * 🔧 TESTES DE OPERAÇÕES CRUD
 *
 * Este arquivo testa especificamente as operações básicas:
 * - CREATE (POST)
 * - READ (GET)
 * - UPDATE (PUT)
 * - DELETE (DELETE)
 */

describe("🔧 TESTES DE OPERAÇÕES CRUD", () => {
  beforeAll(async () => {
    await TestUtils.clearDatabase();
  });

  afterAll(async () => {
    await TestUtils.clearDatabase();
  });

  describe("👤 CRUD - USUÁRIOS", () => {
    test("✅ CREATE - Criar usuário", async () => {
      const userData = {
        name: "João Silva",
        email: TestUtils.generateRandomEmail(),
        password: "123456"
      };

      const response = await request(app).post("/usuarios").send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
    });

    test("✅ READ - Listar todos os usuários", async () => {
      const response = await request(app).get("/usuarios");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("✅ READ - Buscar usuário por ID", async () => {
      const createResponse = await TestUtils.createTestUser();
      const userId = createResponse.body.id;

      const response = await request(app).get(`/usuarios/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(userId);
      TestUtils.validateUserStructure(response.body);
    });

    test("✅ UPDATE - Atualizar usuário", async () => {
      const createResponse = await TestUtils.createTestUser();
      const userId = createResponse.body.id;

      const updateData = { name: "Nome Atualizado" };
      const response = await request(app)
        .put(`/usuarios/${userId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Nome Atualizado");
      expect(response.body.id).toBe(userId);
    });

    test("✅ DELETE - Deletar usuário", async () => {
      const createResponse = await TestUtils.createTestUser();
      const userId = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/usuarios/${userId}`);
      expect(deleteResponse.status).toBe(204);

      // Verificar se foi realmente deletado
      const getResponse = await request(app).get(`/usuarios/${userId}`);
      expect(getResponse.status).toBe(404);
    });
  });

  describe("🏪 CRUD - LOJAS", () => {
    test("✅ CREATE - Criar loja", async () => {
      const userResponse = await TestUtils.createTestUser();
      const storeData = {
        name: "Minha Loja",
        userId: userResponse.body.id
      };

      const response = await request(app).post("/stores").send(storeData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(storeData.name);
      expect(response.body.userId).toBe(storeData.userId);
    });

    test("✅ READ - Listar todas as lojas", async () => {
      const response = await request(app).get("/stores");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("✅ READ - Buscar loja por ID", async () => {
      const userResponse = await TestUtils.createTestUser();
      const storeResponse = await TestUtils.createTestStore(
        userResponse.body.id
      );
      const storeId = storeResponse.body.id;

      const response = await request(app).get(`/stores/${storeId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(storeId);
      TestUtils.validateStoreStructure(response.body);
    });

    test("✅ UPDATE - Atualizar loja", async () => {
      const userResponse = await TestUtils.createTestUser();
      const storeResponse = await TestUtils.createTestStore(
        userResponse.body.id
      );
      const storeId = storeResponse.body.id;

      const updateData = { name: "Loja Atualizada" };
      const response = await request(app)
        .put(`/stores/${storeId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Loja Atualizada");
      expect(response.body.id).toBe(storeId);
    });

    test("✅ DELETE - Deletar loja", async () => {
      const userResponse = await TestUtils.createTestUser();
      const storeResponse = await TestUtils.createTestStore(
        userResponse.body.id
      );
      const storeId = storeResponse.body.id;

      const deleteResponse = await request(app).delete(`/stores/${storeId}`);
      expect(deleteResponse.status).toBe(204);

      // Verificar se foi realmente deletada
      const getResponse = await request(app).get(`/stores/${storeId}`);
      expect(getResponse.status).toBe(404);
    });
  });

  describe("📦 CRUD - PRODUTOS", () => {
    test("✅ CREATE - Criar produto", async () => {
      const testData = await TestUtils.createCompleteTestData();
      const productData = {
        name: "Notebook Gamer",
        price: 2500.99,
        storeId: testData.store.id
      };

      const response = await request(app).post("/products").send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(productData.name);
      expect(response.body.price).toBe(productData.price);
      expect(response.body.storeId).toBe(productData.storeId);
    });

    test("✅ READ - Listar todos os produtos", async () => {
      const response = await request(app).get("/products");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("✅ READ - Buscar produto por ID", async () => {
      const testData = await TestUtils.createCompleteTestData();
      const productResponse = await TestUtils.createTestProduct(
        testData.store.id
      );
      const productId = productResponse.body.id;

      const response = await request(app).get(`/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(productId);
      TestUtils.validateProductStructure(response.body);
    });

    test("✅ UPDATE - Atualizar produto", async () => {
      const testData = await TestUtils.createCompleteTestData();
      const productResponse = await TestUtils.createTestProduct(
        testData.store.id
      );
      const productId = productResponse.body.id;

      const updateData = {
        name: "Produto Atualizado",
        price: 1999.99
      };
      const response = await request(app)
        .put(`/products/${productId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Produto Atualizado");
      expect(response.body.price).toBe(1999.99);
      expect(response.body.id).toBe(productId);
    });

    test("✅ DELETE - Deletar produto", async () => {
      const testData = await TestUtils.createCompleteTestData();
      const productResponse = await TestUtils.createTestProduct(
        testData.store.id
      );
      const productId = productResponse.body.id;

      const deleteResponse = await request(app).delete(
        `/products/${productId}`
      );
      expect(deleteResponse.status).toBe(204);

      // Verificar se foi realmente deletado
      const getResponse = await request(app).get(`/products/${productId}`);
      expect(getResponse.status).toBe(404);
    });
  });
});
