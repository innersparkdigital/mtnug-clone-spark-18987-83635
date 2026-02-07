import { AssessmentQuestion } from "@/components/AssessmentTestTemplate";

// Standard PHQ-style options
export const standardOptions = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" }
];

// Agree/Disagree options
export const agreeOptions = [
  { value: 0, label: "Strongly disagree" },
  { value: 1, label: "Disagree" },
  { value: 2, label: "Neutral" },
  { value: 3, label: "Agree" },
  { value: 4, label: "Strongly agree" }
];

// Standard severity calculator
export const getStandardSeverity = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage <= 20) {
    return {
      level: "Minimal" as const,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Your responses suggest minimal symptoms. Continue maintaining your mental wellness through healthy habits and self-care practices."
    };
  } else if (percentage <= 40) {
    return {
      level: "Mild" as const,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      description: "Your responses suggest mild symptoms. Consider monitoring your symptoms and implementing self-care strategies."
    };
  } else if (percentage <= 60) {
    return {
      level: "Moderate" as const,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      description: "Your responses suggest moderate symptoms. We recommend speaking with a mental health professional for further evaluation."
    };
  } else if (percentage <= 80) {
    return {
      level: "Moderately Severe" as const,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "Your responses suggest moderately severe symptoms. We strongly recommend seeking help from a mental health professional."
    };
  } else {
    return {
      level: "Severe" as const,
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      description: "Your responses suggest severe symptoms. Please reach out to a mental health professional or crisis helpline immediately."
    };
  }
};

// Sex Addiction Questions
export const sexAddictionQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you find yourself spending more time thinking about or engaging in sexual activities than you intended?", options: standardOptions },
  { id: 2, question: "Have you tried to cut down or control your sexual behavior but been unsuccessful?", options: standardOptions },
  { id: 3, question: "Do you feel restless or irritable when attempting to reduce sexual activity?", options: standardOptions },
  { id: 4, question: "Do you use sexual behavior to escape from problems or relieve negative moods?", options: standardOptions },
  { id: 5, question: "Have you continued engaging in sexual behavior despite it causing problems in your relationships?", options: standardOptions },
  { id: 6, question: "Have you put yourself in risky situations due to sexual behavior?", options: standardOptions },
  { id: 7, question: "Do you feel shame, guilt, or distress about your sexual behavior?", options: standardOptions },
  { id: 8, question: "Has your sexual behavior affected your work or daily responsibilities?", options: standardOptions },
  { id: 9, question: "Do you need more intense or frequent sexual experiences to feel satisfied?", options: standardOptions },
  { id: 10, question: "Have you hidden your sexual behavior from others?", options: standardOptions },
];

// Video Game Addiction Questions
export const videoGameAddictionQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you spend more time gaming than you originally planned?", options: standardOptions },
  { id: 2, question: "Do you feel restless, irritable, or sad when unable to play games?", options: standardOptions },
  { id: 3, question: "Do you need to spend increasing amounts of time gaming to feel satisfied?", options: standardOptions },
  { id: 4, question: "Have you lost interest in hobbies you used to enjoy before gaming?", options: standardOptions },
  { id: 5, question: "Do you continue gaming despite knowing it's causing problems in your life?", options: standardOptions },
  { id: 6, question: "Have you lied to family or friends about how much you game?", options: standardOptions },
  { id: 7, question: "Do you use gaming to escape from stress or negative feelings?", options: standardOptions },
  { id: 8, question: "Has gaming affected your sleep, eating, or physical health?", options: standardOptions },
  { id: 9, question: "Has gaming negatively affected your work, school, or relationships?", options: standardOptions },
  { id: 10, question: "Do you feel unable to stop or reduce your gaming despite wanting to?", options: standardOptions },
];

// Internet Addiction Questions
export const internetAddictionQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you spend more time online than you intended?", options: standardOptions },
  { id: 2, question: "Do you feel restless or irritable when you can't access the internet?", options: standardOptions },
  { id: 3, question: "Do you find yourself constantly checking your phone or devices?", options: standardOptions },
  { id: 4, question: "Has your internet use affected your sleep schedule?", options: standardOptions },
  { id: 5, question: "Do you prefer online interaction over face-to-face communication?", options: standardOptions },
  { id: 6, question: "Have you neglected responsibilities due to internet use?", options: standardOptions },
  { id: 7, question: "Do you use the internet to escape from problems or negative moods?", options: standardOptions },
  { id: 8, question: "Have others expressed concern about your internet use?", options: standardOptions },
  { id: 9, question: "Do you feel anxious when away from your devices?", options: standardOptions },
  { id: 10, question: "Have you tried to cut down internet use but been unsuccessful?", options: standardOptions },
];

