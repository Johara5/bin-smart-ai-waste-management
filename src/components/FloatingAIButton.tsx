import { useState } from 'react';
import { Bot, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleAIAssistant from './SimpleAIAssistant';

const FloatingAIButton = () => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-eco hover:bg-gradient-eco/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
          onClick={() => setIsAIAssistantOpen(true)}
        >
          <Bot className="w-6 h-6 text-primary-foreground" />
        </Button>
        
        {/* Pulsing indicator for attention */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-status-success rounded-full animate-pulse"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          AI Waste Assistant
        </div>
      </div>

      {/* AI Assistant Modal */}
      <SimpleAIAssistant 
        isOpen={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
      />
    </>
  );
};

export default FloatingAIButton;
