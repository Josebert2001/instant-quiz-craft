import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuizQuestion } from "./QuizQuestion";
import { useState } from "react";
import { Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  questions: Question[];
  onReset: () => void;
}

export const Quiz = ({ questions, onReset }: QuizProps) => {
  const [answers, setAnswers] = useState<(string | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (!isSubmitted) {
      const newAnswers = [...answers];
      newAnswers[questionIndex] = answer;
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const getScorePercentage = () => {
    return Math.round((calculateScore() / questions.length) * 100);
  };

  const getScoreMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return "Excellent! Outstanding performance!";
    if (percentage >= 80) return "Great job! Well done!";
    if (percentage >= 70) return "Good work! Keep it up!";
    if (percentage >= 60) return "Not bad! Room for improvement.";
    return "Keep studying! You'll do better next time.";
  };

  const answeredQuestions = answers.filter(answer => answer !== null).length;
  const progressPercentage = (answeredQuestions / questions.length) * 100;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {!isSubmitted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Progress</span>
              <span className="text-sm font-normal">
                {answeredQuestions} of {questions.length} answered
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="w-full" />
          </CardContent>
        </Card>
      )}

      {questions.map((question, index) => (
        <QuizQuestion
          key={index}
          questionNumber={index + 1}
          question={question.question}
          options={question.options}
          selectedAnswer={answers[index]}
          correctAnswer={question.correctAnswer}
          onSelect={(answer) => handleAnswerSelect(index, answer)}
          isSubmitted={isSubmitted}
        />
      ))}

      <Card className="sticky bottom-4 bg-white/95 backdrop-blur-sm border-2">
        <CardContent className="pt-6">
          {!isSubmitted ? (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {answeredQuestions === questions.length 
                  ? "All questions answered! Ready to submit?" 
                  : `${questions.length - answeredQuestions} questions remaining`
                }
              </div>
              <Button
                onClick={handleSubmit}
                disabled={answers.some((answer) => answer === null)}
                className="bg-quiz-primary hover:bg-quiz-primary/90"
                size="lg"
              >
                Submit Quiz
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold">
                    {calculateScore()} / {questions.length}
                  </span>
                </div>
                <div className="text-lg font-medium text-quiz-primary mb-1">
                  {getScorePercentage()}% Score
                </div>
                <div className="text-gray-600">{getScoreMessage()}</div>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{calculateScore()} Correct</span>
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span>{questions.length - calculateScore()} Incorrect</span>
                </div>
              </div>

              <Button 
                onClick={onReset} 
                className="w-full" 
                variant="outline"
                size="lg"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Create New Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};