// Job Burnout Questions
export const jobBurnoutQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you feel emotionally drained by your work?", options: standardOptions },
  { id: 2, question: "Do you feel used up at the end of the workday?", options: standardOptions },
  { id: 3, question: "Do you feel fatigued when you get up in the morning and face another day at work?", options: standardOptions },
  { id: 4, question: "Do you feel that working with people all day is a strain?", options: standardOptions },
  { id: 5, question: "Do you feel burned out from your work?", options: standardOptions },
  { id: 6, question: "Do you feel frustrated by your job?", options: standardOptions },
  { id: 7, question: "Do you feel you're working too hard at your job?", options: standardOptions },
  { id: 8, question: "Does working directly with people put too much stress on you?", options: standardOptions },
  { id: 9, question: "Do you feel at the end of your rope?", options: standardOptions },
  { id: 10, question: "Has your productivity decreased significantly?", options: standardOptions },
  { id: 11, question: "Do you feel cynical about the impact of your work?", options: standardOptions },
  { id: 12, question: "Do you doubt the significance of your work?", options: standardOptions },
];

// Toxic Workplace Questions
export const toxicWorkplaceQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you experience verbal abuse or hostility at work?", options: standardOptions },
  { id: 2, question: "Are you excluded from important meetings or decisions?", options: standardOptions },
  { id: 3, question: "Is there excessive gossip or backstabbing in your workplace?", options: standardOptions },
  { id: 4, question: "Do you feel your contributions are not recognized?", options: standardOptions },
  { id: 5, question: "Is there a lack of trust among colleagues?", options: standardOptions },
  { id: 6, question: "Do you experience unfair treatment or favoritism?", options: standardOptions },
  { id: 7, question: "Is there poor communication from management?", options: standardOptions },
  { id: 8, question: "Do you feel unsafe expressing your opinions?", options: standardOptions },
  { id: 9, question: "Is there excessive workload with unrealistic deadlines?", options: standardOptions },
  { id: 10, question: "Do you dread going to work?", options: standardOptions },
];

// Panic Disorder Questions
export const panicDisorderQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Have you experienced sudden episodes of intense fear or discomfort?", options: standardOptions },
  { id: 2, question: "During these episodes, do you experience racing or pounding heart?", options: standardOptions },
  { id: 3, question: "Do you experience sweating, trembling, or shaking during episodes?", options: standardOptions },
  { id: 4, question: "Do you experience shortness of breath or smothering sensations?", options: standardOptions },
  { id: 5, question: "Do you feel like you're choking during these episodes?", options: standardOptions },
  { id: 6, question: "Do you experience chest pain or discomfort?", options: standardOptions },
  { id: 7, question: "Do you feel dizzy, unsteady, or faint during episodes?", options: standardOptions },
  { id: 8, question: "Do you fear losing control or going crazy during episodes?", options: standardOptions },
  { id: 9, question: "Do you avoid places or situations for fear of having an attack?", options: standardOptions },
  { id: 10, question: "Do you worry about when the next attack will occur?", options: standardOptions },
];

// OCD Questions
export const ocdQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you have unwanted thoughts that keep coming back despite trying to stop them?", options: standardOptions },
  { id: 2, question: "Do you feel driven to perform certain behaviors or mental acts repeatedly?", options: standardOptions },
  { id: 3, question: "Do you spend more than an hour a day on obsessive thoughts or compulsive behaviors?", options: standardOptions },
  { id: 4, question: "Do these thoughts or behaviors cause significant distress?", options: standardOptions },
  { id: 5, question: "Do you check things repeatedly (locks, appliances, etc.)?", options: standardOptions },
  { id: 6, question: "Do you have excessive concerns about contamination or germs?", options: standardOptions },
  { id: 7, question: "Do you need things to be arranged in a particular way?", options: standardOptions },
  { id: 8, question: "Do you have intrusive thoughts about harm coming to yourself or others?", options: standardOptions },
  { id: 9, question: "Do you count, tap, or repeat actions a certain number of times?", options: standardOptions },
  { id: 10, question: "Do these behaviors interfere with your daily life?", options: standardOptions },
  { id: 11, question: "Do you feel anxious if you can't complete these behaviors?", options: standardOptions },
  { id: 12, question: "Do you recognize these thoughts or behaviors as excessive?", options: standardOptions },
];

