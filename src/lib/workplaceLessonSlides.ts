// Lesson slide content for workplace mental health courses
// One complete sample course from each track

export interface LessonSlide {
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
}

export interface LessonContent {
  title: string;
  slides: LessonSlide[];
}

// =====================================================
// TRACK A: TRANSITIONING TO WORK
// Course: Mental Health Awareness & Self-Care
// =====================================================

export const transitionToWorkSlides: Record<string, LessonContent> = {
  // Module 1: Understanding Mental Health & Wellbeing
  "mhasc-1-1": {
    title: "What is Mental Health?",
    slides: [
      {
        type: "title",
        title: "Module 1: Understanding Mental Health & Wellbeing",
        subtitle: "Lesson 1: What is Mental Health?",
        content: ["By the end of this lesson, you will:", "• Define mental health and its components", "• Understand the mental health continuum", "• Recognize that mental health affects everyone"]
      },
      {
        type: "content",
        title: "Defining Mental Health",
        bullets: [
          "Mental health is a state of wellbeing where you can realize your potential, cope with normal stresses, work productively, and contribute to your community",
          "It's not just the absence of mental illness—it's about thriving",
          "Mental health affects how we think, feel, and act",
          "It influences how we handle stress, relate to others, and make decisions",
          "Mental health is important at every stage of life, including the transition to work"
        ],
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=400&fit=crop"
      },
      {
        type: "content",
        title: "The Mental Health Continuum",
        bullets: [
          "Mental health exists on a spectrum—we all move along it throughout our lives",
          "On one end: Thriving (high wellbeing, good coping, positive relationships)",
          "In the middle: Surviving (managing, some struggles, getting by)",
          "On the other end: Struggling (difficulty coping, persistent problems)",
          "Where you are can change based on circumstances, support, and self-care",
          "Moving toward thriving is always possible with the right tools"
        ]
      },
      {
        type: "scenario",
        title: "Real Story: Starting a New Job in Kampala",
        scenario: {
          title: "Amara's First Week",
          story: "Amara just graduated from Makerere University and started her first job at an accounting firm. She was excited but also terrified. The first week, she barely slept, worried constantly about making mistakes, and felt like everyone else knew what they were doing except her. By Friday, she was exhausted and questioned if she was cut out for professional life. Her older cousin, who works in HR, noticed and told her: 'What you're feeling is completely normal. Every new graduate goes through this. It's not a sign you're not good enough—it's a sign you care.'",
          reflection: "Have you or someone you know felt this way when starting something new? How did it affect your mental state?"
        }
      },
      {
        type: "activity",
        title: "Self-Reflection: Your Current State",
        activity: {
          instruction: "Think about where you are on the mental health continuum right now:",
          prompts: [
            "On a scale of 1-10, how would you rate your overall mental wellbeing today?",
            "What factors are currently helping you thrive?",
            "What challenges are you facing that affect your mental health?",
            "What's one thing that usually helps you feel better when you're struggling?",
            "Who in your life do you turn to for support?"
          ]
        }
      },
      {
        type: "tips",
        title: "Key Takeaways",
        tips: {
          title: "Remember these points about mental health:",
          items: [
            "Mental health is about overall wellbeing, not just avoiding illness",
            "Everyone has mental health—it's as important as physical health",
            "Your mental health can change; where you are now isn't permanent",
            "Early career transitions are a common time for mental health challenges",
            "Awareness is the first step to maintaining good mental health",
            "Seeking support is a sign of strength, not weakness"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "Which statement BEST describes mental health?",
          options: [
            "Mental health means not having any mental illness",
            "Mental health is only important when you're feeling bad",
            "Mental health is a state of wellbeing that affects how we think, feel, and cope",
            "Mental health only matters for people with diagnosed conditions"
          ],
          correct: 2,
          explanation: "Mental health is a positive state of wellbeing that encompasses how we think, feel, and act. It's not just about avoiding illness—it's about thriving and functioning well in daily life."
        }
      }
    ]
  },
  "mhasc-1-2": {
    title: "The Mental Health Continuum",
    slides: [
      {
        type: "title",
        title: "The Mental Health Continuum",
        subtitle: "Understanding where you are and how to move toward thriving",
        content: ["In this lesson:", "• Explore the mental health continuum in depth", "• Learn signs of different states", "• Discover strategies for moving toward wellness"]
      },
      {
        type: "content",
        title: "The Four Zones of Mental Health",
        bullets: [
          "GREEN ZONE (Thriving): Good energy, clear thinking, healthy relationships, resilient under stress",
          "YELLOW ZONE (Surviving): Some bad days, manageable stress, slightly reduced function",
          "ORANGE ZONE (Struggling): Persistent low mood, difficulty concentrating, withdrawing from others",
          "RED ZONE (In Crisis): Unable to function, overwhelming distress, may need professional help",
          "Everyone moves between zones—awareness helps you act early"
        ]
      },
      {
        type: "content",
        title: "Signs You Might Be Moving Toward Struggling",
        bullets: [
          "Physical: Sleep changes, fatigue, headaches, appetite changes",
          "Emotional: Persistent worry, irritability, feeling hopeless, mood swings",
          "Behavioral: Withdrawing from friends, missing deadlines, increased substance use",
          "Cognitive: Difficulty concentrating, negative self-talk, racing thoughts",
          "These are warning signs—not weaknesses. They're your mind telling you something needs attention"
        ]
      },
      {
        type: "scenario",
        title: "Real Story: Recognizing the Signs",
        scenario: {
          title: "David's Wake-Up Call",
          story: "David was three months into his internship at a Nairobi tech startup. He was working 12-hour days, skipping lunch, and rarely seeing his friends. He thought he was being dedicated, but his family noticed he'd become irritable and wasn't sleeping well. When he snapped at his sister during a phone call, he realized something was wrong. He was in the yellow zone heading toward orange, and didn't even notice it happening.",
          reflection: "What warning signs do you notice in yourself when you're stressed? Who in your life might notice before you do?"
        }
      },
      {
        type: "activity",
        title: "Your Personal Warning Signs",
        activity: {
          instruction: "Identify your early warning signs for each category:",
          prompts: [
            "Physical: What happens to your body when stress builds? (e.g., tension, sleep issues)",
            "Emotional: What emotions show up first? (e.g., anxiety, irritability, sadness)",
            "Behavioral: What habits change? (e.g., eating, social life, exercise)",
            "Cognitive: What changes in your thinking? (e.g., negative thoughts, trouble focusing)",
            "Who would you trust to tell you if they noticed these signs?"
          ]
        }
      },
      {
        type: "tips",
        title: "Moving Toward Green",
        tips: {
          title: "Strategies to improve your mental health zone:",
          items: [
            "Regular check-ins: Ask yourself 'How am I really doing?' daily",
            "Basic needs: Prioritize sleep, nutrition, movement, and connection",
            "Boundaries: Learn to say no before you're overwhelmed",
            "Support: Build relationships where you can be honest",
            "Professional help: Reach out early if warning signs persist",
            "Self-compassion: Treat yourself as you'd treat a good friend"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What should you do when you notice early warning signs of stress?",
          options: [
            "Ignore them—they'll go away on their own",
            "Wait until things get really bad before taking action",
            "Take action early—these are signals that something needs attention",
            "Keep pushing through until the project is done"
          ],
          correct: 2,
          explanation: "Early warning signs are your mind and body's way of telling you something needs to change. Acting early—before you're in crisis—is much easier and more effective than waiting until things get severe."
        }
      }
    ]
  },
  "mhasc-1-3": {
    title: "Self-Assessment: Your Current Wellbeing",
    slides: [
      {
        type: "title",
        title: "Self-Assessment: Your Current Wellbeing",
        subtitle: "Taking stock of where you are right now",
        content: ["In this activity:", "• Complete a comprehensive wellbeing assessment", "• Identify your strengths and areas for growth", "• Set intentions for this course"]
      },
      {
        type: "content",
        title: "Why Self-Assessment Matters",
        bullets: [
          "You can't improve what you don't measure",
          "Self-awareness is the foundation of mental health",
          "Understanding your baseline helps you notice changes",
          "Assessment isn't about judgment—it's about understanding",
          "This is your starting point; you'll check in again at the end"
        ]
      },
      {
        type: "activity",
        title: "Comprehensive Wellbeing Check",
        activity: {
          instruction: "Rate each area from 1 (struggling) to 5 (thriving):",
          prompts: [
            "Sleep Quality: Am I getting enough restful sleep?",
            "Energy Levels: Do I have the energy to do what I need to do?",
            "Emotional State: Am I generally feeling positive or negative?",
            "Relationships: Do I feel connected to others?",
            "Work/Study: Am I able to focus and be productive?",
            "Self-Care: Am I taking care of my basic needs?",
            "Stress Levels: Am I managing stress effectively?",
            "Hope for the Future: Do I feel optimistic about what's ahead?"
          ]
        }
      },
      {
        type: "tips",
        title: "Your Assessment Insights",
        tips: {
          title: "What your scores might tell you:",
          items: [
            "Areas scoring 4-5: These are your strengths—keep nurturing them",
            "Areas scoring 3: Watch these—they could go either way",
            "Areas scoring 1-2: These need attention—focus your self-care here",
            "Look for patterns: Are physical and emotional areas connected?",
            "No judgment: This is information, not a grade",
            "Progress matters: Even small improvements are significant"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What is the main purpose of a wellbeing self-assessment?",
          options: [
            "To prove that you're not struggling",
            "To diagnose mental health conditions",
            "To understand your current state and identify areas for growth",
            "To compare yourself to others"
          ],
          correct: 2,
          explanation: "Self-assessments help you understand where you are right now, identify strengths to build on, and spot areas that need attention. They're tools for self-awareness, not diagnosis or comparison."
        }
      }
    ]
  },
  "mhasc-1-4": {
    title: "Module 1 Quiz",
    slides: [
      {
        type: "title",
        title: "Module 1 Quiz",
        subtitle: "Test your understanding of mental health fundamentals",
        content: ["This quiz covers:", "• Mental health definitions", "• The mental health continuum", "• Warning signs and self-awareness"]
      },
      {
        type: "quiz",
        title: "Question 1",
        quiz: {
          question: "Mental health is BEST described as:",
          options: [
            "The absence of mental illness",
            "A fixed state that doesn't change",
            "A state of wellbeing affecting how we think, feel, and cope",
            "Something only relevant when you have a diagnosis"
          ],
          correct: 2,
          explanation: "Mental health is a positive state of wellbeing that encompasses all aspects of how we function—thinking, feeling, and coping with life's challenges."
        }
      },
      {
        type: "quiz",
        title: "Question 2",
        quiz: {
          question: "According to the mental health continuum model, which statement is TRUE?",
          options: [
            "Once you're in a certain zone, you stay there permanently",
            "Only people with mental illness move between zones",
            "Everyone moves between zones throughout their life",
            "The zones only apply to young professionals"
          ],
          correct: 2,
          explanation: "The mental health continuum recognizes that everyone's mental health fluctuates. We all move between thriving, surviving, and struggling based on circumstances, support, and self-care."
        }
      },
      {
        type: "quiz",
        title: "Question 3",
        quiz: {
          question: "Which is an early warning sign that mental health might be declining?",
          options: [
            "Feeling tired after a long day at work",
            "Persistent changes in sleep, mood, and behavior over several weeks",
            "Feeling nervous before a job interview",
            "Having one bad day"
          ],
          correct: 1,
          explanation: "Early warning signs are persistent patterns—not single incidents. Changes that last for weeks across multiple areas (sleep, mood, behavior) suggest your mental health needs attention."
        }
      }
    ]
  }
};

// =====================================================
// TRACK B: WORKPLACE MENTAL HEALTH
// Course: Workplace Mental Health Fundamentals
// =====================================================

export const workplaceMentalHealthSlides: Record<string, LessonContent> = {
  // Module 1: Mental Health in the Modern Workplace
  "wmhf-1-1": {
    title: "Why Workplace Mental Health Matters",
    slides: [
      {
        type: "title",
        title: "Module 1: Mental Health in the Modern Workplace",
        subtitle: "Lesson 1: Why Workplace Mental Health Matters",
        content: ["By the end of this lesson, you will:", "• Understand the scope of workplace mental health", "• Recognize how work affects mental health", "• Know the business case for mental health support"]
      },
      {
        type: "content",
        title: "The State of Workplace Mental Health",
        bullets: [
          "1 in 5 adults experience mental health challenges in any given year",
          "60% of employees have experienced mental health symptoms in the past year",
          "Work is both a protective factor AND a risk factor for mental health",
          "The COVID-19 pandemic significantly increased workplace mental health concerns",
          "In Africa, stigma often prevents people from seeking help at work"
        ],
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop"
      },
      {
        type: "content",
        title: "How Work Affects Mental Health",
        bullets: [
          "POSITIVE: Purpose, social connection, structure, financial security, achievement",
          "NEGATIVE: Excessive demands, lack of control, poor relationships, job insecurity",
          "Work-life balance impacts overall wellbeing",
          "Toxic workplace cultures increase mental health risks",
          "Supportive workplaces protect and promote mental health",
          "Your work environment matters as much as your workload"
        ]
      },
      {
        type: "scenario",
        title: "Real Workplace Story",
        scenario: {
          title: "Grace's Team Transformation",
          story: "Grace managed a customer service team at a bank in Accra. She noticed her team was stressed—high turnover, many sick days, low morale. Instead of pushing harder, she asked: 'What's making work difficult?' She learned about unrealistic targets, rude customers, and no breaks. She advocated for changes: realistic goals, break rooms, and training on handling difficult calls. Within months, sick days dropped 40%, and customer satisfaction improved. Taking mental health seriously wasn't just good for people—it was good for business.",
          reflection: "What aspects of work environments have you seen that either support or harm mental health?"
        }
      },
      {
        type: "content",
        title: "The Business Case for Mental Health",
        bullets: [
          "Mental health challenges cost businesses in Africa billions annually",
          "For every $1 invested in mental health, there's a $4 return in productivity",
          "High turnover from burnout is expensive—replacing staff costs 50-200% of salary",
          "Teams with good mental health support are more innovative and collaborative",
          "Companies known for wellbeing attract better talent",
          "Legal requirements are increasing—many countries now mandate workplace mental health"
        ]
      },
      {
        type: "tips",
        title: "Key Takeaways",
        tips: {
          title: "Remember about workplace mental health:",
          items: [
            "Mental health at work affects everyone, not just those with diagnoses",
            "Work can either protect or harm your mental health",
            "Creating supportive environments benefits both people and organizations",
            "Speaking up about mental health helps reduce stigma",
            "You have a role to play regardless of your position",
            "Small changes in workplace culture can have big impacts"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "According to research, investing $1 in workplace mental health typically returns:",
          options: [
            "Less than $1—it's not a good investment",
            "$4 in improved productivity and reduced costs",
            "The same $1—it's cost-neutral",
            "Results can't be measured"
          ],
          correct: 1,
          explanation: "Multiple studies show that investing in workplace mental health typically returns about $4 for every $1 spent through reduced absenteeism, lower turnover, and improved productivity."
        }
      }
    ]
  },
  "wmhf-1-2": {
    title: "The Business Case for Mental Health",
    slides: [
      {
        type: "title",
        title: "The Business Case for Mental Health",
        subtitle: "Understanding the return on wellbeing investment",
        content: ["In this lesson:", "• Explore the costs of poor mental health at work", "• Understand productivity and engagement impacts", "• Learn how to make the case for mental health initiatives"]
      },
      {
        type: "content",
        title: "The Hidden Costs of Poor Mental Health",
        bullets: [
          "Absenteeism: Days lost to mental health conditions",
          "Presenteeism: Being at work but not fully functioning (costs more than absenteeism!)",
          "Turnover: Replacing employees is expensive and disruptive",
          "Errors & accidents: Stressed, distracted workers make more mistakes",
          "Conflict: Poor mental health increases workplace tension",
          "Healthcare costs: Mental health conditions increase overall health spending"
        ]
      },
      {
        type: "content",
        title: "The Productivity Connection",
        bullets: [
          "Employees struggling with mental health are 4x more likely to miss work",
          "Depression alone costs 200 million lost workdays annually globally",
          "Anxiety reduces concentration and decision-making ability",
          "Burnout leads to disengagement before people actually leave",
          "Teams with high wellbeing outperform teams with low wellbeing by 21%"
        ]
      },
      {
        type: "scenario",
        title: "Real Story: Making the Case",
        scenario: {
          title: "James Convinces Leadership",
          story: "James, an HR manager at a manufacturing company in Lagos, wanted to start a mental health program but leadership said 'we can't afford it.' He gathered data: last year, 15% of sick days were stress-related, turnover was costing ₦50 million, and productivity surveys showed declining engagement. He calculated that a ₦5 million investment in wellbeing programs could save ₦20 million. The CEO approved the pilot program, and one year later, the results exceeded projections.",
          reflection: "What data would be most convincing to leadership in your organization?"
        }
      },
      {
        type: "activity",
        title: "Assess Your Workplace",
        activity: {
          instruction: "Think about the mental health indicators in your current or recent workplace:",
          prompts: [
            "How often do people call in sick or seem unwell at work?",
            "What's the turnover rate? Do people leave burned out?",
            "How would you rate overall team morale and engagement?",
            "Are there visible signs of stress (conflict, missed deadlines, complaints)?",
            "What supports currently exist for mental health?"
          ]
        }
      },
      {
        type: "tips",
        title: "Making the Business Case",
        tips: {
          title: "How to advocate for workplace mental health:",
          items: [
            "Gather data: Track absenteeism, turnover, and engagement",
            "Calculate costs: Put a number on the problem",
            "Benchmark: What are similar organizations doing?",
            "Start small: Pilot programs reduce risk",
            "Measure outcomes: Track the impact of changes",
            "Tell stories: Data + personal stories = compelling case"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What is 'presenteeism' and why does it matter?",
          options: [
            "Being present at meetings—it improves collaboration",
            "Being physically at work but not functioning well—it costs more than absenteeism",
            "Having good attendance—it's a sign of dedication",
            "Presenting to leadership—it builds visibility"
          ],
          correct: 1,
          explanation: "Presenteeism refers to being physically present at work but not fully productive due to illness or distress. Research shows presenteeism costs organizations more than absenteeism because it's harder to see and affects performance over extended periods."
        }
      }
    ]
  },
  "wmhf-1-3": {
    title: "Your Workplace Assessment",
    slides: [
      {
        type: "title",
        title: "Your Workplace Assessment",
        subtitle: "Evaluating your work environment's impact on mental health",
        content: ["In this activity:", "• Assess your workplace's mental health culture", "• Identify strengths and areas for improvement", "• Plan actions you can take"]
      },
      {
        type: "activity",
        title: "Workplace Culture Assessment",
        activity: {
          instruction: "Rate each statement from 1 (strongly disagree) to 5 (strongly agree):",
          prompts: [
            "I feel comfortable discussing stress or struggles with my manager",
            "There are clear channels to seek mental health support at work",
            "Workloads are generally reasonable and manageable",
            "Work-life balance is respected and encouraged",
            "Leaders model healthy behaviors (taking breaks, using leave)",
            "Mental health is treated with the same importance as physical health",
            "I feel psychologically safe to make mistakes without harsh judgment",
            "There's flexibility to manage personal and work demands"
          ]
        }
      },
      {
        type: "tips",
        title: "Interpreting Your Assessment",
        tips: {
          title: "What your scores mean:",
          items: [
            "Scores of 4-5: Strengths to maintain and share",
            "Scores of 3: Areas with potential for improvement",
            "Scores of 1-2: Areas needing attention",
            "Multiple low scores: Systemic issues may need addressing",
            "This is your experience—others may experience the same workplace differently"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "Why is it important to assess your workplace's mental health culture?",
          options: [
            "To complain about your employer",
            "To understand how the environment affects you and identify areas for change",
            "To prove that mental health is a problem",
            "To compare with other companies"
          ],
          correct: 1,
          explanation: "Assessing workplace culture helps you understand how your environment impacts your mental health and identifies specific areas where change might help—whether personal adjustments or advocacy for broader improvements."
        }
      }
    ]
  },
  "wmhf-1-4": {
    title: "Module 1 Quiz",
    slides: [
      {
        type: "title",
        title: "Module 1 Quiz",
        subtitle: "Test your understanding of workplace mental health fundamentals",
        content: ["This quiz covers:", "• Why workplace mental health matters", "• The business case for mental health", "• Workplace culture assessment"]
      },
      {
        type: "quiz",
        title: "Question 1",
        quiz: {
          question: "Work can affect mental health by:",
          options: [
            "Only harming it through stress",
            "Only helping it through purpose and connection",
            "Both protecting and harming it depending on the environment",
            "Having no significant impact either way"
          ],
          correct: 2,
          explanation: "Work can be both protective (providing purpose, connection, structure) and harmful (through excessive stress, poor relationships, lack of control). The workplace environment determines which effect dominates."
        }
      },
      {
        type: "quiz",
        title: "Question 2",
        quiz: {
          question: "The main reason organizations should invest in workplace mental health is:",
          options: [
            "It's legally required everywhere",
            "It's the right thing to do, even if it costs money",
            "It provides significant return on investment while helping people",
            "Employees demand it before accepting jobs"
          ],
          correct: 2,
          explanation: "While doing the right thing matters, the business case is compelling: investing in mental health typically returns $4 for every $1 spent through reduced absenteeism, turnover, and improved productivity."
        }
      },
      {
        type: "quiz",
        title: "Question 3",
        quiz: {
          question: "Psychological safety in the workplace means:",
          options: [
            "Having security guards and locked doors",
            "Never experiencing any stress at work",
            "Feeling safe to take risks, make mistakes, and speak up without fear",
            "Having a completely private workspace"
          ],
          correct: 2,
          explanation: "Psychological safety is about feeling safe to be yourself, take risks, admit mistakes, and speak up without fear of punishment or humiliation. It's a key component of mentally healthy workplaces."
        }
      }
    ]
  }
};

// =====================================================
// TRACK C: LEADERSHIP & HR MENTAL HEALTH
// Course: Mental Health Leadership & People Management
// =====================================================

export const leadershipHRSlides: Record<string, LessonContent> = {
  // Module 1: Leading with Compassion
  "mhlpm-1-1": {
    title: "Compassionate Leadership Defined",
    slides: [
      {
        type: "title",
        title: "Module 1: Leading with Compassion",
        subtitle: "Lesson 1: Compassionate Leadership Defined",
        content: ["By the end of this lesson, you will:", "• Understand what compassionate leadership means", "• Recognize why it matters for mental health", "• Identify the characteristics of compassionate leaders"]
      },
      {
        type: "content",
        title: "What is Compassionate Leadership?",
        bullets: [
          "Compassionate leadership combines empathy with action",
          "It's not just understanding struggles—it's actively working to help",
          "Compassion in leadership means seeing the whole person, not just the employee",
          "It involves courage to have difficult conversations",
          "It's about creating conditions for people to thrive, not just survive",
          "Compassion is a skill that can be developed, not just a personality trait"
        ],
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop"
      },
      {
        type: "content",
        title: "The Four Elements of Compassion",
        bullets: [
          "1. AWARENESS: Noticing when someone is struggling",
          "2. EMPATHY: Understanding their experience without judgment",
          "3. CARE: Genuinely wanting to help alleviate suffering",
          "4. ACTION: Taking steps to actually help",
          "Leaders often stop at empathy—compassionate leaders take action"
        ]
      },
      {
        type: "scenario",
        title: "Real Leadership Story",
        scenario: {
          title: "Margaret's Approach",
          story: "Margaret leads a sales team in Johannesburg. When her top performer, Peter, started missing targets and looking exhausted, many leaders would have given him a warning. Instead, Margaret invited him for coffee. She learned his father was seriously ill and he was traveling hours each week to care for him. Margaret adjusted his schedule, temporarily reduced his targets, and connected him with the company's employee assistance program. Peter was back to top performance within three months—and his loyalty to Margaret and the company was stronger than ever.",
          reflection: "How would you handle a similar situation? What makes Margaret's approach compassionate?"
        }
      },
      {
        type: "content",
        title: "Why Compassion Matters for Mental Health",
        bullets: [
          "Leaders set the tone for workplace culture",
          "Employees are more likely to disclose struggles to compassionate leaders",
          "Early disclosure enables early support, preventing crisis",
          "Compassionate environments reduce stigma around mental health",
          "Trust built through compassion improves team communication",
          "Teams led compassionately have lower burnout and higher engagement"
        ]
      },
      {
        type: "tips",
        title: "Key Takeaways",
        tips: {
          title: "Remember about compassionate leadership:",
          items: [
            "Compassion = empathy + action",
            "It's about seeing the whole person, not just their performance",
            "Leaders create the conditions that help or harm mental health",
            "Compassion is a skill you can develop through practice",
            "It's not about being 'soft'—it's about being effective",
            "The most successful leaders combine results focus with genuine care"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What distinguishes compassionate leadership from empathetic leadership?",
          options: [
            "Compassion focuses only on feelings, empathy focuses on actions",
            "Compassion combines understanding with taking action to help",
            "There's no difference—they mean the same thing",
            "Empathy is for personal relationships, compassion is for work"
          ],
          correct: 1,
          explanation: "While empathy involves understanding someone's experience, compassion goes further by combining that understanding with action to help. Compassionate leaders don't just feel for their people—they act to support them."
        }
      }
    ]
  },
  "mhlpm-1-2": {
    title: "Your Leadership Style Assessment",
    slides: [
      {
        type: "title",
        title: "Your Leadership Style Assessment",
        subtitle: "Understanding your natural tendencies and growth areas",
        content: ["In this activity:", "• Assess your current leadership style", "• Identify compassionate leadership strengths", "• Discover areas for development"]
      },
      {
        type: "activity",
        title: "Compassionate Leadership Self-Assessment",
        activity: {
          instruction: "Rate each statement from 1 (rarely) to 5 (almost always):",
          prompts: [
            "I notice when team members seem stressed or struggling",
            "I make time for one-on-one conversations about wellbeing, not just tasks",
            "I ask open questions and truly listen to the answers",
            "I share my own struggles appropriately to normalize imperfection",
            "I take action to support team members facing challenges",
            "I advocate for my team's wellbeing with senior leadership",
            "I model healthy behaviors (taking breaks, using leave, setting boundaries)",
            "I create an environment where mistakes are learning opportunities"
          ]
        }
      },
      {
        type: "content",
        title: "Interpreting Your Assessment",
        bullets: [
          "Scores of 4-5: These are your compassionate leadership strengths",
          "Scores of 3: Areas with room for growth",
          "Scores of 1-2: Priority development areas",
          "No leader scores perfectly—we all have growth areas",
          "Self-awareness is itself a sign of compassionate leadership",
          "The goal is progress, not perfection"
        ]
      },
      {
        type: "tips",
        title: "Development Focus Areas",
        tips: {
          title: "Based on common leadership gaps:",
          items: [
            "If Awareness is low: Practice checking in with team members regularly",
            "If Listening is low: Use the '3 second rule'—wait 3 seconds after someone speaks",
            "If Action is low: Ask 'How can I help?' and follow through",
            "If Modeling is low: Start with one healthy behavior you can demonstrate",
            "If Advocacy is low: Bring wellbeing data to leadership conversations",
            "Choose ONE area to focus on—small steps lead to big changes"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "Why is self-assessment important for compassionate leadership?",
          options: [
            "To prove you're already a good leader",
            "To identify strengths to leverage and areas to develop",
            "To compare yourself to other leaders",
            "To create a perfect leadership style"
          ],
          correct: 1,
          explanation: "Self-assessment helps you understand your natural tendencies, leverage existing strengths, and identify specific areas where you can grow. Self-aware leaders are more effective because they can adapt and improve."
        }
      }
    ]
  },
  "mhlpm-1-3": {
    title: "Authenticity & Vulnerability in Leadership",
    slides: [
      {
        type: "title",
        title: "Authenticity & Vulnerability in Leadership",
        subtitle: "The power of being real with your team",
        content: ["In this lesson:", "• Understand the role of authenticity in leadership", "• Learn appropriate vulnerability as a leader", "• Build trust through genuine connection"]
      },
      {
        type: "content",
        title: "Why Authenticity Matters",
        bullets: [
          "Authentic leaders are more trusted and followed",
          "Pretending to have it all together creates distance from your team",
          "People can sense inauthenticity—it erodes trust",
          "When leaders are human, others feel permission to be human too",
          "Authenticity reduces the stigma around mental health struggles",
          "It creates psychological safety for honest conversations"
        ]
      },
      {
        type: "content",
        title: "Appropriate Leader Vulnerability",
        bullets: [
          "Share struggles you've processed, not current crises",
          "Focus on lessons learned, not just the difficulty",
          "Be real about challenges without overwhelming your team",
          "Maintain professionalism while being human",
          "Match vulnerability to the relationship and context",
          "The goal is connection, not sympathy"
        ]
      },
      {
        type: "scenario",
        title: "Real Story: Leader Vulnerability",
        scenario: {
          title: "CEO David's Disclosure",
          story: "David, CEO of a Kenyan fintech company, noticed his leadership team was burning out but wouldn't admit it. In a meeting, he shared: 'I want to tell you something. Five years ago, I experienced severe burnout. I couldn't sleep, I was irritable, and I almost left this industry. Getting help was the best decision I made. I share this because I see some of you heading down that path, and I want you to know it's okay to ask for help here.' The room went silent, then several leaders shared their own struggles. It transformed the team's culture.",
          reflection: "What made David's disclosure effective? What are the risks and benefits of leader vulnerability?"
        }
      },
      {
        type: "activity",
        title: "Your Authenticity Reflection",
        activity: {
          instruction: "Reflect on authenticity in your leadership:",
          prompts: [
            "What do you hide from your team that might help them if shared appropriately?",
            "When has a leader's vulnerability positively impacted you?",
            "What holds you back from being more authentic?",
            "What's one thing you could share that would model self-awareness?",
            "How can you be real without oversharing or being inappropriate?"
          ]
        }
      },
      {
        type: "tips",
        title: "Practicing Appropriate Vulnerability",
        tips: {
          title: "Guidelines for authentic leadership:",
          items: [
            "Process first: Don't share raw, unprocessed struggles",
            "Purpose matters: Share to help others, not seek support for yourself",
            "Context awareness: Not every setting is right for personal sharing",
            "Model recovery: Show how you managed challenges, not just that they happened",
            "Create reciprocity: Your vulnerability should invite others' openness",
            "Maintain boundaries: You're still the leader—balance is key"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What makes leader vulnerability appropriate and effective?",
          options: [
            "Sharing every struggle in detail to seem relatable",
            "Never sharing anything personal to maintain authority",
            "Sharing processed experiences with lessons learned to normalize struggle",
            "Only sharing when you need team support"
          ],
          correct: 2,
          explanation: "Effective leader vulnerability involves sharing experiences you've already worked through, focusing on lessons learned, with the purpose of helping others feel safe to be human. It's strategic and purposeful, not raw emotional dumping."
        }
      }
    ]
  },
  "mhlpm-1-4": {
    title: "Module 1 Quiz",
    slides: [
      {
        type: "title",
        title: "Module 1 Quiz",
        subtitle: "Test your understanding of compassionate leadership",
        content: ["This quiz covers:", "• Compassionate leadership principles", "• Self-assessment insights", "• Authenticity and vulnerability"]
      },
      {
        type: "quiz",
        title: "Question 1",
        quiz: {
          question: "The four elements of compassion in leadership are:",
          options: [
            "Planning, Executing, Monitoring, Controlling",
            "Awareness, Empathy, Care, Action",
            "Listening, Advising, Directing, Reviewing",
            "Hiring, Training, Evaluating, Terminating"
          ],
          correct: 1,
          explanation: "Compassionate leadership involves four elements: Awareness (noticing struggle), Empathy (understanding it), Care (wanting to help), and Action (actually helping). All four are necessary for true compassion."
        }
      },
      {
        type: "quiz",
        title: "Question 2",
        quiz: {
          question: "Why does leader authenticity matter for team mental health?",
          options: [
            "It shows the leader is weak and needs help",
            "It creates psychological safety and normalizes being human",
            "It makes the leader more popular with the team",
            "It's required by HR policies"
          ],
          correct: 1,
          explanation: "When leaders are authentic and appropriately vulnerable, it creates psychological safety. Team members feel they can also be human, admit struggles, and ask for help without judgment—which is essential for mental health."
        }
      },
      {
        type: "quiz",
        title: "Question 3",
        quiz: {
          question: "When sharing vulnerabilities as a leader, you should:",
          options: [
            "Share current crises to seem relatable in the moment",
            "Never share anything personal to maintain authority",
            "Share processed experiences with lessons learned",
            "Ask your team for advice on personal problems"
          ],
          correct: 2,
          explanation: "Leaders should share struggles they've already worked through, focusing on lessons learned. The purpose is to normalize imperfection and create safety, not to seek personal support from the team."
        }
      }
    ]
  }
};

// Combine all workplace slides into one export
export const allWorkplaceSlides: Record<string, LessonContent> = {
  ...transitionToWorkSlides,
  ...workplaceMentalHealthSlides,
  ...leadershipHRSlides
};

// Course module structure for navigation
export const workplaceCourseModules: Record<string, { id: string; lessons: string[] }[]> = {
  "mental-health-awareness-self-care": [
    { id: "mhasc-1", lessons: ["mhasc-1-1", "mhasc-1-2", "mhasc-1-3", "mhasc-1-4"] },
    { id: "mhasc-2", lessons: ["mhasc-2-1", "mhasc-2-2", "mhasc-2-3", "mhasc-2-4", "mhasc-2-5"] },
    { id: "mhasc-3", lessons: ["mhasc-3-1", "mhasc-3-2", "mhasc-3-3", "mhasc-3-4"] },
    { id: "mhasc-4", lessons: ["mhasc-4-1", "mhasc-4-2", "mhasc-4-3", "mhasc-4-4", "mhasc-4-5", "mhasc-4-6"] }
  ],
  "workplace-mental-health-fundamentals": [
    { id: "wmhf-1", lessons: ["wmhf-1-1", "wmhf-1-2", "wmhf-1-3", "wmhf-1-4"] },
    { id: "wmhf-2", lessons: ["wmhf-2-1", "wmhf-2-2", "wmhf-2-3", "wmhf-2-4", "wmhf-2-5"] },
    { id: "wmhf-3", lessons: ["wmhf-3-1", "wmhf-3-2", "wmhf-3-3", "wmhf-3-4", "wmhf-3-5"] },
    { id: "wmhf-4", lessons: ["wmhf-4-1", "wmhf-4-2", "wmhf-4-3", "wmhf-4-4", "wmhf-4-5"] }
  ],
  "mental-health-leadership-people-management": [
    { id: "mhlpm-1", lessons: ["mhlpm-1-1", "mhlpm-1-2", "mhlpm-1-3", "mhlpm-1-4"] },
    { id: "mhlpm-2", lessons: ["mhlpm-2-1", "mhlpm-2-2", "mhlpm-2-3", "mhlpm-2-4", "mhlpm-2-5"] },
    { id: "mhlpm-3", lessons: ["mhlpm-3-1", "mhlpm-3-2", "mhlpm-3-3", "mhlpm-3-4", "mhlpm-3-5"] },
    { id: "mhlpm-4", lessons: ["mhlpm-4-1", "mhlpm-4-2", "mhlpm-4-3", "mhlpm-4-4", "mhlpm-4-5"] }
  ]
};

// Lesson metadata for the modal
export const workplaceLessonMeta: Record<string, { title: string; type: string; duration: string }> = {
  // Mental Health Awareness & Self-Care
  "mhasc-1-1": { title: "What is Mental Health?", type: "slides", duration: "15 min" },
  "mhasc-1-2": { title: "The Mental Health Continuum", type: "video", duration: "20 min" },
  "mhasc-1-3": { title: "Self-Assessment: Your Current Wellbeing", type: "activity", duration: "15 min" },
  "mhasc-1-4": { title: "Module 1 Quiz", type: "quiz", duration: "10 min" },
  // Workplace Mental Health Fundamentals
  "wmhf-1-1": { title: "Why Workplace Mental Health Matters", type: "slides", duration: "20 min" },
  "wmhf-1-2": { title: "The Business Case for Mental Health", type: "video", duration: "15 min" },
  "wmhf-1-3": { title: "Your Workplace Assessment", type: "activity", duration: "20 min" },
  "wmhf-1-4": { title: "Module 1 Quiz", type: "quiz", duration: "10 min" },
  // Mental Health Leadership
  "mhlpm-1-1": { title: "Compassionate Leadership Defined", type: "video", duration: "25 min" },
  "mhlpm-1-2": { title: "Your Leadership Style Assessment", type: "activity", duration: "25 min" },
  "mhlpm-1-3": { title: "Authenticity & Vulnerability", type: "slides", duration: "20 min" },
  "mhlpm-1-4": { title: "Module 1 Quiz", type: "quiz", duration: "10 min" }
};

// Module names for workplace courses
export const workplaceModuleNames: Record<string, string> = {
  "mhasc-1": "Understanding Mental Health & Wellbeing",
  "mhasc-2": "Common Mental Health Challenges for Young Professionals",
  "mhasc-3": "Breaking Stigma in Professional Spaces",
  "mhasc-4": "Self-Care Basics for Busy Schedules",
  "wmhf-1": "Mental Health in the Modern Workplace",
  "wmhf-2": "Common Workplace Mental Health Conditions",
  "wmhf-3": "Recognizing Early Warning Signs",
  "wmhf-4": "Roles & Responsibilities",
  "mhlpm-1": "Leading with Compassion",
  "mhlpm-2": "Supporting Employee Wellbeing",
  "mhlpm-3": "Difficult Conversations & Check-Ins",
  "mhlpm-4": "Reducing Stigma from the Top"
};
