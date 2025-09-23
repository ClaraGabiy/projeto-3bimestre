import http from "http";
import { PrismaClient } from "@prisma/client";

/**
 * 🎓 AVALIADOR AUTOMÁTICO SIMPLIFICADO - NODE.JS NATIVO
 *
 * Sistema de avaliação simples que funciona sem Jest
 */

console.log("🎓 AVALIAÇÃO AUTOMÁTICA - NODE.JS NATIVO");
console.log("=".repeat(55));
console.log("📚 Projeto: API CRUD - 3º Bimestre");
console.log("📅 Data:", new Date().toLocaleDateString("pt-BR"));
console.log("=".repeat(55));

const prisma = new PrismaClient();
const baseURL = "http://localhost:3000";

// Pontuação
const pontuacao = {
  crud: { obtidos: 0, maximos: 180 }, // 60 para usuários + 60 para lojas + 60 para produtos
  rotas: { obtidos: 0, maximos: 25 },
  relacionamentos: { obtidos: 0, maximos: 15 },
  total: { obtidos: 0, maximos: 220 }
};

const observacoes = [];
const tempoInicio = Date.now();

// Função para fazer requisições HTTP
async function fazerRequisicao(metodo, path, dados = null) {
  return new Promise((resolve) => {
    const url = new URL(path, baseURL);

    const opcoes = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      timeout: 3000
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
            ok: res.statusCode >= 200 && res.statusCode < 300
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: body,
            ok: res.statusCode >= 200 && res.statusCode < 300
          });
        }
      });
    });

    req.on("error", (erro) => {
      resolve({
        status: 0,
        ok: false,
        erro: erro.message
      });
    });

    req.on("timeout", () => {
      resolve({
        status: 0,
        ok: false,
        erro: "Timeout"
      });
    });

    if (dados && (metodo === "POST" || metodo === "PUT")) {
      req.write(JSON.stringify(dados));
    }

    req.end();
  });
}

// Gerar email único
function gerarEmail() {
  return `teste${Date.now()}${Math.floor(Math.random() * 1000)}@avaliacao.com`;
}

// Verificar servidor
async function verificarServidor() {
  console.log("\n🌐 VERIFICANDO SERVIDOR...");

  // Testar diferentes endpoints
  const testes = [
    await fazerRequisicao("GET", "/"),
    await fazerRequisicao("GET", "/usuarios"),
    await fazerRequisicao("GET", "/status")
  ];

  const servidorRodando = testes.some((teste) => teste.status !== 0);

  if (!servidorRodando) {
    console.log("  ❌ SERVIDOR NÃO ESTÁ RODANDO!");
    console.log("  💡 Execute em outro terminal: node src/index.js");
    console.log(
      '  💡 Aguarde aparecer "Servidor rodando em http://localhost:3000"'
    );
    return false;
  }

  const statusValido = testes.find((teste) => teste.status !== 0);
  console.log(`  ✅ Servidor respondendo (Status: ${statusValido.status})`);
  return true;
}

// Limpar banco
async function limparBanco() {
  try {
    await prisma.product.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("  🧹 Banco de dados limpo");
  } catch (error) {
    console.log("  ⚠️  Aviso: Erro ao limpar banco -", error.message);
  }
}