// Bipolar Disorder Questions
export const bipolarQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Have you had periods of feeling so happy or energetic that others thought something was wrong?", options: standardOptions },
  { id: 2, question: "Have you had periods of needing much less sleep than usual?", options: standardOptions },
  { id: 3, question: "Have you had periods of talking much more or faster than usual?", options: standardOptions },
  { id: 4, question: "Have you had periods where thoughts raced through your mind?", options: standardOptions },
  { id: 5, question: "Have you had periods of being much more active than usual?", options: standardOptions },
  { id: 6, question: "Have you had periods of doing risky or impulsive things?", options: standardOptions },
  { id: 7, question: "Have you had periods of increased self-confidence or grandiosity?", options: standardOptions },
  { id: 8, question: "Have you experienced periods of deep depression alternating with high energy?", options: standardOptions },
  { id: 9, question: "Have these mood swings affected your work or relationships?", options: standardOptions },
  { id: 10, question: "Have you experienced irritability during high-energy periods?", options: standardOptions },
  { id: 11, question: "Have these episodes lasted for several days or weeks?", options: standardOptions },
  { id: 12, question: "Have others noticed these significant mood changes?", options: standardOptions },
  { id: 13, question: "Have you been diagnosed with depression that didn't respond to treatment?", options: standardOptions },
  { id: 14, question: "Do you have family members with bipolar disorder or mood swings?", options: standardOptions },
  { id: 15, question: "Have you experienced both extreme highs and extreme lows in mood?", options: standardOptions },
];

// Social Anxiety Questions
export const socialAnxietyQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you fear being judged or evaluated negatively by others?", options: standardOptions },
  { id: 2, question: "Do you avoid social situations because of fear or anxiety?", options: standardOptions },
  { id: 3, question: "Do you experience physical symptoms (blushing, sweating) in social situations?", options: standardOptions },
  { id: 4, question: "Do you fear speaking in public or in front of groups?", options: standardOptions },
  { id: 5, question: "Do you have difficulty making eye contact?", options: standardOptions },
  { id: 6, question: "Do you fear meeting new people?", options: standardOptions },
  { id: 7, question: "Do you worry about embarrassing yourself in front of others?", options: standardOptions },
  { id: 8, question: "Do you avoid eating or drinking in front of others?", options: standardOptions },
  { id: 9, question: "Has social anxiety affected your work, school, or relationships?", options: standardOptions },
  { id: 10, question: "Do you spend time worrying before social events?", options: standardOptions },
];

// Hoarding Questions
export const hoardingQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you have difficulty discarding possessions regardless of their value?", options: standardOptions },
  { id: 2, question: "Do you feel distressed at the thought of getting rid of items?", options: standardOptions },
  { id: 3, question: "Are your living spaces cluttered to the point they can't be used for their intended purpose?", options: standardOptions },
  { id: 4, question: "Do you acquire items you don't need or have space for?", options: standardOptions },
  { id: 5, question: "Has clutter caused distress or problems in functioning?", options: standardOptions },
  { id: 6, question: "Do you feel safer surrounded by your possessions?", options: standardOptions },
  { id: 7, question: "Do you avoid having people over due to clutter?", options: standardOptions },
  { id: 8, question: "Has hoarding affected your relationships?", options: standardOptions },
  { id: 9, question: "Do you feel attached to items others would consider worthless?", options: standardOptions },
  { id: 10, question: "Has your hoarding created health or safety concerns?", options: standardOptions },
];

// Psychosis Questions
export const psychosisQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Have you heard voices or sounds that others couldn't hear?", options: standardOptions },
  { id: 2, question: "Have you seen things that others couldn't see?", options: standardOptions },
  { id: 3, question: "Have you had beliefs that others found strange or unbelievable?", options: standardOptions },
  { id: 4, question: "Have you felt that people were watching you or out to harm you?", options: standardOptions },
  { id: 5, question: "Have you had difficulty organizing your thoughts?", options: standardOptions },
  { id: 6, question: "Have others said your speech was difficult to follow?", options: standardOptions },
  { id: 7, question: "Have you felt disconnected from reality?", options: standardOptions },
  { id: 8, question: "Have you experienced unusual sensory experiences?", options: standardOptions },
  { id: 9, question: "Have you felt that your thoughts were being controlled?", options: standardOptions },
  { id: 10, question: "Have you had difficulty distinguishing between what's real and what's not?", options: standardOptions },
  { id: 11, question: "Have you noticed a decline in your ability to function?", options: standardOptions },
  { id: 12, question: "Have family members or friends expressed concern about your behavior?", options: standardOptions },
];

