"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { extractTextFromFile, chunkText, validateFile, getFileIcon, TextChunk } from '@/lib/fileExtractor';

interface FileUploaderProps {
  onTextExtracted: (text: string, chunks: TextChunk[], fileName: string) => void;
  onError?: (error: string) => void;
}

export default function FileUploader({ onTextExtracted, onError }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setSuccess(false);

    if (acceptedFiles.length === 0) {
      const err = 'No file selected';
      setError(err);
      onError?.(err);
      return;
    }

    const selectedFile = acceptedFiles[0];

    // Validate file
    const validation = validateFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      onError?.(validation.error || 'Invalid file');
      return;
    }

    setFile(selectedFile);
    setIsExtracting(true);
    setExtractionProgress(10);

    try {
      // Extract text
      setExtractionProgress(30);
      const extractedText = await extractTextFromFile(selectedFile);

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the file');
      }

      setExtractionProgress(60);

      // Chunk text
      const chunks = chunkText(extractedText, 500, 50);

      if (chunks.length === 0) {
        throw new Error('Failed to chunk text');
      }

      setExtractionProgress(90);

      // Success
      setSuccess(true);
      setExtractionProgress(100);
      onTextExtracted(extractedText, chunks, selectedFile.name);

      // Reset after 2 seconds
      setTimeout(() => {
        setExtractionProgress(0);
      }, 2000);

    } catch (err: any) {
      console.error('File extraction error:', err);
      const errorMessage = err.message || 'Failed to extract text from file';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsExtracting(false);
    }
  }, [onTextExtracted, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isExtracting
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setExtractionProgress(0);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isExtracting ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg font-medium text-blue-600">Drop the file here...</p>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your course material here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, DOCX, and TXT files (max 10MB)
            </p>
          </>
        )}
      </div>

      {/* Selected File */}
      {file && !isExtracting && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getFileIcon(file.name)}</span>
            <div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Extraction Progress */}
      {isExtracting && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">Extracting text...</span>
            <span className="text-gray-600">{extractionProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${extractionProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800">
            Text extracted successfully! Ready to upload.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
