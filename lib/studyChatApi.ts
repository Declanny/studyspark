import { api } from './api';

// Generic recommendation interface for videos, books, articles, etc.
export interface Recommendation {
  type: 'video' | 'reading';
  title: string;
  url: string;
  description: string;
  thumbnail: string;
  source: string;
  // Video-specific fields
  duration?: string;
  channelTitle?: string;
  viewCount?: string;
  publishedAt?: string;
  // Reading-specific fields
  authors?: string[];
}

// Legacy interface for backward compatibility
export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  channelTitle: string;
  description: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
}

export interface StudyChatResponse {
  chatId: string;
  aiResponse: string;
  topic: string;
  course?: string;
  recommendations: Recommendation[];
  messageCount: number;
  createdAt: string;
}

export interface CreateStudyChatRequest {
  topic: string;
  message: string;
  course?: string;
}

/**
 * Create a new study chat with AI response and recommendations (videos, books, etc.)
 */
export async function createStudyChat(data: CreateStudyChatRequest): Promise<StudyChatResponse> {
  const response = await api.post('/study/chat', data);
  const apiData = response.data.data;

  return {
    chatId: apiData.studyChat._id,
    aiResponse: apiData.aiResponse,
    topic: apiData.studyChat.topic,
    recommendations: apiData.recommendations || [],
    messageCount: apiData.studyChat.messageCount,
    createdAt: apiData.studyChat.createdAt,
  };
}

/**
 * Format YouTube duration from ISO 8601 to readable format
 * e.g., "PT15M30S" -> "15:30"
 */
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '').padStart(2, '0');

  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds}`;
  }
  return `${minutes || '0'}:${seconds}`;
}

/**
 * Format view count to human-readable format
 * e.g., "1500000" -> "1.5M views"
 */
export function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (isNaN(num)) return '0 views';

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
}

/**
 * Format published date to relative time
 * e.g., "2023-01-15T10:00:00Z" -> "2 months ago"
 */
export function formatPublishedDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Validate study chat input
 */
export function validateStudyChatInput(topic: string, message: string): string[] {
  const errors: string[] = [];

  if (!topic || topic.trim().length < 2) {
    errors.push('Topic must be at least 2 characters');
  }
  if (topic.length > 100) {
    errors.push('Topic must be less than 100 characters');
  }

  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  if (message.length > 1000) {
    errors.push('Message must be less than 1000 characters');
  }

  return errors;
}