// Grief Questions
export const griefQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you find yourself longing intensely for the person who died?", options: standardOptions },
  { id: 2, question: "Do you have difficulty accepting the death?", options: standardOptions },
  { id: 3, question: "Do you feel that life is meaningless without your loved one?", options: standardOptions },
  { id: 4, question: "Do you feel bitter or angry about the loss?", options: standardOptions },
  { id: 5, question: "Do you find it hard to trust others since the death?", options: standardOptions },
  { id: 6, question: "Do you feel emotionally numb since the loss?", options: standardOptions },
  { id: 7, question: "Do you feel that part of yourself died with your loved one?", options: standardOptions },
  { id: 8, question: "Do you avoid reminders of your loved one?", options: standardOptions },
  { id: 9, question: "Has it been difficult to move forward with your life?", options: standardOptions },
  { id: 10, question: "Do you feel isolated or detached from others since the loss?", options: standardOptions },
];

// DID Questions
export const didQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you experience gaps in memory for everyday events?", options: standardOptions },
  { id: 2, question: "Do you find evidence of actions you don't remember doing?", options: standardOptions },
  { id: 3, question: "Do people tell you about things you've done that you don't recall?", options: standardOptions },
  { id: 4, question: "Do you feel like there are different parts or identities within you?", options: standardOptions },
  { id: 5, question: "Do you experience significant shifts in your sense of identity?", options: standardOptions },
  { id: 6, question: "Do you feel disconnected from your body or like you're watching yourself?", options: standardOptions },
  { id: 7, question: "Do you experience flashbacks or trauma memories?", options: standardOptions },
  { id: 8, question: "Do you hear voices inside your head?", options: standardOptions },
  { id: 9, question: "Do you sometimes feel like a different person?", options: standardOptions },
  { id: 10, question: "Have you experienced significant childhood trauma?", options: standardOptions },
  { id: 11, question: "Do you have sudden changes in preferences, skills, or behaviors?", options: standardOptions },
  { id: 12, question: "Do these experiences cause distress or problems in your life?", options: standardOptions },
  { id: 13, question: "Do you lose time or have missing periods in your day?", options: standardOptions },
  { id: 14, question: "Do you find possessions you don't remember acquiring?", options: standardOptions },
  { id: 15, question: "Do you feel like different parts of you have different ages or genders?", options: standardOptions },
];

// Schizophrenia Questions
export const schizophreniaQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Have you heard voices that others couldn't hear?", options: standardOptions },
  { id: 2, question: "Have you had beliefs that others found strange or impossible?", options: standardOptions },
  { id: 3, question: "Have you felt that people were plotting against you?", options: standardOptions },
  { id: 4, question: "Have you had difficulty thinking clearly or organizing thoughts?", options: standardOptions },
  { id: 5, question: "Have you experienced a decline in motivation or self-care?", options: standardOptions },
  { id: 6, question: "Have you felt emotionally flat or unable to experience pleasure?", options: standardOptions },
  { id: 7, question: "Have you had difficulty maintaining relationships or work?", options: standardOptions },
  { id: 8, question: "Have you felt that your thoughts were being broadcast or controlled?", options: standardOptions },
  { id: 9, question: "Have you seen things that others couldn't see?", options: standardOptions },
  { id: 10, question: "Have you had unusual sensory experiences?", options: standardOptions },
  { id: 11, question: "Have you experienced social withdrawal?", options: standardOptions },
  { id: 12, question: "Have others commented that your speech was hard to follow?", options: standardOptions },
  { id: 13, question: "Have these symptoms lasted for several months?", options: standardOptions },
  { id: 14, question: "Do you have family members with schizophrenia or psychosis?", options: standardOptions },
  { id: 15, question: "Have these experiences significantly affected your functioning?", options: standardOptions },
];

