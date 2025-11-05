import { api } from './api';
import { TextChunk } from './fileExtractor';
import { Recommendation } from './studyChatApi';

export interface CourseMaterial {
  _id: string;
  title: string;
  topic: string;
  subject: string;
  wordCount: number;
  chunkCount: number;
  status: 'processing' | 'ready' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface ProcessMaterialRequest {
  title: string;
  topic: string;
  subject?: string;
  textChunks: TextChunk[];
}

export interface SearchResult {
  materialId: string;
  materialTitle: string;
  materialTopic: string;
  content: string;
  similarity: string;
  order: number;
  wordCount: number;
}

export interface ChatWithContextRequest {
  message: string;
  materialIds?: string[];
  topic?: string;
  subject?: string;
}

export interface ChatWithContextResponse {
  success: boolean;
  data: {
    chatId: string;
    aiResponse: string;
    contextUsed: boolean;
    chunksUsed: Array<{
      materialTitle: string;
      materialTopic: string;
      similarity: string;
      preview: string;
    }>;
    recommendations?: Recommendation[];
    messageCount: number;
  };
}

/**
 * Process course material and generate embeddings
 */
export async function processMaterial(data: ProcessMaterialRequest): Promise<CourseMaterial> {
  const response = await api.post('/study/materials/process', data);
  return response.data.material;
}

/**
 * Get all user's course materials
 */
export async function getMaterials(filters?: {
  topic?: string;
  subject?: string;
  status?: 'processing' | 'ready' | 'failed';
}): Promise<CourseMaterial[]> {
  const params = new URLSearchParams();
  if (filters?.topic) params.append('topic', filters.topic);
  if (filters?.subject) params.append('subject', filters.subject);
  if (filters?.status) params.append('status', filters.status);

  const response = await api.get(`/study/materials?${params.toString()}`);
  return response.data.materials;
}

/**
 * Get specific course material by ID
 */
export async function getMaterialById(id: string): Promise<CourseMaterial> {
  const response = await api.get(`/study/materials/${id}`);
  return response.data.material;
}

/**
 * Update course material metadata
 */
export async function updateMaterial(
  id: string,
  updates: { title?: string; topic?: string; subject?: string }
): Promise<CourseMaterial> {
  const response = await api.patch(`/study/materials/${id}`, updates);
  return response.data.material;
}

/**
 * Delete course material
 */
export async function deleteMaterial(id: string): Promise<void> {
  await api.delete(`/study/materials/${id}`);
}

/**
 * Search similar content in course materials
 */
export async function searchMaterials(
  query: string,
  materialIds?: string[],
  limit?: number
): Promise<SearchResult[]> {
  const response = await api.post('/study/materials/search', {
    query,
    materialIds,
    limit
  });
  return response.data.results;
}

/**
 * Chat with AI using course material context (RAG)
 */
export async function chatWithContext(data: ChatWithContextRequest): Promise<ChatWithContextResponse> {
  const response = await api.post('/study/chat-with-context', data);
  return response.data;
}
