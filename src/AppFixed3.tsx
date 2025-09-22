import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import WasteScanner from "./pages/WasteScanner";
import Dashboard from "./pages/Dashboard";
import DashboardWithNav from "./pages/DashboardWithNav";
import Rewards from "./pages/Rewards";
import BinLocator from "./pages/BinLocator";
import NotFound from "./pages/NotFound";
import Introduction from "./pages/Introduction";
import AuthPageFixed3 from "./components/AuthPageFixed3";
import AdminDashboard from "./components/AdminDashboard";
import UserHistory from "./components/UserHistory";
import FeedbackSystem from "./components/FeedbackSystem";
import TestFeedback from "./components/TestFeedback";
import DebugPage from "./components/DebugPage";
import BasicTest from "./components/BasicTest";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import FloatingAIButton from "./components/FloatingAIButton";
import MicTest from "./components/MicTest";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

// Simple protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const AppFixed3 = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Auto-hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FloatingAIButton />
          <Routes>
            {/* Main App Flow */}
            <Route path="/" element={<Navigate to="/introduction" replace />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/auth" element={<AuthPageFixed3 />} />

            {/* User Dashboard and Features */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard-with-nav" element={<ProtectedRoute><DashboardWithNav /></ProtectedRoute>} />
            <Route path="/scan" element={<ProtectedRoute><WasteScanner /></ProtectedRoute>} />
            <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
            <Route path="/bins" element={<ProtectedRoute><BinLocator /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><UserHistory /></ProtectedRoute>} />

            {/* Admin and Testing Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/feedback" element={<FeedbackSystem />} />
            <Route path="/test-feedback" element={<TestFeedback />} />
            <Route path="/debug" element={<DebugPage />} />
            <Route path="/basic" element={<BasicTest />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/mic-test" element={<MicTest />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppFixed3;