// Stress Questions
export const stressQuestions: AssessmentQuestion[] = [
  { id: 1, question: "How often have you felt nervous or stressed?", options: standardOptions },
  { id: 2, question: "How often have you felt unable to control important things in your life?", options: standardOptions },
  { id: 3, question: "How often have you felt overwhelmed by all you had to do?", options: standardOptions },
  { id: 4, question: "How often have you been angered because of things outside your control?", options: standardOptions },
  { id: 5, question: "How often have you felt that difficulties were piling up so high you couldn't overcome them?", options: standardOptions },
  { id: 6, question: "How often have you had difficulty relaxing?", options: standardOptions },
  { id: 7, question: "How often have you felt irritable or impatient?", options: standardOptions },
  { id: 8, question: "How often have you had trouble sleeping due to worry?", options: standardOptions },
  { id: 9, question: "How often have you experienced physical tension (headaches, muscle pain)?", options: standardOptions },
  { id: 10, question: "How often have you felt that you couldn't cope with everything you needed to do?", options: standardOptions },
];

// Agoraphobia Questions
export const agoraphobiaQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you fear using public transportation?", options: standardOptions },
  { id: 2, question: "Do you fear being in open spaces (parking lots, marketplaces)?", options: standardOptions },
  { id: 3, question: "Do you fear being in enclosed places (shops, theaters)?", options: standardOptions },
  { id: 4, question: "Do you fear standing in line or being in a crowd?", options: standardOptions },
  { id: 5, question: "Do you fear being outside of your home alone?", options: standardOptions },
  { id: 6, question: "Do you avoid these situations due to fear?", options: standardOptions },
  { id: 7, question: "Do you feel trapped or unable to escape in these situations?", options: standardOptions },
  { id: 8, question: "Do you fear having a panic attack in public?", options: standardOptions },
  { id: 9, question: "Do you need a companion to face these situations?", options: standardOptions },
  { id: 10, question: "Has this fear significantly affected your daily life?", options: standardOptions },
];

// Separation Anxiety Questions
export const separationAnxietyQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you experience excessive distress when separated from home or attachment figures?", options: standardOptions },
  { id: 2, question: "Do you worry excessively about losing attachment figures?", options: standardOptions },
  { id: 3, question: "Do you worry about harm coming to attachment figures?", options: standardOptions },
  { id: 4, question: "Do you avoid leaving home because of fear of separation?", options: standardOptions },
  { id: 5, question: "Do you fear being alone without attachment figures?", options: standardOptions },
  { id: 6, question: "Do you refuse to sleep away from home?", options: standardOptions },
  { id: 7, question: "Do you experience nightmares about separation?", options: standardOptions },
  { id: 8, question: "Do you experience physical symptoms when separation occurs or is anticipated?", options: standardOptions },
  { id: 9, question: "Do these fears affect your work, school, or relationships?", options: standardOptions },
  { id: 10, question: "Have these symptoms persisted for an extended period?", options: standardOptions },
];

// Sleep Disorder Questions
export const sleepDisorderQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you have difficulty falling asleep?", options: standardOptions },
  { id: 2, question: "Do you have difficulty staying asleep?", options: standardOptions },
  { id: 3, question: "Do you wake up earlier than desired?", options: standardOptions },
  { id: 4, question: "Do you feel unrefreshed after sleeping?", options: standardOptions },
  { id: 5, question: "Do you experience daytime sleepiness?", options: standardOptions },
  { id: 6, question: "Do you have difficulty concentrating due to poor sleep?", options: standardOptions },
  { id: 7, question: "Do you experience mood disturbances related to sleep?", options: standardOptions },
  { id: 8, question: "Do you snore loudly or stop breathing during sleep?", options: standardOptions },
  { id: 9, question: "Do you experience restless legs or uncomfortable sensations at night?", options: standardOptions },
  { id: 10, question: "Has poor sleep affected your work or relationships?", options: standardOptions },
];

