"use client";

import { Book, Sparkles } from 'lucide-react';

interface ChunkUsed {
  materialTitle: string;
  materialTopic: string;
  similarity: string;
  preview: string;
}

interface ContextDisplayProps {
  chunksUsed: ChunkUsed[];
}

export default function ContextDisplay({ chunksUsed }: ContextDisplayProps) {
  if (!chunksUsed || chunksUsed.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles className="h-4 w-4 text-blue-600" />
        <p className="text-sm font-semibold text-blue-900">Context from your materials</p>
      </div>

      <div className="space-y-2">
        {chunksUsed.map((chunk, index) => (
          <div
            key={index}
            className="p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Book className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{chunk.materialTitle}</p>
                  <p className="text-xs text-gray-600">{chunk.materialTopic}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {chunk.similarity} match
              </span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{chunk.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
