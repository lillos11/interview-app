import { AMAZON_INTERVIEW_QUESTION_BANK_RAW } from './amazonQuestionBankData';

export const INTERVIEW_STORAGE_KEY = 'interview-command-center-v1';

export const INTERVIEW_COMPETENCIES = [
  {
    id: 'storytelling',
    title: 'Storytelling',
    description: 'Open with clarity, structure fast, and land outcomes people can remember.',
    cue: 'Use strong intros, concise context, and measurable endings.'
  },
  {
    id: 'leadership',
    title: 'Leadership',
    description: 'Show direction-setting, judgment, and how you move people through ambiguity.',
    cue: 'Highlight decisions, alignment, and standards.'
  },
  {
    id: 'ownership',
    title: 'Ownership',
    description: 'Demonstrate accountability, prioritization, and follow-through under pressure.',
    cue: 'Make tradeoffs visible and own the hard parts.'
  },
  {
    id: 'problem_solving',
    title: 'Problem Solving',
    description: 'Break down unclear problems, pressure-test options, and explain tradeoffs cleanly.',
    cue: 'State the frame, options, reasoning, and decision.'
  },
  {
    id: 'stakeholder_management',
    title: 'Stakeholder Mgmt',
    description: 'Handle disagreement, influence without authority, and protect momentum.',
    cue: 'Name tension, alignment moves, and how trust improved.'
  },
  {
    id: 'adaptability',
    title: 'Adaptability',
    description: 'Show learning speed, composure, and how you recover when plans change.',
    cue: 'Frame pivots as disciplined responses, not chaos.'
  },
  {
    id: 'technical_depth',
    title: 'Technical Depth',
    description: 'Explain architecture, constraints, and execution choices without rambling.',
    cue: 'Start with the system goal, then tradeoffs and result.'
  }
] as const;

export type CompetencyId = (typeof INTERVIEW_COMPETENCIES)[number]['id'];
export type DrillRating = 'needs_work' | 'solid' | 'strong';
export type InterviewSourceFamily = 'lp' | 'functional';
export type CompanyTrack = 'amazon';

export interface FrameworkCard {
  id: string;
  competency: CompetencyId;
  title: string;
  prompt: string;
  answer: string;
}

export interface InterviewQuestion {
  id: string;
  competency: CompetencyId;
  signalLane: CompetencyId;
  title: string;
  prompt: string;
  listenFors: readonly string[];
  followUps: readonly string[];
  sourceFamily: InterviewSourceFamily;
  sourceCategoryId: string;
  sourceCategoryLabel: string;
  managerOnly: boolean;
  companyTrack: CompanyTrack;
}

export interface InterviewQuestionCategory {
  id: string;
  family: InterviewSourceFamily;
  familyLabel: string;
  label: string;
  description: string;
  signalLane: CompetencyId;
  defaultListenFors: readonly string[];
}

export interface StoryPrompt {
  id: string;
  competency: CompetencyId;
  prompt: string;
}

export interface PlaybookChecklistItem {
  id: string;
  phase: '48_hours' | '60_minutes' | 'post_round';
  title: string;
  detail: string;
}

export interface SmartQuestion {
  id: string;
  group: 'team' | 'role' | 'leadership' | 'success';
  prompt: string;
}

export interface InterviewStage {
  id: string;
  title: string;
  detail: string;
}

export interface StoryDraft {
  id?: string;
  competency: CompetencyId;
  categoryTags: string[];
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  reflection: string;
}

export interface StarStory extends StoryDraft {
  id: string;
  updatedAt: string;
}

export interface PitchPack {
  present: string;
  proof: string;
  future: string;
  whyHere: string;
}

export interface DrillStat {
  attempted: number;
  solid: number;
  strong: number;
}

export interface CompetencyStat {
  attempted: number;
  solid: number;
  strong: number;
}

export interface DrillHistoryRecord {
  date: string;
  questionId: string;
  competency: CompetencyId;
  rating: DrillRating;
  sourceFamily?: InterviewSourceFamily;
  sourceCategoryId?: string;
  sourceCategoryLabel?: string;
  managerOnly?: boolean;
}

export type CompetencyStats = Record<CompetencyId, CompetencyStat>;

export type BarRaiserVerdict = 'below_bar' | 'borderline' | 'hire_signal' | 'bar_raiser';

export interface AnswerReviewDimension {
  id: 'structure' | 'ownership' | 'evidence' | 'judgment' | 'delivery';
  label: string;
  score: number;
  note: string;
}

export interface InterviewAnswerReview {
  score: number;
  rating: DrillRating;
  verdict: BarRaiserVerdict;
  verdictLabel: string;
  summary: string;
  wordCount: number;
  fillerCount: number;
  metricsCount: number;
  dimensions: AnswerReviewDimension[];
  strengths: string[];
  misses: string[];
  followUps: string[];
  rewriteMoves: string[];
}

export interface StoryPressureTest {
  score: number;
  strengths: string[];
  vulnerabilities: string[];
  pressureQuestions: string[];
  upgradeMoves: string[];
}

export interface InterviewPrepProgress {
  version: 1;
  createdAt: string;
  updatedAt: string;
  streak: number;
  lastPracticeDate: string | null;
  masteredCardIds: string[];
  questionStats: Record<string, DrillStat>;
  competencyStats: CompetencyStats;
  drillHistory: DrillHistoryRecord[];
  stories: StarStory[];
  pitch: PitchPack;
  checklistDoneIds: string[];
}

export const INTERVIEW_STAGES: readonly InterviewStage[] = [
  {
    id: 'screen',
    title: 'Recruiter Screen',
    detail: 'Control the narrative: fit, motivation, compensation posture, and timeline.'
  },
  {
    id: 'manager',
    title: 'Hiring Manager',
    detail: 'Show role thesis, execution range, and how you create leverage for the team.'
  },
  {
    id: 'panel',
    title: 'Panel or Onsite',
    detail: 'Repeat core stories with sharper calibration for cross-functional interviewers.'
  },
  {
    id: 'close',
    title: 'Final and Offer',
    detail: 'Probe for success metrics, team quality, and where the company is truly constrained.'
  }
] as const;

export const NEGOTIATION_REMINDERS = [
  'Express excitement before discussing numbers so the ask reads as calibration, not hesitation.',
  'Anchor on scope, impact, and market data rather than personal need.',
  'Ask about level, bonus, equity refresh, and review cadence before accepting the first package.',
  'Close loops in writing after the call so details do not drift.'
] as const;

export const RED_FLAGS = [
  'Interviewers cannot define success for the role in the first six months.',
  'Multiple people describe culture using incompatible language.',
  'Leaders frame burnout or chaos as a badge of honor.',
  'Nobody can explain why the role is open, what changed, or what support exists.'
] as const;

export const INTERVIEW_SOURCE_FAMILY_LABELS: Record<InterviewSourceFamily, string> = {
  lp: 'Leadership Principles',
  functional: 'Functional Competencies'
};

const DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE: Record<CompetencyId, readonly string[]> = {
  storytelling: ['Clear opening', 'Relevant context', 'Role fit', 'Memorable result'],
  leadership: ['Decision quality', 'Higher standard', 'Alignment', 'Lasting impact'],
  ownership: ['Ownership', 'Prioritization', 'Follow-through', 'Business result'],
  problem_solving: ['Problem frame', 'Assumptions and options', 'Tradeoff logic', 'Outcome'],
  stakeholder_management: ['Stakeholder context', 'Influence move', 'Trust or alignment', 'Result'],
  adaptability: ['Change signal', 'Reset move', 'Learning speed', 'Outcome'],
  technical_depth: ['System or root cause', 'Analytical depth', 'Tradeoff', 'Measured impact']
};

