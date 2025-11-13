# 📋 Project Files Overview

## Complete File Structure

```
proj/
├── 📄 README.md                          # Main project documentation
├── 📄 SETUP.md                           # Quick setup guide
├── 📄 API_TESTING.md                     # API testing examples
├── 📄 DEPLOYMENT.md                      # Production deployment guide
├── 📄 FEATURES.md                        # Complete feature list
├── 📄 TROUBLESHOOTING.md                 # Common issues and solutions
├── 📄 COMMANDS.md                        # All available commands
├── 📄 PROJECT_SUMMARY.md                 # Project overview
├── 📄 package.json                       # Root package file
│
├── 📁 backend/                           # Node.js/Express Backend
│   ├── 📁 config/
│   │   ├── database.js                  # PostgreSQL connection pool
│   │   └── multer.js                    # File upload configuration
│   │
│   ├── 📁 controllers/
│   │   ├── authController.js            # Auth: signup, login, profile
│   │   ├── doubtController.js           # Doubts: CRUD, search
│   │   ├── answerController.js          # Answers: post, vote, accept
│   │   ├── subjectController.js         # Subject management
│   │   ├── notificationController.js    # Notification handling
│   │   └── adminController.js           # Admin operations
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js                      # JWT authentication & authorization
│   │   ├── validator.js                 # Input validation handler
│   │   └── errorHandler.js              # Global error handler
│   │
│   ├── 📁 models/
│   │   ├── User.js                      # User database operations
│   │   ├── Doubt.js                     # Doubt database operations
│   │   ├── Answer.js                    # Answer & voting operations
│   │   ├── Subject.js                   # Subject database operations
│   │   └── Notification.js              # Notification operations
│   │
│   ├── 📁 routes/
│   │   ├── auth.js                      # Auth routes
│   │   ├── doubts.js                    # Doubt routes
│   │   ├── answers.js                   # Answer routes
│   │   ├── subjects.js                  # Subject routes
│   │   ├── notifications.js             # Notification routes
│   │   └── admin.js                     # Admin routes
│   │
│   ├── 📁 database/
│   │   └── schema.sql                   # Complete DB schema + sample data
│   │
│   ├── 📁 uploads/                      # Image uploads directory
│   │
│   ├── 📄 .env.example                   # Environment variables template
│   ├── 📄 .gitignore                     # Git ignore rules
│   ├── 📄 package.json                   # Backend dependencies
│   └── 📄 server.js                      # Express server entry point
│
└── 📁 frontend/                          # Angular Frontend
    ├── 📁 src/
    │   ├── 📁 app/
    │   │   ├── 📁 components/
    │   │   │   ├── 📁 login/
    │   │   │   │   ├── login.component.ts
    │   │   │   │   ├── login.component.html
    │   │   │   │   └── login.component.css
    │   │   │   ├── 📁 signup/
    │   │   │   │   ├── signup.component.ts
    │   │   │   │   ├── signup.component.html
    │   │   │   │   └── signup.component.css
    │   │   │   ├── 📁 home/
    │   │   │   │   ├── home.component.ts
    │   │   │   │   ├── home.component.html
    │   │   │   │   └── home.component.css
    │   │   │   ├── 📁 doubt-list/
    │   │   │   │   └── doubt-list.component.ts
    │   │   │   ├── 📁 doubt-detail/
    │   │   │   │   └── doubt-detail.component.ts
    │   │   │   ├── 📁 doubt-form/
    │   │   │   │   └── doubt-form.component.ts
    │   │   │   └── 📁 notifications/
    │   │   │       └── notifications.component.ts
    │   │   │
    │   │   ├── 📁 guards/
    │   │   │   └── auth.guard.ts           # Route protection
    │   │   │
    │   │   ├── 📁 interceptors/
    │   │   │   └── auth.interceptor.ts     # HTTP request interceptor
    │   │   │
    │   │   ├── 📁 models/
    │   │   │   ├── auth.model.ts           # User & auth interfaces
    │   │   │   ├── doubt.model.ts          # Doubt interfaces
    │   │   │   ├── answer.model.ts         # Answer interfaces
    │   │   │   └── common.model.ts         # Common interfaces
    │   │   │
    │   │   ├── 📁 services/
    │   │   │   ├── auth.service.ts         # Authentication service
    │   │   │   ├── doubt.service.ts        # Doubt API service
    │   │   │   ├── answer.service.ts       # Answer API service
    │   │   │   └── common.service.ts       # Common utilities
    │   │   │
    │   │   ├── app.component.ts            # Root component
    │   │   ├── app.component.html          # Root template
    │   │   ├── app.component.css           # Root styles
    │   │   ├── app.module.ts               # Main module
    │   │   └── app-routing.module.ts       # Routing configuration
    │   │
    │   ├── 📁 environments/
    │   │   ├── environment.ts              # Development config
    │   │   └── environment.prod.ts         # Production config
    │   │
    │   ├── 📄 index.html                    # Main HTML file
    │   ├── 📄 main.ts                       # Application bootstrap
    │   └── 📄 styles.css                    # Global styles
    │
    ├── 📄 angular.json                      # Angular configuration
    ├── 📄 tsconfig.json                     # TypeScript configuration
    ├── 📄 tsconfig.app.json                 # App-specific TypeScript config
    ├── 📄 package.json                      # Frontend dependencies
    └── 📄 .gitignore                        # Git ignore rules
```

