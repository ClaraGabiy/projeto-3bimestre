/**
 * 🎓 AVALIADOR AUTOMÁTICO PARA PROFESSORES
 *
 * Script especializado para correção rápida e eficiente dos trabalhos dos alunos
 */

console.log("🎓 SISTEMA DE AVALIAÇÃO AUTOMÁTICA PARA PROFESSORES");
console.log("=".repeat(55));
console.log("📚 Projeto: API CRUD - 3º Bimestre");
console.log("📅 Data:", new Date().toLocaleDateString("pt-BR"));
console.log("=".repeat(55));

// Detectar nome do aluno (pasta ou git)
async function obterNomeAluno() {
  try {
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const { execSync } = require("child_process");
    const path = require("path");

    // Tentar obter do git
    try {
      const gitUser = execSync("git config user.name", {
        encoding: "utf8"
      }).trim();
      if (gitUser && gitUser !== "unknown") return gitUser;
    } catch (e) {}

    // Tentar obter da pasta
    const currentDir = process.cwd();
    const folderName = path.basename(currentDir);
    if (folderName && folderName !== "projeto-3bimestre") {
      return folderName.replace(/[-_]/g, " ");
    }

    return "Aluno Desconhecido";
  } catch (error) {
    return "Aluno Desconhecido";
  }
}

// Classe principal de avaliação
class AvaliadorProfessor {
  constructor() {
    this.aluno = "";
    this.pontuacao = {
      estrutura: { obtidos: 0, maximos: 20 },
      usuarios: { obtidos: 0, maximos: 20 },
      lojas: { obtidos: 0, maximos: 20 },
      produtos: { obtidos: 0, maximos: 20 },
      relacionamentos: { obtidos: 0, maximos: 15 },
      qualidade: { obtidos: 0, maximos: 5 }
    };
    this.observacoes = [];
    this.tempoInicio = Date.now();
  }

  async avaliarEstrutura() {
    console.log("\n📁 AVALIANDO ESTRUTURA DO PROJETO...");

    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const fs = require("fs");

    // Verificar arquivos obrigatórios
    const arquivos = [
      { nome: "package.json", pontos: 5 },
      { nome: "prisma/schema.prisma", pontos: 10 },
      { nome: "src/index.js", pontos: 5, alternativa: "src/app.js" }
    ];

    for (const arquivo of arquivos) {
      if (fs.existsSync(arquivo.nome)) {
        console.log(`   ✅ ${arquivo.nome} - OK (+${arquivo.pontos}pts)`);
        this.pontuacao.estrutura.obtidos += arquivo.pontos;
      } else if (arquivo.alternativa && fs.existsSync(arquivo.alternativa)) {
        console.log(
          `   ✅ ${arquivo.alternativa} - OK (+${arquivo.pontos}pts)`
        );
        this.pontuacao.estrutura.obtidos += arquivo.pontos;
      } else {
        console.log(`   ❌ ${arquivo.nome} - AUSENTE (-${arquivo.pontos}pts)`);
        this.observacoes.push(`Arquivo obrigatório ausente: ${arquivo.nome}`);
      }
    }

    // Verificar package.json
    if (fs.existsSync("package.json")) {
      try {
        const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

        if (pkg.dependencies && pkg.dependencies["@prisma/client"]) {
          console.log("   ✅ Prisma Client configurado");
        } else {
          this.observacoes.push(
            "Prisma Client não configurado no package.json"
          );
        }

        if (pkg.dependencies && pkg.dependencies["express"]) {
          console.log("   ✅ Express configurado");
        } else {
          this.observacoes.push("Express não configurado no package.json");
        }
      } catch (e) {
        this.observacoes.push("package.json com formato inválido");
      }
    }

    // Verificar schema.prisma
    if (fs.existsSync("prisma/schema.prisma")) {
      const schema = fs.readFileSync("prisma/schema.prisma", "utf8");

      const models = ["User", "Store", "Product"];
      models.forEach((model) => {
        if (schema.includes(`model ${model}`)) {
          console.log(`   ✅ Model ${model} encontrado`);
        } else {
          this.observacoes.push(`Model ${model} não encontrado no schema`);
        }
      });
    }
  }

