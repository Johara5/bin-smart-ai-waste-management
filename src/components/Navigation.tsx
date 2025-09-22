import { Home, QrCode, Gift, MapPin, Camera, History, MessageSquare, BarChart3, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Home, label: 'Introduction', path: '/introduction' },
    { icon: QrCode, label: 'Scan Waste', path: '/scan' },
    { icon: Gift, label: 'Rewards', path: '/rewards' },
    { icon: MapPin, label: 'Find Bins', path: '/bins' },
    { icon: History, label: 'My History', path: '/history' },
    { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
  ];

  const adminItems = [
    { icon: BarChart3, label: 'Admin Dashboard', path: '/admin' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <nav className="bg-card shadow-card-eco border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/introduction')}>
            <img src="/logo.svg" alt="EcoBin Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-foreground">EcoBin</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "eco" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            
            {/* Admin Items */}
            <div className="border-l border-border ml-2 pl-2">
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Get Started Button */}
          <Button 
            variant="eco" 
            size="sm"
            onClick={() => navigate('/scan')}
            className="hidden sm:flex"
          >
            <Camera className="w-4 h-4 mr-2" />
            Get Started
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 h-auto py-2 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;