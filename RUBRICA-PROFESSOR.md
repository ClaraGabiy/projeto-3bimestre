# 🎓 RUBRICA DE AVALIAÇÃO AUTOMÁTICA - PROFESSOR

## 📋 **PONTUAÇÃO DETALHADA (100 pontos)**

### **📁 ESTRUTURA DO PROJETO (20 pontos)**

- ✅ `package.json` configurado corretamente (5 pts)
- ✅ `prisma/schema.prisma` com models corretos (10 pts)
- ✅ `src/index.js` ou estrutura MVC (5 pts)

### **🔧 OPERAÇÕES CRUD (60 pontos)**

#### **👤 USUÁRIOS (20 pontos)**

- ✅ `POST /usuarios` - Criar usuário (5 pts)
- ✅ `GET /usuarios` - Listar usuários (5 pts)
- ✅ `GET /usuarios/:id` - Buscar por ID (2.5 pts)
- ✅ `PUT /usuarios/:id` - Atualizar usuário (5 pts)
- ✅ `DELETE /usuarios/:id` - Deletar usuário (2.5 pts)

#### **🏪 LOJAS (20 pontos)**

- ✅ `POST /stores` - Criar loja (5 pts)
- ✅ `GET /stores` - Listar lojas (5 pts)
- ✅ `GET /stores/:id` - Buscar por ID (2.5 pts)
- ✅ `PUT /stores/:id` - Atualizar loja (5 pts)
- ✅ `DELETE /stores/:id` - Deletar loja (2.5 pts)

#### **📦 PRODUTOS (20 pontos)**

- ✅ `POST /products` - Criar produto (5 pts)
- ✅ `GET /products` - Listar produtos (5 pts)
- ✅ `GET /products/:id` - Buscar por ID (2.5 pts)
- ✅ `PUT /products/:id` - Atualizar produto (5 pts)
- ✅ `DELETE /products/:id` - Deletar produto (2.5 pts)

### **🔗 RELACIONAMENTOS (15 pontos)**

- ✅ User ↔ Store (1:1) funcionando (5 pts)
- ✅ Store ↔ Product (1:N) funcionando (5 pts)
- ✅ Integridade referencial (CASCADE) (5 pts)

### **⭐ QUALIDADE (5 pontos)**

- ✅ Status codes corretos (200, 201, 404, etc.) (2.5 pts)
- ✅ Tratamento de erros básico (2.5 pts)

---

## 🏆 **CONCEITOS E NOTAS**

| Pontos | Conceito | Nota (0-10) | Descrição                                           |
| ------ | -------- | ----------- | --------------------------------------------------- |
| 90-100 | A        | 9.0-10.0    | **Excelente** - Todos requisitos implementados      |
| 80-89  | B        | 8.0-8.9     | **Bom** - Maioria dos requisitos implementados      |
| 70-79  | C        | 7.0-7.9     | **Satisfatório** - Requisitos básicos implementados |
| 60-69  | D        | 6.0-6.9     | **Insuficiente** - Poucos requisitos implementados  |
| 0-59   | F        | 0.0-5.9     | **Reprovado** - Requisitos mínimos não atendidos    |

---

## ⚡ **FLUXO DE CORREÇÃO RÁPIDA (5 minutos por aluno)**

### **1️⃣ Análise Estrutural (30s)**

```bash
node avaliacao-simples.js
```

**📋 Verifica:** Arquivos obrigatórios, configurações, models

### **2️⃣ Teste Funcional (3min)**

```bash
# Terminal 1
node src/index.js

# Terminal 2
node teste-crud-direto.js
```

**📋 Verifica:** Se as 4 operações CRUD funcionam

### **3️⃣ Avaliação Manual (1.5min)**

- ✅ **Olhar código** - Estrutura, organização
- ✅ **Verificar relacionamentos** - Foreign keys, cascade
- ✅ **Checar tratamento de erros** - Try/catch, status codes

---

## 📝 **RELATÓRIO AUTOMÁTICO GERADO**

```
==========================================
🎓 RELATÓRIO DE AVALIAÇÃO - ALUNO: João Silva
==========================================

📁 ESTRUTURA: 18/20 pontos
   ✅ package.json: OK
   ✅ schema.prisma: OK
   ⚠️  Estrutura MVC: Parcial (-2pts)

🔧 CRUD USUÁRIOS: 17/20 pontos
   ✅ CREATE: OK (+5pts)
   ✅ READ: OK (+5pts)
   ✅ READ Individual: OK (+2.5pts)
   ✅ UPDATE: OK (+5pts)
   ❌ DELETE: Falhou (-2.5pts)

🔧 CRUD LOJAS: 15/20 pontos
   ✅ CREATE: OK (+5pts)
   ✅ READ: OK (+5pts)
   ❌ READ Individual: Falhou (-2.5pts)
   ✅ UPDATE: OK (+5pts)
   ❌ DELETE: Falhou (-2.5pts)

🔧 CRUD PRODUTOS: 20/20 pontos
   ✅ Todas operações: OK

🔗 RELACIONAMENTOS: 10/15 pontos
   ✅ User-Store: OK (+5pts)
   ✅ Store-Product: OK (+5pts)
   ❌ CASCADE: Não implementado (-5pts)

⭐ QUALIDADE: 4/5 pontos
   ✅ Status codes: OK (+2.5pts)
   ⚠️  Tratamento erros: Parcial (+1.5pts)

==========================================
🏆 TOTAL: 84/100 pontos
📊 PERCENTUAL: 84%
📋 CONCEITO: B
📝 NOTA: 8.4
==========================================

💬 OBSERVAÇÕES:
- Implementar DELETE de usuários
- Adicionar busca individual de lojas
- Configurar CASCADE no banco
- Melhorar tratamento de erros
==========================================
```

---

## 🔧 **FERRAMENTAS PARA O PROFESSOR**

### **📊 Visualizar Resultados**

```bash
# Ver relatórios salvos
node visualizar-resultados.js --list

# Ver último resultado
node visualizar-resultados.js --latest
```

### **📁 Organizar Correções**

```bash
# Salvar resultado com nome do aluno
cp teste-crud-2025-XX-XX.json joao-silva-resultado.json
```

### **📝 Planilha de Notas**

Os arquivos `.json` gerados podem ser importados para Excel/Sheets para manter controle das notas.

---

## ⚙️ **CONFIGURAÇÃO INICIAL (Uma vez só)**

1. **Baixar ferramentas** - Copiar arquivos de teste para pasta de correção
2. **Configurar ambiente** - Node.js, npm instalado
3. **Testar sistema** - Executar uma vez no seu projeto exemplo

**Com esse sistema você consegue avaliar 12+ alunos por hora de forma consistente e justa!** 🎉
