import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VirtualTherapy from "./pages/VirtualTherapy";
import SupportGroups from "./pages/SupportGroups";
import ChatSessions from "./pages/ChatSessions";
import MoodCheckIn from "./pages/MoodCheckIn";
import MyGoals from "./pages/MyGoals";
import EmergencySupport from "./pages/EmergencySupport";
import EventsTraining from "./pages/EventsTraining";
import DonateTherapy from "./pages/DonateTherapy";
import WellnessReports from "./pages/WellnessReports";
import Meditations from "./pages/Meditations";
import FindTherapist from "./pages/FindTherapist";
import ProfileSettings from "./pages/ProfileSettings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/virtual-therapy" element={<VirtualTherapy />} />
          <Route path="/support-groups" element={<SupportGroups />} />
          <Route path="/chat-sessions" element={<ChatSessions />} />
          <Route path="/mood-check-in" element={<MoodCheckIn />} />
          <Route path="/my-goals" element={<MyGoals />} />
          <Route path="/emergency-support" element={<EmergencySupport />} />
          <Route path="/events-training" element={<EventsTraining />} />
          <Route path="/donate-therapy" element={<DonateTherapy />} />
          <Route path="/wellness-reports" element={<WellnessReports />} />
          <Route path="/meditations" element={<Meditations />} />
          <Route path="/find-therapist" element={<FindTherapist />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
