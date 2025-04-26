
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedAnswer: string | null;
  correctAnswer: string;
  onSelect: (answer: string) => void;
  isSubmitted: boolean;
}

export const QuizQuestion = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  onSelect,
  isSubmitted,
}: QuizQuestionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium leading-6">{question}</h3>
      <RadioGroup
        value={selectedAnswer || ""}
        onValueChange={onSelect}
        className="space-y-2"
      >
        {options.map((option) => {
          const isCorrect = isSubmitted && option === correctAnswer;
          const isWrong = isSubmitted && selectedAnswer === option && option !== correctAnswer;

          return (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option}
                id={option}
                disabled={isSubmitted}
                className={cn(
                  isCorrect && "border-green-500",
                  isWrong && "border-red-500"
                )}
              />
              <Label
                htmlFor={option}
                className={cn(
                  "flex-grow p-2 rounded-md",
                  isCorrect && "text-green-600 font-medium",
                  isWrong && "text-red-600"
                )}
              >
                {option}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

