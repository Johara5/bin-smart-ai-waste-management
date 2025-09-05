import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WasteScanner from "./pages/WasteScanner";
import DashboardWithNav from "./pages/DashboardWithNav";
import Rewards from "./pages/Rewards";
import BinLocator from "./pages/BinLocator";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/AdminDashboard";
import UserHistory from "./components/UserHistory";
import FeedbackSystem from "./components/FeedbackSystem";
import TestFeedback from "./components/TestFeedback";
import DebugPage from "./components/DebugPage";
import BasicTest from "./components/BasicTest";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import FloatingAIButton from "./components/FloatingAIButton";
import MicTest from "./components/MicTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <FloatingAIButton />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardWithNav />} />
          <Route path="/scan" element={<WasteScanner />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/bins" element={<BinLocator />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/history" element={<UserHistory />} />
          <Route path="/feedback" element={<FeedbackSystem />} />
          <Route path="/test-feedback" element={<TestFeedback />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="/basic" element={<BasicTest />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/mic-test" element={<MicTest />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
