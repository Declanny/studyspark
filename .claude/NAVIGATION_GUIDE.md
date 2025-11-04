# StudySpark Frontend Navigation Guide

## 🗺️ Complete Site Map

```
📱 StudySpark App
│
├── 🏠 Landing Page (/)
│   └── Login/Register → /auth/login or /auth/register
│
├── 📊 Dashboard (/dashboard) ⭐ MAIN HUB
│   ├── AI Study Assistant → /study
│   ├── Quiz Center → /quiz
│   ├── Study Materials → /materials
│   ├── Analytics & Progress → /analytics
│   ├── Smart Reminders → /notifications
│   └── Reports & History → /quiz/attempts
│
├── 🧠 Study System
│   └── /study - AI chat with RAG support
│
├── 🎯 Quiz System (/quiz) ⭐ QUIZ HUB
│   ├── Generate Quiz → /quiz/generate
│   ├── Personal Quizzes → /quiz/personal
│   ├── Join Live Quiz → /quiz/join
│   ├── Quiz History → /quiz/attempts
│   ├── Take Quiz → /quiz/take/[id]
│   ├── Quiz Results → /quiz/result/[id]
│   └── Live Quiz Admin → /quiz/live/[id]
│
├── 📚 Materials System (/materials)
│   ├── Material Library → /materials
│   └── Upload Material → /materials/upload
│
├── 📈 Analytics (/analytics)
│   └── Performance Dashboard with AI insights
│
└── 🔔 Notifications (/notifications)
    └── Smart reminders and alerts
```

---

## 🎯 Quiz System Navigation Flow

### Option 1: Generate a New Quiz
```
Dashboard → Quiz Center → Generate Quiz
   ↓
Fill form (topic, difficulty, count)
   ↓
AI generates questions
   ↓
Choose: Personal or Live
   ↓
Personal: /quiz/take/[id]
Live: /quiz/live/[id] (admin dashboard)
```

### Option 2: Take Personal Quiz
```
Dashboard → Quiz Center → Personal Quizzes
   ↓
Select quiz from library
   ↓
/quiz/take/[id]
   ↓
Complete quiz
   ↓
/quiz/result/[id] (with AI analysis)
```

### Option 3: Join Live Quiz
```
Dashboard → Quiz Center → Join Live Quiz
   ↓
Enter 6-character code
   ↓
Wait for admin to start
   ↓
/quiz/take/[id]
   ↓
/quiz/result/[id]
```

### Option 4: View History
```
Dashboard → Reports & History
   ↓
/quiz/attempts
   ↓
Click any attempt → /quiz/result/[id]
```

---

## 📚 Materials System Flow

### Upload Materials
```
Dashboard → Study Materials → Upload Material
   ↓
/materials/upload
   ↓
Upload PDF/DOCX/TXT
   ↓
AI processes & creates embeddings
   ↓
Return to /materials (material library)
```

### Use Materials in Chat
```
Dashboard → AI Study Assistant
   ↓
/study
   ↓
Toggle "Use course materials"
   ↓
Select materials
   ↓
Chat with RAG-enhanced responses
```

---

## 📈 Analytics Flow

```
Dashboard → Analytics & Progress
   ↓
/analytics
   ↓
View:
  - Performance metrics
  - Weekly activity charts
  - Topic performance
  - AI insights (strengths/weaknesses)
  - Recent activity timeline
```

---

## 🎨 Dashboard Widget Mapping

| Widget | Route | Purpose |
|--------|-------|---------|
| AI Study Assistant | `/study` | Chat with AI, use RAG |
| Quiz Center | `/quiz` | Quiz hub (generate, personal, join, history) |
| Study Materials | `/materials` | Upload & manage course materials |
| Analytics & Progress | `/analytics` | Performance dashboard |
| Smart Reminders | `/notifications` | Deadline alerts |
| Reports & History | `/quiz/attempts` | Quiz history |

---

## 🔑 Key Pages and Their Purpose

### Hub Pages (Navigation Centers)
- **`/dashboard`** - Main navigation hub, first page after login
- **`/quiz`** - Quiz center hub, shows all quiz options

### Action Pages
- **`/quiz/generate`** - Create new AI-powered quiz
- **`/quiz/join`** - Join live quiz with code
- **`/materials/upload`** - Upload course materials

### Library/List Pages
- **`/quiz/personal`** - List of personal quizzes
- **`/quiz/attempts`** - Quiz history and attempts
- **`/materials`** - Material library

### Detail/Action Pages
- **`/quiz/take/[id]`** - Interactive quiz taking
- **`/quiz/result/[id]`** - Results with AI analysis
- **`/quiz/live/[id]`** - Live quiz admin dashboard

### Analysis Pages
- **`/analytics`** - Performance analytics dashboard
- **`/study`** - AI study chat

---

## 🚀 Recommended User Journeys

### New User Journey
```
1. Login/Register → /auth/login
2. Dashboard → /dashboard
3. Upload materials → /materials/upload
4. Generate first quiz → /quiz/generate
5. Take quiz → /quiz/take/[id]
6. View results → /quiz/result/[id]
7. Check analytics → /analytics
```

