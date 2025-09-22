import { useState, useEffect } from 'react';
import {
  Users,
  Trash2,
  MapPin,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Download,
  Bell,
  Settings,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Chart colors
const CHART_COLORS = {
  primary: '#10b981',
  secondary: '#3b82f6',
  accent: '#f59e0b',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4'
};

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// Type definitions
interface KeyMetrics {
  total_users: number;
  total_scans: number;
  total_bins: number;
  pending_complaints: number;
}

interface Activity {
  id: number;
  username: string;
  activity_type: 'scan' | 'complaint' | 'other';
  details: string;
  timestamp: string;
}

interface Region {
  region: string;
  disposal_count: number;
  active_users: number;
}

interface UserOverview {
  active_today: number;
  active_this_week: number;
  active_this_month: number;
  new_users_this_month: number;
}

interface DisposalFrequency {
  username: string;
  total_scans: number;
  avg_points_per_scan: number;
}

interface WasteTrend {
  waste_type: string;
  total_scans: number;
  total_points: number;
}

interface SeasonalPattern {
  day_of_week: string;
  total_scans: number;
}

interface EngagementTrend {
  date: string;
  scans_count: number;
  active_users: number;
}

interface CapacityDistribution {
  capacity_level: 'Empty' | 'Low' | 'Medium' | 'High' | 'Full';
  count: number;
}

interface BinNeedingAttention {
  id: number;
  location_name: string;
  capacity_level: string;
  complaint_count: number;
}

interface UnderutilizedBin {
  id: number;
  location_name: string;
  usage_count: number;
  region: string;
  bin_type: string;
  days_since_last_use?: number;
}

interface DashboardData {
  key_metrics: KeyMetrics;
  recent_activity: Activity[];
  top_regions: Region[];
}

interface UsersOverviewData {
  overview: UserOverview;
  disposal_frequency: DisposalFrequency[];
  engagement_trends: EngagementTrend[];
}

interface WasteAnalysisData {
  waste_trends: WasteTrend[];
  daily_trends: unknown[];
  seasonal_patterns: SeasonalPattern[];
}

interface BinStatusData {
  capacity_distribution: CapacityDistribution[];
  bins_needing_attention: BinNeedingAttention[];
  underutilized_bins: UnderutilizedBin[];
}

// API service for admin endpoints
const adminApiService = {
  async getDashboardSummary(): Promise<DashboardData> {
    const response = await fetch('http://localhost:8080/api/analytics/dashboard/summary', {
      headers: {
        'Authorization': 'Bearer admin-token',
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard summary');
    return await response.json();
  },

  async getUsersOverview(): Promise<UsersOverviewData> {
    const response = await fetch('http://localhost:8080/api/analytics/users/overview', {
      headers: {
        'Authorization': 'Bearer admin-token',
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch users overview');
    return await response.json();
  },

  async getWasteAnalysis(): Promise<WasteAnalysisData> {
    const response = await fetch('http://localhost:8080/api/analytics/waste/analysis', {
      headers: {
        'Authorization': 'Bearer admin-token',
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch waste analysis');
    return await response.json();
  },

  async getBinStatus(): Promise<BinStatusData> {
    const response = await fetch('http://localhost:8080/api/analytics/bins/status', {
      headers: {
        'Authorization': 'Bearer admin-token',
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch bin status');
    return await response.json();
  },

  async getGeographicalData(): Promise<unknown> {
    const response = await fetch('http://localhost:8080/api/analytics/geographical/heatmap', {
      headers: {
        'Authorization': 'Bearer admin-token',
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch geographical data');
    return await response.json();
  }
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    key_metrics: {
      total_users: 0,
      total_scans: 0,
      total_bins: 0,
      pending_complaints: 0
    },
    recent_activity: [],
    top_regions: []
  });
  const [usersOverview, setUsersOverview] = useState<UsersOverviewData>({
    overview: {
      active_today: 0,
      active_this_week: 0,
      active_this_month: 0,
      new_users_this_month: 0
    },
    disposal_frequency: [],
    engagement_trends: []
  });
  const [wasteAnalysis, setWasteAnalysis] = useState<WasteAnalysisData>({
    waste_trends: [],
    daily_trends: [],
    seasonal_patterns: []
  });
  const [binStatus, setBinStatus] = useState<BinStatusData>({
    capacity_distribution: [],
    bins_needing_attention: [],
    underutilized_bins: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [dashboard, users, waste, bins] = await Promise.all([
          adminApiService.getDashboardSummary(),
          adminApiService.getUsersOverview(),
          adminApiService.getWasteAnalysis(),
          adminApiService.getBinStatus()
        ]);

        setDashboardData(dashboard);
        setUsersOverview(users);
        setWasteAnalysis(waste);
        setBinStatus(bins);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportReport = async (type: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/analytics/reports/export', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          date_range: 30,
          format: 'csv'
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${type}_report.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-lg">Loading admin dashboard...</div>
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
                <span>Admin Dashboard</span>
              </h1>
              <p className="text-primary-foreground/80">Municipal Waste Management Analytics</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => exportReport('comprehensive')}
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-eco rounded-full">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardData.key_metrics.total_users}</p>
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
                  <p className="text-2xl font-bold text-foreground">{dashboardData.key_metrics.total_scans}</p>
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
                  <p className="text-2xl font-bold text-foreground">{dashboardData.key_metrics.total_bins}</p>
                  <p className="text-sm text-muted-foreground">Active Bins</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-eco border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-status-warning rounded-full">
                  <AlertTriangle className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardData.key_metrics.pending_complaints}</p>
                  <p className="text-sm text-muted-foreground">Pending Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="waste">Waste Analysis</TabsTrigger>
            <TabsTrigger value="bins">Bin Management</TabsTrigger>
            <TabsTrigger value="regions">Regional Data</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities in the past 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.recent_activity.slice(0, 5).map((activity: Activity, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            activity.activity_type === 'scan' ? 'bg-status-success/20' : 'bg-status-warning/20'
                          }`}>
                            {activity.activity_type === 'scan' ?
                              <Trash2 className="w-4 h-4 text-status-success" /> :
                              <AlertTriangle className="w-4 h-4 text-status-warning" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-sm">{activity.username}</p>
                            <p className="text-xs text-muted-foreground">{activity.details}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Regions */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Top Performing Regions</CardTitle>
                  <CardDescription>Regions with highest disposal activity (last 30 days)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.top_regions.map((region: Region, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{region.region || 'Unknown Region'}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{region.disposal_count} disposals</Badge>
                            <Badge variant="outline">{region.active_users} users</Badge>
                          </div>
                        </div>
                        <Progress
                          value={(region.disposal_count / Math.max(...dashboardData.top_regions.map((r: Region) => r.disposal_count))) * 100}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Stats */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Active Today</span>
                      <Badge variant="secondary">{usersOverview.overview?.active_today || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Active This Week</span>
                      <Badge variant="secondary">{usersOverview.overview?.active_this_week || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Active This Month</span>
                      <Badge variant="secondary">{usersOverview.overview?.active_this_month || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>New Users (30 days)</span>
                      <Badge variant="outline">{usersOverview.overview?.new_users_this_month || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Users */}
              <Card className="shadow-card-eco border-0 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Top Contributors</CardTitle>
                  <CardDescription>Users with highest disposal frequency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {usersOverview.disposal_frequency.slice(0, 8).map((user: DisposalFrequency, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-eco rounded-full">
                            <span className="text-primary-foreground font-bold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.username}</p>
                            <p className="text-xs text-muted-foreground">
                              Avg: {Math.round(user.avg_points_per_scan || 0)} pts/scan
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-status-success/20 text-status-success">
                          {user.total_scans} scans
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Waste Analysis Tab */}
          <TabsContent value="waste" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Waste Type Distribution Chart */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Waste Type Distribution</CardTitle>
                  <CardDescription>Total scans by waste category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={wasteAnalysis.waste_trends.map((item: WasteTrend, index: number) => ({
                            name: item.waste_type,
                            value: item.total_scans,
                            fill: PIE_COLORS[index % PIE_COLORS.length]
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {wasteAnalysis.waste_trends.map((entry: WasteTrend, index: number) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {wasteAnalysis.waste_trends.slice(0, 4).map((waste: WasteTrend, index: number) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="font-medium text-sm">{waste.waste_type}</span>
                        </div>
                        <p className="text-lg font-bold">{waste.total_scans}</p>
                        <p className="text-xs text-muted-foreground">{waste.total_points} points</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Disposal Trends Chart */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Weekly Disposal Patterns</CardTitle>
                  <CardDescription>Average disposals by day of week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={wasteAnalysis.seasonal_patterns}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="day_of_week"
                          stroke="#6b7280"
                          fontSize={12}
                        />
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
                          dataKey="total_scans"
                          fill={CHART_COLORS.primary}
                          name="Total Scans"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Trends Chart */}
              <Card className="shadow-card-eco border-0 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Daily Disposal Trends (Last 30 Days)</CardTitle>
                  <CardDescription>Daily waste collection patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={usersOverview.engagement_trends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          stroke="#6b7280"
                          fontSize={12}
                        />
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
                          stroke={CHART_COLORS.primary}
                          fill={CHART_COLORS.primary}
                          fillOpacity={0.3}
                          name="Total Scans"
                        />
                        <Area
                          type="monotone"
                          dataKey="active_users"
                          stroke={CHART_COLORS.secondary}
                          fill={CHART_COLORS.secondary}
                          fillOpacity={0.3}
                          name="Active Users"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bin Management Tab */}
          <TabsContent value="bins" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Capacity Distribution */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Bin Capacity Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {binStatus.capacity_distribution.map((capacity: CapacityDistribution, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className={`font-medium ${
                          capacity.capacity_level === 'Full' ? 'text-red-600' :
                          capacity.capacity_level === 'High' ? 'text-orange-600' :
                          capacity.capacity_level === 'Medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {capacity.capacity_level}
                        </span>
                        <Badge variant={
                          capacity.capacity_level === 'Full' ? 'destructive' :
                          capacity.capacity_level === 'High' ? 'secondary' :
                          'outline'
                        }>
                          {capacity.count} bins
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bins Needing Attention */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Requires Attention</CardTitle>
                  <CardDescription>Bins with issues or high capacity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {binStatus.bins_needing_attention.slice(0, 5).map((bin: BinNeedingAttention, index: number) => (
                      <div key={index} className="p-3 bg-status-warning/10 border border-status-warning/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{bin.location_name}</span>
                          <Badge variant="outline" className="text-status-warning">
                            {bin.capacity_level}
                          </Badge>
                        </div>
                        {bin.complaint_count > 0 && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {bin.complaint_count} complaint(s)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Under-utilized Bins */}
              <Card className="shadow-card-eco border-0">
                <CardHeader>
                  <CardTitle>Under-utilized Bins</CardTitle>
                  <CardDescription>Bins with low usage requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {binStatus.underutilized_bins.slice(0, 5).map((bin: UnderutilizedBin, index: number) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{bin.location_name}</span>
                          <Badge variant="outline">
                            {bin.usage_count} uses
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {bin.region} • {bin.bin_type}
                          {bin.days_since_last_use && (
                            <span className="ml-2">• {bin.days_since_last_use} days idle</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Regional Data Tab */}
          <TabsContent value="regions" className="space-y-6">
            <Card className="shadow-card-eco border-0">
              <CardHeader>
                <CardTitle>Regional Performance Comparison</CardTitle>
                <CardDescription>Performance metrics across different regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Regional comparison data will be displayed here</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => exportReport('regional_comparison')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Regional Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card-eco border-0 cursor-pointer eco-hover"
                onClick={() => exportReport('user_activity')}>
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 mx-auto mb-2 text-status-info" />
              <h3 className="font-semibold">Export User Report</h3>
              <p className="text-sm text-muted-foreground">Download user activity data</p>
            </CardContent>
          </Card>

          <Card className="shadow-card-eco border-0 cursor-pointer eco-hover"
                onClick={() => exportReport('waste_summary')}>
            <CardContent className="p-6 text-center">
              <Trash2 className="w-8 h-8 mx-auto mb-2 text-status-success" />
              <h3 className="font-semibold">Export Waste Report</h3>
              <p className="text-sm text-muted-foreground">Download waste analysis data</p>
            </CardContent>
          </Card>

          <Card className="shadow-card-eco border-0 cursor-pointer eco-hover"
                onClick={() => exportReport('bin_performance')}>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-reward-gold" />
              <h3 className="font-semibold">Export Bin Report</h3>
              <p className="text-sm text-muted-foreground">Download bin performance data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
