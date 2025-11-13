# Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Database Issues

#### Issue: Cannot connect to PostgreSQL
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. **Check if PostgreSQL is running**
   ```bash
   # Windows
   services.msc  # Look for PostgreSQL service
   
   # Check manually
   pg_isready
   ```

2. **Start PostgreSQL service**
   ```bash
   # Windows
   net start postgresql-x64-14  # Adjust version number
   ```

3. **Verify credentials in .env**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=college_doubt_solver
   ```

#### Issue: Database does not exist
```
error: database "college_doubt_solver" does not exist
```

**Solution:**
```bash
psql -U postgres
CREATE DATABASE college_doubt_solver;
\q
psql -U postgres -d college_doubt_solver -f backend/database/schema.sql
```

#### Issue: Permission denied for database
```
ERROR: permission denied for database
```

**Solution:**
```sql
-- Login as postgres
psql -U postgres

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE college_doubt_solver TO your_username;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;
```

#### Issue: Schema file import errors
```
ERROR: relation "users" already exists
```

**Solution:**
```bash
# Drop and recreate database
psql -U postgres
DROP DATABASE college_doubt_solver;
CREATE DATABASE college_doubt_solver;
\q
psql -U postgres -d college_doubt_solver -f backend/database/schema.sql
```

---

### 🔴 Backend Issues

#### Issue: Port 5000 already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

#### Issue: Module not found errors
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

#### Issue: JWT token errors
```
JsonWebTokenError: invalid token
```

**Solutions:**
1. Check JWT_SECRET is set in .env
2. Clear localStorage in browser
3. Login again to get fresh token
4. Verify token format: `Bearer <token>`

#### Issue: File upload fails
```
MulterError: File too large
```

**Solutions:**
1. Check file size (max 5MB)
2. Verify file type (jpg, png, gif only)
3. Check MAX_FILE_SIZE in .env
4. Ensure uploads/ directory exists

#### Issue: CORS errors
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
```javascript
// In server.js, update CORS configuration
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

---

### 🔴 Frontend Issues

#### Issue: Cannot run ng serve
```
'ng' is not recognized as an internal or external command
```

**Solution:**
```bash
# Install Angular CLI globally
npm install -g @angular/cli

# Or use npx
npx ng serve
```

#### Issue: Node modules errors
```
Error: Cannot find module '@angular/core'
```

**Solution:**
```bash
cd frontend
rm -rf node_modules .angular
npm install
```

#### Issue: Compilation errors
```
error TS2307: Cannot find module
```

**Solutions:**
1. Delete node_modules and reinstall
2. Clear Angular cache: `rm -rf .angular`
3. Update tsconfig.json paths
4. Restart VS Code

#### Issue: Runtime errors in browser
```
NullInjectorError: No provider for HttpClient
```

**Solution:**
Make sure HttpClientModule is imported in app.module.ts:
```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    // ...
  ]
})
```

#### Issue: Routing not working
```
Cannot match any routes. URL Segment: 'doubts'
```

**Solution:**
1. Check route definitions in app-routing.module.ts
2. Verify component imports
3. Check base href in index.html: `<base href="/">`

---

### 🔴 Authentication Issues

#### Issue: Login fails with correct credentials
```
Error: Invalid email or password
```

**Solutions:**
1. Verify user exists in database:
   ```sql
   SELECT * FROM users WHERE email = 'your@email.com';
   ```
2. Reset password:
   ```sql
   UPDATE users 
   SET password_hash = '$2a$10$rXQvvXN5Y8Qu6L6YpZ8FzOqGQvK3gV9xYL8YpZ8FzOqGQvK3gV9xY'
   WHERE email = 'your@email.com';
   -- Password is now: password123
   ```

#### Issue: Email domain validation fails
```
Only bmsce.ac.in email addresses are allowed
```

**Solution:**
1. Use email ending with @bmsce.ac.in
2. Or update domain in:
   - backend/.env: `COLLEGE_EMAIL_DOMAIN=your-domain.com`
   - frontend/src/environments/environment.ts: `collegeEmailDomain`
   - database/schema.sql: Update CHECK constraint

#### Issue: Token expired
```
Error: Token expired
```

**Solution:**
1. Login again to get new token
2. Increase token expiry in authController.js:
   ```javascript
   jwt.sign(payload, secret, { expiresIn: '30d' })
   ```

---

### 🔴 API Issues

#### Issue: 404 Not Found on API calls
```
GET http://localhost:5000/api/doubts 404 (Not Found)
```