// Empathy Deficit Questions
export const empathyDeficitQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you find it difficult to understand others' emotions?", options: standardOptions },
  { id: 2, question: "Do you struggle to see things from others' perspectives?", options: standardOptions },
  { id: 3, question: "Do you feel disconnected when others share their feelings?", options: standardOptions },
  { id: 4, question: "Do others say you seem cold or uncaring?", options: standardOptions },
  { id: 5, question: "Do you have difficulty providing emotional support?", options: standardOptions },
  { id: 6, question: "Do you miss social cues or body language?", options: standardOptions },
  { id: 7, question: "Do you feel uncomfortable with emotional expressions?", options: standardOptions },
  { id: 8, question: "Do you have difficulty maintaining close relationships?", options: standardOptions },
  { id: 9, question: "Do you prefer logical discussions over emotional ones?", options: standardOptions },
  { id: 10, question: "Has this affected your personal or professional relationships?", options: standardOptions },
];

// Binge Eating Questions
export const bingeEatingQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you eat large amounts of food in a short period?", options: standardOptions },
  { id: 2, question: "Do you feel a lack of control over eating during these episodes?", options: standardOptions },
  { id: 3, question: "Do you eat much more rapidly than normal during binges?", options: standardOptions },
  { id: 4, question: "Do you eat until feeling uncomfortably full?", options: standardOptions },
  { id: 5, question: "Do you eat large amounts when not physically hungry?", options: standardOptions },
  { id: 6, question: "Do you eat alone because of embarrassment about quantity?", options: standardOptions },
  { id: 7, question: "Do you feel disgusted, depressed, or guilty after overeating?", options: standardOptions },
  { id: 8, question: "Do you feel distressed about your binge eating?", options: standardOptions },
  { id: 9, question: "Do binge episodes occur at least once a week?", options: standardOptions },
  { id: 10, question: "Do you use food to cope with emotions?", options: standardOptions },
];

// Gender Dysphoria Questions
export const genderDysphoriaQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you experience discomfort with your assigned gender?", options: standardOptions },
  { id: 2, question: "Do you desire to be treated as a different gender?", options: standardOptions },
  { id: 3, question: "Do you feel a disconnect between your body and gender identity?", options: standardOptions },
  { id: 4, question: "Do you prefer activities typically associated with another gender?", options: standardOptions },
  { id: 5, question: "Do you feel distressed about your primary or secondary sex characteristics?", options: standardOptions },
  { id: 6, question: "Do you strongly desire the physical characteristics of another gender?", options: standardOptions },
  { id: 7, question: "Do you feel more comfortable expressing yourself as a different gender?", options: standardOptions },
  { id: 8, question: "Has this disconnect caused significant distress or impairment?", options: standardOptions },
  { id: 9, question: "Have you experienced these feelings for an extended period?", options: standardOptions },
  { id: 10, question: "Do you feel that your internal sense of gender differs from your body?", options: standardOptions },
  { id: 11, question: "Have you desired to change your physical appearance to match your gender identity?", options: standardOptions },
  { id: 12, question: "Has this affected your social, work, or personal life?", options: standardOptions },
];

// Relationship Health Questions
export const relationshipHealthQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you experience frequent conflicts with your partner?", options: standardOptions },
  { id: 2, question: "Do you feel emotionally distant from your partner?", options: standardOptions },
  { id: 3, question: "Do you have difficulty communicating your needs?", options: standardOptions },
  { id: 4, question: "Do you feel unsupported in your relationship?", options: standardOptions },
  { id: 5, question: "Have you experienced a loss of trust in your relationship?", options: standardOptions },
  { id: 6, question: "Do you avoid discussing important issues with your partner?", options: standardOptions },
  { id: 7, question: "Do you feel criticized or belittled by your partner?", options: standardOptions },
  { id: 8, question: "Has intimacy decreased in your relationship?", options: standardOptions },
  { id: 9, question: "Do you feel like you're growing apart from your partner?", options: standardOptions },
  { id: 10, question: "Do you spend quality time together less often?", options: standardOptions },
  { id: 11, question: "Do you feel unhappy in your current relationship?", options: standardOptions },
  { id: 12, question: "Have you considered ending the relationship?", options: standardOptions },
];

// Sociopathy Questions
export const sociopathyQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you find it difficult to follow social rules or laws?", options: standardOptions },
  { id: 2, question: "Do you often deceive others for personal gain or pleasure?", options: standardOptions },
  { id: 3, question: "Do you act impulsively without considering consequences?", options: standardOptions },
  { id: 4, question: "Are you frequently irritable or aggressive?", options: standardOptions },
  { id: 5, question: "Do you disregard the safety of yourself or others?", options: standardOptions },
  { id: 6, question: "Are you consistently irresponsible regarding work or finances?", options: standardOptions },
  { id: 7, question: "Do you lack remorse for actions that hurt others?", options: standardOptions },
  { id: 8, question: "Do you have difficulty maintaining long-term relationships?", options: standardOptions },
  { id: 9, question: "Do you blame others for your problems?", options: standardOptions },
  { id: 10, question: "Do you feel that normal rules don't apply to you?", options: standardOptions },
  { id: 11, question: "Have you had legal troubles due to your behavior?", options: standardOptions },
  { id: 12, question: "Do you struggle to feel empathy for others?", options: standardOptions },
];

