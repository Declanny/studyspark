# StudyPack User Flow Documentation

## Overview
StudyPack is an AI-powered learning platform that helps students study smarter with personalized materials, quizzes, and AI tutoring.

---

## 1. Authentication Flow

### Registration
1. User visits `/auth/register`
2. Provides: Email, Password, Name, School, Course, Level
3. System creates account and authenticates user
4. Redirects to Dashboard

### Login
1. User visits `/auth/login`
2. Enters credentials (email & password)
3. System authenticates and redirects to Dashboard

---

## 2. Dashboard Flow

**Entry Point:** `/dashboard`

User sees overview of:
- Recent study sessions
- Quiz statistics
- Material count
- Quick action buttons to main features

---

## 3. Materials Management Flow

### Upload Materials (`/materials/upload`)
1. User uploads study materials (PDF, DOCX, TXT, PPTX)
2. Provides metadata: Title, Topic, Subject
3. System processes file:
   - Extracts text content
   - Splits into chunks
   - Generates embeddings for RAG (Retrieval Augmented Generation)
4. Material saved with status: `processing` → `ready`

### View Materials (`/materials`)
1. User browses uploaded materials
2. Filter by: Topic, Subject, Status
3. View material details:
   - Word count
   - Chunk count
   - Processing status
4. Edit or delete materials

---

## 4. AI Study Chat Flow

**Entry Point:** `/study`

### Basic Chat Mode
1. User selects a topic
2. Asks questions in chat interface
3. AI responds with:
   - Comprehensive answer
   - **Recommended Resources:**
     - YouTube videos (with duration, views, channel)
     - Reading materials (books, articles with authors)
4. Quick Actions available:
   - "Summarize Topic"
   - "Generate Flashcards"
   - "Explain Like I'm 5"

### RAG-Enhanced Chat Mode
1. User toggles "Use course materials"
2. Selects specific uploaded materials
3. Asks questions
4. AI responds using:
   - Context from uploaded materials
   - Relevant chunks displayed with similarity scores
   - Material sources shown
   - **Recommended Resources** (videos + reading materials)

---

## 5. Quiz System Flow

### Quiz Generation (`/quiz/generate`)

**For Personal Practice:**
1. User selects topic and subject
2. Configures quiz:
   - Number of questions
   - Difficulty level
   - Time limit
3. System generates quiz using AI
4. User takes quiz immediately
5. Results shown with:
   - Score percentage
   - Correct/incorrect breakdown
   - Question-by-question review

**For Live Quiz (Hosting):**
1. User creates quiz (same as above)
2. Enables "Live Quiz" mode
3. System generates unique join code
4. Host can:
   - Share join code with participants
   - Monitor participants in real-time
   - Start quiz when ready
5. View live leaderboard during quiz

### Join Live Quiz (`/quiz/join`)
1. Student enters join code
2. Waits in lobby until host starts
3. Takes quiz in real-time
4. Competes on live leaderboard
5. Views results and ranking after completion

### Quiz History
**Personal Quizzes:** `/quiz/personal`
- View all personal quiz attempts
- See scores and performance trends

**Live Quiz Attempts:** `/quiz/attempts`
- View participated live quizzes
- See rankings and scores

---

## 6. Analytics Flow

**Entry Point:** `/analytics`

User views performance insights:

### Study Analytics
- Total study time
- Topics covered
- Chat message count
- Study streak

### Quiz Analytics
- Total quizzes taken
- Average score
- Best/worst subjects
- Performance trends over time
- Recent quiz attempts

### Material Analytics
- Total materials uploaded
- Topics breakdown
- Most used materials

---

## 7. Key Features Integration

### AI-Powered Recommendations (Like ChatGPT)
- **Videos:** YouTube tutorials with:
  - Thumbnail preview
  - Duration badge
  - Channel name
  - View count
  - Published date

- **Reading Materials:** Books/Articles with:
  - Cover image
  - Authors
  - Source (Google Books, etc.)
  - Description

### RAG (Retrieval Augmented Generation)
- Uses uploaded course materials as context
- Shows which material chunks were used
- Displays similarity scores
- Provides source attribution

### Real-time Features
- Live quiz participation
- Real-time leaderboards
- Live participant tracking
- Instant quiz result updates

---

## 8. Complete User Journey Example

### Scenario: Student Preparing for Computer Science Exam

1. **Upload Materials** (`/materials/upload`)
   - Uploads lecture PDFs on "Data Structures"
   - System processes and creates embeddings

2. **Study with AI** (`/study`)
   - Enables RAG mode
   - Selects uploaded materials
   - Asks: "Explain Binary Search Trees"
   - Receives:
     - Answer using course material context
     - YouTube video recommendations
     - Book recommendations
     - Source chunks from uploaded PDFs

3. **Generate Practice Quiz** (`/quiz/generate`)
   - Creates 20-question quiz
   - Topic: "Data Structures"
   - Difficulty: Medium
   - Takes quiz and reviews mistakes

4. **Create Live Quiz for Study Group** (`/quiz/generate`)
   - Creates live quiz
   - Shares join code with classmates
   - Monitors participants
   - Starts quiz when everyone joins
   - Reviews leaderboard

5. **Track Progress** (`/analytics`)
   - Views study time trends
   - Analyzes quiz performance
   - Identifies weak topics

---

## Technical Flow Summary

```
User Registration → Dashboard
    ↓
Materials Upload → Processing → Embedding Generation
    ↓
Study Chat (AI)
    ├── Basic Mode → AI Response + Recommendations
    └── RAG Mode → Context Search + AI Response + Recommendations
    ↓
Quiz Generation
    ├── Personal Quiz → Take → Results → History
    └── Live Quiz → Share Code → Participants Join → Take → Leaderboard
    ↓
Analytics Dashboard → Performance Insights
```

---

## Key Differentiators

✅ **RAG-Powered Learning:** Use your own materials as AI context
✅ **Multi-Modal Recommendations:** Videos + Reading materials
✅ **Live Quiz System:** Real-time collaborative learning
✅ **Comprehensive Analytics:** Track every aspect of learning
✅ **Smart Material Processing:** Automatic chunking and embedding
✅ **Topic-Based Organization:** Everything organized by subjects and topics
