# Quick Setup Guide

## Step-by-Step Installation

### 1. Database Setup (5 minutes)

```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE college_doubt_solver;

# Exit
\q

# Import schema
cd backend
psql -U postgres -d college_doubt_solver -f database/schema.sql
```

### 2. Backend Setup (3 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env and update:
# - DB_PASSWORD=your_postgres_password
# - JWT_SECRET=any_random_long_string

# Start backend
npm run dev
```

Backend will run on http://localhost:5000

### 3. Frontend Setup (3 minutes)

```bash
# Open new terminal
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
ng serve
```

Frontend will run on http://localhost:4200

### 4. Test the Application

1. Open browser: http://localhost:4200
2. Click "Sign up"
3. Use email: yourstudent@bmsce.ac.in
4. Create account and start using!

## Default Test Accounts

| Email | Password | Role |
|-------|----------|------|
| raj.kumar@bmsce.ac.in | password123 | Student |
| anil.singh@bmsce.ac.in | password123 | Faculty |
| admin@bmsce.ac.in | password123 | Admin |

## Common Commands

### Backend
```bash
npm start          # Start in production mode
npm run dev        # Start in development mode with auto-reload
```

### Frontend
```bash
ng serve           # Start development server
ng build           # Build for production
```

## Verify Installation

1. Backend health check: http://localhost:5000/api/health
2. Frontend: http://localhost:4200
3. Check browser console for errors
4. Check terminal for backend logs

## Next Steps

1. ✅ Post your first doubt
2. ✅ Answer someone's question
3. ✅ Upvote helpful answers
4. ✅ Explore admin panel (with admin account)
5. ✅ Check notifications

## Need Help?

Check the main README.md file for:
- Detailed API documentation
- Troubleshooting guide
- Full feature list
- Customization options
