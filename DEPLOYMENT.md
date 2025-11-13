# Production Deployment Guide

## Pre-Deployment Checklist

### Security
- [ ] Change all default passwords
- [ ] Generate strong JWT secret
- [ ] Update CORS configuration
- [ ] Enable HTTPS
- [ ] Set secure environment variables
- [ ] Remove/disable development routes
- [ ] Enable rate limiting

### Database
- [ ] Backup database
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Optimize indexes
- [ ] Set up monitoring

### Application
- [ ] Build frontend for production
- [ ] Configure production environment
- [ ] Set up logging
- [ ] Configure error tracking
- [ ] Optimize images and assets

## Environment Variables (Production)

### Backend (.env)
```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=strong-password-here
DB_NAME=college_doubt_solver

# JWT
JWT_SECRET=very-strong-random-secret-key-change-this

# Email Domain
COLLEGE_EMAIL_DOMAIN=bmsce.ac.in

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/

# CORS
ALLOWED_ORIGINS=https://your-domain.com
```

### Frontend (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api',
  collegeEmailDomain: 'bmsce.ac.in'
};
```

## Deployment Options

### Option 1: Traditional Server (VPS)

#### Requirements
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 16+
- PostgreSQL 12+
- Nginx (reverse proxy)
- PM2 (process manager)

#### Steps

1. **Setup Server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2
sudo npm install -g pm2
```

2. **Setup PostgreSQL**
```bash
sudo -u postgres psql
CREATE DATABASE college_doubt_solver;
CREATE USER dbuser WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE college_doubt_solver TO dbuser;
\q
```

3. **Deploy Backend**
```bash
# Clone repository
git clone your-repo-url
cd proj/backend

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Run database schema
psql -U dbuser -d college_doubt_solver -f database/schema.sql

# Start with PM2
pm2 start server.js --name college-doubt-api
pm2 save
pm2 startup
```

4. **Build & Deploy Frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Build for production
ng build --configuration production

# Copy build to web root
sudo cp -r dist/college-doubt-solver/* /var/www/html/
```

5. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/college-doubt-solver
```

```nginx
# Frontend
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /uploads {
        alias /path/to/backend/uploads;
    }
}

# Backend API
server {
    listen 80;
    server_name api.your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/college-doubt-solver /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

6. **Setup SSL (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d api.your-domain.com
```

### Option 2: Docker Deployment

#### Docker Compose
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: college_doubt_solver
      POSTGRES_USER: dbuser
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: dbuser
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: college_doubt_solver
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Option 3: Cloud Platforms

#### Heroku
```bash
# Backend
heroku create college-doubt-api
heroku addons:create heroku-postgresql:hobby-dev
git subtree push --prefix backend heroku main

# Frontend (can use Netlify/Vercel)
ng build --configuration production
# Deploy dist folder
```

#### AWS (EC2 + RDS)
- Launch EC2 instance
- Create RDS PostgreSQL database
- Follow VPS deployment steps
- Configure security groups
- Set up load balancer (optional)

#### Google Cloud Platform
- Use Cloud Run for containers
- Use Cloud SQL for PostgreSQL
- Set up Cloud Storage for file uploads

## Post-Deployment

### Monitoring
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs college-doubt-api

# Setup PM2 monitoring service (optional)
pm2 install pm2-logrotate
```

### Backup Strategy
```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U dbuser college_doubt_solver > backup_$DATE.sql
# Upload to cloud storage
```

### Maintenance
- Regular security updates
- Database optimization
- Log rotation
- SSL certificate renewal
- Performance monitoring

## Performance Optimization

### Backend
```javascript
// Add to server.js
const compression = require('compression');
app.use(compression());

// Enable caching
const helmet = require('helmet');
app.use(helmet());
```

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images

### Database
```sql
-- Create indexes
CREATE INDEX idx_doubts_search ON doubts USING gin(to_tsvector('english', title || ' ' || description));

-- Analyze and vacuum
VACUUM ANALYZE;
```

## Troubleshooting Production Issues

### Backend not responding
```bash
pm2 restart college-doubt-api
pm2 logs --err
```

### Database connection issues
```bash
sudo -u postgres psql
\l  # List databases
\du # List users
```

### Nginx issues
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

## Security Hardening

1. **Firewall**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **Fail2ban** (prevent brute force)
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

3. **Regular Updates**
```bash
sudo apt update && sudo apt upgrade -y
```

## Scaling Considerations

- Use load balancer for multiple backend instances
- Implement Redis for session management
- Use CDN for static content
- Database read replicas
- Horizontal scaling with containers

## Support

For production issues:
1. Check application logs
2. Check database logs
3. Verify environment variables
4. Check network connectivity
5. Review recent changes

---

**Remember**: Always test in a staging environment before deploying to production!
