# StudySpark Backend API Specification

## 🎯 Overview

This document outlines the complete backend API requirements for StudySpark, matching the frontend implementation.

**Base URL:** `https://api.studyspark.dev/api/v1`

**WebSocket URL:** `wss://api.studyspark.dev` (for live quiz)

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Gamified Quiz System](#gamified-quiz-system)
3. [AI Study Assistant](#ai-study-assistant)
4. [Personal Quiz & CBT](#personal-quiz--cbt)
5. [Performance Analytics](#performance-analytics)
6. [Admin Notifications](#admin-notifications)
7. [Student Matching (Secondary)](#student-matching-secondary)
8. [Talent Pool (Secondary)](#talent-pool-secondary)

---

## 🔐 Authentication

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "securepassword",
  "name": "John Doe",
  "school": "University of Lagos",
  "course": "Computer Science",
  "level": "200"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "student@university.edu",
    "name": "John Doe",
    "school": "University of Lagos",
    "course": "Computer Science",
    "level": "200",
    "role": "student",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation:**
- Email must be valid and unique
- Password minimum 8 characters
- School, course, level required

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "securepassword"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "student@university.edu",
    "name": "John Doe",
    "school": "University of Lagos",
    "course": "Computer Science",
    "level": "200",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

## 🎮 Gamified Quiz System

### Admin Endpoints

#### 1. Generate Quiz (AI-Powered)

**Endpoint:** `POST /admin/quiz/generate`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "topic": "Data Structures and Algorithms",
  "course": "Computer Science",
  "difficulty": "medium",
  "numQuestions": 10,
  "questionTypes": ["objective"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "questions": [
    {
      "id": "q1",
      "text": "What is the time complexity of binary search?",
      "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      "correctAnswer": 1,
      "explanation": "Binary search divides the search space in half each time."
    }
  ]
}
```

---

#### 2. Create Live Quiz

**Endpoint:** `POST /admin/quiz/create`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "title": "Week 5 Live Quiz",
  "course": "Computer Science",
  "level": "200",
  "questions": [
    {
      "text": "What is a linked list?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ],
  "duration": 900,
  "scheduledAt": "2025-01-15T14:00:00Z"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "quiz": {
    "id": "quiz_123",
    "code": "ABC123",
    "title": "Week 5 Live Quiz",
    "status": "scheduled",
    "participants": 0,
    "scheduledAt": "2025-01-15T14:00:00Z",
    "duration": 900
  }
}
```

**Quiz Code:** 6-character alphanumeric (e.g., `ABC123`)

---

#### 3. Get Quiz Participants

**Endpoint:** `GET /admin/quiz/{quizId}/participants`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "quizId": "quiz_123",
  "participants": 23,
  "users": [
    {
      "id": "user_123",
      "name": "John Doe",
      "joinedAt": "2025-01-15T13:55:00Z"
    }
  ]
}
```

---

#### 4. Start Quiz

**Endpoint:** `POST /admin/quiz/{quizId}/start`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "quiz": {
    "id": "quiz_123",
    "status": "active",
    "startedAt": "2025-01-15T14:00:00Z",
    "endsAt": "2025-01-15T14:15:00Z"
  }
}
```

**WebSocket Event:** Broadcast `quiz:started` to all participants

---

#### 5. End Quiz

**Endpoint:** `POST /admin/quiz/{quizId}/end`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "quiz": {
    "id": "quiz_123",
    "status": "completed",
    "endedAt": "2025-01-15T14:15:00Z",
    "totalParticipants": 23
  }
}
```

**WebSocket Event:** Broadcast `quiz:ended` to all participants

---

### Student Endpoints

#### 6. Join Quiz with Code

**Endpoint:** `POST /quiz/join`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "code": "ABC123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "quiz": {
    "id": "quiz_123",
    "title": "Week 5 Live Quiz",
    "status": "scheduled",
    "participants": 24,
    "scheduledAt": "2025-01-15T14:00:00Z",
    "duration": 900
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Quiz not found with code ABC123"
}
```

---

#### 7. Get Quiz Questions

**Endpoint:** `GET /quiz/{quizId}/questions`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "questions": [
    {
      "id": "q1",
      "text": "What is a linked list?",
      "options": ["Option A", "Option B", "Option C", "Option D"]
    }
  ]
}
```

**Note:** Correct answers NOT sent to client during quiz

---

#### 8. Submit Answer

**Endpoint:** `POST /quiz/{quizId}/answer`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "questionId": "q1",
  "selectedAnswer": 2
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "isCorrect": true,
  "score": 100
}
```

**WebSocket Event:** Broadcast leaderboard update

---

#### 9. Get Leaderboard

**Endpoint:** `GET /quiz/{quizId}/leaderboard`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "leaderboard": [
    {
      "id": "user_123",
      "name": "John Doe",
      "score": 850,
      "correctAnswers": 8,
      "totalQuestions": 10,
      "timeTaken": 420,
      "rank": 1
    }
  ]
}
```

---

## 🧠 AI Study Assistant

### 1. Chat Query

**Endpoint:** `POST /study/query`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "message": "Explain binary search algorithm",
  "topic": "Data Structures",
  "course": "Computer Science",
  "context": {
    "previousMessages": [
      {"role": "user", "content": "What is an algorithm?"},
      {"role": "assistant", "content": "An algorithm is..."}
    ]
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "response": "Binary search is an efficient algorithm for finding an item...",
  "sources": [
    {
      "type": "course_material",
      "title": "Week 3: Searching Algorithms",
      "url": "/materials/week3"
    }
  ],
  "relatedTopics": ["Linear Search", "Time Complexity", "Divide and Conquer"]
}
```

---

### 2. Get YouTube Recommendations

**Endpoint:** `GET /study/recommendations`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
topic=binary+search
course=computer+science
```

**Response:** `200 OK`
```json
{
  "success": true,
  "recommendations": [
    {
      "type": "youtube",
      "title": "Binary Search Explained",
      "url": "https://youtube.com/watch?v=...",
      "thumbnail": "https://img.youtube.com/...",
      "duration": "10:30",
      "channel": "CS Explained"
    }
  ]
}
```

---

### 3. Generate Summary

**Endpoint:** `POST /study/summarize`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "topic": "Data Structures - Week 3",
  "course": "Computer Science"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "summary": "Week 3 covered searching algorithms including...",
  "keyPoints": [
    "Binary search has O(log n) complexity",
    "Linear search is simpler but slower",
    "Arrays must be sorted for binary search"
  ]
}
```

---

### 4. Generate Flashcards

**Endpoint:** `POST /study/flashcards`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "topic": "Binary Search",
  "course": "Computer Science",
  "count": 5
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "flashcards": [
    {
      "id": "fc1",
      "front": "What is the time complexity of binary search?",
      "back": "O(log n)"
    }
  ]
}
```

---

## 📝 Personal Quiz & CBT

### 1. Generate Personal Quiz

**Endpoint:** `POST /quiz/personal/generate`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "topic": "Data Structures",
  "course": "Computer Science",
  "difficulty": "medium",
  "numQuestions": 15,
  "type": "objective",
  "timeLimit": 1800
}
```

**Note:** `type` can be:
- `"objective"` - Multiple choice (PRIMARY - focus here first)
- `"essay"` - Type-in answers (SECONDARY)

**Response:** `201 Created`
```json
{
  "success": true,
  "quiz": {
    "id": "personal_quiz_123",
    "title": "Data Structures Practice",
    "type": "objective",
    "numQuestions": 15,
    "timeLimit": 1800,
    "questions": [
      {
        "id": "q1",
        "text": "What is a stack?",
        "options": ["LIFO", "FIFO", "Random", "Sorted"],
        "correctAnswer": 0
      }
    ]
  }
}
```

---

### 2. Submit Personal Quiz

**Endpoint:** `POST /quiz/personal/{quizId}/submit`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": 0
    },
    {
      "questionId": "q2",
      "selectedAnswer": 2
    }
  ],
  "timeTaken": 720
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "score": 87,
  "correctAnswers": 13,
  "totalQuestions": 15,
  "timeTaken": 720,
  "results": [
    {
      "questionId": "q1",
      "isCorrect": true,
      "correctAnswer": 0,
      "selectedAnswer": 0
    }
  ]
}
```

---

## 📊 Performance Analytics

### 1. Get User Performance

**Endpoint:** `GET /analytics/performance`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
timeRange=7d // or 30d, 90d, all
course=computer+science
```

