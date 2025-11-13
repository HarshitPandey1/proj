# API Testing Guide

Use this guide to test the backend API using tools like Postman, curl, or any HTTP client.

## Base URL
```
http://localhost:5000/api
```

## 1. Authentication

### Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "fullName": "Test Student",
  "email": "test.student@bmsce.ac.in",
  "password": "password123",
  "role": "student",
  "department": "Computer Science",
  "yearOfStudy": 3
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "fullName": "Test Student",
    "email": "test.student@bmsce.ac.in",
    "role": "student"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "test.student@bmsce.ac.in",
  "password": "password123"
}
```

## 2. Doubts

### Get All Doubts
```http
GET /doubts?limit=10&offset=0
```

### Get Doubts with Filters
```http
GET /doubts?subjectId=1&isResolved=false&limit=20
```

### Search Doubts
```http
GET /doubts/search/binary%20search
```

### Get Doubt by ID
```http
GET /doubts/1
```

### Create Doubt
```http
POST /doubts
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

title: How to implement Binary Search?
description: I need help understanding the algorithm
subjectId: 1
tags: algorithms,homework-help
image: [optional file]
```

### Update Doubt
```http
PUT /doubts/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Updated Title",
  "isResolved": true
}
```

### Delete Doubt
```http
DELETE /doubts/1
Authorization: Bearer YOUR_TOKEN
```

## 3. Answers

### Get Answers for Doubt
```http
GET /answers/doubt/1
```

### Post Answer
```http
POST /answers
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "doubtId": 1,
  "answerText": "Here's the solution to your problem..."
}
```

### Update Answer
```http
PUT /answers/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "answerText": "Updated answer text"
}
```

### Accept Answer
```http
POST /answers/1/accept
Authorization: Bearer YOUR_TOKEN
```

### Vote on Answer
```http
POST /answers/1/vote
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "voteType": "upvote"
}
```

## 4. Subjects

### Get All Subjects
```http
GET /subjects
```

### Create Subject (Admin Only)
```http
POST /subjects
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "subjectName": "Artificial Intelligence",
  "subjectCode": "CS401",
  "department": "Computer Science",
  "description": "AI concepts and applications"
}
```

## 5. Notifications

### Get Notifications
```http
GET /notifications?limit=20
Authorization: Bearer YOUR_TOKEN
```

### Get Unread Count
```http
GET /notifications/unread-count
Authorization: Bearer YOUR_TOKEN
```

### Mark as Read
```http
PUT /notifications/1/read
Authorization: Bearer YOUR_TOKEN
```

### Mark All as Read
```http
PUT /notifications/read-all
Authorization: Bearer YOUR_TOKEN
```

## 6. Admin Endpoints

### Get All Users
```http
GET /admin/users
Authorization: Bearer ADMIN_TOKEN
```

### Toggle User Active Status
```http
PUT /admin/users/2/toggle-active
Authorization: Bearer ADMIN_TOKEN
```

### Get Platform Statistics
```http
GET /admin/stats
Authorization: Bearer ADMIN_TOKEN
```

### Get Recent Activity
```http
GET /admin/recent-activity?limit=20
Authorization: Bearer ADMIN_TOKEN
```

## cURL Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"raj.kumar@bmsce.ac.in\",\"password\":\"password123\"}"
```

### Create Doubt (with token)
```bash
curl -X POST http://localhost:5000/api/doubts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Test Doubt\",\"description\":\"Test description\",\"subjectId\":1}"
```

### Get All Doubts
```bash
curl http://localhost:5000/api/doubts
```

## Testing Workflow

1. **Signup** → Get token
2. **Create Subject** (admin)
3. **Post Doubt** with subject
4. **Add Tags** to doubt
5. **Post Answer** to doubt
6. **Vote** on answer
7. **Accept Answer** (doubt owner)
8. **Check Notifications**
9. **Search Doubts**
10. **View Statistics** (admin)

## Response Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

## Error Response Format

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Tips

1. Save your token after login
2. Include token in Authorization header for protected routes
3. Use Postman collections to organize tests
4. Check response status codes
5. Verify database changes after each operation
