import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
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
// New Assessment Tests
import SexAddictionTest from "./pages/tests/SexAddictionTest";
import VideoGameAddictionTest from "./pages/tests/VideoGameAddictionTest";
import InternetAddictionTest from "./pages/tests/InternetAddictionTest";
import JobBurnoutTest from "./pages/tests/JobBurnoutTest";
import ToxicWorkplaceTest from "./pages/tests/ToxicWorkplaceTest";
import PanicDisorderTest from "./pages/tests/PanicDisorderTest";
import OCDTest from "./pages/tests/OCDTest";
import BipolarTest from "./pages/tests/BipolarTest";
import SocialAnxietyTest from "./pages/tests/SocialAnxietyTest";
import HoardingTest from "./pages/tests/HoardingTest";
import PsychosisTest from "./pages/tests/PsychosisTest";
import GriefTest from "./pages/tests/GriefTest";
import DIDTest from "./pages/tests/DIDTest";
import SchizophreniaTest from "./pages/tests/SchizophreniaTest";
import StressTest from "./pages/tests/StressTest";
import AgoraphobiaTest from "./pages/tests/AgoraphobiaTest";
import SeparationAnxietyTest from "./pages/tests/SeparationAnxietyTest";
import SleepDisorderTest from "./pages/tests/SleepDisorderTest";
import EmpathyDeficitTest from "./pages/tests/EmpathyDeficitTest";
import BingeEatingTest from "./pages/tests/BingeEatingTest";
import GenderDysphoriaTest from "./pages/tests/GenderDysphoriaTest";
import RelationshipHealthTest from "./pages/tests/RelationshipHealthTest";
import SociopathyTest from "./pages/tests/SociopathyTest";
import JobSatisfactionTest from "./pages/tests/JobSatisfactionTest";
import WorkLifeBalanceTest from "./pages/tests/WorkLifeBalanceTest";
import ImposterSyndromeTest from "./pages/tests/ImposterSyndromeTest";
import SADTest from "./pages/tests/SADTest";
import HowToHandleStressPost from "./pages/blog/HowToHandleStressPost";
import PanicAttackPost from "./pages/blog/PanicAttackPost";
import DepressionPost from "./pages/blog/DepressionPost";
import MentalHealthPost from "./pages/blog/MentalHealthPost";
import AnxietyManagementPost from "./pages/blog/AnxietyManagementPost";
import SignsOfDepressionPost from "./pages/blog/SignsOfDepressionPost";
import AnxietySymptomsPost from "./pages/blog/AnxietySymptomsPost";
import HowToFindATherapistPost from "./pages/blog/HowToFindATherapistPost";
import ForBusiness from "./pages/ForBusiness";
import ForProfessionals from "./pages/ForProfessionals";
import Specialists from "./pages/Specialists";
import SpecialistProfile from "./pages/SpecialistProfile";
import ScrollToTop from "./components/ScrollToTop";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Learning from "./pages/Learning";
import CourseDetail from "./pages/CourseDetail";
import LessonViewer from "./pages/LessonViewer";
import CourseCertificate from "./pages/CourseCertificate";
import LearningDashboard from "./pages/LearningDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
// SEO Landing Pages
import OnlineTherapy from "./pages/OnlineTherapy";
import BookTherapist from "./pages/BookTherapist";
import MentalHealthSupport from "./pages/MentalHealthSupport";
import VideoTherapy from "./pages/VideoTherapy";
import ChatTherapy from "./pages/ChatTherapy";
// App Coming Soon Page
import AppComingSoon from "./pages/AppComingSoon";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
// Location SEO Pages
import TherapyInUganda from "./pages/TherapyInUganda";
import TherapyInKampala from "./pages/TherapyInKampala";
// Buying-Intent Blog Posts
import TherapyCostUgandaPost from "./pages/blog/TherapyCostUgandaPost";
import FindTherapistKampalaPost from "./pages/blog/FindTherapistKampalaPost";
import OnlineTherapyAfricaPost from "./pages/blog/OnlineTherapyAfricaPost";
import SignsYouNeedTherapistPost from "./pages/blog/SignsYouNeedTherapistPost";
import StudentTherapyUgandaPost from "./pages/blog/StudentTherapyUgandaPost";
// TOFU Blog Posts
import WhatIsTherapyPost from "./pages/blog/WhatIsTherapyPost";
import BenefitsOfTherapyPost from "./pages/blog/BenefitsOfTherapyPost";
import TypesOfTherapyPost from "./pages/blog/TypesOfTherapyPost";

const queryClient = new QueryClient();

