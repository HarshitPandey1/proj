# 🔧 Installation Checklist - Complete Setup Guide

## ✅ Prerequisites to Download/Install

### 1. Node.js (Required for Backend & Frontend)
**Download**: https://nodejs.org/

- ✅ **Recommended Version**: Node.js 18.x or 20.x LTS
- ✅ **Includes**: npm (Node Package Manager)
- **Verification**:
  ```cmd
  node --version
  npm --version
  ```
- **Expected Output**: `v18.x.x` or `v20.x.x` and `9.x.x` or `10.x.x`

### 2. PostgreSQL (Required for Database)
**Download**: https://www.postgresql.org/download/windows/

- ✅ **Recommended Version**: PostgreSQL 14.x or 15.x or 16.x
- ✅ **During Installation**:
  - Remember the password you set for `postgres` user
  - Default port: 5432 (recommended)
  - Install pgAdmin 4 (GUI tool - helpful for beginners)
- **Verification**:
  ```cmd
  psql --version
  ```
- **Expected Output**: `psql (PostgreSQL) 14.x` or higher

### 3. Angular CLI (Recommended - Installed via npm)
**Installation** (AFTER installing Node.js):
```cmd
npm install -g @angular/cli
```

- ✅ **Purpose**: Angular command-line tools
- ✅ **Required for**: `ng serve`, `ng build`, etc.
- **Verification**:
  ```cmd
  ng version
  ```
- **Expected Output**: `Angular CLI: 17.x.x`

### 4. Git (Optional but Recommended)
**Download**: https://git-scm.com/download/windows

- ✅ **Purpose**: Version control, code management
- **Verification**:
  ```cmd
  git --version
  ```

### 4. Code Editor (Optional but Recommended)
**Visual Studio Code**: https://code.visualstudio.com/

- ✅ **Recommended Extensions**:
  - Angular Language Service
  - PostgreSQL (by Chris Kolkman)
  - ESLint
  - Prettier

---

## 📋 Step-by-Step Installation Process

### Step 1: Install Node.js
1. Download from https://nodejs.org/ (LTS version)
2. Run the installer
3. Click "Next" through the installation
4. ✅ Make sure "Add to PATH" is checked
5. Restart your computer (or terminal)
6. Verify:
   ```cmd
   node --version
   npm --version
   ```

### Step 2: Install PostgreSQL
1. Download from https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - ✅ Set password for `postgres` user (e.g., `admin123`)
   - ✅ Keep port as `5432`
   - ✅ Install Stack Builder (optional)
   - ✅ Install pgAdmin 4 (recommended)
4. Verify:
   ```cmd
   psql --version
   ```

### Step 3: Create PostgreSQL Database

#### Option A: Using pgAdmin 4 (GUI - Easier)
1. Open pgAdmin 4
2. Connect to PostgreSQL (enter your password)
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `college_doubt_solver`
5. Owner: `postgres`
6. Click "Save"
7. Right-click on the new database → "Query Tool"
8. Open file: `c:\Users\HPandey\Downloads\proj\backend\database\schema.sql`
9. Click "Execute" (▶ button)

#### Option B: Using Command Line (psql)
```cmd
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE college_doubt_solver;

# Connect to the database
\c college_doubt_solver

# Import schema
\i 'C:/Users/HPandey/Downloads/proj/backend/database/schema.sql'

# Verify tables created
\dt

# Exit
\q
```

### Step 4: Install Backend Dependencies
```cmd
cd c:\Users\HPandey\Downloads\proj\backend
npm install
```

**What this installs**:
- express (web framework)
- pg (PostgreSQL client)
- jsonwebtoken (authentication)
- bcryptjs (password hashing)
- cors (cross-origin requests)
- multer (file uploads)
- dotenv (environment variables)
- express-validator (input validation)

**Expected output**: Installing packages... (takes 1-2 minutes)

### Step 5: Configure Backend Environment
```cmd
cd c:\Users\HPandey\Downloads\proj\backend
copy .env.example .env
notepad .env
```

