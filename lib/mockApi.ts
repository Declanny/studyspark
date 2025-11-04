// Mock API interceptor for development/testing without backend
import { mockApiResponses } from "./mockData";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export const mockApiCall = async (
  endpoint: string,
  method: string,
  data?: unknown
): Promise<unknown> => {
  if (!USE_MOCK_API) {
    throw new Error("Mock API is disabled");
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

  console.log(`[Mock API] ${method} ${endpoint}`, data);

  // Route to appropriate mock handler
  const handler = mockApiResponses[endpoint as keyof typeof mockApiResponses];
  if (handler) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = (handler as any)(data);
      console.log(`[Mock API] Response:`, response);
      return response;
    } catch (error) {
      console.error(`[Mock API] Error:`, error);
      throw error;
    }
  }

  // Default fallback
  console.warn(`[Mock API] No handler for ${endpoint}, returning default response`);
  return {
    success: true,
    message: "Mock response",
    data: null,
  };
};

// Helper to enable mock mode for testing
export const setupMockApi = () => {
  console.log(
    "[Mock API] To enable mock mode, set NEXT_PUBLIC_USE_MOCK_API=true in .env.local"
  );
  console.log("[Mock API] Available test accounts:");
  console.log("  Student: student@studyspark.com / password123");
  console.log("  Admin: admin@studyspark.com / admin123");
};
