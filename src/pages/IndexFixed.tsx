import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '@/components/SplashScreen';
import AuthPageFixed from '@/components/AuthPageFixed';
import Dashboard from '@/components/Dashboard';

const IndexFixed = () => {
  const [currentView, setCurrentView] = useState<'splash' | 'auth' | 'dashboard'>('splash');

  useEffect(() => {
    // Show splash screen for 2 seconds, then show auth page
    const timer = setTimeout(() => {
      setCurrentView('auth');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      // User is already logged in, redirect to dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSplashComplete = () => {
    navigate('/introduction');
  };

  const goToIntroduction = () => {
    navigate('/introduction');
  };

  const handleLogin = () => {
    // After successful login, the token and user data will be in localStorage
    // and the user will be redirected to dashboard
    navigate('/dashboard');
  };

  if (currentView === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentView === 'auth') {
    return (
      <div className="flex flex-col items-center">
        <AuthPageFixed onLogin={handleLogin} />
        <button
          onClick={goToIntroduction}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Learn How It Works
        </button>
      </div>
    );
  }

  // This should never be reached as we're using navigate now
  return null;
};

export default IndexFixed;
