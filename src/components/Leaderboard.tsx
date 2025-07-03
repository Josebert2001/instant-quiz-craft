import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { LeaderboardEntry } from "@/types/quiz";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export const Leaderboard = ({ entries, currentUserId }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.id === currentUserId;
            
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
                  isCurrentUser 
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' 
                    : rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-10 h-10">
                  {getRankIcon(rank)}
                </div>

                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={rank <= 3 ? getRankColor(rank) : 'bg-gray-200'}>
                    {entry.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                      {entry.name}
                    </span>
                    {isCurrentUser && <Badge variant="outline">You</Badge>}
                  </div>
                  <div className="text-sm text-gray-600">
                    {entry.streak} day streak
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {entry.points.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            );
          })}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No leaderboard data yet. Complete some quizzes to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};