// Mock data for testing without backend

export const MOCK_MATERIALS = [
  {
    id: "mat-1",
    title: "Introduction to Data Structures",
    description: "Learn the fundamentals of data structures including arrays, linked lists, and trees",
    course: "cs101",
    week: "week1",
    type: "pdf",
    url: "/materials/week1-intro.pdf",
    uploadedAt: new Date("2025-01-01"),
  },
  {
    id: "mat-2",
    title: "Advanced Algorithms",
    description: "Deep dive into sorting and searching algorithms",
    course: "cs101",
    week: "week2",
    type: "pdf",
    url: "/materials/week2-algorithms.pdf",
    uploadedAt: new Date("2025-01-08"),
  },
];

export const MOCK_QUIZZES = [
  {
    id: "quiz-1",
    title: "Week 1 Quiz: Fundamentals",
    description: "Test your understanding of basic concepts",
    course: "cs101",
    week: "week1",
    difficulty: "easy",
    duration: 15,
    questions: [
      {
        id: "q1",
        text: "What is a data structure?",
        options: [
          "A way to organize data",
          "A programming language",
          "A type of algorithm",
          "A database system",
        ],
        correctAnswer: 0,
        explanation: "A data structure is a way to organize and store data efficiently.",
      },
      {
        id: "q2",
        text: "Which of these is NOT a linear data structure?",
        options: ["Array", "Linked List", "Tree", "Stack"],
        correctAnswer: 2,
        explanation: "A tree is a hierarchical (non-linear) data structure.",
      },
    ],
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "exam",
    title: "Final Exam Scheduled",
    description: "Your final examination has been scheduled",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: "9:00 AM",
    isRead: false,
    priority: "high",
    channel: "email",
  },
];

export const MOCK_USERS = [
  {
    id: "user-1",
    email: "student@studyspark.com",
    password: "password123",
    name: "Chisom Okafor",
    course: "Computer Science",
    level: "200 Level",
    school: "University of Lagos",
    role: "student" as const,
  },
  {
    id: "admin-1",
    email: "admin@studyspark.com",
    password: "admin123",
    name: "Admin User",
    course: "N/A",
    level: "N/A",
    role: "admin" as const,
  },
];

// Mock API responses
export const mockApiResponses = {
  "/auth/login": (data: { email: string; password: string }) => {
    const user = MOCK_USERS.find(
      (u) => u.email === data.email && u.password === data.password
    );
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: "mock-jwt-token-" + user.id,
    };
  },

  "/auth/register": (data: { email: string; password: string; name: string; course: string; level: string; school?: string }) => {
    const newUser = {
      id: "user-" + Date.now(),
      ...data,
      role: "student" as const,
    };
    const { password: _pwd, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword,
      token: "mock-jwt-token-" + newUser.id,
    };
  },

  "/study/query": (data: { topic: string; message: string }) => {
    return {
      response: `This is a mock AI response about ${data.topic}. In a real implementation, this would be powered by an AI model that understands your course materials and provides helpful explanations.

Here are some key points:
• Concept explanation
• Practical examples
• Related topics to explore

Would you like me to elaborate on any specific aspect?`,
    };
  },

  "/admin/materials": (_data: FormData) => {
    return {
      success: true,
      materialId: "mat-" + Date.now(),
      message: "Material uploaded successfully",
    };
  },

  "/admin/quiz/generate": (data: { topic: string; numQuestions: number }) => {
    const questions = Array.from({ length: data.numQuestions }, (_, i) => ({
      id: `q${i + 1}`,
      text: `Generated question ${i + 1} about ${data.topic}?`,
      options: [
        `Option A for question ${i + 1}`,
        `Option B for question ${i + 1}`,
        `Option C for question ${i + 1}`,
        `Option D for question ${i + 1}`,
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `This is the explanation for question ${i + 1}`,
    }));

    return { questions };
  },

  "/admin/quiz": (_data: unknown) => {
    return {
      success: true,
      quizId: "quiz-" + Date.now(),
      message: "Quiz created successfully",
    };
  },

  "/admin/events": (_data: unknown) => {
    return {
      success: true,
      eventId: "event-" + Date.now(),
      message: "Event created and notifications sent",
    };
  },
};
