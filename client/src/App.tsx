import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CareerAssessment from "./pages/CareerAssessment";
import SkillsDevelopment from "./pages/SkillsDevelopment";
import MentorshipNetwork from "./pages/MentorshipNetwork";
import JobMatching from "./pages/JobMatching";
import Communities from "./pages/Communities";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import CVGenerator from "./pages/CVGenerator";
import CoverLetterGenerator from "./pages/CoverLetterGenerator";
import CareerPathwayGenerator from "./pages/CareerPathwayGenerator";
import AiServices from "./pages/AiServices";
import JobSearch from "./pages/JobSearch";
import MoMoServices from "./pages/MoMoServices";
import MentorPayments from "./pages/MentorPayments";

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">C</span>
          </div>
          <div className="text-lg font-semibold">Loading CareerNest...</div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            {!isAuthenticated ? (
              // Public routes - only landing page accessible when not logged in
              <>
                <Route path="/" element={<Landing />} />
                <Route path="*" element={<Landing />} />
              </>
            ) : (
              // Protected routes - only accessible when logged in
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/career-assessment" element={<CareerAssessment />} />
                <Route path="/skills-development" element={<SkillsDevelopment />} />
                <Route path="/mentorship" element={<MentorshipNetwork />} />
                <Route path="/job-matching" element={<JobMatching />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/success-stories" element={<SuccessStoriesPage />} />
                <Route path="/cv-generator" element={<CVGenerator />} />
                <Route path="/cover-letter" element={<CoverLetterGenerator />} />
                <Route path="/career-pathway" element={<CareerPathwayGenerator />} />
                <Route path="/ai-services" element={<AiServices />} />
                <Route path="/job-search" element={<JobSearch />} />
                <Route path="/momo-services" element={<MoMoServices />} />
                <Route path="/mentor-payments" element={<MentorPayments />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
