import { useState, useEffect } from 'react';
import { Gift, Trophy, Star, CheckCircle, Coffee, ShoppingBag, Smartphone, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { apiService, type Reward as ApiReward } from '@/lib/api';

interface Achievement {
  name: string;
  description: string;
  points: number;
  icon: string;
  earned: boolean;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryColor: string;
  points: number;
  icon: any;
  available: boolean;
}

const Rewards = () => {
  const { toast } = useToast();
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    currentLevel: 1,
    pointsToNextLevel: 200,
    itemsRecycled: 0,
    co2Saved: 0
  });
  const [rewards, setRewards] = useState<ApiReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch user data
        const user = await apiService.getUser('johara');
        const userStatsData = await apiService.getUserStats(user.id);
        
        setUserStats({
          totalPoints: user.total_points,
          currentLevel: Math.floor(user.total_points / 200) + 1,
          pointsToNextLevel: 200 - (user.total_points % 200),
          itemsRecycled: userStatsData.scan_statistics.reduce((sum: number, stat: any) => sum + stat.scan_count, 0),
          co2Saved: Math.round(user.total_points * 0.02 * 100) / 100
        });
        
        // Fetch rewards
        const rewardsData = await apiService.getRewards();
        setRewards(rewardsData);
      } catch (error) {
        console.error('Failed to fetch rewards data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const achievements: Achievement[] = [
    {
      name: 'First Scan',
      description: 'Complete your first waste scan',
      points: 10,
      icon: '🎯',
      earned: true
    },
    {
      name: 'Eco Warrior',
      description: 'Scan 10 waste items',
      points: 50,
      icon: '🌱',
      earned: true
    },
    {
      name: 'Recycling Hero',
      description: 'Recycle 25 items correctly',
      points: 100,
      icon: '♻️',
      earned: false
    },
    {
      name: 'Green Champion',
      description: 'Save 20kg of CO₂',
      points: 200,
      icon: '🏆',
      earned: false
    }
  ];

  // Helper function to get icon for reward category
  const getRewardIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food & drink':
      case 'food & drinks':
        return Coffee;
      case 'transport':
        return ShoppingBag;
      case 'merchandise':
        return ShoppingBag;
      case 'environmental':
        return Trophy;
      case 'energy':
        return Crown;
      default:
        return Gift;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food & drink':
      case 'food & drinks':
        return 'bg-orange-500';
      case 'transport':
        return 'bg-blue-500';
      case 'merchandise':
        return 'bg-purple-500';
      case 'environmental':
        return 'bg-green-500';
      case 'energy':
        return 'bg-reward-gold';
      default:
        return 'bg-gray-500';
    }
  };

  const handleRedeem = (reward: ApiReward) => {
    if (userStats.totalPoints >= reward.points_required) {
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed ${reward.name}`,
        duration: 5000
      });
    } else {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.points_required - userStats.totalPoints} more points`,
        variant: "destructive"
      });
    }
  };

  const progressPercentage = ((userStats.totalPoints % 1000) / 1000) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Rewards Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Redeem your eco-points for amazing rewards and track your environmental impact
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Your Progress */}
          <div className="lg:col-span-2">
            <Card className="shadow-card-eco border-0 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="w-6 h-6 text-primary" />
                  <span>Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Total Points */}
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2 reward-pulse">
                    {userStats.totalPoints}
                  </div>
                  <p className="text-muted-foreground">Total Eco-Points</p>
                </div>

                {/* Level Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Level {userStats.currentLevel}</span>
                    <span className="text-sm text-muted-foreground">
                      {userStats.pointsToNextLevel} points to next level
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-status-success mb-1">
                      {userStats.itemsRecycled}
                    </div>
                    <p className="text-sm text-muted-foreground">Items Recycled</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-status-info mb-1">
                      {userStats.co2Saved}kg
                    </div>
                    <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div>
            <Card className="shadow-card-eco border-0 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-6 h-6 text-reward-gold" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                      achievement.earned
                        ? 'bg-status-success/10 border-status-success/30'
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.earned ? 'text-status-success' : 'text-muted-foreground'
                      }`}>
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{achievement.points} pts</p>
                    </div>
                    {achievement.earned ? (
                      <Badge variant="secondary" className="bg-status-success/20 text-status-success text-xs">
                        Earned
                      </Badge>
                    ) : (
                      <CheckCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reward Store */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Reward Store</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward) => {
              const Icon = getRewardIcon(reward.category);
              const categoryColor = getCategoryColor(reward.category);
              const canAfford = userStats.totalPoints >= reward.points_required;
              
              return (
                <Card 
                  key={reward.id} 
                  className="shadow-card-eco border-0 eco-hover group"
                >
                  <CardContent className="p-6 text-center space-y-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 ${categoryColor} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>

                    {/* Reward Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">{reward.name}</h3>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                      
                      {/* Category Badge */}
                      <Badge 
                        variant="outline" 
                        className={`${categoryColor} text-primary-foreground border-0 text-xs`}
                      >
                        {reward.category}
                      </Badge>
                    </div>

                    {/* Points and Button */}
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-primary">
                        {reward.points_required}<span className="text-sm text-muted-foreground">pts</span>
                      </div>
                      
                      <Button
                        variant={canAfford ? "eco" : "outline"}
                        size="sm"
                        className="w-full"
                        disabled={!reward.is_active || !canAfford}
                        onClick={() => handleRedeem(reward)}
                      >
                        {!reward.is_active ? 'Coming Soon' : canAfford ? 'Redeem' : 'Not Enough Points'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <Card className="mt-12 shadow-card-eco border-0 bg-gradient-nature">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">🎁</div>
              <h3 className="text-xl font-bold text-primary-foreground">
                Earn More Points!
              </h3>
              <p className="text-primary-foreground/90">
                Keep scanning waste and recycling responsibly to unlock more amazing rewards
              </p>
              <Button 
                variant="secondary"
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => window.location.href = '/scan'}
              >
                <Star className="w-4 h-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rewards;