**Response:** `200 OK`
```json
{
  "success": true,
  "overall": {
    "averageScore": 85,
    "quizzesTaken": 12,
    "studyHours": 24,
    "strongTopics": ["Arrays", "Linked Lists"],
    "weakTopics": ["Trees", "Graphs"]
  },
  "byWeek": [
    {
      "week": "Week 1",
      "score": 85,
      "classAverage": 75
    }
  ],
  "progressOverTime": [
    {
      "date": "2025-01-01",
      "score": 70
    },
    {
      "date": "2025-01-08",
      "score": 85
    }
  ],
  "skillsBreakdown": {
    "theory": 90,
    "application": 85,
    "problemSolving": 88
  }
}
```

---

### 2. Get AI Recommendations

**Endpoint:** `GET /analytics/recommendations`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "recommendations": [
    {
      "type": "topic_focus",
      "message": "Focus on Trees - your score is 15% below average",
      "priority": "high",
      "resources": [
        {
          "type": "quiz",
          "title": "Trees Practice Quiz",
          "url": "/quiz/trees-practice"
        }
      ]
    },
    {
      "type": "strength",
      "message": "Excellent work on Arrays! Keep it up.",
      "priority": "low"
    }
  ]
}
```

---

## 🔔 Admin Notifications (SECONDARY)

### 1. Create Notification/Event

**Endpoint:** `POST /admin/notifications`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "type": "live_class",
  "title": "Emergency Class: Data Structures",
  "description": "Join us for an important session on Trees",
  "course": "Computer Science",
  "level": "200",
  "scheduledAt": "2025-01-15T16:00:00Z",
  "channels": ["email", "whatsapp"],
  "priority": "high"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "notification": {
    "id": "notif_123",
    "subscriptionLink": "https://studyspark.dev/subscribe/cs200",
    "recipientCount": 45,
    "scheduledAt": "2025-01-15T16:00:00Z"
  }
}
```