// Testar CRUD Usuários
async function testarCRUDUsuarios() {
  console.log("\n👤 TESTANDO CRUD - USUÁRIOS...");
  let pontosUsuarios = 0;

  try {
    // CREATE
    console.log("  📝 Testando CREATE...");
    const dadosUsuario = {
      name: `Usuario Teste ${Date.now()}`,
      email: gerarEmail(),
      password: "123456"
    };

    const create = await fazerRequisicao("POST", "/usuarios", dadosUsuario);
    if (create.ok && create.data && create.data.id) {
      console.log("    ✅ CREATE funcionando (+20pts)");
      pontosUsuarios += 20;
    } else {
      console.log(`    ❌ CREATE falhou (Status: ${create.status})`);
      observacoes.push("POST /usuarios não funciona");
    }

    // READ
    console.log("  📋 Testando READ...");
    const read = await fazerRequisicao("GET", "/usuarios");
    if (read.ok && Array.isArray(read.data)) {
      console.log("    ✅ READ funcionando (+20pts)");
      pontosUsuarios += 20;
    } else {
      console.log(`    ❌ READ falhou (Status: ${read.status})`);
      observacoes.push("GET /usuarios não retorna lista");
    }

    // Testes individuais se CREATE funcionou
    if (create.data && create.data.id) {
      const userId = create.data.id;

      // READ Individual
      const readOne = await fazerRequisicao("GET", `/usuarios/${userId}`);
      if (readOne.ok) {
        console.log("    ✅ READ individual funcionando (+10pts)");
        pontosUsuarios += 10;
      } else {
        console.log(
          `    ❌ READ individual falhou (Status: ${readOne.status})`
        );
      }

      // UPDATE
      const update = await fazerRequisicao("PUT", `/usuarios/${userId}`, {
        name: "Nome Atualizado"
      });
      if (update.ok) {
        console.log("    ✅ UPDATE funcionando (+5pts)");
        pontosUsuarios += 5;
      }

      // DELETE - Executar por último
      console.log("  🗑️  Testando DELETE...");
      const deletar = await fazerRequisicao("DELETE", `/usuarios/${userId}`);
      if (deletar.ok || deletar.status === 204) {
        console.log("    ✅ DELETE funcionando (+5pts)");
        pontosUsuarios += 5;
      } else {
        console.log(`    ❌ DELETE falhou (Status: ${deletar.status})`);
      }
    }
  } catch (error) {
    console.log("  ❌ Erro geral:", error.message);
    observacoes.push(`Erro em usuários: ${error.message}`);
  }

  pontuacao.crud.obtidos += pontosUsuarios;
  console.log(`  📊 Total usuários: ${pontosUsuarios}/60 pontos`);
}

// Testar CRUD de Lojas
async function testarCRUDLojas() {
  console.log("\n🏪 TESTANDO CRUD LOJAS...");
  let pontosLojas = 0;
  let usuarioTeste = null;

  try {
    // Primeiro criar um usuário para relacionar com a loja
    const novoUsuario = await fazerRequisicao("POST", "/usuarios", {
      name: "Usuario para Loja",
      email: gerarEmail(),
      password: "123456"
    });

    if (!novoUsuario.ok || !novoUsuario.data?.id) {
      console.log("  ⚠️  Não foi possível criar usuário para testar lojas");
      observacoes.push("Falha na criação de usuário para testar lojas");
      return;
    }

    usuarioTeste = novoUsuario.data;

    // CREATE - Criar loja
    const novaLoja = await fazerRequisicao("POST", "/stores", {
      name: "Loja Teste Avaliacao",
      userId: usuarioTeste.id
    });

    if (novaLoja.ok && novaLoja.data && novaLoja.data.id) {
      console.log("  ✅ CREATE loja funcionando (+20pts)");
      pontosLojas += 20;
    } else {
      console.log("  ❌ CREATE loja não funciona");
      observacoes.push("Criação de lojas não implementada");
    }

    // READ ALL - Listar todas as lojas
    const todasLojas = await fazerRequisicao("GET", "/stores");
    if (todasLojas.ok && Array.isArray(todasLojas.data)) {
      console.log("  ✅ READ ALL lojas funcionando (+20pts)");
      pontosLojas += 20;
    } else {
      console.log("  ❌ READ ALL lojas não funciona");
      observacoes.push("Listagem de lojas não implementada");
    }

    // READ ONE - Buscar loja específica
    if (novaLoja.ok && novaLoja.data && novaLoja.data.id) {
      const umaLoja = await fazerRequisicao(
        "GET",
        `/stores/${novaLoja.data.id}`
      );
      if (umaLoja.ok && umaLoja.data && umaLoja.data.id) {
        console.log("  ✅ READ ONE loja funcionando (+10pts)");
        pontosLojas += 10;
      } else {
        console.log("  ❌ READ ONE loja não funciona");
        observacoes.push("Busca individual de loja não implementada");
      }

      // UPDATE - Atualizar loja
      const lojaAtualizada = await fazerRequisicao(
        "PUT",
        `/stores/${novaLoja.data.id}`,
        {
          name: "Loja Teste Atualizada"
        }
      );

      if (lojaAtualizada.ok) {
        console.log("  ✅ UPDATE loja funcionando (+5pts)");
        pontosLojas += 5;
      } else {
        console.log("  ❌ UPDATE loja não funciona");
        observacoes.push("Atualização de lojas não implementada");
      }

      // DELETE - Executar por último
      console.log("  🗑️  Testando DELETE loja...");
      const lojaRemovida = await fazerRequisicao(
        "DELETE",
        `/stores/${novaLoja.data.id}`
      );
      if (lojaRemovida.ok) {
        console.log("  ✅ DELETE loja funcionando (+5pts)");
        pontosLojas += 5;
      } else {
        console.log("  ❌ DELETE loja não funciona");
        observacoes.push("Remoção de lojas não implementada");
      }
    }
  } catch (error) {
    console.log("  ❌ Erro geral:", error.message);
    observacoes.push(`Erro em lojas: ${error.message}`);
  } finally {
    // Limpar usuário de teste
    if (usuarioTeste && usuarioTeste.id) {
      try {
        await fazerRequisicao("DELETE", `/usuarios/${usuarioTeste.id}`);
      } catch (error) {
        console.log("  ⚠️  Erro ao limpar usuário de teste");
      }
    }
  }

  pontuacao.crud.obtidos += pontosLojas;
  console.log(`  📊 Total lojas: ${pontosLojas}/60 pontos`);
}

