# 🎓 GUIA DEFINITIVO PARA CORREÇÃO - PROFESSOR

## 🚀 COMO USAR (1 minuto por aluno!)

### 🎯 **AVALIAÇÃO AUTOMÁTICA (RECOMENDADA)**

#### **Método 1: Avaliação Estática (Sem Servidor)**

```cmd
# 1. Entrar na pasta do projeto do aluno
cd pasta-do-projeto-do-aluno

# 2. Executar avaliação (funciona sempre)
node avaliador-estatico.js
```

#### **Método 2: Avaliação Completa (Com Servidor)**

```cmd
# Terminal 1: Iniciar servidor
node src/index.js

# Terminal 2: Executar avaliação
node avaliador-simples.js
```

#### **Método 3: Scripts NPM (se funcionar)**

```cmd
npm run avaliar          # Avaliação estática
npm run avaliar:completo # Avaliação com servidor
```

**⚡ Recomendado: Use o Método 1 (sempre funciona!)**

---

## � SISTEMA DE PONTUAÇÃO ATUALIZADO

| Categoria              | Pontos     | Peso     | Descrição                                      |
| ---------------------- | ---------- | -------- | ---------------------------------------------- |
| **🔧 CRUD**            | 60pts      | 60%      | CREATE, READ, UPDATE, DELETE funcionando       |
| **🌐 ROTAS**           | 25pts      | 25%      | Endpoints, status codes, tratamento de erros   |
| **🔗 RELACIONAMENTOS** | 15pts      | 15%      | User-Store (1:1), Store-Product (1:N), CASCADE |
| **📊 TOTAL**           | **100pts** | **100%** | **Nota final de 0 a 10**                       |

---

## 🔧 COMANDOS DISPONÍVEIS

### 🎯 **Avaliação Principal:**

```cmd
node avaliador-estatico.js     # ⭐ RECOMENDADO - Análise de código
```

### 🔧 **Avaliação Completa:**

```cmd
node avaliador-simples.js      # Teste HTTP (precisa servidor rodando)
```

### ⚡ **Scripts NPM (se funcionar):**

```cmd
npm run avaliar               # = avaliador-estatico.js
npm run avaliar:completo      # = avaliador-simples.js
```

### 🎓 **Backup Manual:**

```cmd
node avaliador-professor.js   # Sistema alternativo
```

---

## 🎯 CONCEITOS & NOTAS

| Conceito | Percentual | Nota     |
| -------- | ---------- | -------- |
| A        | 90-100%    | 9.0-10.0 |
| B        | 80-89%     | 8.0-8.9  |
| C        | 70-79%     | 7.0-7.9  |
| D        | 60-69%     | 6.0-6.9  |
| F        | 0-59%      | 0.0-5.9  |

---

## ⚡ FLUXO RÁPIDO DE CORREÇÃO

### Para cada aluno:

1. **Abrir pasta do projeto**
2. **Executar:** `npm install && npm run avaliar`
3. **Anotar nota** que aparece no terminal
4. **Próximo aluno**

**⏱️ Tempo total: ~1 minuto por aluno**

---

## 🛠️ TROUBLESHOOTING

### ❌ Erro: "Jest não encontrado"

```cmd
npm install --save-dev jest supertest @jest/globals
```

### ❌ Erro: "Prisma client não gerado"

```cmd
npx prisma generate
```

### ❌ Erro: "Servidor não roda"

```cmd
# Verificar se tem .env configurado
# Usar avaliador manual: node avaliador-professor.js
```

---

## 💡 FEEDBACK AUTOMÁTICO

O sistema já gera observações como:

- ✅ "Arquivo obrigatório ausente: package.json"
- ✅ "Model User não encontrado no schema"
- ✅ "POST /usuarios não funciona"
- ✅ "Servidor não estava rodando durante o teste"

**Use essas observações para dar feedback específico ao aluno!**

---

## 📊 EXEMPLO DE SAÍDA

```
🎓 SISTEMA DE AVALIAÇÃO AUTOMÁTICA PARA PROFESSORES
========================================================
📚 Projeto: API CRUD - 3º Bimestre
📅 Data: 20/03/2024

👤 ALUNO: João Silva
⏱️  TEMPO DE AVALIAÇÃO: 32s
📅 DATA: 20/03/2024 14:30:15

📊 PONTUAÇÃO POR CATEGORIA:
   ESTRUTURA: 20/20 (100%)
   USUARIOS: 15/20 (75%)
   LOJAS: 10/20 (50%)
   PRODUTOS: 10/20 (50%)
   RELACIONAMENTOS: 8/15 (53%)
   QUALIDADE: 3/5 (60%)

🏆 TOTAL: 66.0/100 pontos
📊 PERCENTUAL: 66.0%
📋 CONCEITO: D
📝 NOTA: 6.6

💬 OBSERVAÇÕES PARA O ALUNO:
   • POST /usuarios não funciona
   • GET /stores não funciona
   • Model Product não tem relacionamento
```

---

## 🔄 FLUXO COMPLETO

1. **Recebe projeto do aluno**
2. **Copia avaliador para pasta do projeto**
3. **Executa: `node avaliador-professor.js`**
4. **Anota nota e observações**
5. **Repete para próximo aluno**

**⏱️ Tempo total: ~2 minutos por aluno**
**🎯 Resultado: Nota objetiva + feedback específico**

---

## 📞 SUPORTE

Se precisar de ajuda:

- Verifique se o Node.js está instalado
- Verifique se está na pasta correta do projeto
- Execute `npm install` se der erro de dependências

**Boas correções! 🎓**
