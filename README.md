# DevShip

DevShip is a modern starter kit for building multi-container applications, emphasizing DevOps best practices. It leverages Docker, Docker Compose, and Jenkins to streamline development, testing, and deployment of full-stack applications using React, Node.js, and PostgreSQL.

---

## DevOps Focus

DevShip is designed to help teams adopt DevOps workflows from day one. The project integrates essential DevOps tools and patterns, enabling rapid iteration, automated testing, and reliable deployments.

### Key DevOps Tools & Features

- **Docker**:  
  - Containerizes both frontend and backend for consistent environments across development, testing, and production.
  - Each service (frontend, backend, database) has its own Dockerfile for isolated builds.

- **Docker Compose**:  
  - Orchestrates multi-container environments, allowing you to spin up the entire stack with a single command.
  - Simplifies service networking and environment variable management.

- **Jenkins**:  
  - Jenkinsfile included for CI/CD automation.
  - Supports automated builds, tests, and deployments on code changes.

- **Environment Management**:  
  - Uses `.env` files and Docker secrets for secure configuration.
  - Ignores sensitive and build files via `.gitignore` and `.dockerignore`.

- **Hot Reloading & Developer Experience**:  
  - Frontend and backend support hot reloading for rapid feedback during development.
  - Linting and formatting integrated for code quality.

---

## Project Structure

DevShip/
│
├── backend/                   # Node.js Express API server (Dockerized)
│   ├── Dockerfile             # Backend container definition
│   ├── index.js               # Entry point for the API server
│   ├── package.json           # Dependencies and scripts
│   ├── .dockerignore          # Files to ignore during Docker build
│   └── .gitignore             # Git ignore rules for backend
│
├── frontend/                  # React frontend application (Dockerized)
│   ├── Dockerfile             # Frontend container definition
│   ├── src/                   # React source files
│   ├── public/                # Public assets
│   ├── package.json           # Dependencies and scripts
│   ├── .dockerignore          # Files to ignore during Docker build
│   └── .gitignore             # Git ignore rules for frontend
│
├── database/                  # PostgreSQL database setup
│   ├── init.sql               # Initial DB schema and seed data
│   └── Dockerfile             # (Optional) Custom DB image setup
│
├── jenkins/                   # Jenkins configuration
│   ├── Jenkinsfile            # CI/CD pipeline definition
│   └── seed.groovy            # (Optional) Jenkins job DSL script
│
├── .env                       # Root environment variables
├── docker-compose.yml         # Docker Compose setup for local dev
├── .gitignore                 # Root Git ignore rules
└── README.md                  # Project documentation



## DevOps Workflow

1. **Build & Run Locally**  
   - Use Docker Compose to build and run all services in isolated containers.  
   - Ensures parity between local, staging, and production environments.

2. **Continuous Integration (CI)**  
   - Jenkinsfile automates building, testing, and linting on every commit.  
   - Prevents regressions and enforces code quality.

3. **Continuous Deployment (CD)**  
   - Jenkins can be configured to deploy containers to your preferred environment (cloud, on-premises, etc.).  
   - Supports rolling updates and zero-downtime deployments.

4. **Monitoring & Logging**  
   - Containers can be extended to include monitoring agents or log shippers.  
   - Easily integrate with tools like Prometheus, Grafana, or ELK stack.


## Example: Running the Stack

To start all services using Docker Compose:

```bash
docker-compose up --build
```

To stop the stack:

```bash
docker-compose down

Use -v to remove volumes if needed:

```bash
docker-compose down -v
```

