# 🚢 DevShip

DevShip is a modern,starter kit for building and deploying full-stack applications using **React** and **Node.js (Express)**, fully containerized with **Docker**. It’s designed for developers who want a clean, professional, and easy-to-use foundation for real-world projects, with built-in DevOps best practices.

---

## 🌟 Features

- **Full-Stack Ready:** React frontend + Express backend, fully containerized.
- **One-Command Startup:** Launch everything with `docker compose up --build`.
- **Live API & Real-Time:** Example API and WebSocket integration out of the box.
- **Production-Grade Docker:** Nginx reverse proxy, static frontend, API proxying.
- **CI/CD Ready:** GitHub Actions workflow included for automated builds and tests.
- **Clean Code & Linting:** Pre-configured ESLint and formatting for both frontend and backend.
- **Easy Customization:** Simple structure, clear separation of concerns, and ready for your features.

---

## 📁 Project Structure

```
DevShip/
├── backend/        # Express API (Node.js)
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
│
├── frontend/       # React app (Vite)
│   ├── Dockerfile
│   ├── public/
│   ├── src/
│   └── package.json
│
├── nginx.conf      # Nginx config for production
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devship.git
   cd devship
   ```

2. **Build and run everything**
   ```bash
   docker compose up --build
   ```

3. **Open your browser**
   - Frontend: [http://localhost](http://localhost)
   - API: [http://localhost/api/info](http://localhost/api/info)

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite, Material UI)
- **Backend:** Node.js, Express, Socket.IO
- **DevOps:** Docker, Docker Compose, Nginx, GitHub Actions

---

## 💡 Why DevShip?

- **No guesswork:** Everything is pre-configured for a real project.
- **No Jenkins, no bloat:** Uses modern GitHub Actions for CI/CD.
- **Easy to extend:** Add your own routes, components, or services.
- **Great for learning or launching MVPs:** See how a real production stack fits together.

---

**Made with ❤️ for modern developers.**
