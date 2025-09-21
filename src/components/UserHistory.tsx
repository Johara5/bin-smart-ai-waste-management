import { useState, useEffect } from 'react';
import { 
  History, 
  Download, 
  Trophy, 
  Calendar, 
  Filter, 
  TrendingUp,
  Recycle,
  Award,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';

// API service for history and reports
const historyApiService = {
  async getUserHistory(userId: number, page = 1, limit = 20, filters: any = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    const response = await fetch(`http://localhost:8080/api/reports/history/${userId}?${params}`);
    if (!response.ok) throw new Error('Failed to fetch user history');
    return await response.json();
  },

  async getLeaderboard(period = 'monthly', category = 'points', limit = 10) {
    const params = new URLSearchParams({ period, category, limit: limit.toString() });
    
    const response = await fetch(`http://localhost:8080/api/reports/leaderboard?${params}`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return await response.json();
  },

  async getUserSummary(userId) {
    const response = await fetch(`http://localhost:8080/api/reports/summary/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user summary');
    return await response.json();
  },

  async exportUserHistory(userId, format = 'csv') {
    const response = await fetch(`http://localhost:8080/api/reports/export/history/${userId}?format=${format}`);
    if (!response.ok) throw new Error('Failed to export history');
    
    if (format === 'csv') {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `disposal_history_${userId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      return await response.json();
    }
  },

  async exportLeaderboard(period = 'all', format = 'csv') {
    const response = await fetch(`http://localhost:8080/api/reports/export/leaderboard?period=${period}&format=${format}`);
    if (!response.ok) throw new Error('Failed to export leaderboard');
    
    if (format === 'csv') {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `leaderboard_${period}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      return await response.json();
    }
  }
};

const UserHistory = () => {
  const currentUserId = 1; // This should come from user context/auth
  const [userHistory, setUserHistory] = useState({
    history: [],
    summary: {},
    pagination: { page: 1, total: 0, has_more: false }
  });
  const [leaderboard, setLeaderboard] = useState({
    leaderboard: [],
    period: 'monthly',
    category: 'points',
    period_stats: {}
  });
  const [userSummary, setUserSummary] = useState({
    user_stats: {},
    waste_breakdown: [],
    monthly_progress: [],
    milestones: [],
    estimated_co2_impact: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    waste_type: 'all',
    date_from: '',
    date_to: ''
  });
  const [leaderboardFilter, setLeaderboardFilter] = useState({
    period: 'monthly',
    category: 'points'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [history, leaderboardData, summary] = await Promise.all([
          historyApiService.getUserHistory(currentUserId, currentPage, 20, filters),
          historyApiService.getLeaderboard(leaderboardFilter.period, leaderboardFilter.category, 20),
          historyApiService.getUserSummary(currentUserId)
        ]);
        
        setUserHistory(history);
        setLeaderboard(leaderboardData);
        setUserSummary(summary);
      } catch (error) {
        console.error('Failed to fetch history data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUserId, currentPage, filters, leaderboardFilter]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleLeaderboardFilterChange = (newFilters: any) => {
    setLeaderboardFilter(newFilters);
  };

  const loadMoreHistory = () => {
    if (userHistory.pagination.has_more) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-lg">Loading your history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <header className="bg-gradient-earth p-6 text-primary-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <History className="w-8 h-8" />
                <span>My Eco Journey</span>
              </h1>
              <p className="text-primary-foreground/80">Track your environmental impact and achievements</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => historyApiService.exportUserHistory(currentUserId)}
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-eco rounded-full">
                  <Recycle className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userSummary.user_stats.total_disposals || 0}</p>
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
                  <p className="text-2xl font-bold text-foreground reward-pulse">{userSummary.user_stats.total_points || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
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
                  <p className="text-2xl font-bold text-foreground">{userSummary.estimated_co2_impact}kg</p>
                  <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-status-info rounded-full">
                  <Calendar className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userSummary.user_stats.active_days || 0}</p>
                  <p className="text-sm text-muted-foreground">Active Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="history">Disposal History</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Disposal History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Filters */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>Filters & Export</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4">
                    <select 
                      value={filters.waste_type}
                      onChange={(e) => handleFilterChange({ ...filters, waste_type: e.target.value })}
                      className="px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="all">All Waste Types</option>
                      <option value="Plastic">Plastic</option>
                      <option value="Organic">Organic</option>
                      <option value="Paper">Paper</option>
                      <option value="E-Waste">E-Waste</option>
                      <option value="Glass">Glass</option>
                    </select>
                    
                    <input
                      type="date"
                      value={filters.date_from}
                      onChange={(e) => handleFilterChange({ ...filters, date_from: e.target.value })}
                      className="px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="From Date"
                    />
                    
                    <input
                      type="date"
                      value={filters.date_to}
                      onChange={(e) => handleFilterChange({ ...filters, date_to: e.target.value })}
                      className="px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="To Date"
                    />
                    
                    <Button 
                      variant="outline"
                      onClick={() => historyApiService.exportUserHistory(currentUserId)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* History List */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Your Disposal History</CardTitle>
                  <CardDescription>
                    Showing {userHistory.history.length} of {userHistory.pagination.total} total disposals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userHistory.history.map((disposal: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-gradient-eco rounded-full">
                            <Recycle className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{disposal.waste_type}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(disposal.scan_date).toLocaleDateString()} • 
                              {disposal.bin_location || 'Unknown Location'} • 
                              {disposal.quantity}kg
                            </p>
                            {disposal.confidence_score && (
                              <p className="text-xs text-muted-foreground">
                                Confidence: {disposal.confidence_score}%
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="bg-status-success/20 text-status-success">
                            +{disposal.points_earned} pts
                          </Badge>
                          {disposal.region && (
                            <p className="text-xs text-muted-foreground mt-1">{disposal.region}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {userHistory.pagination.has_more && (
                      <div className="text-center pt-4">
                        <Button variant="outline" onClick={loadMoreHistory}>
                          Load More History
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Waste Type Breakdown */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Waste Type Breakdown</CardTitle>
                  <CardDescription>Your contribution by waste category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userSummary.waste_breakdown.map((waste: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{waste.waste_type}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{waste.scan_count} scans</Badge>
                            <Badge variant="outline">{waste.points_from_type} pts</Badge>
                          </div>
                        </div>
                        <Progress 
                          value={(waste.scan_count / Math.max(...userSummary.waste_breakdown.map((w: any) => w.scan_count))) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Progress */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Monthly Progress</CardTitle>
                  <CardDescription>Your activity over the past year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userSummary.monthly_progress.slice(0, 6).map((month: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">{month.month_name} {month.year}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{month.disposals} disposals</Badge>
                          <Badge variant="outline">{month.points} pts</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="space-y-6">
              {/* Leaderboard Filters */}
              <Card className="shadow-card-eco border-0">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <select 
                      value={leaderboardFilter.period}
                      onChange={(e) => handleLeaderboardFilterChange({ ...leaderboardFilter, period: e.target.value })}
                      className="px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="weekly">This Week</option>
                      <option value="monthly">This Month</option>
                      <option value="all_time">All Time</option>
                    </select>
                    
                    <select 
                      value={leaderboardFilter.category}
                      onChange={(e) => handleLeaderboardFilterChange({ ...leaderboardFilter, category: e.target.value })}
                      className="px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="points">Points</option>
                      <option value="disposals">Disposals</option>
                      <option value="co2_saved">CO₂ Saved</option>
                    </select>
                    
                    <Button 
                      variant="outline"
                      onClick={() => historyApiService.exportLeaderboard(leaderboardFilter.period)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Leaderboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Leaderboard */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-reward-gold" />
                    <span>Eco Champions Leaderboard</span>
                  </CardTitle>
                  <CardDescription>
                    Top contributors ({leaderboardFilter.period}) • Ranked by {leaderboardFilter.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.leaderboard.map((user: any, index: number) => (
                      <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                        user.rank <= 3 ? 'bg-gradient-to-r from-reward-gold/20 to-transparent' : 'bg-muted/50'
                      }`}>
                        <div className="flex items-center space-x-4">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            user.rank === 1 ? 'bg-yellow-500' :
                            user.rank === 2 ? 'bg-gray-400' :
                            user.rank === 3 ? 'bg-orange-600' :
                            'bg-gradient-eco'
                          }`}>
                            <span className="text-primary-foreground font-bold text-sm">{user.rank}</span>
                          </div>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Badge variant={user.badge === 'Gold' ? 'default' : 'secondary'} className="text-xs">
                                {user.badge}
                              </Badge>
                              {user.region && <span>• {user.region}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {leaderboardFilter.category === 'points' ? `${user.total_points} pts` :
                             leaderboardFilter.category === 'disposals' ? `${user.total_disposals} disposals` :
                             `${user.estimated_co2_saved}kg CO₂`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.total_waste_disposed}kg waste • {user.total_disposals} disposals
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Milestones */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-reward-gold" />
                    <span>Your Milestones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userSummary.milestones.map((milestone: any, index: number) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        milestone.achieved ? 'bg-status-success/10 border-status-success/20' : 'bg-muted/50 border-border'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-semibold ${milestone.achieved ? 'text-status-success' : 'text-foreground'}`}>
                            {milestone.title}
                          </h3>
                          {milestone.achieved && (
                            <Badge variant="default" className="bg-status-success">
                              ✓ Achieved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                        {!milestone.achieved && milestone.progress && (
                          <div className="space-y-1">
                            <Progress value={milestone.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">{milestone.progress.toFixed(1)}% complete</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Impact */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Environmental Impact</CardTitle>
                  <CardDescription>Your contribution to a cleaner planet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🌍</div>
                      <h3 className="text-2xl font-bold text-status-success">{userSummary.estimated_co2_impact}kg</h3>
                      <p className="text-muted-foreground">CO₂ emissions prevented</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold">{userSummary.user_stats.total_waste_disposed || 0}kg</p>
                        <p className="text-xs text-muted-foreground">Waste Diverted</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold">{userSummary.user_stats.waste_types_used || 0}</p>
                        <p className="text-xs text-muted-foreground">Categories Used</p>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-nature rounded-lg">
                      <p className="text-primary-foreground font-medium">
                        🌱 Keep up the great work! Every disposal makes a difference.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserHistory;