// Language support enabled - LanguageProvider wraps entire app

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <AssessmentProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <FloatingWhatsApp />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/virtual-therapy" element={<VirtualTherapy />} />
            {/* SEO Landing Pages */}
            <Route path="/online-therapy" element={<OnlineTherapy />} />
            <Route path="/book-therapist" element={<BookTherapist />} />
            <Route path="/mental-health-support" element={<MentalHealthSupport />} />
            <Route path="/video-therapy" element={<VideoTherapy />} />
            <Route path="/chat-therapy" element={<ChatTherapy />} />
            <Route path="/app-coming-soon" element={<AppComingSoon />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-canceled" element={<PaymentCanceled />} />
            <Route path="/support-groups" element={<SupportGroups />} />
            <Route path="/chat-sessions" element={<ChatSessions />} />
            <Route path="/mood-check-in" element={<MoodCheckIn />} />
            <Route path="/my-goals" element={<MyGoals />} />
            <Route path="/emergency-support" element={<EmergencySupport />} />
            <Route path="/events-training" element={<EventsTraining />} />
            <Route path="/donate-therapy" element={<DonateTherapy />} />
            <Route path="/wellness-reports" element={<WellnessReports />} />
            <Route path="/meditations" element={<Meditations />} />
            <Route path="/find-therapist" element={<Navigate to="/specialists" replace />} />
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
            <Route path="/learning/dashboard" element={<LearningDashboard />} />
            <Route path="/learning/student-dashboard" element={<StudentDashboard />} />
            <Route path="/learning/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/learning/:courseId" element={<CourseDetail />} />
            <Route path="/learning/:courseId/certificate" element={<CourseCertificate />} />
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
            {/* New Assessment Tests */}
            <Route path="/mind-check/sex-addiction" element={<SexAddictionTest />} />
            <Route path="/mind-check/video-game-addiction" element={<VideoGameAddictionTest />} />
            <Route path="/mind-check/internet-addiction" element={<InternetAddictionTest />} />
            <Route path="/mind-check/job-burnout" element={<JobBurnoutTest />} />
            <Route path="/mind-check/toxic-workplace" element={<ToxicWorkplaceTest />} />
            <Route path="/mind-check/panic-disorder" element={<PanicDisorderTest />} />
            <Route path="/mind-check/ocd" element={<OCDTest />} />
            <Route path="/mind-check/bipolar" element={<BipolarTest />} />
            <Route path="/mind-check/social-anxiety" element={<SocialAnxietyTest />} />
            <Route path="/mind-check/hoarding" element={<HoardingTest />} />
            <Route path="/mind-check/psychosis" element={<PsychosisTest />} />
            <Route path="/mind-check/grief" element={<GriefTest />} />
            <Route path="/mind-check/did" element={<DIDTest />} />
            <Route path="/mind-check/schizophrenia" element={<SchizophreniaTest />} />
            <Route path="/mind-check/stress" element={<StressTest />} />
            <Route path="/mind-check/agoraphobia" element={<AgoraphobiaTest />} />
            <Route path="/mind-check/separation-anxiety" element={<SeparationAnxietyTest />} />
            <Route path="/mind-check/sleep-disorder" element={<SleepDisorderTest />} />
            <Route path="/mind-check/empathy-deficit" element={<EmpathyDeficitTest />} />
            <Route path="/mind-check/binge-eating" element={<BingeEatingTest />} />
            <Route path="/mind-check/gender-dysphoria" element={<GenderDysphoriaTest />} />
            <Route path="/mind-check/relationship-health" element={<RelationshipHealthTest />} />
            <Route path="/mind-check/sociopath" element={<SociopathyTest />} />
            <Route path="/mind-check/job-satisfaction" element={<JobSatisfactionTest />} />
            <Route path="/mind-check/work-life-balance" element={<WorkLifeBalanceTest />} />
            <Route path="/mind-check/imposter-syndrome" element={<ImposterSyndromeTest />} />
            <Route path="/mind-check/sad" element={<SADTest />} />
            <Route path="/blog/how-to-handle-stress" element={<HowToHandleStressPost />} />
            <Route path="/blog/how-to-stop-a-panic-attack" element={<PanicAttackPost />} />
            <Route path="/blog/how-to-deal-with-depression" element={<DepressionPost />} />
            <Route path="/blog/what-is-mental-health" element={<MentalHealthPost />} />
            <Route path="/blog/how-to-manage-anxiety" element={<AnxietyManagementPost />} />
            <Route path="/blog/signs-of-depression" element={<SignsOfDepressionPost />} />
            <Route path="/blog/anxiety-symptoms" element={<AnxietySymptomsPost />} />
            <Route path="/blog/how-to-find-a-therapist" element={<HowToFindATherapistPost />} />
            <Route path="/events-training/truck-drivers-retirement-training" element={<TruckDriversPost />} />
            <Route path="/events-training/founders-mindset-training" element={<FoundersPost />} />
            <Route path="/events-training/children-mental-health-awareness" element={<ChildrenMentalHealthPost />} />
            <Route path="/events-training/miic-wellness-innovation" element={<MIICPost />} />
            <Route path="/events-training/mtn-internship-anxiety" element={<MTNPost />} />
            <Route path="/events-training/world-mental-health-day-2024" element={<WorldMentalHealthDayPost />} />
            <Route path="/events-training/uict-mental-health-training" element={<UICTPost />} />
            <Route path="/events-training/uict-wellness-activity-day" element={<UICTWellnessPost />} />
            {/* Location SEO Pages */}
            <Route path="/therapy-in-uganda" element={<TherapyInUganda />} />
            <Route path="/therapy-in-kampala" element={<TherapyInKampala />} />
            {/* Buying-Intent Blog Posts */}
            <Route path="/blog/therapy-cost-uganda" element={<TherapyCostUgandaPost />} />
            <Route path="/blog/find-therapist-kampala" element={<FindTherapistKampalaPost />} />
            <Route path="/blog/online-therapy-effective-africa" element={<OnlineTherapyAfricaPost />} />
            <Route path="/blog/signs-you-need-a-therapist" element={<SignsYouNeedTherapistPost />} />
            <Route path="/blog/student-therapy-uganda" element={<StudentTherapyUgandaPost />} />
            {/* TOFU Blog Posts */}
            <Route path="/blog/what-is-therapy" element={<WhatIsTherapyPost />} />
            <Route path="/blog/benefits-of-therapy" element={<BenefitsOfTherapyPost />} />
            <Route path="/blog/types-of-therapy" element={<TypesOfTherapyPost />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AssessmentProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
