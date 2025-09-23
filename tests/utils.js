import request from "supertest";
import app from "../src/index.js";
import prisma from "../src/db.js";

/**
 * Utilitários para testes da API
 */
export class TestUtils {
  // Limpar todas as tabelas antes dos testes
  static async clearDatabase() {
    await prisma.product.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.user.deleteMany({});
  }

  // Criar usuário de teste
  static async createTestUser(userData = {}) {
    const defaultUser = {
      name: "Usuário Teste",
      email: `teste${Date.now()}@email.com`,
      password: "123456"
    };

    const response = await request(app)
      .post("/usuarios")
      .send({ ...defaultUser, ...userData });

    return response;
  }

  // Criar loja de teste
  static async createTestStore(userId, storeData = {}) {
    const defaultStore = {
      name: "Loja Teste",
      userId: userId
    };

    const response = await request(app)
      .post("/stores")
      .send({ ...defaultStore, ...storeData });

    return response;
  }

  // Criar produto de teste
  static async createTestProduct(storeId, productData = {}) {
    const defaultProduct = {
      name: "Produto Teste",
      price: 99.99,
      storeId: storeId
    };

    const response = await request(app)
      .post("/products")
      .send({ ...defaultProduct, ...productData });

    return response;
  }

  // Criar dados completos de teste (usuário + loja + produto)
  static async createCompleteTestData() {
    // Criar usuário
    const userResponse = await this.createTestUser();
    const userId = userResponse.body.id;

    // Criar loja
    const storeResponse = await this.createTestStore(userId);
    const storeId = storeResponse.body.id;

    // Criar produto
    const productResponse = await this.createTestProduct(storeId);
    const productId = productResponse.body.id;

    return {
      user: { id: userId, ...userResponse.body },
      store: { id: storeId, ...storeResponse.body },
      product: { id: productId, ...productResponse.body }
    };
  }

  // Validar estrutura de resposta de usuário
  static validateUserStructure(user) {
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("password");
    expect(user).toHaveProperty("createdAt");
    expect(typeof user.id).toBe("number");
    expect(typeof user.name).toBe("string");
    expect(typeof user.email).toBe("string");
  }

  // Validar estrutura de resposta de loja
  static validateStoreStructure(store) {
    expect(store).toHaveProperty("id");
    expect(store).toHaveProperty("name");
    expect(store).toHaveProperty("userId");
    expect(store).toHaveProperty("createdAt");
    expect(store).toHaveProperty("updatedAt");
    expect(typeof store.id).toBe("number");
    expect(typeof store.name).toBe("string");
    expect(typeof store.userId).toBe("number");
  }

  // Validar estrutura de resposta de produto
  static validateProductStructure(product) {
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("storeId");
    expect(product).toHaveProperty("createdAt");
    expect(product).toHaveProperty("updatedAt");
    expect(typeof product.id).toBe("number");
    expect(typeof product.name).toBe("string");
    expect(typeof product.storeId).toBe("number");
  }

  // Gerar dados aleatórios para evitar conflitos
  static generateRandomEmail() {
    return `teste${Date.now()}${Math.floor(Math.random() * 1000)}@email.com`;
  }

  static generateRandomName() {
    const names = ["João", "Maria", "Pedro", "Ana", "Carlos", "Beatriz"];
    return names[Math.floor(Math.random() * names.length)] + Date.now();
  }
}

export { app, prisma };
