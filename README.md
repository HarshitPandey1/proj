# College Doubt Solver Platform

A full-stack web application for BMS College students and faculty to ask questions, share knowledge, and help each other with academic doubts. Built using Angular, Node.js, Express.js, and PostgreSQL.

## 🎯 Features

### User Authentication
- ✅ Signup/Login with college email domain validation (@bmsce.ac.in only)
- ✅ JWT-based session management
- ✅ Role-based access control (Student, Faculty, Admin)

### Doubt Management
- ✅ Post doubts with title, description, tags, and optional image
- ✅ Categorize doubts by subject/department
- ✅ View, edit, and delete your own doubts
- ✅ Mark doubts as resolved
- ✅ Search and filter doubts

### Answer System
- ✅ Post answers to doubts
- ✅ Upvote/downvote answers
- ✅ Accept best answer (by doubt owner)
- ✅ Edit and delete your own answers

### Notifications
- ✅ Get notified when someone answers your doubt
- ✅ Real-time notification count
- ✅ Mark notifications as read

### Admin Panel
- ✅ View all users
- ✅ Moderate content (delete doubts/answers)
- ✅ Manage subjects and tags
- ✅ Platform statistics and analytics

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 17
- **Styling**: Custom CSS
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Reactive Forms

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Validation**: express-validator

### Database
- **Database**: PostgreSQL
- **Client**: node-postgres (pg)

## 📁 Project Structure

```
proj/
├── backend/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   └── multer.js            # File upload configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── doubtController.js   # Doubt CRUD operations
│   │   ├── answerController.js  # Answer management
│   │   ├── subjectController.js # Subject management
│   │   ├── notificationController.js
│   │   └── adminController.js   # Admin operations
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── validator.js         # Input validation
│   │   └── errorHandler.js      # Global error handling
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Doubt.js             # Doubt model
│   │   ├── Answer.js            # Answer model
│   │   ├── Subject.js           # Subject model
│   │   └── Notification.js      # Notification model
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── doubts.js            # Doubt routes
│   │   ├── answers.js           # Answer routes
│   │   ├── subjects.js          # Subject routes
│   │   ├── notifications.js     # Notification routes
│   │   └── admin.js             # Admin routes
│   ├── database/
│   │   └── schema.sql           # Database schema with sample data
│   ├── uploads/                 # Uploaded images
│   ├── .env.example             # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Entry point
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── login/
    │   │   │   ├── signup/
    │   │   │   ├── home/
    │   │   │   ├── doubt-list/
    │   │   │   ├── doubt-detail/
    │   │   │   ├── doubt-form/
    │   │   │   └── notifications/
    │   │   ├── guards/
    │   │   │   └── auth.guard.ts
    │   │   ├── interceptors/
    │   │   │   └── auth.interceptor.ts
    │   │   ├── models/
    │   │   │   ├── auth.model.ts
    │   │   │   ├── doubt.model.ts
    │   │   │   ├── answer.model.ts
    │   │   │   └── common.model.ts
    │   │   ├── services/
    │   │   │   ├── auth.service.ts
    │   │   │   ├── doubt.service.ts
    │   │   │   ├── answer.service.ts
    │   │   │   └── common.service.ts
    │   │   ├── app.component.ts
    │   │   ├── app.component.html
    │   │   ├── app.component.css
    │   │   ├── app.module.ts
    │   │   └── app-routing.module.ts
    │   ├── environments/
    │   │   ├── environment.ts
    │   │   └── environment.prod.ts
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.css
    ├── angular.json
    ├── tsconfig.json
    ├── tsconfig.app.json
    └── package.json
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Database Setup

1. **Install PostgreSQL** (if not already installed)

2. **Create Database**
   ```bash
   # Login to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE college_doubt_solver;

   # Exit psql
   \q
   ```

3. **Run Database Schema**
   ```bash
   # Navigate to backend directory
   cd backend

   # Run the schema file
   psql -U postgres -d college_doubt_solver -f database/schema.sql
   ```

   This will create all tables and insert sample data.

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example env file
   copy .env.example .env

   # Edit .env file with your configuration
   # Update the following:
   # - DB_PASSWORD: Your PostgreSQL password
   # - JWT_SECRET: Generate a secure random string
   ```

4. **Start the backend server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # OR production mode
   npm start
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update environment configuration** (if needed)
   - Edit `src/environments/environment.ts`
   - Update `apiUrl` if backend is running on a different port

4. **Start the frontend server**
   ```bash
   ng serve
   ```

   Frontend will run on `http://localhost:4200`

## 🔑 Default Credentials

After running the schema.sql, you'll have these sample accounts:

### Student Account
- **Email**: raj.kumar@bmsce.ac.in
- **Password**: password123

### Faculty Account
- **Email**: anil.singh@bmsce.ac.in
- **Password**: password123

### Admin Account
- **Email**: admin@bmsce.ac.in
- **Password**: password123

**⚠️ IMPORTANT**: Change these passwords in production!