## File Count Summary

### Backend
- **Controllers**: 6 files
- **Models**: 5 files
- **Routes**: 6 files
- **Middleware**: 3 files
- **Configuration**: 2 files
- **Database**: 1 schema file
- **Total Backend**: ~23 files

### Frontend
- **Components**: 7 components (21 files with .ts/.html/.css)
- **Services**: 4 files
- **Models**: 4 files
- **Guards**: 1 file
- **Interceptors**: 1 file
- **Modules**: 2 files
- **Configuration**: 5 files
- **Total Frontend**: ~38 files

### Documentation
- **Main docs**: 8 markdown files
- **Configuration**: 2 package.json files

### Total Project Files: ~70+ files

## Key File Descriptions

### Backend Files

#### server.js
- Express application setup
- Middleware configuration
- Route registration
- Error handling
- Server initialization

#### config/database.js
- PostgreSQL connection pool
- Database configuration
- Connection management
- Error handling

#### controllers/authController.js
- User signup with email validation
- User login with JWT generation
- Profile management
- Token verification

#### controllers/doubtController.js
- Create, read, update, delete doubts
- Search functionality
- Filtering and pagination
- View count tracking

#### controllers/answerController.js
- Post and edit answers
- Voting system
- Accept answer functionality
- Answer management

#### models/User.js
- User CRUD operations
- User statistics
- Profile updates
- Active status management

#### models/Doubt.js
- Doubt CRUD operations
- Tag management
- Search implementation
- View tracking

#### models/Answer.js
- Answer CRUD operations
- Voting logic
- Accepted answer handling
- Notification creation

#### routes/*.js
- RESTful endpoint definitions
- Request validation
- Route protection
- Parameter handling

#### middleware/auth.js
- JWT token verification
- Role-based authorization
- Resource ownership checks
- Authentication logic

#### database/schema.sql
- Complete database schema
- Table definitions
- Indexes for performance
- Sample data
- Constraints and triggers

### Frontend Files

#### app.component.ts/html/css
- Main application shell
- Navigation bar
- Router outlet
- Global layout

#### components/login
- Login form
- Email/password validation
- Token storage
- Redirect logic

#### components/signup
- Registration form
- Email domain validation
- Role selection
- Error handling

#### components/home
- Dashboard view
- Recent doubts display
- Quick actions
- Statistics

#### services/auth.service.ts
- Login/signup API calls
- Token management
- Current user state
- Email validation

#### services/doubt.service.ts
- Doubt CRUD API calls
- Search functionality
- Filter handling
- File upload

#### guards/auth.guard.ts
- Route protection
- Role-based access
- Redirect logic
- Authentication check

#### interceptors/auth.interceptor.ts
- Automatic token attachment
- Error handling
- Unauthorized redirect
- HTTP request modification

### Documentation Files

#### README.md (Main)
- Complete project overview
- Installation instructions
- Feature list
- API documentation
- Troubleshooting

#### SETUP.md
- Quick start guide
- Step-by-step installation
- Default credentials
- Verification steps

#### API_TESTING.md
- API endpoint examples
- cURL commands
- Request/response formats
- Testing workflow

#### DEPLOYMENT.md
- Production deployment
- Server configuration
- Security hardening
- Scaling strategies

#### FEATURES.md
- Complete feature list
- User capabilities
- Admin features
- Security features

#### TROUBLESHOOTING.md
- Common issues
- Solutions
- Debug tips
- Reset procedures

#### COMMANDS.md
- All npm commands
- Database commands
- Git commands
- Utility scripts

## Technology Stack per File

### Backend Technologies
```
server.js          → Express, CORS, dotenv
config/database.js → pg (PostgreSQL client)
config/multer.js   → multer (file upload)
controllers/*      → Express, models
models/*           → pg (PostgreSQL)
middleware/auth.js → jsonwebtoken, bcryptjs
routes/*           → express-validator
```

### Frontend Technologies
```
*.component.ts     → Angular, RxJS
services/*         → HttpClient, RxJS
guards/*           → Router, Observable
interceptors/*     → HttpClient, RxJS
models/*           → TypeScript interfaces
```

## Lines of Code Estimate

- **Backend**: ~3,500 lines
- **Frontend**: ~2,500 lines
- **Database Schema**: ~300 lines
- **Documentation**: ~2,000 lines
- **Total**: ~8,300 lines

## File Relationships

```
server.js
  ↓
routes/* → controllers/* → models/* → database (PostgreSQL)
  ↓           ↓
middleware/  config/

Angular App
  ↓
components/* → services/* → HttpClient → Backend API
  ↓              ↓
guards/      models/
  ↓
interceptors/
```

## Important Configuration Files

1. **backend/.env** - Environment variables
2. **backend/package.json** - Backend dependencies
3. **frontend/package.json** - Frontend dependencies
4. **frontend/angular.json** - Angular CLI config
5. **frontend/tsconfig.json** - TypeScript config
6. **frontend/environment.ts** - Environment config

## Generated/Build Files (Not in Repository)

```
backend/node_modules/
backend/uploads/
frontend/node_modules/
frontend/dist/
frontend/.angular/
*.log
```

---

This comprehensive file structure enables:
- ✅ **Scalability**: Modular architecture
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Testability**: Isolated components
- ✅ **Documentation**: Extensive guides
- ✅ **Security**: Layered protection
- ✅ **Performance**: Optimized queries
