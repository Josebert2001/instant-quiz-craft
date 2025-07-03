import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Settings } from "lucide-react";
import { useState } from "react";

export interface QuizSettings {
  topic: string;
  numQuestions: number;
  difficulty: string;
  model: string;
}

interface TopicInputProps {
  onSubmit: (settings: QuizSettings) => void;
  isLoading: boolean;
}

export const TopicInput = ({ onSubmit, isLoading }: TopicInputProps) => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit({
        topic: topic.trim(),
        numQuestions,
        difficulty,
        model
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Create Your Quiz
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              type="text"
              placeholder="Enter any topic (e.g., World History, JavaScript, Biology)..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="text-base"
            />
          </div>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAdvanced(!showAdvanced)}>
            <Settings className="h-4 w-4" />
            <Label className="cursor-pointer">Advanced Settings</Label>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="numQuestions">Number of Questions</Label>
                <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama-3.3-70b-versatile">Llama 3.3 70B (Recommended)</SelectItem>
                    <SelectItem value="llama-3.1-70b-versatile">Llama 3.1 70B</SelectItem>
                    <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B (Faster)</SelectItem>
                    <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isLoading ? "Generating Quiz..." : "Generate Quiz"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};