import fs from "fs";
import path from "path";

/**
 * 🎓 AVALIADOR COMPLETO - ESTRUTURA + API
 *
 * Avalia tanto a estrutura quanto a funcionalidade da API
 * Funciona mesmo se o servidor não estiver rodando
 */

console.log("🎓 AVALIAÇÃO COMPLETA - ESTRUTURA + API");
console.log("=".repeat(50));
console.log("📚 Projeto: API CRUD - 3º Bimestre");
console.log("📅 Data:", new Date().toLocaleDateString("pt-BR"));
console.log("=".repeat(50));

const pontuacao = {
  estrutura: { obtidos: 0, maximos: 20 },
  crud: { obtidos: 0, maximos: 40 },
  rotas: { obtidos: 0, maximos: 25 },
  relacionamentos: { obtidos: 0, maximos: 15 },
  total: { obtidos: 0, maximos: 100 }
};

const observacoes = [];
const tempoInicio = Date.now();

// Função para verificar se arquivo existe
function arquivoExiste(caminho) {
  try {
    return fs.existsSync(caminho);
  } catch (error) {
    return false;
  }
}

// Função para ler arquivo
function lerArquivo(caminho) {
  try {
    return fs.readFileSync(caminho, "utf8");
  } catch (error) {
    return null;
  }
}

// Verificar estrutura do projeto
function avaliarEstrutura() {
  console.log("\n📁 AVALIANDO ESTRUTURA DO PROJETO...");

  const arquivosObrigatorios = [
    { nome: "package.json", pontos: 5 },
    { nome: "src/index.js", pontos: 5, alternativa: "src/app.js" },
    { nome: "prisma/schema.prisma", pontos: 5 },
    { nome: ".env", pontos: 2, alternativa: ".env.example" },
    { nome: "src/db.js", pontos: 3, alternativa: "src/database.js" }
  ];

  for (const arquivo of arquivosObrigatorios) {
    if (arquivoExiste(arquivo.nome)) {
      console.log(`  ✅ ${arquivo.nome} - OK (+${arquivo.pontos}pts)`);
      pontuacao.estrutura.obtidos += arquivo.pontos;
    } else if (arquivo.alternativa && arquivoExiste(arquivo.alternativa)) {
      console.log(`  ✅ ${arquivo.alternativa} - OK (+${arquivo.pontos}pts)`);
      pontuacao.estrutura.obtidos += arquivo.pontos;
    } else {
      console.log(`  ❌ ${arquivo.nome} - AUSENTE (-${arquivo.pontos}pts)`);
      observacoes.push(`Arquivo obrigatório ausente: ${arquivo.nome}`);
    }
  }

  console.log(
    `  📊 Estrutura: ${pontuacao.estrutura.obtidos}/${pontuacao.estrutura.maximos} pontos`
  );
}

// Analisar código do package.json
function analisarPackageJson() {
  console.log("\n📦 ANALISANDO PACKAGE.JSON...");

  if (!arquivoExiste("package.json")) {
    observacoes.push("package.json não encontrado");
    return;
  }

  const conteudo = lerArquivo("package.json");
  if (!conteudo) {
    observacoes.push("Erro ao ler package.json");
    return;
  }

  try {
    const pkg = JSON.parse(conteudo);

    // Verificar dependências importantes
    if (pkg.dependencies) {
      if (pkg.dependencies["@prisma/client"]) {
        console.log("  ✅ Prisma Client configurado");
      } else {
        console.log("  ❌ Prisma Client não encontrado");
        observacoes.push("Prisma Client não instalado");
      }

      if (pkg.dependencies["express"]) {
        console.log("  ✅ Express configurado");
      } else {
        console.log("  ❌ Express não encontrado");
        observacoes.push("Express não instalado");
      }
    }

    // Verificar scripts
    if (pkg.scripts && pkg.scripts.start) {
      console.log("  ✅ Script start configurado");
    } else {
      console.log("  ❌ Script start não encontrado");
      observacoes.push("Script de start não configurado");
    }
  } catch (error) {
    console.log("  ❌ package.json com formato inválido");
    observacoes.push("package.json malformado");
  }
}

