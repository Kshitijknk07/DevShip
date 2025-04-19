# 🚢 DevShip

DevShip is a modern starter kit for building multi-container applications, emphasizing DevOps best practices. It leverages Docker, Docker Compose, and Jenkins to streamline development, testing, and deployment of full-stack applications using **React**, **Node.js**, and **PostgreSQL**.

---

## ⚙️ DevOps Focus

DevShip is designed to help teams adopt DevOps workflows from day one. The project integrates essential DevOps tools and patterns, enabling rapid iteration, automated testing, and reliable deployments.

### 🔧 Key DevOps Tools & Features

- **Docker**  
  - Containerizes both frontend and backend for consistent environments  
  - Each service (frontend, backend, database) has its own Dockerfile for isolated builds  

- **Docker Compose**  
  - Orchestrates multi-container environments with a single command: `docker-compose up`  
  - Simplifies service networking and environment variable management  

- **Jenkins**  
  - Jenkinsfile included for CI/CD automation  
  - Supports automated builds, tests, and deployments on code changes  

- **Environment Management**  
  - Uses `.env` files and Docker secrets for secure configuration  
  - Sensitive files excluded via `.gitignore` and `.dockerignore`  

- **Developer Experience**  
  - Hot reloading for React frontend and Node.js backend  
  - Pre-configured linting and formatting (ESLint, Prettier)  

---

## 📁 Project Structure

```text
DevShip/
├── backend/                     # Node.js Express API
│   ├── Dockerfile               # Backend container definition
│   ├── index.js                 # Entry point for the API
│   ├── package.json             # Node.js dependencies and scripts
│   ├── .dockerignore            # Ignore rules for backend Docker build
│   └── .gitignore               # Git ignore rules
│
├── frontend/                    # React Frontend
│   ├── Dockerfile               # Frontend container definition
│   ├── public/                  # Public assets
│   ├── src/                     # React source code
│   ├── package.json             # Frontend dependencies
│   ├── .dockerignore
│   └── .gitignore
│
├── database/                    # PostgreSQL setup
│   ├── init.sql                 # Optional: SQL initialization script
│   └── Dockerfile               # Optional: Custom Postgres image
│
├── .env                         # Environment variables for local dev
├── docker-compose.yml           # Defines and runs multi-container Docker apps
├── Jenkinsfile                  # Jenkins pipeline for CI/CD
├── README.md                    # You're here!
└── .gitignore                   # Root-level Git ignore
```

## 🚀 Getting Started
Follow these simple steps to get the full-stack environment running on your machine.

1. Clone the repository
```bash
git clone https://github.com/yourusername/devship.git
cd devship
```
2. Set up environment variables
Create a .env file in the root directory and define your variables.
Example
```bash
POSTGRES_USER=devship_user
POSTGRES_PASSWORD=securepassword
POSTGRES_DB=devship_db
```
3. Run the stack
Use Docker Compose to start all services:
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000

- Backend API: http://localhost:5000

- PostgreSQL: exposed on port 5432 internally

4. Jenkins Setup (Optional)
```bash
- Run Jenkins using Docker or install it manually
- Connect your repository
- Configure pipeline using Jenkinsfile
```
## 🛠 Tech Stack
- Frontend: React, JavaScript, Webpack, ESLint, Prettier
- Backend: Node.js, Express.js
- Database: PostgreSQL
- DevOps: Docker, Docker Compose, Jenkins
- CI/CD: Jenkins Pipelines

By - KNK
