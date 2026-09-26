import type { QuestionId } from '@/lib/wellbeingIntelligence';

/** Practical playbook HR can run when a screening focus area is flagged. */
export type HrFocusStrategy = {
  qid: QuestionId;
  title: string;
  whyItMatters: string;
  thisWeek: string[];
  thisMonth: string[];
  teamCoping: string[];
  managerScript: string;
  escalateWhen: string;
};

export const HR_FOCUS_STRATEGIES: Record<QuestionId, HrFocusStrategy> = {
  q1: {
    qid: 'q1',
    title: 'Low mood / morale',
    whyItMatters:
      'When many people score low on “cheerful and in good spirits”, the organisation often has weak recognition, unclear direction, or recent change fatigue — not “bad attitude”.',
    thisWeek: [
      'Ask every manager to give one specific thank-you to each direct report (not a generic “great job”).',
      'Publish a short all-hands note: what is going well, what is hard, and what leadership is doing next.',
      'Remind staff that confidential therapy via InnerSpark is available without manager approval.',
    ],
    thisMonth: [
      'Run a 45–60 min S.P.A.R.K emotional resilience session.',
      'Review recognition rituals (weekly shout-outs, peer awards).',
      'Check whether recent restructures or target changes were explained clearly enough.',
    ],
    teamCoping: [
      'Start meetings with a 60-second “one win / one challenge” round.',
      'Encourage micro-breaks away from screens every 90 minutes.',
      'Normalise saying “I am not OK today” without penalty.',
    ],
    managerScript:
      '“We are not looking for names. The team screen shows mood is under pressure. What would make the next two weeks feel more manageable for the group?”',
    escalateWhen:
      'If mood stays low after two screening rounds, or managers report withdrawal and performance cliffs — activate EAP outreach and a facilitated culture session.',
  },
  q2: {
    qid: 'q2',
    title: 'High anxiety / low calm',
    whyItMatters:
      'Low “calm and relaxed” scores usually track unclear expectations, fear of failure, or constant urgency. Anxiety spreads through teams when priorities keep shifting.',
    thisWeek: [
      'Freeze non-critical new initiatives for 7 days; publish a single priority list.',
      'Managers clarify “must do / should do / can wait” for each role.',
      'Share short breathing / calm tools and InnerSpark stress support links.',
    ],
    thisMonth: [
      'Manager workshop on psychological safety and how to give feedback without panic.',
      'Reduce standing meetings by 20% and protect focus blocks.',
      'S.P.A.R.K module on calm under pressure.',
    ],
    teamCoping: [
      'Name the worry: write the top 3 uncertainties on a shared board and close one each week.',
      'Use a “no Slack after 7pm unless urgent” trial for two weeks.',
      'Pair anxious high-performers with a peer buddy for weekly check-ins.',
    ],
    managerScript:
      '“The pattern is team-wide tension, not individual weakness. Which decisions feel unclear right now, and what would reduce the noise?”',
    escalateWhen:
      'If anxiety clusters with overwhelm and unmanageable workload, treat it as a leadership operating-model issue — not only a training issue.',
  },
  q3: {
    qid: 'q3',
    title: 'Low energy / early burnout',
    whyItMatters:
      '“Active and vigorous” dropping is often the earliest burnout signal — months before people resign or miss targets.',
    thisWeek: [
      'Audit meeting load: cancel or shorten any recurring meeting without a clear owner/outcome.',
      'Give one recovery day or half-day where operationally possible (rotate coverage).',
      'Stop weekend messaging except true emergencies.',
    ],
    thisMonth: [
      'Workload review per team: headcount vs deliverables.',
      'S.P.A.R.K burnout prevention workshop.',
      'Encourage use of leave; track unused leave by department (aggregate only).',
    ],
    teamCoping: [
      'Protect one meeting-free afternoon weekly.',
      'Encourage walking 1:1s instead of back-to-back Zoom.',
      'Celebrate “done” lists, not only “new” lists.',
    ],
    managerScript:
      '“Energy looks depleted across the team. What can we stop, delay, or hand off this month so people can recover?”',
    escalateWhen:
      'If energy + sleep + overwhelm are all low, escalate to leadership for resourcing decisions immediately.',
  },
  q4: {
    qid: 'q4',
    title: 'Poor sleep / recovery',
    whyItMatters:
      'People not waking rested usually means work is following them home — late messages, unfinished urgency, or fear of falling behind.',
    thisWeek: [
      'Set a written after-hours rule: no non-urgent messages after 7pm / before 7am.',
      'Leaders model the rule publicly for two weeks.',
      'Share sleep meditations / wind-down tools from InnerSpark.',
    ],
    thisMonth: [
      'Review on-call and late-delivery culture.',
      'Train managers not to reward “always online” behaviour.',
      'Optional sleep hygiene lunch-and-learn (not mandatory).',
    ],
    teamCoping: [
      'End-of-day shutdown ritual: write tomorrow’s top 3, then close laptop.',
      'No email checking in bed — phone charging outside the bedroom where possible.',
      'Limit caffeine after mid-afternoon during peak delivery weeks.',
    ],
    managerScript:
      '“The screen shows recovery and sleep are under pressure. We will protect evenings. What work is still leaking into nights?”',
    escalateWhen:
      'If sleep scores stay critical for a second round, combine policy change with EAP visibility — chronic sleep loss is a safety and productivity risk.',
  },
  q5: {
    qid: 'q5',
    title: 'Loss of interest / disengagement',
    whyItMatters:
      'Low interest in daily life is a serious engagement and depression-risk signal. Treat it as care + meaning, not “motivation training”.',
    thisWeek: [
      'Remind everyone of confidential 1:1 therapy access (no stigma language).',
      'Managers hold genuine 1:1s focused on energy and meaning, not only KPIs.',
      'Remove one pointless task or report that everyone hates.',
    ],
    thisMonth: [
      'Purpose & recognition session for the team.',
      'Career path conversations for roles that feel stuck.',
      'Activate EAP / therapy pathway strongly; track uptake aggregate-only.',
    ],
    teamCoping: [
      'Reconnect people to “why this work matters” with customer/beneficiary stories.',
      'Allow small experiments people choose (20% time lite).',
      'Peer appreciation notes once a week.',
    ],
    managerScript:
      '“Engagement looks low organisation-wide. I am not looking for who. What would make work feel more meaningful or less empty right now?”',
    escalateWhen:
      'If disengagement clusters with low mood and low support, prioritise therapy access over more workshops.',
  },
  q6: {
    qid: 'q6',
    title: 'Unmanageable workload',
    whyItMatters:
      'This is operational. Therapy alone will not fix chronic overload. HR’s job is to force a resourcing conversation with leadership.',
    thisWeek: [
      'Each manager lists top 10 workstreams and kills or pauses 2.',
      'Freeze hiring freezes’ side effects: stop absorbing empty seats without plan.',
      'Publish a “not doing now” list company-wide.',
    ],
    thisMonth: [
      'Capacity vs demand review with finance/ops.',
      'S.P.A.R.K workload management for managers.',
      'Rebalance work across teams where one unit is overloaded.',
    ],
    teamCoping: [
      'Daily top-3 priorities only.',
      'Say no with a redirect: “I can do X by Friday if Y moves to next sprint.”',
      'Batch similar tasks; cut context-switching.',
    ],
    managerScript:
      '“Workload is not manageable for the group. What do we stop so quality and health do not break?”',
    escalateWhen:
      'If workload stays red after leadership review, document risk to delivery and people for the executive team in writing.',
  },
  q7: {
    qid: 'q7',
    title: 'Low support at work',
    whyItMatters:
      'People feeling unsupported is a psychological-safety failure. It drives silence, mistakes, and exits.',
    thisWeek: [
      'Managers open 1:1s with “How supported do you feel?” and listen without defending.',
      'Create a clear “who to go to” map for HR, EAP, and line manager.',
      'Fix one broken process people keep complaining about.',
    ],
    thisMonth: [
      'Manager training on supportive conversations.',
      'Peer mentoring / buddy system for new joiners and high-load roles.',
      'Review how complaints and concerns are handled — speed and fairness.',
    ],
    teamCoping: [
      'Weekly team “help needed / help offered” board.',
      'Celebrate asking for help as competence, not weakness.',
      'Cross-train so people are not single points of failure.',
    ],
    managerScript:
      '“Support scores are low. I want this team to feel safe raising problems. What gets in the way of asking for help here?”',
    escalateWhen:
      'If support is low and critical cases rise, audit manager behaviour and HR response times — not just add another workshop.',
  },
  q8: {
    qid: 'q8',
    title: 'Frequent overwhelm',
    whyItMatters:
      'Overwhelm with low calm and low energy is the clearest burnout precursor. Act on systems, not individuals.',
    thisWeek: [
      'Declare a two-week stabilisation period: no new projects.',
      'Leadership owns triage of incoming work.',
      'Push EAP / therapy reminder with warm language.',
    ],
    thisMonth: [
      'S.P.A.R.K crisis / burnout session for managers and staff.',
      'Reset OKRs or targets that are clearly impossible.',
      'Track overtime (aggregate) and set a hard cap trial.',
    ],
    teamCoping: [
      'Break work into 25–50 minute focus blocks with real breaks.',
      'Name overwhelm early in stand-ups before it becomes crisis.',
      'Use a shared “parking lot” for ideas so not everything is urgent.',
    ],
    managerScript:
      '“Overwhelm is showing up team-wide. We will cut load. What is the single biggest source of constant firefighting?”',
    escalateWhen:
      'Immediate leadership escalation if overwhelm + critical risk band is high — waiting another quarter is costly.',
  },
};

export function getHrFocusStrategy(qid: QuestionId): HrFocusStrategy {
  return HR_FOCUS_STRATEGIES[qid];
}
