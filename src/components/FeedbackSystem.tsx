import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  AlertTriangle, 
  Star, 
  Send, 
  CheckCircle, 
  Clock,
  Flag,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';

// API service for feedback system
const feedbackApiService = {
  async submitComplaint(complaintData: any) {
    const response = await fetch('http://localhost:3001/api/feedback/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData)
    });
    if (!response.ok) throw new Error('Failed to submit complaint');
    return await response.json();
  },

  async getComplaints(userId: number) {
    const response = await fetch(`http://localhost:3001/api/feedback/complaints?user_id=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch complaints');
    return await response.json();
  },

  async submitRating(ratingData: any) {
    const response = await fetch('http://localhost:3001/api/feedback/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ratingData)
    });
    if (!response.ok) throw new Error('Failed to submit rating');
    return await response.json();
  },

  async getBinRatings(binId: number) {
    const response = await fetch(`http://localhost:3001/api/feedback/ratings/${binId}`);
    if (!response.ok) throw new Error('Failed to fetch bin ratings');
    return await response.json();
  },

  async submitSuggestion(suggestionData: any) {
    const response = await fetch('http://localhost:3001/api/feedback/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(suggestionData)
    });
    if (!response.ok) throw new Error('Failed to submit suggestion');
    return await response.json();
  },

  async getUserNotifications(userId: number) {
    const response = await fetch(`http://localhost:3001/api/feedback/notifications/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return await response.json();
  },

  async markNotificationRead(notificationId: number) {
    const response = await fetch(`http://localhost:3001/api/feedback/notifications/${notificationId}/mark-read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return await response.json();
  },

  async getBins() {
    const response = await fetch('http://localhost:3001/api/bins');
    if (!response.ok) throw new Error('Failed to fetch bins');
    return await response.json();
  }
};

