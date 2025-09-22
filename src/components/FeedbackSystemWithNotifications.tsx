import { useState, useEffect } from 'react';
import {
  MessageSquare,
  AlertTriangle,
  Star,
  Send,
  CheckCircle,
  MessageCircle,
  Bell,
  X,
  Trash2,
  Check
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Navigation from '@/components/Navigation';

// Enhanced API service with notifications
const feedbackApiService = {
  async submitComplaint(complaintData: any) {
    try {
      const response = await fetch('http://localhost:8080/api/feedback/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData)
      });
      if (!response.ok) throw new Error('Failed to submit complaint');
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Server connection issue. Please check if the server is running.');
      }
      throw error;
    }
  },

  async submitRating(ratingData: any) {
    try {
      const response = await fetch('http://localhost:8080/api/feedback/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ratingData)
      });
      if (!response.ok) throw new Error('Failed to submit rating');
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Server connection issue. Please check if the server is running.');
      }
      throw error;
    }
  },

  async submitSuggestion(suggestionData: any) {
    try {
      const response = await fetch('http://localhost:8080/api/feedback/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suggestionData)
      });
      if (!response.ok) throw new Error('Failed to submit suggestion');
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Server connection issue. Please check if the server is running.');
      }
      throw error;
    }
  },

  async getBins() {
    const response = await fetch('http://localhost:8080/api/bins');
    if (!response.ok) throw new Error('Failed to fetch bins');
    return await response.json();
  },

  async getNotifications() {
    try {
      const response = await fetch('http://localhost:8080/api/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return await response.json();
    } catch (error) {
      // Return mock data if API fails
      return {
        notifications: [
          {
            id: 1,
            type: 'reward',
            title: 'New Reward Available!',
            message: 'You have earned 50 points for recycling. Check out the rewards section!',
            timestamp: new Date().toISOString(),
            read: false
          },
          {
            id: 2,
            type: 'maintenance',
            title: 'Bin Maintenance Complete',
            message: 'The bin at Central Park has been serviced and is ready for use.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false
          },
          {
            id: 3,
            type: 'system',
            title: 'App Update Available',
            message: 'A new version of the app is available with improved features.',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: true
          }
        ]
      };
    }
  },

  async markNotificationAsRead(notificationId: number) {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      return await response.json();
    } catch (error) {
      console.log('Marking notification as read (mock)');
      return { success: true };
    }
  },

  async deleteNotification(notificationId: number) {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      return await response.json();
    } catch (error) {
      console.log('Deleting notification (mock)');
      return { success: true };
    }
  }
};

