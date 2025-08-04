# DevShip 🚀

**Real-time Code Collaboration Platform**

A modern, real-time collaborative coding environment where developers can write, share, and collaborate on code in real-time.

## 🎯 Project Vision

DevShip is a lightweight, real-time code collaboration platform that allows developers to:
- Create and share code snippets
- Collaborate in real-time with multiple users
- Execute code in a sandboxed environment
- Share projects with live preview
- Chat with collaborators while coding

## ✨ Features

### Core Features
- **Real-time Code Editing** - Multiple users can edit code simultaneously
- **Live Preview** - See code execution results in real-time
- **Project Sharing** - Share projects with unique URLs
- **User Authentication** - Secure user accounts and project ownership
- **Code Execution** - Run code in a safe sandboxed environment
- **Chat System** - Real-time chat with collaborators
- **File Management** - Create, edit, and organize multiple files
- **Syntax Highlighting** - Support for multiple programming languages

### Technical Features
- **WebSocket Real-time Communication**
- **RESTful API** for project management
- **Docker Containerization** for easy deployment
- **TypeScript** for type safety
- **Modern UI** with React/Next.js frontend
- **Database** for persistent storage
- **Authentication** with JWT tokens

## 🏗️ Architecture

```
Frontend (React/Next.js) ←→ Backend (Node.js/Express) ←→ Database (MongoDB/PostgreSQL)
                              ↓
                        WebSocket (Socket.IO)
                              ↓
                        Real-time Collaboration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker (optional)
- MongoDB/PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DevShip
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Database Setup**
   ```bash
   # Configure your database connection in backend/.env
   ```

## 📁 Project Structure

```
DevShip/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── sockets/        # WebSocket handlers
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   └── Dockerfile
├── frontend/               # React/Next.js frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Frontend utilities
│   └── Dockerfile
├── docker-compose.yml      # Multi-container setup
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Collaboration
- `POST /api/projects/:id/share` - Share project
- `GET /api/projects/:id/collaborators` - Get collaborators
- `POST /api/projects/:id/collaborators` - Add collaborator

### Code Execution
- `POST /api/execute` - Execute code in sandbox
- `GET /api/execute/:id/status` - Get execution status

## 🌐 WebSocket Events

### Project Events
- `join-project` - Join a project room
- `leave-project` - Leave a project room
- `code-change` - Broadcast code changes
- `cursor-move` - Show collaborator cursors

### Chat Events
- `send-message` - Send chat message
- `typing` - Show typing indicator

### Execution Events
- `execute-code` - Execute code
- `execution-result` - Return execution results

## 🎨 Frontend Features

### Code Editor
- Monaco Editor integration
- Syntax highlighting
- Auto-completion
- Multiple language support

### Real-time Collaboration
- Live cursors
- Change indicators
- User presence
- Conflict resolution

### Project Management
- Project creation/editing
- File organization
- Version history
- Export/import

## 🔒 Security

- JWT authentication
- Input sanitization
- Code execution sandboxing
- Rate limiting
- CORS configuration

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose up -d
```


## 📄 License

MIT License - see LICENSE file for details