const FeedbackSystem = () => {
  const currentUserId = 1; // This should come from user context/auth
  const [complaints, setComplaints] = useState({ complaints: [] });
  const [notifications, setNotifications] = useState({ notifications: [] });
  const [bins, setBins] = useState<any[]>([]);
  
  // Add debugging for bins updates
  useEffect(() => {
    console.log('Bins state updated:', bins.length, 'bins:', bins);
  }, [bins]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [binRatings, setBinRatings] = useState({ ratings: [], average_rating: 0, total_ratings: 0 });
  
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
        const [complaintsData, notificationsData, binsData] = await Promise.all([
          feedbackApiService.getComplaints(currentUserId),
          feedbackApiService.getUserNotifications(currentUserId),
          feedbackApiService.getBins()
        ]);
        
        console.log('Fetched bins data:', binsData);
        console.log('Fetched complaints data:', complaintsData);
        console.log('Fetched notifications data:', notificationsData);
        
        setComplaints(complaintsData || { complaints: [] });
        setNotifications(notificationsData || { notifications: [] });
        
        // Handle different response formats
        if (Array.isArray(binsData)) {
          console.log('Setting bins from array:', binsData.length, 'items');
          setBins(binsData);
        } else if (binsData && binsData.bins && Array.isArray(binsData.bins)) {
          console.log('Setting bins from bins property:', binsData.bins.length, 'items');
          setBins(binsData.bins);
        } else {
          console.log('No bins data, setting empty array');
          setBins([]);
        }
      } catch (error) {
        console.error('Failed to fetch feedback data:', error);
        // Set fallback data if API fails
        setComplaints({ complaints: [] });
        setNotifications({ notifications: [] });
        const fallbackBins = [
          { id: 1, location_name: 'Central Park - Main Entrance', bin_type: 'Mixed' },
          { id: 2, location_name: 'Downtown Recycling Center', bin_type: 'Plastic' },
          { id: 3, location_name: 'City Hall - East Side', bin_type: 'Paper' },
          { id: 4, location_name: 'University Campus - Library', bin_type: 'Mixed' },
          { id: 5, location_name: 'Shopping Mall - Food Court', bin_type: 'Organic' }
        ];
        console.log('Setting fallback bins:', fallbackBins);
        setBins(fallbackBins);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  useEffect(() => {
    if (selectedBin) {
      const fetchBinRatings = async () => {
        try {
          const ratingsData = await feedbackApiService.getBinRatings(selectedBin.id);
          setBinRatings(ratingsData);
        } catch (error) {
          console.error('Failed to fetch bin ratings:', error);
        }
      };
      fetchBinRatings();
    }
  }, [selectedBin]);

  const handleComplaintSubmit = async () => {
    
    setShowError('');
    setShowSuccess('');
    
    if (!complaintForm.bin_id) {
      setShowError('Please select a bin location');
      return;
    }
    
    try {
      console.log('Submitting complaint:', complaintForm);
      
      const response = await feedbackApiService.submitComplaint({
        user_id: currentUserId,
        bin_id: parseInt(complaintForm.bin_id),
        complaint_type: complaintForm.complaint_type,
        description: complaintForm.description
      });
      
      console.log('Complaint submitted successfully:', response);
      setShowSuccess('complaint');
      setComplaintForm({ bin_id: '', complaint_type: 'full', description: '' });
      
      // Refresh complaints
      try {
        const complaintsData = await feedbackApiService.getComplaints(currentUserId);
        setComplaints(complaintsData);
      } catch (refreshError) {
        console.error('Failed to refresh complaints:', refreshError);
      }
      
      setTimeout(() => setShowSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      setShowError('Failed to submit complaint. Please try again.');
      setTimeout(() => setShowError(''), 5000);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      console.log('=== RATING SUBMIT STARTED ===');
      console.log('Current ratingForm:', ratingForm);
      console.log('Current bins:', bins);
      
      setShowError('');
      setShowSuccess('');
      
      if (!ratingForm.bin_id) {
        console.log('No bin selected, showing error');
        setShowError('Please select a bin location');
        return;
      }
      
      console.log('Submitting rating to API...');
      
      const response = await feedbackApiService.submitRating({
        user_id: currentUserId,
        bin_id: parseInt(ratingForm.bin_id),
        rating: ratingForm.rating,
        comment: ratingForm.comment
      });
      
      console.log('Rating API response:', response);
      console.log('Setting success state...');
      
      setShowSuccess('rating');
      
      console.log('Clearing form...');
      const previousBinId = ratingForm.bin_id;
      setRatingForm({ bin_id: '', rating: 5, comment: '' });
      setSelectedBin(null);
      
      console.log('Form cleared successfully');
      
      // Refresh bin ratings if same bin was selected
      if (selectedBin && parseInt(previousBinId) === selectedBin.id) {
        try {
          console.log('Refreshing ratings for bin:', selectedBin.id);
          const ratingsData = await feedbackApiService.getBinRatings(selectedBin.id);
          setBinRatings(ratingsData);
          console.log('Ratings refreshed successfully');
        } catch (refreshError) {
          console.error('Failed to refresh ratings:', refreshError);
        }
      }
      
      console.log('Setting success timeout...');
      setTimeout(() => {
        console.log('Clearing success message');
        setShowSuccess('');
      }, 3000);
      
      console.log('=== RATING SUBMIT COMPLETED ===');
      
    } catch (error) {
      console.error('=== RATING SUBMIT ERROR ===', error);
      setShowError('Failed to submit rating. Please try again.');
      setTimeout(() => setShowError(''), 5000);
    }
  };

  const handleSuggestionSubmit = async () => {
    
    setShowError('');
    setShowSuccess('');
    
    if (!suggestionForm.title || !suggestionForm.message) {
      setShowError('Please fill in all required fields');
      return;
    }
    
    try {
      console.log('Submitting suggestion:', suggestionForm);
      
      const response = await feedbackApiService.submitSuggestion({
        user_id: currentUserId,
        ...suggestionForm
      });
      
      console.log('Suggestion submitted successfully:', response);
      setShowSuccess('suggestion');
      setSuggestionForm({ title: '', message: '', category: 'general' });
      
      setTimeout(() => setShowSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to submit suggestion:', error);
      setShowError('Failed to submit suggestion. Please try again.');
      setTimeout(() => setShowError(''), 5000);
    }
  };

  const getComplaintStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-status-success/20 text-status-success';
      case 'in_progress': return 'bg-status-warning/20 text-status-warning';
      default: return 'bg-status-info/20 text-status-info';
    }
  };

  const getComplaintTypeIcon = (type: string) => {
    switch (type) {
      case 'full': return '🗑️';
      case 'broken': return '🔧';
      case 'not_working': return '⚠️';
      case 'dirty': return '🧹';
      default: return '📝';
    }
  };

  const StarRating = ({ rating, interactive = false, onRatingChange }: {
    rating: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
  }) => {
    console.log('StarRating render:', { rating, interactive });
    
    const handleStarClick = (starValue: number) => {
      console.log('Star clicked:', starValue);
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
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="w-6 h-6" />
                {notifications.notifications.filter((n: any) => !n.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.notifications.filter((n: any) => !n.is_read).length}
                  </span>
                )}
              </div>
            </div>
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

        {/* Main Tabs */}
        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="complaints">Report Issues</TabsTrigger>
            <TabsTrigger value="ratings">Rate Bins</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="my-reports">My Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                <form className="space-y-4">
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
                    type="button" 
                    className="w-full"
                    onClick={handleComplaintSubmit}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rating Form */}
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
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Bin</label>
                      <select
                        value={ratingForm.bin_id}
                        onChange={(e) => {
                          setRatingForm({ ...ratingForm, bin_id: e.target.value });
                          const bin = bins.find((b: any) => b.id === parseInt(e.target.value));
                          setSelectedBin(bin || null);
                        }}
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

                    <div className="space-y-3">
                      <Button 
                        type="button" 
                        className="w-full"
                        onClick={() => {
                          console.log('Test button clicked - should not disappear');
                          alert('Test button works! Page should not disappear.');
                        }}
                        variant="outline"
                      >
                        Test Button (Should Not Disappear)
                      </Button>
                      
                      <Button 
                        type="button" 
                        className="w-full"
                        onClick={handleRatingSubmit}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Submit Rating
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Bin Ratings Display */}
              {selectedBin && (
                <Card className="shadow-card-eco border-0">
                  <CardHeader>
                    <CardTitle>{selectedBin.location_name}</CardTitle>
                    <CardDescription>
                      {selectedBin.bin_type} • Current Rating: {binRatings.average_rating}/5 ({binRatings.total_ratings} reviews)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        {renderStars(Math.round(binRatings.average_rating))}
                        <span className="text-sm text-muted-foreground">
                          {binRatings.average_rating.toFixed(1)}/5
                        </span>
                      </div>

                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {binRatings.ratings.slice(0, 5).map((rating: any, index: number) => (
                          <div key={index} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {renderStars(rating.rating)}
                                <span className="text-sm font-medium">{rating.username}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(rating.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {rating.comment && (
                              <p className="text-sm text-muted-foreground">{rating.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
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
                <form className="space-y-4">
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
                    type="button" 
                    className="w-full"
                    onClick={handleSuggestionSubmit}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Suggestion
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Reports Tab */}
          <TabsContent value="my-reports" className="space-y-6">
            <Card className="shadow-card-eco border-0">
              <CardHeader>
                <CardTitle>Your Recent Reports</CardTitle>
                <CardDescription>Track the status of your submitted complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaints.complaints.map((complaint: any, index: number) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            {getComplaintTypeIcon(complaint.complaint_type)}
                          </span>
                          <div>
                            <h3 className="font-medium">{complaint.location_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {complaint.complaint_type.replace('_', ' ').toUpperCase()} • {complaint.bin_type}
                            </p>
                          </div>
                        </div>
                        <Badge className={getComplaintStatusColor(complaint.status)}>
                          {complaint.status === 'resolved' ? 'Resolved' :
                           complaint.status === 'in_progress' ? 'In Progress' : 'Open'}
                        </Badge>
                      </div>
                      
                      {complaint.description && (
                        <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Submitted: {new Date(complaint.created_at).toLocaleDateString()}</span>
                        {complaint.resolved_at && (
                          <span>Resolved: {new Date(complaint.resolved_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {complaints.complaints.length === 0 && (
                    <div className="text-center py-8">
                      <Flag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No complaints submitted yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-card-eco border-0">
              <CardHeader>
                <CardTitle>Your Notifications</CardTitle>
                <CardDescription>Updates about your reports and system alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.notifications.map((notification: any, index: number) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${
                        notification.is_read ? 'bg-muted/30' : 'bg-status-info/10 border-status-info/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-medium ${!notification.is_read ? 'text-status-info' : ''}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {!notification.is_read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => feedbackApiService.markNotificationRead(notification.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {notifications.notifications.length === 0 && (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No notifications yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackSystem;
