import { useState } from "react";
import { TopicInput, QuizSettings } from "@/components/TopicInput";
import { Quiz, Question } from "@/components/Quiz";
import { generateQuizWithGroq } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const { toast } = useToast();

  const handleTopicSubmit = async (settings: QuizSettings) => {
    setIsLoading(true);
    try {
      const generatedQuestions = await generateQuizWithGroq(settings);
      setQuestions(generatedQuestions);
      toast({
        title: "Quiz Ready!",
        description: `Generated ${generatedQuestions.length} questions about ${settings.topic}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate quiz",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuestions(null);
  };

  return (
    <div className="min-h-screen bg-quiz-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-quiz-dark mb-4">QuizCraft AI</h1>
          <p className="text-lg text-gray-600 mb-8">
            Generate quizzes on any topic instantly
          </p>
        </div>

        {!questions && (
          <TopicInput onSubmit={handleTopicSubmit} isLoading={isLoading} />
        )}

        {questions && <Quiz questions={questions} onReset={handleReset} />}
      </div>
    </div>
  );
};

export default Index;