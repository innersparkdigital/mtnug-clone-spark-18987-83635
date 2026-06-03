import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
// Keep Index eager — it's the LCP/landing route. Everything else is lazy
// so visitors download only the JS for the page they actually open.
import Index from "./pages/Index";
const NotFound = lazy(() => import("./pages/NotFound"));
const VirtualTherapy = lazy(() => import("./pages/VirtualTherapy"));
const SupportGroups = lazy(() => import("./pages/SupportGroups"));
const ChatSessions = lazy(() => import("./pages/ChatSessions"));
const MoodCheckIn = lazy(() => import("./pages/MoodCheckIn"));
const MyGoals = lazy(() => import("./pages/MyGoals"));
const EmergencySupport = lazy(() => import("./pages/EmergencySupport"));
const EventsTraining = lazy(() => import("./pages/EventsTraining"));
const DonateTherapy = lazy(() => import("./pages/DonateTherapy"));
const WellnessReports = lazy(() => import("./pages/WellnessReports"));
const Meditations = lazy(() => import("./pages/Meditations"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const AccountDeletion = lazy(() => import("./pages/AccountDeletion"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const TruckDriversPost = lazy(() => import("./pages/blog/TruckDriversPost"));
const FoundersPost = lazy(() => import("./pages/blog/FoundersPost"));
const ChildrenMentalHealthPost = lazy(
  () => import("./pages/blog/ChildrenMentalHealthPost"),
);
const MIICPost = lazy(() => import("./pages/blog/MIICPost"));
const MTNPost = lazy(() => import("./pages/blog/MTNPost"));
const WorldMentalHealthDayPost = lazy(
  () => import("./pages/blog/WorldMentalHealthDayPost"),
);
const UICTPost = lazy(() => import("./pages/blog/UICTPost"));
const UICTWellnessPost = lazy(() => import("./pages/blog/UICTWellnessPost"));
const Blog = lazy(() => import("./pages/Blog"));
const MindCheck = lazy(() => import("./pages/MindCheck"));
const DepressionTest = lazy(() => import("./pages/tests/DepressionTest"));
const AnxietyTest = lazy(() => import("./pages/tests/AnxietyTest"));
const AdultADHDTest = lazy(() => import("./pages/tests/AdultADHDTest"));
const PTSDTest = lazy(() => import("./pages/tests/PTSDTest"));
const BorderlinePersonalityTest = lazy(
  () => import("./pages/tests/BorderlinePersonalityTest"),
);
const EatingDisorderTest = lazy(
  () => import("./pages/tests/EatingDisorderTest"),
);
const GamblingAddictionTest = lazy(
  () => import("./pages/tests/GamblingAddictionTest"),
);
const ManiaTest = lazy(() => import("./pages/tests/ManiaTest"));
const NarcissisticPersonalityTest = lazy(
  () => import("./pages/tests/NarcissisticPersonalityTest"),
);
const PostpartumDepressionTest = lazy(
  () => import("./pages/tests/PostpartumDepressionTest"),
);
const SexAddictionTest = lazy(() => import("./pages/tests/SexAddictionTest"));
const VideoGameAddictionTest = lazy(
  () => import("./pages/tests/VideoGameAddictionTest"),
);
const InternetAddictionTest = lazy(
  () => import("./pages/tests/InternetAddictionTest"),
);
const JobBurnoutTest = lazy(() => import("./pages/tests/JobBurnoutTest"));
const ToxicWorkplaceTest = lazy(
  () => import("./pages/tests/ToxicWorkplaceTest"),
);
const PanicDisorderTest = lazy(() => import("./pages/tests/PanicDisorderTest"));
const OCDTest = lazy(() => import("./pages/tests/OCDTest"));
const BipolarTest = lazy(() => import("./pages/tests/BipolarTest"));
const SocialAnxietyTest = lazy(() => import("./pages/tests/SocialAnxietyTest"));
const HoardingTest = lazy(() => import("./pages/tests/HoardingTest"));
const PsychosisTest = lazy(() => import("./pages/tests/PsychosisTest"));
const GriefTest = lazy(() => import("./pages/tests/GriefTest"));
const DIDTest = lazy(() => import("./pages/tests/DIDTest"));
const SchizophreniaTest = lazy(() => import("./pages/tests/SchizophreniaTest"));
const StressTest = lazy(() => import("./pages/tests/StressTest"));
const AgoraphobiaTest = lazy(() => import("./pages/tests/AgoraphobiaTest"));
const SeparationAnxietyTest = lazy(
  () => import("./pages/tests/SeparationAnxietyTest"),
);
const SleepDisorderTest = lazy(() => import("./pages/tests/SleepDisorderTest"));
const EmpathyDeficitTest = lazy(
  () => import("./pages/tests/EmpathyDeficitTest"),
);
const BingeEatingTest = lazy(() => import("./pages/tests/BingeEatingTest"));
const GenderDysphoriaTest = lazy(
  () => import("./pages/tests/GenderDysphoriaTest"),
);
const RelationshipHealthTest = lazy(
  () => import("./pages/tests/RelationshipHealthTest"),
);
const SociopathyTest = lazy(() => import("./pages/tests/SociopathyTest"));
const JobSatisfactionTest = lazy(
  () => import("./pages/tests/JobSatisfactionTest"),
);
const WorkLifeBalanceTest = lazy(
  () => import("./pages/tests/WorkLifeBalanceTest"),
);
const ImposterSyndromeTest = lazy(
  () => import("./pages/tests/ImposterSyndromeTest"),
);
const SADTest = lazy(() => import("./pages/tests/SADTest"));
const HowToHandleStressPost = lazy(
  () => import("./pages/blog/HowToHandleStressPost"),
);
const PanicAttackPost = lazy(() => import("./pages/blog/PanicAttackPost"));
const DepressionPost = lazy(() => import("./pages/blog/DepressionPost"));
const MentalHealthPost = lazy(() => import("./pages/blog/MentalHealthPost"));
const AnxietyManagementPost = lazy(
  () => import("./pages/blog/AnxietyManagementPost"),
);
const SignsOfDepressionPost = lazy(
  () => import("./pages/blog/SignsOfDepressionPost"),
);
const AnxietySymptomsPost = lazy(
  () => import("./pages/blog/AnxietySymptomsPost"),
);
const HowToFindATherapistPost = lazy(
  () => import("./pages/blog/HowToFindATherapistPost"),
);
const ForBusiness = lazy(() => import("./pages/ForBusiness"));
const ForProfessionals = lazy(() => import("./pages/ForProfessionals"));
const DoctorRefer = lazy(() => import("./pages/professionals/DoctorRefer"));
const Specialists = lazy(() => import("./pages/Specialists"));
const SpecialistProfile = lazy(() => import("./pages/SpecialistProfile"));
import ScrollToTop from "./components/ScrollToTop";
import AIChatWidget from "./components/AIChatWidget";
import WhisperFloatingWidget from "./components/WhisperFloatingWidget";
const Learning = lazy(() => import("./pages/Learning"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const LessonViewer = lazy(() => import("./pages/LessonViewer"));
const CourseCertificate = lazy(() => import("./pages/CourseCertificate"));
const LearningDashboard = lazy(() => import("./pages/LearningDashboard"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const AdminDashboard = lazy(
  () => import(/* webpackChunkName: "admin" */ "./pages/AdminDashboard"),
);
const AdminFinance = lazy(
  () => import(/* webpackChunkName: "admin" */ "./pages/AdminFinance"),
);
const MindCheckAnalytics = lazy(
  () => import(/* webpackChunkName: "admin" */ "./pages/MindCheckAnalytics"),
);
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const OnlineTherapy = lazy(() => import("./pages/OnlineTherapy"));
const BookTherapist = lazy(() => import("./pages/BookTherapist"));
const MentalHealthSupport = lazy(() => import("./pages/MentalHealthSupport"));
const VideoTherapy = lazy(() => import("./pages/VideoTherapy"));
const ChatTherapy = lazy(() => import("./pages/ChatTherapy"));
const AppComingSoon = lazy(() => import("./pages/AppComingSoon"));
const WellbeingCheck = lazy(() => import("./pages/WellbeingCheck"));
const Trainings = lazy(() => import("./pages/Trainings"));
const CorporateWellbeingCheck = lazy(
  () => import("./pages/CorporateWellbeingCheck"),
);
const CorporateAdmin = lazy(
  () => import(/* webpackChunkName: "admin" */ "./pages/CorporateAdmin"),
);
const CampaignLanding = lazy(() => import("./pages/CampaignLanding"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCanceled = lazy(() => import("./pages/PaymentCanceled"));
const TherapyInUganda = lazy(() => import("./pages/TherapyInUganda"));
const TherapyInKampala = lazy(() => import("./pages/TherapyInKampala"));
const TherapyCostUgandaPost = lazy(
  () => import("./pages/blog/TherapyCostUgandaPost"),
);
const FindTherapistKampalaPost = lazy(
  () => import("./pages/blog/FindTherapistKampalaPost"),
);
const OnlineTherapyAfricaPost = lazy(
  () => import("./pages/blog/OnlineTherapyAfricaPost"),
);
const SignsYouNeedTherapistPost = lazy(
  () => import("./pages/blog/SignsYouNeedTherapistPost"),
);
const StudentTherapyUgandaPost = lazy(
  () => import("./pages/blog/StudentTherapyUgandaPost"),
);
const WhatIsTherapyPost = lazy(() => import("./pages/blog/WhatIsTherapyPost"));
const BenefitsOfTherapyPost = lazy(
  () => import("./pages/blog/BenefitsOfTherapyPost"),
);
const TypesOfTherapyPost = lazy(
  () => import("./pages/blog/TypesOfTherapyPost"),
);
const KampalaProfessionalsOnlineTherapyPost = lazy(
  () => import("./pages/blog/KampalaProfessionalsOnlineTherapyPost"),
);
const MenTherapyUgandaPost = lazy(
  () => import("./pages/blog/MenTherapyUgandaPost"),
);
const BurnoutKampalaProfessionalsPost = lazy(
  () => import("./pages/blog/BurnoutKampalaProfessionalsPost"),
);
const RelationshipCounsellingUgandaPost = lazy(
  () => import("./pages/blog/RelationshipCounsellingUgandaPost"),
);
const UgandaWorkplaceCrisisPost = lazy(
  () => import("./pages/blog/UgandaWorkplaceCrisisPost"),
);
const InnerSparkAfricaReviewPost = lazy(
  () => import("./pages/blog/InnerSparkAfricaReviewPost"),
);
const SparkFrameworkPost = lazy(
  () => import("./pages/blog/SparkFrameworkPost"),
);
const MeetAmaniPost = lazy(() => import("./pages/blog/MeetAmaniPost"));
const WhisperAnonymousPost = lazy(
  () => import("./pages/blog/WhisperAnonymousPost"),
);
const FindTherapistUgandaPost = lazy(
  () => import("./pages/blog/FindTherapistUgandaPost"),
);
const CorporateWellbeingScreeningPost = lazy(
  () => import("./pages/blog/CorporateWellbeingScreeningPost"),
);
const AmaniAI = lazy(() => import("./pages/AmaniAI"));
const CmsBlogPost = lazy(() => import("./pages/CmsBlogPost"));
const CmsEventPost = lazy(() => import("./pages/CmsEventPost"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const CorporateServiceRequest = lazy(
  () => import("./pages/CorporateServiceRequest"),
);
const Whisper = lazy(() => import("./pages/Whisper"));
const SessionFeedback = lazy(() => import("./pages/SessionFeedback"));
const Kenya = lazy(() => import("./pages/Kenya"));
const KenyaCheck = lazy(() => import("./pages/KenyaCheck"));
const KenyaReferralRedirect = lazy(
  () => import("./pages/KenyaReferralRedirect"),
);

const queryClient = new QueryClient();

// Language support enabled - LanguageProvider wraps entire app

const RouteFallback = () => (
  <div
    className="min-h-[60vh] flex items-center justify-center"
    aria-busy="true"
    aria-live="polite"
  >
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

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
              <AIChatWidget />
              <WhisperFloatingWidget />
              <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/virtual-therapy" element={<VirtualTherapy />} />
                {/* SEO Landing Pages */}
                <Route path="/online-therapy" element={<OnlineTherapy />} />
                <Route path="/book-therapist" element={<BookTherapist />} />
                <Route
                  path="/mental-health-support"
                  element={<MentalHealthSupport />}
                />
                <Route path="/video-therapy" element={<VideoTherapy />} />
                <Route path="/chat-therapy" element={<ChatTherapy />} />
                <Route path="/app-coming-soon" element={<AppComingSoon />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-canceled" element={<PaymentCanceled />} />
                <Route path="/support-groups" element={<SupportGroups />} />
                <Route path="/chat-sessions" element={<ChatSessions />} />
                <Route path="/mood-check-in" element={<MoodCheckIn />} />
                <Route path="/my-goals" element={<MyGoals />} />
                <Route
                  path="/emergency-support"
                  element={<EmergencySupport />}
                />
                <Route path="/events-training" element={<EventsTraining />} />
                <Route
                  path="/events-training/trainings"
                  element={<Trainings />}
                />
                <Route
                  path="/corporate-wellbeing-check"
                  element={<CorporateWellbeingCheck />}
                />
                <Route path="/corporate-admin" element={<CorporateAdmin />} />
                <Route path="/check/:slug" element={<CampaignLanding />} />
                <Route path="/donate-therapy" element={<DonateTherapy />} />
                <Route path="/wellness-reports" element={<WellnessReports />} />
                <Route path="/meditations" element={<Meditations />} />
                <Route
                  path="/find-therapist"
                  element={<Navigate to="/specialists" replace />}
                />
                <Route path="/profile-settings" element={<ProfileSettings />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/account-deletion" element={<AccountDeletion />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                {/* <Route path="/careers" element={<Careers />} /> */}
                <Route path="/for-business" element={<ForBusiness />} />
                <Route
                  path="/for-professionals"
                  element={<ForProfessionals />}
                />
                <Route
                  path="/for-professionals/refer"
                  element={<DoctorRefer />}
                />
                <Route path="/specialists" element={<Specialists />} />
                <Route
                  path="/specialists/:id"
                  element={<SpecialistProfile />}
                />
                <Route path="/learning" element={<Learning />} />
                <Route
                  path="/learning/dashboard"
                  element={<LearningDashboard />}
                />
                <Route
                  path="/learning/student-dashboard"
                  element={<StudentDashboard />}
                />
                <Route
                  path="/learning/admin-dashboard"
                  element={<AdminDashboard />}
                />
                <Route path="/admin/finance" element={<AdminFinance />} />
                <Route path="/learning/:courseId" element={<CourseDetail />} />
                <Route
                  path="/learning/:courseId/certificate"
                  element={<CourseCertificate />}
                />
                <Route
                  path="/learning/:courseId/module/:moduleId/lesson/:lessonId"
                  element={<LessonViewer />}
                />
                <Route path="/blog" element={<Blog />} />
                <Route path="/wellbeing-check" element={<WellbeingCheck />} />
                <Route path="/whisper" element={<Whisper />} />
                <Route path="/whisper/:token" element={<Whisper />} />
                <Route path="/amani-ai" element={<AmaniAI />} />
                <Route path="/mind-check" element={<MindCheck />} />
                <Route
                  path="/mind-check/analytics"
                  element={<MindCheckAnalytics />}
                />
                <Route
                  path="/mind-check/depression"
                  element={<DepressionTest />}
                />
                <Route path="/mind-check/anxiety" element={<AnxietyTest />} />
                <Route
                  path="/mind-check/adult-adhd"
                  element={<AdultADHDTest />}
                />
                <Route path="/mind-check/ptsd" element={<PTSDTest />} />
                <Route
                  path="/mind-check/bpd"
                  element={<BorderlinePersonalityTest />}
                />
                <Route
                  path="/mind-check/eating-disorder"
                  element={<EatingDisorderTest />}
                />
                <Route
                  path="/mind-check/gambling-addiction"
                  element={<GamblingAddictionTest />}
                />
                <Route path="/mind-check/mania" element={<ManiaTest />} />
                <Route
                  path="/mind-check/npd"
                  element={<NarcissisticPersonalityTest />}
                />
                <Route
                  path="/mind-check/postpartum"
                  element={<PostpartumDepressionTest />}
                />
                {/* New Assessment Tests */}
                <Route
                  path="/mind-check/sex-addiction"
                  element={<SexAddictionTest />}
                />
                <Route
                  path="/mind-check/video-game-addiction"
                  element={<VideoGameAddictionTest />}
                />
                <Route
                  path="/mind-check/internet-addiction"
                  element={<InternetAddictionTest />}
                />
                <Route
                  path="/mind-check/job-burnout"
                  element={<JobBurnoutTest />}
                />
                <Route
                  path="/mind-check/toxic-workplace"
                  element={<ToxicWorkplaceTest />}
                />
                <Route
                  path="/mind-check/panic-disorder"
                  element={<PanicDisorderTest />}
                />
                <Route path="/mind-check/ocd" element={<OCDTest />} />
                <Route path="/mind-check/bipolar" element={<BipolarTest />} />
                <Route
                  path="/mind-check/social-anxiety"
                  element={<SocialAnxietyTest />}
                />
                <Route path="/mind-check/hoarding" element={<HoardingTest />} />
                <Route
                  path="/mind-check/psychosis"
                  element={<PsychosisTest />}
                />
                <Route path="/mind-check/grief" element={<GriefTest />} />
                <Route path="/mind-check/did" element={<DIDTest />} />
                <Route
                  path="/mind-check/schizophrenia"
                  element={<SchizophreniaTest />}
                />
                <Route path="/mind-check/stress" element={<StressTest />} />
                <Route
                  path="/mind-check/agoraphobia"
                  element={<AgoraphobiaTest />}
                />
                <Route
                  path="/mind-check/separation-anxiety"
                  element={<SeparationAnxietyTest />}
                />
                <Route
                  path="/mind-check/sleep-disorder"
                  element={<SleepDisorderTest />}
                />
                <Route
                  path="/mind-check/empathy-deficit"
                  element={<EmpathyDeficitTest />}
                />
                <Route
                  path="/mind-check/binge-eating"
                  element={<BingeEatingTest />}
                />
                <Route
                  path="/mind-check/gender-dysphoria"
                  element={<GenderDysphoriaTest />}
                />
                <Route
                  path="/mind-check/relationship-health"
                  element={<RelationshipHealthTest />}
                />
                <Route
                  path="/mind-check/sociopath"
                  element={<SociopathyTest />}
                />
                <Route
                  path="/mind-check/job-satisfaction"
                  element={<JobSatisfactionTest />}
                />
                <Route
                  path="/mind-check/work-life-balance"
                  element={<WorkLifeBalanceTest />}
                />
                <Route
                  path="/mind-check/imposter-syndrome"
                  element={<ImposterSyndromeTest />}
                />
                <Route path="/mind-check/sad" element={<SADTest />} />
                <Route
                  path="/blog/how-to-handle-stress"
                  element={<HowToHandleStressPost />}
                />
                <Route
                  path="/blog/how-to-stop-a-panic-attack"
                  element={<PanicAttackPost />}
                />
                <Route
                  path="/blog/how-to-deal-with-depression"
                  element={<DepressionPost />}
                />
                <Route
                  path="/blog/what-is-mental-health"
                  element={<MentalHealthPost />}
                />
                <Route
                  path="/blog/how-to-manage-anxiety"
                  element={<AnxietyManagementPost />}
                />
                <Route
                  path="/blog/signs-of-depression"
                  element={<SignsOfDepressionPost />}
                />
                <Route
                  path="/blog/anxiety-symptoms"
                  element={<AnxietySymptomsPost />}
                />
                <Route
                  path="/blog/how-to-find-a-therapist"
                  element={<HowToFindATherapistPost />}
                />
                <Route
                  path="/events-training/truck-drivers-retirement-training"
                  element={<TruckDriversPost />}
                />
                <Route
                  path="/events-training/founders-mindset-training"
                  element={<FoundersPost />}
                />
                <Route
                  path="/events-training/children-mental-health-awareness"
                  element={<ChildrenMentalHealthPost />}
                />
                <Route
                  path="/events-training/miic-wellness-innovation"
                  element={<MIICPost />}
                />
                <Route
                  path="/events-training/mtn-internship-anxiety"
                  element={<MTNPost />}
                />
                <Route
                  path="/events-training/world-mental-health-day-2024"
                  element={<WorldMentalHealthDayPost />}
                />
                <Route
                  path="/events-training/uict-mental-health-training"
                  element={<UICTPost />}
                />
                <Route
                  path="/events-training/uict-wellness-activity-day"
                  element={<UICTWellnessPost />}
                />
                {/* Location SEO Pages */}
                <Route
                  path="/therapy-in-uganda"
                  element={<TherapyInUganda />}
                />
                <Route
                  path="/therapy-in-kampala"
                  element={<TherapyInKampala />}
                />
                {/* Buying-Intent Blog Posts */}
                <Route
                  path="/blog/therapy-cost-uganda"
                  element={<TherapyCostUgandaPost />}
                />
                <Route
                  path="/blog/find-therapist-kampala"
                  element={<FindTherapistKampalaPost />}
                />
                <Route
                  path="/blog/online-therapy-effective-africa"
                  element={<OnlineTherapyAfricaPost />}
                />
                <Route
                  path="/blog/signs-you-need-a-therapist"
                  element={<SignsYouNeedTherapistPost />}
                />
                <Route
                  path="/blog/student-therapy-uganda"
                  element={<StudentTherapyUgandaPost />}
                />
                {/* TOFU Blog Posts */}
                <Route
                  path="/blog/what-is-therapy"
                  element={<WhatIsTherapyPost />}
                />
                <Route
                  path="/blog/benefits-of-therapy"
                  element={<BenefitsOfTherapyPost />}
                />
                <Route
                  path="/blog/types-of-therapy"
                  element={<TypesOfTherapyPost />}
                />
                <Route
                  path="/blog/meet-amani-ai-mental-wellness-uganda"
                  element={<MeetAmaniPost />}
                />
                <Route
                  path="/blog/whisper-anonymous-therapy-uganda"
                  element={<WhisperAnonymousPost />}
                />
                <Route
                  path="/blog/find-a-therapist-in-uganda"
                  element={<FindTherapistUgandaPost />}
                />
                <Route
                  path="/blog/corporate-wellbeing-screening-uganda"
                  element={<CorporateWellbeingScreeningPost />}
                />
                {/* CMS-driven dynamic posts (fallback after hardcoded routes) */}
                <Route path="/blog/:slug" element={<CmsBlogPost />} />
                <Route
                  path="/events-training/:slug"
                  element={<CmsEventPost />}
                />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="/feedback" element={<SessionFeedback />} />
                <Route path="/kenya" element={<Kenya />} />
                <Route
                  path="/kenya/ref/:slug"
                  element={<KenyaReferralRedirect />}
                />
                <Route path="/check/kenya" element={<KenyaCheck />} />
                {/* Thank You / Conversion Tracking pages */}
                <Route
                  path="/thank-you-booking"
                  element={<ThankYou type="booking" />}
                />
                <Route
                  path="/thank-you-contact"
                  element={<ThankYou type="contact" />}
                />
                <Route
                  path="/thank-you-corporate"
                  element={<ThankYou type="corporate" />}
                />
                <Route
                  path="/corporate/service-request"
                  element={<CorporateServiceRequest />}
                />
                <Route
                  path="/thank-you-referral"
                  element={<ThankYou type="referral" />}
                />
                <Route
                  path="/thank-you-newsletter"
                  element={<ThankYou type="newsletter" />}
                />
                <Route
                  path="/thank-you-download"
                  element={<ThankYou type="download" />}
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AssessmentProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