export const INTERVIEW_QUESTION_CATEGORIES: readonly InterviewQuestionCategory[] = [
  {
    id: 'customer-obsession',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Customer Obsession',
    description: 'Show how you understand customer needs, make tradeoffs well, and improve the customer experience.',
    signalLane: 'stakeholder_management',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management
  },
  {
    id: 'ownership',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Ownership',
    description: 'Show accountability beyond formal scope and follow-through when the stakes rise.',
    signalLane: 'ownership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.ownership
  },
  {
    id: 'invent-and-simplify',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Invent and Simplify',
    description: 'Show creative problem solving that makes the work or customer experience meaningfully simpler.',
    signalLane: 'problem_solving',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.problem_solving
  },
  {
    id: 'are-right-a-lot',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Are Right, a Lot',
    description: 'Show judgment under uncertainty and how you calibrate decisions with multiple inputs.',
    signalLane: 'problem_solving',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.problem_solving
  },
  {
    id: 'learn-and-be-curious',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Learn and Be Curious',
    description: 'Show how you ramp fast, challenge your assumptions, and apply new learning.',
    signalLane: 'adaptability',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.adaptability
  },
  {
    id: 'hire-and-develop-the-best',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Hire and Develop the Best',
    description: 'Show how you raise talent density, coach others, and strengthen the team around you.',
    signalLane: 'leadership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership
  },
  {
    id: 'insist-on-the-highest-standards',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Insist on the Highest Standards',
    description: 'Show how you raise quality, keep the bar high, and resist false tradeoffs.',
    signalLane: 'leadership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership
  },
  {
    id: 'think-big',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Think Big',
    description: 'Show how you define a larger opportunity, sell the vision, and create leverage.',
    signalLane: 'leadership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership
  },
  {
    id: 'bias-for-action',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Bias for Action',
    description: 'Show how you move quickly with incomplete information while still managing risk.',
    signalLane: 'adaptability',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.adaptability
  },
  {
    id: 'frugality',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Frugality',
    description: 'Show how you deliver meaningful results with constraints, tradeoffs, and creative resourcefulness.',
    signalLane: 'ownership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.ownership
  },
  {
    id: 'earn-trust',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Earn Trust',
    description: 'Show how you influence, communicate honestly, and repair confidence under stress.',
    signalLane: 'stakeholder_management',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management
  },
  {
    id: 'dive-deep',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Dive Deep',
    description: 'Show root-cause analysis, detail orientation, and fact-based problem solving.',
    signalLane: 'technical_depth',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.technical_depth
  },
  {
    id: 'have-backbone-disagree-and-commit',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Have Backbone; Disagree and Commit',
    description: 'Show principled disagreement, respectful pushback, and commitment once a direction is set.',
    signalLane: 'stakeholder_management',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management
  },
  {
    id: 'deliver-results',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Deliver Results',
    description: 'Show how you execute through obstacles and land meaningful outcomes.',
    signalLane: 'ownership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.ownership
  },
  {
    id: 'strive-to-be-earth-s-best-employer',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Strive to Be Earth’s Best Employer',
    description: 'Show how you improve the working environment, advocate for others, and build inclusion.',
    signalLane: 'leadership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership
  },
  {
    id: 'success-and-scale-bring-broad-responsibility',
    family: 'lp',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
    label: 'Success and Scale Bring Broad Responsibility',
    description: 'Show how you consider downstream, societal, or long-term impacts of your decisions.',
    signalLane: 'leadership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership
  },
  {
    id: 'adaptability',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Adaptability',
    description: 'Show how you reset plans quickly when conditions change and keep the work moving.',
    signalLane: 'adaptability',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.adaptability
  },
  {
    id: 'collaboration',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Collaboration',
    description: 'Show how you coordinate effectively, handle disagreement, and build strong partnerships.',
    signalLane: 'stakeholder_management',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management
  },
  {
    id: 'conscientiousness',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Conscientiousness',
    description: 'Show reliability, attention to detail, and disciplined follow-through on commitments.',
    signalLane: 'ownership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.ownership
  },
  {
    id: 'customer-orientation',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Customer orientation',
    description: 'Show how you interpret customer needs, respond well, and deliver standout service.',
    signalLane: 'stakeholder_management',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management
  },
  {
    id: 'deal-with-ambiguity',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Deal with Ambiguity',
    description: 'Show how you create structure and direction when goals or responsibilities are unclear.',
    signalLane: 'problem_solving',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.problem_solving
  },
  {
    id: 'influencing',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Influencing',
    description: 'Show how you persuade without authority and build commitment across perspectives.',
    signalLane: 'stakeholder_management',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management
  },
  {
    id: 'interpretation-and-analysis',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Interpretation and Analysis',
    description: 'Show how you analyze complex information, challenge assumptions, and uncover the right insight.',
    signalLane: 'technical_depth',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.technical_depth
  },
  {
    id: 'judgment-and-decision-making',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Judgment and Decision Making',
    description: 'Show how you weigh options well, make decisions, and explain your reasoning clearly.',
    signalLane: 'problem_solving',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.problem_solving
  },
  {
    id: 'learning-orientation',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Learning Orientation',
    description: 'Show how you learn quickly, close skill gaps, and turn feedback into better performance.',
    signalLane: 'adaptability',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.adaptability
  },
  {
    id: 'plan-and-prioritize',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Plan and Prioritize',
    description: 'Show how you sequence work, manage tradeoffs, and focus the team on the right priorities.',
    signalLane: 'ownership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.ownership
  },
  {
    id: 'team-and-people-management',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Team and People Management',
    description: 'Show how you coach, motivate, and manage performance with clarity and fairness.',
    signalLane: 'leadership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership
  },
  {
    id: 'vision-and-strategy',
    family: 'functional',
    familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
    label: 'Vision and Strategy',
    description: 'Show how you set direction, connect work to strategy, and drive adoption for a larger plan.',
    signalLane: 'leadership',
    defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership
  }
] as const;

const INTERVIEW_QUESTION_CATEGORY_LOOKUP = Object.fromEntries(
  INTERVIEW_QUESTION_CATEGORIES.map((category) => [category.id, category])
) as Record<string, InterviewQuestionCategory>;

export function isInterviewSourceFamily(value: unknown): value is InterviewSourceFamily {
  return value === 'lp' || value === 'functional';
}

export function isQuestionCategoryId(value: unknown): value is string {
  return typeof value === 'string' && value in INTERVIEW_QUESTION_CATEGORY_LOOKUP;
}

export function getQuestionCategoryById(categoryId: string): InterviewQuestionCategory {
  return INTERVIEW_QUESTION_CATEGORY_LOOKUP[categoryId] ?? INTERVIEW_QUESTION_CATEGORIES[0];
}

export function getQuestionCategoriesByFamily(family: InterviewSourceFamily): InterviewQuestionCategory[] {
  return INTERVIEW_QUESTION_CATEGORIES.filter((category) => category.family === family);
}

