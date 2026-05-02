# Backend Setup Instructions

## Environment Variables Required

Create a `.env` file in the backend root directory with the following variables:

### Database Configuration
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/career_guidance_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password_here
```

### JWT Configuration
```
APP_JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
APP_JWT_EXPIRATION_SECONDS=3600
```

### Gemini AI Configuration
```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_BASE_URL=https://generativelanguage.googleapis.com/v1beta
GEMINI_API_MODEL=gemini-1.5-flash
```

### Google OAuth (Optional)
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### Email Configuration (Optional)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here
SMTP_FROM_EMAIL=your_email@gmail.com
```

## Quick Setup

1. Make sure PostgreSQL is running and create database:
   ```sql
   CREATE DATABASE career_guidance_db;
   ```

2. Create `.env` file with the variables above

3. Replace placeholder values with your actual credentials

4. Run the backend application

## Minimum Required for Testing
For basic functionality, you only need:
- Database configuration (first 3 variables)
- JWT secret (can be any long random string)
