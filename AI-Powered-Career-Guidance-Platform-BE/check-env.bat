@echo off
REM Environment Variable Checker for Career Guidance Backend (Windows)

echo ==================================
echo Environment Configuration Checker
echo ==================================
echo.

REM Check if .env file exists
if not exist ".env" (
    echo [31mERROR: .env file not found![0m
    echo Create a .env file in this directory with required variables.
    echo See README.md for template.
    pause
    exit /b 1
)

echo [32m.env file found[0m
echo.

REM Check critical variables by reading .env file
setlocal enabledelayedexpansion

echo Checking critical environment variables:
echo.

set HAS_JWT_SECRET=0
set HAS_DB_URL=0
set HAS_DB_USER=0
set HAS_DB_PASS=0
set HAS_GEMINI_KEY=0

for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
    if "%%a"=="APP_JWT_SECRET" (
        if not "%%b"=="" (
            echo [32mAPP_JWT_SECRET is set[0m
            set HAS_JWT_SECRET=1
        )
    )
    if "%%a"=="SPRING_DATASOURCE_URL" (
        if not "%%b"=="" (
            echo [32mSPRING_DATASOURCE_URL: %%b[0m
            set HAS_DB_URL=1
        )
    )
    if "%%a"=="SPRING_DATASOURCE_USERNAME" (
        if not "%%b"=="" (
            echo [32mSPRING_DATASOURCE_USERNAME: %%b[0m
            set HAS_DB_USER=1
        )
    )
    if "%%a"=="SPRING_DATASOURCE_PASSWORD" (
        if not "%%b"=="" (
            echo [32mSPRING_DATASOURCE_PASSWORD is set ^(hidden^)[0m
            set HAS_DB_PASS=1
        )
    )
    if "%%a"=="GEMINI_API_KEY" (
        if not "%%b"=="" (
            echo [32mGEMINI_API_KEY is set[0m
            echo    Preview: %%b
            set HAS_GEMINI_KEY=1
        )
    )
    if "%%a"=="GEMINI_API_BASE_URL" (
        if not "%%b"=="" (
            echo [32mGEMINI_API_BASE_URL: %%b[0m
        )
    )
    if "%%a"=="GEMINI_API_MODEL" (
        if not "%%b"=="" (
            echo [32mGEMINI_API_MODEL: %%b[0m
        )
    )
)

echo.
echo ==================================
echo CRITICAL FOR QUIZ GENERATION:
echo ==================================
if %HAS_GEMINI_KEY%==0 (
    echo [31mGEMINI_API_KEY is NOT set[0m
    echo Get one from: https://aistudio.google.com/app/apikey
    echo Add to .env file: GEMINI_API_KEY=your-key-here
) else (
    echo [32mGEMINI_API_KEY is configured[0m
)

echo.
echo ==================================
echo Configuration Check Complete
echo ==================================
echo.

set MISSING=0
if %HAS_JWT_SECRET%==0 set MISSING=1
if %HAS_DB_URL%==0 set MISSING=1
if %HAS_DB_USER%==0 set MISSING=1
if %HAS_DB_PASS%==0 set MISSING=1
if %HAS_GEMINI_KEY%==0 set MISSING=1

if %MISSING%==1 (
    echo [31mCRITICAL VARIABLES MISSING[0m
    echo Fix the errors above before starting the server
    echo.
    pause
    exit /b 1
) else (
    echo [32mALL CRITICAL VARIABLES ARE SET[0m
    echo You can now start the server with: mvnw spring-boot:run
    echo.
)

pause
