"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { TextChunk } from '@/lib/fileExtractor';
import { processMaterial } from '@/lib/materialApi';
import { toast } from 'react-hot-toast';

const FileUploader = dynamic(() => import('@/components/materials/FileUploader'), {
  ssr: false,
  loading: () => <div className="text-center py-8"><Loader className="h-8 w-8 animate-spin mx-auto text-blue-600" /></div>
});

export default function UploadMaterialPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    subject: ''
  });
  const [extractedText, setExtractedText] = useState<string>('');
  const [textChunks, setTextChunks] = useState<TextChunk[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleTextExtracted = (text: string, chunks: TextChunk[], name: string) => {
    setExtractedText(text);
    setTextChunks(chunks);
    setFileName(name);

    // Auto-fill title if empty
    if (!formData.title) {
      const nameWithoutExt = name.replace(/\.(pdf|docx|txt)$/i, '');
      setFormData(prev => ({ ...prev, title: nameWithoutExt }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }
    if (textChunks.length === 0) {
      toast.error('Please upload a file first');
      return;
    }

    setIsUploading(true);

    try {
      await processMaterial({
        title: formData.title.trim(),
        topic: formData.topic.trim(),
        subject: formData.subject.trim() || undefined,
        textChunks
      });

      toast.success('Material uploaded successfully! Processing embeddings...');
      router.push('/materials');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload material');
    } finally {
      setIsUploading(false);
    }
  };

  const canSubmit = formData.title.trim() && formData.topic.trim() && textChunks.length > 0 && !isUploading;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/materials"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Materials</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Upload Course Material</h1>
          <p className="text-gray-600 mt-2">
            Upload your lecture notes, textbooks, or study materials for AI-powered learning
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Upload File</h2>
            <FileUploader
              onTextExtracted={handleTextExtracted}
              onError={(error) => toast.error(error)}
            />

            {/* Extraction Stats */}
            {textChunks.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Extraction Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700 font-medium">Total Words</p>
                    <p className="text-blue-900 text-lg">{extractedText.split(/\s+/).length.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Chunks Created</p>
                    <p className="text-blue-900 text-lg">{textChunks.length}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Avg Words/Chunk</p>
                    <p className="text-blue-900 text-lg">
                      {Math.round(textChunks.reduce((sum, chunk) => sum + chunk.wordCount, 0) / textChunks.length)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Material Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Add Details</h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Data Structures Chapter 3"
                  required
                />
              </div>

              {/* Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Binary Trees"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/materials"
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2
                ${canSubmit
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isUploading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Upload Material</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">Privacy Note</h3>
          <p className="text-sm text-yellow-800">
            Your files are processed entirely in your browser. Only the extracted text is sent to our servers
            for embedding generation. We never store your original files.
          </p>
        </div>
      </div>
    </div>
  );
}
