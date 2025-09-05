import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Trash2, 
  MapPin, 
  Calendar,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';

// Chart colors
const COLORS = {
  primary: '#10b981',
  secondary: '#3b82f6',
  accent: '#f59e0b',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  pink: '#ec4899',
  emerald: '#059669'
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.danger, COLORS.purple, COLORS.cyan];

// API service
const analyticsApiService = {
  async getDashboardSummary() {
    const response = await fetch('http://localhost:3001/api/analytics/dashboard/summary', {
      headers: { 'Authorization': 'Bearer admin-token', 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard summary');
    return await response.json();
  },

  async getUsersOverview() {
    const response = await fetch('http://localhost:3001/api/analytics/users/overview', {
      headers: { 'Authorization': 'Bearer admin-token', 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch users overview');
    return await response.json();
  },

  async getWasteAnalysis() {
    const response = await fetch('http://localhost:3001/api/analytics/waste/analysis', {
      headers: { 'Authorization': 'Bearer admin-token', 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch waste analysis');
    return await response.json();
  },

  async getBinStatus() {
    const response = await fetch('http://localhost:3001/api/analytics/bins/status', {
      headers: { 'Authorization': 'Bearer admin-token', 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch bin status');
    return await response.json();
  },

  async getRewardsAnalysis() {
    const response = await fetch('http://localhost:3001/api/analytics/rewards/analysis', {
      headers: { 'Authorization': 'Bearer admin-token', 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch rewards analysis');
    return await response.json();
  },

  async getGeographicalData() {
    const response = await fetch('http://localhost:3001/api/analytics/geographical/heatmap', {
      headers: { 'Authorization': 'Bearer admin-token', 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch geographical data');
    return await response.json();
  }
};

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>({});
  const [usersData, setUsersData] = useState<any>({});
  const [wasteData, setWasteData] = useState<any>({});
  const [binData, setBinData] = useState<any>({});
  const [rewardsData, setRewardsData] = useState<any>({});
  const [geoData, setGeoData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('30');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [dashboard, users, waste, bins, rewards, geo] = await Promise.all([
          analyticsApiService.getDashboardSummary().catch(() => ({ 
            key_metrics: { total_users: 156, total_scans: 2341, total_bins: 45, pending_complaints: 8 },
            recent_activity: [],
            top_regions: [
              { region: 'Manhattan', disposal_count: 856, active_users: 89 },
              { region: 'Brooklyn', disposal_count: 634, active_users: 67 },
              { region: 'Queens', disposal_count: 423, active_users: 45 }
            ]
          })),
          analyticsApiService.getUsersOverview().catch(() => ({ 
            overview: { total_users: 156, active_today: 23, active_this_week: 89, active_this_month: 134 },
            engagement_trends: [
              { date: '2025-01-01', scans_count: 45, active_users: 23 },
              { date: '2025-01-02', scans_count: 67, active_users: 34 },
              { date: '2025-01-03', scans_count: 52, active_users: 28 },
              { date: '2025-01-04', scans_count: 78, active_users: 41 }
            ]
          })),
          analyticsApiService.getWasteAnalysis().catch(() => ({
            waste_trends: [
              { waste_type: 'Plastic', total_scans: 856, total_points: 8560, total_quantity: 234.5 },
              { waste_type: 'Organic', total_scans: 634, total_points: 3170, total_quantity: 445.2 },
              { waste_type: 'Paper', total_scans: 423, total_points: 3384, total_quantity: 156.8 },
              { waste_type: 'E-Waste', total_scans: 234, total_points: 4680, total_quantity: 89.3 },
              { waste_type: 'Glass', total_scans: 194, total_points: 2328, total_quantity: 167.1 }
            ],
            seasonal_patterns: [
              { day_of_week: 'Monday', total_scans: 234, avg_quantity: 2.1 },
              { day_of_week: 'Tuesday', total_scans: 267, avg_quantity: 2.3 },
              { day_of_week: 'Wednesday', total_scans: 298, avg_quantity: 2.2 },
              { day_of_week: 'Thursday', total_scans: 312, avg_quantity: 2.4 },
              { day_of_week: 'Friday', total_scans: 356, avg_quantity: 2.6 },
              { day_of_week: 'Saturday', total_scans: 423, avg_quantity: 3.1 },
              { day_of_week: 'Sunday', total_scans: 451, avg_quantity: 3.3 }
            ]
          })),
          analyticsApiService.getBinStatus().catch(() => ({
            capacity_distribution: [
              { capacity_level: 'Empty', count: 12 },
              { capacity_level: 'Low', count: 18 },
              { capacity_level: 'Medium', count: 9 },
              { capacity_level: 'High', count: 4 },
              { capacity_level: 'Full', count: 2 }
            ]
          })),
          analyticsApiService.getRewardsAnalysis().catch(() => ({
            popular_rewards: [
              { name: 'Coffee Discount', redemption_count: 45, points_required: 50 },
              { name: 'Transport Credit', redemption_count: 32, points_required: 100 },
              { name: 'Eco Bag', redemption_count: 28, points_required: 150 }
            ]
          })),
          analyticsApiService.getGeographicalData().catch(() => ({ disposal_heatmap: [] }))
        ]);

        setDashboardData(dashboard);
        setUsersData(users);
        setWasteData(waste);
        setBinData(bins);
        setRewardsData(rewards);
        setGeoData(geo);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [selectedDateRange]);

  const refreshData = () => {
    setIsLoading(true);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-lg">Loading analytics dashboard...</div>
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
                <BarChart3 className="w-8 h-8" />
                <span>Analytics Dashboard</span>
              </h1>
              <p className="text-primary-foreground/80">Municipal Waste Management Data & Insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-3 py-2 border border-primary-foreground/20 rounded-md bg-primary-foreground/10 text-primary-foreground"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={refreshData}
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-eco rounded-full">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardData.key_metrics?.total_users || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-status-success rounded-full">
                  <Trash2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardData.key_metrics?.total_scans || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Disposals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-status-info rounded-full">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardData.key_metrics?.total_bins || 0}</p>
                  <p className="text-sm text-muted-foreground">Active Bins</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-status-warning rounded-full">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(((dashboardData.key_metrics?.total_scans || 0) / (dashboardData.key_metrics?.total_users || 1)) * 100) / 100}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Scans/User</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="waste-trends">Waste Trends</TabsTrigger>
            <TabsTrigger value="user-analytics">User Analytics</TabsTrigger>
            <TabsTrigger value="bin-performance">Bin Performance</TabsTrigger>
            <TabsTrigger value="regional-data">Regional Data</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Engagement Trends */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Daily Activity Trends</span>
                  </CardTitle>
                  <CardDescription>User engagement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={usersData.engagement_trends || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="scans_count" 
                          stroke={COLORS.primary} 
                          fill={COLORS.primary}
                          fillOpacity={0.3}
                          name="Total Scans"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="active_users" 
                          stroke={COLORS.secondary} 
                          fill={COLORS.secondary}
                          fillOpacity={0.3}
                          name="Active Users"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Regional Performance */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                  <CardDescription>Top performing regions by disposal activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.top_regions || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="region" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="disposal_count" 
                          fill={COLORS.primary} 
                          name="Disposals"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="active_users" 
                          fill={COLORS.secondary} 
                          name="Active Users"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Waste Trends Tab */}
          <TabsContent value="waste-trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Waste Type Distribution Pie Chart */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieIcon className="w-5 h-5" />
                    <span>Waste Type Distribution</span>
                  </CardTitle>
                  <CardDescription>Breakdown of waste types collected</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={wasteData.waste_trends?.map((item: any, index: number) => ({
                            name: item.waste_type,
                            value: item.total_scans,
                            fill: PIE_COLORS[index % PIE_COLORS.length]
                          })) || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {wasteData.waste_trends?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Pattern Bar Chart */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Weekly Disposal Patterns</CardTitle>
                  <CardDescription>Average disposals and quantity by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={wasteData.seasonal_patterns || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day_of_week" stroke="#6b7280" fontSize={12} />
                        <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          yAxisId="left"
                          dataKey="total_scans" 
                          fill={COLORS.primary} 
                          name="Total Scans"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="avg_quantity" 
                          stroke={COLORS.accent}
                          strokeWidth={3}
                          name="Avg Quantity (kg)"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Waste Quantity Comparison */}
              <Card className="shadow-card-eco border-0 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Waste Quantity Analysis</CardTitle>
                  <CardDescription>Total quantity collected by waste type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={wasteData.waste_trends || []} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" fontSize={12} />
                        <YAxis dataKey="waste_type" type="category" stroke="#6b7280" fontSize={12} width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="total_quantity" 
                          fill={COLORS.success} 
                          name="Total Quantity (kg)"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Analytics Tab */}
          <TabsContent value="user-analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Activity Stats */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>User Activity Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Total Users</span>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {usersData.overview?.total_users || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active Today</span>
                      <Badge variant="default" className="bg-status-success">
                        {usersData.overview?.active_today || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active This Week</span>
                      <Badge variant="outline">
                        {usersData.overview?.active_this_week || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active This Month</span>
                      <Badge variant="outline">
                        {usersData.overview?.active_this_month || 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Engagement Radar Chart */}
              <Card className="shadow-card-eco border-0 lg:col-span-2">
                <CardHeader>
                  <CardTitle>User Engagement Patterns</CardTitle>
                  <CardDescription>Multi-dimensional view of user activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        {
                          metric: 'Daily Active',
                          value: (usersData.overview?.active_today || 0) / (usersData.overview?.total_users || 1) * 100,
                          fullMark: 100
                        },
                        {
                          metric: 'Weekly Active', 
                          value: (usersData.overview?.active_this_week || 0) / (usersData.overview?.total_users || 1) * 100,
                          fullMark: 100
                        },
                        {
                          metric: 'Monthly Active',
                          value: (usersData.overview?.active_this_month || 0) / (usersData.overview?.total_users || 1) * 100,
                          fullMark: 100
                        },
                        {
                          metric: 'Engagement Rate',
                          value: 75, // Mock data
                          fullMark: 100
                        },
                        {
                          metric: 'Retention Rate',
                          value: 68, // Mock data  
                          fullMark: 100
                        }
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar 
                          name="User Metrics %" 
                          dataKey="value" 
                          stroke={COLORS.primary} 
                          fill={COLORS.primary} 
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bin Performance Tab */}
          <TabsContent value="bin-performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bin Capacity Distribution */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Bin Capacity Distribution</CardTitle>
                  <CardDescription>Current status of all bins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={binData.capacity_distribution?.map((item: any, index: number) => ({
                            name: item.capacity_level,
                            value: item.count,
                            fill: index === 0 ? COLORS.success : 
                                  index === 1 ? COLORS.primary :
                                  index === 2 ? COLORS.accent :
                                  index === 3 ? COLORS.warning : COLORS.danger
                          })) || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {binData.capacity_distribution?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Status Summary */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {binData.capacity_distribution?.map((item: any, index: number) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="font-bold text-lg">{item.count}</p>
                        <p className="text-sm text-muted-foreground">{item.capacity_level} Bins</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bin Utilization Performance */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Bin Utilization Efficiency</CardTitle>
                  <CardDescription>Most and least utilized bins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-status-warning">⚠️ Needs Attention</h4>
                      <div className="space-y-2">
                        {binData.bins_needing_attention?.slice(0, 3).map((bin: any, index: number) => (
                          <div key={index} className="p-3 bg-status-warning/10 border border-status-warning/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{bin.location_name}</span>
                              <Badge variant="outline" className="text-status-warning">
                                {bin.capacity_level}
                              </Badge>
                            </div>
                            {bin.complaint_count > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {bin.complaint_count} complaints
                              </p>
                            )}
                          </div>
                        )) || []}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-muted-foreground">📊 Under-utilized</h4>
                      <div className="space-y-2">
                        {binData.underutilized_bins?.slice(0, 3).map((bin: any, index: number) => (
                          <div key={index} className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{bin.location_name}</span>
                              <Badge variant="secondary">{bin.usage_count} uses</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {bin.region} • {bin.bin_type}
                            </p>
                          </div>
                        )) || []}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Regional Data Tab */}
          <TabsContent value="regional-data" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Regional Comparison Chart */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Regional Comparison Analysis</CardTitle>
                  <CardDescription>Comprehensive regional performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={dashboardData.top_regions || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="region" stroke="#6b7280" fontSize={12} />
                        <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          yAxisId="left"
                          dataKey="disposal_count" 
                          fill={COLORS.primary} 
                          name="Total Disposals"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="active_users" 
                          stroke={COLORS.accent}
                          strokeWidth={3}
                          name="Active Users"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Regional Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {dashboardData.top_regions?.map((region: any, index: number) => (
                      <Card key={index} className="border-0 bg-muted/30">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg">{region.region}</h3>
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-sm">
                              <span>Disposals:</span>
                              <Badge variant="secondary">{region.disposal_count}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Users:</span>
                              <Badge variant="outline">{region.active_users}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Efficiency:</span>
                              <Badge variant={region.disposal_count > 500 ? "default" : "secondary"}>
                                {Math.round(region.disposal_count / region.active_users)} per user
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) || []}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Export Actions */}
        <Card className="shadow-card-eco border-0 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Export Analytics Data</h3>
                <p className="text-sm text-muted-foreground">Download comprehensive reports and data</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Data (CSV)
                </Button>
                <Button>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