export const FRAMEWORK_CARDS: readonly FrameworkCard[] = [
  {
    id: 'fw-star',
    competency: 'storytelling',
    title: 'STAR Core',
    prompt: 'What is the tightest version of STAR for behavioral answers?',
    answer:
      'Situation in one or two lines, Task in one line, Action as the longest section, Result with metrics, then Reflection if it adds judgment.'
  },
  {
    id: 'fw-intro',
    competency: 'storytelling',
    title: 'Tell Me About Yourself',
    prompt: 'How should your opening pitch be structured?',
    answer:
      'Present -> Proof -> Future -> Why Here. Start with who you are now, add two proof points, connect to your next step, and close with why this company fits.'
  },
  {
    id: 'fw-why-role',
    competency: 'leadership',
    title: 'Why This Role',
    prompt: 'How do you answer why you want the role without sounding generic?',
    answer:
      'Tie together the company problem, the work you want more of, and the evidence that your past wins map directly to the role.'
  },
  {
    id: 'fw-conflict',
    competency: 'stakeholder_management',
    title: 'Conflict Story',
    prompt: 'What makes a conflict answer credible?',
    answer:
      'Name the tension plainly, describe how you aligned on facts or goals, explain the decision path, and show the relationship after the disagreement.'
  },
  {
    id: 'fw-failure',
    competency: 'adaptability',
    title: 'Failure Story',
    prompt: 'How should you frame failure questions?',
    answer:
      'Choose a real miss with stakes, take ownership quickly, explain the repair, and end with the control or habit you changed afterward.'
  },
  {
    id: 'fw-leadership',
    competency: 'leadership',
    title: 'Leadership Signal',
    prompt: 'What should leadership answers always include?',
    answer:
      'Context, a decision, how you aligned people, what tradeoff you accepted, and the standard you held after the decision.'
  },
  {
    id: 'fw-technical',
    competency: 'technical_depth',
    title: 'Technical Deep Dive',
    prompt: 'How do you avoid rambling in a technical walkthrough?',
    answer:
      'State the system goal, constraints, architecture choice, key tradeoffs, failure mode, and outcome. Go top-down before zooming into details.'
  },
  {
    id: 'fw-problem',
    competency: 'problem_solving',
    title: 'Problem-Solving Frame',
    prompt: 'What does a strong answer to an ambiguous problem sound like?',
    answer:
      'Clarify the goal, list assumptions, compare options, define the decision rule, and say how you would know if the move was working.'
  },
  {
    id: 'fw-close',
    competency: 'stakeholder_management',
    title: 'Close Strong',
    prompt: 'How do you handle the final "anything else" moment?',
    answer:
      'Restate your role fit in one sentence, connect it to the team need you heard, and ask about the most important next decision in the process.'
  },
  {
    id: 'fw-negotiation',
    competency: 'ownership',
    title: 'Offer Conversation',
    prompt: 'What is the best default posture in compensation discussions?',
    answer:
      'Be direct and warm. Confirm enthusiasm, ask for the full package context, present your calibrated range, and pause instead of over-explaining.'
  }
] as const;

export const STAR_PROMPTS: readonly StoryPrompt[] = [
  { id: 'sp-story-1', competency: 'storytelling', prompt: 'A moment you took a messy story and made it simple enough to win support.' },
  { id: 'sp-story-2', competency: 'storytelling', prompt: 'A project where your communication changed the outcome.' },
  { id: 'sp-story-3', competency: 'storytelling', prompt: 'A time you translated complexity for an executive or customer.' },
  { id: 'sp-lead-1', competency: 'leadership', prompt: 'A high-stakes decision you made when the path was not obvious.' },
  { id: 'sp-lead-2', competency: 'leadership', prompt: 'A moment you set a higher bar and got others to follow it.' },
  { id: 'sp-lead-3', competency: 'leadership', prompt: 'A time you influenced direction without formal authority.' },
  { id: 'sp-own-1', competency: 'ownership', prompt: 'A project that slipped toward failure and how you recovered it.' },
  { id: 'sp-own-2', competency: 'ownership', prompt: 'A time you noticed a gap that was not technically your job and closed it.' },
  { id: 'sp-own-3', competency: 'ownership', prompt: 'A stretch goal you delivered with limited time or resources.' },
  { id: 'sp-prob-1', competency: 'problem_solving', prompt: 'A vague problem you turned into a clear decision framework.' },
  { id: 'sp-prob-2', competency: 'problem_solving', prompt: 'A tradeoff where the obvious answer was wrong.' },
  { id: 'sp-prob-3', competency: 'problem_solving', prompt: 'A time data changed your initial point of view.' },
  { id: 'sp-stake-1', competency: 'stakeholder_management', prompt: 'A difficult partner conversation that ended with alignment.' },
  { id: 'sp-stake-2', competency: 'stakeholder_management', prompt: 'A conflict where you protected the relationship and the result.' },
  { id: 'sp-stake-3', competency: 'stakeholder_management', prompt: 'A moment you got buy-in from a skeptical stakeholder.' },
  { id: 'sp-adapt-1', competency: 'adaptability', prompt: 'A time priorities shifted suddenly and you had to re-plan fast.' },
  { id: 'sp-adapt-2', competency: 'adaptability', prompt: 'A real failure that changed how you now operate.' },
  { id: 'sp-adapt-3', competency: 'adaptability', prompt: 'A domain or tool you learned quickly under pressure.' },
  { id: 'sp-tech-1', competency: 'technical_depth', prompt: 'A technically difficult project where your architecture choice mattered.' },
  { id: 'sp-tech-2', competency: 'technical_depth', prompt: 'A time you removed major complexity from a system or process.' },
  { id: 'sp-tech-3', competency: 'technical_depth', prompt: 'A deep-dive story that shows how you think about reliability or scale.' }
] as const;

export const GAME_DAY_CHECKLIST: readonly PlaybookChecklistItem[] = [
  {
    id: 'check-role-thesis',
    phase: '48_hours',
    title: 'Write the role thesis',
    detail: 'Summarize why you fit this specific role in three sharp sentences.'
  },
  {
    id: 'check-star-bank',
    phase: '48_hours',
    title: 'Rehearse six STAR stories',
    detail: 'Cover leadership, conflict, failure, ambiguity, ownership, and impact.'
  },
  {
    id: 'check-research',
    phase: '48_hours',
    title: 'Research the business',
    detail: 'Know the product, customer, market pressure, and why the role matters now.'
  },
  {
    id: 'check-questions',
    phase: '48_hours',
    title: 'Prepare questions to ask',
    detail: 'Bring at least four non-generic questions calibrated to the stage.'
  },
  {
    id: 'check-logistics',
    phase: '60_minutes',
    title: 'Clear the environment',
    detail: 'Camera, sound, lighting, charger, resume, notes, and water.'
  },
  {
    id: 'check-proof-points',
    phase: '60_minutes',
    title: 'Review proof points',
    detail: 'Memorize the numbers, deltas, and stakes tied to your top stories.'
  },
  {
    id: 'check-energy',
    phase: '60_minutes',
    title: 'Set energy level',
    detail: 'Breathe, slow down, and speak at 85% of your normal pace.'
  },
  {
    id: 'check-followup',
    phase: 'post_round',
    title: 'Send a sharp follow-up',
    detail: 'Reflect one concrete team need you heard and why you can solve it.'
  }
] as const;

export const SMART_QUESTIONS: readonly SmartQuestion[] = [
  {
    id: 'sq-success',
    group: 'success',
    prompt: 'What would make you say this hire is clearly successful six months from now?'
  },
  {
    id: 'sq-priority',
    group: 'role',
    prompt: 'What is the most important problem this person must make less painful right away?'
  },
  {
    id: 'sq-team',
    group: 'team',
    prompt: 'Where does the team currently create leverage well, and where does it lose momentum?'
  },
  {
    id: 'sq-stakeholders',
    group: 'team',
    prompt: 'Which cross-functional relationships matter most for this role to work?'
  },
  {
    id: 'sq-leadership',
    group: 'leadership',
    prompt: 'How are hard decisions made here when data is incomplete or teams disagree?'
  },
  {
    id: 'sq-standards',
    group: 'leadership',
    prompt: 'What standards separate strong performers from average performers on this team?'
  },
  {
    id: 'sq-scope',
    group: 'role',
    prompt: 'How do you expect this role to evolve if things go well in the first year?'
  },
  {
    id: 'sq-roadblocks',
    group: 'success',
    prompt: 'What tends to slow this team down today that you hope this hire can help unblock?'
  }
] as const;

