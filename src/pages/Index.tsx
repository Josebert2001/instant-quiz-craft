import { useState, useEffect } from "react";
import { HistoryTopicSelector, historyPeriods } from "@/components/HistoryTopicSelector";
import { QuizSettings } from "@/components/QuizSettings";
import { HistoryQuiz } from "@/components/HistoryQuiz";
import { Achievements } from "@/components/Achievements";
import { Leaderboard } from "@/components/Leaderboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateHistoryQuiz } from "@/utils/historyQuizGenerator";
import { useToast } from "@/hooks/use-toast";
import { Question, QuizSettings as QuizSettingsType, UserProgress, LeaderboardEntry } from "@/types/quiz";
import { BookOpen, Trophy, Target, Users } from "lucide-react";

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [currentSettings, setCurrentSettings] = useState<QuizSettingsType | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalQuizzes: 5,
    totalPoints: 1250,
    streak: 3,
    achievements: [
      {
        id: 'first-quiz',
        title: 'Getting Started',
        description: 'Complete your first quiz',
        icon: '🎯',
        unlockedAt: new Date(),
        points: 50
      }
    ],
    topicMastery: {
      'ancient': 75,
      'medieval': 60,
      'renaissance': 40
    }
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { id: '1', name: 'Alex Johnson', points: 2450, streak: 7 },
    { id: '2', name: 'Sarah Chen', points: 2100, streak: 5 },
    { id: '3', name: 'Mike Rodriguez', points: 1890, streak: 4 },
    { id: 'current', name: 'You', points: 1250, streak: 3 },
    { id: '5', name: 'Emma Wilson', points: 1100, streak: 2 }
  ]);

  const { toast } = useToast();

  const handlePeriodSelect = (period: any) => {
    setSelectedPeriod(period.id);
    setShowSettings(true);
  };

  const handleStartQuiz = async (settings: QuizSettingsType) => {
    setIsLoading(true);
    setCurrentSettings(settings);
    try {
      const generatedQuestions = await generateHistoryQuiz(settings);
      setQuestions(generatedQuestions);
      toast({
        title: "History Quiz Ready!",
        description: `Generated ${generatedQuestions.length} questions about ${settings.period}`,
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

  const handleQuizComplete = (score: number, answers: any[]) => {
    // Update user progress
    setUserProgress(prev => ({
      ...prev,
      totalQuizzes: prev.totalQuizzes + 1,
      totalPoints: prev.totalPoints + score,
      streak: prev.streak + 1
    }));

    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} points! Great job learning history.`,
    });
  };

  const handleReset = () => {
    setQuestions(null);
    setCurrentSettings(null);
    setShowSettings(false);
    setSelectedPeriod("");
  };

  if (questions && currentSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <ThemeToggle />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {historyPeriods.find(p => p.id === selectedPeriod)?.name} Quiz
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {currentSettings.numQuestions} questions • {currentSettings.difficulty} difficulty
              {currentSettings.timeLimit && ` • ${currentSettings.timeLimit}s per question`}
            </p>
          </div>
          <HistoryQuiz
            questions={questions}
            onComplete={handleQuizComplete}
            onReset={handleReset}
            timeLimit={currentSettings.timeLimit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🏛️ HistoryQuest
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Explore the past through interactive quizzes and unlock your potential as a history scholar
          </p>
        </div>

        {!showSettings ? (
          <Tabs defaultValue="quiz" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Take Quiz
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quiz">
              <HistoryTopicSelector
                onPeriodSelect={handlePeriodSelect}
                selectedPeriod={selectedPeriod}
              />
            </TabsContent>

            <TabsContent value="achievements">
              <Achievements userProgress={userProgress} />
            </TabsContent>

            <TabsContent value="progress">
              <Achievements userProgress={userProgress} />
            </TabsContent>

            <TabsContent value="leaderboard">
              <Leaderboard entries={leaderboard} currentUserId="current" />
            </TabsContent>
          </Tabs>
        ) : (
          <QuizSettings
            onStartQuiz={handleStartQuiz}
            selectedPeriod={selectedPeriod}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Index;