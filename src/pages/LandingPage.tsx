import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Recycle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/ecobin-hero.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animate content in after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const goToIntro = () => {
    navigate('/introduction');
  };

  const goToAuth = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-eco flex flex-col items-center justify-center p-4 overflow-hidden">
      <div 
        className={`max-w-4xl w-full text-center transition-all duration-1000 transform ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Logo and App Name */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <Recycle className="w-16 h-16 text-primary-foreground" />
              <Leaf className="absolute -top-1 -right-1 w-8 h-8 text-accent-foreground animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold text-primary-foreground tracking-tight">
              EcoBin
            </h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl text-primary-foreground/90 font-medium max-w-xl mx-auto">
            Dispose Smart. Earn Rewards. Save Earth.
          </h2>
        </div>

        {/* Hero Image */}
        <div 
          className={`relative mx-auto mb-10 transition-all duration-1000 delay-300 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <img 
            src={heroImage} 
            alt="EcoBin - Smart Waste Management" 
            className="w-full max-w-2xl h-auto object-cover rounded-2xl shadow-glow"
          />
          <div className="absolute inset-0 bg-primary/10 rounded-2xl"></div>
        </div>

        {/* Action Buttons */}
        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-500 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Button 
            onClick={goToIntro} 
            className="bg-white text-green-700 hover:bg-white/90 text-lg px-6 py-6 h-auto rounded-full shadow-lg flex items-center gap-2 font-semibold"
            size="lg"
          >
            Learn How It Works
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
          
          <Button 
            onClick={goToAuth} 
            className="bg-green-700 text-white hover:bg-green-800 text-lg px-6 py-6 h-auto rounded-full shadow-lg flex items-center gap-2 font-semibold"
            size="lg"
          >
            Get Started
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;