@echo off
echo.
echo =========================================================
echo 🎓 CORRETOR AUTOMÁTICO - PROJETO API CRUD 3º BIMESTRE
echo =========================================================
echo.

REM Verificar se está na pasta correta
if not exist "src\index.js" (
    if not exist "package.json" (
        echo ❌ ERRO: Não encontrei o projeto do aluno!
        echo.
        echo 💡 INSTRUÇÕES:
        echo    1. Copie este arquivo para a pasta do projeto do aluno
        echo    2. A pasta deve conter: package.json, src/index.js, prisma/
        echo    3. Execute novamente
        echo.
        pause
        exit /b 1
    )
)

echo 📁 Projeto encontrado! Iniciando avaliação...
echo.

REM Verificar se Node.js está disponível
node --version > nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Node.js não está instalado!
    echo 💡 Instale o Node.js em: https://nodejs.org
    pause
    exit /b 1
)

REM Instalar dependências se necessário
if exist "package.json" (
    echo 📦 Verificando dependências...
    npm install > nul 2>&1
    if errorlevel 1 (
        echo ⚠️  Problema com npm install - continuando...
    ) else (
        echo ✅ Dependências OK!
    )
)

echo.
echo 🚀 Executando avaliação automática...
echo ----------------------------------------

REM Executar o avaliador
node avaliador-professor.js

echo.
echo ✅ Avaliação concluída!
echo.
echo 💡 PRÓXIMO PASSO: 
echo    - Anote a nota do aluno
echo    - Copie as observações para feedback
echo    - Mova para próximo aluno
echo.

pause