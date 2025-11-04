import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Extract text from PDF file
 */
export async function extractPDFText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is not corrupted.');
  }
}

/**
 * Extract text from DOCX file
 */
export async function extractDOCXText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX. Please ensure the file is not corrupted.');
  }
}

/**
 * Extract text from file based on type
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractPDFText(file);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return extractDOCXText(file);
  } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return await file.text();
  } else {
    throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
  }
}

/**
 * Chunk text into smaller pieces with overlap
 */
export interface TextChunk {
  content: string;
  order: number;
  wordCount: number;
}

export function chunkText(text: string, maxTokens: number = 500, overlapWords: number = 50): TextChunk[] {
  // Clean and normalize text
  const cleanedText = text
    .trim()
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ');

  // Split into paragraphs
  const paragraphs = cleanedText
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const chunks: string[] = [];
  let currentChunk = '';
  let currentTokens = 0;

  const estimateTokens = (text: string) => Math.ceil(text.length / 4);
  const getLastWords = (text: string, n: number) => {
    const words = text.split(/\s+/);
    return words.slice(-n).join(' ');
  };
  const countWords = (text: string) => text.split(/\s+/).filter(w => w.length > 0).length;

  for (const paragraph of paragraphs) {
    const paragraphTokens = estimateTokens(paragraph);

    if (currentTokens + paragraphTokens > maxTokens && currentChunk) {
      // Save current chunk
      chunks.push(currentChunk.trim());

      // Start new chunk with overlap
      const overlap = getLastWords(currentChunk, overlapWords);
      currentChunk = overlap + '\n\n' + paragraph;
      currentTokens = estimateTokens(currentChunk);
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      currentTokens += paragraphTokens;
    }
  }

  // Add last chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Map to TextChunk objects
  return chunks.map((content, index) => ({
    content,
    order: index,
    wordCount: content.split(/\s+/).filter(w => w.length > 0).length
  }));
}

/**
 * Validate file size and type
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  // Check file type
  const fileName = file.name.toLowerCase();
  const isValidType = ALLOWED_TYPES.includes(file.type);
  const isValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

  if (!isValidType && !isValidExtension) {
    return { valid: false, error: 'Invalid file type. Only PDF, DOCX, and TXT files are allowed' };
  }

  return { valid: true };
}

/**
 * Get file icon based on type
 */
export function getFileIcon(fileName: string): string {
  const name = fileName.toLowerCase();
  if (name.endsWith('.pdf')) return '📄';
  if (name.endsWith('.docx')) return '📝';
  if (name.endsWith('.txt')) return '📃';
  return '📁';
}