**Solutions:**
1. Verify backend is running
2. Check API URL in environment.ts
3. Verify route exists in backend/routes/
4. Check browser network tab for actual URL

#### Issue: 401 Unauthorized
```
Error: Access token required
```

**Solutions:**
1. Ensure you're logged in
2. Check token is in localStorage
3. Verify auth interceptor is working
4. Check Authorization header format

#### Issue: 500 Internal Server Error
```
POST http://localhost:5000/api/doubts 500
```

**Solutions:**
1. Check backend console for error details
2. Verify database is running
3. Check all required fields are sent
4. Review backend logs

---

### 🔴 Build & Deployment Issues

#### Issue: Production build fails
```
ERROR in ... Module not found
```

**Solution:**
```bash
# Clean and rebuild
cd frontend
rm -rf dist node_modules .angular
npm install
ng build --configuration production
```

#### Issue: Backend won't start in production
```
Error: Cannot find module
```

**Solution:**
```bash
cd backend
npm install --production
NODE_ENV=production node server.js
```

#### Issue: Environment variables not loading
```
undefined reading 'DB_HOST'
```

**Solutions:**
1. Verify .env file exists
2. Check .env file location (same directory as server.js)
3. Ensure dotenv is loaded early:
   ```javascript
   require('dotenv').config();
   ```

---

### 🔴 Performance Issues

#### Issue: Slow page loading
**Solutions:**
1. Enable pagination in API calls
2. Optimize images before upload
3. Use production build: `ng build --prod`
4. Enable gzip compression
5. Add database indexes

#### Issue: Database queries slow
**Solutions:**
```sql
-- Add missing indexes
CREATE INDEX idx_doubts_created ON doubts(created_at DESC);
CREATE INDEX idx_answers_doubt ON answers(doubt_id);

-- Analyze tables
ANALYZE doubts;
ANALYZE answers;
```

---

### 🔴 Development Issues

#### Issue: Hot reload not working
**Solution:**
```bash
# Frontend
ng serve --poll=2000

# Backend (use nodemon)
npm install -D nodemon
npm run dev
```

#### Issue: VS Code TypeScript errors
**Solution:**
1. Reload VS Code window: Ctrl+Shift+P → "Reload Window"
2. Update TypeScript: `npm install -g typescript`
3. Check tsconfig.json is valid

---

### 🔴 Data Issues

#### Issue: Sample data not loading
**Solution:**
```bash
# Reimport schema
psql -U postgres -d college_doubt_solver -f backend/database/schema.sql
```

#### Issue: Foreign key constraint errors
```
ERROR: insert or update on table violates foreign key constraint
```

**Solution:**
Ensure referenced records exist:
```sql
-- Check if subject exists before creating doubt
SELECT * FROM subjects WHERE subject_id = 1;
```

---

## Debugging Tips

### Enable Debug Mode

**Backend:**
```javascript
// In server.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}
```

**Frontend:**
```typescript
// In environment.ts
export const environment = {
  production: false,
  debug: true,  // Add this
  apiUrl: 'http://localhost:5000/api'
};
```

### Check Logs

**Backend logs:**
```bash
# If using PM2
pm2 logs

# If using nodemon/node
# Logs appear in console
```

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab
- Check Network tab for API calls

### Database Queries

```bash
# Enable query logging
# In postgresql.conf
log_statement = 'all'

# Restart PostgreSQL
# Windows: services.msc
```

---

## Getting Help

If issues persist:

1. **Check error messages carefully**
2. **Search in browser DevTools console**
3. **Check backend terminal for errors**
4. **Verify all services are running**
5. **Review recent code changes**
6. **Check documentation files**
7. **Try restarting all services**

---

## Clean Slate Reset

If all else fails, start fresh:

```bash
# 1. Stop all services
# 2. Drop database
psql -U postgres
DROP DATABASE college_doubt_solver;
CREATE DATABASE college_doubt_solver;
\q

# 3. Reinstall backend
cd backend
rm -rf node_modules package-lock.json
npm install

# 4. Reinstall frontend
cd ../frontend
rm -rf node_modules .angular package-lock.json
npm install

# 5. Import fresh schema
cd ../backend
psql -U postgres -d college_doubt_solver -f database/schema.sql

# 6. Create fresh .env
cp .env.example .env
# Edit .env with your values

# 7. Start services
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && ng serve
```

---

Remember: Most issues are configuration-related. Double-check your environment variables, database connection, and package installations!
