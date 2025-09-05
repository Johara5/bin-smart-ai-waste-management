import { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface SimpleAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleAIAssistant = ({ isOpen, onClose }: SimpleAIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  const quickOptions = [
    "🍼 How do I dispose of plastic bottles?",
    "📱 What counts as e-waste?",
    "🌱 Where can I find organic waste bins?",
    "🏆 How do I earn more points?",
    "♻️ What can I compost at home?",
    "🌍 Tell me about environmental impact!"
  ];

  const responses = {
    'plastic': '🍼 **Plastic Disposal Tips:**\n\n• **Clean containers** before disposal\n• Look for **recycling symbols (1-7)**\n• Remove caps and labels when possible\n• **Earn 10 points** for proper disposal!\n\n💡 **Tip:** Plastic recycling saves energy and reduces ocean pollution!',
    'e-waste': '📱 **E-Waste Guidelines:**\n\n• **Never** throw in regular trash!\n• Find **certified collection centers**\n• **Remove personal data** first\n• **Earn 20 points** - highest reward!\n\n⚡ **Fact:** E-waste contains valuable metals like gold and silver!',
    'organic': '🌱 **Organic Waste Tips:**\n\n• **Perfect for composting!**\n• Keep **separate** from other waste\n• Include fruit peels, veggie scraps\n• **Earn 5 points** per disposal!\n\n🌍 **Impact:** Composting reduces methane emissions by 50%!',
    'points': '🏆 **Point System Breakdown:**\n\n• **E-Waste:** 20 points 🎆\n• **Glass:** 12 points 🥛\n• **Plastic:** 10 points 🍼\n• **Paper:** 8 points 📄\n• **Organic:** 5 points 🌱\n\n🏅 **Goal:** Collect points to redeem amazing rewards!',
    'compost': '♻️ **Composting Guide:**\n\n• **YES:** Fruit and vegetable scraps\n• **YES:** Coffee grounds and filters\n• **NO:** Meat and dairy products\n• **Tip:** Turn regularly for best results!\n\n🌱 **Result:** Rich soil for your garden in 2-6 months!',
    'environment': '🌍 **Environmental Superhero Impact:**\n\n• **Reduce** landfill waste by 60%\n• **Save energy** through recycling\n• **Protect** wildlife and oceans\n• **Combat** climate change daily!\n\n💪 **You\'re making a real difference!**'
  };

  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (speechEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*|\*|\n|•/g, ''));
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initSpeechRecognition();
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: '1',
          text: '👋 **Hi there!** I\'m **EcoBot**, your smart waste management assistant!\n\n✨ **I can help you with:**\n• **Proper waste sorting**\n• **Recycling guidelines**\n• **Finding disposal locations**\n• **Earning reward points**\n\n🎤 **Try speaking to me or click the quick options below!**',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        
        // Speak welcome message
        setTimeout(() => {
          speakText('Hi there! I\'m EcoBot, your waste management assistant. I can help you with recycling, waste sorting, and earning points. Try asking me anything!');
        }, 500);
      }
    }
  }, [isOpen]);

  const generateResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('plastic') || lowerMessage.includes('bottle')) {
      return responses.plastic;
    } else if (lowerMessage.includes('e-waste') || lowerMessage.includes('electronic') || lowerMessage.includes('battery')) {
      return responses['e-waste'];
    } else if (lowerMessage.includes('organic') || lowerMessage.includes('compost') || lowerMessage.includes('food')) {
      return responses.organic;
    } else if (lowerMessage.includes('point') || lowerMessage.includes('reward')) {
      return responses.points;
    } else if (lowerMessage.includes('environment') || lowerMessage.includes('impact')) {
      return responses.environment;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return '😄 **Hello there!** Great to chat with you! I\'m **EcoBot**, here to help with all your **waste management questions**. What would you like to know?';
    } else if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
      return '😊 **You\'re absolutely welcome!** Happy to help make **waste management easier** for you! Got any other questions?';
    } else {
      return '🤖 **I\'d love to help you!** I can assist with:\n\n• 🍼 **Plastic disposal** and recycling\n• 📱 **E-waste** proper handling\n• 🌱 **Organic waste** composting\n• 🏆 **Point system** and rewards\n• 🌍 **Environmental impact** info\n\n💬 **Try asking about any of these topics!**';
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');

    // Smart bot response
    setTimeout(() => {
      const responseText = generateResponse(currentInput);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      
      // Speak the response
      setTimeout(() => speakText(responseText), 500);
    }, 1000);
  };

  const handleQuickOption = (option: string) => {
    setInputMessage(option.replace(/^[🍼📱🌱🏆♻️🌍]\s*/, ''));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl h-[80vh] mx-4">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bot className={`w-6 h-6 ${isListening ? 'animate-pulse text-yellow-300' : ''}`} />
              <span>EcoBot AI Assistant</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {isListening ? '🎤 Listening...' : '✨ Online'}
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSpeechEnabled(!speechEnabled)}
                title={speechEnabled ? 'Turn off voice' : 'Turn on voice'}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col h-full p-0">
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gradient-to-br from-muted to-muted/70 shadow-lg'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary">EcoBot</span>
                    </div>
                  )}
                  <div 
                    className="whitespace-pre-line text-sm"
                    dangerouslySetInnerHTML={{
                      __html: message.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                        .replace(/\n/g, '<br>')
                        .replace(/•/g, '•')
                    }}
                  />
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Options */}
          {messages.length <= 1 && (
            <div className="p-4 border-t bg-muted/20">
              <div className="text-sm text-muted-foreground mb-3 font-medium">Quick Questions:</div>
              <div className="grid grid-cols-2 gap-2">
                {quickOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickOption(option)}
                    className="text-xs h-auto p-2 text-left justify-start"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isListening ? "Listening... speak now!" : "Ask me about waste management..."}
                  className={`flex-1 ${
                    isListening ? 'ring-2 ring-red-400 bg-red-50 dark:bg-red-950' : ''
                  }`}
                  disabled={isListening}
                />
                
                {/* Microphone Button */}
                <Button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  className={isListening ? 'animate-pulse' : ''}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                
                {/* Send Button */}
                <Button type="submit" disabled={!inputMessage.trim() || isListening}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Status Bar */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span>Ask me anything about waste management!</span>
                  {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                    <span className="text-green-600 dark:text-green-400">🎤 Voice enabled</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
                  <span className="text-green-600 dark:text-green-400">EcoBot Online</span>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleAIAssistant;
