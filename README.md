# Career Guide 🚀

An AI-Powered Career Guidance Platform that personalizes learning roadmaps, weekly preparation plans, skills quizzes, and industry insights for students and early-career professionals.

## 🏆 Hackathon Winner
**We are proud to announce that Career Guide is a Hackathon Winning project!** 
Built with passion and innovation, the platform was recognized for its unique approach to solving career development challenges using cutting-edge AI technology, seamless user experience, and robust system architecture.

---

## 📸 Screenshots

*(Here is a glimpse of the Career Guide platform in action)*

![Career Guide Overview](/public/home-page.png)

---

## 🏗️ Architecture

The application is built using a modern, scalable 3-tier architecture, heavily utilizing AI for dynamic content generation.

- **Frontend (Client Tier)**: 
  - **Tech Stack**: React 18, TypeScript, Vite, Material UI (MUI), and Tailwind CSS.
  - **Responsibilities**: Handles user authentication flows, dynamic multi-step onboarding, interactive assessments (quizzes), and presents the AI-generated roadmaps and dashboards.
  - **Deployment**: Served by Nginx (Port 3000).

- **Backend (Application Tier)**: 
  - **Tech Stack**: Java 21, Spring Boot 3.5.x, Spring Security, JWT, OAuth2.
  - **Responsibilities**: REST API provider, business logic execution, secure authentication (Email/Password + Google OAuth), and external API communication.
  - **Deployment**: Runs on embedded Tomcat (Port 8080).

- **Database (Data Tier)**: 
  - **Tech Stack**: PostgreSQL 14+, Hibernate/Spring Data JPA.
  - **Responsibilities**: Persistent storage for user profiles, onboarding data, generated roadmaps, and quiz results.
  - **Deployment**: Dockerized PostgreSQL container (Port 5432).

- **AI Integration**: 
  - **Provider**: Groq Cloud API.
  - **Responsibilities**: Dynamically generates tailored multi-milestone career roadmaps, technical quiz questions, industry insights (salary trends, top skills), and weekly preparation plans based on the user's specific profile and goals.

---

## 🚀 Setup Instructions

You can run the entire platform easily using Docker Compose.

### Prerequisites
- **Docker** and **Docker Compose** installed on your system.
- At least 4GB of RAM available.
- Ports `3000`, `8080`, and `5432` available.
- API Keys: You will need a **Groq Cloud API Key** and **Google OAuth Credentials**.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FinalYearProject
```

### 2. Configure Environment Variables
Copy the environment template and configure your secrets:
```bash
cp .env.example .env
```
Edit the `.env` file with your actual values (JWT secret, Groq Cloud API key, Database credentials, Google OAuth, and SMTP config).

### 3. Start All Services
Build and start the application in detached mode using Docker Compose:
```bash
docker-compose up -d --build
```

### 4. Verify Services are Running
- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **API Documentation (Swagger)**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Backend Health Check**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

### 5. Stopping the Platform
To stop all services:
```bash
docker-compose down
```
*(Note: use `docker-compose down -v` to stop and remove database volumes as well).*

---

## 📂 Repository Structure

- `AI-Powered-Career-Guidance-Platform-BE/`: Spring Boot backend service.
- `AI-Powered-Career-Guidance-System-FE/`: React frontend application.
- `docker-compose.yml`: Multi-container Docker orchestration file.
- `DOCKER_README.md`: Detailed instructions for Docker deployment and Cloudflare setup.

---

## 📄 License
This project is licensed under the MIT License.