// Job Satisfaction Questions
export const jobSatisfactionQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you feel fulfilled by your current job?", options: standardOptions },
  { id: 2, question: "Do you feel your work is meaningful?", options: standardOptions },
  { id: 3, question: "Do you have opportunities for growth and advancement?", options: standardOptions },
  { id: 4, question: "Do you feel valued and appreciated at work?", options: standardOptions },
  { id: 5, question: "Do you have a good relationship with your colleagues?", options: standardOptions },
  { id: 6, question: "Do you feel fairly compensated for your work?", options: standardOptions },
  { id: 7, question: "Do you have a manageable workload?", options: standardOptions },
  { id: 8, question: "Do you have autonomy in your role?", options: standardOptions },
  { id: 9, question: "Do you feel supported by your manager?", options: standardOptions },
  { id: 10, question: "Do you look forward to going to work?", options: standardOptions },
];

// Work-Life Balance Questions
export const workLifeBalanceQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you have enough time for personal activities and hobbies?", options: standardOptions },
  { id: 2, question: "Do you feel work interferes with your personal life?", options: standardOptions },
  { id: 3, question: "Do you work beyond your scheduled hours regularly?", options: standardOptions },
  { id: 4, question: "Do you bring work home or think about it constantly?", options: standardOptions },
  { id: 5, question: "Do you have energy for family and friends after work?", options: standardOptions },
  { id: 6, question: "Do you take regular breaks and vacations?", options: standardOptions },
  { id: 7, question: "Do you feel guilty when not working?", options: standardOptions },
  { id: 8, question: "Do you maintain your physical health despite work demands?", options: standardOptions },
  { id: 9, question: "Do you feel burned out trying to balance work and life?", options: standardOptions },
  { id: 10, question: "Do your personal relationships suffer due to work?", options: standardOptions },
];

// Imposter Syndrome Questions
export const imposterSyndromeQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you feel like you're not as competent as others think you are?", options: standardOptions },
  { id: 2, question: "Do you attribute your success to luck rather than skill?", options: standardOptions },
  { id: 3, question: "Do you fear being exposed as a fraud?", options: standardOptions },
  { id: 4, question: "Do you downplay your achievements?", options: standardOptions },
  { id: 5, question: "Do you feel you don't deserve your success?", options: standardOptions },
  { id: 6, question: "Do you overwork to prevent being found out?", options: standardOptions },
  { id: 7, question: "Do you struggle to accept praise or recognition?", options: standardOptions },
  { id: 8, question: "Do you compare yourself negatively to others?", options: standardOptions },
  { id: 9, question: "Do you set excessively high standards for yourself?", options: standardOptions },
  { id: 10, question: "Do you focus on mistakes rather than successes?", options: standardOptions },
];

// SAD (Seasonal Affective Disorder) Questions
export const sadQuestions: AssessmentQuestion[] = [
  { id: 1, question: "Do you feel depressed during specific seasons (usually winter)?", options: standardOptions },
  { id: 2, question: "Do you experience changes in sleep during certain seasons?", options: standardOptions },
  { id: 3, question: "Do you have changes in appetite or weight during certain seasons?", options: standardOptions },
  { id: 4, question: "Do you feel more fatigued during certain times of year?", options: standardOptions },
  { id: 5, question: "Do you have difficulty concentrating during certain seasons?", options: standardOptions },
  { id: 6, question: "Do you feel hopeless during specific times of year?", options: standardOptions },
  { id: 7, question: "Do you lose interest in activities during certain seasons?", options: standardOptions },
  { id: 8, question: "Do you crave carbohydrates more during certain seasons?", options: standardOptions },
  { id: 9, question: "Do your mood symptoms improve when seasons change?", options: standardOptions },
  { id: 10, question: "Has this pattern occurred for at least two years?", options: standardOptions },
];