  async testarEndpoint(metodo, path, dados = null) {
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const http = require("http");

    return new Promise((resolve) => {
      const opcoes = {
        hostname: "localhost",
        port: 3000,
        path: path,
        method: metodo,
        headers: { "Content-Type": "application/json" },
        timeout: 3000
      };

      const req = http.request(opcoes, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({
              status: res.statusCode,
              data: body ? JSON.parse(body) : null,
              ok: res.statusCode >= 200 && res.statusCode < 300
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              data: body,
              ok: res.statusCode >= 200 && res.statusCode < 300
            });
          }
        });
      });

      req.on("error", () =>
        resolve({ status: 0, ok: false, erro: "Conexão falhou" })
      );
      req.on("timeout", () =>
        resolve({ status: 0, ok: false, erro: "Timeout" })
      );

      if (dados) req.write(JSON.stringify(dados));
      req.end();
    });
  }

  async avaliarCRUD() {
    console.log("\n🔧 AVALIANDO OPERAÇÕES CRUD...");

    // Verificar se servidor está rodando
    const teste = await this.testarEndpoint("GET", "/");
    if (!teste.ok && teste.status === 0) {
      console.log("   ⚠️  SERVIDOR NÃO ESTÁ RODANDO!");
      console.log("   💡 Execute: node src/index.js em outro terminal");
      this.observacoes.push("Servidor não estava rodando durante o teste");
      return;
    }

    // Testar usuários
    await this.testarCRUDUsuarios();
    await this.testarCRUDLojas();
    await this.testarCRUDProdutos();
  }

  async testarCRUDUsuarios() {
    console.log("\n👤 USUÁRIOS:");

    // CREATE
    const userData = {
      name: "Teste Avaliacao",
      email: `teste${Date.now()}@avaliacao.com`
    };
    const create = await this.testarEndpoint("POST", "/usuarios", userData);
    if (create.ok && create.data && create.data.id) {
      console.log("   ✅ CREATE (+5pts)");
      this.pontuacao.usuarios.obtidos += 5;
    } else {
      console.log("   ❌ CREATE (-5pts)");
      this.observacoes.push("POST /usuarios não funciona");
    }

    // READ
    const read = await this.testarEndpoint("GET", "/usuarios");
    if (read.ok && Array.isArray(read.data)) {
      console.log("   ✅ READ (+5pts)");
      this.pontuacao.usuarios.obtidos += 5;
    } else {
      console.log("   ❌ READ (-5pts)");
      this.observacoes.push("GET /usuarios não funciona");
    }

    // Outros testes se CREATE funcionou
    if (create.data && create.data.id) {
      const userId = create.data.id;

      // READ Individual
      const readOne = await this.testarEndpoint("GET", `/usuarios/${userId}`);
      if (readOne.ok) {
        console.log("   ✅ READ Individual (+2.5pts)");
        this.pontuacao.usuarios.obtidos += 2.5;
      } else {
        console.log("   ❌ READ Individual (-2.5pts)");
      }

      // UPDATE
      const update = await this.testarEndpoint("PUT", `/usuarios/${userId}`, {
        name: "Nome Atualizado"
      });
      if (update.ok) {
        console.log("   ✅ UPDATE (+5pts)");
        this.pontuacao.usuarios.obtidos += 5;
      } else {
        console.log("   ❌ UPDATE (-5pts)");
      }

      // DELETE
      const deletar = await this.testarEndpoint(
        "DELETE",
        `/usuarios/${userId}`
      );
      if (deletar.ok || deletar.status === 204) {
        console.log("   ✅ DELETE (+2.5pts)");
        this.pontuacao.usuarios.obtidos += 2.5;
      } else {
        console.log("   ❌ DELETE (-2.5pts)");
      }
    }
  }

  async testarCRUDLojas() {
    console.log("\n🏪 LOJAS:");

    // READ básico (mais fácil)
    const read = await this.testarEndpoint("GET", "/stores");
    if (read.ok && Array.isArray(read.data)) {
      console.log("   ✅ READ (+10pts)");
      this.pontuacao.lojas.obtidos += 10;
    } else {
      console.log("   ❌ READ (-10pts)");
      this.observacoes.push("GET /stores não funciona");
    }

    // Outros testes seriam similares...
    console.log("   ⚠️  Outros testes de loja: implementar se necessário");
  }

  async testarCRUDProdutos() {
    console.log("\n📦 PRODUTOS:");

    // read básico
    const read = await this.testarEndpoint("GET", "/products");
    if (read.ok && Array.isArray(read.data)) {
      console.log("   ✅ READ (+10pts)");
      this.pontuacao.produtos.obtidos += 10;
    } else {
      console.log("   ❌ READ (-10pts)");
      this.observacoes.push("GET /products não funciona");
    }

    console.log("   ⚠️  Outros testes de produto: implementar se necessário");
  }

  gerarRelatorioFinal() {
    const totalObtidos = Object.values(this.pontuacao).reduce(
      (sum, cat) => sum + cat.obtidos,
      0
    );
    const totalMaximos = Object.values(this.pontuacao).reduce(
      (sum, cat) => sum + cat.maximos,
      0
    );
    const percentual = (totalObtidos / totalMaximos) * 100;
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
    console.log(`👤 ALUNO: ${this.aluno}`);
    console.log(`⏱️  TEMPO DE AVALIAÇÃO: ${tempoTotal}s`);
    console.log(`📅 DATA: ${new Date().toLocaleString("pt-BR")}`);
    console.log("");

    console.log("📊 PONTUAÇÃO POR CATEGORIA:");
    for (const [categoria, pontos] of Object.entries(this.pontuacao)) {
      const pct = ((pontos.obtidos / pontos.maximos) * 100).toFixed(0);
      console.log(
        `   ${categoria.toUpperCase()}: ${pontos.obtidos}/${
          pontos.maximos
        } (${pct}%)`
      );
    }

    console.log("");
    console.log(`🏆 TOTAL: ${totalObtidos.toFixed(1)}/${totalMaximos} pontos`);
    console.log(`📊 PERCENTUAL: ${percentual.toFixed(1)}%`);
    console.log(`📋 CONCEITO: ${conceito}`);
    console.log(`📝 NOTA: ${nota.toFixed(1)}`);

    if (this.observacoes.length > 0) {
      console.log("\n💬 OBSERVAÇÕES PARA O ALUNO:");
      this.observacoes.forEach((obs) => console.log(`   • ${obs}`));
    }

    console.log("=".repeat(60));

    return { totalObtidos, totalMaximos, percentual, conceito, nota };
  }

  async executarAvaliacao() {
    this.aluno = await obterNomeAluno();

    await this.avaliarEstrutura();
    await this.avaliarCRUD();

    return this.gerarRelatorioFinal();
  }
}

// Executar avaliação
if (import.meta.url === `file://${process.argv[1]}`) {
  const avaliador = new AvaliadorProfessor();

  avaliador
    .executarAvaliacao()
    .then((resultado) => {
      console.log("\n✅ Avaliação concluída!");
      console.log(
        `💡 Para avaliar outro aluno: copie os arquivos de teste para a pasta do projeto dele`
      );
    })
    .catch((error) => {
      console.error("\n❌ Erro durante avaliação:", error.message);
    });
}

export { AvaliadorProfessor };
