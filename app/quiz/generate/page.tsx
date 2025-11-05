"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Loader, Plus, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { generateQuizQuestions, createPersonalQuiz, createLiveQuiz, Question } from '@/lib/quizApi';
import { toast } from 'react-hot-toast';

export default function GenerateQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState<'settings' | 'edit'>('settings');
  const [quizType, setQuizType] = useState<'personal' | 'live'>('personal');

  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    subject: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    questionCount: 10,
    includeExplanations: true,
    timeLimit: 0
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);

    try {
      const generated = await generateQuizQuestions({
        topic: formData.topic.trim(),
        subject: formData.subject.trim() || undefined,
        difficulty: formData.difficulty,
        questionCount: formData.questionCount,
        includeExplanations: formData.includeExplanations
      });

      setQuestions(generated);
      setStep('edit');
      toast.success(`Generated ${generated.length} questions!`);
    } catch (error: any) {
      console.error('Generate error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!formData.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsCreating(true);

    try {
      if (quizType === 'live') {
        // Live quizzes need pre-generated questions
        if (questions.length === 0) {
          toast.error('Please generate questions first');
          setIsCreating(false);
          return;
        }

        const quiz = await createLiveQuiz({
          title: formData.title.trim() || `${formData.topic} Quiz`,
          topic: formData.topic.trim(),
          subject: formData.subject.trim() || undefined,
          difficulty: formData.difficulty,
          questions,
          timeLimit: formData.timeLimit > 0 ? formData.timeLimit : undefined
        });
        toast.success('Live quiz created!');
        router.push(`/quiz/live/${quiz._id}`);
      } else {
        // Personal quizzes are generated automatically by backend
        const quiz = await createPersonalQuiz({
          topic: formData.topic.trim(),
          course: formData.subject.trim() || undefined,
          difficulty: formData.difficulty,
          numberQuestions: formData.questionCount
        });
        toast.success('Personal quiz created!');
        router.push(`/quiz/take/${quiz._id}`);
      }
    } catch (error: any) {
      console.error('Create quiz error:', error);
      toast.error(error.response?.data?.error || 'Failed to create quiz');
    } finally {
      setIsCreating(false);
    }
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        questionText: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        correctAnswer: '',
        explanation: ''
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Generate Quiz</h1>
          <p className="text-gray-600 mt-2">
            Create AI-generated quizzes for your study topics
          </p>
        </div>

        {/* Quiz Type Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quiz Type</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setQuizType('personal')}
              className={`p-4 rounded-lg border-2 transition-all ${
                quizType === 'personal'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-1">Personal Quiz</h3>
              <p className="text-sm text-gray-600">Take the quiz at your own pace</p>
            </button>
            <button
              onClick={() => setQuizType('live')}
              className={`p-4 rounded-lg border-2 transition-all ${
                quizType === 'live'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-1">Live Quiz</h3>
              <p className="text-sm text-gray-600">Compete with others in real-time</p>
            </button>
          </div>
        </div>

        {/* Quiz Settings */}
        {step === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quiz Settings</h2>

            <div className="space-y-4">
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Data Structures"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Computer Science"
                />
              </div>

              {/* Difficulty & Question Count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={formData.questionCount}
                    onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Time Limit (for live quizzes) */}
              {quizType === 'live' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes, 0 = no limit)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Include Explanations */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="explanations"
                  checked={formData.includeExplanations}
                  onChange={(e) => setFormData({ ...formData, includeExplanations: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="explanations" className="text-sm text-gray-700">
                  Include explanations for answers
                </label>
              </div>
            </div>

            {/* Different buttons for personal vs live quizzes */}
            {quizType === 'personal' ? (
              <button
                onClick={handleCreateQuiz}
                disabled={isCreating || !formData.topic.trim()}
                className={`
                  mt-6 w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
                  ${isCreating || !formData.topic.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {isCreating ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Creating Quiz with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Create Personal Quiz</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !formData.topic.trim()}
                className={`
                  mt-6 w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
                  ${isGenerating || !formData.topic.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {isGenerating ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Generating Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Questions</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Step 2: Edit Questions */}
        {step === 'edit' && questions.length > 0 && (
          <div className="space-y-6">
            {/* Quiz Title */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Data Structures Quiz - Week 3"
                required
              />
            </div>

            {/* Questions */}
            {questions.map((question, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Question {index + 1}</h3>
                  <button
                    onClick={() => deleteQuestion(index)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => updateQuestion(index, { questionText: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="radio"
                          checked={question.correctAnswer === option.text}
                          onChange={() => updateQuestion(index, { correctAnswer: option.text })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => {
                            const newOptions = [...question.options];
                            newOptions[optIndex] = { text: e.target.value, isCorrect: option.isCorrect };
                            updateQuestion(index, { options: newOptions });
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Option ${optIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  {formData.includeExplanations && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation (Optional)
                      </label>
                      <textarea
                        value={question.explanation || ''}
                        onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Explain why this answer is correct..."
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add Question Button */}
            <button
              onClick={addQuestion}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>Add Another Question</span>
            </button>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => setStep('settings')}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreateQuiz}
                disabled={isCreating || !formData.title.trim()}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
                  ${isCreating || !formData.title.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {isCreating ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Live Quiz</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
