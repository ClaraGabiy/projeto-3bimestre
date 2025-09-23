import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { TestUtils, app, prisma } from "./utils.js";

/**
 * 🎓 AVALIAÇÃO FINAL AUTOMÁTICA - AV2 3º Bimestre
 *
 * Este arquivo gera a NOTA FINAL do aluno baseada nos testes de CRUD e Rotas.
 * Use este arquivo para obter a pontuação final de 0 a 100.
 */

describe("🎓 AVALIAÇÃO FINAL - PONTUAÇÃO AUTOMÁTICA", () => {
  let avaliacaoResultados = {
    crud: { pontos: 0, maxPontos: 60 }, // 60% - Operações CRUD funcionando
    rotas: { pontos: 0, maxPontos: 25 }, // 25% - Endpoints e tratamento de erros
    relacionamentos: { pontos: 0, maxPontos: 15 }, // 15% - Relacionamentos entre tabelas
    total: { pontos: 0, maxPontos: 100 }
  };

  beforeAll(async () => {
    await TestUtils.clearDatabase();
  });

  afterAll(async () => {
    // Calcular pontuação total
    avaliacaoResultados.total.pontos =
      avaliacaoResultados.crud.pontos +
      avaliacaoResultados.rotas.pontos +
      avaliacaoResultados.relacionamentos.pontos;

    console.log("\n" + "=".repeat(60));
    console.log("🎓 RELATÓRIO FINAL DE AVALIAÇÃO");
    console.log("=".repeat(60));
    console.log(`� DATA: ${new Date().toLocaleString("pt-BR")}`);
    console.log("=".repeat(60));
    console.log(
      `🔧 CRUD: ${avaliacaoResultados.crud.pontos}/${avaliacaoResultados.crud.maxPontos} pontos`
    );
    console.log(
      `🌐 ROTAS: ${avaliacaoResultados.rotas.pontos}/${avaliacaoResultados.rotas.maxPontos} pontos`
    );
    console.log(
      `🔗 RELACIONAMENTOS: ${avaliacaoResultados.relacionamentos.pontos}/${avaliacaoResultados.relacionamentos.maxPontos} pontos`
    );
    console.log("=".repeat(60));
    console.log(
      `🏆 TOTAL: ${avaliacaoResultados.total.pontos}/${avaliacaoResultados.total.maxPontos} pontos`
    );

    const porcentagem = (
      (avaliacaoResultados.total.pontos / avaliacaoResultados.total.maxPontos) *
      100
    ).toFixed(1);
    console.log(`📊 PERCENTUAL: ${porcentagem}%`);

    let conceito = "F";
    let nota = 0;
    if (porcentagem >= 90) {
      conceito = "A";
      nota = 9 + (porcentagem - 90) / 10;
    } else if (porcentagem >= 80) {
      conceito = "B";
      nota = 8 + (porcentagem - 80) / 10;
    } else if (porcentagem >= 70) {
      conceito = "C";
      nota = 7 + (porcentagem - 70) / 10;
    } else if (porcentagem >= 60) {
      conceito = "D";
      nota = 6 + (porcentagem - 60) / 10;
    } else {
      nota = porcentagem / 10;
    }

    console.log(`📋 CONCEITO: ${conceito}`);
    console.log(`📝 NOTA: ${nota.toFixed(1)}`);
    console.log("=".repeat(60));

    await TestUtils.clearDatabase();
    await prisma.$disconnect();
  });

  describe("� AVALIAÇÃO - OPERAÇÕES CRUD (60 pontos)", () => {
    test("[10 pts] ✅ CRUD Usuários - Completo", async () => {
      try {
        // CREATE
        const response = await TestUtils.createTestUser();
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        avaliacaoResultados.crud.pontos += 2.5;

        // READ
        const listResponse = await request(app).get("/usuarios");
        expect(listResponse.status).toBe(200);
        expect(Array.isArray(listResponse.body)).toBe(true);
        avaliacaoResultados.crud.pontos += 2.5;

        // READ Individual
        const getResponse = await request(app).get(
          `/usuarios/${response.body.id}`
        );
        expect(getResponse.status).toBe(200);
        avaliacaoResultados.crud.pontos += 2.5;

        // UPDATE
        const updateResponse = await request(app)
          .put(`/usuarios/${response.body.id}`)
          .send({ name: "Nome Atualizado" });
        expect(updateResponse.status).toBe(200);
        avaliacaoResultados.crud.pontos += 1.25;

        // DELETE
        const deleteResponse = await request(app).delete(
          `/usuarios/${response.body.id}`
        );
        expect(deleteResponse.status).toBe(204);
        avaliacaoResultados.crud.pontos += 1.25;
      } catch (error) {
        console.log("❌ Falha em CRUD usuários:", error.message);
      }
    });

    test("[10 pts] ✅ CRUD Lojas - Completo", async () => {
      try {
        const userResponse = await TestUtils.createTestUser();

        // CREATE
        const storeResponse = await TestUtils.createTestStore(
          userResponse.body.id
        );
        expect(storeResponse.status).toBe(201);
        expect(storeResponse.body).toHaveProperty("id");
        avaliacaoResultados.crud.pontos += 2.5;

        // READ
        const listResponse = await request(app).get("/stores");
        expect(listResponse.status).toBe(200);
        expect(Array.isArray(listResponse.body)).toBe(true);
        avaliacaoResultados.crud.pontos += 2.5;

        // READ Individual
        const getResponse = await request(app).get(
          `/stores/${storeResponse.body.id}`
        );
        expect(getResponse.status).toBe(200);
        avaliacaoResultados.crud.pontos += 2.5;

        // UPDATE
        const updateResponse = await request(app)
          .put(`/stores/${storeResponse.body.id}`)
          .send({ name: "Loja Atualizada" });
        expect(updateResponse.status).toBe(200);
        avaliacaoResultados.crud.pontos += 1.25;

        // DELETE
        const deleteResponse = await request(app).delete(
          `/stores/${storeResponse.body.id}`
        );
        expect(deleteResponse.status).toBe(204);
        avaliacaoResultados.crud.pontos += 1.25;
      } catch (error) {
        console.log("❌ Falha em CRUD lojas:", error.message);
      }
    });

    test("[10 pts] ✅ CRUD Produtos - Completo", async () => {
      try {
        const testData = await TestUtils.createCompleteTestData();

        // CREATE
        const productResponse = await TestUtils.createTestProduct(
          testData.store.id
        );
        expect(productResponse.status).toBe(201);
        expect(productResponse.body).toHaveProperty("id");
        avaliacaoResultados.crud.pontos += 2.5;

        // READ
        const listResponse = await request(app).get("/products");
        expect(listResponse.status).toBe(200);
        expect(Array.isArray(listResponse.body)).toBe(true);
        avaliacaoResultados.crud.pontos += 2.5;

        // READ Individual
        const getResponse = await request(app).get(
          `/products/${productResponse.body.id}`
        );
        expect(getResponse.status).toBe(200);
        avaliacaoResultados.crud.pontos += 2.5;

        // UPDATE
        const updateResponse = await request(app)
          .put(`/products/${productResponse.body.id}`)
          .send({ name: "Produto Atualizado" });
        expect(updateResponse.status).toBe(200);
        avaliacaoResultados.crud.pontos += 1.25;

        // DELETE
        const deleteResponse = await request(app).delete(
          `/products/${productResponse.body.id}`
        );
        expect(deleteResponse.status).toBe(204);
        avaliacaoResultados.crud.pontos += 1.25;
      } catch (error) {
        console.log("❌ Falha em CRUD produtos:", error.message);
      }
    });
  });

  describe("� AVALIAÇÃO - ROTAS E ENDPOINTS (25 pontos)", () => {
    test("[5 pts] ✅ Status Codes Corretos", async () => {
      try {
        // POST retorna 201
        const createResponse = await TestUtils.createTestUser();
        expect(createResponse.status).toBe(201);
        avaliacaoResultados.rotas.pontos += 2;

        // GET retorna 200
        const listResponse = await request(app).get("/usuarios");
        expect(listResponse.status).toBe(200);
        avaliacaoResultados.rotas.pontos += 1.5;

        // DELETE retorna 204
        const deleteResponse = await request(app).delete(
          `/usuarios/${createResponse.body.id}`
        );
        expect(deleteResponse.status).toBe(204);
        avaliacaoResultados.rotas.pontos += 1.5;
      } catch (error) {
        console.log("❌ Falha em status codes:", error.message);
      }
    });

    test("[10 pts] ✅ Tratamento de Erros", async () => {
      try {
        // 404 para ID inexistente
        const response404 = await request(app).get("/usuarios/99999");
        expect(response404.status).toBe(404);
        avaliacaoResultados.rotas.pontos += 3;

        // 409 para email duplicado
        const email = TestUtils.generateRandomEmail();
        await TestUtils.createTestUser({ email });
        const duplicateResponse = await TestUtils.createTestUser({ email });
        expect(duplicateResponse.status).toBe(409);
        avaliacaoResultados.rotas.pontos += 3;

        // 400 para dados inválidos
        const badRequest = await request(app).post("/usuarios").send({});
        expect(badRequest.status).toBe(400);
        avaliacaoResultados.rotas.pontos += 4;
      } catch (error) {
        console.log("❌ Falha em tratamento de erros:", error.message);
      }
    });

    test("[10 pts] ✅ Endpoints Funcionais", async () => {
      try {
        // Todos os endpoints principais funcionam
        const usuarios = await request(app).get("/usuarios");
        expect(usuarios.status).toBe(200);
        avaliacaoResultados.rotas.pontos += 3.5;

        const lojas = await request(app).get("/stores");
        expect(lojas.status).toBe(200);
        avaliacaoResultados.rotas.pontos += 3.5;

        const produtos = await request(app).get("/products");
        expect(produtos.status).toBe(200);
        avaliacaoResultados.rotas.pontos += 3;
      } catch (error) {
        console.log("❌ Falha em endpoints:", error.message);
      }
    });
  });

  describe("🔗 AVALIAÇÃO - RELACIONAMENTOS (15 pontos)", () => {
    test("[5 pts] ✅ Relacionamento User-Store (1:1)", async () => {
      try {
        const userResponse = await TestUtils.createTestUser();
        const storeResponse = await TestUtils.createTestStore(
          userResponse.body.id
        );

        // Tentar criar segunda loja deve falhar
        const secondStoreResponse = await request(app).post("/stores").send({
          name: "Segunda Loja",
          userId: userResponse.body.id
        });

        expect(storeResponse.status).toBe(201);
        expect(secondStoreResponse.status).toBe(409);
        avaliacaoResultados.relacionamentos.pontos += 5;
      } catch (error) {
        console.log("❌ Falha em relacionamento User-Store:", error.message);
      }
    });

    test("[5 pts] ✅ Relacionamento Store-Product (1:N)", async () => {
      try {
        const testData = await TestUtils.createCompleteTestData();

        // Criar múltiplos produtos na mesma loja
        const product2 = await TestUtils.createTestProduct(testData.store.id);
        const product3 = await TestUtils.createTestProduct(testData.store.id);

        expect(product2.status).toBe(201);
        expect(product3.status).toBe(201);

        // Verificar produtos da loja
        const storeProductsResponse = await request(app).get(
          `/stores/${testData.store.id}/products`
        );

        expect(storeProductsResponse.status).toBe(200);
        expect(storeProductsResponse.body.length).toBeGreaterThanOrEqual(3);
        avaliacaoResultados.relacionamentos.pontos += 5;
      } catch (error) {
        console.log("❌ Falha em relacionamento Store-Product:", error.message);
      }
    });

    test("[5 pts] ✅ Integridade Referencial (CASCADE)", async () => {
      try {
        const testData = await TestUtils.createCompleteTestData();

        // Deletar usuário deve deletar loja e produtos
        const deleteResponse = await request(app).delete(
          `/usuarios/${testData.user.id}`
        );
        expect(deleteResponse.status).toBe(204);

        // Verificar se loja foi deletada
        const storeResponse = await request(app).get(
          `/stores/${testData.store.id}`
        );
        expect(storeResponse.status).toBe(404);

        // Verificar se produto foi deletado
        const productResponse = await request(app).get(
          `/products/${testData.product.id}`
        );
        expect(productResponse.status).toBe(404);

        avaliacaoResultados.relacionamentos.pontos += 5;
      } catch (error) {
        console.log("❌ Falha em integridade referencial:", error.message);
      }
    });
  });
});