// Testar CRUD de Produtos
async function testarCRUDProdutos() {
  console.log("\n🛒 TESTANDO CRUD PRODUTOS...");
  let pontosProdutos = 0;
  let usuarioTeste = null;
  let lojaTeste = null;

  try {
    // Primeiro criar um usuário
    const novoUsuario = await fazerRequisicao("POST", "/usuarios", {
      name: "Usuario para Produto",
      email: gerarEmail(),
      password: "123456"
    });

    if (!novoUsuario.ok || !novoUsuario.data?.id) {
      console.log("  ⚠️  Não foi possível criar usuário para testar produtos");
      observacoes.push("Falha na criação de usuário para testar produtos");
      return;
    }

    usuarioTeste = novoUsuario.data;

    // Criar uma loja para relacionar com o produto
    const novaLoja = await fazerRequisicao("POST", "/stores", {
      name: "Loja para Produto",
      userId: usuarioTeste.id
    });

    if (!novaLoja.ok || !novaLoja.data?.id) {
      console.log("  ⚠️  Não foi possível criar loja para testar produtos");
      observacoes.push("Falha na criação de loja para testar produtos");
      return;
    }

    lojaTeste = novaLoja.data;

    // CREATE - Criar produto
    const novoProduto = await fazerRequisicao("POST", "/products", {
      name: "Produto Teste Avaliacao",
      price: 29.99,
      storeId: lojaTeste.id
    });

    if (novoProduto.ok && novoProduto.data && novoProduto.data.id) {
      console.log("  ✅ CREATE produto funcionando (+20pts)");
      pontosProdutos += 20;
    } else {
      console.log("  ❌ CREATE produto não funciona");
      observacoes.push("Criação de produtos não implementada");
    }

    // READ ALL - Listar todos os produtos
    const todosProdutos = await fazerRequisicao("GET", "/products");
    if (todosProdutos.ok && Array.isArray(todosProdutos.data)) {
      console.log("  ✅ READ ALL produtos funcionando (+20pts)");
      pontosProdutos += 20;
    } else {
      console.log("  ❌ READ ALL produtos não funciona");
      observacoes.push("Listagem de produtos não implementada");
    }

    // READ ONE - Buscar produto específico
    if (novoProduto.ok && novoProduto.data && novoProduto.data.id) {
      const umProduto = await fazerRequisicao(
        "GET",
        `/products/${novoProduto.data.id}`
      );
      if (umProduto.ok && umProduto.data && umProduto.data.id) {
        console.log("  ✅ READ ONE produto funcionando (+10pts)");
        pontosProdutos += 10;
      } else {
        console.log("  ❌ READ ONE produto não funciona");
        observacoes.push("Busca individual de produto não implementada");
      }

      // UPDATE - Atualizar produto
      const produtoAtualizado = await fazerRequisicao(
        "PUT",
        `/products/${novoProduto.data.id}`,
        {
          name: "Produto Teste Atualizado",
          price: 39.99
        }
      );

      if (produtoAtualizado.ok) {
        console.log("  ✅ UPDATE produto funcionando (+5pts)");
        pontosProdutos += 5;
      } else {
        console.log("  ❌ UPDATE produto não funciona");
        observacoes.push("Atualização de produtos não implementada");
      }

      // DELETE - Executar por último
      console.log("  🗑️  Testando DELETE produto...");
      const produtoRemovido = await fazerRequisicao(
        "DELETE",
        `/products/${novoProduto.data.id}`
      );
      if (produtoRemovido.ok) {
        console.log("  ✅ DELETE produto funcionando (+5pts)");
        pontosProdutos += 5;
      } else {
        console.log("  ❌ DELETE produto não funciona");
        observacoes.push("Remoção de produtos não implementada");
      }
    }
  } catch (error) {
    console.log("  ❌ Erro geral:", error.message);
    observacoes.push(`Erro em produtos: ${error.message}`);
  } finally {
    // Limpar dados de teste
    if (lojaTeste && lojaTeste.id) {
      try {
        await fazerRequisicao("DELETE", `/stores/${lojaTeste.id}`);
      } catch (error) {
        console.log("  ⚠️  Erro ao limpar loja de teste");
      }
    }
    if (usuarioTeste && usuarioTeste.id) {
      try {
        await fazerRequisicao("DELETE", `/usuarios/${usuarioTeste.id}`);
      } catch (error) {
        console.log("  ⚠️  Erro ao limpar usuário de teste");
      }
    }
  }

  pontuacao.crud.obtidos += pontosProdutos;
  console.log(`  📊 Total produtos: ${pontosProdutos}/60 pontos`);
}