const FeedbackSystem = () => {
  const currentUserId = 1; // This should come from user context/auth
  const [bins, setBins] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Form states
  const [complaintForm, setComplaintForm] = useState({
    bin_id: '',
    complaint_type: 'full',
    description: ''
  });
  const [ratingForm, setRatingForm] = useState({
    bin_id: '',
    rating: 5,
    comment: ''
  });
  const [suggestionForm, setSuggestionForm] = useState({
    title: '',
    message: '',
    category: 'general'
  });

  const [showSuccess, setShowSuccess] = useState('');
  const [showError, setShowError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [binsData, notificationsData] = await Promise.all([
          feedbackApiService.getBins(),
          feedbackApiService.getNotifications()
        ]);

        // Handle different response formats for bins
        if (Array.isArray(binsData)) {
          setBins(binsData);
        } else if (binsData && binsData.bins && Array.isArray(binsData.bins)) {
          setBins(binsData.bins);
        } else {
          setBins([]);
        }

        // Handle notifications
        if (notificationsData && notificationsData.notifications) {
          setNotifications(notificationsData.notifications);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Failed to fetch feedback data:', error);
        // Set fallback data if API fails
        const fallbackBins = [
          { id: 1, location_name: 'Central Park - Main Entrance', bin_type: 'Mixed' },
          { id: 2, location_name: 'Downtown Recycling Center', bin_type: 'Plastic' },
          { id: 3, location_name: 'City Hall - East Side', bin_type: 'Paper' },
          { id: 4, location_name: 'University Campus - Library', bin_type: 'Mixed' },
          { id: 5, location_name: 'Shopping Mall - Food Court', bin_type: 'Organic' }
        ];
        setBins(fallbackBins);

        // Set mock notifications
        const mockNotifications = [
          {
            id: 1,
            type: 'reward',
            title: 'New Reward Available!',
            message: 'You have earned 50 points for recycling. Check out the rewards section!',
            timestamp: new Date().toISOString(),
            read: false
          },
          {
            id: 2,
            type: 'maintenance',
            title: 'Bin Maintenance Complete',
            message: 'The bin at Central Park has been serviced and is ready for use.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false
          }
        ];
        setNotifications(mockNotifications);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleComplaintSubmit = async () => {
    setShowError('');
    setShowSuccess('');

    if (!complaintForm.bin_id) {
      setShowError('Please select a bin location');
      return;
    }

    try {
      const response = await feedbackApiService.submitComplaint({
        user_id: currentUserId,
        bin_id: parseInt(complaintForm.bin_id),
        complaint_type: complaintForm.complaint_type,
        description: complaintForm.description
      });

      setShowSuccess('complaint');
      setComplaintForm({ bin_id: '', complaint_type: 'full', description: '' });

      setTimeout(() => setShowSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to submit complaint:', error);

      if (error instanceof Error && error.message.includes('Server connection issue')) {
        setShowError('Failed to submit complaint: Server connection issue. Please check if the server is running.');
      } else {
        setShowError('Failed to submit complaint. Please try again.');
      }

      setTimeout(() => setShowError(''), 7000);
    }
  };

  const handleRatingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setShowError('');
      setShowSuccess('');

      if (!ratingForm.bin_id) {
        setShowError('Please select a bin location');
        return;
      }

      const ratingData = {
        user_id: currentUserId,
        bin_id: parseInt(ratingForm.bin_id),
        rating: ratingForm.rating,
        comment: ratingForm.comment
      };

      const response = await feedbackApiService.submitRating(ratingData);

      setShowSuccess('rating');
      setRatingForm({ bin_id: '', rating: 5, comment: '' });

      setTimeout(() => setShowSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to submit rating:', error);

      if (error instanceof Error && error.message.includes('Server connection issue')) {
        setShowError('Failed to submit the rating: Server connection issue. Please check if the server is running.');
      } else {
        setShowError('Failed to submit rating. Please try again.');
      }

      setTimeout(() => setShowError(''), 7000);
    }
  };

  const handleSuggestionSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setShowError('');
    setShowSuccess('');

    if (!suggestionForm.title || !suggestionForm.message) {
      setShowError('Please fill in all required fields');
      return;
    }

    try {
      const response = await feedbackApiService.submitSuggestion({
        user_id: currentUserId,
        ...suggestionForm
      });

      setShowSuccess('suggestion');
      setSuggestionForm({ title: '', message: '', category: 'general' });

      setTimeout(() => setShowSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to submit suggestion:', error);

      if (error instanceof Error && error.message.includes('Server connection issue')) {
        setShowError('Failed to submit suggestion: Server connection issue. Please check if the server is running.');
      } else {
        setShowError('Failed to submit suggestion. Please try again.');
      }

      setTimeout(() => setShowError(''), 7000);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await feedbackApiService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await feedbackApiService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reward':
        return '🎉';
      case 'maintenance':
        return '🔧';
      case 'system':
        return '📱';
      default:
        return '📢';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const StarRating = ({ rating, interactive = false, onRatingChange }: {
    rating: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
  }) => {
    const handleStarClick = (starValue: number) => {
      if (interactive && onRatingChange) {
        onRatingChange(starValue);
      }
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isActive = starValue <= rating;

          return (
            <Star
              key={starValue}
              className={`w-6 h-6 transition-colors duration-200 ${
                isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              } ${
                interactive ? 'cursor-pointer hover:fill-yellow-300 hover:text-yellow-300' : ''
              }`}
              onClick={interactive ? () => handleStarClick(starValue) : undefined}
            />
          );
        })}
      </div>
    );
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return <StarRating rating={rating} interactive={interactive} onRatingChange={onRatingChange} />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-lg">Loading feedback system...</div>
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
                <MessageSquare className="w-8 h-8" />
                <span>Feedback & Support</span>
              </h1>
              <p className="text-primary-foreground/80">Report issues, rate bins, and share suggestions</p>
            </div>

            {/* Notification Button */}
            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center px-1">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'No new notifications'}
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b last:border-b-0 hover:bg-muted/50 ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-sm truncate">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.timestamp).toLocaleDateString()} at{' '}
                                {new Date(notification.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t bg-muted/50">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        notifications.forEach(n => {
                          if (!n.read) handleMarkAsRead(n.id);
                        });
                      }}
                    >
                      Mark all as read
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Alerts */}
        {showSuccess && (
          <Alert className="mb-6 bg-status-success/10 border-status-success">
            <CheckCircle className="h-4 w-4 text-status-success" />
            <AlertDescription>
              {showSuccess === 'complaint' && 'Your complaint has been submitted successfully!'}
              {showSuccess === 'rating' && 'Your rating has been submitted successfully!'}
              {showSuccess === 'suggestion' && 'Your suggestion has been submitted successfully!'}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alerts */}
        {showError && (
          <Alert className="mb-6 bg-status-danger/10 border-status-danger">
            <AlertTriangle className="h-4 w-4 text-status-danger" />
            <AlertDescription className="text-status-danger">
              {showError}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Tabs - Only 3 tabs as requested */}
        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="complaints">Report Issues</TabsTrigger>
            <TabsTrigger value="ratings">Rate Bins</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          {/* Report Issues Tab */}
          <TabsContent value="complaints" className="space-y-6">
            <Card className="shadow-card-eco border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6 text-status-warning" />
                  <span>Report a Bin Issue</span>
                </CardTitle>
                <CardDescription>
                  Help us maintain our bins by reporting any issues you encounter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleComplaintSubmit(); }}>
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Bin</label>
                    <select
                      value={complaintForm.bin_id}
                      onChange={(e) => setComplaintForm({ ...complaintForm, bin_id: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required
                    >
                      <option value="">Choose a bin location...</option>
                      {bins.map((bin: any) => (
                        <option key={bin.id} value={bin.id}>
                          {bin.location_name} ({bin.bin_type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Issue Type</label>
                    <select
                      value={complaintForm.complaint_type}
                      onChange={(e) => setComplaintForm({ ...complaintForm, complaint_type: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="full">Bin is Full</option>
                      <option value="broken">Bin is Broken</option>
                      <option value="not_working">Not Working</option>
                      <option value="dirty">Needs Cleaning</option>
                      <option value="other">Other Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={complaintForm.description}
                      onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      rows={4}
                      placeholder="Please provide additional details about the issue..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rate Bins Tab */}
          <TabsContent value="ratings" className="space-y-6">
            <Card className="shadow-card-eco border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span>Rate a Bin</span>
                </CardTitle>
                <CardDescription>
                  Share your experience to help improve our service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleRatingSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Bin</label>
                    <select
                      value={ratingForm.bin_id}
                      onChange={(e) => setRatingForm({ ...ratingForm, bin_id: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required
                    >
                      <option value="">Choose a bin location...</option>
                      {bins.map((bin: any) => (
                        <option key={bin.id} value={bin.id}>
                          {bin.location_name} ({bin.bin_type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex items-center space-x-3">
                      {renderStars(ratingForm.rating, true, (rating) =>
                        setRatingForm({ ...ratingForm, rating })
                      )}
                      <span className="text-sm text-muted-foreground">
                        ({ratingForm.rating}/5)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Comment (optional)</label>
                    <textarea
                      value={ratingForm.comment}
                      onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      rows={3}
                      placeholder="Share your thoughts about this bin..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                  >
                    Submit Rating
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-6">
            <Card className="shadow-card-eco border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-6 h-6 text-status-info" />
                  <span>Suggest Improvements</span>
                </CardTitle>
                <CardDescription>
                  Help us improve our waste management system with your ideas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSuggestionSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={suggestionForm.category}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="general">General</option>
                      <option value="bin_placement">Bin Placement</option>
                      <option value="app_features">App Features</option>
                      <option value="rewards">Rewards System</option>
                      <option value="accessibility">Accessibility</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={suggestionForm.title}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Brief title for your suggestion..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your Suggestion</label>
                    <textarea
                      value={suggestionForm.message}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, message: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      rows={6}
                      placeholder="Please describe your suggestion in detail..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Suggestion
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackSystem;
