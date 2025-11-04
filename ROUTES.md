# StudySpark - Routes Reference

## 📍 All Available Routes

### Public Routes
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page

### Protected Routes (Requires Authentication)

#### Student Routes
- `/dashboard` - Main dashboard with overview widgets
- `/study` - AI Study Assistant with chat interface
- `/quiz` - Quiz listing and practice quizzes
- `/quiz/live/[code]` - Live quiz room (e.g., `/quiz/live/ABC123`)
- `/notifications` - Smart notifications and reminders
- `/report` - Performance analytics and reports

#### Admin Routes (Requires Admin Role)
- `/admin` - Admin panel
  - Materials tab - Upload course materials
  - Quizzes tab - Generate and manage quizzes
  - Events tab - Create event notifications

---

## 🧭 Navigation Flow

### First-Time User
1. Visit `/auth/register`
2. Create account
3. Redirected to `/dashboard`
4. Explore features from dashboard widgets

### Returning User
1. Visit `/auth/login`
2. Enter credentials
3. Redirected to `/dashboard`

### Student Journey
```
/dashboard
  ├─> /study (AI Study Assistant)
  ├─> /quiz (Take quizzes)
  │   └─> /quiz/live/[code] (Join live quiz)
  ├─> /notifications (Check notifications)
  └─> /report (View performance)
```

### Admin Journey
```
/dashboard
  ├─> /admin (Admin panel)
  │   ├─> Upload materials
  │   ├─> Generate quizzes
  │   └─> Create events
  └─> All student routes
```

---

## 🔐 Route Protection

### Implementation
All protected routes use the `<ProtectedRoute>` wrapper component.

**Location:** `components/ProtectedRoute.tsx`

**Behavior:**
- Checks authentication status from `useAuthStore`
- Redirects to `/auth/login` if not authenticated
- Shows loading state during check

### Admin-Only Routes
- `/admin` - Additional check for `user.role === "admin"`
- Redirects non-admin users to `/dashboard`

---

## 🎨 Page Components

### Dashboard (`/dashboard`)
**Components:**
- `DashboardHeader` - Welcome message and user info
- `WidgetCard` - Quick action cards

**Features:**
- Overview widgets linking to main features
- User greeting with name
- Quick navigation

### Study (`/study`)
**Components:**
- `TopicSelector` - Choose course topics/weeks
- `ChatWindow` - AI chat interface

**Features:**
- Topic selection sidebar
- Chat messages with AI
- Quick actions (summarize, flashcards, explain)
- Message history

### Quiz (`/quiz`)
**Components:**
- `QuizCard` - Question and options
- `Timer` - Countdown timer
- `Leaderboard` - Live rankings

**Features:**
- Quiz listing with difficulty levels
- Live quiz with code entry
- Real-time leaderboard
- Score summary

### Notifications (`/notifications`)
**Components:**
- `NotificationCard` - Individual notification

**Features:**
- Filter by type (exam, assignment, quiz, etc.)
- Mark as read
- Priority levels
- Multi-channel support

### Report (`/report`)
**Components:**
- `PerformanceChart` - Data visualization

**Features:**
- Performance charts (bar, line, radar)
- Strengths and weaknesses analysis
- AI recommendations
- Export to PDF

### Admin (`/admin`)
**Components:**
- `UploadMaterial` - Material upload form
- `ManageQuiz` - Quiz generation and management
- `CreateEvent` - Event notification creator

**Features:**
- Course material uploads
- AI-powered quiz generation
- Event scheduling with notifications
- Student statistics

---

## 🔗 Quick Links

### From Dashboard
- "AI Study Assistant" → `/study`
- "CBT Practice / Quiz" → `/quiz`
- "Reminders" → `/notifications`
- "View Reports" → `/report`
- "Admin Panel" (admin only) → `/admin`

### From Navbar (All Pages)
- Logo click → `/dashboard`
- Profile dropdown → User menu
- Mobile menu → Sidebar navigation

### From Sidebar (Desktop/Mobile)
- Dashboard → `/dashboard`
- AI Study → `/study`
- Quizzes → `/quiz`
- Notifications → `/notifications`
- Reports → `/report`
- Admin Panel → `/admin` (admin only)

---

## 🧪 Testing Routes

### Test Accounts
**Student:**
- Email: `student@studyspark.com`
- Password: `password123`
- Access: All student routes

**Admin:**
- Email: `admin@studyspark.com`
- Password: `admin123`
- Access: All routes including admin panel

### Live Quiz Test
1. Go to `/quiz`
2. Enter code: `LIVE123` or `ABC123`
3. Click "Join"
4. Redirects to `/quiz/live/LIVE123`

---

## 📱 Responsive Behavior

### Mobile (< 1024px)
- Sidebar hidden by default
- Hamburger menu in navbar
- Sheet drawer for navigation
- Full-width content

### Desktop (≥ 1024px)
- Fixed sidebar on left
- Content area with left padding
- No hamburger menu
- Multi-column layouts

---

## 🚀 Dynamic Routes

### Quiz Live Room
**Pattern:** `/quiz/live/[code]`

**Examples:**
- `/quiz/live/ABC123`
- `/quiz/live/XYZ789`
- `/quiz/live/LIVE001`

**Usage:**
```typescript
// Navigate programmatically
router.push(`/quiz/live/${quizCode}`);

// Access params in component
const params = useParams();
const code = params.code; // "ABC123"
```

---

## 🔄 Redirects

### After Login
- Successful login → `/dashboard`

### After Registration
- Successful registration → `/dashboard`

### Unauthorized Access
- Not authenticated → `/auth/login`
- Not admin (accessing /admin) → `/dashboard`

### After Logout
- Logout → `/auth/login`

---

## 🎯 Next.js App Router Features

### Static Routes (○)
Pre-rendered at build time:
- `/`
- `/auth/login`
- `/auth/register`
- `/dashboard`
- `/study`
- `/quiz`
- `/notifications`
- `/report`
- `/admin`

### Dynamic Routes (ƒ)
Server-rendered on demand:
- `/quiz/live/[code]`

---

## 📊 Route Analytics

Track user navigation with:
- Page views
- Time spent per route
- Most visited routes
- Drop-off points

*Implementation pending*

---

Built with Next.js App Router 🚀