// Analisar schema do Prisma
function analisarSchema() {
  console.log("\n🗄️  ANALISANDO SCHEMA PRISMA...");

  if (!arquivoExiste("prisma/schema.prisma")) {
    observacoes.push("schema.prisma não encontrado");
    return;
  }

  const schema = lerArquivo("prisma/schema.prisma");
  if (!schema) {
    observacoes.push("Erro ao ler schema.prisma");
    return;
  }

  // Verificar modelos obrigatórios
  const modelos = ["User", "Store", "Product"];
  modelos.forEach((modelo) => {
    if (schema.includes(`model ${modelo}`)) {
      console.log(`  ✅ Model ${modelo} encontrado (+3pts)`);
      pontuacao.crud.obtidos += 3;
    } else {
      console.log(`  ❌ Model ${modelo} não encontrado (-3pts)`);
      observacoes.push(`Model ${modelo} não definido no schema`);
    }
  });

  // Verificar relacionamentos
  if (schema.includes("@@relation") || schema.includes("@relation")) {
    console.log("  ✅ Relacionamentos definidos (+5pts)");
    pontuacao.relacionamentos.obtidos += 5;
  } else {
    console.log("  ❌ Relacionamentos não encontrados (-5pts)");
    observacoes.push("Relacionamentos não definidos");
  }

  console.log(
    `  📊 Schema: ${9 - (modelos.length * 3 - pontuacao.crud.obtidos)}/9 pontos`
  );
}

// Analisar código da API
function analisarCodigoAPI() {
  console.log("\n🔧 ANALISANDO CÓDIGO DA API...");

  const arquivosAPI = ["src/index.js", "src/app.js"];
  let codigoAPI = null;

  for (const arquivo of arquivosAPI) {
    if (arquivoExiste(arquivo)) {
      codigoAPI = lerArquivo(arquivo);
      console.log(`  📄 Analisando ${arquivo}...`);
      break;
    }
  }

  if (!codigoAPI) {
    console.log("  ❌ Arquivo principal da API não encontrado");
    observacoes.push("Código da API não encontrado");
    return;
  }

  // Verificar imports/requires básicos
  if (codigoAPI.includes("express") || codigoAPI.includes("Express")) {
    console.log("  ✅ Express importado (+3pts)");
    pontuacao.crud.obtidos += 3;
  } else {
    console.log("  ❌ Express não importado");
  }

  if (codigoAPI.includes("prisma") || codigoAPI.includes("PrismaClient")) {
    console.log("  ✅ Prisma importado (+3pts)");
    pontuacao.crud.obtidos += 3;
  } else {
    console.log("  ❌ Prisma não importado");
  }

  // Verificar rotas CRUD
  const rotasCRUD = [
    {
      nome: "GET /usuarios",
      patterns: ["get.*usuarios", "/usuarios.*get"],
      pontos: 4
    },
    {
      nome: "POST /usuarios",
      patterns: ["post.*usuarios", "/usuarios.*post"],
      pontos: 4
    },
    {
      nome: "GET /stores",
      patterns: ["get.*stores", "/stores.*get"],
      pontos: 4
    },
    {
      nome: "GET /products",
      patterns: ["get.*products", "/products.*get"],
      pontos: 4
    }
  ];

  for (const rota of rotasCRUD) {
    const encontrada = rota.patterns.some((pattern) => {
      const regex = new RegExp(pattern, "i");
      return regex.test(codigoAPI);
    });

    if (encontrada) {
      console.log(`  ✅ ${rota.nome} implementada (+${rota.pontos}pts)`);
      pontuacao.crud.obtidos += rota.pontos;
    } else {
      console.log(`  ❌ ${rota.nome} não encontrada (-${rota.pontos}pts)`);
      observacoes.push(`Rota ${rota.nome} não implementada`);
    }
  }

  // Verificar tratamento de erros
  if (codigoAPI.includes("try") && codigoAPI.includes("catch")) {
    console.log("  ✅ Tratamento de erros implementado (+10pts)");
    pontuacao.rotas.obtidos += 10;
  } else {
    console.log("  ❌ Tratamento de erros não encontrado (-10pts)");
    observacoes.push("Tratamento de erros não implementado");
  }

  // Verificar status codes
  const statusCodes = ["201", "404", "400", "204"];
  let statusEncontrados = 0;
  for (const status of statusCodes) {
    if (codigoAPI.includes(status)) {
      statusEncontrados++;
    }
  }

  if (statusEncontrados >= 3) {
    console.log(
      `  ✅ Status codes implementados (${statusEncontrados}/4) (+15pts)`
    );
    pontuacao.rotas.obtidos += 15;
  } else {
    console.log(`  ❌ Poucos status codes (${statusEncontrados}/4) (-15pts)`);
    observacoes.push("Status codes não implementados corretamente");
  }

  console.log(`  📊 Código API: análise concluída`);
}

