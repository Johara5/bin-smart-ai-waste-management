import { useEffect, useState } from 'react';
import { Leaf, Recycle } from 'lucide-react';
import heroImage from '@/assets/ecobin-hero.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-eco transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative flex flex-col items-center space-y-8 text-center px-8">
        {/* Hero Image */}
        <div className="relative">
          <img 
            src={heroImage} 
            alt="EcoBin - Smart Waste Management" 
            className="w-64 h-36 object-cover rounded-2xl shadow-glow animate-float"
          />
          <div className="absolute inset-0 bg-primary/20 rounded-2xl"></div>
        </div>

        {/* App Logo and Name */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Recycle className="w-12 h-12 text-primary-foreground animate-spin" style={{ animationDuration: '3s' }} />
              <Leaf className="absolute -top-1 -right-1 w-6 h-6 text-accent-foreground animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold text-primary-foreground tracking-tight">
              EcoBin
            </h1>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <p className="text-xl text-primary-foreground/90 font-medium">
              Dispose Smart. Earn Rewards.
            </p>
            <p className="text-lg text-primary-foreground/80 flex items-center justify-center space-x-2">
              <span>Save Earth</span>
              <span className="text-2xl animate-pulse">🌍</span>
            </p>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="flex space-x-2 mt-8">
          <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-pulse delay-100"></div>
          <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;