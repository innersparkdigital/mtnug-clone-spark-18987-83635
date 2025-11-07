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
import Services from "./pages/Services";
import About from "./pages/About";
import Leadership from "./pages/Leadership";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import TruckDriversPost from "./pages/blog/TruckDriversPost";
import FoundersPost from "./pages/blog/FoundersPost";
import ChildrenMentalHealthPost from "./pages/blog/ChildrenMentalHealthPost";
import MIICPost from "./pages/blog/MIICPost";
import MTNPost from "./pages/blog/MTNPost";
import WorldMentalHealthDayPost from "./pages/blog/WorldMentalHealthDayPost";
import UICTPost from "./pages/blog/UICTPost";
import UICTWellnessPost from "./pages/blog/UICTWellnessPost";

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
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/events-training/truck-drivers-retirement-training" element={<TruckDriversPost />} />
          <Route path="/events-training/founders-mindset-training" element={<FoundersPost />} />
          <Route path="/events-training/children-mental-health-awareness" element={<ChildrenMentalHealthPost />} />
          <Route path="/events-training/miic-wellness-innovation" element={<MIICPost />} />
          <Route path="/events-training/mtn-internship-anxiety" element={<MTNPost />} />
          <Route path="/events-training/world-mental-health-day-2024" element={<WorldMentalHealthDayPost />} />
          <Route path="/events-training/uict-mental-health-training" element={<UICTPost />} />
          <Route path="/events-training/uict-wellness-activity-day" element={<UICTWellnessPost />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
