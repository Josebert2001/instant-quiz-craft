import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Settings, Clock, Target, Zap } from "lucide-react";
import { useState } from "react";
import { QuizSettings as QuizSettingsType } from "@/types/quiz";

interface QuizSettingsProps {
  onStartQuiz: (settings: QuizSettingsType) => void;
  selectedPeriod: string;
  isLoading: boolean;
}

export const QuizSettings = ({ onStartQuiz, selectedPeriod, isLoading }: QuizSettingsProps) => {
  const [numQuestions, setNumQuestions] = useState([10]);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [timeLimit, setTimeLimit] = useState([30]);
  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [questionTypes, setQuestionTypes] = useState(['multiple-choice']);

  const questionTypeOptions = [
    { id: 'multiple-choice', label: 'Multiple Choice', icon: '🔘' },
    { id: 'true-false', label: 'True/False', icon: '✓✗' },
    { id: 'fill-blank', label: 'Fill in the Blank', icon: '📝' },
    { id: 'matching', label: 'Matching Pairs', icon: '🔗' }
  ];

  const handleQuestionTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setQuestionTypes([...questionTypes, typeId]);
    } else {
      setQuestionTypes(questionTypes.filter(t => t !== typeId));
    }
  };

  const handleStartQuiz = () => {
    const settings: QuizSettingsType = {
      topic: selectedPeriod,
      period: selectedPeriod,
      numQuestions: numQuestions[0],
      difficulty,
      timeLimit: hasTimeLimit ? timeLimit[0] : undefined,
      questionTypes,
      model: 'llama-3.3-70b-versatile'
    };
    onStartQuiz(settings);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quiz Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Number of Questions */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Number of Questions: {numQuestions[0]}
          </Label>
          <Slider
            value={numQuestions}
            onValueChange={setNumQuestions}
            max={20}
            min={5}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">●</span>
                  Beginner - Basic historical facts
                </div>
              </SelectItem>
              <SelectItem value="intermediate">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">●</span>
                  Intermediate - Moderate analysis
                </div>
              </SelectItem>
              <SelectItem value="advanced">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">●</span>
                  Advanced - Complex connections
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Limit */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Limit
            </Label>
            <Switch checked={hasTimeLimit} onCheckedChange={setHasTimeLimit} />
          </div>
          {hasTimeLimit && (
            <>
              <Slider
                value={timeLimit}
                onValueChange={setTimeLimit}
                max={120}
                min={15}
                step={15}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                {timeLimit[0]} seconds per question
              </div>
            </>
          )}
        </div>

        {/* Question Types */}
        <div className="space-y-3">
          <Label>Question Types</Label>
          <div className="grid grid-cols-2 gap-3">
            {questionTypeOptions.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={questionTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleQuestionTypeChange(type.id, !!checked)}
                />
                <Label htmlFor={type.id} className="text-sm cursor-pointer">
                  {type.icon} {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleStartQuiz}
          disabled={questionTypes.length === 0 || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <Zap className="h-4 w-4 mr-2" />
          {isLoading ? 'Generating Quiz...' : 'Start History Quiz'}
        </Button>
      </CardContent>
    </Card>
  );
};