import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Globe, Crown, Sword, Factory, Rocket } from "lucide-react";

interface HistoryPeriod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  timeRange: string;
  topics: string[];
  color: string;
}

const historyPeriods: HistoryPeriod[] = [
  {
    id: "ancient",
    name: "Ancient Civilizations",
    description: "From the dawn of civilization to the fall of Rome",
    icon: <Crown className="h-6 w-6" />,
    timeRange: "3500 BCE - 500 CE",
    topics: ["Ancient Egypt", "Ancient Greece", "Roman Empire", "Mesopotamia", "Ancient China"],
    color: "bg-amber-100 border-amber-300 text-amber-800"
  },
  {
    id: "medieval",
    name: "Medieval Period",
    description: "The Middle Ages and the rise of kingdoms",
    icon: <Sword className="h-6 w-6" />,
    timeRange: "500 - 1500 CE",
    topics: ["Byzantine Empire", "Islamic Golden Age", "Crusades", "Black Death", "Vikings"],
    color: "bg-purple-100 border-purple-300 text-purple-800"
  },
  {
    id: "renaissance",
    name: "Renaissance & Exploration",
    description: "Cultural rebirth and age of discovery",
    icon: <Globe className="h-6 w-6" />,
    timeRange: "1400 - 1700 CE",
    topics: ["Italian Renaissance", "Age of Exploration", "Scientific Revolution", "Protestant Reformation"],
    color: "bg-blue-100 border-blue-300 text-blue-800"
  },
  {
    id: "industrial",
    name: "Industrial Revolution",
    description: "The transformation of society through technology",
    icon: <Factory className="h-6 w-6" />,
    timeRange: "1750 - 1900 CE",
    topics: ["Steam Power", "Factory System", "Urbanization", "Labor Movements", "Transportation Revolution"],
    color: "bg-gray-100 border-gray-300 text-gray-800"
  },
  {
    id: "modern",
    name: "Modern Era",
    description: "World wars and the 20th century",
    icon: <Rocket className="h-6 w-6" />,
    timeRange: "1900 - Present",
    topics: ["World War I", "World War II", "Cold War", "Space Race", "Digital Revolution"],
    color: "bg-green-100 border-green-300 text-green-800"
  }
];

interface HistoryTopicSelectorProps {
  onPeriodSelect: (period: HistoryPeriod) => void;
  selectedPeriod?: string;
}

export const HistoryTopicSelector = ({ onPeriodSelect, selectedPeriod }: HistoryTopicSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Historical Period</h2>
        <p className="text-gray-600">Select a time period to explore through interactive quizzes</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {historyPeriods.map((period) => (
          <Card 
            key={period.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              selectedPeriod === period.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onPeriodSelect(period)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${period.color}`}>
                  {period.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{period.name}</CardTitle>
                  <p className="text-sm text-gray-500">{period.timeRange}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{period.description}</p>
              <div className="flex flex-wrap gap-1">
                {period.topics.slice(0, 3).map((topic) => (
                  <Badge key={topic} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
                {period.topics.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{period.topics.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { historyPeriods };