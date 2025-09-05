import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ThumbsUp } from 'lucide-react';

const TestFeedback = () => {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSimpleSubmit = async () => {
    console.log('=== SIMPLE SUBMIT START ===');
    
    try {
      setStatus('Submitting...');
      
      // Simple API call
      const response = await fetch('http://localhost:3001/api/feedback/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
          bin_id: 1,
          rating: rating,
          comment: 'Test rating'
        })
      });
      
      console.log('Response:', response);
      
      if (response.ok) {
        setStatus('Success! Rating submitted.');
        console.log('=== SUCCESS ===');
      } else {
        setStatus('Error: Failed to submit');
        console.log('=== ERROR ===');
      }
      
    } catch (error) {
      console.error('=== CATCH ERROR ===', error);
      setStatus('Error: ' + String(error));
    }
  };

  const handleTestClick = () => {
    console.log('Test button clicked');
    setMessage('Test button works! Page did not disappear.');
  };

  console.log('=== TestFeedback RENDER ===');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Test Feedback Page</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Simple Test</CardTitle>
            <CardDescription>Testing if buttons work without page disappearing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleTestClick} variant="outline">
              Test Button (Should Not Disappear)
            </Button>
            
            {message && (
              <div className="p-3 bg-green-100 text-green-800 rounded">
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Test</CardTitle>
            <CardDescription>Testing rating submission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => {
                      console.log('Star clicked:', star);
                      setRating(star);
                    }}
                  />
                ))}
                <span className="ml-2">({rating}/5)</span>
              </div>
            </div>

            <Button onClick={handleSimpleSubmit} className="w-full">
              <ThumbsUp className="w-4 h-4 mr-2" />
              Submit Simple Rating
            </Button>

            {status && (
              <div className={`p-3 rounded ${
                status.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {status}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestFeedback;
