# 📁 .gitignore Configuration for DevShip

## Overview

This document explains the `.gitignore` configuration for the DevShip project, which ensures that sensitive files, build artifacts, and development files are never committed to version control.

## 📂 .gitignore Files Structure

```
DevShip/
├── .gitignore              # Root-level .gitignore
├── backend/
│   ├── .gitignore          # Backend-specific .gitignore
│   └── .env.example        # Environment variables template
└── frontend/
    └── .gitignore          # Frontend-specific .gitignore
```

## 🔒 Critical Security Exclusions

### Environment Variables
All `.gitignore` files exclude environment variable files to prevent sensitive data from being committed:

```
# Environment variables (CRITICAL - Never commit these!)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.*
```

### SSL Certificates and Keys
```
# SSL certificates and keys
*.pem
*.key
*.crt
*.csr
*.p12
*.pfx
```

### Security Directories
```
# Security: Never commit these!
secrets/
keys/
certificates/
```

## 🏗️ Build and Development Exclusions

### Node.js Dependencies
```
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
```

### Build Outputs
```
# Backend
dist/
build/
lib/

# Frontend (Next.js)
.next/
out/
build/
dist/
```

### TypeScript
```
*.tsbuildinfo
next-env.d.ts
```

## 🗂️ IDE and Editor Files

### VS Code
```
.vscode/
```

### IntelliJ/WebStorm
```
.idea/
```

### Vim/Emacs
```
*.swp
*.swo
*~
```

## 💻 Operating System Files

### macOS
```
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
.AppleDouble
.LSOverride
```

### Windows
```
Thumbs.db
ehthumbs.db
Desktop.ini
```

### Linux
```
*~
```

## 📊 Testing and Coverage

```
coverage/
*.lcov
.nyc_output
test-results/
```

## 🐳 Docker and Deployment

```
.dockerignore
.vercel/
.netlify/
```

## 🔧 Cache and Temporary Files

```
# Cache directories
.cache/
.parcel-cache/
.npm/
.eslintcache/
.stylelintcache/

# Temporary files
tmp/
temp/
*.tmp
*.temp
```

## 📦 Package Managers

### Yarn v2
```
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*
```

### NPM
```
.npm
.yarn-integrity
```

## 🗄️ Database Files

```
*.db
*.sqlite
*.sqlite3
```

## 📝 Backup and Local Files

```
*.bak
*.backup
*.old
config.local.js
config.local.json
```

## ✅ Verification

To verify that your `.gitignore` files are working correctly:

1. **Check what files would be committed:**
   ```bash
   git status
   ```

2. **Verify sensitive files are ignored:**
   ```bash
   # These should not appear in git status
   ls -la backend/.env
   ls -la frontend/.env.local
   ```

3. **Check for any accidentally tracked files:**
   ```bash
   git ls-files | grep -E "\.(env|key|pem|crt)$"
   ```

## 🚨 Important Notes

1. **Environment Variables**: Never commit `.env` files containing real secrets
2. **SSL Certificates**: Keep all certificates and keys out of version control
3. **Dependencies**: `node_modules/` should never be committed
4. **Build Artifacts**: Generated files should be rebuilt, not stored in git
5. **IDE Files**: Editor-specific files should not be shared

## 🔄 Updating .gitignore

If you need to add new exclusions:

1. **Add to the appropriate `.gitignore` file** (root, backend, or frontend)
2. **Remove any already-tracked files:**
   ```bash
   git rm --cached <file>
   ```
3. **Commit the changes:**
   ```bash
   git add .gitignore
   git commit -m "Update .gitignore"
   ```

---

**Remember**: The `.gitignore` files are your first line of defense against accidentally committing sensitive information! 