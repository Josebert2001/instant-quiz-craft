import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Flame, Target, BookOpen, Clock } from "lucide-react";
import { Achievement, UserProgress } from "@/types/quiz";

interface AchievementsProps {
  userProgress: UserProgress;
}

const achievementTemplates = [
  {
    id: 'first-quiz',
    title: 'Getting Started',
    description: 'Complete your first quiz',
    icon: '🎯',
    requirement: 1,
    type: 'quizzes'
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Complete 10 quizzes',
    icon: '🏆',
    requirement: 10,
    type: 'quizzes'
  },
  {
    id: 'streak-3',
    title: 'On Fire',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    requirement: 3,
    type: 'streak'
  },
  {
    id: 'perfect-score',
    title: 'Perfectionist',
    description: 'Score 100% on a quiz',
    icon: '⭐',
    requirement: 100,
    type: 'score'
  },
  {
    id: 'ancient-expert',
    title: 'Ancient Civilizations Expert',
    description: 'Master ancient history topics',
    icon: '🏛️',
    requirement: 80,
    type: 'topic-mastery'
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a timed quiz in record time',
    icon: '⚡',
    requirement: 1,
    type: 'speed'
  }
];

export const Achievements = ({ userProgress }: AchievementsProps) => {
  const getAchievementProgress = (achievement: any) => {
    switch (achievement.type) {
      case 'quizzes':
        return Math.min((userProgress.totalQuizzes / achievement.requirement) * 100, 100);
      case 'streak':
        return Math.min((userProgress.streak / achievement.requirement) * 100, 100);
      case 'score':
        return userProgress.achievements.some(a => a.id === achievement.id) ? 100 : 0;
      default:
        return 0;
    }
  };

  const isUnlocked = (achievement: any) => {
    return userProgress.achievements.some(a => a.id === achievement.id);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Achievements</h2>
        <p className="text-gray-600">Track your learning progress and unlock rewards</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProgress.totalQuizzes}</div>
            <div className="text-sm text-gray-600">Quizzes Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProgress.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Flame className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProgress.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProgress.achievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievementTemplates.map((achievement) => {
          const progress = getAchievementProgress(achievement);
          const unlocked = isUnlocked(achievement);
          
          return (
            <Card key={achievement.id} className={`transition-all duration-200 ${
              unlocked ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300' : 'opacity-75'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{achievement.icon}</div>
                  {unlocked && <Badge className="bg-yellow-500">Unlocked!</Badge>}
                </div>
                <CardTitle className="text-lg">{achievement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};