---

### 2. Get Subscription Link

**Endpoint:** `GET /admin/notifications/subscription-link`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Query Parameters:**
```
course=computer+science
level=200
```

**Response:** `200 OK`
```json
{
  "success": true,
  "link": "https://studyspark.dev/subscribe/cs200",
  "subscribers": 45
}
```

---

### 3. Subscribe to Notifications

**Endpoint:** `POST /notifications/subscribe`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "course": "Computer Science",
  "level": "200",
  "channels": ["email", "whatsapp"],
  "whatsappNumber": "+2348012345678"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123",
    "channels": ["email", "whatsapp"],
    "status": "active"
  }
}
```

---

## 👥 Student Matching (SECONDARY)

### 1. Find Study Partners

**Endpoint:** `GET /matching/partners`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
course=computer+science
level=200
limit=5
```

**Response:** `200 OK`
```json
{
  "success": true,
  "matches": [
    {
      "id": "user_456",
      "name": "Jane Smith",
      "course": "Computer Science",
      "level": "200",
      "school": "University of Lagos",
      "matchScore": 95,
      "commonTopics": ["Data Structures", "Algorithms"],
      "availableToConnect": true
    }
  ]
}
```

---

### 2. Send Connection Request

**Endpoint:** `POST /matching/connect`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "userId": "user_456",
  "message": "Hi! Would you like to study together?"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "connection": {
    "id": "conn_123",
    "status": "pending"
  }
}
```

---

## 💼 Talent Pool (SECONDARY)

### 1. Create Profile

**Endpoint:** `POST /talent/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "skills": ["Backend Development", "Node.js", "Python"],
  "bio": "200 Level CS student interested in backend dev",
  "portfolio": "https://github.com/username",
  "availability": "part-time",
  "interests": ["API Development", "Database Design"]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "profile": {
    "id": "talent_123",
    "status": "active"
  }
}
```

---

### 2. Browse Talent Pool

**Endpoint:** `GET /talent/browse`

**Query Parameters:**
```
skills=backend+development
availability=part-time
```

**Response:** `200 OK`
```json
{
  "success": true,
  "talents": [
    {
      "id": "user_123",
      "name": "John Doe",
      "skills": ["Backend Development", "Node.js"],
      "bio": "200 Level CS student...",
      "availability": "part-time"
    }
  ]
}
```

---

## 🔌 WebSocket Events (Live Quiz)

### Connection

```javascript
const socket = io('wss://api.studyspark.dev', {
  auth: {
    token: 'Bearer eyJhbGc...'
  }
});
```

### Events to Listen For (Client)

```javascript
// Quiz started
socket.on('quiz:started', (data) => {
  // data: { quizId, startedAt, endsAt }
});

