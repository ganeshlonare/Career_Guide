#!/bin/bash

# Environment Variable Checker for Career Guidance Backend
echo "=================================="
echo "Environment Configuration Checker"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ ERROR: .env file not found!"
    echo "   Create a .env file in this directory with required variables."
    echo "   See README.md for template."
    exit 1
fi

echo "✅ .env file found"
echo ""

# Load .env file
export $(cat .env | grep -v '^#' | xargs)

# Check critical variables
echo "Checking critical environment variables:"
echo ""

# JWT Secret
if [ -z "$APP_JWT_SECRET" ]; then
    echo "❌ APP_JWT_SECRET is not set"
else
    echo "✅ APP_JWT_SECRET is set"
fi

# Database
if [ -z "$SPRING_DATASOURCE_URL" ]; then
    echo "❌ SPRING_DATASOURCE_URL is not set"
else
    echo "✅ SPRING_DATASOURCE_URL: $SPRING_DATASOURCE_URL"
fi

if [ -z "$SPRING_DATASOURCE_USERNAME" ]; then
    echo "❌ SPRING_DATASOURCE_USERNAME is not set"
else
    echo "✅ SPRING_DATASOURCE_USERNAME: $SPRING_DATASOURCE_USERNAME"
fi

if [ -z "$SPRING_DATASOURCE_PASSWORD" ]; then
    echo "❌ SPRING_DATASOURCE_PASSWORD is not set"
else
    echo "✅ SPRING_DATASOURCE_PASSWORD is set (hidden)"
fi

# Gemini API (most important for quiz)
echo ""
echo "🔑 CRITICAL FOR QUIZ GENERATION:"
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ GEMINI_API_KEY is NOT set"
    echo "   Get one from: https://aistudio.google.com/app/apikey"
    echo "   Add to .env file: GEMINI_API_KEY=your-key-here"
else
    echo "✅ GEMINI_API_KEY is set"
    # Show first/last few characters for verification
    KEY_LENGTH=${#GEMINI_API_KEY}
    if [ $KEY_LENGTH -gt 10 ]; then
        PREVIEW="${GEMINI_API_KEY:0:8}...${GEMINI_API_KEY: -4}"
        echo "   Preview: $PREVIEW (length: $KEY_LENGTH)"
    fi
fi

if [ -z "$GEMINI_API_BASE_URL" ]; then
    echo "⚠️  GEMINI_API_BASE_URL not set (will use default)"
else
    echo "✅ GEMINI_API_BASE_URL: $GEMINI_API_BASE_URL"
fi

if [ -z "$GEMINI_API_MODEL" ]; then
    echo "⚠️  GEMINI_API_MODEL not set (will use default)"
else
    echo "✅ GEMINI_API_MODEL: $GEMINI_API_MODEL"
fi

# Google OAuth
echo ""
if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo "⚠️  GOOGLE_CLIENT_ID is not set (OAuth will not work)"
else
    echo "✅ GOOGLE_CLIENT_ID is set"
fi

# SMTP
echo ""
if [ -z "$SMTP_USERNAME" ]; then
    echo "⚠️  SMTP_USERNAME is not set (email will not work)"
else
    echo "✅ SMTP_USERNAME: $SMTP_USERNAME"
fi

echo ""
echo "=================================="
echo "Configuration Check Complete"
echo "=================================="
echo ""

# Check if all critical variables are set
CRITICAL_MISSING=0

if [ -z "$APP_JWT_SECRET" ]; then CRITICAL_MISSING=1; fi
if [ -z "$SPRING_DATASOURCE_URL" ]; then CRITICAL_MISSING=1; fi
if [ -z "$SPRING_DATASOURCE_USERNAME" ]; then CRITICAL_MISSING=1; fi
if [ -z "$SPRING_DATASOURCE_PASSWORD" ]; then CRITICAL_MISSING=1; fi
if [ -z "$GEMINI_API_KEY" ]; then CRITICAL_MISSING=1; fi

if [ $CRITICAL_MISSING -eq 1 ]; then
    echo "❌ CRITICAL VARIABLES MISSING"
    echo "   Fix the errors above before starting the server"
    echo ""
    exit 1
else
    echo "✅ ALL CRITICAL VARIABLES ARE SET"
    echo "   You can now start the server with: ./mvnw spring-boot:run"
    echo ""
fi