export const INTERVIEW_QUESTIONS: readonly InterviewQuestion[] = AMAZON_INTERVIEW_QUESTION_BANK_RAW.map((question) => {
  const category = INTERVIEW_QUESTION_CATEGORY_LOOKUP[question.sourceCategoryId];

  if (!category) {
    throw new Error(`Missing interview question category: ${question.sourceCategoryId}`);
  }

  return {
    ...question,
    competency: category.signalLane,
    signalLane: category.signalLane,
    listenFors: category.defaultListenFors,
    companyTrack: 'amazon'
  } satisfies InterviewQuestion;
});

const INTERVIEW_QUESTION_LOOKUP = Object.fromEntries(INTERVIEW_QUESTIONS.map((question) => [question.id, question])) as Record<
  string,
  InterviewQuestion
>;

export function getInterviewQuestionById(questionId: string): InterviewQuestion | null {
  return INTERVIEW_QUESTION_LOOKUP[questionId] ?? null;
}

const HISTORY_LIMIT = 24;
const STORY_LIMIT = 12;
const DAY_MS = 24 * 60 * 60 * 1000;
const FILLER_PATTERN = /\b(um+|uh+|like|you know|sort of|kind of|basically|literally|i guess|maybe|honestly)\b/gi;
const OWNERSHIP_PATTERN = /\b(i|me|my|mine)\b/gi;
const TEAM_PATTERN = /\b(we|our|us)\b/gi;
const DECISION_PATTERN =
  /\b(i (?:decided|chose|led|owned|drove|created|rebuilt|aligned|escalated|cut|prioritized|changed|implemented|shipped|reframed|set|designed))\b/gi;
const TRADEOFF_PATTERN =
  /\b(tradeoff|trade-off|constraint|risk|priority|prioritized|balanced|because|instead|chose|decision|scope|timeline|debt|option)\b/gi;
const OUTCOME_PATTERN =
  /\b(result|outcome|impact|improved|improve|reduced|reduce|increased|increase|saved|delivered|launched|grew|won|retention|revenue|latency|churn|quality|reliability|downtime)\b/gi;
const LESSON_PATTERN = /\b(learned|would do differently|next time|since then|now i|after that|changed how i)\b/gi;
const STRUCTURE_PATTERN = /\b(first|then|next|after that|once|ultimately|in the end|as a result)\b/gi;
const STAKES_PATTERN =
  /\b(deadline|launch|customer|revenue|risk|defect|retention|incident|timeline|scope|quality|growth|quota|migration|downtime)\b/gi;
const ALIGNMENT_PATTERN =
  /\b(stakeholder|partner|design|product|engineering|sales|ops|support|finance|legal|aligned|alignment|buy-in|consensus|trust)\b/gi;
const ADAPTABILITY_PATTERN = /\b(changed|pivot|replanned|learned|ramped|adapted|reset|course-corrected)\b/gi;
const TECHNICAL_PATTERN = /\b(system|architecture|service|database|api|latency|throughput|scale|scaling|reliability|incident|pipeline)\b/gi;

function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isValidDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(new Date(value).getTime());
}

function clampCount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function uniqueStrings(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }
  return [...new Set(values.filter((value): value is string => typeof value === 'string' && value.trim().length > 0))];
}

function getInitialCompetencyStats(): CompetencyStats {
  return INTERVIEW_COMPETENCIES.reduce((result, competency) => {
    result[competency.id] = { attempted: 0, solid: 0, strong: 0 };
    return result;
  }, {} as CompetencyStats);
}

function getInitialStoryCoverage(): Record<CompetencyId, number> {
  return INTERVIEW_COMPETENCIES.reduce((result, competency) => {
    result[competency.id] = 0;
    return result;
  }, {} as Record<CompetencyId, number>);
}

function getInitialQuestionCategoryCoverage(): Record<string, number> {
  return INTERVIEW_QUESTION_CATEGORIES.reduce((result, category) => {
    result[category.id] = 0;
    return result;
  }, {} as Record<string, number>);
}

function touchPracticeDay(progress: InterviewPrepProgress, now: Date): InterviewPrepProgress {
  const dayKey = toDayKey(now);

  if (progress.lastPracticeDate === dayKey) {
    return {
      ...progress,
      updatedAt: now.toISOString()
    };
  }

  let nextStreak = 1;

  if (progress.lastPracticeDate) {
    const previousDay = new Date(`${progress.lastPracticeDate}T00:00:00.000Z`);
    const currentDay = new Date(`${dayKey}T00:00:00.000Z`);
    const diffDays = Math.round((currentDay.getTime() - previousDay.getTime()) / DAY_MS);

    if (diffDays === 1) {
      nextStreak = progress.streak + 1;
    } else if (diffDays <= 0) {
      nextStreak = progress.streak;
    }
  }

  return {
    ...progress,
    streak: nextStreak,
    lastPracticeDate: dayKey,
    updatedAt: now.toISOString()
  };
}

