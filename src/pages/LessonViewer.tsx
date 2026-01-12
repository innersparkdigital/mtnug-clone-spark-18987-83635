import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { toast } from "sonner";
import NextLessonModal from "@/components/NextLessonModal";
import { 
  allWorkplaceSlides, 
  workplaceCourseModules, 
  workplaceLessonMeta, 
  workplaceModuleNames 
} from "@/lib/workplaceLessonSlides";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Play,
  Pause,
  CheckCircle2,
  Download,
  FileText,
  Video,
  Headphones,
  Target,
  Lightbulb,
  Award,
  Home,
  Menu,
  X,
  LogIn
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

// Slide content for lessons
const lessonSlides: Record<string, {
  title: string;
  slides: {
    type: "title" | "content" | "scenario" | "activity" | "tips" | "quiz";
    title?: string;
    subtitle?: string;
    content?: string[];
    bullets?: string[];
    scenario?: { title: string; story: string; reflection: string };
    activity?: { instruction: string; prompts: string[] };
    tips?: { title: string; items: string[] };
    quiz?: { question: string; options: string[]; correct: number; explanation: string };
    image?: string;
  }[];
}> = {
  "1-1": {
    title: "What is Digital Mental Health?",
    slides: [
      {
        type: "title",
        title: "Module 1: Introduction to Digital Mental Health",
        subtitle: "Lesson 1: What is Digital Mental Health?",
        content: ["By the end of this lesson, you will:", "• Understand what digital mental health means", "• Recognize why it matters in today's world", "• Identify how technology impacts your wellbeing"]
      },
      {
        type: "content",
        title: "Defining Digital Mental Health",
        bullets: [
          "Digital mental health refers to the intersection of technology and psychological wellbeing",
          "It encompasses how we use digital tools, platforms, and devices in ways that affect our mental state",
          "Includes both the challenges (screen addiction, cyberbullying) and opportunities (mental health apps, online therapy)",
          "A growing field as our lives become increasingly digital"
        ],
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
      },
      {
        type: "content",
        title: "Why Digital Mental Health Matters",
        bullets: [
          "The average person spends 7+ hours daily on screens",
          "Social media use is linked to increased rates of anxiety and depression in young people",
          "Digital skills are essential, but so is digital wellness",
          "Understanding the impact helps us make healthier choices",
          "Early awareness can prevent long-term mental health issues"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "Amara's Experience",
          story: "Amara, a second-year university student in Kampala, noticed she was spending 5-6 hours daily on Instagram and TikTok. She felt anxious when she couldn't check her phone and often compared herself to influencers. Her grades started dropping, and she had trouble sleeping. When she learned about digital mental health in an Innerspark workshop, she realized her habits were affecting her wellbeing.",
          reflection: "Have you ever experienced similar feelings related to your digital habits?"
        }
      },
      {
        type: "activity",
        title: "Quick Reflection",
        activity: {
          instruction: "Take a moment to think about your own digital habits:",
          prompts: [
            "How many hours do you spend on screens daily?",
            "What apps or platforms take up most of your time?",
            "How do you feel after extended screen time?",
            "What positive aspects of technology do you value?"
          ]
        }
      },
      {
        type: "tips",
        title: "Key Takeaways",
        tips: {
          title: "Remember these points:",
          items: [
            "Digital mental health is about finding balance in our technology use",
            "Awareness is the first step toward healthier digital habits",
            "Technology itself isn't bad—it's how we use it that matters",
            "Small changes in digital habits can have big impacts on wellbeing",
            "You're not alone—many students face similar challenges"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "Which of the following BEST describes digital mental health?",
          options: [
            "Avoiding all technology to protect mental health",
            "Using only mental health apps on your phone",
            "The intersection of technology use and psychological wellbeing",
            "Having a social media account"
          ],
          correct: 2,
          explanation: "Digital mental health refers to the relationship between our technology use and our psychological wellbeing. It's not about avoiding technology, but understanding how our digital habits affect us."
        }
      }
    ]
  },
  "1-2": {
    title: "The Digital Age & Your Mind",
    slides: [
      {
        type: "title",
        title: "The Digital Age & Your Mind",
        subtitle: "Understanding how constant connectivity shapes our mental landscape",
        content: ["In this lesson, we explore:", "• How the digital age differs from previous eras", "• The psychological effects of constant connectivity", "• Opportunities and challenges unique to digital natives"]
      },
      {
        type: "content",
        title: "Living in the Digital Age",
        bullets: [
          "We are the first generation to grow up fully immersed in digital technology",
          "Smartphones, social media, and internet access are woven into daily life",
          "Information is available instantly, anywhere, anytime",
          "Our brains are adapting to this new reality—for better and worse",
          "The average university student checks their phone 80+ times per day"
        ]
      },
      {
        type: "content",
        title: "How Digital Life Affects Your Brain",
        bullets: [
          "Dopamine loops: Social media notifications trigger reward centers, creating habitual checking",
          "Attention fragmentation: Constant switching between apps reduces deep focus",
          "Sleep disruption: Blue light and stimulating content affect sleep quality",
          "Memory changes: Why memorize when Google knows everything?",
          "Social comparison: Seeing curated lives affects self-esteem"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "David's Discovery",
          story: "David, a student at Makerere University, realized he couldn't study for more than 15 minutes without checking his phone. Even when it was on silent, the urge was overwhelming. He felt anxious, distracted, and his exam results reflected his divided attention. After tracking his phone usage, he discovered he unlocked his phone over 100 times daily!",
          reflection: "What does your relationship with your phone look like? Do you control it, or does it control you?"
        }
      },
      {
        type: "activity",
        title: "Self-Assessment Exercise",
        activity: {
          instruction: "Rate each statement from 1 (Never) to 5 (Always):",
          prompts: [
            "I feel anxious when I can't check my phone",
            "I spend more time online than I planned to",
            "I compare myself to others I see online",
            "I have trouble focusing on tasks without checking notifications",
            "I use my phone right before bed"
          ]
        }
      },
      {
        type: "tips",
        title: "Navigating the Digital Age Wisely",
        tips: {
          title: "Practical strategies:",
          items: [
            "Use screen time tracking apps to understand your habits",
            "Schedule 'focus time' with notifications off",
            "Create phone-free zones (bedroom, study desk)",
            "Curate your feed to include positive, inspiring content",
            "Remember: You have the power to design your digital experience"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What is a 'dopamine loop' in the context of social media?",
          options: [
            "A type of social media filter",
            "A cycle where notifications trigger reward responses, encouraging repeated checking",
            "A fitness tracking feature",
            "A privacy setting on apps"
          ],
          correct: 1,
          explanation: "Dopamine loops occur when social media notifications trigger our brain's reward system, creating a cycle of checking for more notifications. This is by design—apps are engineered to be addictive."
        }
      }
    ]
  },
  // Module 3: Social Media & Emotional Wellbeing
  "3-1": {
    title: "The Psychology of Social Media",
    slides: [
      {
        type: "title",
        title: "Module 3: Social Media & Emotional Wellbeing",
        subtitle: "Lesson 1: The Psychology of Social Media",
        content: ["Learning objectives:", "• Understand how social media platforms are designed", "• Recognize psychological triggers used to keep you engaged", "• Identify your personal social media patterns"]
      },
      {
        type: "content",
        title: "How Social Media Captures Your Attention",
        bullets: [
          "Infinite scroll: No natural stopping point keeps you scrolling endlessly",
          "Variable rewards: Unpredictable likes and comments keep you coming back",
          "Social validation: Likes trigger dopamine, making you crave more approval",
          "Fear of Missing Out (FOMO): Constant updates create anxiety about missing things",
          "Personalized algorithms: Content tailored to keep you engaged longer"
        ],
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop"
      },
      {
        type: "content",
        title: "The Comparison Trap",
        bullets: [
          "We compare our behind-the-scenes to others' highlight reels",
          "Research shows more social media use correlates with lower self-esteem",
          "Filters and editing create unrealistic beauty standards",
          "Success posts can make us feel inadequate about our own progress",
          "Remember: People rarely post their struggles and failures"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "Grace's Social Media Wake-Up Call",
          story: "Grace, a graphic design student in Nairobi, spent hours scrolling through Instagram looking at other designers' work. She felt increasingly inadequate—everyone seemed more talented, more successful, with more followers. She almost quit design entirely. Then her mentor helped her realize she was comparing her beginning to others' middles. She started a 'no scroll after 8pm' rule and began posting her own learning journey, imperfections included.",
          reflection: "When have you felt worse about yourself after scrolling social media? What triggered those feelings?"
        }
      },
      {
        type: "activity",
        title: "Social Media Audit",
        activity: {
          instruction: "Conduct a quick audit of your social media feeds:",
          prompts: [
            "List the 5 accounts that take up most of your attention",
            "For each, note: Does this account make me feel better or worse about myself?",
            "Identify 3 accounts that consistently bring negative emotions",
            "Find 3 accounts that inspire, educate, or genuinely make you happy",
            "Plan: What will you unfollow, mute, or follow more of?"
          ]
        }
      },
      {
        type: "tips",
        title: "Healthier Social Media Habits",
        tips: {
          title: "Take control of your feed:",
          items: [
            "Curate ruthlessly: Unfollow accounts that make you feel bad",
            "Follow accounts that teach, inspire, or make you genuinely laugh",
            "Set daily time limits using built-in app controls",
            "Turn off notifications for non-essential apps",
            "Schedule specific times to check social media rather than constant browsing"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What is 'infinite scroll' designed to do?",
          options: [
            "Help you find specific content faster",
            "Keep you scrolling by removing natural stopping points",
            "Improve your internet connection speed",
            "Organize content chronologically"
          ],
          correct: 1,
          explanation: "Infinite scroll is deliberately designed to remove natural stopping points, keeping you engaged longer. Traditional websites had page breaks that created natural pause moments—infinite scroll eliminates these."
        }
      }
    ]
  },
  "3-2": {
    title: "Cyberbullying & Online Harassment",
    slides: [
      {
        type: "title",
        title: "Cyberbullying & Online Harassment",
        subtitle: "Recognizing, responding to, and preventing digital abuse",
        content: ["In this lesson:", "• Define cyberbullying and its various forms", "• Learn how to respond if you experience or witness it", "• Understand the mental health impacts and recovery"]
      },
      {
        type: "content",
        title: "Forms of Cyberbullying",
        bullets: [
          "Direct harassment: Threatening or insulting messages sent directly",
          "Public shaming: Embarrassing someone publicly on social media",
          "Exclusion: Deliberately leaving someone out of online groups",
          "Impersonation: Creating fake accounts to damage reputation",
          "Doxxing: Sharing private information without consent",
          "Image-based abuse: Sharing intimate images without permission"
        ]
      },
      {
        type: "content",
        title: "Mental Health Impact",
        bullets: [
          "Cyberbullying can cause anxiety, depression, and low self-esteem",
          "Unlike traditional bullying, it follows you home—no escape",
          "Digital permanence means hurtful content can resurface",
          "Victims often feel isolated and ashamed",
          "In severe cases, it contributes to self-harm and suicidal thoughts",
          "Early intervention and support are crucial"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "Peter's Experience",
          story: "Peter, a student at University of Ghana, made a mistake during an online class that was recorded. Someone clipped it and shared it on WhatsApp groups with mocking captions. The video spread across campus. Peter felt humiliated and stopped attending virtual classes. He only recovered after confiding in a counselor and finding friends who supported him. The harassers were eventually reported to the university.",
          reflection: "How would you support a friend going through a similar experience?"
        }
      },
      {
        type: "activity",
        title: "Response Planning",
        activity: {
          instruction: "Create your personal response plan:",
          prompts: [
            "Who are 3 trusted adults you could tell if you experience cyberbullying?",
            "Where would you find evidence (screenshots, links)?",
            "What platform reporting tools do you know how to use?",
            "Draft a supportive message you could send to someone being bullied",
            "What self-care activities help you when you're feeling hurt?"
          ]
        }
      },
      {
        type: "tips",
        title: "If You Experience Cyberbullying",
        tips: {
          title: "Steps to take:",
          items: [
            "Don't respond or retaliate—it often makes things worse",
            "Screenshot and save all evidence with dates/times",
            "Block the person on all platforms",
            "Report to the platform using their tools",
            "Tell a trusted adult, counselor, or friend",
            "Remember: It's not your fault, and you deserve support"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What should you do FIRST if you experience cyberbullying?",
          options: [
            "Respond with equally harsh messages",
            "Delete all your social media accounts immediately",
            "Take screenshots and save evidence before blocking",
            "Post publicly about what happened"
          ],
          correct: 2,
          explanation: "Documenting evidence is crucial before taking other actions. Screenshots with timestamps can be important if you need to report to authorities, schools, or platforms. Then block, report, and seek support."
        }
      }
    ]
  },
  // Module 4: Stress, Anxiety & Academic Pressure
  "4-1": {
    title: "Understanding Academic Stress",
    slides: [
      {
        type: "title",
        title: "Module 4: Stress, Anxiety & Academic Pressure",
        subtitle: "Lesson 1: Understanding Academic Stress",
        content: ["What you'll learn:", "• The difference between helpful and harmful stress", "• Common causes of academic pressure", "• How digital life amplifies academic stress"]
      },
      {
        type: "content",
        title: "Good Stress vs. Bad Stress",
        bullets: [
          "Eustress (good stress): Motivates you, helps you focus, improves performance",
          "Distress (bad stress): Overwhelming, causes anxiety, impairs thinking",
          "The same situation can cause either—it depends on how you perceive it",
          "Some pressure helps you prepare; too much pressure causes panic",
          "The goal isn't to eliminate stress, but to manage it effectively"
        ],
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop"
      },
      {
        type: "content",
        title: "Common Sources of Academic Stress",
        bullets: [
          "Heavy course loads and competing deadlines",
          "Exam pressure and fear of failure",
          "Financial stress and work-study balance",
          "Family expectations and cultural pressure",
          "Comparison with high-achieving peers",
          "Uncertainty about future career and job prospects"
        ]
      },
      {
        type: "content",
        title: "How Technology Adds to Academic Pressure",
        bullets: [
          "24/7 availability means no clear 'off' time",
          "Constant notifications interrupt deep study sessions",
          "Seeing peers' achievements online increases comparison",
          "Information overload makes it hard to know what to prioritize",
          "Procrastination through entertainment is always one click away"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "Fatima's Semester of Overwhelm",
          story: "Fatima, a law student in Dar es Salaam, was juggling 7 courses, a part-time job, and family responsibilities. She stayed up late scrolling through TikTok to 'relax,' but it left her more tired. Her phone buzzed with deadline reminders while she was trying to study. By mid-semester, she was exhausted, anxious, and her grades were slipping. A friend introduced her to time-blocking and digital boundaries. Within weeks, she felt more in control.",
          reflection: "What aspects of Fatima's story resonate with your own experience?"
        }
      },
      {
        type: "activity",
        title: "Stress Mapping Exercise",
        activity: {
          instruction: "Map out your current stress landscape:",
          prompts: [
            "List your top 5 current stressors (academic and otherwise)",
            "Rate each from 1-10 in terms of how much it affects you",
            "Identify which stressors you can control vs. which you can't",
            "For controllable stressors, write one action you could take this week",
            "For uncontrollable stressors, write one coping strategy"
          ]
        }
      },
      {
        type: "tips",
        title: "Managing Academic Pressure",
        tips: {
          title: "Evidence-based strategies:",
          items: [
            "Break large tasks into smaller, manageable steps",
            "Use the Pomodoro technique: 25 min work, 5 min break",
            "Create a dedicated study environment away from phone",
            "Schedule regular breaks—rest improves performance",
            "Reach out for help early—tutors, professors, counselors",
            "Remember: Your worth isn't determined by your grades"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What is 'eustress'?",
          options: [
            "Stress caused by European travel",
            "Positive stress that motivates and improves performance",
            "Stress caused by using technology",
            "A stress-relief medication"
          ],
          correct: 1,
          explanation: "Eustress is positive stress that can actually enhance performance, focus, and motivation. The key is keeping stress at manageable levels where it helps rather than overwhelms you."
        }
      }
    ]
  },
  "4-2": {
    title: "Anxiety Management Techniques",
    slides: [
      {
        type: "title",
        title: "Anxiety Management Techniques",
        subtitle: "Practical tools to calm your mind in stressful moments",
        content: ["You'll learn:", "• How to recognize anxiety symptoms", "• Immediate techniques to reduce anxiety", "• Long-term practices for anxiety prevention"]
      },
      {
        type: "content",
        title: "Recognizing Anxiety",
        bullets: [
          "Physical: Racing heart, sweaty palms, shallow breathing, muscle tension",
          "Mental: Racing thoughts, difficulty concentrating, worst-case thinking",
          "Emotional: Feeling overwhelmed, irritable, or on edge",
          "Behavioral: Avoiding situations, procrastinating, restlessness",
          "Everyone experiences anxiety—it becomes a problem when it interferes with life"
        ]
      },
      {
        type: "content",
        title: "The 5-4-3-2-1 Grounding Technique",
        bullets: [
          "This technique brings you back to the present moment",
          "5 things you can SEE around you",
          "4 things you can TOUCH or feel",
          "3 things you can HEAR",
          "2 things you can SMELL",
          "1 thing you can TASTE",
          "Works by interrupting anxious thoughts and focusing on senses"
        ]
      },
      {
        type: "content",
        title: "Box Breathing for Instant Calm",
        bullets: [
          "Inhale for 4 counts",
          "Hold for 4 counts",
          "Exhale for 4 counts",
          "Hold for 4 counts",
          "Repeat 4-6 times",
          "This activates your parasympathetic nervous system, reducing fight-or-flight",
          "Used by athletes, military, and performers to manage pressure"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "Kwame's Exam Panic",
          story: "Kwame, an engineering student in Accra, would freeze during exams. His mind went blank, his heart raced, and he'd forget everything he studied. After learning box breathing from a campus counselor, he practiced daily for two weeks. During his next exam, when he felt panic rising, he closed his eyes and did 4 cycles of box breathing. The fog lifted, and he completed his exam. He still uses this technique years later in his career.",
          reflection: "When do you notice anxiety symptoms most strongly? What triggers them?"
        }
      },
      {
        type: "activity",
        title: "Practice Session",
        activity: {
          instruction: "Let's practice these techniques right now:",
          prompts: [
            "Set a timer for 2 minutes and do the 5-4-3-2-1 grounding exercise",
            "Then do 4 rounds of box breathing (4-4-4-4)",
            "Notice: How does your body feel before and after?",
            "Rate your anxiety before (1-10) and after (1-10)",
            "Commit to practicing one technique daily this week"
          ]
        }
      },
      {
        type: "tips",
        title: "Long-Term Anxiety Prevention",
        tips: {
          title: "Build these habits:",
          items: [
            "Regular physical exercise—even a 15-minute walk helps",
            "Consistent sleep schedule (7-9 hours)",
            "Limit caffeine, especially after noon",
            "Daily mindfulness or meditation (start with 5 minutes)",
            "Maintain social connections—isolation increases anxiety",
            "Seek professional help if anxiety significantly impacts daily life"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "In box breathing, what is the sequence?",
          options: [
            "Inhale 2, Hold 2, Exhale 2, Hold 2",
            "Inhale 4, Hold 4, Exhale 4, Hold 4",
            "Inhale 6, Exhale 6, Repeat",
            "Hold breath as long as possible, then exhale"
          ],
          correct: 1,
          explanation: "Box breathing follows a 4-4-4-4 pattern: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. This equal rhythm activates the calming parasympathetic nervous system."
        }
      }
    ]
  },
  // Module 5: Healthy Screen-Time & Digital Habits
  "5-1": {
    title: "Auditing Your Screen Time",
    slides: [
      {
        type: "title",
        title: "Module 5: Healthy Screen-Time & Digital Habits",
        subtitle: "Lesson 1: Auditing Your Screen Time",
        content: ["This lesson covers:", "• How to measure and understand your screen time", "• Productive vs. passive screen time", "• Setting realistic digital goals"]
      },
      {
        type: "content",
        title: "The Reality of Screen Time",
        bullets: [
          "Global average: 7+ hours of screen time daily",
          "For students, it's often even higher with online learning",
          "Not all screen time is equal—context matters",
          "Productive: Learning, creating, meaningful connection",
          "Passive: Endless scrolling, mindless consumption",
          "The first step to change is honest measurement"
        ],
        image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800&h=400&fit=crop"
      },
      {
        type: "content",
        title: "Using Built-In Screen Time Tools",
        bullets: [
          "iPhone: Settings > Screen Time (detailed breakdown by app)",
          "Android: Settings > Digital Wellbeing & Parental Controls",
          "Desktop: Apps like RescueTime or built-in Focus modes",
          "Most apps now show weekly reports automatically",
          "Look for patterns: Which apps consume most time? When?",
          "Note your pickup count—how often you check your phone"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "Naledi's 40-Hour Discovery",
          story: "Naledi, a journalism student in Johannesburg, checked her screen time report for the first time. She was shocked: 40+ hours per week on her phone alone, with 6 hours daily on social media. That's nearly a full-time job! She realized she was spending more time consuming content than creating it—ironic for a journalism student. She set app limits and redirected 2 hours daily to her own writing. Within a month, she'd completed a short story she'd been 'too busy' to write.",
          reflection: "What might you discover if you honestly audited your screen time?"
        }
      },
      {
        type: "activity",
        title: "Your Screen Time Audit",
        activity: {
          instruction: "Complete this audit over the next 3 days:",
          prompts: [
            "Check your phone's screen time right now—what's your daily average?",
            "List your top 5 apps by usage time",
            "Categorize each: Productive, Social, Entertainment, or Other",
            "Calculate: How many hours per week go to passive scrolling?",
            "Ask yourself: What could I do with just 1 of those hours redirected?"
          ]
        }
      },
      {
        type: "tips",
        title: "Setting Realistic Limits",
        tips: {
          title: "Start with these steps:",
          items: [
            "Don't try to cut screen time by 50%—start with 15-30 minutes less",
            "Set app-specific limits for your top time-draining apps",
            "Enable 'Downtime' or 'Focus Mode' during study hours",
            "Remove social media apps from your home screen",
            "Charge your phone outside your bedroom",
            "Replace scrolling with specific alternatives (read, walk, call a friend)"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What's the difference between productive and passive screen time?",
          options: [
            "Productive is work screens, passive is personal screens",
            "Productive creates value or learning; passive is mindless consumption",
            "Productive is any app you pay for; passive is free apps",
            "There's no meaningful difference"
          ],
          correct: 1,
          explanation: "Productive screen time involves intentional activities that add value—learning, creating, meaningful connection. Passive screen time is mindless scrolling and consumption without clear purpose or benefit."
        }
      }
    ]
  },
  "5-2": {
    title: "Building a Digital Wellness Routine",
    slides: [
      {
        type: "title",
        title: "Building a Digital Wellness Routine",
        subtitle: "Creating sustainable habits for balanced technology use",
        content: ["In this lesson:", "• Design your personalized digital wellness routine", "• Learn the science of habit formation", "• Create boundaries that stick"]
      },
      {
        type: "content",
        title: "The Science of Habit Formation",
        bullets: [
          "Habits form through a cue-routine-reward loop",
          "To change a habit, disrupt the cue or replace the routine",
          "New habits take an average of 66 days to become automatic",
          "Start incredibly small—'too easy to fail'",
          "Stack new habits onto existing ones ('After I brush my teeth, I will...')",
          "Environment design matters more than willpower"
        ]
      },
      {
        type: "content",
        title: "Morning Digital Boundaries",
        bullets: [
          "Don't check your phone for the first 30-60 minutes after waking",
          "Your morning sets the tone for your entire day",
          "Waking to notifications puts you in reactive mode immediately",
          "Instead: Stretch, hydrate, journal, or eat breakfast first",
          "Use a separate alarm clock so phone stays out of bedroom",
          "Morning quiet protects your most creative, focused time"
        ]
      },
      {
        type: "content",
        title: "Evening Digital Wind-Down",
        bullets: [
          "Blue light from screens disrupts sleep hormones",
          "Set a 'screens off' time 1 hour before bed",
          "Enable Night Shift or blue light filters after sunset",
          "Avoid stimulating content (news, social drama) before bed",
          "Replace scrolling with reading, journaling, or relaxation",
          "Charge your phone outside your bedroom"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "James's Morning Revolution",
          story: "James, a medical student in Kampala, used to wake up and immediately check WhatsApp, emails, and Twitter. By the time he got out of bed, he was already stressed about messages and news. He challenged himself to keep his phone in another room overnight and not check it until after breakfast. The first week was hard—the urge was strong. But soon, he noticed he was calmer, more focused in morning lectures, and actually enjoying breakfast. Three months later, it's his most important habit.",
          reflection: "What's the first thing you do when you wake up? How does it affect your day?"
        }
      },
      {
        type: "activity",
        title: "Design Your Digital Routine",
        activity: {
          instruction: "Create your personalized digital wellness routine:",
          prompts: [
            "Morning boundary: What will you do BEFORE checking your phone?",
            "Study sessions: How will you minimize digital distractions?",
            "Breaks: What non-screen activity will you do between study blocks?",
            "Evening wind-down: What time will you stop screens?",
            "Weekend reset: How will you ensure digital-free time for rest?"
          ]
        }
      },
      {
        type: "tips",
        title: "Making Boundaries Stick",
        tips: {
          title: "Practical implementation:",
          items: [
            "Make it physical: Remove charger from bedroom, buy an alarm clock",
            "Make it social: Tell friends about your boundaries so they support you",
            "Make it visible: Put reminder notes on your phone or door",
            "Start with one boundary—master it before adding more",
            "Expect slip-ups—they're part of the process, not failure",
            "Track your progress to see improvement over time"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "Why should you avoid checking your phone first thing in the morning?",
          options: [
            "It uses too much data",
            "It puts you in reactive mode and can increase stress",
            "It drains your battery faster",
            "Phones don't work well in the morning"
          ],
          correct: 1,
          explanation: "Checking your phone immediately upon waking puts you in reactive mode—responding to others' demands and content. This increases cortisol (stress hormone) and takes away your most focused, creative time of day."
        }
      }
    ]
  },
  // Module 6: Emotional Intelligence & Self-Care
  "6-1": {
    title: "Understanding Emotional Intelligence",
    slides: [
      {
        type: "title",
        title: "Module 6: Emotional Intelligence & Self-Care",
        subtitle: "Lesson 1: Understanding Emotional Intelligence",
        content: ["You'll explore:", "• The four components of emotional intelligence", "• Why EQ matters more than IQ for success", "• How to develop your emotional skills"]
      },
      {
        type: "content",
        title: "What is Emotional Intelligence?",
        bullets: [
          "EQ (Emotional Quotient) is your ability to understand and manage emotions",
          "Unlike IQ, EQ can be developed and improved throughout life",
          "Research shows EQ is a stronger predictor of success than IQ",
          "It affects relationships, career, leadership, and mental health",
          "Emotionally intelligent people navigate stress and conflict better"
        ],
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=400&fit=crop"
      },
      {
        type: "content",
        title: "The Four Components of EQ",
        bullets: [
          "Self-Awareness: Recognizing your own emotions and their impact",
          "Self-Management: Controlling impulses, adapting to change",
          "Social Awareness: Understanding others' emotions (empathy)",
          "Relationship Management: Inspiring, influencing, resolving conflict",
          "All four work together and can be strengthened with practice"
        ]
      },
      {
        type: "content",
        title: "EQ in the Digital Age",
        bullets: [
          "Digital communication removes tone, body language, and nuance",
          "Misunderstandings are common in texts and emails",
          "Social media can amplify emotional reactions",
          "Online anonymity can reduce empathy",
          "Digital EQ means reading context and responding thoughtfully online"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "Aisha's WhatsApp Conflict",
          story: "Aisha, a student in Rwanda, received a short reply from her study group partner: 'Fine.' She immediately assumed he was angry with her and spent hours anxious about what she'd done wrong. When they met in person, he explained he was just busy and hadn't meant anything by it. Aisha realized she often projected emotions onto text messages. She started assuming positive intent and asking for clarification before reacting. Her relationships and stress levels improved dramatically.",
          reflection: "Have you ever misread tone in a text message? What happened?"
        }
      },
      {
        type: "activity",
        title: "EQ Self-Assessment",
        activity: {
          instruction: "Rate yourself honestly (1=rarely, 5=always) on these EQ indicators:",
          prompts: [
            "I can name my emotions when I feel them",
            "I pause before reacting when I'm upset",
            "I can tell when someone is uncomfortable, even if they don't say so",
            "I adapt my communication style to different people",
            "I handle criticism without becoming defensive"
          ]
        }
      },
      {
        type: "tips",
        title: "Developing Your EQ",
        tips: {
          title: "Daily practices:",
          items: [
            "Name your emotions throughout the day (expand beyond 'good' or 'bad')",
            "Pause before responding when you feel triggered",
            "Practice active listening—focus fully on what others say",
            "Ask questions to understand, not to respond",
            "Reflect on conflicts: What could I have done differently?",
            "Read fiction—it builds empathy and emotional vocabulary"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "Which is NOT one of the four components of emotional intelligence?",
          options: [
            "Self-Awareness",
            "Self-Management",
            "Technical Skills",
            "Relationship Management"
          ],
          correct: 2,
          explanation: "The four components of EQ are: Self-Awareness, Self-Management, Social Awareness (empathy), and Relationship Management. Technical skills are separate—EQ is about emotional understanding and management."
        }
      }
    ]
  },
  "6-2": {
    title: "Self-Care Practices for Students",
    slides: [
      {
        type: "title",
        title: "Self-Care Practices for Students",
        subtitle: "Building a sustainable self-care routine on a student budget",
        content: ["This lesson covers:", "• What real self-care is (and isn't)", "• The five pillars of student self-care", "• Creating a personalized self-care plan"]
      },
      {
        type: "content",
        title: "Redefining Self-Care",
        bullets: [
          "Self-care is not selfish—it's necessary for sustainable performance",
          "It's not just bubble baths and face masks (though those can help!)",
          "Real self-care often means doing hard things that serve your future self",
          "It includes saying no, setting boundaries, and asking for help",
          "Self-care looks different for everyone—find what restores YOU"
        ]
      },
      {
        type: "content",
        title: "The Five Pillars of Student Self-Care",
        bullets: [
          "Physical: Sleep, nutrition, movement, hydration",
          "Mental: Learning, creativity, breaks from screens",
          "Emotional: Processing feelings, therapy, journaling",
          "Social: Quality time with friends, community, belonging",
          "Spiritual: Purpose, values, nature, mindfulness (whatever gives meaning)",
          "Neglecting any pillar affects all the others"
        ]
      },
      {
        type: "content",
        title: "Budget-Friendly Self-Care",
        bullets: [
          "Free: Walk in nature, dance to music, call a friend, nap, stretch",
          "Low-cost: Cook a good meal, take a long shower, journal, read",
          "Community: Join clubs, study groups, religious organizations, volunteer",
          "Campus resources: Free counseling, gym, events, library quiet spaces",
          "Digital tools: Free meditation apps, YouTube yoga, mood tracking"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "Chidinma's Self-Care Sunday",
          story: "Chidinma, a nursing student in Lagos, was burning out—all work, no rest. She started 'Self-Care Sundays': no studying, no social media. Instead, she cleaned her space, cooked a nice meal, called home, went for a walk, and did gentle stretching. At first, she felt guilty not studying. But she noticed she was more focused and less anxious during the week. Her grades actually improved. Now, she protects that day fiercely.",
          reflection: "What does self-care currently look like in your life? What's missing?"
        }
      },
      {
        type: "activity",
        title: "Create Your Self-Care Menu",
        activity: {
          instruction: "Build a personalized 'self-care menu' you can choose from:",
          prompts: [
            "List 3 activities for each pillar (Physical, Mental, Emotional, Social, Spiritual)",
            "Star the ones that are free or low-cost",
            "Identify which pillar you most neglect",
            "Choose 3 activities to try this week",
            "Schedule one self-care activity in your calendar right now"
          ]
        }
      },
      {
        type: "tips",
        title: "Making Self-Care Sustainable",
        tips: {
          title: "Practical advice:",
          items: [
            "Schedule self-care like you schedule classes—it's non-negotiable",
            "Start small: 10 minutes of intentional rest is better than nothing",
            "Notice what drains you and what restores you",
            "Self-care during hard times is most important, not least",
            "It's okay if your self-care looks different from others'",
            "Progress, not perfection—some days you'll just survive, and that's okay"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "Which of the following is an example of REAL self-care?",
          options: [
            "Scrolling social media for 3 hours to 'relax'",
            "Saying no to a commitment when you're overwhelmed",
            "Staying up all night to finish work, then binge-watching TV",
            "Buying expensive things you can't afford"
          ],
          correct: 1,
          explanation: "Real self-care includes boundary-setting and protecting your wellbeing. Saying no when overwhelmed prevents burnout and respects your limits. Mindless scrolling and overspending often provide short-term escape but long-term harm."
        }
      }
    ]
  },
  // Module 7: Seeking Help & Supporting Others
  "7-1": {
    title: "When & How to Seek Help",
    slides: [
      {
        type: "title",
        title: "Module 7: Seeking Help & Supporting Others",
        subtitle: "Lesson 1: When & How to Seek Help",
        content: ["You'll learn:", "• Signs that you might need professional support", "• Types of mental health support available", "• How to take the first step toward help"]
      },
      {
        type: "content",
        title: "It's Okay to Need Help",
        bullets: [
          "Seeking help is a sign of strength, not weakness",
          "Just like physical health, mental health sometimes needs professional care",
          "Early intervention leads to better outcomes",
          "You don't have to be 'sick enough' to deserve support",
          "Many successful people credit therapy for their growth"
        ],
        image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&h=400&fit=crop"
      },
      {
        type: "content",
        title: "Signs You Might Need Support",
        bullets: [
          "Persistent sadness, emptiness, or hopelessness lasting more than 2 weeks",
          "Anxiety that interferes with daily activities",
          "Significant changes in sleep, appetite, or energy",
          "Withdrawing from friends, family, or activities you used to enjoy",
          "Difficulty concentrating, making decisions, or getting things done",
          "Thoughts of self-harm or suicide (seek help immediately)"
        ]
      },
      {
        type: "content",
        title: "Types of Mental Health Support",
        bullets: [
          "Campus counseling: Often free or low-cost for students",
          "Therapists/Psychologists: Provide talk therapy and coping strategies",
          "Psychiatrists: Medical doctors who can prescribe medication if needed",
          "Peer support groups: Connecting with others who understand",
          "Crisis hotlines: 24/7 support for urgent situations",
          "Apps like Innerspark: Accessible tools for daily mental wellness"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "Mohammed's Turning Point",
          story: "Mohammed, an engineering student in Egypt, had been struggling with anxiety for years but thought he should 'man up' and handle it alone. His hands would shake during presentations, and he avoided social events. When a friend shared that he was seeing a counselor, Mohammed felt permission to try it too. After three months of therapy, he learned techniques that changed his life. He now speaks openly about mental health to reduce stigma for others.",
          reflection: "What beliefs or barriers might prevent you from seeking help if you needed it?"
        }
      },
      {
        type: "activity",
        title: "Help-Seeking Preparation",
        activity: {
          instruction: "Prepare for if/when you might need support:",
          prompts: [
            "Find out: Where is your campus counseling center? What are their hours?",
            "Research: What therapists or services are available in your area?",
            "Identify: Who in your life could you talk to if you were struggling?",
            "Save: Store a crisis hotline number in your phone now",
            "Reflect: What would make seeking help easier for you?"
          ]
        }
      },
      {
        type: "tips",
        title: "Taking the First Step",
        tips: {
          title: "How to reach out:",
          items: [
            "You can start with a trusted friend, family member, or campus counselor",
            "Scripts help: 'I've been struggling with ___ and I'd like to talk to someone'",
            "It's okay to try different therapists—fit matters",
            "First sessions are often about getting to know you, not solving everything",
            "Treatment takes time—be patient with the process",
            "You deserve support—don't wait until crisis to seek help"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "Which of the following is a sign you should consider seeking professional mental health support?",
          options: [
            "Feeling sad for a day after receiving bad news",
            "Persistent anxiety that interferes with daily activities for weeks",
            "Being nervous before a big presentation",
            "Feeling tired after a long day of studying"
          ],
          correct: 1,
          explanation: "While occasional stress, sadness, or nervousness is normal, persistent symptoms that last for weeks and interfere with daily functioning are signs that professional support could be helpful."
        }
      }
    ]
  },
  "7-2": {
    title: "Supporting a Friend in Crisis",
    slides: [
      {
        type: "title",
        title: "Supporting a Friend in Crisis",
        subtitle: "How to be there for someone who is struggling",
        content: ["This lesson teaches:", "• How to recognize when a friend needs help", "• What to say (and what not to say)", "• How to connect them to professional resources"]
      },
      {
        type: "content",
        title: "Recognizing Warning Signs in Others",
        bullets: [
          "Withdrawal from friends, activities, or responsibilities",
          "Mood changes: Unusual sadness, irritability, or hopelessness",
          "Talking about feeling like a burden or wanting to give up",
          "Increased substance use or risky behavior",
          "Giving away possessions or saying goodbye",
          "Dramatic changes in sleep, eating, or appearance"
        ]
      },
      {
        type: "content",
        title: "How to Start the Conversation",
        bullets: [
          "Choose a private, comfortable setting",
          "Be direct but caring: 'I've noticed you seem down lately. I'm worried about you.'",
          "Use 'I' statements: 'I care about you' rather than 'You're acting strange'",
          "Listen more than you talk—let them share at their pace",
          "Don't try to fix it—your presence and listening matter most",
          "Avoid minimizing ('It's not that bad') or problem-solving immediately"
        ]
      },
      {
        type: "content",
        title: "What to Say (and What to Avoid)",
        bullets: [
          "SAY: 'I'm here for you' / 'That sounds really hard' / 'How can I support you?'",
          "SAY: 'It's okay to not be okay' / 'You're not alone in this'",
          "AVOID: 'Just think positive' / 'Others have it worse' / 'Snap out of it'",
          "AVOID: 'I know exactly how you feel' (unless you truly do)",
          "AVOID: Sharing their struggles with others without permission"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "Sarah's Intervention",
          story: "Sarah noticed her roommate, Blessing, had stopped going to class and was sleeping all day. Blessing dismissed it as 'just tired.' Sarah gently but persistently expressed concern. One night, Blessing finally opened up about feeling hopeless. Sarah listened without judgment, then asked, 'Would you be willing to talk to the campus counselor with me?' She walked Blessing to the center the next day. Blessing says that moment saved her life.",
          reflection: "Have you ever noticed a friend struggling? How did you respond?"
        }
      },
      {
        type: "activity",
        title: "Role-Play Practice",
        activity: {
          instruction: "Practice these supportive conversations:",
          prompts: [
            "Write out how you would start a conversation with a friend you're worried about",
            "List 5 supportive phrases you could use when listening to someone",
            "Identify 3 local resources you could share (hotlines, campus services, apps)",
            "Practice saying out loud: 'I care about you. I'm worried. How can I help?'",
            "Reflect: What would you want a friend to say to you if you were struggling?"
          ]
        }
      },
      {
        type: "tips",
        title: "Important Reminders",
        tips: {
          title: "Supporting others while caring for yourself:",
          items: [
            "You're a friend, not a therapist—it's not your job to fix them",
            "Encourage professional help, don't replace it",
            "It's okay to involve trusted adults if you're worried about safety",
            "If someone mentions suicide, take it seriously and get help immediately",
            "Supporting someone can be draining—make sure you have support too",
            "You can't pour from an empty cup—your wellbeing matters"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What should you do if a friend directly mentions wanting to end their life?",
          options: [
            "Promise to keep it a secret to maintain their trust",
            "Tell them it's just a phase and they'll feel better soon",
            "Take it seriously and help connect them to professional support immediately",
            "Give them space to figure it out on their own"
          ],
          correct: 2,
          explanation: "Suicidal statements should always be taken seriously. Your role is to stay with them, express care, and connect them to professional help—campus counselors, crisis hotlines, or emergency services. Breaking confidentiality to save a life is always the right choice."
        }
      }
    ]
  },
  // Module 8: Final Reflection & Personal Wellness Plan
  "8-1": {
    title: "Reflecting on Your Journey",
    slides: [
      {
        type: "title",
        title: "Module 8: Final Reflection & Personal Wellness Plan",
        subtitle: "Lesson 1: Reflecting on Your Journey",
        content: ["In this final module:", "• Review key learnings from the course", "• Reflect on your personal growth", "• Identify areas for continued development"]
      },
      {
        type: "content",
        title: "Course Journey Recap",
        bullets: [
          "Module 1: Understood what digital mental health means",
          "Module 2: Explored digital overload and burnout",
          "Module 3: Examined social media's emotional impact",
          "Module 4: Learned stress and anxiety management techniques",
          "Module 5: Built healthy screen-time habits",
          "Module 6: Developed emotional intelligence and self-care practices",
          "Module 7: Learned to seek help and support others"
        ]
      },
      {
        type: "content",
        title: "Key Insights",
        bullets: [
          "Technology isn't inherently good or bad—it's how we use it",
          "Awareness is the first step toward change",
          "Small, consistent changes beat dramatic overhauls",
          "Mental health is as important as physical health",
          "Seeking help is strength, not weakness",
          "You have the power to design your digital life intentionally"
        ]
      },
      {
        type: "activity",
        title: "Personal Reflection Exercise",
        activity: {
          instruction: "Take time to reflect on your learning journey:",
          prompts: [
            "What was the most surprising thing you learned in this course?",
            "Which technique or strategy have you already started implementing?",
            "What's one belief about technology or mental health that has changed?",
            "What do you wish you had known before starting this course?",
            "Who in your life could benefit from what you've learned?"
          ]
        }
      },
      {
        type: "scenario",
        title: "Celebrating Progress",
        scenario: {
          title: "Your Growth Story",
          story: "Think about where you were when you started this course. Perhaps you were overwhelmed by screen time, stressed about academics, or unsure how to manage digital life. Now, you have a toolkit of strategies, a deeper understanding of your patterns, and the knowledge that you're not alone. This is just the beginning of your wellness journey—not the end.",
          reflection: "What are you most proud of learning or changing during this course?"
        }
      },
      {
        type: "tips",
        title: "Continuing Your Growth",
        tips: {
          title: "Beyond this course:",
          items: [
            "Keep practicing the techniques—habits take time to solidify",
            "Share what you've learned with friends and family",
            "Revisit modules when you need a refresher",
            "Explore Innerspark app features for ongoing support",
            "Consider becoming a Digital Wellness Ambassador",
            "Remember: Wellness is a journey, not a destination"
          ]
        }
      },
      {
        type: "quiz",
        title: "Course Reflection",
        quiz: {
          question: "What is the most important first step toward healthier digital habits?",
          options: [
            "Deleting all social media immediately",
            "Buying expensive wellness products",
            "Awareness and honest self-assessment",
            "Convincing everyone around you to change"
          ],
          correct: 2,
          explanation: "Awareness is the foundation of all change. Before you can improve your habits, you need to honestly understand your current patterns. This self-awareness allows you to make informed, sustainable changes."
        }
      }
    ]
  },
  "8-2": {
    title: "Creating Your Personal Wellness Plan",
    slides: [
      {
        type: "title",
        title: "Creating Your Personal Wellness Plan",
        subtitle: "Building a sustainable roadmap for your mental wellbeing",
        content: ["The final step:", "• Create your personalized digital wellness plan", "• Set specific, achievable goals", "• Prepare for challenges and setbacks"]
      },
      {
        type: "content",
        title: "The SMART Goal Framework",
        bullets: [
          "Specific: What exactly will you do?",
          "Measurable: How will you track progress?",
          "Achievable: Is it realistic given your life?",
          "Relevant: Does it address your actual needs?",
          "Time-bound: By when will you achieve it?",
          "Example: 'I will limit Instagram to 30 minutes daily using the app timer for the next 30 days'"
        ],
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop"
      },
      {
        type: "content",
        title: "Areas to Address in Your Plan",
        bullets: [
          "Screen time: Daily limits, app-specific boundaries",
          "Morning routine: Phone-free time, grounding practices",
          "Evening routine: Wind-down time, sleep hygiene",
          "Stress management: Which techniques will you use?",
          "Social connections: How will you nurture relationships offline?",
          "Self-care: What activities will you prioritize?",
          "Support network: Who will you turn to when struggling?"
        ]
      },
      {
        type: "activity",
        title: "Build Your Wellness Plan",
        activity: {
          instruction: "Complete your Personal Digital Wellness Plan:",
          prompts: [
            "Goal 1 (Screen Time): Write one SMART goal for managing your digital use",
            "Goal 2 (Daily Routines): Set one morning or evening boundary",
            "Goal 3 (Stress): Choose one anxiety/stress technique to practice weekly",
            "Goal 4 (Self-Care): Identify one self-care activity to do each week",
            "Support: Name 2-3 people you can reach out to for accountability or help"
          ]
        }
      },
      {
        type: "content",
        title: "Planning for Setbacks",
        bullets: [
          "Setbacks are normal—they're part of growth, not failure",
          "Identify your triggers: What causes you to fall back into old patterns?",
          "Create 'if-then' plans: 'If I break my screen time limit, then I will...'",
          "Practice self-compassion: Talk to yourself like you'd talk to a friend",
          "Reset daily: Every day is a fresh start",
          "Celebrate small wins—progress matters more than perfection"
        ]
      },
      {
        type: "scenario",
        title: "Your Commitment",
        scenario: {
          title: "A Letter to Your Future Self",
          story: "Imagine yourself 3 months from now, having successfully implemented your wellness plan. How do you feel? What's different? What are you proud of? Take a moment to write a short letter to your current self from this future perspective. What advice would your future self give you? What would they thank you for starting today?",
          reflection: "What commitment are you making to yourself as you finish this course?"
        }
      },
      {
        type: "tips",
        title: "Next Steps After This Course",
        tips: {
          title: "Keep your momentum going:",
          items: [
            "Download and use the Innerspark app for daily check-ins",
            "Join a study group or wellness community for accountability",
            "Set a 30-day review date to assess your progress",
            "Consider the Digital Wellness Ambassador program",
            "Share your journey—your story might help someone else",
            "Remember: You've already taken the most important step by completing this course"
          ]
        }
      },
      {
        type: "quiz",
        title: "Final Assessment",
        quiz: {
          question: "Which of the following is a SMART goal for digital wellness?",
          options: [
            "I will use my phone less",
            "I will never use social media again",
            "I will set a 30-minute daily limit on TikTok using the app timer for the next 2 weeks",
            "I will try to be more mindful"
          ],
          correct: 2,
          explanation: "This goal is SMART: Specific (TikTok, 30 minutes), Measurable (using app timer), Achievable (not eliminating, just limiting), Relevant (addresses screen time), and Time-bound (2 weeks). Vague goals like 'use less' or extreme goals like 'never use again' are harder to achieve."
        }
      }
    ]
  }
};

const defaultSlides = lessonSlides["1-1"];

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video": return Video;
    case "slides": return FileText;
    case "audio": return Headphones;
    case "activity": return Target;
    case "quiz": return Lightbulb;
    case "certificate": return Award;
    default: return FileText;
  }
};

// Course structure to find next lesson
const courseModules: Record<string, { id: string; lessons: string[] }[]> = {
  "digital-mental-health": [
    { id: "module-1", lessons: ["1-1", "1-2", "1-3", "1-4"] },
    { id: "module-2", lessons: ["2-1", "2-2", "2-3", "2-4", "2-5"] },
    { id: "module-3", lessons: ["3-1", "3-2", "3-3", "3-4", "3-5"] },
    { id: "module-4", lessons: ["4-1", "4-2", "4-3", "4-4", "4-5"] },
    { id: "module-5", lessons: ["5-1", "5-2", "5-3", "5-4", "5-5"] },
    { id: "module-6", lessons: ["6-1", "6-2", "6-3", "6-4", "6-5"] },
    { id: "module-7", lessons: ["7-1", "7-2", "7-3", "7-4", "7-5"] },
    { id: "module-8", lessons: ["8-1", "8-2", "8-3", "8-4"] }
  ],
  "stress-academic-pressure": [
    { id: "module-1", lessons: ["1-1", "1-2", "1-3", "1-4"] },
    { id: "module-2", lessons: ["2-1", "2-2", "2-3", "2-4"] },
    { id: "module-3", lessons: ["3-1", "3-2", "3-3", "3-4", "3-5"] },
    { id: "module-4", lessons: ["4-1", "4-2", "4-3", "4-4", "4-5", "4-6"] }
  ],
  "wellness-ambassador": [
    { id: "module-1", lessons: ["1-1", "1-2", "1-3", "1-4"] },
    { id: "module-2", lessons: ["2-1", "2-2", "2-3", "2-4", "2-5"] },
    { id: "module-3", lessons: ["3-1", "3-2", "3-3", "3-4", "3-5"] },
    { id: "module-4", lessons: ["4-1", "4-2", "4-3", "4-4", "4-5"] },
    { id: "module-5", lessons: ["5-1", "5-2", "5-3", "5-4", "5-5"] }
  ]
};

// Lesson metadata for modal display
const lessonMeta: Record<string, { title: string; type: string; duration: string }> = {
  "1-1": { title: "What is Digital Mental Health?", type: "video", duration: "15 min" },
  "1-2": { title: "The Digital Age & Your Mind", type: "slides", duration: "20 min" },
  "1-3": { title: "Self-Assessment: Your Digital Habits", type: "activity", duration: "10 min" },
  "1-4": { title: "Module 1 Quiz", type: "quiz", duration: "10 min" },
  "2-1": { title: "Understanding Information Overload", type: "video", duration: "20 min" },
  "2-2": { title: "Signs of Digital Burnout", type: "slides", duration: "15 min" },
  "2-3": { title: "Real Student Stories: Burnout Recovery", type: "video", duration: "25 min" },
  "2-4": { title: "Reflection: Your Burnout Risk", type: "activity", duration: "15 min" },
  "2-5": { title: "Module 2 Quiz", type: "quiz", duration: "10 min" },
  "3-1": { title: "How Social Media Affects Your Brain", type: "video", duration: "20 min" },
  "3-2": { title: "Comparison Culture & Self-Esteem", type: "slides", duration: "20 min" },
  "3-3": { title: "Building a Healthier Feed", type: "activity", duration: "15 min" },
  "3-4": { title: "Digital Detox Strategies", type: "slides", duration: "20 min" },
  "3-5": { title: "Module 3 Quiz", type: "quiz", duration: "10 min" },
  "4-1": { title: "Understanding Stress & Anxiety", type: "video", duration: "20 min" },
  "4-2": { title: "Academic Pressure in the Digital Age", type: "slides", duration: "15 min" },
  "4-3": { title: "Coping Strategies That Work", type: "video", duration: "25 min" },
  "4-4": { title: "Guided Relaxation Exercise", type: "audio", duration: "15 min" },
  "4-5": { title: "Module 4 Quiz", type: "quiz", duration: "10 min" },
  "5-1": { title: "Setting Boundaries with Technology", type: "video", duration: "20 min" },
  "5-2": { title: "Sleep & Screen Time", type: "slides", duration: "15 min" },
  "5-3": { title: "Mindful Technology Use", type: "slides", duration: "20 min" },
  "5-4": { title: "Creating Your Screen-Time Plan", type: "activity", duration: "20 min" },
  "5-5": { title: "Module 5 Quiz", type: "quiz", duration: "10 min" },
  "6-1": { title: "What is Emotional Intelligence?", type: "video", duration: "20 min" },
  "6-2": { title: "Self-Awareness & Self-Regulation", type: "slides", duration: "20 min" },
  "6-3": { title: "Building a Self-Care Routine", type: "video", duration: "25 min" },
  "6-4": { title: "Mindfulness Exercise", type: "audio", duration: "15 min" },
  "6-5": { title: "Module 6 Quiz", type: "quiz", duration: "10 min" },
  "7-1": { title: "Recognizing When You Need Help", type: "video", duration: "15 min" },
  "7-2": { title: "Mental Health Resources in Africa", type: "slides", duration: "20 min" },
  "7-3": { title: "How to Support a Friend", type: "video", duration: "20 min" },
  "7-4": { title: "Starting the Conversation", type: "activity", duration: "15 min" },
  "7-5": { title: "Module 7 Quiz", type: "quiz", duration: "10 min" },
  "8-1": { title: "Course Review & Key Takeaways", type: "video", duration: "20 min" },
  "8-2": { title: "Creating Your Wellness Plan", type: "activity", duration: "30 min" },
  "8-3": { title: "Final Assessment", type: "quiz", duration: "30 min" },
  "8-4": { title: "Get Your Certificate", type: "certificate", duration: "5 min" }
};

const moduleNames: Record<string, string> = {
  "module-1": "Introduction to Digital Mental Health",
  "module-2": "Digital Overload & Burnout",
  "module-3": "Social Media & Emotional Wellbeing",
  "module-4": "Stress, Anxiety & Academic Pressure",
  "module-5": "Healthy Screen-Time & Digital Habits",
  "module-6": "Emotional Intelligence & Self-Care",
  "module-7": "Seeking Help & Supporting Others",
  "module-8": "Final Reflection & Personal Wellness Plan"
};

const LessonViewer = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateLessonProgress, getLessonProgress, enrollInCourse, isEnrolled } = useLearningProgress(courseId);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showNextLessonModal, setShowNextLessonModal] = useState(false);
  const [nextLessonInfo, setNextLessonInfo] = useState<{
    moduleId: string;
    lessonId: string;
    isNewModule: boolean;
  } | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for workplace course slides first, then original slides
  const workplaceLesson = lessonId ? allWorkplaceSlides[lessonId] : null;
  const originalLesson = lessonId && lessonSlides[lessonId] ? lessonSlides[lessonId] : null;
  const lessonData = workplaceLesson || originalLesson || defaultSlides;
  const slides = lessonData.slides;
  const totalSlides = slides.length;
  const progress = Math.round(((currentSlide + 1) / totalSlides) * 100);

  // Get course modules - check workplace courses first
  const getModulesForCourse = () => {
    if (courseId && workplaceCourseModules[courseId]) {
      return workplaceCourseModules[courseId];
    }
    return courseId && courseModules[courseId] ? courseModules[courseId] : [];
  };

  // Find next lesson in course
  const getNextLesson = () => {
    if (!courseId || !moduleId || !lessonId) return null;
    
    const modules = courseModules[courseId];
    if (!modules) return null;
    
    for (let mi = 0; mi < modules.length; mi++) {
      const module = modules[mi];
      const lessonIndex = module.lessons.indexOf(lessonId);
      
      if (lessonIndex !== -1) {
        // Found current lesson
        if (lessonIndex < module.lessons.length - 1) {
          // Next lesson in same module
          return { moduleId: module.id, lessonId: module.lessons[lessonIndex + 1] };
        } else if (mi < modules.length - 1) {
          // First lesson of next module
          const nextModule = modules[mi + 1];
          return { moduleId: nextModule.id, lessonId: nextModule.lessons[0] };
        }
      }
    }
    
    return null; // Course completed
  };

  // Load saved progress on mount
  useEffect(() => {
    if (user && courseId && moduleId && lessonId) {
      const savedProgress = getLessonProgress(moduleId, lessonId);
      if (savedProgress && savedProgress.last_slide > 0) {
        setCurrentSlide(savedProgress.last_slide);
      }
    }
  }, [user, courseId, moduleId, lessonId, getLessonProgress]);

  // Debounced save progress when slide changes (saves after 500ms of no changes)
  useEffect(() => {
    if (user && courseId && moduleId && lessonId && currentSlide > 0) {
      // Clear any pending save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Schedule a save after 500ms
      saveTimeoutRef.current = setTimeout(() => {
        updateLessonProgress(courseId, moduleId, lessonId, currentSlide, false);
      }, 500);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentSlide, user, courseId, moduleId, lessonId]);

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const checkAnswer = () => {
    setShowResult(true);
    const slide = slides[currentSlide];
    if (slide.type === 'quiz' && slide.quiz && selectedAnswer === slide.quiz.correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleCompleteLesson = async () => {
    if (user && courseId && moduleId && lessonId) {
      await updateLessonProgress(courseId, moduleId, lessonId, currentSlide, true, quizScore);
    }
    
    // Find next lesson and show modal
    const next = getNextLesson();
    if (next) {
      const isNewModule = next.moduleId !== moduleId;
      setNextLessonInfo({
        moduleId: next.moduleId,
        lessonId: next.lessonId,
        isNewModule
      });
      setShowNextLessonModal(true);
    } else {
      // Course completed
      setNextLessonInfo(null);
      setShowNextLessonModal(true);
    }
  };

  const getNextLessonDetails = () => {
    if (!nextLessonInfo) return null;
    const meta = lessonMeta[nextLessonInfo.lessonId];
    if (!meta) return null;
    return {
      title: meta.title,
      type: meta.type,
      duration: meta.duration,
      moduleTitle: moduleNames[nextLessonInfo.moduleId] || nextLessonInfo.moduleId,
      isNewModule: nextLessonInfo.isNewModule
    };
  };

  const renderSlideContent = () => {
    const slide = slides[currentSlide];

    switch (slide.type) {
      case "title":
        return (
          <div className="flex flex-col items-center justify-center text-center h-full py-12">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Innerspark Learning
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-xl text-primary mb-8">{slide.subtitle}</p>
            )}
            {slide.content && (
              <div className="text-left bg-muted/50 rounded-xl p-6 max-w-xl">
                {slide.content.map((line, i) => (
                  <p key={i} className={`${i === 0 ? "font-medium mb-2" : "text-muted-foreground"}`}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        );

      case "content":
        return (
          <div className="py-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{slide.title}</h2>
            {slide.image && (
              <img src={slide.image} alt="" className="w-full h-48 md:h-64 object-cover rounded-xl mb-6" />
            )}
            <ul className="space-y-4">
              {slide.bullets?.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "scenario":
        return (
          <div className="py-8">
            <Badge className="mb-4 bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
              Real Student Story
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{slide.scenario?.title}</h2>
            <div className="bg-muted rounded-xl p-6 mb-6">
              <p className="text-lg leading-relaxed">{slide.scenario?.story}</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
              <p className="font-medium text-primary mb-2">Reflection Question:</p>
              <p className="text-lg">{slide.scenario?.reflection}</p>
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="py-8">
            <Badge className="mb-4 bg-teal-calm/10 text-teal-700 border-teal-calm/20">
              <Target className="w-4 h-4 mr-2" />
              Activity
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{slide.title}</h2>
            <p className="text-lg text-muted-foreground mb-6">{slide.activity?.instruction}</p>
            <div className="space-y-4">
              {slide.activity?.prompts.map((prompt, i) => (
                <div key={i} className="bg-muted rounded-xl p-4 flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-lg">{prompt}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "tips":
        return (
          <div className="py-8">
            <Badge className="mb-4 bg-green-wellness/10 text-green-700 border-green-wellness/30">
              <Lightbulb className="w-4 h-4 mr-2" />
              Key Takeaways
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{slide.title}</h2>
            <p className="text-muted-foreground mb-6">{slide.tips?.title}</p>
            <div className="space-y-3">
              {slide.tips?.items.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 bg-green-wellness/5 rounded-lg p-4 border border-green-wellness/20">
                  <CheckCircle2 className="w-5 h-5 text-green-wellness flex-shrink-0 mt-0.5" />
                  <p className="text-lg">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "quiz":
        const quiz = slide.quiz!;
        const isCorrect = selectedAnswer === quiz.correct;
        return (
          <div className="py-8">
            <Badge className="mb-4 bg-purple-deep/10 text-purple-700 border-purple-deep/30">
              <Lightbulb className="w-4 h-4 mr-2" />
              Knowledge Check
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{quiz.question}</h2>
            <RadioGroup 
              value={selectedAnswer?.toString()} 
              onValueChange={(val) => !showResult && setSelectedAnswer(parseInt(val))}
              className="space-y-3"
            >
              {quiz.options.map((option, i) => {
                let optionClass = "border-border hover:border-primary/50";
                if (showResult) {
                  if (i === quiz.correct) {
                    optionClass = "border-green-wellness bg-green-wellness/10";
                  } else if (i === selectedAnswer) {
                    optionClass = "border-destructive bg-destructive/10";
                  }
                } else if (selectedAnswer === i) {
                  optionClass = "border-primary bg-primary/5";
                }
                
                return (
                  <div key={i} className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${optionClass}`}>
                    <RadioGroupItem value={i.toString()} id={`option-${i}`} disabled={showResult} />
                    <Label htmlFor={`option-${i}`} className="text-lg cursor-pointer flex-1">
                      {option}
                    </Label>
                    {showResult && i === quiz.correct && (
                      <CheckCircle2 className="w-5 h-5 text-green-wellness" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>
            
            {!showResult && selectedAnswer !== null && (
              <Button onClick={checkAnswer} className="mt-6">
                Check Answer
              </Button>
            )}
            
            {showResult && (
              <div className={`mt-6 p-4 rounded-xl ${isCorrect ? "bg-green-wellness/10 border border-green-wellness/30" : "bg-yellow-500/10 border border-yellow-500/30"}`}>
                <p className={`font-medium ${isCorrect ? "text-green-700" : "text-yellow-700"}`}>
                  {isCorrect ? "✓ Correct!" : "Not quite right"}
                </p>
                <p className="mt-2 text-muted-foreground">{quiz.explanation}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{lessonData.title} | Innerspark Learning</title>
      </Helmet>

      {/* Minimal Header */}
      <header className="bg-background border-b border-border px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link to={`/learning/${courseId}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Course</span>
            </Link>
          </div>
          
          <div className="flex-1 mx-4 max-w-md">
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-2" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {currentSlide + 1}/{totalSlides}
              </span>
            </div>
          </div>

          <Link to="/learning">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Learning Hub</span>
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Hidden on mobile by default */}
        <aside className={`fixed md:static left-0 top-[57px] h-[calc(100vh-57px)] w-72 bg-muted/30 border-r border-border overflow-y-auto z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <div className="p-4">
            <h2 className="font-semibold text-sm text-muted-foreground mb-4">Lesson Content</h2>
            <nav className="space-y-2">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setSelectedAnswer(null);
                    setShowResult(false);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                    currentSlide === index 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="flex-1 line-clamp-1">
                    {slide.title || slide.type.charAt(0).toUpperCase() + slide.type.slice(1)}
                  </span>
                  {index < currentSlide && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </button>
              ))}
            </nav>

            {/* Resources Section */}
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">Resources</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg text-sm bg-muted hover:bg-muted/80 transition-colors flex items-center gap-3">
                  <Download className="w-4 h-4 text-primary" />
                  Download Slides (PDF)
                </button>
                <button className="w-full text-left p-3 rounded-lg text-sm bg-muted hover:bg-muted/80 transition-colors flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary" />
                  Worksheet
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <Card className="min-h-[60vh]">
              <CardContent className="p-6 md:p-8">
                {renderSlideContent()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={goToPrevSlide}
                disabled={currentSlide === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              {currentSlide === totalSlides - 1 ? (
                <Button onClick={handleCompleteLesson} className="gap-2">
                  Complete Lesson
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={goToNextSlide} className="gap-2">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Sign in prompt for non-authenticated users */}
            {!user && (
              <div className="mt-6 p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Sign in to save your progress and earn certificates
                </p>
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Next Lesson Modal */}
      <NextLessonModal
        open={showNextLessonModal}
        onOpenChange={(open) => {
          setShowNextLessonModal(open);
          if (!open && !nextLessonInfo) {
            // Course completed, navigate to certificate
            navigate(`/learning/${courseId}/certificate`);
          } else if (!open) {
            // User closed modal without continuing, go back to course
            navigate(`/learning/${courseId}`);
          }
        }}
        currentLessonTitle={lessonData.title}
        nextLesson={getNextLessonDetails()}
        courseId={courseId || ''}
        nextModuleId={nextLessonInfo?.moduleId || ''}
        nextLessonId={nextLessonInfo?.lessonId || ''}
        isCourseComplete={!nextLessonInfo}
      />
    </div>
  );
};

export default LessonViewer;