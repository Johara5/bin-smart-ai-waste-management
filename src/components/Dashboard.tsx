import { useState } from 'react';
import { 
  MapPin, 
  Bot, 
  QrCode, 
  Gift, 
  Recycle, 
  Leaf, 
  Trophy, 
  TrendingUp,
  Navigation,
  Camera,
  MessageCircle,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const [userName] = useState('Johara');
  const [userStats] = useState({
    totalDisposals: 47,
    rewardPoints: 1250,
    co2Saved: 23.5,
    currentLevel: 'Eco Warrior',
    nextLevelPoints: 250
  });

  const quickActions = [
    {
      icon: MapPin,
      title: 'Locate Nearest Bin',
      description: 'Find smart bins near you',
      color: 'bg-status-info',
      onClick: () => console.log('Navigate to maps')
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Ask about waste disposal',
      color: 'bg-gradient-eco',
      onClick: () => console.log('Open AI assistant')
    },
    {
      icon: QrCode,
      title: 'Scan Waste QR',
      description: 'Verify your disposal',
      color: 'bg-status-success',
      onClick: () => console.log('Open QR scanner')
    },
    {
      icon: Gift,
      title: 'My Rewards',
      description: 'Check points & redeem',
      color: 'bg-reward-gold',
      onClick: () => console.log('Open rewards')
    }
  ];

  const recentActivities = [
    { date: '2 hours ago', type: 'Plastic Bottle', points: 15, icon: '🍼' },
    { date: 'Yesterday', type: 'Organic Waste', points: 8, icon: '🥬' },
    { date: '2 days ago', type: 'E-Waste', points: 25, icon: '📱' },
    { date: '3 days ago', type: 'Paper', points: 10, icon: '📄' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-earth p-6 text-primary-foreground">
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
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <Card className="shadow-card-eco border-0">
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
        <div className="space-y-4">
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
                    <Navigation className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
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
              >
                <Camera className="w-4 h-4 mr-2" />
                Dispose Something Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;