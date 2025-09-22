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

export default function DashboardFixed() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return {
          name: user.username || user.email || 'User',
          points: user.total_points || 0,
          disposals: 0,
          co2Saved: 0,
          level: 'Beginner',
          nextLevelPoints: 100
        };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return {
      name: 'User',
      points: 0,
      disposals: 0,
      co2Saved: 0,
      level: 'Beginner',
      nextLevelPoints: 100
    };
  };

  const user = getUserData();

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
