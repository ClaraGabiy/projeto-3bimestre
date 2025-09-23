import http from "http";
import { PrismaClient } from "@prisma/client";

/**
 * 🎓 AVALIADOR AUTOMÁTICO - NODE.JS NATIVO
 *
 * Sistema de avaliação que funciona sem Jest, usando apenas Node.js nativo
 * para fazer requisições HTTP e testar a API dos alunos.
 */

const prisma = new PrismaClient();

class AvaliadorNativo {
  constructor() {
    this.baseURL = "http://localhost:3000";
    this.pontuacao = {
      crud: { obtidos: 0, maximos: 60 },
      rotas: { obtidos: 0, maximos: 25 },
      relacionamentos: { obtidos: 0, maximos: 15 },
      total: { obtidos: 0, maximos: 100 }
    };
    this.observacoes = [];
    this.tempoInicio = Date.now();
  }

  // Função para fazer requisições HTTP nativas
  async fazerRequisicao(metodo, path, dados = null) {
    return new Promise((resolve) => {
      const url = new URL(path, this.baseURL);

      const opcoes = {
        hostname: url.hostname,
        port: url.port || 3000,
        path: url.pathname,
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        timeout: 5000
      };

      const req = http.request(opcoes, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const data = body ? JSON.parse(body) : null;
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: data,
              ok: res.statusCode >= 200 && res.statusCode < 300,
              body: body
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: body,
              ok: res.statusCode >= 200 && res.statusCode < 300,
              body: body
            });
          }
        });
      });

      req.on("error", (erro) => {
        resolve({
          status: 0,
          ok: false,
          erro: erro.message,
          body: ""
        });
      });

      req.on("timeout", () => {
        resolve({
          status: 0,
          ok: false,
          erro: "Timeout - Servidor não respondeu",
          body: ""
        });
      });

      if (dados && (metodo === "POST" || metodo === "PUT")) {
        req.write(JSON.stringify(dados));
      }

      req.end();
    });
  }

  // Limpar banco de dados
  async limparBanco() {
    try {
      await prisma.product.deleteMany({});
      await prisma.store.deleteMany({});
      await prisma.user.deleteMany({});
      console.log("  🧹 Banco de dados limpo");
    } catch (error) {
      console.log("  ⚠️  Erro ao limpar banco:", error.message);
    }
  }

  // Gerar dados de teste únicos
  gerarEmail() {
    return `teste${Date.now()}${Math.floor(
      Math.random() * 1000
    )}@avaliacao.com`;
  }

  gerarNome() {
    return `Usuario Teste ${Date.now()}`;
  }

  // Verificar se servidor está rodando
  async verificarServidor() {
    console.log("\n🌐 VERIFICANDO SERVIDOR...");

    const resposta = await this.fazerRequisicao("GET", "/");
    if (resposta.status === 0) {
      console.log("  ❌ SERVIDOR NÃO ESTÁ RODANDO!");
      console.log("  💡 Execute em outro terminal: node src/index.js");
      console.log("  💡 Aguarde o servidor iniciar e tente novamente");
      this.observacoes.push("Servidor não estava rodando durante o teste");
      return false;
    }

    console.log(`  ✅ Servidor respondendo (Status: ${resposta.status})`);
    return true;
  }

  // Testes de CRUD - Usuários
  async testarCRUDUsuarios() {
    console.log("\n👤 TESTANDO CRUD - USUÁRIOS...");
    let pontosUsuarios = 0;

    try {
      // CREATE
      console.log("  📝 Testando CREATE...");
      const dadosUsuario = {
        name: this.gerarNome(),
        email: this.gerarEmail(),
        password: "123456"
      };

      const create = await this.fazerRequisicao(
        "POST",
        "/usuarios",
        dadosUsuario
      );
      if (create.ok && create.data && create.data.id) {
        console.log("    ✅ CREATE funcionando (+15pts)");
        pontosUsuarios += 15;
      } else {
        console.log(`    ❌ CREATE falhou (Status: ${create.status}) (-15pts)`);
        this.observacoes.push("POST /usuarios não funciona corretamente");
      }

      // READ
      console.log("  📋 Testando READ...");
      const read = await this.fazerRequisicao("GET", "/usuarios");
      if (read.ok && Array.isArray(read.data)) {
        console.log("    ✅ READ funcionando (+15pts)");
        pontosUsuarios += 15;
      } else {
        console.log(`    ❌ READ falhou (Status: ${read.status}) (-15pts)`);
        this.observacoes.push("GET /usuarios não retorna array");
      }

      // Testes que dependem do CREATE ter funcionado
      if (create.data && create.data.id) {
        const userId = create.data.id;

        // READ Individual
        console.log("  🔍 Testando READ individual...");
        const readOne = await this.fazerRequisicao(
          "GET",
          `/usuarios/${userId}`
        );
        if (readOne.ok && readOne.data && readOne.data.id == userId) {
          console.log("    ✅ READ individual funcionando (+10pts)");
          pontosUsuarios += 10;
        } else {
          console.log(
            `    ❌ READ individual falhou (Status: ${readOne.status}) (-10pts)`
          );
          this.observacoes.push("GET /usuarios/:id não funciona");
        }

        // UPDATE
        console.log("  ✏️  Testando UPDATE...");
        const update = await this.fazerRequisicao(
          "PUT",
          `/usuarios/${userId}`,
          {
            name: "Nome Atualizado"
          }
        );
        if (update.ok) {
          console.log("    ✅ UPDATE funcionando (+10pts)");
          pontosUsuarios += 10;
        } else {
          console.log(
            `    ❌ UPDATE falhou (Status: ${update.status}) (-10pts)`
          );
          this.observacoes.push("PUT /usuarios/:id não funciona");
        }

        // DELETE
        console.log("  🗑️  Testando DELETE...");
        const deletar = await this.fazerRequisicao(
          "DELETE",
          `/usuarios/${userId}`
        );
        if (deletar.ok || deletar.status === 204) {
          console.log("    ✅ DELETE funcionando (+10pts)");
          pontosUsuarios += 10;
        } else {
          console.log(
            `    ❌ DELETE falhou (Status: ${deletar.status}) (-10pts)`
          );
          this.observacoes.push("DELETE /usuarios/:id não funciona");
        }
      }
    } catch (error) {
      console.log("  ❌ Erro geral em CRUD usuários:", error.message);
      this.observacoes.push(`Erro em CRUD usuários: ${error.message}`);
    }

    this.pontuacao.crud.obtidos += pontosUsuarios;
    console.log(`  📊 Total usuários: ${pontosUsuarios}/60 pontos`);
  }

  // Testes de CRUD - Lojas e Produtos (simplificado)
  async testarCRUDLojasEProdutos() {
    console.log("\n🏪 TESTANDO CRUD - LOJAS E PRODUTOS...");

    try {
      // Testar se endpoints básicos respondem
      const lojas = await this.fazerRequisicao("GET", "/stores");
      const produtos = await this.fazerRequisicao("GET", "/products");

      if (lojas.ok) {
        console.log("  ✅ Endpoint /stores funcionando (+10pts)");
        this.pontuacao.crud.obtidos += 10;
      } else {
        console.log("  ❌ Endpoint /stores não funciona (-10pts)");
        this.observacoes.push("GET /stores não funciona");
      }

      if (produtos.ok) {
        console.log("  ✅ Endpoint /products funcionando (+10pts)");
        this.pontuacao.crud.obtidos += 10;
      } else {
        console.log("  ❌ Endpoint /products não funciona (-10pts)");
        this.observacoes.push("GET /products não funciona");
      }
    } catch (error) {
      console.log("  ❌ Erro em lojas/produtos:", error.message);
      this.observacoes.push(`Erro em lojas/produtos: ${error.message}`);
    }
  }

  // Testes de Rotas e Status Codes
  async testarRotasEStatus() {
    console.log("\n🌐 TESTANDO ROTAS E STATUS CODES...");

    try {
      // Testar 404 para ID inexistente
      const teste404 = await this.fazerRequisicao("GET", "/usuarios/99999");
      if (teste404.status === 404) {
        console.log("  ✅ Status 404 para ID inexistente (+8pts)");
        this.pontuacao.rotas.obtidos += 8;
      } else {
        console.log(
          `  ❌ Status 404 não funciona (Retornou: ${teste404.status}) (-8pts)`
        );
        this.observacoes.push("Tratamento de erro 404 não implementado");
      }

      // Testar 400 para dados inválidos
      const teste400 = await this.fazerRequisicao("POST", "/usuarios", {});
      if (teste400.status === 400) {
        console.log("  ✅ Status 400 para dados inválidos (+8pts)");
        this.pontuacao.rotas.obtidos += 8;
      } else {
        console.log(
          `  ❌ Status 400 não funciona (Retornou: ${teste400.status}) (-8pts)`
        );
        this.observacoes.push("Validação de dados não implementada");
      }

      // Testar Content-Type JSON
      const testeJson = await this.fazerRequisicao("GET", "/usuarios");
      if (
        testeJson.headers["content-type"] &&
        testeJson.headers["content-type"].includes("json")
      ) {
        console.log("  ✅ Content-Type JSON correto (+9pts)");
        this.pontuacao.rotas.obtidos += 9;
      } else {
        console.log("  ❌ Content-Type não é JSON (-9pts)");
        this.observacoes.push("Headers não configurados corretamente");
      }
    } catch (error) {
      console.log("  ❌ Erro em rotas:", error.message);
      this.observacoes.push(`Erro em rotas: ${error.message}`);
    }
  }

  // Testes básicos de relacionamentos
  async testarRelacionamentos() {
    console.log("\n🔗 TESTANDO RELACIONAMENTOS...");

    try {
      // Verificar se consegue criar usuário e loja
      const usuario = await this.fazerRequisicao("POST", "/usuarios", {
        name: "Usuario Relacionamento",
        email: this.gerarEmail(),
        password: "123456"
      });

      if (usuario.ok && usuario.data && usuario.data.id) {
        const loja = await this.fazerRequisicao("POST", "/stores", {
          name: "Loja Teste",
          userId: usuario.data.id
        });

        if (loja.ok) {
          console.log("  ✅ Relacionamento User-Store funcionando (+15pts)");
          this.pontuacao.relacionamentos.obtidos += 15;
        } else {
          console.log("  ❌ Relacionamento User-Store não funciona (-15pts)");
          this.observacoes.push(
            "Relacionamento entre usuário e loja não funciona"
          );
        }
      } else {
        console.log(
          "  ⚠️  Não foi possível testar relacionamentos (usuário não foi criado)"
        );
        this.observacoes.push("Não foi possível testar relacionamentos");
      }
    } catch (error) {
      console.log("  ❌ Erro em relacionamentos:", error.message);
      this.observacoes.push(`Erro em relacionamentos: ${error.message}`);
    }
  }

  // Gerar relatório final
  gerarRelatorioFinal() {
    this.pontuacao.total.obtidos =
      this.pontuacao.crud.obtidos +
      this.pontuacao.rotas.obtidos +
      this.pontuacao.relacionamentos.obtidos;

    const percentual =
      (this.pontuacao.total.obtidos / this.pontuacao.total.maximos) * 100;
    const tempoTotal = Math.round((Date.now() - this.tempoInicio) / 1000);

    let conceito = "F";
    let nota = 0;
    if (percentual >= 90) {
      conceito = "A";
      nota = 9 + (percentual - 90) / 10;
    } else if (percentual >= 80) {
      conceito = "B";
      nota = 8 + (percentual - 80) / 10;
    } else if (percentual >= 70) {
      conceito = "C";
      nota = 7 + (percentual - 70) / 10;
    } else if (percentual >= 60) {
      conceito = "D";
      nota = 6 + (percentual - 60) / 10;
    } else {
      nota = percentual / 10;
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎓 RELATÓRIO FINAL DE AVALIAÇÃO");
    console.log("=".repeat(60));
    console.log(`📅 DATA: ${new Date().toLocaleString("pt-BR")}`);
    console.log(`⏱️  TEMPO DE AVALIAÇÃO: ${tempoTotal}s`);
    console.log("=".repeat(60));
    console.log(
      `🔧 CRUD: ${this.pontuacao.crud.obtidos}/${this.pontuacao.crud.maximos} pontos`
    );
    console.log(
      `🌐 ROTAS: ${this.pontuacao.rotas.obtidos}/${this.pontuacao.rotas.maximos} pontos`
    );
    console.log(
      `🔗 RELACIONAMENTOS: ${this.pontuacao.relacionamentos.obtidos}/${this.pontuacao.relacionamentos.maximos} pontos`
    );
    console.log("=".repeat(60));
    console.log(
      `🏆 TOTAL: ${this.pontuacao.total.obtidos}/${this.pontuacao.total.maximos} pontos`
    );
    console.log(`📊 PERCENTUAL: ${percentual.toFixed(1)}%`);
    console.log(`📋 CONCEITO: ${conceito}`);
    console.log(`📝 NOTA: ${nota.toFixed(1)}`);

    if (this.observacoes.length > 0) {
      console.log("\n💬 OBSERVAÇÕES PARA O ALUNO:");
      this.observacoes.forEach((obs) => console.log(`   • ${obs}`));
    }

    console.log("=".repeat(60));

    return {
      totalObtidos: this.pontuacao.total.obtidos,
      totalMaximos: this.pontuacao.total.maximos,
      percentual,
      conceito,
      nota
    };
  }

  // Executar avaliação completa
  async executarAvaliacao() {
    console.log("🎓 AVALIAÇÃO AUTOMÁTICA - NODE.JS NATIVO");
    console.log("=".repeat(55));
    console.log("📚 Projeto: API CRUD - 3º Bimestre");
    console.log("📅 Data:", new Date().toLocaleDateString("pt-BR"));
    console.log("=".repeat(55));

    // Verificar servidor
    const servidorOk = await this.verificarServidor();
    if (!servidorOk) {
      console.log("\n❌ AVALIAÇÃO CANCELADA - Servidor não disponível");
      return null;
    }

    // Limpar banco
    await this.limparBanco();

    // Executar testes
    await this.testarCRUDUsuarios();
    await this.testarCRUDLojasEProdutos();
    await this.testarRotasEStatus();
    await this.testarRelacionamentos();

    // Gerar relatório
    const resultado = this.gerarRelatorioFinal();

    // Limpar banco novamente
    await this.limparBanco();
    await prisma.$disconnect();

    return resultado;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("🚀 Iniciando avaliador nativo...");

  const avaliador = new AvaliadorNativo();

  avaliador
    .executarAvaliacao()
    .then((resultado) => {
      if (resultado) {
        console.log("\n✅ Avaliação concluída com sucesso!");
        console.log(
          "💡 Use este arquivo para avaliação rápida sem dependências externas"
        );
      } else {
        console.log("\n⚠️ Avaliação não pôde ser concluída");
      }
    })
    .catch((error) => {
      console.error("\n❌ Erro durante avaliação:");
      console.error(error);
      process.exit(1);
    });
}

export { AvaliadorNativo };
