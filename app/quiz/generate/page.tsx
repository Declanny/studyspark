"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader, Plus, Trash2 } from 'lucide-react';
import { generateQuizQuestions, createPersonalQuiz, createLiveQuiz, Question } from '@/lib/quizApi';
import { toast } from 'react-hot-toast';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

function GenerateQuizContent() {
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            Generate Quiz
          </h1>
          <p className="text-muted-foreground text-lg">
            Create AI-generated quizzes for your study topics
          </p>
        </div>

        {/* Quiz Type Selection */}
        <Card className="p-6 border-2 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quiz Type</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setQuizType('personal')}
              className="p-6 rounded-lg border-2 border-border hover:border-primary/50 bg-background transition-all text-left relative overflow-hidden group"
            >
              {/* Overlay when selected */}
              {quizType === 'personal' && (
                <div className="absolute inset-0 bg-primary/10 border-primary border-2 rounded-lg" />
              )}
              
              {/* Checkmark icon */}
              <div className={`absolute top-3 right-3 z-10 transition-all ${
                quizType === 'personal' ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-semibold text-foreground mb-1">Personal Quiz</h3>
                <p className="text-sm text-muted-foreground">Take the quiz at your own pace</p>
              </div>
            </button>
            
            <button
              onClick={() => setQuizType('live')}
              className="p-6 rounded-lg border-2 border-border hover:border-primary/50 bg-background transition-all text-left relative overflow-hidden group"
            >
              {/* Overlay when selected */}
              {quizType === 'live' && (
                <div className="absolute inset-0 bg-primary/10 border-primary border-2 rounded-lg" />
              )}
              
              {/* Checkmark icon */}
              <div className={`absolute top-3 right-3 z-10 transition-all ${
                quizType === 'live' ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-semibold text-foreground mb-1">Live Quiz</h3>
                <p className="text-sm text-muted-foreground">Compete with others in real-time</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Quiz Settings */}
        {step === 'settings' && (
          <Card className="p-6 border-2">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quiz Settings</h2>

            <div className="space-y-4">
              {/* Topic */}
              <div>
                <Label htmlFor="topic">
                  Topic <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="topic"
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Data Structures"
                  required
                  className="mt-2"
                />
              </div>

              {/* Subject */}
              <div>
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Computer Science"
                  className="mt-2"
                />
              </div>

              {/* Difficulty & Question Count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value as any })}
                  >
                    <SelectTrigger id="difficulty" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="questionCount">Number of Questions</Label>
                  <Input
                    id="questionCount"
                    type="number"
                    min="5"
                    max="50"
                    value={formData.questionCount}
                    onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Time Limit (for live quizzes) */}
              {quizType === 'live' && (
                <div>
                  <Label htmlFor="timeLimit">Time Limit (minutes, 0 = no limit)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="0"
                    max="180"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                    className="mt-2"
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
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <Label htmlFor="explanations" className="text-sm font-normal cursor-pointer">
                  Include explanations for answers
                </Label>
              </div>
            </div>

            {/* Different buttons for personal vs live quizzes */}
            <div className="mt-6 flex">
              {quizType === 'personal' ? (
                <Button
                  onClick={handleCreateQuiz}
                  disabled={isCreating || !formData.topic.trim()}
                  className="border-2 border-border cursor-pointer"
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Creating Quiz with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Create Personal Quiz
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !formData.topic.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Step 2: Edit Questions */}
        {step === 'edit' && questions.length > 0 && (
          <div className="space-y-6">
            {/* Quiz Title */}
            <Card className="p-6 border-2">
              <Label htmlFor="quizTitle">
                Quiz Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quizTitle"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Data Structures Quiz - Week 3"
                required
                className="mt-2"
              />
            </Card>

            {/* Questions */}
            {questions.map((question, index) => (
              <Card key={index} className="p-6 border-2">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Question {index + 1}</h3>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteQuestion(index)}
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <Label htmlFor={`question-${index}`}>Question</Label>
                    <Textarea
                      id={`question-${index}`}
                      value={question.questionText}
                      onChange={(e) => updateQuestion(index, { questionText: e.target.value })}
                      rows={2}
                      className="mt-2"
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <Label>Options</Label>
                    <div className="mt-2 space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={question.correctAnswer === option.text}
                            onChange={() => updateQuestion(index, { correctAnswer: option.text })}
                            className="w-4 h-4 text-primary"
                          />
                          <Input
                            type="text"
                            value={option.text}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[optIndex] = { text: e.target.value, isCorrect: option.isCorrect };
                              updateQuestion(index, { options: newOptions });
                            }}
                            placeholder={`Option ${optIndex + 1}`}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  {formData.includeExplanations && (
                    <div>
                      <Label htmlFor={`explanation-${index}`}>Explanation (Optional)</Label>
                      <Textarea
                        id={`explanation-${index}`}
                        value={question.explanation || ''}
                        onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                        rows={2}
                        className="mt-2"
                        placeholder="Explain why this answer is correct..."
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {/* Add Question Button */}
            <Button
              onClick={addQuestion}
              variant="outline"
              className="w-full border-2 border-dashed"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Another Question
            </Button>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
              <Button
                onClick={() => setStep('settings')}
                variant="outline"
              >
                Back
              </Button>
              <Button
                onClick={handleCreateQuiz}
                disabled={isCreating || !formData.title.trim()}
                size="lg"
              >
                {isCreating ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Live Quiz'
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function GenerateQuizPage() {
  return (
    <ProtectedRoute>
      <GenerateQuizContent />
    </ProtectedRoute>
  );
}
