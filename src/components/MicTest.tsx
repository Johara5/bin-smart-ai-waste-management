import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MicTest = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const testMicrophone = () => {
    setError('');
    setTranscript('');
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        console.log('Microphone test started');
      };
      
      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        console.log('Microphone test result:', result);
      };
      
      recognition.onerror = (event: any) => {
        setError(`Error: ${event.error}`);
        console.error('Microphone test error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        console.log('Microphone test ended');
      };
      
      try {
        recognition.start();
      } catch (err) {
        setError('Failed to start microphone');
        setIsListening(false);
      }
    } else {
      setError('Speech recognition not supported in this browser');
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Microphone Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={testMicrophone}
          disabled={isListening}
          className="w-full"
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2 animate-pulse" />
              Listening... (speak now)
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Test Microphone
            </>
          )}
        </Button>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-700">
            {error}
          </div>
        )}
        
        {transcript && (
          <div className="p-3 bg-green-100 border border-green-300 rounded-md">
            <strong>You said:</strong> "{transcript}"
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Browser support: {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) ? '✅ Supported' : '❌ Not supported'}
        </div>
      </CardContent>
    </Card>
  );
};

export default MicTest;
