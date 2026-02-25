import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, MapPin, Plane, Camera, Globe, Award, Target } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'explorer' | 'planner' | 'social' | 'master';
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserProgress {
  totalPoints: number;
  level: number;
  rank: string;
  achievements: Achievement[];
  streaks: {
    planningStreak: number;
    explorationStreak: number;
  };
}

export default function GamifiedAchievements() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { t } = useTranslation();

  useEffect(() => {
    initializeUserProgress();
  }, []);

  const initializeUserProgress = () => {
    const achievements: Achievement[] = [
      {
        id: 'first_search',
        title: 'Wanderlust Awakened',
        description: 'Performed your first destination search',
        icon: <MapPin className="w-5 h-5" />,
        category: 'explorer',
        points: 50,
        unlocked: true,
        progress: 1,
        maxProgress: 1,
        rarity: 'common'
      },
      {
        id: 'multi_continent',
        title: 'Globe Trotter',
        description: 'Explored destinations across 3 continents',
        icon: <Globe className="w-5 h-5" />,
        category: 'explorer',
        points: 200,
        unlocked: false,
        progress: 2,
        maxProgress: 3,
        rarity: 'rare'
      },
      {
        id: 'quiz_master',
        title: 'Travel Oracle',
        description: 'Completed the travel mood quiz',
        icon: <Star className="w-5 h-5" />,
        category: 'planner',
        points: 100,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        rarity: 'common'
      },
      {
        id: 'event_explorer',
        title: 'Event Hunter',
        description: 'Viewed 5 live travel events',
        icon: <Target className="w-5 h-5" />,
        category: 'explorer',
        points: 150,
        unlocked: false,
        progress: 3,
        maxProgress: 5,
        rarity: 'rare'
      },
      {
        id: 'footprint_starter',
        title: 'Journey Tracker',
        description: 'Added first destination to travel footprint',
        icon: <Camera className="w-5 h-5" />,
        category: 'social',
        points: 75,
        unlocked: true,
        progress: 1,
        maxProgress: 1,
        rarity: 'common'
      },
      {
        id: 'language_explorer',
        title: 'Polyglot Explorer',
        description: 'Switched between 3 different languages',
        icon: <Globe className="w-5 h-5" />,
        category: 'social',
        points: 125,
        unlocked: false,
        progress: 1,
        maxProgress: 3,
        rarity: 'rare'
      },
      {
        id: 'vnx_master',
        title: 'VNX Ecosystem Master',
        description: 'Used all VNX travel tools',
        icon: <Trophy className="w-5 h-5" />,
        category: 'master',
        points: 500,
        unlocked: false,
        progress: 2,
        maxProgress: 4,
        rarity: 'legendary'
      },
      {
        id: 'planning_streak',
        title: 'Planning Perfectionist',
        description: 'Maintained 7-day planning streak',
        icon: <Award className="w-5 h-5" />,
        category: 'planner',
        points: 300,
        unlocked: false,
        progress: 3,
        maxProgress: 7,
        rarity: 'epic'
      }
    ];

    const totalPoints = achievements.reduce((sum, ach) => sum + (ach.unlocked ? ach.points : 0), 0);
    const level = Math.floor(totalPoints / 100) + 1;
    const rank = getRank(level);

    setUserProgress({
      totalPoints,
      level,
      rank,
      achievements,
      streaks: {
        planningStreak: 3,
        explorationStreak: 5
      }
    });
  };

  const getRank = (level: number): string => {
    if (level >= 20) return 'Travel Legend';
    if (level >= 15) return 'Globe Master';
    if (level >= 10) return 'Explorer Pro';
    if (level >= 5) return 'Wanderer';
    return 'Travel Novice';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'explorer': return 'bg-green-100 text-green-800';
      case 'planner': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      case 'master': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? userProgress?.achievements 
    : userProgress?.achievements.filter(ach => ach.category === selectedCategory);

  if (!userProgress) return null;

  return (
    <div className="space-y-6">
      {/* User Progress Summary */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{userProgress.rank}</h3>
              <p className="text-blue-100">Level {userProgress.level}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{userProgress.totalPoints}</div>
              <p className="text-blue-100">Total Points</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>{userProgress.totalPoints % 100}/100</span>
            </div>
            <Progress value={(userProgress.totalPoints % 100)} className="bg-blue-500" />
          </div>
        </CardContent>
      </Card>

      {/* Achievement Dashboard Toggle */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowAchievements(!showAchievements)}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
        >
          <Trophy className="w-4 h-4 mr-2" />
          {showAchievements ? 'Hide Achievements' : 'View Achievements'}
        </Button>
      </div>

      {/* Achievements Grid */}
      {showAchievements && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['all', 'explorer', 'planner', 'social', 'master'].map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All' : category}
              </Button>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements?.map(achievement => (
              <Card key={achievement.id} className={`relative overflow-hidden ${
                achievement.unlocked ? 'bg-gradient-to-br from-green-50 to-blue-50' : 'bg-gray-50'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-200'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={getRarityColor(achievement.rarity)} variant="secondary">
                        {achievement.rarity}
                      </Badge>
                      <Badge className={getCategoryColor(achievement.category)} variant="outline">
                        {achievement.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <h4 className={`font-semibold mb-1 ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className={achievement.unlocked ? 'bg-green-200' : 'bg-gray-200'} 
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-yellow-600">
                      {achievement.points} pts
                    </span>
                    {achievement.unlocked && (
                      <Badge className="bg-green-100 text-green-800">
                        <Trophy className="w-3 h-3 mr-1" />
                        Unlocked
                      </Badge>
                    )}
                  </div>
                </CardContent>

                {/* Shimmer effect for unlocked achievements */}
                {achievement.unlocked && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse" />
                )}
              </Card>
            ))}
          </div>

          {/* Streaks Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-600" />
                Active Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-semibold">Planning Streak</div>
                    <div className="text-sm text-gray-600">Daily planning activities</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {userProgress.streaks.planningStreak} days
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-semibold">Exploration Streak</div>
                    <div className="text-sm text-gray-600">Destination discoveries</div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {userProgress.streaks.explorationStreak} days
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}