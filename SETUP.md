# StudySpark Frontend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Without Backend

The app includes mock API responses for testing. To enable:

1. Set `NEXT_PUBLIC_USE_MOCK_API=true` in `.env.local`
2. Use these test accounts:
   - **Student**: `student@studyspark.com` / `password123`
   - **Admin**: `admin@studyspark.com` / `admin123`

---

## 📁 Project Structure

```
studypack/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Login & registration
│   ├── dashboard/         # Dashboard page
│   ├── study/             # AI study assistant
│   ├── quiz/              # Quiz pages
│   ├── notifications/     # Notifications page
│   ├── report/            # Performance reports
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── ui/               # Shadcn/UI components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard widgets
│   ├── study/            # Study components
│   ├── quiz/             # Quiz components
│   ├── notifications/    # Notification components
│   ├── report/           # Report/chart components
│   └── admin/            # Admin components
├── store/                # Zustand state management
│   ├── useAuthStore.ts
│   ├── useStudyStore.ts
│   └── useQuizStore.ts
├── lib/                  # Utilities
│   ├── api.ts           # Axios API client
│   ├── utils.ts         # Helper functions
│   ├── mockData.ts      # Mock test data
│   └── mockApi.ts       # Mock API interceptor
└── styles/              # Global styles
```

---

## 🎨 Features Implemented

### ✅ Authentication
- Login & Registration
- JWT token storage
- Protected routes
- Role-based access (student/admin)

### ✅ Dashboard
- Overview widgets
- Quick navigation
- User greeting

### ✅ AI Study Assistant
- Chat interface
- Topic selection
- Quick actions (summarize, flashcards, explain)
- Message history

### ✅ Quiz System
- Practice quizzes
- Live quiz with leaderboard
- Timer component
- Real-time updates (socket.io ready)
- Score calculation

### ✅ Smart Notifications
- Event types (exam, assignment, quiz, reminder)
- Priority levels
- Multi-channel support (email, SMS, WhatsApp, push)
- Filter by type

### ✅ Performance Reports
- Charts (bar, line, radar)
- Strengths & weaknesses analysis
- AI-powered recommendations
- Progress tracking

### ✅ Admin Panel
- Upload course materials
- Generate quizzes with AI
- Create event notifications
- Student management stats

### ✅ UI/UX
- Mobile-first responsive design
- Sidebar navigation (desktop + mobile drawer)
- Dark mode support
- Tailwind CSS + Shadcn/UI

---

## 🔌 API Integration

### Current Setup
The app uses Axios with interceptors for API calls. See `lib/api.ts`.

### Endpoints Expected

#### Auth
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

#### Study
- `POST /study/query` - AI chat query

#### Quiz
- `GET /quiz` - List quizzes
- `POST /quiz/submit` - Submit quiz answers

#### Admin
- `POST /admin/materials` - Upload materials
- `POST /admin/quiz/generate` - Generate quiz with AI
- `POST /admin/quiz` - Create quiz
- `POST /admin/events` - Create event notification

---

## 🧩 Mock Data

Mock data is available in `lib/mockData.ts` for:
- Users (student & admin)
- Quizzes
- Materials
- Notifications

Test accounts:
- `student@studyspark.com` / `password123`
- `admin@studyspark.com` / `admin123`

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

---

## 📦 Dependencies

### Core
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### State Management
- Zustand (lightweight alternative to Redux)

### UI Components
- Shadcn/UI (Radix UI primitives)
- Lucide Icons

### Data & API
- Axios
- Recharts (for analytics)
- Socket.io-client (for live features)

---

## 🔧 Environment Variables

```env
# API endpoint (backend)
NEXT_PUBLIC_API_URL=https://api.studyspark.dev/api/v1

# WebSocket endpoint (for live quiz)
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Enable mock mode (true/false)
NEXT_PUBLIC_USE_MOCK_API=true
```

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
```

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Styling issues
```bash
# Rebuild Tailwind
npm run dev
```

---

## 📝 Next Steps

1. **Connect to Backend**: Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. **Disable Mock Mode**: Set `NEXT_PUBLIC_USE_MOCK_API=false`
3. **Add Real Authentication**: Integrate with backend auth
4. **Enable Socket.io**: Uncomment socket code in `app/quiz/live/[code]/page.tsx`
5. **Add Error Boundaries**: Implement error handling
6. **Add Toast Notifications**: For user feedback
7. **Add Loading States**: Skeleton screens for async operations
8. **SEO Optimization**: Add meta tags and OpenGraph data

---

## 👥 Support

For issues or questions, contact the development team or check the documentation at:
https://docs.studyspark.dev

---

Built with ❤️ by the StudySpark Team
