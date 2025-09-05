import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import AuthPage from '@/components/AuthPage';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<'splash' | 'auth' | 'dashboard'>('splash');

  const handleSplashComplete = () => {
    setCurrentView('auth');
  };

  const handleLogin = () => {
    setCurrentView('dashboard');
  };

  if (currentView === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentView === 'auth') {
    return <AuthPage onLogin={handleLogin} />;
  }

  // After login, redirect to dashboard with navigation
  window.location.href = '/dashboard';
  return null;
};

export default Index;