// Quiz ended
socket.on('quiz:ended', (data) => {
  // data: { quizId, endedAt }
});

// Leaderboard update
socket.on('leaderboard:update', (data) => {
  // data: { leaderboard: [...] }
});

// Participant joined
socket.on('participant:joined', (data) => {
  // data: { participantCount }
});

// New question (if progressive reveal)
socket.on('question:next', (data) => {
  // data: { questionId, question }
});
```

### Events to Emit (Client)

```javascript
// Join quiz room
socket.emit('quiz:join', { quizId: 'quiz_123' });

// Submit answer
socket.emit('answer:submit', {
  quizId: 'quiz_123',
  questionId: 'q1',
  answer: 2
});
```

---

## 🔒 Authentication & Authorization

### Headers

All authenticated endpoints require:

```
Authorization: Bearer {token}
```

### Token Format

JWT with payload:

```json
{
  "userId": "user_123",
  "role": "student",
  "email": "student@university.edu",
  "exp": 1735689600
}
```

### Roles

- `student` - Access to study, quiz, analytics
- `admin` - All student access + admin endpoints

---

## ⚠️ Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Email is required",
    "field": "email"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., email exists)
- `422` - Validation Error
- `500` - Internal Server Error

---

## 🚀 Implementation Priority

### Phase 1 (MVP - Core Features)
1. ✅ Authentication (Register, Login)
2. ✅ AI Study Assistant (Chat, Recommendations)
3. ✅ Personal Quiz - **OBJECTIVE TYPE ONLY**
4. ✅ Live Quiz System (Full flow)
5. ✅ Basic Performance Analytics

### Phase 2 (Enhanced Features)
6. Advanced Analytics & Recommendations
7. Essay/Type-in Quiz Support
8. Enhanced AI Features (Flashcards, Summaries)

### Phase 3 (Secondary Features)
9. Admin Notifications System
10. Student Matching
11. Talent Pool

---

## 📝 Notes for Backend Team

### Database Models Needed

1. **User**
   - id, email, password, name, school, course, level, role

2. **Quiz**
   - id, code, title, type, status, questions, duration, createdBy

3. **QuizParticipant**
   - id, quizId, userId, answers, score, joinedAt

4. **StudySession**
   - id, userId, messages, topic, createdAt

5. **Performance**
   - id, userId, quizId, score, timeTaken, answers

6. **Notification**
   - id, type, title, course, level, scheduledAt, channels

7. **TalentProfile**
   - id, userId, skills, bio, availability

### AI Integration

- Use OpenAI API or similar for:
  - Quiz generation
  - Chat responses
  - Summaries
  - Flashcards
  - Performance analysis

### Real-time

- Socket.io for live quiz
- Redis for leaderboard caching
- Real-time participant count

### Notification Channels

- **Email:** SendGrid, Mailgun, or AWS SES
- **WhatsApp:** Twilio, WhatsApp Business API
- **Push:** Firebase Cloud Messaging

---

## ✅ Frontend Ready

The frontend is fully implemented and ready to connect to these endpoints. All UI components, state management, and routing are complete.

**Test the frontend with mock data now, then connect to your backend when ready!**

---

**Built for working-class university students 🎓**