**Edit the .env file** with your settings:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_doubt_solver
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (change this to any random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# College Email Domain (change if needed)
COLLEGE_EMAIL_DOMAIN=@bmsce.ac.in

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
```

### Step 6: Install Frontend Dependencies
```cmd
cd c:\Users\HPandey\Downloads\proj\frontend
npm install
```

**What this installs**:
- @angular/core, @angular/common, etc. (Angular framework)
- @angular/router (routing)
- @angular/forms (forms)
- rxjs (reactive programming)
- typescript (TypeScript compiler)
- zone.js (change detection)

**Expected output**: Installing packages... (takes 2-3 minutes)

### Step 7: Verify Installation

#### Check Backend
```cmd
cd c:\Users\HPandey\Downloads\proj\backend
npm run dev
```

**Expected output**:
```
Server running on port 5000
Connected to PostgreSQL database
```

**Test**: Open browser → http://localhost:5000/api/health
Should show: `{"status":"healthy","database":"connected"}`

#### Check Frontend
Open **NEW terminal** (keep backend running):
```cmd
cd c:\Users\HPandey\Downloads\proj\frontend
npm start
```

**Expected output**:
```
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

**Test**: Open browser → http://localhost:4200
Should show the login page

---

## 🐛 Common Issues & Fixes

### Issue 1: "node is not recognized"
**Fix**: Node.js not in PATH
```cmd
# Reinstall Node.js and make sure "Add to PATH" is checked
# OR restart your computer
```

### Issue 2: "psql is not recognized"
**Fix**: PostgreSQL not in PATH
```cmd
# Add manually to PATH:
# C:\Program Files\PostgreSQL\15\bin
# Then restart terminal
```

### Issue 3: "ECONNREFUSED" when starting backend
**Fix**: PostgreSQL not running
```cmd
# Start PostgreSQL service:
# Windows: Services → PostgreSQL → Start
# Or restart computer
```

### Issue 4: "password authentication failed"
**Fix**: Wrong password in .env file
```cmd
# Edit backend\.env
# Set DB_PASSWORD to the password you set during PostgreSQL installation
```

### Issue 5: "relation 'users' does not exist"
**Fix**: Database schema not imported
```cmd
# Import schema using pgAdmin or psql
# See Step 3 above
```

### Issue 6: "Cannot find module 'express'"
**Fix**: Dependencies not installed
```cmd
cd backend
npm install
```

### Issue 7: "Port 5000 already in use"
**Fix**: Another application using port
```cmd
# Option 1: Stop other application
# Option 2: Change port in backend\.env
PORT=5001
```

### Issue 8: Angular compilation errors
**Fix**: Install Angular CLI globally
```cmd
npm install -g @angular/cli
```

---

## 🎯 Quick Start (After Installation)

### Terminal 1 - Backend
```cmd
cd c:\Users\HPandey\Downloads\proj\backend
npm run dev
```

### Terminal 2 - Frontend
```cmd
cd c:\Users\HPandey\Downloads\proj\frontend
npm start
```

### Browser
Open: http://localhost:4200

### Login with Test Account
- **Email**: `student@bmsce.ac.in`
- **Password**: `password123`

---

## 📦 What Gets Installed

### Backend node_modules (~150MB)
- 50+ packages
- Main: express, pg, jsonwebtoken, bcryptjs

### Frontend node_modules (~500MB)
- 1000+ packages (Angular ecosystem)
- Main: @angular/core, typescript, rxjs

### Total Disk Space Required
- Node.js: ~100MB
- PostgreSQL: ~300MB
- Project Dependencies: ~650MB
- **Total: ~1.1GB**

---

## ✅ Installation Complete Checklist

Before running the application, verify:

- [ ] Node.js installed (v18+ or v20+)
- [ ] npm available (`npm --version` works)
- [ ] PostgreSQL installed (v14+ or v15+)
- [ ] PostgreSQL service running
- [ ] Database `college_doubt_solver` created
- [ ] Schema imported (tables exist)
- [ ] Backend dependencies installed (`backend/node_modules` folder exists)
- [ ] Backend .env file configured (with correct DB password)
- [ ] Frontend dependencies installed (`frontend/node_modules` folder exists)
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Frontend starts without errors (`npm start`)
- [ ] Can access http://localhost:4200
- [ ] Can login with test credentials

---

## 🆘 Still Having Issues?

1. **Check TROUBLESHOOTING.md** for detailed solutions
2. **Verify all prerequisites** are installed correctly
3. **Check PostgreSQL is running**: Windows Services → PostgreSQL
4. **Verify database exists**:
   ```cmd
   psql -U postgres -l
   ```
5. **Check logs** in terminal for specific error messages
6. **Restart everything**:
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Restart PostgreSQL service
   - Start backend again
   - Start frontend again

---

## 🎓 Ready to Use!

Once all checkboxes are ✅, your application is ready!

**Access**: http://localhost:4200

**Test Accounts**:
1. Student: `student@bmsce.ac.in` / `password123`
2. Faculty: `faculty@bmsce.ac.in` / `password123`
3. Admin: `admin@bmsce.ac.in` / `password123`

**Next Steps**:
- Explore the application
- Post a test doubt
- Try answering doubts
- Check notifications
- Test admin features (if admin)

Enjoy! 🎉
