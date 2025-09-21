import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, Leaf } from 'lucide-react';

const AppLogo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Show logo for 3 seconds then navigate to introduction
    const timer = setTimeout(() => {
      navigate('/introduction');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-eco flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* App Logo */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <Recycle className="w-20 h-20 text-primary-foreground animate-spin" style={{ animationDuration: '3s' }} />
              <Leaf className="absolute -top-2 -right-2 w-8 h-8 text-accent-foreground animate-pulse" />
            </div>
            <h1 className="text-6xl font-bold text-primary-foreground tracking-tight">
              BinSmart
            </h1>
          </div>
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <p className="text-2xl text-primary-foreground/90 font-medium">
            Smart Waste Management
          </p>
          <p className="text-lg text-primary-foreground/80 flex items-center justify-center space-x-2">
            <span>Dispose Smart. Earn Rewards. Save Earth</span>
            <span className="text-3xl animate-pulse">🌍</span>
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex space-x-2 justify-center mt-12">
          <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-pulse delay-100"></div>
          <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default AppLogo;