function countWords(value: string): number {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function countMatches(value: string, pattern: RegExp): number {
  const matches = value.match(pattern);
  return matches ? matches.length : 0;
}

function countMetrics(value: string): number {
  return countMatches(value, /\b(\d+%|\$?\d[\d,.]*|hours?\b|days?\b|weeks?\b|months?\b|years?\b|users?\b|customers?\b|tickets?\b)\b/gi);
}

function hasMetric(value: string): boolean {
  return countMetrics(value) > 0 || /\bx\b/i.test(value);
}

function averageWordsPerSentence(value: string): number {
  const sentences = value
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (!sentences.length) {
    return 0;
  }

  return sentences.reduce((sum, sentence) => sum + countWords(sentence), 0) / sentences.length;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function inferVerdict(score: number): BarRaiserVerdict {
  if (score >= 85) {
    return 'bar_raiser';
  }
  if (score >= 70) {
    return 'hire_signal';
  }
  if (score >= 55) {
    return 'borderline';
  }
  return 'below_bar';
}

function getVerdictLabel(verdict: BarRaiserVerdict): string {
  switch (verdict) {
    case 'bar_raiser':
      return 'Bar raiser';
    case 'hire_signal':
      return 'Hire signal';
    case 'borderline':
      return 'Borderline';
    default:
      return 'Below bar';
  }
}

function getReviewRating(score: number): DrillRating {
  if (score >= 84) {
    return 'strong';
  }
  if (score >= 68) {
    return 'solid';
  }
  return 'needs_work';
}

function scoreStructure(answer: string): AnswerReviewDimension {
  const words = countWords(answer);
  const sentences = answer
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean).length;

  let score = 24;

  if (words >= 90 && words <= 220) {
    score += 32;
  } else if (words >= 65 && words <= 260) {
    score += 22;
  } else if (words >= 45 && words <= 320) {
    score += 10;
  }

  if (sentences >= 3) {
    score += 12;
  }
  if (countMatches(answer, STRUCTURE_PATTERN) >= 1) {
    score += 14;
  }
  if (countMatches(answer, OUTCOME_PATTERN) >= 1) {
    score += 18;
  }
  if (words > 320) {
    score -= 18;
  }
  if (words < 45) {
    score -= 10;
  }

  const note =
    score >= 75
      ? 'The answer has a usable arc instead of sounding improvised.'
      : 'Tighten the sequence so the interviewer hears stakes, action, and outcome faster.';

  return {
    id: 'structure',
    label: 'Structure',
    score: clampScore(score),
    note
  };
}

function scoreOwnership(answer: string): AnswerReviewDimension {
  const iCount = countMatches(answer, OWNERSHIP_PATTERN);
  const teamCount = countMatches(answer, TEAM_PATTERN);
  const decisionSignals = countMatches(answer, DECISION_PATTERN);

  let score = 18;

  if (iCount >= 5) {
    score += 32;
  } else if (iCount >= 3) {
    score += 24;
  } else if (iCount >= 1) {
    score += 10;
  }

  if (decisionSignals >= 1) {
    score += 24;
  }
  if (/\b(responsible|owned|accountable|driver|lead)\b/i.test(answer)) {
    score += 14;
  }
  if (iCount === 0) {
    score -= 20;
  }
  if (teamCount > iCount * 2 && iCount < 4) {
    score -= 12;
  }

  const note =
    score >= 75
      ? 'Your personal contribution is visible instead of buried inside team language.'
      : 'Say what you personally decided, drove, or changed. Right now ownership is too easy to question.';

  return {
    id: 'ownership',
    label: 'Ownership',
    score: clampScore(score),
    note
  };
}

function scoreEvidence(answer: string): AnswerReviewDimension {
  const metricsCount = countMetrics(answer);
  const stakesSignals = countMatches(answer, STAKES_PATTERN);
  const outcomeSignals = countMatches(answer, OUTCOME_PATTERN);

  let score = 15;

  if (metricsCount >= 2) {
    score += 36;
  } else if (metricsCount === 1) {
    score += 24;
  }
  if (stakesSignals >= 2) {
    score += 14;
  } else if (stakesSignals >= 1) {
    score += 8;
  }
  if (outcomeSignals >= 2) {
    score += 18;
  } else if (outcomeSignals >= 1) {
    score += 10;
  }
  if (/\b(from\b.+\bto\b|reduced|increased|cut|grew|saved|avoided)\b/i.test(answer)) {
    score += 12;
  }

  const note =
    score >= 75
      ? 'You are proving the story with stakes and outcomes instead of asking for trust.'
      : 'Add hard proof. A bar raiser will look for a number, delta, scope, or risk reduction.';

  return {
    id: 'evidence',
    label: 'Evidence',
    score: clampScore(score),
    note
  };
}

function scoreJudgment(question: InterviewQuestion, answer: string): AnswerReviewDimension {
  const tradeoffSignals = countMatches(answer, TRADEOFF_PATTERN);
  const lessonSignals = countMatches(answer, LESSON_PATTERN);

  let score = 15;

  if (tradeoffSignals >= 3) {
    score += 32;
  } else if (tradeoffSignals >= 1) {
    score += 20;
  }
  if (/\b(because|so that|therefore|which meant)\b/i.test(answer)) {
    score += 14;
  }
  if (lessonSignals >= 1) {
    score += 18;
  }

  switch (question.competency) {
    case 'leadership':
    case 'ownership':
    case 'problem_solving':
    case 'technical_depth':
      score += tradeoffSignals >= 1 ? 12 : -12;
      break;
    case 'stakeholder_management':
      score += countMatches(answer, ALIGNMENT_PATTERN) >= 1 ? 14 : -10;
      break;
    case 'adaptability':
      score += countMatches(answer, ADAPTABILITY_PATTERN) >= 1 ? 14 : -10;
      break;
    case 'storytelling':
      score += /\b(why this|why here|this role|background|experience)\b/i.test(answer) ? 12 : 0;
      break;
    default:
      break;
  }

  const note =
    score >= 75
      ? 'The answer shows why you made the call, not just what happened.'
      : 'Show your tradeoff logic and the lesson you took forward. That is where seniority shows up.';

  return {
    id: 'judgment',
    label: 'Judgment',
    score: clampScore(score),
    note
  };
}

function scoreDelivery(answer: string): AnswerReviewDimension {
  const fillerCount = countMatches(answer, FILLER_PATTERN);
  const words = countWords(answer);
  const sentenceAverage = averageWordsPerSentence(answer);

  let score = 92 - fillerCount * 9;

  if (sentenceAverage > 28) {
    score -= 10;
  }
  if (words > 260) {
    score -= 12;
  }
  if (words < 50) {
    score -= 10;
  }
  if (/\b(really|very|super)\b/i.test(answer)) {
    score -= 4;
  }

  const note =
    score >= 78
      ? 'Delivery is direct enough that the substance gets room to land.'
      : 'Cut the hedge words and tighten long sentences so confidence reads immediately.';

  return {
    id: 'delivery',
    label: 'Delivery',
    score: clampScore(score),
    note
  };
}

function sectionScore(text: string, minWords: number): number {
  return Math.min(1, countWords(text) / minWords);
}

function sanitizeStoryDraft(input: Partial<StoryDraft>): StoryDraft {
  return {
    id: typeof input.id === 'string' ? input.id : undefined,
    competency: isCompetencyId(input.competency) ? input.competency : INTERVIEW_COMPETENCIES[0].id,
    categoryTags: uniqueStrings(input.categoryTags).filter((categoryId) => isQuestionCategoryId(categoryId)),
    title: typeof input.title === 'string' ? input.title.trim() : '',
    situation: typeof input.situation === 'string' ? input.situation.trim() : '',
    task: typeof input.task === 'string' ? input.task.trim() : '',
    action: typeof input.action === 'string' ? input.action.trim() : '',
    result: typeof input.result === 'string' ? input.result.trim() : '',
    reflection: typeof input.reflection === 'string' ? input.reflection.trim() : ''
  };
}

function sanitizePitch(input: Partial<PitchPack>): PitchPack {
  return {
    present: typeof input.present === 'string' ? input.present.trim() : '',
    proof: typeof input.proof === 'string' ? input.proof.trim() : '',
    future: typeof input.future === 'string' ? input.future.trim() : '',
    whyHere: typeof input.whyHere === 'string' ? input.whyHere.trim() : ''
  };
}

function sanitizeDrillStat(input: unknown): DrillStat {
  if (!input || typeof input !== 'object') {
    return { attempted: 0, solid: 0, strong: 0 };
  }

  const attempted = clampCount((input as { attempted?: unknown }).attempted);
  const strong = Math.min(attempted, clampCount((input as { strong?: unknown }).strong));
  const solid = Math.min(attempted - strong, clampCount((input as { solid?: unknown }).solid));

  return { attempted, solid, strong };
}

function sanitizeCompetencyStats(input: unknown): CompetencyStats {
  const initial = getInitialCompetencyStats();

  if (!input || typeof input !== 'object') {
    return initial;
  }

  for (const competency of INTERVIEW_COMPETENCIES) {
    initial[competency.id] = sanitizeDrillStat((input as Record<string, unknown>)[competency.id]);
  }

  return initial;
}

function isDrillRating(value: unknown): value is DrillRating {
  return value === 'needs_work' || value === 'solid' || value === 'strong';
}

export function isCompetencyId(value: unknown): value is CompetencyId {
  return INTERVIEW_COMPETENCIES.some((competency) => competency.id === value);
}

export function getCompetencyById(competencyId: CompetencyId): (typeof INTERVIEW_COMPETENCIES)[number] {
  return INTERVIEW_COMPETENCIES.find((competency) => competency.id === competencyId) ?? INTERVIEW_COMPETENCIES[0];
}

export function createEmptyStoryDraft(competency: CompetencyId = 'storytelling', categoryTags: string[] = []): StoryDraft {
  return {
    competency,
    categoryTags: categoryTags.filter((categoryId) => isQuestionCategoryId(categoryId)),
    title: '',
    situation: '',
    task: '',
    action: '',
    result: '',
    reflection: ''
  };
}

export function scoreStarStory(story: Partial<StoryDraft>): number {
  const safe = sanitizeStoryDraft(story);
  const titleScore = safe.title.length >= 8 ? 0.08 : safe.title.length >= 1 ? 0.04 : 0;
  const situationScore = 0.17 * sectionScore(safe.situation, 14);
  const taskScore = 0.13 * sectionScore(safe.task, 8);
  const actionScore = 0.33 * sectionScore(safe.action, 24);
  const resultScore = 0.21 * sectionScore(safe.result, 12);
  const reflectionScore = 0.08 * sectionScore(safe.reflection, 8);
  const metricBonus = hasMetric(safe.result) ? 0.08 : 0;

  return Math.round((titleScore + situationScore + taskScore + actionScore + resultScore + reflectionScore + metricBonus) * 100);
}

export function buildStarCoachTips(story: Partial<StoryDraft>): string[] {
  const safe = sanitizeStoryDraft(story);
  const tips: string[] = [];

  if (safe.title.length < 8) {
    tips.push('Give the story a specific title so you can recall it instantly in an interview loop.');
  }
  if (countWords(safe.situation) < 10) {
    tips.push('Add just enough context in Situation so the stakes make sense without slowing the answer down.');
  }
  if (countWords(safe.task) < 6) {
    tips.push('Clarify your exact task or responsibility so the interviewer knows what you owned.');
  }
  if (countWords(safe.action) < 20) {
    tips.push('Make Action the longest section. This is where your judgment, sequencing, and leadership show up.');
  }
  if (!hasMetric(safe.result)) {
    tips.push('Quantify the result with a delta, time saved, revenue, quality gain, or risk reduced.');
  }
  if (countWords(safe.reflection) < 6) {
    tips.push('Add a short reflection to show what changed in how you now operate.');
  }
  if (countWords(safe.situation) > countWords(safe.action) && countWords(safe.situation) > 30) {
    tips.push('Trim the setup. Too much backstory weakens the signal of what you actually did.');
  }

  return tips.slice(0, 4);
}

export function reviewInterviewAnswer(question: InterviewQuestion, answer: string): InterviewAnswerReview {
  const normalizedAnswer = answer.trim();
  const wordCount = countWords(normalizedAnswer);
  const fillerCount = countMatches(normalizedAnswer, FILLER_PATTERN);
  const metricsCount = countMetrics(normalizedAnswer);

  const dimensions = [
    scoreStructure(normalizedAnswer),
    scoreOwnership(normalizedAnswer),
    scoreEvidence(normalizedAnswer),
    scoreJudgment(question, normalizedAnswer),
    scoreDelivery(normalizedAnswer)
  ];

  const score = clampScore(
    dimensions.reduce((sum, dimension) => {
      const weights: Record<AnswerReviewDimension['id'], number> = {
        structure: 0.24,
        ownership: 0.22,
        evidence: 0.22,
        judgment: 0.18,
        delivery: 0.14
      };

      return sum + dimension.score * weights[dimension.id];
    }, 0)
  );
  const verdict = inferVerdict(score);
  const strengths: string[] = [];
  const misses: string[] = [];
  const followUps = [...question.followUps];
  const rewriteMoves: string[] = [];

  if (dimensions[0].score >= 75) {
    strengths.push('The answer has a clear shape instead of wandering.');
  } else {
    misses.push('The story does not land fast enough. Lead with the stakes, then move quickly into your action.');
    rewriteMoves.push('Open with one sentence on the problem, one on your mandate, then spend most of the answer on what you changed.');
  }

  if (dimensions[1].score >= 75) {
    strengths.push('Ownership is visible. The interviewer can point to what you personally drove.');
  } else {
    misses.push('Ownership is blurred by team language. Make your decisions and interventions impossible to miss.');
    followUps.push('What happened because of you specifically, not just because the team worked hard?');
    rewriteMoves.push('Swap vague "we" language for the two or three moves you personally led, chose, or escalated.');
  }

  if (dimensions[2].score >= 75) {
    strengths.push('You are backing the answer with evidence instead of asking for benefit of the doubt.');
  } else {
    misses.push('The proof is too soft. Add one number, one delta, or one concrete scope marker.');
    followUps.push('What is the single number or delta that proves this answer matters?');
    rewriteMoves.push('Close with a measured result: revenue, time saved, quality gain, risk reduced, or customer impact.');
  }

  if (dimensions[3].score >= 72) {
    strengths.push('Your reasoning is visible, which makes the answer sound senior.');
  } else {
    misses.push('Judgment is underpowered. Explain the tradeoff, why you chose that path, and what risk you accepted.');
    followUps.push('What tradeoff did you accept, and why was that the right call at the time?');
    rewriteMoves.push('Add one sentence that starts with "I chose X instead of Y because..." so your judgment is explicit.');
  }

  if (dimensions[4].score >= 78) {
    strengths.push('The delivery is clean enough that confidence reads through the wording.');
  } else {
    misses.push('The delivery is hedged or overlong. Fewer filler words and shorter sentences will raise confidence fast.');
    followUps.push('Can you answer the same prompt again in 90 seconds without hedge words?');
    rewriteMoves.push('Trim filler phrases like "kind of," "basically," or "maybe" and aim for a tighter 90-120 second take.');
  }

  switch (question.competency) {
    case 'leadership':
      if (!/\b(decision|aligned|tradeoff|standard)\b/i.test(normalizedAnswer)) {
        misses.push('For a leadership answer, I still do not hear the decision, the alignment move, and the standard you enforced.');
      }
      break;
    case 'ownership':
      if (!/\b(mistake|repair|changed|owned|escalated)\b/i.test(normalizedAnswer)) {
        misses.push('For ownership, the answer needs a sharper moment where you stepped in, repaired, or took accountability.');
      }
      break;
    case 'problem_solving':
      if (!/\b(assumption|option|decision|hypothesis)\b/i.test(normalizedAnswer)) {
        misses.push('For problem solving, spell out the frame: assumptions, options, and the decision rule.');
      }
      break;
    case 'stakeholder_management':
      if (!/\b(stakeholder|partner|trust|alignment|buy-in)\b/i.test(normalizedAnswer)) {
        misses.push('For stakeholder management, show the human dynamic, not just the project mechanics.');
      }
      break;
    case 'adaptability':
      if (!/\b(pivot|changed|learned|reset)\b/i.test(normalizedAnswer)) {
        misses.push('For adaptability, make the pivot explicit and explain how you regained control.');
      }
      break;
    case 'technical_depth':
      if (!/\b(system|architecture|constraint|tradeoff|scale)\b/i.test(normalizedAnswer)) {
        misses.push('For technical depth, name the system, the constraint, and the tradeoff instead of keeping it abstract.');
      }
      break;
    case 'storytelling':
      if (!/\b(role|company|impact|experience|background)\b/i.test(normalizedAnswer)) {
        misses.push('For storytelling, the answer still needs a clearer through-line tying your background to this role.');
      }
      break;
    default:
      break;
  }

  if (wordCount < 55) {
    misses.push('This answer is too short to prove range. Expand it until the stakes, action, and result all show up.');
  } else if (wordCount > 280) {
    misses.push('This answer is too long for a first pass. Cut backstory and keep the energy in the action section.');
  }

  if (metricsCount === 0) {
    followUps.push('What changed in a way another person could verify?');
  }
  if (fillerCount >= 3) {
    misses.push('The filler words will read as uncertainty in a live interview. Clean them up before the next rep.');
  }

  const summary =
    verdict === 'bar_raiser'
      ? 'This clears a high bar. The answer is specific, owned, and backed by proof.'
      : verdict === 'hire_signal'
        ? 'This is competitive, but there is still room to sharpen proof or decision quality.'
        : verdict === 'borderline'
          ? 'This might survive a friendly interview, but it will struggle with a tough follow-up.'
          : 'This is below the bar right now. The answer sounds experienced, but the signal is not yet interview-grade.';

  return {
    score,
    rating: getReviewRating(score),
    verdict,
    verdictLabel: getVerdictLabel(verdict),
    summary,
    wordCount,
    fillerCount,
    metricsCount,
    dimensions,
    strengths: strengths.slice(0, 4),
    misses: [...new Set(misses)].slice(0, 6),
    followUps: [...new Set(followUps)].slice(0, 4),
    rewriteMoves: [...new Set(rewriteMoves)].slice(0, 4)
  };
}

export function buildStoryPressureTest(story: Partial<StoryDraft>): StoryPressureTest {
  const safe = sanitizeStoryDraft(story);
  const strengths: string[] = [];
  const vulnerabilities: string[] = [];
  const pressureQuestions: string[] = [];
  const upgradeMoves: string[] = [];

  if (countWords(safe.action) >= 24) {
    strengths.push('The Action section has enough room to show actual judgment.');
  } else {
    vulnerabilities.push('The Action section is still too thin. A hard interviewer will not hear enough decision quality yet.');
    upgradeMoves.push('Expand Action with the sequence you drove, the tradeoff you made, and the people you aligned.');
  }

  if (hasMetric(safe.result)) {
    strengths.push('The result includes proof, which gives the story credibility.');
  } else {
    vulnerabilities.push('The result is soft. If someone asks "how much did it matter?" the story will wobble.');
    pressureQuestions.push('What is the clearest number, delta, or risk reduction tied to this story?');
    upgradeMoves.push('Replace a generic outcome with a measurable one: time saved, quality gained, revenue moved, or risk reduced.');
  }

  if (countWords(safe.situation) > countWords(safe.action) && countWords(safe.situation) > 24) {
    vulnerabilities.push('The setup is overweight. Too much context delays the part that proves how you operate.');
    upgradeMoves.push('Trim Situation to the stakes and context only. Move the saved words into the Action section.');
  }

  if (!/\b(i|my|me)\b/i.test(`${safe.task} ${safe.action}`)) {
    vulnerabilities.push('Ownership is blurry. The story still sounds like something a team did, not something you drove.');
    pressureQuestions.push('What would your manager say you personally changed in this situation?');
  } else {
    strengths.push('Ownership comes through clearly enough that the story sounds personal, not generic.');
  }

  if (!countMatches(safe.action, TRADEOFF_PATTERN)) {
    vulnerabilities.push('The story has motion but not tradeoff quality. Senior stories usually include the hard call.');
    pressureQuestions.push('What was the hardest tradeoff you made, and what risk did you accept?');
    upgradeMoves.push('Add one decision sentence that makes the tradeoff explicit.');
  }

  if (countWords(safe.reflection) < 6) {
    vulnerabilities.push('Reflection is undercooked. Without the lesson, the story does not show growth or self-awareness.');
    pressureQuestions.push('What changed in how you operate after this experience?');
    upgradeMoves.push('End with one operational lesson you still use today.');
  } else {
    strengths.push('The reflection gives the story a stronger leadership signal.');
  }

  switch (safe.competency) {
    case 'leadership':
      pressureQuestions.push('Where did you raise the standard instead of just keeping the project moving?');
      break;
    case 'ownership':
      pressureQuestions.push('What did you do first once you realized the situation could fail?');
      break;
    case 'problem_solving':
      pressureQuestions.push('Which assumption mattered most, and how did you test it?');
      break;
    case 'stakeholder_management':
      pressureQuestions.push('How did the relationship look after the disagreement or tension?');
      break;
    case 'adaptability':
      pressureQuestions.push('What was your reset move when the original plan stopped working?');
      break;
    case 'technical_depth':
      if (!countMatches(safe.action, TECHNICAL_PATTERN) && !countMatches(safe.result, TECHNICAL_PATTERN)) {
        vulnerabilities.push('The technical signal is still generic. Name the system or constraint more concretely.');
        upgradeMoves.push('Add the key system constraint, architecture choice, or failure mode you had to manage.');
      }
      pressureQuestions.push('Which technical tradeoff would you revisit if you rebuilt this now?');
      break;
    default:
      pressureQuestions.push('Why does this story make you especially credible for the role you want next?');
      break;
  }

  const baseScore = scoreStarStory(safe);
  const score = clampScore(baseScore - vulnerabilities.length * 5 + strengths.length * 2);

  return {
    score,
    strengths: strengths.slice(0, 4),
    vulnerabilities: vulnerabilities.slice(0, 6),
    pressureQuestions: [...new Set(pressureQuestions)].slice(0, 4),
    upgradeMoves: [...new Set(upgradeMoves)].slice(0, 4)
  };
}

export function buildPitchPreview(pitch: Partial<PitchPack>): string {
  const safe = sanitizePitch(pitch);
  return [safe.present, safe.proof, safe.future, safe.whyHere].filter(Boolean).join(' ');
}

export function createInitialInterviewProgress(now: Date = new Date()): InterviewPrepProgress {
  const isoNow = now.toISOString();

  return {
    version: 1,
    createdAt: isoNow,
    updatedAt: isoNow,
    streak: 0,
    lastPracticeDate: null,
    masteredCardIds: [],
    questionStats: {},
    competencyStats: getInitialCompetencyStats(),
    drillHistory: [],
    stories: [],
    pitch: {
      present: '',
      proof: '',
      future: '',
      whyHere: ''
    },
    checklistDoneIds: []
  };
}

export function coerceInterviewProgress(value: unknown): InterviewPrepProgress | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const fallback = createInitialInterviewProgress();
  const input = value as Record<string, unknown>;

  const questionStats =
    input.questionStats && typeof input.questionStats === 'object'
      ? Object.fromEntries(
          Object.entries(input.questionStats as Record<string, unknown>)
            .filter(([key]) => typeof key === 'string' && key.length > 0)
            .map(([key, raw]) => [key, sanitizeDrillStat(raw)])
        )
      : {};

  const stories = Array.isArray(input.stories)
    ? input.stories
        .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === 'object')
        .map((entry) => {
          const story = sanitizeStoryDraft(entry);
          if (!story.title && !story.situation && !story.action && !story.result) {
            return null;
          }

          return {
            ...story,
            id: typeof entry.id === 'string' && entry.id.trim().length > 0 ? entry.id : `story-${Math.random().toString(36).slice(2, 9)}`,
            updatedAt: isValidDate(entry.updatedAt) ? entry.updatedAt : fallback.updatedAt
          } satisfies StarStory;
        })
        .filter((entry): entry is StarStory => entry !== null)
        .slice(0, STORY_LIMIT)
    : [];

  const drillHistory = Array.isArray(input.drillHistory)
    ? input.drillHistory
        .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === 'object')
        .filter(
          (entry) =>
            isValidDate(entry.date) &&
            typeof entry.questionId === 'string' &&
            isCompetencyId(entry.competency) &&
            isDrillRating(entry.rating)
        )
        .map((entry) => {
          const linkedQuestion = INTERVIEW_QUESTIONS.find((question) => question.id === entry.questionId);

          return {
            date: entry.date as string,
            questionId: entry.questionId as string,
            competency: entry.competency as CompetencyId,
            rating: entry.rating as DrillRating,
            sourceFamily: isInterviewSourceFamily(entry.sourceFamily)
              ? entry.sourceFamily
              : linkedQuestion?.sourceFamily,
            sourceCategoryId:
              typeof entry.sourceCategoryId === 'string' && entry.sourceCategoryId.length > 0
                ? entry.sourceCategoryId
                : linkedQuestion?.sourceCategoryId,
            sourceCategoryLabel:
              typeof entry.sourceCategoryLabel === 'string' && entry.sourceCategoryLabel.length > 0
                ? entry.sourceCategoryLabel
                : linkedQuestion?.sourceCategoryLabel,
            managerOnly: typeof entry.managerOnly === 'boolean' ? entry.managerOnly : linkedQuestion?.managerOnly
          };
        })
        .slice(0, HISTORY_LIMIT)
    : [];

  return {
    version: 1,
    createdAt: isValidDate(input.createdAt) ? input.createdAt : fallback.createdAt,
    updatedAt: isValidDate(input.updatedAt) ? input.updatedAt : fallback.updatedAt,
    streak: clampCount(input.streak),
    lastPracticeDate: isValidDate(input.lastPracticeDate) ? String(input.lastPracticeDate).slice(0, 10) : null,
    masteredCardIds: uniqueStrings(input.masteredCardIds).filter((id) => FRAMEWORK_CARDS.some((card) => card.id === id)),
    questionStats,
    competencyStats: sanitizeCompetencyStats(input.competencyStats),
    drillHistory,
    stories,
    pitch: sanitizePitch((input.pitch as Partial<PitchPack>) ?? {}),
    checklistDoneIds: uniqueStrings(input.checklistDoneIds).filter((id) => GAME_DAY_CHECKLIST.some((item) => item.id === id))
  };
}

