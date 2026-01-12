import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
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
import Contact from "./pages/Contact";
// import Careers from "./pages/Careers";
import TruckDriversPost from "./pages/blog/TruckDriversPost";
import FoundersPost from "./pages/blog/FoundersPost";
import ChildrenMentalHealthPost from "./pages/blog/ChildrenMentalHealthPost";
import MIICPost from "./pages/blog/MIICPost";
import MTNPost from "./pages/blog/MTNPost";
import WorldMentalHealthDayPost from "./pages/blog/WorldMentalHealthDayPost";
import UICTPost from "./pages/blog/UICTPost";
import UICTWellnessPost from "./pages/blog/UICTWellnessPost";
import Blog from "./pages/Blog";
import MindCheck from "./pages/MindCheck";
import DepressionTest from "./pages/tests/DepressionTest";
import AnxietyTest from "./pages/tests/AnxietyTest";
import AdultADHDTest from "./pages/tests/AdultADHDTest";
import PTSDTest from "./pages/tests/PTSDTest";
import BorderlinePersonalityTest from "./pages/tests/BorderlinePersonalityTest";
import EatingDisorderTest from "./pages/tests/EatingDisorderTest";
import GamblingAddictionTest from "./pages/tests/GamblingAddictionTest";
import ManiaTest from "./pages/tests/ManiaTest";
import NarcissisticPersonalityTest from "./pages/tests/NarcissisticPersonalityTest";
import PostpartumDepressionTest from "./pages/tests/PostpartumDepressionTest";
import HowToHandleStressPost from "./pages/blog/HowToHandleStressPost";
import PanicAttackPost from "./pages/blog/PanicAttackPost";
import DepressionPost from "./pages/blog/DepressionPost";
import MentalHealthPost from "./pages/blog/MentalHealthPost";
import AnxietyManagementPost from "./pages/blog/AnxietyManagementPost";
import ForBusiness from "./pages/ForBusiness";
import ForProfessionals from "./pages/ForProfessionals";
import Specialists from "./pages/Specialists";
import SpecialistProfile from "./pages/SpecialistProfile";
import ScrollToTop from "./components/ScrollToTop";
import Learning from "./pages/Learning";
import CourseDetail from "./pages/CourseDetail";
import LessonViewer from "./pages/LessonViewer";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

// Language support enabled - LanguageProvider wraps entire app

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
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
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/careers" element={<Careers />} /> */}
            <Route path="/for-business" element={<ForBusiness />} />
            <Route path="/for-professionals" element={<ForProfessionals />} />
            <Route path="/specialists" element={<Specialists />} />
            <Route path="/specialists/:id" element={<SpecialistProfile />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/learning/:courseId" element={<CourseDetail />} />
            <Route path="/learning/:courseId/module/:moduleId/lesson/:lessonId" element={<LessonViewer />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/mind-check" element={<MindCheck />} />
            <Route path="/mind-check/depression" element={<DepressionTest />} />
            <Route path="/mind-check/anxiety" element={<AnxietyTest />} />
            <Route path="/mind-check/adult-adhd" element={<AdultADHDTest />} />
            <Route path="/mind-check/ptsd" element={<PTSDTest />} />
            <Route path="/mind-check/bpd" element={<BorderlinePersonalityTest />} />
            <Route path="/mind-check/eating-disorder" element={<EatingDisorderTest />} />
            <Route path="/mind-check/gambling-addiction" element={<GamblingAddictionTest />} />
            <Route path="/mind-check/mania" element={<ManiaTest />} />
            <Route path="/mind-check/npd" element={<NarcissisticPersonalityTest />} />
            <Route path="/mind-check/postpartum" element={<PostpartumDepressionTest />} />
            <Route path="/blog/how-to-handle-stress" element={<HowToHandleStressPost />} />
            <Route path="/blog/how-to-stop-a-panic-attack" element={<PanicAttackPost />} />
            <Route path="/blog/how-to-deal-with-depression" element={<DepressionPost />} />
            <Route path="/blog/what-is-mental-health" element={<MentalHealthPost />} />
            <Route path="/blog/how-to-manage-anxiety" element={<AnxietyManagementPost />} />
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
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