### Study Session Journey
```
1. Dashboard → /dashboard
2. Study Materials → /materials
3. AI Study Assistant → /study
4. Toggle RAG, select materials
5. Chat and learn
6. Take practice quiz → /quiz
7. Review performance → /analytics
```

### Live Quiz Instructor Journey
```
1. Dashboard → /dashboard
2. Quiz Center → /quiz
3. Generate Quiz → /quiz/generate
4. Choose "Live Quiz"
5. Share join code with students
6. Monitor participants → /quiz/live/[id]
7. Start quiz when ready
8. View results after completion
```

### Live Quiz Student Journey
```
1. Dashboard → /dashboard
2. Quiz Center → /quiz
3. Join Live Quiz → /quiz/join
4. Enter code from instructor
5. Wait for quiz to start
6. Take quiz → /quiz/take/[id]
7. View results → /quiz/result/[id]
```

---

## 🛠️ Technical Notes

### Protected Routes
All routes except `/`, `/auth/login`, and `/auth/register` require authentication.

### Dynamic Routes
- `/quiz/take/[id]` - Quiz ID
- `/quiz/result/[id]` - Attempt ID
- `/quiz/live/[id]` - Quiz ID (for admin)

### API Integration Status
- ✅ All quiz endpoints connected
- ✅ All materials endpoints connected
- ✅ All analytics endpoints connected
- ✅ All study chat endpoints connected

### Data Flow
```
User Action → Frontend Component → API Client → Backend Endpoint → Database
                                                                      ↓
Response ← Toast Notification ← Component Update ← API Response ← Query
```

---

## 📝 Page-by-Page Details

### /dashboard
- **Purpose**: Main navigation hub
- **Features**: 6 widget cards for quick access
- **Next Steps**: Click any widget to navigate

### /quiz
- **Purpose**: Quiz center hub
- **Features**: 4 main options (Generate, Personal, Join, History)
- **Stats**: Shows quiz count, avg score, study time
- **Next Steps**: Choose any quiz option

### /quiz/generate
- **Purpose**: Create AI-powered quiz
- **Form Fields**: Topic, difficulty, question count, type (personal/live)
- **Next Steps**: Creates quiz → redirects to take or live dashboard

### /quiz/personal
- **Purpose**: Personal quiz library
- **Features**: List of saved quizzes, filter/search
- **Next Steps**: Click quiz to take it

### /quiz/join
- **Purpose**: Join live quiz
- **Input**: 6-character code
- **Next Steps**: Joins quiz room → waits for start

### /quiz/take/[id]
- **Purpose**: Interactive quiz taking
- **Features**: Timer, questions, answer selection
- **Next Steps**: Submit → results page

### /quiz/result/[id]
- **Purpose**: Show quiz results
- **Features**: Score, AI analysis, question review
- **Next Steps**: Retake, view analytics, new quiz

### /quiz/attempts
- **Purpose**: Quiz history
- **Features**: List of all attempts, stats, filters
- **Next Steps**: Click attempt for detailed results

### /materials
- **Purpose**: Material library
- **Features**: List of uploaded materials, search
- **Next Steps**: Upload new, view details, use in chat

### /materials/upload
- **Purpose**: Upload course materials
- **Accepts**: PDF, DOCX, TXT
- **Process**: Extract text → chunk → embeddings
- **Next Steps**: Returns to materials library

### /study
- **Purpose**: AI study chat
- **Features**: Chat interface, RAG toggle, material selection
- **Next Steps**: Ask questions, get AI responses

### /analytics
- **Purpose**: Performance dashboard
- **Features**: Charts, stats, AI insights
- **Visualization**: Weekly activity, topic performance
- **Next Steps**: View quiz attempts, study more

---

## 🎯 Navigation Best Practices

1. **Always start at Dashboard** - Main hub with all options
2. **Use breadcrumbs** - Most pages have "Back to..." links
3. **Check the Navbar** - Available on all authenticated pages
4. **Quiz flow is linear** - Generate → Take → Result
5. **Materials enhance study** - Upload first, then use in chat

---

## 🔄 Quick Navigation Shortcuts

| From | To | Click |
|------|-----|------|
| Anywhere | Dashboard | Navbar logo |
| Dashboard | Generate Quiz | Quiz Center → Generate |
| Dashboard | Upload Material | Study Materials → Upload |
| Dashboard | View Analytics | Analytics & Progress |
| Quiz Hub | Any quiz feature | Large cards |
| Quiz Result | New Quiz | "Take Another Quiz" |
| Materials | Study Chat | AI Study Assistant (Dashboard) |

---

## ✅ Fixed Navigation Issues

### What Was Fixed:
1. ✅ Created unified Quiz Hub (`/quiz`)
2. ✅ Updated Dashboard links to correct pages
3. ✅ Added `/quiz/attempts` for history
4. ✅ Added `/materials` link to dashboard
5. ✅ Changed "Performance Reports" → Analytics
6. ✅ Removed duplicate/conflicting pages
7. ✅ Clear navigation flow established

### Result:
- Clean, intuitive navigation
- All pages accessible from Dashboard
- Logical user journeys
- No dead ends or confusion
