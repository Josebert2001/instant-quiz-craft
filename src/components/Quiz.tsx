
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "./QuizQuestion";
import { useState } from "react";

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

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {questions.map((question, index) => (
        <QuizQuestion
          key={index}
          question={question.question}
          options={question.options}
          selectedAnswer={answers[index]}
          correctAnswer={question.correctAnswer}
          onSelect={(answer) => handleAnswerSelect(index, answer)}
          isSubmitted={isSubmitted}
        />
      ))}
      <div className="flex justify-between items-center pt-4">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={answers.some((answer) => answer === null)}
            className="bg-quiz-primary hover:bg-quiz-primary/90"
          >
            Submit Quiz
          </Button>
        ) : (
          <div className="w-full space-y-4">
            <div className="text-lg font-medium text-center">
              Your Score: {calculateScore()} out of {questions.length}
            </div>
            <Button onClick={onReset} className="w-full">
              Try Another Topic
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