// Verificar relacionamentos no código
function verificarRelacionamentosNoCodigo() {
  console.log("\n🔗 VERIFICANDO RELACIONAMENTOS NO CÓDIGO...");

  const arquivosAPI = ["src/index.js", "src/app.js"];
  let codigoAPI = null;

  for (const arquivo of arquivosAPI) {
    if (arquivoExiste(arquivo)) {
      codigoAPI = lerArquivo(arquivo);
      break;
    }
  }

  if (!codigoAPI) return;

  // Verificar se usa include ou select para relacionamentos
  if (codigoAPI.includes("include") || codigoAPI.includes("select")) {
    console.log("  ✅ Queries com relacionamentos (+10pts)");
    pontuacao.relacionamentos.obtidos += 10;
  } else {
    console.log("  ❌ Relacionamentos não utilizados nas queries (-10pts)");
    observacoes.push("Relacionamentos não utilizados corretamente");
  }
}

// Gerar relatório final
function gerarRelatorioFinal() {
  pontuacao.total.obtidos =
    pontuacao.estrutura.obtidos +
    pontuacao.crud.obtidos +
    pontuacao.rotas.obtidos +
    pontuacao.relacionamentos.obtidos;

  const percentual = (pontuacao.total.obtidos / pontuacao.total.maximos) * 100;
  const tempoTotal = Math.round((Date.now() - tempoInicio) / 1000);

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
  console.log(`⏱️  TEMPO: ${tempoTotal}s`);
  console.log("=".repeat(60));
  console.log(
    `📁 ESTRUTURA: ${pontuacao.estrutura.obtidos}/${pontuacao.estrutura.maximos} pontos`
  );
  console.log(
    `🔧 CRUD: ${pontuacao.crud.obtidos}/${pontuacao.crud.maximos} pontos`
  );
  console.log(
    `🌐 ROTAS: ${pontuacao.rotas.obtidos}/${pontuacao.rotas.maximos} pontos`
  );
  console.log(
    `🔗 RELACIONAMENTOS: ${pontuacao.relacionamentos.obtidos}/${pontuacao.relacionamentos.maximos} pontos`
  );
  console.log("=".repeat(60));
  console.log(
    `🏆 TOTAL: ${pontuacao.total.obtidos}/${pontuacao.total.maximos} pontos`
  );
  console.log(`📊 PERCENTUAL: ${percentual.toFixed(1)}%`);
  console.log(`📋 CONCEITO: ${conceito}`);
  console.log(`📝 NOTA: ${nota.toFixed(1)}`);

  if (observacoes.length > 0) {
    console.log("\n💬 OBSERVAÇÕES PARA O ALUNO:");
    observacoes.forEach((obs, index) => {
      console.log(`   ${index + 1}. ${obs}`);
    });
  } else {
    console.log("\n🎉 Projeto sem observações - Parabéns!");
  }

  console.log("=".repeat(60));
  console.log(
    "💡 Este avaliador analisa o código sem precisar rodar o servidor"
  );
  console.log(
    "💡 Para teste completo, inicie o servidor e use o avaliador HTTP"
  );

  return { percentual, conceito, nota };
}

// Executar avaliação completa
async function executarAvaliacao() {
  try {
    avaliarEstrutura();
    analisarPackageJson();
    analisarSchema();
    analisarCodigoAPI();
    verificarRelacionamentosNoCodigo();

    const resultado = gerarRelatorioFinal();

    console.log("\n✅ Avaliação de estrutura e código concluída!");
    return resultado;
  } catch (error) {
    console.error("\n❌ Erro durante avaliação:", error.message);
  }
}

// Executar
executarAvaliacao();
