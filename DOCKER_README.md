# Docker Deployment Guide

This guide explains how to deploy the AI-Powered Career Guidance Platform using Docker and Docker Compose.

## 🏗️ Architecture

The application consists of three main services:
- **Frontend**: React/Vite application served by Nginx (Port 3000)
- **Backend**: Spring Boot REST API (Port 8080)
- **Database**: PostgreSQL (Port 5432)

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports 3000, 8080, and 5432 available

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FinalYearProject
```

### 2. Environment Configuration
Copy the environment template and configure your variables:
```bash
cp .env.example .env
```

Edit `.env` file with your actual values:
- JWT secret key
- Gemini API key
- Google OAuth credentials
- Email configuration

### 3. Start All Services
```bash
docker-compose up -d
```

### 4. Verify Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Backend Health: http://localhost:8080/actuator/health
- Database: localhost:5432

## 📋 Service Details

### Frontend Service
- **Image**: Custom build from `AI-Powered-Career-Guidance-System-FE/Dockerfile`
- **Port**: 3000
- **Technology**: React + Vite + Nginx
- **Health Check**: `/health` endpoint

### Backend Service
- **Image**: Custom build from `AI-Powered-Career-Guidance-Platform-BE/Dockerfile`
- **Port**: 8080
- **Technology**: Spring Boot + Java 21
- **Health Check**: `/actuator/health` endpoint
- **API Documentation**: `/swagger-ui.html`

### Database Service
- **Image**: postgres:latest
- **Port**: 5432
- **Credentials**: postgres/postgres
- **Database**: postgres-db
- **Volume**: Persistent data storage

## 🔧 Configuration

### Environment Variables
Key environment variables in `.env`:

```bash
# JWT Configuration
APP_JWT_SECRET=your-secret-key
APP_JWT_EXPIRATION_SECONDS=3600

# AI Services
GEMINI_API_KEY=your-gemini-key
OLLAMA_BASE_URL=http://localhost:11434

# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-db:5432/postgres-db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://localhost:3000
```

### CORS Configuration
The backend is configured to accept requests from:
- http://localhost:3000
- https://localhost:3000
- http://127.0.0.1:3000

For Cloudflare deployment, update the CORS origins to include your domain.

## 🛠️ Development

### Building Individual Services
```bash
# Build backend only
docker-compose build backend

# Build frontend only
docker-compose build frontend

# Build all services
docker-compose build
```

### Running Services
```bash
# Start all services in background
docker-compose up -d

# Start with logs
docker-compose up

# Start specific service
docker-compose up backend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Logs and Monitoring
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres-db

# Follow logs in real-time
docker-compose logs -f backend
```

### Database Management
```bash
# Connect to PostgreSQL
docker-compose exec postgres-db psql -U postgres -d postgres-db

# Backup database
docker-compose exec postgres-db pg_dump -U postgres postgres-db > backup.sql

# Restore database
docker-compose exec -T postgres-db psql -U postgres postgres-db < backup.sql
```

## 🌐 Cloudflare Deployment

### 1. Update CORS Configuration
Edit `.env` to include your Cloudflare domain:
```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com,https://www.your-domain.com
```

### 2. Configure Cloudflare
1. Add your domain to Cloudflare
2. Set DNS records:
   - A record: `your-domain.com` → `your-server-ip`
   - A record: `www.your-domain.com` → `your-server-ip`

### 3. SSL/TLS
Cloudflare will handle SSL/TLS termination. Make sure to:
- Enable SSL/TLS in Cloudflare dashboard
- Set to "Full" or "Full (strict)" mode

### 4. Firewall Rules
Configure Cloudflare firewall to allow:
- Port 3000 (Frontend)
- Port 8080 (Backend API)
- Block direct port 5432 access

## 🔍 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using ports
   sudo netstat -tulpn | grep :3000
   sudo netstat -tulpn | grep :8080
   sudo netstat -tulpn | grep :5432
   ```

2. **Database Connection Issues**
   ```bash
   # Check database logs
   docker-compose logs postgres-db
   
   # Test connection
   docker-compose exec backend curl -f http://postgres-db:5432
   ```

3. **Frontend Build Issues**
   ```bash
   # Rebuild frontend
   docker-compose build --no-cache frontend
   ```

4. **Backend Startup Issues**
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Check health
   curl http://localhost:8080/actuator/health
   ```

### Health Checks
All services include health checks:
- Frontend: `GET /health`
- Backend: `GET /actuator/health`
- Database: `pg_isready -U postgres`

### Performance Monitoring
```bash
# Check resource usage
docker stats

# Check disk usage
docker system df
```

## 📝 Maintenance

### Updates
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

### Cleanup
```bash
# Remove unused images
docker image prune

# Remove unused containers
docker container prune

# Remove unused volumes (careful!)
docker volume prune
```

## 🔒 Security Considerations

1. **Change Default Passwords**: Update PostgreSQL credentials
2. **Environment Variables**: Never commit `.env` file to version control
3. **Network Security**: Use Cloudflare firewall rules
4. **SSL/TLS**: Always use HTTPS in production
5. **Regular Updates**: Keep Docker images updated

## 📞 Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify configuration: Check `.env` file
3. Test connectivity: Check health endpoints
4. Review this documentation

## 🚀 Production Deployment

For production deployment:
1. Use production-ready secrets
2. Configure proper backup strategy
3. Set up monitoring and alerting
4. Use load balancer for high availability
5. Configure proper logging and log rotation