## 📝 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/signup | Register new user | No |
| POST | /api/auth/login | User login | No |
| GET | /api/auth/profile | Get user profile | Yes |
| PUT | /api/auth/profile | Update profile | Yes |
| GET | /api/auth/verify | Verify token | Yes |

### Doubt Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/doubts | Get all doubts (with filters) | No |
| GET | /api/doubts/:id | Get doubt by ID | No |
| POST | /api/doubts | Create new doubt | Yes |
| PUT | /api/doubts/:id | Update doubt | Yes (Owner) |
| DELETE | /api/doubts/:id | Delete doubt | Yes (Owner/Admin) |
| GET | /api/doubts/search/:query | Search doubts | No |
| GET | /api/doubts/my-doubts | Get user's doubts | Yes |

### Answer Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/answers/doubt/:doubtId | Get answers for doubt | No |
| POST | /api/answers | Post answer | Yes |
| PUT | /api/answers/:id | Update answer | Yes (Owner) |
| DELETE | /api/answers/:id | Delete answer | Yes (Owner/Admin) |
| POST | /api/answers/:id/accept | Accept answer | Yes (Doubt Owner) |
| POST | /api/answers/:id/vote | Vote on answer | Yes |

### Subject Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/subjects | Get all subjects | No |
| GET | /api/subjects/:id | Get subject by ID | No |
| POST | /api/subjects | Create subject | Yes (Admin) |
| PUT | /api/subjects/:id | Update subject | Yes (Admin) |
| DELETE | /api/subjects/:id | Delete subject | Yes (Admin) |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/notifications | Get notifications | Yes |
| GET | /api/notifications/unread-count | Get unread count | Yes |
| PUT | /api/notifications/:id/read | Mark as read | Yes |
| PUT | /api/notifications/read-all | Mark all as read | Yes |
| DELETE | /api/notifications/:id | Delete notification | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/admin/users | Get all users | Yes (Admin) |
| PUT | /api/admin/users/:id/toggle-active | Toggle user status | Yes (Admin) |
| GET | /api/admin/stats | Get platform stats | Yes (Admin) |
| GET | /api/admin/recent-activity | Get recent activity | Yes (Admin) |
| DELETE | /api/admin/doubts/:id | Delete any doubt | Yes (Admin) |
| DELETE | /api/admin/answers/:id | Delete any answer | Yes (Admin) |

## 🔒 Security Features

1. **Email Domain Validation**: Only @bmsce.ac.in emails allowed
2. **JWT Authentication**: Secure token-based authentication
3. **Password Hashing**: bcrypt with salt rounds
4. **Role-Based Access Control**: Different permissions for students, faculty, and admin
5. **Input Validation**: express-validator for all inputs
6. **SQL Injection Prevention**: Parameterized queries
7. **CORS Configuration**: Controlled cross-origin requests
8. **File Upload Security**: Type and size validation

## 🧪 Testing the Application

1. **Start both servers** (backend and frontend)

2. **Create an account**
   - Go to `http://localhost:4200/signup`
   - Use email ending with @bmsce.ac.in
   - Fill in the details and signup

3. **Post a doubt**
   - Click "Post Doubt" in the navigation
   - Fill in title, description, select subject
   - Add tags (optional)
   - Upload image (optional)
   - Submit

4. **Answer a doubt**
   - Click on any doubt
   - Scroll to the answer section
   - Post your answer

5. **Vote on answers**
   - Upvote or downvote helpful/unhelpful answers

6. **Test admin features**
   - Login with admin account
   - Access admin panel
   - View statistics and manage content

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Check PostgreSQL status (Windows)
services.msc  # Look for PostgreSQL service

# Verify database exists
psql -U postgres -l
```

### Backend Port Already in Use
```bash
# Find process using port 5000 (Windows)
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### Frontend Build Issues
```bash
# Clear node_modules and reinstall
cd frontend
rmdir /s /q node_modules
npm install

# Clear Angular cache
rmdir /s /q .angular
```

## 📚 Database Schema Overview

### Main Tables
- **users**: User accounts with roles
- **subjects**: Academic subjects
- **tags**: Question tags
- **doubts**: Questions posted by users
- **answers**: Responses to doubts
- **votes**: Upvotes/downvotes on answers
- **notifications**: User notifications
- **doubt_tags**: Many-to-many relationship between doubts and tags

## 🎨 Customization

### Change College Email Domain
1. Update `COLLEGE_EMAIL_DOMAIN` in `backend/.env`
2. Update `collegeEmailDomain` in `frontend/src/environments/environment.ts`
3. Update email constraint in database schema

### Add New Subjects
Use the admin panel or run SQL:
```sql
INSERT INTO subjects (subject_name, subject_code, department, description)
VALUES ('Your Subject', 'SUB101', 'Department', 'Description');
```

### Customize Styling
Edit `frontend/src/styles.css` for global styles or component-specific CSS files.

## 📄 License

MIT License - Feel free to use this project for educational purposes.

## 👥 Contributors

Developed as a college project for BMS College of Engineering.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for frontend errors
4. Check backend logs for server errors

---

**Happy Learning! 🎓**
