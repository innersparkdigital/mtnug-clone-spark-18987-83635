import stressBurnoutWorkloadImage from "@/assets/courses/stress-burnout-workload.jpg";

// Career stage track definitions
export type CareerTrack = 
  | "transitioning-to-work" 
  | "workplace-mental-health" 
  | "leadership-hr";

export interface CourseTrack {
  id: CareerTrack;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const careerTracks: CourseTrack[] = [
  {
    id: "transitioning-to-work",
    name: "Transitioning to Work",
    description: "For students, interns, graduates, and first-time employees",
    icon: "GraduationCap",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "workplace-mental-health",
    name: "Workplace Mental Health",
    description: "For employees, supervisors, and managers",
    icon: "Building2",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "leadership-hr",
    name: "Leadership & HR Mental Health",
    description: "For managers, HR professionals, and team leads",
    icon: "Users",
    color: "from-purple-500 to-violet-600"
  }
];

export interface WorkplaceCourse {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  format: string;
  track: CareerTrack;
  audience: string;
  modules: {
    id: string;
    title: string;
    lessons: { 
      id: string; 
      title: string; 
      duration: string; 
      type: string; 
      completed: boolean 
    }[];
    completed: boolean;
  }[];
  enrolled: number;
  image: string;
  progress: number;
  learningOutcomes: string[];
  prerequisites: string[];
  instructor: { name: string; title: string; image: string };
  certificateInfo: string;
  resources: {
    title: string;
    type: "pdf" | "worksheet" | "toolkit" | "audio" | "template" | "app";
    description: string;
  }[];
}

// TRACK A: TRANSITIONING TO WORK COURSES
export const transitioningToWorkCourses: WorkplaceCourse[] = [
  {
    id: "mental-health-awareness-self-care",
    title: "Mental Health Awareness & Self-Care",
    description: "Understand mental health fundamentals, break stigma, and build self-care routines for your professional journey.",
    longDescription: "This foundational course equips students, interns, and graduates with essential knowledge about mental health and wellbeing. Learn to recognize common challenges faced by young professionals, understand how to break stigma in professional spaces, and develop practical self-care strategies that fit busy schedules. Perfect for anyone preparing to enter the workforce.",
    duration: "4 weeks",
    level: "Beginner",
    format: "Online",
    track: "transitioning-to-work",
    audience: "Students, interns, graduates",
    enrolled: 2340,
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Define mental health and understand its components",
      "Identify common mental health challenges in young professionals",
      "Recognize and challenge mental health stigma in workplaces",
      "Develop personalized self-care routines",
      "Apply stress-reduction techniques for busy schedules",
      "Know when and how to seek professional support"
    ],
    prerequisites: [
      "No prior experience required",
      "Openness to self-reflection and personal growth"
    ],
    instructor: {
      name: "Dr. Amina Nakato",
      title: "Clinical Psychologist",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate of Completion in Mental Health Awareness & Self-Care, verified by Innerspark Africa.",
    resources: [
      { title: "Self-Care Planning Workbook", type: "pdf", description: "Comprehensive workbook for creating your self-care routine" },
      { title: "Daily Wellness Tracker", type: "worksheet", description: "Track your mood, energy, and self-care activities" },
      { title: "Guided Relaxation Audios", type: "audio", description: "10-minute relaxation exercises for busy days" },
      { title: "Innerspark App Integration", type: "app", description: "Track progress and access resources on the go" }
    ],
    modules: [
      {
        id: "mhasc-1",
        title: "Understanding Mental Health & Wellbeing",
        completed: false,
        lessons: [
          { id: "mhasc-1-1", title: "What is Mental Health?", duration: "15 min", type: "slides", completed: false },
          { id: "mhasc-1-2", title: "The Mental Health Continuum", duration: "20 min", type: "video", completed: false },
          { id: "mhasc-1-3", title: "Self-Assessment: Your Current Wellbeing", duration: "15 min", type: "activity", completed: false },
          { id: "mhasc-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhasc-2",
        title: "Common Mental Health Challenges for Young Professionals",
        completed: false,
        lessons: [
          { id: "mhasc-2-1", title: "Anxiety in Early Careers", duration: "20 min", type: "video", completed: false },
          { id: "mhasc-2-2", title: "Depression & Low Mood", duration: "20 min", type: "slides", completed: false },
          { id: "mhasc-2-3", title: "Real Story: Navigating First Job Stress", duration: "15 min", type: "video", completed: false },
          { id: "mhasc-2-4", title: "Reflection Exercise", duration: "15 min", type: "activity", completed: false },
          { id: "mhasc-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhasc-3",
        title: "Breaking Stigma in Professional Spaces",
        completed: false,
        lessons: [
          { id: "mhasc-3-1", title: "Understanding Mental Health Stigma", duration: "20 min", type: "slides", completed: false },
          { id: "mhasc-3-2", title: "Stigma in African Workplaces", duration: "25 min", type: "video", completed: false },
          { id: "mhasc-3-3", title: "Being an Ally: Language That Helps", duration: "15 min", type: "slides", completed: false },
          { id: "mhasc-3-4", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhasc-4",
        title: "Self-Care Basics for Busy Schedules",
        completed: false,
        lessons: [
          { id: "mhasc-4-1", title: "Self-Care Is Not Selfish", duration: "15 min", type: "video", completed: false },
          { id: "mhasc-4-2", title: "Practical Self-Care Strategies", duration: "20 min", type: "slides", completed: false },
          { id: "mhasc-4-3", title: "Creating Your Self-Care Plan", duration: "25 min", type: "activity", completed: false },
          { id: "mhasc-4-4", title: "Guided Relaxation Exercise", duration: "15 min", type: "audio", completed: false },
          { id: "mhasc-4-5", title: "Final Assessment", duration: "20 min", type: "quiz", completed: false },
          { id: "mhasc-4-6", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "emotional-intelligence-work-readiness",
    title: "Emotional Intelligence for Work Readiness",
    description: "Develop emotional regulation, empathy, and social awareness to build healthy workplace relationships.",
    longDescription: "Master the emotional intelligence skills that employers value most. This course helps early-career professionals understand their emotions, regulate responses under pressure, develop empathy for colleagues, and build the social awareness needed for successful workplace relationships. Learn to handle feedback constructively and navigate professional interactions with confidence.",
    duration: "4 weeks",
    level: "Beginner",
    format: "Online",
    track: "transitioning-to-work",
    audience: "Early-career professionals",
    enrolled: 1890,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Understand the five components of emotional intelligence",
      "Develop self-awareness of emotional patterns",
      "Practice emotional regulation techniques",
      "Build empathy and social awareness skills",
      "Handle feedback and criticism constructively",
      "Create healthier workplace relationships"
    ],
    prerequisites: [
      "No prior experience required",
      "Willingness to practice self-reflection"
    ],
    instructor: {
      name: "James Mwamba",
      title: "Organizational Psychologist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate in Emotional Intelligence for the Workplace upon completion.",
    resources: [
      { title: "EQ Self-Assessment Tool", type: "worksheet", description: "Evaluate your emotional intelligence baseline" },
      { title: "Emotion Regulation Workbook", type: "pdf", description: "Practical exercises for managing emotions" },
      { title: "Feedback Response Templates", type: "template", description: "Scripts for responding to workplace feedback" },
      { title: "Innerspark App Integration", type: "app", description: "Daily EQ building exercises" }
    ],
    modules: [
      {
        id: "eiwr-1",
        title: "Understanding Emotions & Emotional Intelligence",
        completed: false,
        lessons: [
          { id: "eiwr-1-1", title: "What is Emotional Intelligence?", duration: "20 min", type: "slides", completed: false },
          { id: "eiwr-1-2", title: "The Science of Emotions", duration: "15 min", type: "video", completed: false },
          { id: "eiwr-1-3", title: "EQ Self-Assessment", duration: "20 min", type: "activity", completed: false },
          { id: "eiwr-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "eiwr-2",
        title: "Emotional Regulation",
        completed: false,
        lessons: [
          { id: "eiwr-2-1", title: "Recognizing Emotional Triggers", duration: "20 min", type: "video", completed: false },
          { id: "eiwr-2-2", title: "Techniques for Emotional Control", duration: "25 min", type: "slides", completed: false },
          { id: "eiwr-2-3", title: "Practice: Pause & Respond", duration: "20 min", type: "activity", completed: false },
          { id: "eiwr-2-4", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "eiwr-3",
        title: "Empathy & Social Awareness",
        completed: false,
        lessons: [
          { id: "eiwr-3-1", title: "Developing Empathy", duration: "20 min", type: "video", completed: false },
          { id: "eiwr-3-2", title: "Reading Social Cues at Work", duration: "20 min", type: "slides", completed: false },
          { id: "eiwr-3-3", title: "Scenario Practice: Workplace Situations", duration: "25 min", type: "activity", completed: false },
          { id: "eiwr-3-4", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "eiwr-4",
        title: "Managing Feedback & Building Relationships",
        completed: false,
        lessons: [
          { id: "eiwr-4-1", title: "Receiving Feedback Constructively", duration: "20 min", type: "video", completed: false },
          { id: "eiwr-4-2", title: "Building Trust in Teams", duration: "20 min", type: "slides", completed: false },
          { id: "eiwr-4-3", title: "Your EQ Action Plan", duration: "25 min", type: "activity", completed: false },
          { id: "eiwr-4-4", title: "Final Assessment", duration: "20 min", type: "quiz", completed: false },
          { id: "eiwr-4-5", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "stress-management-resilience",
    title: "Stress Management & Resilience",
    description: "Learn to identify stress triggers, cope with transition stress, and build personal resilience for career success.",
    longDescription: "Navigate the challenging transition from academic life to the workplace with confidence. This course helps job seekers and new employees identify their unique stress triggers, develop effective coping strategies for job search anxiety and onboarding stress, and build lasting resilience. Learn practical techniques including healthy routines around sleep, nutrition, and exercise.",
    duration: "5 weeks",
    level: "Intermediate",
    format: "Online",
    track: "transitioning-to-work",
    audience: "Job seekers & new employees",
    enrolled: 1650,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Identify personal stress triggers in job search and work contexts",
      "Apply evidence-based coping strategies",
      "Build resilience to setbacks and rejection",
      "Create sustainable healthy routines",
      "Manage the academic-to-work transition effectively",
      "Develop a personal resilience action plan"
    ],
    prerequisites: [
      "Basic understanding of mental health concepts helpful",
      "Currently in job search or early employment phase"
    ],
    instructor: {
      name: "Dr. Grace Okonkwo",
      title: "Stress Management Specialist",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate in Stress Management & Resilience upon completion.",
    resources: [
      { title: "Stress Trigger Identification Guide", type: "worksheet", description: "Map your personal stress patterns" },
      { title: "Resilience Building Toolkit", type: "toolkit", description: "Exercises and techniques for building resilience" },
      { title: "Healthy Routines Planner", type: "pdf", description: "Plan sleep, nutrition, and exercise routines" },
      { title: "Stress Relief Audio Series", type: "audio", description: "Guided relaxation and breathing exercises" }
    ],
    modules: [
      {
        id: "smr-1",
        title: "Identifying Stress Triggers",
        completed: false,
        lessons: [
          { id: "smr-1-1", title: "Understanding Stress Response", duration: "20 min", type: "video", completed: false },
          { id: "smr-1-2", title: "Job Search & Onboarding Stressors", duration: "20 min", type: "slides", completed: false },
          { id: "smr-1-3", title: "Your Stress Trigger Map", duration: "25 min", type: "activity", completed: false },
          { id: "smr-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "smr-2",
        title: "Coping with Academic-to-Work Transition",
        completed: false,
        lessons: [
          { id: "smr-2-1", title: "The Transition Journey", duration: "20 min", type: "video", completed: false },
          { id: "smr-2-2", title: "Managing Uncertainty & Change", duration: "20 min", type: "slides", completed: false },
          { id: "smr-2-3", title: "Real Stories: Graduates Who Thrived", duration: "25 min", type: "video", completed: false },
          { id: "smr-2-4", title: "Transition Planning Exercise", duration: "20 min", type: "activity", completed: false },
          { id: "smr-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "smr-3",
        title: "Building Personal Resilience",
        completed: false,
        lessons: [
          { id: "smr-3-1", title: "What is Resilience?", duration: "15 min", type: "video", completed: false },
          { id: "smr-3-2", title: "Resilience Building Strategies", duration: "25 min", type: "slides", completed: false },
          { id: "smr-3-3", title: "Bouncing Back from Rejection", duration: "20 min", type: "video", completed: false },
          { id: "smr-3-4", title: "Resilience Practice Exercises", duration: "25 min", type: "activity", completed: false },
          { id: "smr-3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "smr-4",
        title: "Healthy Routines: Sleep, Nutrition, Exercise",
        completed: false,
        lessons: [
          { id: "smr-4-1", title: "Sleep & Mental Health", duration: "20 min", type: "video", completed: false },
          { id: "smr-4-2", title: "Nutrition for Brain Health", duration: "15 min", type: "slides", completed: false },
          { id: "smr-4-3", title: "Exercise & Mood Connection", duration: "15 min", type: "slides", completed: false },
          { id: "smr-4-4", title: "Creating Your Wellness Routine", duration: "25 min", type: "activity", completed: false },
          { id: "smr-4-5", title: "Final Assessment", duration: "20 min", type: "quiz", completed: false },
          { id: "smr-4-6", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "confidence-self-esteem-identity",
    title: "Confidence, Self-Esteem & Identity at Work",
    description: "Overcome imposter syndrome, build professional confidence, and develop your unique workplace identity.",
    longDescription: "Many early-career professionals struggle with imposter syndrome and self-doubt. This course addresses these challenges head-on, helping you build genuine confidence, develop a strong professional identity, set realistic expectations, and manage the comparison trap. Learn practical strategies to own your accomplishments and show up authentically at work.",
    duration: "4 weeks",
    level: "Beginner",
    format: "Online",
    track: "transitioning-to-work",
    audience: "Early-career professionals",
    enrolled: 2100,
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Recognize and address imposter syndrome",
      "Build authentic professional confidence",
      "Develop a clear professional identity",
      "Set realistic career expectations",
      "Manage comparison and self-doubt",
      "Celebrate achievements appropriately"
    ],
    prerequisites: [
      "No prior experience required",
      "Entering or early in professional career"
    ],
    instructor: {
      name: "Patricia Achieng",
      title: "Career Coach & Counselor",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate in Professional Confidence & Identity upon completion.",
    resources: [
      { title: "Imposter Syndrome Workbook", type: "pdf", description: "Exercises to overcome self-doubt" },
      { title: "Confidence Building Journal", type: "worksheet", description: "Daily prompts to build self-assurance" },
      { title: "Achievement Tracker", type: "template", description: "Document and celebrate your wins" },
      { title: "Affirmation Audio Series", type: "audio", description: "Confidence-building guided exercises" }
    ],
    modules: [
      {
        id: "csii-1",
        title: "Understanding Imposter Syndrome",
        completed: false,
        lessons: [
          { id: "csii-1-1", title: "What is Imposter Syndrome?", duration: "20 min", type: "slides", completed: false },
          { id: "csii-1-2", title: "Why Early Careers Are Vulnerable", duration: "15 min", type: "video", completed: false },
          { id: "csii-1-3", title: "Self-Assessment: Your Imposter Patterns", duration: "20 min", type: "activity", completed: false },
          { id: "csii-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "csii-2",
        title: "Building Authentic Confidence",
        completed: false,
        lessons: [
          { id: "csii-2-1", title: "Confidence vs. Arrogance", duration: "15 min", type: "video", completed: false },
          { id: "csii-2-2", title: "Evidence-Based Confidence Building", duration: "25 min", type: "slides", completed: false },
          { id: "csii-2-3", title: "Owning Your Accomplishments", duration: "20 min", type: "video", completed: false },
          { id: "csii-2-4", title: "Confidence Building Exercises", duration: "25 min", type: "activity", completed: false },
          { id: "csii-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "csii-3",
        title: "Developing Your Professional Identity",
        completed: false,
        lessons: [
          { id: "csii-3-1", title: "What is Professional Identity?", duration: "15 min", type: "video", completed: false },
          { id: "csii-3-2", title: "Values, Strengths & Aspirations", duration: "25 min", type: "slides", completed: false },
          { id: "csii-3-3", title: "Crafting Your Professional Narrative", duration: "25 min", type: "activity", completed: false },
          { id: "csii-3-4", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "csii-4",
        title: "Managing Comparison & Self-Doubt",
        completed: false,
        lessons: [
          { id: "csii-4-1", title: "The Comparison Trap", duration: "20 min", type: "video", completed: false },
          { id: "csii-4-2", title: "Setting Realistic Expectations", duration: "20 min", type: "slides", completed: false },
          { id: "csii-4-3", title: "Your Confidence Action Plan", duration: "25 min", type: "activity", completed: false },
          { id: "csii-4-4", title: "Final Assessment", duration: "20 min", type: "quiz", completed: false },
          { id: "csii-4-5", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "communication-psychological-safety",
    title: "Communication & Psychological Safety",
    description: "Develop assertive communication skills and learn to navigate workplace dynamics with confidence.",
    longDescription: "Effective communication is essential for early-career success. This course teaches assertive communication skills, how to ask for help appropriately, navigate authority and teamwork dynamics, and handle workplace conflict respectfully. Learn to contribute to and benefit from psychologically safe work environments.",
    duration: "5 weeks",
    level: "Intermediate",
    format: "Online",
    track: "transitioning-to-work",
    audience: "Early-career professionals",
    enrolled: 1480,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Communicate assertively in professional settings",
      "Ask for help effectively without feeling inadequate",
      "Navigate authority and power dynamics",
      "Handle workplace conflict constructively",
      "Contribute to psychologically safe environments",
      "Build productive professional relationships"
    ],
    prerequisites: [
      "Some workplace experience helpful",
      "Willingness to practice communication skills"
    ],
    instructor: {
      name: "Samuel Kariuki",
      title: "Communication & Leadership Coach",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate in Workplace Communication & Psychological Safety upon completion.",
    resources: [
      { title: "Assertive Communication Scripts", type: "template", description: "Ready-to-use phrases for common situations" },
      { title: "Conflict Resolution Guide", type: "pdf", description: "Step-by-step approaches to workplace conflict" },
      { title: "Psychological Safety Toolkit", type: "toolkit", description: "Create safety in your team interactions" },
      { title: "Innerspark App Integration", type: "app", description: "Practice communication scenarios" }
    ],
    modules: [
      {
        id: "cps-1",
        title: "Assertive Communication Skills",
        completed: false,
        lessons: [
          { id: "cps-1-1", title: "Understanding Communication Styles", duration: "20 min", type: "slides", completed: false },
          { id: "cps-1-2", title: "Assertiveness in Action", duration: "25 min", type: "video", completed: false },
          { id: "cps-1-3", title: "Practice: Assertive Responses", duration: "25 min", type: "activity", completed: false },
          { id: "cps-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "cps-2",
        title: "Asking for Help at Work",
        completed: false,
        lessons: [
          { id: "cps-2-1", title: "Why Asking for Help is Strength", duration: "15 min", type: "video", completed: false },
          { id: "cps-2-2", title: "How to Ask Effectively", duration: "20 min", type: "slides", completed: false },
          { id: "cps-2-3", title: "Scenario Practice", duration: "25 min", type: "activity", completed: false },
          { id: "cps-2-4", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "cps-3",
        title: "Navigating Authority & Teamwork",
        completed: false,
        lessons: [
          { id: "cps-3-1", title: "Understanding Power Dynamics", duration: "20 min", type: "video", completed: false },
          { id: "cps-3-2", title: "Working with Different Personalities", duration: "20 min", type: "slides", completed: false },
          { id: "cps-3-3", title: "Team Communication Exercises", duration: "25 min", type: "activity", completed: false },
          { id: "cps-3-4", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "cps-4",
        title: "Handling Conflict Respectfully",
        completed: false,
        lessons: [
          { id: "cps-4-1", title: "Conflict is Normal", duration: "15 min", type: "video", completed: false },
          { id: "cps-4-2", title: "Constructive Conflict Resolution", duration: "25 min", type: "slides", completed: false },
          { id: "cps-4-3", title: "Role Play: Workplace Conflicts", duration: "30 min", type: "activity", completed: false },
          { id: "cps-4-4", title: "Final Assessment", duration: "20 min", type: "quiz", completed: false },
          { id: "cps-4-5", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "mental-health-career-transitions",
    title: "Mental Health & Career Transitions",
    description: "Navigate job search anxiety, manage rejection, and align mental wellbeing with career goals.",
    longDescription: "Career transitions are among life's most stressful experiences. This course provides tools for managing job search anxiety and interview stress, building resilience to rejection, aligning mental wellbeing with career aspirations, and establishing work-life balance from day one. Perfect for graduates, job seekers, and those changing careers.",
    duration: "5 weeks",
    level: "Intermediate",
    format: "Online",
    track: "transitioning-to-work",
    audience: "Job seekers & graduates",
    enrolled: 1320,
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Manage job search anxiety and interview stress",
      "Build resilience to rejection and setbacks",
      "Align career goals with mental wellbeing",
      "Establish healthy work-life boundaries from day one",
      "Navigate uncertainty with confidence",
      "Create a sustainable career development plan"
    ],
    prerequisites: [
      "Currently in job search or career transition",
      "Openness to self-reflection"
    ],
    instructor: {
      name: "Dr. Michael Adeyemi",
      title: "Career Psychologist",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate in Mental Health & Career Transitions upon completion.",
    resources: [
      { title: "Job Search Wellness Planner", type: "pdf", description: "Balance job hunting with self-care" },
      { title: "Interview Anxiety Toolkit", type: "toolkit", description: "Techniques to calm nerves before interviews" },
      { title: "Rejection Recovery Workbook", type: "worksheet", description: "Process and learn from setbacks" },
      { title: "Work-Life Balance Assessment", type: "template", description: "Evaluate and plan your boundaries" }
    ],
    modules: [
      {
        id: "mhct-1",
        title: "Managing Job Search Anxiety",
        completed: false,
        lessons: [
          { id: "mhct-1-1", title: "Understanding Job Search Stress", duration: "20 min", type: "video", completed: false },
          { id: "mhct-1-2", title: "Interview Anxiety Management", duration: "25 min", type: "slides", completed: false },
          { id: "mhct-1-3", title: "Calming Techniques Practice", duration: "20 min", type: "activity", completed: false },
          { id: "mhct-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhct-2",
        title: "Handling Rejection & Uncertainty",
        completed: false,
        lessons: [
          { id: "mhct-2-1", title: "Reframing Rejection", duration: "20 min", type: "video", completed: false },
          { id: "mhct-2-2", title: "Building Rejection Resilience", duration: "20 min", type: "slides", completed: false },
          { id: "mhct-2-3", title: "Real Stories: Turning Rejection into Growth", duration: "20 min", type: "video", completed: false },
          { id: "mhct-2-4", title: "Reflection Exercise", duration: "20 min", type: "activity", completed: false },
          { id: "mhct-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhct-3",
        title: "Aligning Wellbeing with Career Goals",
        completed: false,
        lessons: [
          { id: "mhct-3-1", title: "Values-Based Career Planning", duration: "20 min", type: "video", completed: false },
          { id: "mhct-3-2", title: "When Career Goals Hurt Wellbeing", duration: "20 min", type: "slides", completed: false },
          { id: "mhct-3-3", title: "Creating Your Aligned Career Plan", duration: "30 min", type: "activity", completed: false },
          { id: "mhct-3-4", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhct-4",
        title: "Work-Life Balance from Day One",
        completed: false,
        lessons: [
          { id: "mhct-4-1", title: "Setting Boundaries Early", duration: "20 min", type: "video", completed: false },
          { id: "mhct-4-2", title: "Sustainable Career Practices", duration: "20 min", type: "slides", completed: false },
          { id: "mhct-4-3", title: "Your Work-Life Balance Plan", duration: "25 min", type: "activity", completed: false },
          { id: "mhct-4-4", title: "Final Assessment", duration: "20 min", type: "quiz", completed: false },
          { id: "mhct-4-5", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  }
];

// TRACK B: WORKPLACE MENTAL HEALTH COURSES
export const workplaceMentalHealthCourses: WorkplaceCourse[] = [
  {
    id: "workplace-mental-health-fundamentals",
    title: "Workplace Mental Health Fundamentals",
    description: "Understand mental health in the modern workplace, recognize warning signs, and know your role.",
    longDescription: "This essential course provides all employees with foundational knowledge about mental health in the workplace. Learn about common mental health conditions, how to recognize early warning signs in yourself and colleagues, and understand both employer and employee roles in creating mentally healthy workplaces. A must-have for every professional.",
    duration: "4 weeks",
    level: "Beginner",
    format: "Online",
    track: "workplace-mental-health",
    audience: "All employees",
    enrolled: 3200,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Understand mental health in workplace context",
      "Recognize common workplace mental health conditions",
      "Identify early warning signs",
      "Know employer and employee responsibilities",
      "Access appropriate support resources",
      "Reduce stigma in your workplace"
    ],
    prerequisites: [
      "Currently employed or entering workforce",
      "No prior mental health training required"
    ],
    instructor: {
      name: "Dr. Blessing Okoro",
      title: "Occupational Health Psychologist",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate in Workplace Mental Health Fundamentals upon completion.",
    resources: [
      { title: "Workplace Mental Health Guide", type: "pdf", description: "Comprehensive reference guide" },
      { title: "Warning Signs Checklist", type: "worksheet", description: "Quick reference for recognizing distress" },
      { title: "Support Resources Directory", type: "template", description: "List of support options" },
      { title: "Innerspark App Integration", type: "app", description: "Access support on the go" }
    ],
    modules: [
      {
        id: "wmhf-1",
        title: "Mental Health in the Modern Workplace",
        completed: false,
        lessons: [
          { id: "wmhf-1-1", title: "Why Workplace Mental Health Matters", duration: "20 min", type: "slides", completed: false },
          { id: "wmhf-1-2", title: "The Business Case for Mental Health", duration: "15 min", type: "video", completed: false },
          { id: "wmhf-1-3", title: "Your Workplace Assessment", duration: "20 min", type: "activity", completed: false },
          { id: "wmhf-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "wmhf-2",
        title: "Common Workplace Mental Health Conditions",
        completed: false,
        lessons: [
          { id: "wmhf-2-1", title: "Anxiety at Work", duration: "20 min", type: "video", completed: false },
          { id: "wmhf-2-2", title: "Depression in the Workplace", duration: "20 min", type: "slides", completed: false },
          { id: "wmhf-2-3", title: "Stress & Burnout", duration: "20 min", type: "video", completed: false },
          { id: "wmhf-2-4", title: "Case Study Analysis", duration: "20 min", type: "activity", completed: false },
          { id: "wmhf-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "wmhf-3",
        title: "Recognizing Early Warning Signs",
        completed: false,
        lessons: [
          { id: "wmhf-3-1", title: "Signs in Yourself", duration: "20 min", type: "video", completed: false },
          { id: "wmhf-3-2", title: "Signs in Colleagues", duration: "20 min", type: "slides", completed: false },
          { id: "wmhf-3-3", title: "When to Take Action", duration: "15 min", type: "video", completed: false },
          { id: "wmhf-3-4", title: "Practice Scenarios", duration: "25 min", type: "activity", completed: false },
          { id: "wmhf-3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "wmhf-4",
        title: "Roles & Responsibilities",
        completed: false,
        lessons: [
          { id: "wmhf-4-1", title: "Employee Rights & Responsibilities", duration: "20 min", type: "slides", completed: false },
          { id: "wmhf-4-2", title: "Employer Obligations", duration: "15 min", type: "video", completed: false },
          { id: "wmhf-4-3", title: "Creating Your Support Plan", duration: "25 min", type: "activity", completed: false },
          { id: "wmhf-4-4", title: "Final Assessment", duration: "20 min", type: "quiz", completed: false },
          { id: "wmhf-4-5", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "stress-burnout-workload-management",
    title: "Stress, Burnout & Workload Management",
    description: "Understand burnout, prevent workplace exhaustion, and develop recovery strategies.",
    longDescription: "Burnout has become an epidemic in modern workplaces. This course helps employees and supervisors understand the difference between stress and burnout, recognize the warning signs, and develop effective prevention and recovery strategies. Learn practical techniques for managing workload, deadlines, and maintaining sustainable performance.",
    duration: "5 weeks",
    level: "Intermediate",
    format: "Online",
    track: "workplace-mental-health",
    audience: "Employees & supervisors",
    enrolled: 2800,
    image: stressBurnoutWorkloadImage,
    progress: 0,
    learningOutcomes: [
      "Distinguish between stress and burnout",
      "Recognize burnout warning signs early",
      "Implement burnout prevention strategies",
      "Manage workload effectively",
      "Develop recovery practices",
      "Create sustainable work habits"
    ],
    prerequisites: [
      "Currently employed",
      "Completion of Workplace Mental Health Fundamentals recommended"
    ],
    instructor: {
      name: "Dr. Kwame Asante",
      title: "Burnout Prevention Specialist",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate in Stress, Burnout & Workload Management upon completion.",
    resources: [
      { title: "Burnout Assessment Tool", type: "worksheet", description: "Measure your burnout risk" },
      { title: "Workload Management Templates", type: "template", description: "Prioritization and planning tools" },
      { title: "Recovery Practice Guide", type: "pdf", description: "Evidence-based recovery techniques" },
      { title: "Manager Burnout Prevention Toolkit", type: "toolkit", description: "For supervisors managing teams" }
    ],
    modules: [
      {
        id: "sbwm-1",
        title: "Understanding Burnout & Chronic Stress",
        completed: false,
        lessons: [
          { id: "sbwm-1-1", title: "Stress vs. Burnout", duration: "20 min", type: "video", completed: false },
          { id: "sbwm-1-2", title: "The Burnout Spectrum", duration: "20 min", type: "slides", completed: false },
          { id: "sbwm-1-3", title: "Your Burnout Assessment", duration: "25 min", type: "activity", completed: false },
          { id: "sbwm-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "sbwm-2",
        title: "Preventing Workplace Exhaustion",
        completed: false,
        lessons: [
          { id: "sbwm-2-1", title: "Early Warning Systems", duration: "20 min", type: "video", completed: false },
          { id: "sbwm-2-2", title: "Prevention Strategies", duration: "25 min", type: "slides", completed: false },
          { id: "sbwm-2-3", title: "Building Energy Reserves", duration: "20 min", type: "video", completed: false },
          { id: "sbwm-2-4", title: "Prevention Planning", duration: "25 min", type: "activity", completed: false },
          { id: "sbwm-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "sbwm-3",
        title: "Managing Workload & Deadlines",
        completed: false,
        lessons: [
          { id: "sbwm-3-1", title: "Prioritization Techniques", duration: "20 min", type: "video", completed: false },
          { id: "sbwm-3-2", title: "Setting Realistic Expectations", duration: "20 min", type: "slides", completed: false },
          { id: "sbwm-3-3", title: "Saying No Professionally", duration: "15 min", type: "video", completed: false },
          { id: "sbwm-3-4", title: "Your Workload Plan", duration: "25 min", type: "activity", completed: false },
          { id: "sbwm-3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "sbwm-4",
        title: "Recovery Strategies",
        completed: false,
        lessons: [
          { id: "sbwm-4-1", title: "Recovery Fundamentals", duration: "20 min", type: "video", completed: false },
          { id: "sbwm-4-2", title: "Micro-Recovery Techniques", duration: "20 min", type: "slides", completed: false },
          { id: "sbwm-4-3", title: "Building Recovery Habits", duration: "25 min", type: "activity", completed: false },
          { id: "sbwm-4-4", title: "Guided Recovery Exercise", duration: "15 min", type: "audio", completed: false },
          { id: "sbwm-4-5", title: "Final Assessment", duration: "20 min", type: "quiz", completed: false },
          { id: "sbwm-4-6", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "emotional-intelligence-team-wellbeing",
    title: "Emotional Intelligence & Team Wellbeing",
    description: "Develop EQ skills, manage emotions under pressure, and build psychologically safe teams.",
    longDescription: "High-performing teams are built on emotional intelligence and psychological safety. This course helps teams and supervisors develop advanced EQ skills, manage emotions under pressure, create environments where people feel safe to speak up, and lead with empathy. Perfect for anyone wanting to improve team dynamics and wellbeing.",
    duration: "5 weeks",
    level: "Intermediate",
    format: "Online",
    track: "workplace-mental-health",
    audience: "Teams & supervisors",
    enrolled: 2100,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Apply advanced emotional intelligence skills",
      "Manage emotions under workplace pressure",
      "Build and maintain psychological safety",
      "Lead with empathy and compassion",
      "Facilitate difficult team conversations",
      "Measure and improve team wellbeing"
    ],
    prerequisites: [
      "Some leadership or team experience",
      "Basic understanding of EQ concepts helpful"
    ],
    instructor: {
      name: "Dr. Fatima Hassan",
      title: "Organizational Development Expert",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate in Emotional Intelligence & Team Wellbeing upon completion.",
    resources: [
      { title: "Team EQ Assessment", type: "worksheet", description: "Evaluate your team's emotional intelligence" },
      { title: "Psychological Safety Toolkit", type: "toolkit", description: "Build safety in your team" },
      { title: "Difficult Conversations Guide", type: "pdf", description: "Scripts and approaches for tough talks" },
      { title: "Team Wellbeing Metrics", type: "template", description: "Track and measure team health" }
    ],
    modules: [
      {
        id: "eitw-1",
        title: "Advanced Emotional Intelligence",
        completed: false,
        lessons: [
          { id: "eitw-1-1", title: "EQ in Team Settings", duration: "20 min", type: "video", completed: false },
          { id: "eitw-1-2", title: "Reading Team Dynamics", duration: "20 min", type: "slides", completed: false },
          { id: "eitw-1-3", title: "Team EQ Assessment", duration: "25 min", type: "activity", completed: false },
          { id: "eitw-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "eitw-2",
        title: "Managing Emotions Under Pressure",
        completed: false,
        lessons: [
          { id: "eitw-2-1", title: "Pressure Points at Work", duration: "20 min", type: "video", completed: false },
          { id: "eitw-2-2", title: "In-the-Moment Techniques", duration: "25 min", type: "slides", completed: false },
          { id: "eitw-2-3", title: "Staying Calm in Conflict", duration: "20 min", type: "video", completed: false },
          { id: "eitw-2-4", title: "Pressure Practice Scenarios", duration: "25 min", type: "activity", completed: false },
          { id: "eitw-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "eitw-3",
        title: "Building Psychologically Safe Teams",
        completed: false,
        lessons: [
          { id: "eitw-3-1", title: "What is Psychological Safety?", duration: "20 min", type: "video", completed: false },
          { id: "eitw-3-2", title: "Creating Safe Environments", duration: "25 min", type: "slides", completed: false },
          { id: "eitw-3-3", title: "Handling Mistakes and Failure", duration: "20 min", type: "video", completed: false },
          { id: "eitw-3-4", title: "Safety Building Exercises", duration: "25 min", type: "activity", completed: false },
          { id: "eitw-3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "eitw-4",
        title: "Empathy-Driven Leadership",
        completed: false,
        lessons: [
          { id: "eitw-4-1", title: "Leading with Empathy", duration: "20 min", type: "video", completed: false },
          { id: "eitw-4-2", title: "Compassionate Communication", duration: "20 min", type: "slides", completed: false },
          { id: "eitw-4-3", title: "Your Team Wellbeing Plan", duration: "25 min", type: "activity", completed: false },
          { id: "eitw-4-4", title: "Final Assessment", duration: "20 min", type: "quiz", completed: false },
          { id: "eitw-4-5", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "mental-health-productivity",
    title: "Mental Health & Productivity",
    description: "Optimize mental wellbeing for better performance, focus, and sustainable energy.",
    longDescription: "Mental health and productivity are deeply interconnected. This course explores how to optimize your mental wellbeing for better work performance, maintain focus and motivation, manage digital wellbeing challenges, and build healthy work habits. Learn evidence-based strategies for sustainable productivity that doesn't sacrifice your mental health.",
    duration: "4 weeks",
    level: "Intermediate",
    format: "Online",
    track: "workplace-mental-health",
    audience: "Employees",
    enrolled: 1950,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Understand the wellbeing-performance connection",
      "Optimize focus and concentration",
      "Manage energy throughout the day",
      "Address digital wellbeing challenges",
      "Build sustainable work habits",
      "Balance productivity with mental health"
    ],
    prerequisites: [
      "Currently employed",
      "Seeking to improve work performance sustainably"
    ],
    instructor: {
      name: "David Mutua",
      title: "Performance & Wellbeing Coach",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate in Mental Health & Productivity upon completion.",
    resources: [
      { title: "Energy Management Tracker", type: "worksheet", description: "Track and optimize your daily energy" },
      { title: "Focus Techniques Guide", type: "pdf", description: "Proven methods for deep work" },
      { title: "Digital Wellbeing Audit", type: "template", description: "Assess your digital habits" },
      { title: "Productivity Audio Exercises", type: "audio", description: "Focus and energy boosting sessions" }
    ],
    modules: [
      {
        id: "mhp-1",
        title: "The Wellbeing-Performance Connection",
        completed: false,
        lessons: [
          { id: "mhp-1-1", title: "How Mental Health Affects Work", duration: "20 min", type: "video", completed: false },
          { id: "mhp-1-2", title: "The Science of Peak Performance", duration: "20 min", type: "slides", completed: false },
          { id: "mhp-1-3", title: "Your Performance Baseline", duration: "20 min", type: "activity", completed: false },
          { id: "mhp-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhp-2",
        title: "Focus, Motivation & Energy",
        completed: false,
        lessons: [
          { id: "mhp-2-1", title: "Understanding Attention", duration: "20 min", type: "video", completed: false },
          { id: "mhp-2-2", title: "Energy Management Strategies", duration: "25 min", type: "slides", completed: false },
          { id: "mhp-2-3", title: "Motivation Science", duration: "20 min", type: "video", completed: false },
          { id: "mhp-2-4", title: "Building Your Focus Plan", duration: "25 min", type: "activity", completed: false },
          { id: "mhp-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhp-3",
        title: "Digital Wellbeing at Work",
        completed: false,
        lessons: [
          { id: "mhp-3-1", title: "Screen Fatigue & Remote Work Stress", duration: "20 min", type: "video", completed: false },
          { id: "mhp-3-2", title: "Managing Digital Overload", duration: "20 min", type: "slides", completed: false },
          { id: "mhp-3-3", title: "Healthy Tech Boundaries", duration: "20 min", type: "video", completed: false },
          { id: "mhp-3-4", title: "Digital Wellbeing Audit", duration: "25 min", type: "activity", completed: false },
          { id: "mhp-3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhp-4",
        title: "Healthy Work Habits",
        completed: false,
        lessons: [
          { id: "mhp-4-1", title: "Building Sustainable Routines", duration: "20 min", type: "video", completed: false },
          { id: "mhp-4-2", title: "Rest & Recovery at Work", duration: "15 min", type: "slides", completed: false },
          { id: "mhp-4-3", title: "Your Sustainable Productivity Plan", duration: "25 min", type: "activity", completed: false },
          { id: "mhp-4-4", title: "Final Assessment", duration: "20 min", type: "quiz", completed: false },
          { id: "mhp-4-5", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "anxiety-depression-trauma-work",
    title: "Managing Anxiety, Depression & Trauma at Work",
    description: "Support yourself and colleagues with anxiety, depression, and trauma in professional settings.",
    longDescription: "This advanced course addresses serious mental health challenges in the workplace. Learn how anxiety and depression manifest at work, understand trauma-informed workplace practices, develop skills to support colleagues in distress, and know when and how to refer for professional support. Essential knowledge for creating truly supportive workplaces.",
    duration: "6 weeks",
    level: "Advanced",
    format: "Online",
    track: "workplace-mental-health",
    audience: "Employees & managers",
    enrolled: 1450,
    image: "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Recognize anxiety and depression in workplace settings",
      "Understand trauma-informed workplace practices",
      "Support colleagues experiencing distress",
      "Know when and how to refer for professional help",
      "Create trauma-sensitive team environments",
      "Practice self-care when supporting others"
    ],
    prerequisites: [
      "Completion of Workplace Mental Health Fundamentals",
      "Some experience supporting colleagues helpful"
    ],
    instructor: {
      name: "Dr. Ruth Wanjiru",
      title: "Clinical Psychologist",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn an Advanced Certificate in Workplace Mental Health Support upon completion.",
    resources: [
      { title: "Mental Health Support Guide", type: "pdf", description: "When and how to help colleagues" },
      { title: "Trauma-Informed Practice Toolkit", type: "toolkit", description: "Create safer workplaces" },
      { title: "Referral Resources Directory", type: "template", description: "Professional support options" },
      { title: "Vicarious Trauma Self-Care Guide", type: "worksheet", description: "Protect yourself when helping others" }
    ],
    modules: [
      {
        id: "adtw-1",
        title: "Anxiety & Depression at Work",
        completed: false,
        lessons: [
          { id: "adtw-1-1", title: "How Anxiety Shows Up at Work", duration: "25 min", type: "video", completed: false },
          { id: "adtw-1-2", title: "Depression in Professional Settings", duration: "25 min", type: "slides", completed: false },
          { id: "adtw-1-3", title: "Case Studies Analysis", duration: "30 min", type: "activity", completed: false },
          { id: "adtw-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "adtw-2",
        title: "Trauma-Informed Workplaces",
        completed: false,
        lessons: [
          { id: "adtw-2-1", title: "Understanding Workplace Trauma", duration: "25 min", type: "video", completed: false },
          { id: "adtw-2-2", title: "Trauma-Informed Principles", duration: "25 min", type: "slides", completed: false },
          { id: "adtw-2-3", title: "Creating Safe Spaces", duration: "20 min", type: "video", completed: false },
          { id: "adtw-2-4", title: "Practice Scenarios", duration: "30 min", type: "activity", completed: false },
          { id: "adtw-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "adtw-3",
        title: "Supporting Colleagues in Distress",
        completed: false,
        lessons: [
          { id: "adtw-3-1", title: "Having Supportive Conversations", duration: "25 min", type: "video", completed: false },
          { id: "adtw-3-2", title: "What to Say and What Not to Say", duration: "20 min", type: "slides", completed: false },
          { id: "adtw-3-3", title: "Support Practice Role-Play", duration: "35 min", type: "activity", completed: false },
          { id: "adtw-3-4", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "adtw-4",
        title: "Professional Referral & Self-Care",
        completed: false,
        lessons: [
          { id: "adtw-4-1", title: "When to Refer for Professional Help", duration: "20 min", type: "video", completed: false },
          { id: "adtw-4-2", title: "Making Effective Referrals", duration: "20 min", type: "slides", completed: false },
          { id: "adtw-4-3", title: "Protecting Your Own Wellbeing", duration: "20 min", type: "video", completed: false },
          { id: "adtw-4-4", title: "Your Support & Self-Care Plan", duration: "25 min", type: "activity", completed: false },
          { id: "adtw-4-5", title: "Final Assessment", duration: "25 min", type: "quiz", completed: false },
          { id: "adtw-4-6", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "work-life-balance-boundaries",
    title: "Work-Life Balance & Boundaries",
    description: "Set healthy boundaries, manage remote work stress, and achieve sustainable performance.",
    longDescription: "The lines between work and life have never been more blurred. This course teaches essential skills for setting healthy boundaries in demanding roles, managing the unique stresses of remote and hybrid work, balancing family and caregiving responsibilities, and maintaining sustainable performance without sacrificing wellbeing.",
    duration: "4 weeks",
    level: "Intermediate",
    format: "Online",
    track: "workplace-mental-health",
    audience: "Employees & managers",
    enrolled: 2350,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Set and maintain healthy work boundaries",
      "Manage remote and hybrid work stress",
      "Balance family, caregiving, and work",
      "Achieve sustainable performance",
      "Communicate boundaries professionally",
      "Create a personalized balance plan"
    ],
    prerequisites: [
      "Currently employed",
      "Experiencing work-life balance challenges"
    ],
    instructor: {
      name: "Linda Ochieng",
      title: "Work-Life Integration Coach",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate in Work-Life Balance & Boundaries upon completion.",
    resources: [
      { title: "Boundary Setting Scripts", type: "template", description: "Professional ways to set limits" },
      { title: "Remote Work Wellness Guide", type: "pdf", description: "Thrive while working from home" },
      { title: "Family-Work Balance Planner", type: "worksheet", description: "Manage competing demands" },
      { title: "Energy Recovery Audios", type: "audio", description: "Quick restoration exercises" }
    ],
    modules: [
      {
        id: "wlbb-1",
        title: "Setting Boundaries in Demanding Roles",
        completed: false,
        lessons: [
          { id: "wlbb-1-1", title: "Why Boundaries Matter", duration: "20 min", type: "video", completed: false },
          { id: "wlbb-1-2", title: "Types of Work Boundaries", duration: "20 min", type: "slides", completed: false },
          { id: "wlbb-1-3", title: "Boundary Assessment", duration: "20 min", type: "activity", completed: false },
          { id: "wlbb-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "wlbb-2",
        title: "Remote & Hybrid Work Stress",
        completed: false,
        lessons: [
          { id: "wlbb-2-1", title: "Unique Challenges of Remote Work", duration: "20 min", type: "video", completed: false },
          { id: "wlbb-2-2", title: "Creating Physical & Mental Separation", duration: "20 min", type: "slides", completed: false },
          { id: "wlbb-2-3", title: "Managing Always-On Culture", duration: "20 min", type: "video", completed: false },
          { id: "wlbb-2-4", title: "Your Remote Work Plan", duration: "25 min", type: "activity", completed: false },
          { id: "wlbb-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "wlbb-3",
        title: "Family, Caregiving & Work",
        completed: false,
        lessons: [
          { id: "wlbb-3-1", title: "The Mental Load", duration: "20 min", type: "video", completed: false },
          { id: "wlbb-3-2", title: "Balancing Competing Demands", duration: "20 min", type: "slides", completed: false },
          { id: "wlbb-3-3", title: "Communicating Needs at Work", duration: "20 min", type: "video", completed: false },
          { id: "wlbb-3-4", title: "Family-Work Integration Plan", duration: "25 min", type: "activity", completed: false },
          { id: "wlbb-3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "wlbb-4",
        title: "Sustainable Performance",
        completed: false,
        lessons: [
          { id: "wlbb-4-1", title: "Performance Without Burnout", duration: "20 min", type: "video", completed: false },
          { id: "wlbb-4-2", title: "Energy Management", duration: "15 min", type: "slides", completed: false },
          { id: "wlbb-4-3", title: "Your Balance Action Plan", duration: "25 min", type: "activity", completed: false },
          { id: "wlbb-4-4", title: "Final Assessment", duration: "20 min", type: "quiz", completed: false },
          { id: "wlbb-4-5", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  }
];

// TRACK C: LEADERSHIP & HR COURSES
export const leadershipHRCourses: WorkplaceCourse[] = [
  {
    id: "mental-health-leadership-people-management",
    title: "Mental Health Leadership & People Management",
    description: "Lead with compassion, support employee wellbeing, and reduce stigma from the top.",
    longDescription: "Leaders set the tone for workplace mental health culture. This advanced course equips managers and leaders with the skills to lead with compassion, effectively support employee mental wellbeing, have difficult conversations, and reduce stigma from positions of influence. Learn to balance business needs with genuine care for your people.",
    duration: "6 weeks",
    level: "Advanced",
    format: "Online",
    track: "leadership-hr",
    audience: "Managers & leaders",
    enrolled: 980,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Lead with compassion and authenticity",
      "Support employee mental wellbeing effectively",
      "Have difficult mental health conversations",
      "Reduce stigma from leadership positions",
      "Balance business and wellbeing priorities",
      "Model healthy behaviors for teams"
    ],
    prerequisites: [
      "Current leadership or management role",
      "Completion of Workplace Mental Health Fundamentals recommended"
    ],
    instructor: {
      name: "Dr. Emmanuel Osei",
      title: "Executive Leadership Coach",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn an Executive Certificate in Mental Health Leadership upon completion.",
    resources: [
      { title: "Leader's Mental Health Toolkit", type: "toolkit", description: "Complete leadership resource set" },
      { title: "Difficult Conversation Scripts", type: "template", description: "For mental health discussions" },
      { title: "Stigma Reduction Action Plan", type: "pdf", description: "Lead change in your organization" },
      { title: "Manager Check-In Guide", type: "worksheet", description: "Regular wellbeing conversations" }
    ],
    modules: [
      {
        id: "mhlpm-1",
        title: "Leading with Compassion",
        completed: false,
        lessons: [
          { id: "mhlpm-1-1", title: "Compassionate Leadership Defined", duration: "25 min", type: "video", completed: false },
          { id: "mhlpm-1-2", title: "Your Leadership Style Assessment", duration: "25 min", type: "activity", completed: false },
          { id: "mhlpm-1-3", title: "Authenticity & Vulnerability", duration: "20 min", type: "slides", completed: false },
          { id: "mhlpm-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhlpm-2",
        title: "Supporting Employee Wellbeing",
        completed: false,
        lessons: [
          { id: "mhlpm-2-1", title: "Creating Supportive Environments", duration: "25 min", type: "video", completed: false },
          { id: "mhlpm-2-2", title: "Regular Wellbeing Check-Ins", duration: "20 min", type: "slides", completed: false },
          { id: "mhlpm-2-3", title: "Accommodations & Flexibility", duration: "25 min", type: "video", completed: false },
          { id: "mhlpm-2-4", title: "Support Practice Scenarios", duration: "30 min", type: "activity", completed: false },
          { id: "mhlpm-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhlpm-3",
        title: "Difficult Conversations & Check-Ins",
        completed: false,
        lessons: [
          { id: "mhlpm-3-1", title: "Having Sensitive Conversations", duration: "25 min", type: "video", completed: false },
          { id: "mhlpm-3-2", title: "Mental Health Disclosure Responses", duration: "20 min", type: "slides", completed: false },
          { id: "mhlpm-3-3", title: "Effective One-on-Ones", duration: "20 min", type: "video", completed: false },
          { id: "mhlpm-3-4", title: "Conversation Practice", duration: "35 min", type: "activity", completed: false },
          { id: "mhlpm-3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhlpm-4",
        title: "Reducing Stigma from the Top",
        completed: false,
        lessons: [
          { id: "mhlpm-4-1", title: "Leadership's Role in Stigma Reduction", duration: "20 min", type: "video", completed: false },
          { id: "mhlpm-4-2", title: "Modeling Healthy Behaviors", duration: "20 min", type: "slides", completed: false },
          { id: "mhlpm-4-3", title: "Your Stigma Reduction Plan", duration: "30 min", type: "activity", completed: false },
          { id: "mhlpm-4-4", title: "Final Assessment", duration: "25 min", type: "quiz", completed: false },
          { id: "mhlpm-4-5", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "creating-mentally-healthy-workplaces",
    title: "Creating Mentally Healthy Workplaces",
    description: "Build organizational culture, policies, and practices that support mental health.",
    longDescription: "Transform your organization into a mentally healthy workplace. This strategic course for HR and leadership covers organizational culture change, mental health policies and practices, inclusion and psychological safety, and measuring wellbeing impact. Learn to create sustainable, systemic change that benefits everyone.",
    duration: "6 weeks",
    level: "Advanced",
    format: "Online",
    track: "leadership-hr",
    audience: "HR & leadership",
    enrolled: 750,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Build a mentally healthy organizational culture",
      "Develop effective mental health policies",
      "Create inclusive and psychologically safe environments",
      "Measure and report on wellbeing impact",
      "Lead sustainable culture change",
      "Integrate mental health into business strategy"
    ],
    prerequisites: [
      "HR or senior leadership role",
      "Authority to influence organizational practices"
    ],
    instructor: {
      name: "Dr. Adaeze Nwachukwu",
      title: "Organizational Wellbeing Consultant",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn an Executive Certificate in Workplace Wellbeing Strategy upon completion.",
    resources: [
      { title: "Mental Health Policy Templates", type: "template", description: "Ready-to-adapt policy documents" },
      { title: "Culture Assessment Tool", type: "worksheet", description: "Evaluate your organization" },
      { title: "ROI Measurement Guide", type: "pdf", description: "Demonstrate wellbeing impact" },
      { title: "Implementation Roadmap", type: "toolkit", description: "Step-by-step transformation guide" }
    ],
    modules: [
      {
        id: "cmhw-1",
        title: "Organizational Culture & Wellbeing",
        completed: false,
        lessons: [
          { id: "cmhw-1-1", title: "Culture's Impact on Mental Health", duration: "25 min", type: "video", completed: false },
          { id: "cmhw-1-2", title: "Assessing Your Current Culture", duration: "30 min", type: "activity", completed: false },
          { id: "cmhw-1-3", title: "Vision for Change", duration: "25 min", type: "slides", completed: false },
          { id: "cmhw-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "cmhw-2",
        title: "Mental Health Policies & Practices",
        completed: false,
        lessons: [
          { id: "cmhw-2-1", title: "Essential Mental Health Policies", duration: "25 min", type: "video", completed: false },
          { id: "cmhw-2-2", title: "Best Practice Examples", duration: "25 min", type: "slides", completed: false },
          { id: "cmhw-2-3", title: "Drafting Your Policies", duration: "35 min", type: "activity", completed: false },
          { id: "cmhw-2-4", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "cmhw-3",
        title: "Inclusion, Diversity & Psychological Safety",
        completed: false,
        lessons: [
          { id: "cmhw-3-1", title: "Mental Health & DEI", duration: "25 min", type: "video", completed: false },
          { id: "cmhw-3-2", title: "Building Psychological Safety at Scale", duration: "25 min", type: "slides", completed: false },
          { id: "cmhw-3-3", title: "Addressing Systemic Barriers", duration: "25 min", type: "video", completed: false },
          { id: "cmhw-3-4", title: "Inclusion Action Planning", duration: "30 min", type: "activity", completed: false },
          { id: "cmhw-3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "cmhw-4",
        title: "Measuring Wellbeing Impact",
        completed: false,
        lessons: [
          { id: "cmhw-4-1", title: "Wellbeing Metrics & KPIs", duration: "25 min", type: "video", completed: false },
          { id: "cmhw-4-2", title: "Data Collection & Analysis", duration: "25 min", type: "slides", completed: false },
          { id: "cmhw-4-3", title: "Building Business Case", duration: "25 min", type: "video", completed: false },
          { id: "cmhw-4-4", title: "Your Measurement Plan", duration: "30 min", type: "activity", completed: false },
          { id: "cmhw-4-5", title: "Final Assessment", duration: "25 min", type: "quiz", completed: false },
          { id: "cmhw-4-6", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  {
    id: "mental-health-first-aid-work",
    title: "Mental Health First Aid at Work",
    description: "Identify mental health crises, respond safely, and manage referral pathways.",
    longDescription: "Be prepared to respond when mental health crises occur at work. This advanced course trains managers, HR, and safety teams to identify mental health emergencies, respond safely and ethically, understand referral pathways, and manage crisis situations. Essential knowledge for anyone responsible for workplace safety and employee wellbeing.",
    duration: "6 weeks",
    level: "Advanced",
    format: "Online",
    track: "leadership-hr",
    audience: "Managers, HR, safety teams",
    enrolled: 680,
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Identify mental health crisis situations",
      "Respond safely and appropriately to crises",
      "Navigate professional referral pathways",
      "Manage crisis situations effectively",
      "Support post-crisis recovery",
      "Protect your own wellbeing as a responder"
    ],
    prerequisites: [
      "Management, HR, or safety role",
      "Completion of Workplace Mental Health Fundamentals required"
    ],
    instructor: {
      name: "Dr. Joseph Kamau",
      title: "Crisis Intervention Specialist",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Workplace Mental Health First Aid Certificate upon completion.",
    resources: [
      { title: "Crisis Response Protocol", type: "pdf", description: "Step-by-step crisis guide" },
      { title: "Referral Pathway Map", type: "template", description: "Local and national resources" },
      { title: "Post-Crisis Checklist", type: "worksheet", description: "Follow-up actions" },
      { title: "Responder Self-Care Guide", type: "toolkit", description: "Protect yourself while helping" }
    ],
    modules: [
      {
        id: "mhfaw-1",
        title: "Identifying Mental Health Crises",
        completed: false,
        lessons: [
          { id: "mhfaw-1-1", title: "What Constitutes a Crisis", duration: "25 min", type: "video", completed: false },
          { id: "mhfaw-1-2", title: "Warning Signs & Risk Factors", duration: "25 min", type: "slides", completed: false },
          { id: "mhfaw-1-3", title: "Case Study Analysis", duration: "30 min", type: "activity", completed: false },
          { id: "mhfaw-1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhfaw-2",
        title: "Safe & Ethical Response",
        completed: false,
        lessons: [
          { id: "mhfaw-2-1", title: "Immediate Response Steps", duration: "25 min", type: "video", completed: false },
          { id: "mhfaw-2-2", title: "Communication in Crisis", duration: "25 min", type: "slides", completed: false },
          { id: "mhfaw-2-3", title: "Ethical Considerations", duration: "20 min", type: "video", completed: false },
          { id: "mhfaw-2-4", title: "Response Role-Play", duration: "35 min", type: "activity", completed: false },
          { id: "mhfaw-2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhfaw-3",
        title: "Referral Pathways & Support Systems",
        completed: false,
        lessons: [
          { id: "mhfaw-3-1", title: "Understanding Referral Options", duration: "25 min", type: "video", completed: false },
          { id: "mhfaw-3-2", title: "Building Your Referral Network", duration: "25 min", type: "slides", completed: false },
          { id: "mhfaw-3-3", title: "Making Effective Referrals", duration: "20 min", type: "video", completed: false },
          { id: "mhfaw-3-4", title: "Mapping Your Resources", duration: "30 min", type: "activity", completed: false },
          { id: "mhfaw-3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "mhfaw-4",
        title: "Crisis Management & Recovery",
        completed: false,
        lessons: [
          { id: "mhfaw-4-1", title: "Managing Ongoing Crisis Situations", duration: "25 min", type: "video", completed: false },
          { id: "mhfaw-4-2", title: "Post-Crisis Team Support", duration: "25 min", type: "slides", completed: false },
          { id: "mhfaw-4-3", title: "Responder Self-Care", duration: "20 min", type: "video", completed: false },
          { id: "mhfaw-4-4", title: "Your Crisis Response Plan", duration: "30 min", type: "activity", completed: false },
          { id: "mhfaw-4-5", title: "Final Assessment", duration: "25 min", type: "quiz", completed: false },
          { id: "mhfaw-4-6", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  }
];

// Export all courses combined
export const allWorkplaceCourses: WorkplaceCourse[] = [
  ...transitioningToWorkCourses,
  ...workplaceMentalHealthCourses,
  ...leadershipHRCourses
];

// Helper to get course by ID
export const getWorkplaceCourseById = (id: string): WorkplaceCourse | undefined => {
  return allWorkplaceCourses.find(course => course.id === id);
};

// Helper to get courses by track
export const getCoursesByTrack = (track: CareerTrack): WorkplaceCourse[] => {
  return allWorkplaceCourses.filter(course => course.track === track);
};

// Helper to get track info
export const getTrackInfo = (trackId: CareerTrack): CourseTrack | undefined => {
  return careerTracks.find(track => track.id === trackId);
};