export function toggleMasteredFramework(
  progress: InterviewPrepProgress,
  cardId: string,
  mastered: boolean,
  now: Date = new Date()
): InterviewPrepProgress {
  const nextIds = new Set(progress.masteredCardIds);

  if (mastered) {
    nextIds.add(cardId);
  } else {
    nextIds.delete(cardId);
  }

  return touchPracticeDay(
    {
      ...progress,
      masteredCardIds: [...nextIds]
    },
    now
  );
}

export function updatePitchPack(
  progress: InterviewPrepProgress,
  updates: Partial<PitchPack>,
  now: Date = new Date()
): InterviewPrepProgress {
  return touchPracticeDay(
    {
      ...progress,
      pitch: {
        ...progress.pitch,
        ...sanitizePitch(updates)
      }
    },
    now
  );
}

export function toggleChecklistItem(
  progress: InterviewPrepProgress,
  itemId: string,
  done: boolean,
  now: Date = new Date()
): InterviewPrepProgress {
  const nextIds = new Set(progress.checklistDoneIds);

  if (done) {
    nextIds.add(itemId);
  } else {
    nextIds.delete(itemId);
  }

  return touchPracticeDay(
    {
      ...progress,
      checklistDoneIds: [...nextIds]
    },
    now
  );
}

export function saveStarStory(
  progress: InterviewPrepProgress,
  storyInput: Partial<StoryDraft>,
  now: Date = new Date(),
  createId: () => string = () => `story-${Math.random().toString(36).slice(2, 10)}`
): InterviewPrepProgress {
  const story = sanitizeStoryDraft(storyInput);
  const id = story.id ?? createId();

  const nextStory: StarStory = {
    ...story,
    id,
    updatedAt: now.toISOString()
  };

  const storyIndex = progress.stories.findIndex((entry) => entry.id === id);
  const nextStories = [...progress.stories];

  if (storyIndex >= 0) {
    nextStories[storyIndex] = nextStory;
  } else {
    nextStories.unshift(nextStory);
  }

  return touchPracticeDay(
    {
      ...progress,
      stories: nextStories
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, STORY_LIMIT)
    },
    now
  );
}

