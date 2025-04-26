
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export const TopicInput = ({ onSubmit, isLoading }: TopicInputProps) => {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter any topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      <Button
        type="submit"
        disabled={!topic.trim() || isLoading}
        className="w-full bg-quiz-primary hover:bg-quiz-primary/90"
      >
        {isLoading ? "Generating Quiz..." : "Generate Quiz"}
      </Button>
    </form>
  );
};

