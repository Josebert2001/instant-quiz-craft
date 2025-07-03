import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Star, 
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from "lucide-react";
import { Question } from "@/types/quiz";

interface HistoryQuizProps {
  questions: Question[];
  onComplete: (score: number, answers: any[]) => void;
  onReset: () => void;
  timeLimit?: number;
}

export const HistoryQuiz = ({ questions, onComplete, onReset, timeLimit }: HistoryQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>(new Array(questions.length).fill(null));
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timeLimit && timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLimit && timeRemaining === 0 && !isCompleted) {
      handleNext();
    }
  }, [timeRemaining, timeLimit, isCompleted]);

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      completeQuiz();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setTimeRemaining(timeLimit || 0);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimeRemaining(timeLimit || 0);
      setShowExplanation(false);
    }
  };

  const completeQuiz = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsCompleted(true);
    onComplete(finalScore, answers);
  };

  const calculateScore = () => {
    return answers.reduce((total, answer, index) => {
      const question = questions[index];
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        return total + (answer === question.correctAnswer ? question.points : 0);
      }
      // Add logic for other question types
      return total;
    }, 0);
  };

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={answers[currentQuestion] || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQ.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'true-false':
        return (
          <RadioGroup
            value={answers[currentQuestion] || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="flex-grow cursor-pointer">True</Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="flex-grow cursor-pointer">False</Label>
            </div>
          </RadioGroup>
        );

      case 'fill-blank':
        return (
          <div className="space-y-3">
            <Input
              placeholder="Type your answer here..."
              value={answers[currentQuestion] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              className="text-lg p-4"
            />
          </div>
        );

      default:
        return <div>Question type not supported yet</div>;
    }
  };

  if (isCompleted) {
    const percentage = Math.round((score / questions.reduce((sum, q) => sum + q.points, 0)) * 100);
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-blue-600">{percentage}%</div>
            <div className="text-lg text-gray-600">
              {score} out of {questions.reduce((sum, q) => sum + q.points, 0)} points
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            {percentage >= 90 && <Badge className="bg-gold text-white">🏆 Excellent</Badge>}
            {percentage >= 80 && <Badge className="bg-green-500 text-white">⭐ Great Job</Badge>}
            {percentage >= 70 && <Badge className="bg-blue-500 text-white">👍 Good Work</Badge>}
          </div>

          <Button onClick={onReset} className="w-full" size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Another Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Badge className={cn(
                currentQ.difficulty === 'beginner' && 'bg-green-500',
                currentQ.difficulty === 'intermediate' && 'bg-yellow-500',
                currentQ.difficulty === 'advanced' && 'bg-red-500'
              )}>
                {currentQ.difficulty}
              </Badge>
            </div>
            {timeLimit && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={cn(
                  timeRemaining <= 10 && 'text-red-500 font-bold',
                  timeRemaining <= 30 && timeRemaining > 10 && 'text-yellow-500'
                )}>
                  {timeRemaining}s
                </span>
              </div>
            )}
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {currentQ.question}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="h-4 w-4" />
            <span>{currentQ.points} points</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderQuestion()}
          
          {showExplanation && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Explanation</h4>
                  <p className="text-blue-800">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {!showExplanation && answers[currentQuestion] && (
                <Button
                  variant="outline"
                  onClick={() => setShowExplanation(true)}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Show Explanation
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};