// Testar endpoints adicionais
async function testarEndpointsBasicos() {
  console.log("\n🌐 TESTANDO ENDPOINTS ADICIONAIS...");

  try {
    // Testar rota de status ou health check se existir
    const status = await fazerRequisicao("GET", "/");
    if (status.ok) {
      console.log("  ✅ Endpoint raiz funcionando (+25pts)");
      pontuacao.rotas.obtidos += 25;
    } else {
      console.log("  ❌ Endpoint raiz não responde");
      observacoes.push("Endpoint raiz (/) não implementado ou com problemas");
    }
  } catch (error) {
    console.log("  ❌ Erro em endpoints:", error.message);
  }
}

// Testar relacionamentos básicos
async function testarRelacionamentosBasicos() {
  console.log("\n🔗 TESTANDO RELACIONAMENTOS...");

  try {
    // Criar usuário para teste
    const usuario = await fazerRequisicao("POST", "/usuarios", {
      name: "Usuario Relacionamento",
      email: gerarEmail(),
      password: "123456"
    });

    if (usuario.ok && usuario.data && usuario.data.id) {
      // Tentar criar loja
      const loja = await fazerRequisicao("POST", "/stores", {
        name: "Loja Teste",
        userId: usuario.data.id
      });

      if (loja.ok) {
        console.log("  ✅ Relacionamento User-Store funcionando (+15pts)");
        pontuacao.relacionamentos.obtidos += 15;
      } else {
        console.log("  ❌ Relacionamento não funciona");
        observacoes.push("Relacionamento User-Store não implementado");
      }
    } else {
      console.log("  ⚠️  Não foi possível testar (usuário não criado)");
    }
  } catch (error) {
    console.log("  ❌ Erro em relacionamentos:", error.message);
  }
}

// Gerar relatório final
function gerarRelatorioFinal() {
  pontuacao.total.obtidos =
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
    console.log("\n💬 OBSERVAÇÕES:");
    observacoes.forEach((obs) => console.log(`   • ${obs}`));
  }

  console.log("=".repeat(60));

  return { percentual, conceito, nota };
}

// Executar avaliação
async function executarAvaliacao() {
  try {
    // Verificar servidor
    const servidorOk = await verificarServidor();
    if (!servidorOk) {
      console.log("\n❌ AVALIAÇÃO CANCELADA - Inicie o servidor primeiro");
      return;
    }

    // Limpar banco
    await limparBanco();

    // Executar testes
    await testarCRUDUsuarios();
    await testarCRUDLojas();
    await testarCRUDProdutos();
    await testarEndpointsBasicos();
    await testarRelacionamentosBasicos();

    // Gerar relatório
    const resultado = gerarRelatorioFinal();

    // Limpar banco novamente
    await limparBanco();
    await prisma.$disconnect();

    console.log("\n✅ Avaliação concluída!");
    return resultado;
  } catch (error) {
    console.error("\n❌ Erro durante avaliação:", error);
    await prisma.$disconnect();
  }
}

// Executar
executarAvaliacao();