export function deleteStarStory(progress: InterviewPrepProgress, storyId: string, now: Date = new Date()): InterviewPrepProgress {
  return touchPracticeDay(
    {
      ...progress,
      stories: progress.stories.filter((story) => story.id !== storyId)
    },
    now
  );
}

export function recordDrillResult(
  progress: InterviewPrepProgress,
  question: InterviewQuestion,
  rating: DrillRating,
  now: Date = new Date()
): InterviewPrepProgress {
  const previousQuestionStat = progress.questionStats[question.id] ?? { attempted: 0, solid: 0, strong: 0 };
  const previousCompetencyStat = progress.competencyStats[question.competency];

  const questionStat: DrillStat = {
    attempted: previousQuestionStat.attempted + 1,
    solid: previousQuestionStat.solid + (rating === 'solid' ? 1 : 0),
    strong: previousQuestionStat.strong + (rating === 'strong' ? 1 : 0)
  };

  const competencyStat: CompetencyStat = {
    attempted: previousCompetencyStat.attempted + 1,
    solid: previousCompetencyStat.solid + (rating === 'solid' ? 1 : 0),
    strong: previousCompetencyStat.strong + (rating === 'strong' ? 1 : 0)
  };

  return touchPracticeDay(
    {
      ...progress,
      questionStats: {
        ...progress.questionStats,
        [question.id]: questionStat
      },
      competencyStats: {
        ...progress.competencyStats,
        [question.competency]: competencyStat
      },
      drillHistory: [
        {
          date: now.toISOString(),
          questionId: question.id,
          competency: question.competency,
          rating,
          sourceFamily: question.sourceFamily,
          sourceCategoryId: question.sourceCategoryId,
          sourceCategoryLabel: question.sourceCategoryLabel,
          managerOnly: question.managerOnly
        },
        ...progress.drillHistory
      ].slice(0, HISTORY_LIMIT)
    },
    now
  );
}

