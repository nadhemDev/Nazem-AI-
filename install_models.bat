@echo off
color 0A
echo ===================================================
echo     INSTALLATEUR DE MODELES NAZEM AI (OLLAMA)
echo ===================================================
echo.
echo Choisissez un modele a installer :
echo.
echo 1. Llama 3.2 (3B)       - Recommande (Rapide & General)
echo 2. Qwen 2.5 Coder (1.5B)- Specialiste code (Ultra Rapide)
echo 3. Qwen 2.5 Coder (7B)  - Specialiste code (Expert)
echo 4. DeepSeek R1 (7B)     - "Deep Think" (Raisonnement avance)
echo 5. LLaVA                - Vision (Analyse d'images)
echo 6. Mistral (7B)         - Tres performant
echo 7. TOUT INSTALLER
echo 8. Quitter
echo.

set /p choice="Entrez le numero de votre choix : "

if "%choice%"=="1" goto llama32
if "%choice%"=="2" goto qwen15
if "%choice%"=="3" goto qwen7
if "%choice%"=="4" goto deepseek
if "%choice%"=="5" goto llava
if "%choice%"=="6" goto mistral
if "%choice%"=="7" goto all
if "%choice%"=="8" goto end

:llama32
echo.
echo Installation de Llama 3.2 (3B)...
ollama pull llama3.2:3b
goto end

:qwen15
echo.
echo Installation de Qwen 2.5 Coder (1.5B)...
ollama pull qwen2.5-coder:1.5b
goto end

:qwen7
echo.
echo Installation de Qwen 2.5 Coder (7B)...
ollama pull qwen2.5-coder:7b
goto end

:deepseek
echo.
echo Installation de DeepSeek R1 (7B)...
ollama pull deepseek-r1:7b
goto end

:llava
echo.
echo Installation de LLaVA (Support Image)...
ollama pull llava
goto end

:mistral
echo.
echo Installation de Mistral (7B)...
ollama pull mistral:7b
goto end

:all
echo.
echo Installation de tous les modeles recommandes...
ollama pull llama3.2:3b
ollama pull qwen2.5-coder:1.5b
ollama pull qwen2.5-coder:7b
ollama pull deepseek-r1:7b
ollama pull llava
ollama pull mistral:7b
goto end

:end
echo.
echo Termine ! Les modeles seront ajoutes automatiquement.
pause
