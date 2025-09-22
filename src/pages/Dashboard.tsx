<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Recycle, 
  Award, 
  MapPin, 
  BarChart3, 
  Camera, 
  Leaf, 
  LogOut,
  ChevronRight,
  Scan,
  Gift,
  TrendingUp,
  Info,
  Settings,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  
  // Mock user data - in a real app, this would come from authentication context
  const user = {
    name: 'Johara',
    points: 0,
    disposals: 0,
    co2Saved: 0,
    level: 'Beginner',
    nextLevelPoints: 100
  };

  // Mock recent activity
  const recentActivity = [
    { id: 1, type: 'Plastic bottle', date: '2 hours ago', points: 5, location: 'City Center' },
    { id: 2, type: 'Paper waste', date: 'Yesterday', points: 3, location: 'Home' },
  ];

  const handleLogout = () => {
    // In a real app, this would clear authentication state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleScanWaste = () => {
    navigate('/scan');
  };

  const handleFindBins = () => {
    navigate('/bins');
  };

  const handleRewards = () => {
    navigate('/rewards');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 pb-20">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Recycle className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-xl font-bold">EcoBin</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center space-x-1">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="bg-green-600 text-white px-4 pb-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold">Welcome, {user.name} <Leaf className="inline-block ml-1 w-5 h-5" /></h2>
          <p className="text-green-100">Ready to make a difference today?</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-md border-0">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Recycle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{user.disposals}</div>
              <div className="text-xs text-muted-foreground">Total Disposals</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Award className="w-8 h-8 text-amber-500" />
              </div>
              <div className="text-2xl font-bold">{user.points}</div>
              <div className="text-xs text-muted-foreground">Reward Points</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{user.co2Saved}kg</div>
              <div className="text-xs text-muted-foreground">CO₂ Saved</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home">
            {/* Progress to Next Level */}
            <Card className="mb-6 shadow-md border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Progress to Next Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{user.level}</span>
                    <span>Eco Champion</span>
                  </div>
                  <Progress value={user.points} max={user.nextLevelPoints} className="h-2" />
                  <div className="text-xs text-muted-foreground text-center">
                    {user.points} / {user.nextLevelPoints} points to next level
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button 
                onClick={handleScanWaste} 
                className="bg-green-600 hover:bg-green-700 h-auto py-4 flex flex-col items-center"
              >
                <Camera className="h-6 w-6 mb-1" />
                <span>Scan Waste</span>
              </Button>
              <Button 
                onClick={handleFindBins} 
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-50 h-auto py-4 flex flex-col items-center"
              >
                <MapPin className="h-6 w-6 mb-1" />
                <span>Find Bins</span>
              </Button>
            </div>

            {/* Features */}
            <h3 className="font-semibold text-lg mb-3">Features</h3>
            <div className="space-y-3 mb-6">
              <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Scan className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Waste Scanner</h4>
                      <p className="text-sm text-muted-foreground">Identify waste items</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
              
              <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <Gift className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Rewards</h4>
                      <p className="text-sm text-muted-foreground">Redeem your points</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
              
              <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Impact Tracker</h4>
                      <p className="text-sm text-muted-foreground">View your environmental impact</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <Recycle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{activity.type}</h4>
                            <p className="text-xs text-muted-foreground">{activity.date} • {activity.location}</p>
                          </div>
                        </div>
                        <div className="text-amber-600 font-medium">+{activity.points} pts</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Recycle className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="font-medium text-gray-600">No activity yet</h4>
                    <p className="text-sm text-gray-500">Start scanning waste items to track your activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rewards">
            <Card className="shadow-md border-0 mb-6">
              <CardHeader>
                <CardTitle>Your Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-500">{user.points}</h3>
                  <p className="text-sm text-gray-500 mb-4">Available Points</p>
                  
                  <Button className="bg-amber-500 hover:bg-amber-600">
                    Browse Rewards
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <h3 className="font-semibold text-lg mb-3">Available Rewards</h3>
            <div className="space-y-3">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">5% Discount Coupon</h4>
                      <p className="text-sm text-muted-foreground">For eco-friendly products</p>
                    </div>
                    <Button className="bg-amber-500 hover:bg-amber-600">
                      50 pts
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Plant a Tree</h4>
                      <p className="text-sm text-muted-foreground">We'll plant a tree in your name</p>
                    </div>
                    <Button className="bg-amber-500 hover:bg-amber-600">
                      100 pts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card className="shadow-md border-0 mb-6">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                    {user.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.level} Recycler</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Total Disposals</span>
                    <span className="font-medium">{user.disposals}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Reward Points</span>
                    <span className="font-medium">{user.points}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">CO₂ Saved</span>
                    <span className="font-medium">{user.co2Saved}kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Info className="mr-2 h-4 w-4" />
                Help & Support
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex justify-around items-center h-16">
          <button 
            className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'home' ? 'text-green-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('home')}
          >
            <Recycle className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'activity' ? 'text-green-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('activity')}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs mt-1">Activity</span>
          </button>
          <button 
            className="flex flex-col items-center justify-center flex-1 h-full"
            onClick={handleScanWaste}
          >
            <div className="bg-green-600 rounded-full p-3 -mt-6 shadow-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1">Scan</span>
          </button>
          <button 
            className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'rewards' ? 'text-green-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('rewards')}
          >
            <Gift className="h-5 w-5" />
            <span className="text-xs mt-1">Rewards</span>
          </button>
          <button 
            className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'profile' ? 'text-green-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
=======
import { useState, useEffect } from 'react';
<<<<<<<< HEAD:src/pages/DashboardWithNav.tsx
========
import { useNavigate } from 'react-router-dom';
>>>>>>>> f04f7a748d2d287f7dfa658231ea07b3cabffc21:src/pages/Dashboard.tsx
import { 
  MapPin, 
  QrCode, 
  Gift, 
  Recycle, 
  Leaf, 
  Trophy, 
  TrendingUp,
  Camera,
<<<<<<<< HEAD:src/pages/DashboardWithNav.tsx
  MessageCircle,
  User as UserIcon,
========
  User,
  LogOut,
>>>>>>>> f04f7a748d2d287f7dfa658231ea07b3cabffc21:src/pages/Dashboard.tsx
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiService } from '@/lib/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [userStats, setUserStats] = useState({
    totalDisposals: 0,
    rewardPoints: 0,
    co2Saved: 0,
    currentLevel: 'Beginner',
    nextLevelPoints: 100
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!storedUser || !token) {
          navigate('/auth');
          return;
        }
        
        const userData = JSON.parse(storedUser);
        setUserName(userData.username);
        
        // Fetch fresh user data from API
        try {
          const user = await apiService.getUser(userData.username);
          const userStatsData = await apiService.getUserStats(user.id);
          
          setUserStats({
            totalDisposals: userStatsData.scan_statistics.reduce((sum: number, stat: any) => sum + stat.scan_count, 0),
            rewardPoints: user.total_points,
            co2Saved: Math.round(user.total_points * 0.02 * 100) / 100,
            currentLevel: user.total_points > 500 ? 'Eco Champion' : user.total_points > 200 ? 'Eco Warrior' : 'Beginner',
            nextLevelPoints: user.total_points > 500 ? 1000 - user.total_points : user.total_points > 200 ? 500 - user.total_points : 200 - user.total_points
          });
          
          // Mock recent activities
          setRecentActivities([
            { date: '2 hours ago', type: 'Plastic Bottle', points: 10, icon: '🍼' },
            { date: 'Yesterday', type: 'Organic Waste', points: 5, icon: '🥬' },
            { date: '2 days ago', type: 'E-Waste', points: 20, icon: '📱' },
            { date: '3 days ago', type: 'Paper', points: 8, icon: '📄' },
          ]);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Use stored data as fallback
          setUserStats({
            totalDisposals: 0,
            rewardPoints: 0,
            co2Saved: 0,
            currentLevel: 'Beginner',
            nextLevelPoints: 100
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const quickActions = [
    {
      icon: Camera,
      title: 'Scan Waste',
      description: 'Identify and dispose waste properly',
      color: 'bg-gradient-eco',
      onClick: () => navigate('/scan')
    },
    {
      icon: MapPin,
      title: 'Find Bins',
      description: 'Locate smart bins near you',
      color: 'bg-status-info',
      onClick: () => navigate('/bins')
    },
    {
      icon: Gift,
      title: 'My Rewards',
      description: 'Check points & redeem rewards',
      color: 'bg-reward-gold',
      onClick: () => navigate('/rewards')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
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
              value={((userStats.rewardPoints % 200) / 200) * 100} 
              className="h-3 bg-secondary"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Keep disposing responsibly to unlock {userStats.currentLevel === 'Beginner' ? 'Eco Warrior' : 'Eco Champion'} status!
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                You've helped save {userStats.co2Saved}kg of CO₂. Keep up the great work!
              </p>
              <Button 
                variant="secondary"
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => navigate('/scan')}
              >
                <Camera className="w-4 h-4 mr-2" />
                Scan Waste Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
>>>>>>> f04f7a748d2d287f7dfa658231ea07b3cabffc21