export function pickDrillQuestions(
  questions: readonly InterviewQuestion[],
  count: number,
  competencies: readonly CompetencyId[],
  random: () => number = Math.random
): InterviewQuestion[] {
  const pool = questions.filter((question) => competencies.includes(question.competency));
  const remaining = [...pool];
  const picked: InterviewQuestion[] = [];

  while (remaining.length > 0 && picked.length < count) {
    const index = Math.floor(random() * remaining.length);
    const [selection] = remaining.splice(index, 1);

    if (selection) {
      picked.push(selection);
    }
  }

  return picked;
}

export function getStoryCoverage(progress: InterviewPrepProgress): Record<CompetencyId, number> {
  return progress.stories.reduce((result, story) => {
    result[story.competency] += 1;
    return result;
  }, getInitialStoryCoverage());
}

export function getStoryCategoryCoverage(progress: InterviewPrepProgress): Record<string, number> {
  return progress.stories.reduce((result, story) => {
    for (const categoryId of story.categoryTags) {
      if (categoryId in result) {
        result[categoryId] += 1;
      }
    }

    return result;
  }, getInitialQuestionCategoryCoverage());
}

export function getCompetencyConfidence(progress: InterviewPrepProgress, competencyId: CompetencyId): number {
  const stats = progress.competencyStats[competencyId];

  if (!stats.attempted) {
    return 0;
  }

  const weighted = stats.strong + stats.solid * 0.7;
  return Math.round((weighted / stats.attempted) * 100);
}

export function getOverallReadiness(progress: InterviewPrepProgress): number {
  const storyCoverageCount = new Set(progress.stories.map((story) => story.competency)).size;
  const storyCoverageScore = storyCoverageCount / INTERVIEW_COMPETENCIES.length;
  const frameworkScore = FRAMEWORK_CARDS.length ? progress.masteredCardIds.length / FRAMEWORK_CARDS.length : 0;
  const drillScore =
    progress.drillHistory.length > 0
      ? progress.drillHistory.reduce((sum, item) => {
          if (item.rating === 'strong') {
            return sum + 1;
          }
          if (item.rating === 'solid') {
            return sum + 0.72;
          }
          return sum + 0.35;
        }, 0) / progress.drillHistory.length
      : 0;
  const pitchFields = Object.values(progress.pitch).filter((value) => value.trim().length > 0).length;
  const pitchScore = pitchFields / Object.keys(progress.pitch).length;
  const checklistScore = GAME_DAY_CHECKLIST.length ? progress.checklistDoneIds.length / GAME_DAY_CHECKLIST.length : 0;

  return Math.round((storyCoverageScore * 0.28 + frameworkScore * 0.18 + drillScore * 0.24 + pitchScore * 0.2 + checklistScore * 0.1) * 100);
}

export function getWeakestCompetency(progress: InterviewPrepProgress): CompetencyId | null {
  let weakest: CompetencyId | null = null;
  let weakestScore = Number.POSITIVE_INFINITY;

  for (const competency of INTERVIEW_COMPETENCIES) {
    const stats = progress.competencyStats[competency.id];
    const storyCount = progress.stories.filter((story) => story.competency === competency.id).length;
    const confidence = stats.attempted > 0 ? getCompetencyConfidence(progress, competency.id) : 20;
    const coverageBonus = Math.min(20, storyCount * 10);
    const score = confidence + coverageBonus;

    if (score < weakestScore) {
      weakest = competency.id;
      weakestScore = score;
    }
  }

  return weakest;
}
