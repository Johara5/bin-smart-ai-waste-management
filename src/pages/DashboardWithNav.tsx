import { useState, useEffect } from 'react';
import { apiService, type User } from '@/lib/api';
import { 
  MapPin, 
  Bot, 
  QrCode, 
  Gift, 
  Recycle, 
  Leaf, 
  Trophy, 
  TrendingUp,
  Navigation as NavigationIcon,
  Camera,
  MessageCircle,
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SimpleAIAssistant from '@/components/SimpleAIAssistant';

const DashboardWithNav = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Johara');
  const [userStats, setUserStats] = useState({
    totalDisposals: 0,
    rewardPoints: 0,
    co2Saved: 0,
    currentLevel: 'Beginner',
    nextLevelPoints: 100
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Try to get user data - for demo using hardcoded username
        const user = await apiService.getUser('johara');
        const userStatsData = await apiService.getUserStats(user.id);
        
        setUserStats({
          totalDisposals: userStatsData.scan_statistics.reduce((sum: number, stat: any) => sum + stat.scan_count, 0),
          rewardPoints: user.total_points,
          co2Saved: Math.round(user.total_points * 0.02 * 100) / 100, // Estimate: 1 point = 0.02kg CO2 saved
          currentLevel: user.total_points > 500 ? 'Eco Champion' : user.total_points > 200 ? 'Eco Warrior' : 'Beginner',
          nextLevelPoints: user.total_points > 500 ? 1000 - user.total_points : user.total_points > 200 ? 500 - user.total_points : 200 - user.total_points
        });
        
        setUserName(user.username);
        
        // Set default recent activities for demo
        setRecentActivities([
          { date: '2 hours ago', type: 'Plastic Bottle', points: 15, icon: '🍼' },
          { date: 'Yesterday', type: 'Organic Waste', points: 8, icon: '🥬' },
          { date: '2 days ago', type: 'E-Waste', points: 25, icon: '📱' },
          { date: '3 days ago', type: 'Paper', points: 10, icon: '📄' },
        ]);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Create default user if not exists
        try {
          await apiService.createUser('johara', 'johara@example.com');
          // Set fallback data
          setRecentActivities([
            { date: 'Demo', type: 'Start Scanning', points: 0, icon: '👋' }
          ]);
        } catch (createError) {
          console.error('Failed to create user:', createError);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const quickActions = [
    {
      icon: MapPin,
      title: 'Locate Nearest Bin',
      description: 'Find smart bins near you',
      color: 'bg-status-info',
      onClick: () => navigate('/bins')
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Ask about waste disposal',
      color: 'bg-gradient-eco',
      onClick: () => setIsAIAssistantOpen(true)
    },
    {
      icon: QrCode,
      title: 'Scan Waste QR',
      description: 'Verify your disposal',
      color: 'bg-status-success',
      onClick: () => navigate('/scan')
    },
    {
      icon: Gift,
      title: 'My Rewards',
      description: 'Check points & redeem',
      color: 'bg-reward-gold',
      onClick: () => navigate('/rewards')
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <header className="bg-gradient-earth p-6 text-primary-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                <span>Welcome, {userName}</span>
                <Leaf className="w-6 h-6 text-accent-foreground animate-pulse" />
              </h1>
              <p className="text-primary-foreground/80">Ready to make a difference today?</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                {userStats.currentLevel}
              </Badge>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <UserIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-eco rounded-full">
                  <Recycle className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userStats.totalDisposals}</p>
                  <p className="text-sm text-muted-foreground">Total Disposals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-reward-gold rounded-full">
                  <Trophy className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground reward-pulse">{userStats.rewardPoints}</p>
                  <p className="text-sm text-muted-foreground">Reward Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-status-success rounded-full">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userStats.co2Saved}kg</p>
                  <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Level */}
        <Card className="shadow-card-eco border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Progress to Next Level</span>
              <Badge variant="outline">{userStats.nextLevelPoints} points to go</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={80} 
              className="h-3 bg-secondary"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Keep disposing responsibly to unlock Eco Champion status!
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="shadow-card-eco border-0 cursor-pointer eco-hover group"
                onClick={action.onClick}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 ${action.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <NavigationIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{activity.icon}</span>
                      <div>
                        <p className="font-medium text-foreground">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-status-success/20 text-status-success">
                      +{activity.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <Card className="shadow-card-eco border-0 bg-gradient-nature">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">🌍</div>
              <h3 className="text-xl font-bold text-primary-foreground">
                Every Action Counts!
              </h3>
              <p className="text-primary-foreground/80">
                You've helped save {userStats.co2Saved}kg of CO₂ this month. 
                Keep up the great work!
              </p>
              <Button 
                variant="secondary"
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => navigate('/scan')}
              >
                <Camera className="w-4 h-4 mr-2" />
                Dispose Something Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant Modal */}
      <SimpleAIAssistant 
        isOpen={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
      />
    </div>
  );
};

export default DashboardWithNav;