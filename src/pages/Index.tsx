
import { useState } from "react";
import { TopicInput } from "@/components/TopicInput";
import { Quiz, Question } from "@/components/Quiz";

// Temporary mock data generator - replace with AI API call later
const generateMockQuestions = (topic: string): Question[] => {
  return [
    {
      question: `What is the main focus of ${topic}?`,
      options: [
        "Understanding core concepts",
        "Memorizing facts",
        "Practical applications",
        "Historical context",
      ],
      correctAnswer: "Understanding core concepts",
    },
    {
      question: `Which of these is most related to ${topic}?`,
      options: [
        "Theoretical framework",
        "Scientific method",
        "Data analysis",
        "Research methodology",
      ],
      correctAnswer: "Theoretical framework",
    },
    {
      question: `Who is considered the founder of modern ${topic}?`,
      options: [
        "Ancient scholars",
        "Contemporary researchers",
        "Scientific pioneers",
        "Academic institutions",
      ],
      correctAnswer: "Scientific pioneers",
    },
  ];
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);

  const handleTopicSubmit = async (topic: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setQuestions(generateMockQuestions(topic));
      setIsLoading(false);
    }, 1500);
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

