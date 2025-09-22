import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  Send,
  MessageCircle,
  X,
  Trash2,
  Recycle,
  Lightbulb,
  HelpCircle,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Smile,
  Heart,
  Zap,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  category?: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

// Speech Recognition interfaces
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    webkitSpeechRecognition: SpeechRecognitionConstructor;
    SpeechRecognition: SpeechRecognitionConstructor;
  }
}

const AIAssistant = ({ isOpen, onClose }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [botMood, setBotMood] = useState<'happy' | 'excited' | 'thinking' | 'helpful'>('happy');
  const [userInteractionCount, setUserInteractionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Enhanced knowledge base with interactive responses
  const knowledgeBase: Record<string, {
    keywords: string[];
    response: string;
    mood: 'happy' | 'excited' | 'thinking' | 'helpful';
  }> = {
    plastic: {
      keywords: ['plastic', 'bottle', 'container', 'packaging', 'bag'],
      response: "🍼 **Fantastic! Let's talk plastic!** \n\n✨ **Pro Tips for Plastic Waste:**\n• 🧽 Clean containers before disposal (removes food residue!)\n• 🏷️ Remove caps and labels when possible\n• 🔢 Look for recycling symbols (1-7) - they're like secret codes!\n• 🛍️ Plastic bags go to special collection points (not regular bins!)\n• 🏆 **Reward Alert**: Earn 10 points for proper plastic disposal!\n\n💡 **Fun Fact**: One recycled plastic bottle can save enough energy to power a lightbulb for 3 hours! 💡",
      mood: 'excited'
    },
    organic: {
      keywords: ['organic', 'food', 'compost', 'biodegradable', 'kitchen', 'fruit', 'vegetable'],
      response: "🥬 **Awesome! Organic waste is nature's favorite!** \n\n🌱 **Green Goddess Tips:**\n• ✨ Perfect for composting - nature's recycling system!\n• 🗺️ Keep separate from other waste (they don't mix well!)\n• 🍎 Include fruit peels, veggie scraps, coffee grounds\n• ⚠️ Avoid meat and dairy in home compost (attracts critters!)\n• 🎆 Earn 5 points for organic waste disposal!\n\n🌍 **Eco Impact**: Composting reduces methane emissions by 50%!",
      mood: 'helpful'
    },
    paper: {
      keywords: ['paper', 'cardboard', 'newspaper', 'magazine', 'book'],
      response: "📄 **Paper power! You're thinking like a tree-saver!** \n\n🌲 **Paper Champion Guidelines:**\n• 📎 Remove staples and tape (metals don't belong!)\n• 📦 Flatten cardboard boxes - saves space, saves the planet!\n• ☁️ Keep dry and clean (wet paper = sad recycling machines)\n• 📰 Newspapers and magazines are recycling superstars!\n• 🎖️ **Points Bonanza**: Earn 8 points for paper recycling!\n\n📊 **Amazing Stat**: Recycling one ton of paper saves 17 trees! 🌳",
      mood: 'excited'
    },
    ewaste: {
      keywords: ['electronic', 'battery', 'phone', 'computer', 'cable', 'charger', 'e-waste'],
      response: "📱 **E-waste alert! You're dealing with tech treasures!** \n\n⚡ **Digital Hero Guidelines:**\n• 🚫 NEVER throw in regular trash - electronics contain precious metals!\n• 🎆 Find certified e-waste collection centers (they're like tech hospitals!)\n• 🔒 Remove personal data first - protect your digital footprint!\n• 🔋 Batteries need special handling - they're powerful but dangerous\n• 💰 **Jackpot**: Earn 20 points for proper e-waste disposal!\n\n🌎 **Mind-blowing**: E-waste contains gold, silver, and rare earth elements!",
      mood: 'excited'
    },
    glass: {
      keywords: ['glass', 'bottle', 'jar', 'window', 'mirror'],
      response: "🥛 **Glass-tastic choice! Crystal clear thinking!** \n\n✨ **Glass Master Tips:**\n• 🍾 Remove caps and lids (they go on different journeys!)\n• 🧽 Clean containers - sparkly clean, sparkly green!\n• 🎨 Separate by color if required (brown, green, clear)\n• ⚠️ Handle broken glass carefully - safety first, always!\n• 🏅 **Shining Reward**: Earn 12 points for glass recycling!\n\n♾️ **Infinite Power**: Glass can be recycled endlessly without losing quality!",
      mood: 'happy'
    },
    general: {
      keywords: ['help', 'how', 'what', 'where', 'when', 'why'],
  const quickSuggestions = [
    "🍼 How do I dispose of plastic bottles?",
    "📱 What counts as e-waste?",
    "🌱 Where can I find organic waste bins?",
    "🏆 How do I earn more points?",
    "♾️ What can I compost at home?",
    "🌍 Tell me about environmental impact!",
    "🤖 What can you help me with?"
  ];

  // Voice recognition setup
  const initSpeechRecognition = () => {
    try {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          try {
            const transcript = event.results[0][0].transcript;
            console.log('Speech recognition result:', transcript);
            setInputMessage(transcript);
            setIsListening(false);
          } catch (error) {
            console.error('Error processing speech result:', error);
            setIsListening(false);
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
        };

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
        };
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
    }
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if (speechEnabled && 'speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*|\*|\n|•/gu, ''));
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }
  };

  // Start voice recognition
  const startListening = () => {
    try {
      if (recognitionRef.current && !isListening) {
        console.log('Starting speech recognition...');
        recognitionRef.current.start();
        // setIsListening will be set by onstart event
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  };

  // Stop voice recognition
  const stopListening = () => {
    try {
      if (recognitionRef.current && isListening) {
        console.log('Stopping speech recognition...');
        recognitionRef.current.stop();
        setIsListening(false);
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      setIsListening(false);
    }
  };

  // Toggle speech output
  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initSpeechRecognition();

      if (messages.length === 0) {
        // Show welcome message immediately
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: "👋 **Hi there!** I'm EcoBot, your super-smart AI Waste Assistant! \n\n🎆 **I'm here to make waste management FUN and rewarding!** \n\n🎤 **New**: Try talking to me! Click the mic button to speak!\n\n✨ **I can help you with:**\n• 📚 Proper waste sorting (I know all the secrets!)\n• ♾️ Recycling guidelines (become a recycling ninja!)\n• 🗺️ Finding disposal locations (treasure hunt for bins!)\n• 🏆 Earning maximum reward points (ka-ching!)\n• 🌍 Environmental impact tips (save the planet, one bin at a time!)\n\n🚀 **Ready to become a waste management superhero?** Ask me anything!",
          sender: 'bot',
          timestamp: new Date(),
          category: 'welcome'
        };

        // Add message immediately
        setMessages([welcomeMessage]);
        setBotMood('excited');

        // Speak welcome message if speech is enabled (with a small delay for better UX)
        setTimeout(() => {
          if (speechEnabled) {
            speakText("Hi there! I'm EcoBot, your AI Waste Assistant. I can help you with proper waste sorting, recycling, and earning points. Try asking me anything!");
          }
        }, 500);
      }
    }
  }, [isOpen, messages.length, speakText, speechEnabled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateBotResponse = (userMessage: string): { response: string; mood: string } => {
    const lowerMessage = userMessage.toLowerCase();

    // Increment interaction count
    setUserInteractionCount(prev => prev + 1);

    // Check for greetings and friendly responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const greetings = [
        "😄 **Hey there, environmental champion!** Great to see you! How can I help make your waste management journey amazing today?",
        "🎆 **Hello, eco-hero!** Ready to save the planet one bin at a time? What's your waste management question?",
        "👋 **Hi there!** I'm so excited to help you become a recycling superstar! What would you like to know?"
      ];
      return { response: greetings[Math.floor(Math.random() * greetings.length)], mood: 'excited' };
    }

    // Check for appreciation
    if (lowerMessage.includes('thank') || lowerMessage.includes('awesome') || lowerMessage.includes('great')) {
      const appreciations = [
        "😍 **Aww, you're so welcome!** It makes my circuits happy to help amazing people like you! 🥰",
        "🎆 **You're absolutely fantastic!** Keep up that eco-friendly spirit - you're making a real difference! 🌍",
        "❤️ **That's what I love to hear!** Your enthusiasm for the environment is contagious! Keep being awesome! ✨"
      ];
      return { response: appreciations[Math.floor(Math.random() * appreciations.length)], mood: 'happy' };
    }

    // Check for specific waste types with mood
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return { response: data.response, mood: data.mood || 'helpful' };
      }
    }

    // Enhanced responses for various scenarios
    if (lowerMessage.includes('point') || lowerMessage.includes('reward')) {
      return {
        response: "🏆 **Points Paradise! Let's talk rewards!** \n\n💰 **Your Earning Power:**\n• 🍼 Plastic: 10 points (every bottle counts!)\n• 📄 Paper: 8 points (tree-saver bonus!)\n• 🥛 Glass: 12 points (crystal clear rewards!)\n• 🥬 Organic: 5 points (nature's favorite!)\n• 📱 E-Waste: 20 points (tech treasure jackpot!)\n\n🎁 **Pro Tip**: Redeem your points for amazing rewards in the Rewards section! The more you recycle, the cooler stuff you get! 😎",
        mood: 'excited'
      };
    }

    if (lowerMessage.includes('bin') || lowerMessage.includes('location')) {
      return {
        response: "📍 **Bin Hunter Mode Activated!** \n\n🗺️ **Finding Your Perfect Bin:**\nUse the 'Find Bins' feature to locate smart bins near you - it's like a treasure map for eco-warriors! \n\n✨ **Cool Features:**\n• Different waste types have different homes\n• Real-time availability (no more full bin surprises!)\n• GPS navigation to your nearest bin\n• Smart bins throughout the city\n\n🏃‍♂️ Ready to go on a bin-finding adventure?",
        mood: 'helpful'
      };
    }

    if (lowerMessage.includes('scan') || lowerMessage.includes('camera')) {
      return {
        response: "📱 **AI Scanner Magic!** \n\n🤖 **Your Pocket Waste Expert:**\nOur AI scanner is like having a waste management genius in your phone! \n\n📸 **How it works:**\n• Take a photo of your waste\n• AI identifies it instantly (like magic!)\n• Get proper disposal instructions\n• Earn maximum points automatically\n• Become a sorting superstar! \n\n🎆 **Fun fact**: Our AI has analyzed millions of waste items and keeps learning!",
        mood: 'excited'
      };
    }

    if (lowerMessage.includes('environment') || lowerMessage.includes('impact')) {
      return {
        response: "🌍 **Environmental Superhero Alert!** \n\n🧚‍♀️ **Your Amazing Impact:**\nEvery time you dispose properly, you're literally saving the world! \n\n✨ **Your superpowers include:**\n• 🗑️ Reducing landfill waste (less trash mountains!)\n• ⚡ Saving energy through recycling (power up the planet!)\n• 🐻 Protecting wildlife (animals love clean heroes!)\n• 🌱 Reducing carbon footprint (climate champion!)\n• 💧 Conserving water and natural resources\n\n🏆 **You're officially making Earth happy!** Keep up that superhero work! 💪",
        mood: 'excited'
      };
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what') || lowerMessage.includes('how')) {
      const helpResponses = [
        "🤖 **I'm your eco-friendly sidekick!** I live to help with all things waste and recycling! Ask me about any type of waste, points, bins, or environmental tips!",
        "✨ **Let's make waste management magical!** I can help you sort like a pro, find bins, earn points, and save the planet - all while having fun!",
        "🎆 **Ready to become a waste wizard?** I've got tips, tricks, and everything you need to turn trash into treasure (and points!)"
      ];
      return { response: helpResponses[Math.floor(Math.random() * helpResponses.length)], mood: 'helpful' };
    }

    // Special milestone responses
    if (userInteractionCount > 0 && userInteractionCount % 5 === 0) {
      return {
        response: "🎉 **Wow! You're really committed to learning about waste management!** That's exactly the kind of eco-enthusiasm we need! \n\n🏅 **You've asked me " + userInteractionCount + " questions - you're becoming a true environmental expert!** \n\nWhat else would you like to discover about making our planet cleaner?",
        mood: 'excited'
      };
    }

    // Generic helpful response with personality
    const genericResponses = [
      "🤔 **Hmm, let me think...** I'd love to help you with that! Could you be more specific? \n\n💡 **Try asking about:**\n• Specific waste types (plastic, paper, glass, organic, e-waste)\n• Where to find bins\n• How to earn more points\n• Environmental impact tips\n\n😄 I'm here to make waste management fun and easy!",
      "🎆 **Ooh, interesting question!** I want to give you the best answer possible! \n\n🎯 **I'm super helpful with:**\n• Waste sorting secrets\n• Recycling tips and tricks\n• Finding the perfect bin\n• Maximizing your reward points\n\n😊 Try asking about any type of waste - I know all the insider tips!"
    ];

    return { response: genericResponses[Math.floor(Math.random() * genericResponses.length)], mood: 'thinking' };
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time with personality
    setBotMood('thinking');
    setTimeout(() => {
      const botResponseData = generateBotResponse(inputMessage);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseData.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setBotMood(botResponseData.mood as 'happy' | 'excited' | 'thinking' | 'helpful');
      setIsTyping(false);

      // Speak the response if speech is enabled
      if (speechEnabled) {
        setTimeout(() => {
          speakText(botResponseData.response);
        }, 500);
      }
    }, 1000 + Math.random() * 2000); // 1-3 seconds delay
  };

  const handleQuickSuggestion = (suggestion: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setInputMessage(suggestion.replace(/^[🍼📱🌱🏆♾️🌍🤖]\s*/u, '')); // Remove emoji prefix
  };

  const clearChat = () => {
    // Clear chat and immediately show welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: "👋 **Hi there!** Chat cleared! I'm EcoBot, ready to help you with waste management again! \n\n🎆 **What would you like to know about:**\n• 📚 Proper waste sorting\n• ♾️ Recycling guidelines\n• 🗺️ Finding disposal locations\n• 🏆 Earning reward points\n\nAsk me anything!",
      sender: 'bot',
      timestamp: new Date(),
      category: 'welcome'
    };
    setMessages([welcomeMessage]);
    setBotMood('happy');
    setUserInteractionCount(0);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card
        className="w-full max-w-2xl h-[80vh] mx-4 shadow-xl border-0"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="bg-gradient-eco text-primary-foreground">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <div className="relative">
                <Bot className={`w-6 h-6 transition-all duration-300 ${
                  botMood === 'excited' ? 'animate-bounce text-yellow-400' :
                  botMood === 'happy' ? 'text-green-400' :
                  botMood === 'thinking' ? 'animate-pulse text-blue-400' :
                  'text-primary-foreground'
                }`} />
                {isSpeaking && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                )}
                {isListening && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <span>EcoBot AI Assistant</span>
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground animate-pulse">
                {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : '✨ Online'}
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSpeech}
                className="text-primary-foreground hover:bg-primary-foreground/20"
                title={speechEnabled ? 'Turn off voice' : 'Turn on voice'}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-primary-foreground hover:bg-primary-foreground/20"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-primary-foreground hover:bg-primary-foreground/20"
                title="Close assistant"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-full p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg transition-all duration-300 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground transform hover:scale-105'
                        : 'bg-gradient-to-br from-muted to-muted/70 text-foreground shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          <Bot className="w-4 h-4 text-primary animate-pulse" />
                          <span className="text-xs font-medium text-primary">EcoBot</span>
                          {message.text.includes('**') && <Sparkles className="w-3 h-3 text-yellow-500 animate-spin" />}
                          {message.text.includes('🏆') && <Award className="w-3 h-3 text-yellow-500" />}
                          {message.text.includes('❤️') && <Heart className="w-3 h-3 text-red-500 animate-pulse" />}
                        </div>
                      </div>
                    )}
                    <div className="whitespace-pre-line text-sm">
                      {message.text}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground p-3 rounded-lg max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary">AI Assistant</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <Sparkles className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-border">
              <div className="text-sm text-muted-foreground mb-2">Quick questions:</div>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleQuickSuggestion(suggestion, e)}
                    className="text-xs h-8"
                    type="button"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "Listening... speak now!" : "Ask me about waste disposal, recycling, or points..."}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className={`flex-1 transition-all duration-300 ${
                  isListening ? 'ring-2 ring-red-400 bg-red-50 dark:bg-red-950' : ''
                }`}
                disabled={isTyping || isListening}
              />

              {/* Voice Input Button */}
              <Button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={isTyping || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                className={`transition-all duration-300 ${
                  isListening ? 'animate-pulse' : 'hover:scale-110'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>

              {/* Send Button */}
              <Button
                type="submit"
                disabled={!inputMessage.trim() || isTyping || isListening}
                size="icon"
                className="bg-primary hover:bg-primary/90 hover:scale-110 transition-all duration-300"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Ask me anything about waste management!</span>
                {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                  <span className="text-green-600 dark:text-green-400">🎤 Voice enabled</span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-yellow-500 animate-pulse" />
                  <span className="font-medium text-green-600 dark:text-green-400">EcoBot Online</span>
                </div>
                {userInteractionCount > 0 && (
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-blue-600 dark:text-blue-400">{userInteractionCount} questions asked</span>
                    <Award className="w-3 h-3 text-yellow-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
