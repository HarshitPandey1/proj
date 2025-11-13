# Available Commands Reference

## Root Project Commands

From the root `proj/` directory:

```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Install backend dependencies only
npm run install:backend

# Install frontend dependencies only
npm run install:frontend

# Start backend in production mode
npm run start:backend

# Start backend in development mode (with auto-reload)
npm run dev:backend

# Start frontend development server
npm run start:frontend

# Build frontend for production
npm run build:frontend

# Run both backend and frontend concurrently (requires concurrently package)
npm run dev

# Setup database (requires psql command)
npm run setup:db
```

## Backend Commands

From `backend/` directory:

```bash
# Install dependencies
npm install

# Start server in production mode
npm start

# Start server in development mode with auto-reload (nodemon)
npm run dev

# Run tests (if configured)
npm test
```

## Frontend Commands

From `frontend/` directory:

```bash
# Install dependencies
npm install

# Start development server (http://localhost:4200)
ng serve
# or
npm start

# Start with specific port
ng serve --port 4300

# Start with auto-open browser
ng serve --open

# Build for production
ng build --configuration production
# or
npm run build

# Build and watch for changes
ng build --watch --configuration development
# or
npm run watch

# Run unit tests
ng test
# or
npm test

# Generate new component
ng generate component component-name
# or
ng g c component-name

# Generate new service
ng generate service service-name
# or
ng g s service-name

# Generate new module
ng generate module module-name
# or
ng g m module-name

# Clear Angular cache
rm -rf .angular

# Lint code (if configured)
ng lint
```

## Database Commands

```bash
# Create database
psql -U postgres -c "CREATE DATABASE college_doubt_solver;"

# Import schema and sample data
psql -U postgres -d college_doubt_solver -f backend/database/schema.sql

# Drop database
psql -U postgres -c "DROP DATABASE college_doubt_solver;"

# Access database
psql -U postgres -d college_doubt_solver

# Backup database
pg_dump -U postgres college_doubt_solver > backup.sql

# Restore database
psql -U postgres -d college_doubt_solver < backup.sql

# List databases
psql -U postgres -c "\l"

# Check PostgreSQL status
pg_isready
```

## Git Commands (for version control)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Create .gitignore (already provided)
# Add commonly ignored files/folders

# View status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Push to remote repository
git push origin main
```

## Development Workflow Commands

### Starting Fresh Development Session

```bash
# 1. Start PostgreSQL (ensure it's running)
pg_isready

# 2. Start backend (Terminal 1)
cd backend
npm run dev

# 3. Start frontend (Terminal 2)
cd frontend
ng serve --open

# 4. Open browser
# Frontend: http://localhost:4200
# Backend API: http://localhost:5000/api
```

### After Pulling New Changes

```bash
# Update backend dependencies
cd backend
npm install

# Update frontend dependencies
cd frontend
npm install

# Update database schema if changed
psql -U postgres -d college_doubt_solver -f backend/database/schema.sql
```

### Before Committing Code

```bash
# Format and check backend
cd backend
# Run any linting if configured

# Build and check frontend
cd frontend
ng build --configuration production
# Ensure no errors
```

## Production Commands

### Building for Production

```bash
# Build frontend
cd frontend
ng build --configuration production

# The production files will be in frontend/dist/

# Install backend dependencies (production only)
cd backend
npm install --production
```

### Running in Production

```bash
# Using PM2 (recommended)
npm install -g pm2

cd backend
pm2 start server.js --name college-doubt-api
pm2 save
pm2 startup

# View logs
pm2 logs college-doubt-api

# Restart
pm2 restart college-doubt-api

# Stop
pm2 stop college-doubt-api

# Monitor
pm2 monit
```

## Utility Commands

### Clear Cache and Rebuild

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules .angular dist package-lock.json
npm install
```

### Check Versions

```bash
# Node version
node --version

# npm version
npm --version

# Angular CLI version
ng version

# PostgreSQL version
psql --version

# Global packages
npm list -g --depth=0
```

### Port Management (Windows)

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process by PID
taskkill /PID <PID> /F

# Find process using port 4200
netstat -ano | findstr :4200
```

## Quick Reference

| Task | Command | Location |
|------|---------|----------|
| Install all | `npm run install:all` | Root |
| Start backend dev | `npm run dev` | backend/ |
| Start frontend dev | `ng serve` | frontend/ |
| Build frontend | `ng build --prod` | frontend/ |
| Setup database | `psql -U postgres -d college_doubt_solver -f database/schema.sql` | backend/ |
| View backend logs | `console output` | backend/ |
| Clear backend cache | `rm -rf node_modules && npm install` | backend/ |
| Clear frontend cache | `rm -rf node_modules .angular && npm install` | frontend/ |
| Generate component | `ng g c component-name` | frontend/ |
| Run tests | `ng test` | frontend/ |

## Environment-Specific Commands

### Development
```bash
# Backend with debug logging
DEBUG=* npm run dev

# Frontend with source maps
ng serve --source-map
```

### Production
```bash
# Backend in production mode
NODE_ENV=production npm start

# Frontend production build
ng build --configuration production --aot
```

## Troubleshooting Commands

### Reset Everything
```bash
# Stop all Node processes
taskkill /F /IM node.exe

# Remove all node_modules
rm -rf backend/node_modules frontend/node_modules

# Reinstall everything
cd backend && npm install
cd ../frontend && npm install

# Reset database
psql -U postgres -c "DROP DATABASE college_doubt_solver;"
psql -U postgres -c "CREATE DATABASE college_doubt_solver;"
psql -U postgres -d college_doubt_solver -f backend/database/schema.sql
```

### Debug Mode
```bash
# Backend with verbose logging
DEBUG=* node server.js

# Frontend with detailed errors
ng serve --verbose
```

## Helpful Aliases (Optional)

Add to your shell profile (.bashrc, .zshrc, etc.):

```bash
# Backend
alias bdev='cd ~/proj/backend && npm run dev'
alias bstart='cd ~/proj/backend && npm start'

# Frontend
alias fdev='cd ~/proj/frontend && ng serve --open'
alias fbuild='cd ~/proj/frontend && ng build --prod'

# Combined
alias devall='cd ~/proj && npm run dev'

# Database
alias dbsetup='cd ~/proj/backend && psql -U postgres -d college_doubt_solver -f database/schema.sql'
alias dbconnect='psql -U postgres -d college_doubt_solver'
```

---

## Notes

- Most frontend commands require Angular CLI (`@angular/cli`)
- Backend dev mode requires `nodemon` (included in devDependencies)
- Root level commands require `concurrently` package
- Database commands require PostgreSQL to be installed and running
- For Windows, use `del` instead of `rm` and adjust path separators

---

**Pro Tip**: Create a `Makefile` or shell scripts for common command combinations to speed up your workflow!
