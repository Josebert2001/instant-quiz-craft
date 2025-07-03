import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizQuestionProps {
  questionNumber: number;
  question: string;
  options: string[];
  selectedAnswer: string | null;
  correctAnswer: string;
  onSelect: (answer: string) => void;
  isSubmitted: boolean;
}

export const QuizQuestion = ({
  questionNumber,
  question,
  options,
  selectedAnswer,
  correctAnswer,
  onSelect,
  isSubmitted,
}: QuizQuestionProps) => {
  return (
    <Card className={cn(
      "transition-all duration-200",
      isSubmitted && selectedAnswer === correctAnswer && "border-green-500 bg-green-50 dark:bg-green-950/20",
      isSubmitted && selectedAnswer !== correctAnswer && selectedAnswer && "border-red-500 bg-red-50 dark:bg-red-950/20"
    )}>
      <CardHeader>
        <CardTitle className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
            {questionNumber}
          </span>
          <span className="leading-relaxed">{question}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer || ""}
          onValueChange={onSelect}
          className="space-y-3"
        >
          {options.map((option, index) => {
            const isCorrect = isSubmitted && option === correctAnswer;
            const isWrong = isSubmitted && selectedAnswer === option && option !== correctAnswer;
            const isSelected = selectedAnswer === option;

            return (
              <div 
                key={index} 
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200",
                  !isSubmitted && "hover:bg-muted/50 cursor-pointer",
                  isCorrect && "bg-green-100 border-green-300 dark:bg-green-950/30 dark:border-green-700",
                  isWrong && "bg-red-100 border-red-300 dark:bg-red-950/30 dark:border-red-700",
                  !isSubmitted && isSelected && "bg-primary/10 border-primary"
                )}
              >
                <RadioGroupItem
                  value={option}
                  id={`${questionNumber}-${index}`}
                  disabled={isSubmitted}
                  className={cn(
                    isCorrect && "border-green-500 text-green-500",
                    isWrong && "border-red-500 text-red-500"
                  )}
                />
                <Label
                  htmlFor={`${questionNumber}-${index}`}
                  className={cn(
                    "flex-grow cursor-pointer leading-relaxed",
                    isCorrect && "text-green-700 dark:text-green-300 font-medium",
                    isWrong && "text-red-700 dark:text-red-300"
                  )}
                >
                  {option}
                </Label>
                {isSubmitted && (
                  <div className="flex-shrink-0">
                    {isCorrect && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                    {isWrong && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                  </div>
                )}
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};