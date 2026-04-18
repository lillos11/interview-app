import { AMAZON_INTERVIEW_QUESTION_BANK_RAW } from "./amazonQuestionBankData";

export const INTERVIEW_STORAGE_KEY = "interview-command-center-v1";

export const INTERVIEW_COMPETENCIES = [
  {
    id: "storytelling",
    title: "Storytelling",
    description:
      "Open with clarity, structure fast, and land outcomes people can remember.",
    cue: "Use strong intros, concise context, and measurable endings.",
  },
  {
    id: "leadership",
    title: "Leadership",
    description:
      "Show direction-setting, judgment, and how you move people through ambiguity.",
    cue: "Highlight decisions, alignment, and standards.",
  },
  {
    id: "ownership",
    title: "Ownership",
    description:
      "Demonstrate accountability, prioritization, and follow-through under pressure.",
    cue: "Make tradeoffs visible and own the hard parts.",
  },
  {
    id: "problem_solving",
    title: "Problem Solving",
    description:
      "Break down unclear problems, pressure-test options, and explain tradeoffs cleanly.",
    cue: "State the frame, options, reasoning, and decision.",
  },
  {
    id: "stakeholder_management",
    title: "Stakeholder Mgmt",
    description:
      "Handle disagreement, influence without authority, and protect momentum.",
    cue: "Name tension, alignment moves, and how trust improved.",
  },
  {
    id: "adaptability",
    title: "Adaptability",
    description:
      "Show learning speed, composure, and how you recover when plans change.",
    cue: "Frame pivots as disciplined responses, not chaos.",
  },
  {
    id: "technical_depth",
    title: "Technical Depth",
    description:
      "Explain architecture, constraints, and execution choices without rambling.",
    cue: "Start with the system goal, then tradeoffs and result.",
  },
] as const;

export type CompetencyId = (typeof INTERVIEW_COMPETENCIES)[number]["id"];
export type DrillRating = "needs_work" | "solid" | "strong";
export type InterviewSourceFamily = "lp" | "functional";
export type CompanyTrack = "amazon";
export type InterviewerLensId =
  | "hrbp"
  | "l6_ops"
  | "l7_bar_raiser"
  | "finance_partner"
  | "tech_lead"
  | "hiring_manager";
export type PrepTabTarget =
  | "cockpit"
  | "star_lab"
  | "drills"
  | "bar_raiser"
  | "executive_coach"
  | "frameworks"
  | "ops_lab"
  | "game_day";

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

export interface PlaybookChecklistItem {
  id: string;
  phase: "48_hours" | "60_minutes" | "post_round";
  title: string;
  detail: string;
}

export interface InterviewStage {
  id: string;
  title: string;
  detail: string;
}

export interface StoryGroundingSnapshot {
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  reflection: string;
}

export interface StoryGrounding {
  kind: "manual" | "prep_bank";
  sourceId?: string;
  sourceLabel: string;
  snapshot: StoryGroundingSnapshot;
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
  grounding: StoryGrounding | null;
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

export type BarRaiserVerdict =
  | "below_bar"
  | "borderline"
  | "hire_signal"
  | "bar_raiser";

export interface InterviewerLens {
  id: InterviewerLensId;
  label: string;
  description: string;
  demands: readonly string[];
  targetDurationSeconds: number;
}

export interface AnswerReviewDimension {
  id: "structure" | "ownership" | "evidence" | "judgment" | "delivery";
  label: string;
  score: number;
  note: string;
}

export interface InterviewAnswerReview {
  score: number;
  rating: DrillRating;
  verdict: BarRaiserVerdict;
  verdictLabel: string;
  interviewerLens: InterviewerLensId;
  interviewerLabel: string;
  interviewerExpectations: string[];
  summary: string;
  wordCount: number;
  fillerCount: number;
  metricsCount: number;
  dimensions: AnswerReviewDimension[];
  strengths: string[];
  misses: string[];
  followUps: string[];
  rewriteMoves: string[];
  brutalTruth: string;
  debriefReadout: string;
  repairPlan: string[];
}

export interface BarRaiserReviewRecord {
  date: string;
  questionId: string;
  competency: CompetencyId;
  rating: DrillRating;
  verdict: BarRaiserVerdict;
  score: number;
  summary: string;
  wordCount: number;
  metricsCount: number;
  fillerCount: number;
  durationSeconds: number | null;
  sourceFamily: InterviewSourceFamily;
  sourceCategoryId: string;
  sourceCategoryLabel: string;
  managerOnly: boolean;
}

export interface AmazonCoverageSummary {
  lpCovered: number;
  lpTotal: number;
  functionalCovered: number;
  functionalTotal: number;
  managerPromptCount: number;
  managerRepCount: number;
  categoryCoverageCount: number;
  categoryCoverageTotal: number;
}

export interface StoryPressureTest {
  score: number;
  strengths: string[];
  vulnerabilities: string[];
  pressureQuestions: string[];
  upgradeMoves: string[];
}

export interface PromptReadiness {
  questionId: string;
  score: number;
  label: "ready" | "at_risk" | "uncovered";
  detail: string;
  matchedStoryIds: string[];
  strongStoryIds: string[];
}

export interface InterviewPassBlocker {
  id: string;
  title: string;
  detail: string;
  tab: PrepTabTarget;
  actionLabel: string;
  urgency: "high" | "medium";
}

export interface CurveballPack {
  angle: string;
  trap: string;
  prompts: string[];
  recoveryCue: string;
}

export interface RescueScript {
  id: string;
  title: string;
  scenario: string;
  script: string;
  whyItWorks: string;
}

export interface StoryReviewDimension {
  id: "clarity" | "ownership" | "action" | "evidence" | "reflection";
  label: string;
  score: number;
  note: string;
}

export interface StoryReview {
  score: number;
  verdict: "not_ready" | "competitive" | "elite";
  verdictLabel: string;
  dimensions: StoryReviewDimension[];
  strengths: string[];
  misses: string[];
  upgradeMoves: string[];
  brutalTruth: string;
  debriefReadout: string;
  repairPlan: string[];
}

export interface StoryScorecardSuggestion {
  dimensionId: StoryReviewDimension["id"];
  label: string;
  eliteTarget: number;
  currentScore: number;
  amplifiedScore: number;
  gapToTarget: number;
  exampleLabel: string;
  exampleText: string;
  whyThisHelps: string;
  applyFields: BarRaiserAmplificationField[];
  applyLabel: string;
}

export interface EliteStoryWriterInput {
  competency?: CompetencyId;
  categoryTags?: string[];
  titleHint?: string;
  context?: string;
  stakes?: string;
  actions?: string;
  result?: string;
  lesson?: string;
}

export interface EliteStoryWriterDraft {
  draft: StoryDraft;
  headline: string;
  missingPieces: string[];
  interviewerWarnings: string[];
  polishNotes: string[];
}

export interface EliteStoryPolish {
  draft: StoryDraft;
  polishedReview: StoryReview;
  scoreDelta: number;
  headline: string;
  adjustments: string[];
  remainingGaps: string[];
}

export type BarRaiserAmplificationField =
  | "title"
  | "situation"
  | "task"
  | "action"
  | "result"
  | "reflection";

export interface BarRaiserAmplificationSection {
  field: BarRaiserAmplificationField;
  label: string;
  before: string;
  after: string;
  reason: string;
}

export interface BarRaiserAmplificationDimensionGoal {
  id: StoryReviewDimension["id"];
  label: string;
  currentScore: number;
  amplifiedScore: number;
  targetScore: number;
  gapToTarget: number;
  nextLift: string;
}

export interface BarRaiserAmplification {
  draft: StoryDraft;
  amplifiedReview: StoryReview;
  scoreDelta: number;
  headline: string;
  barRaiserReadout: string;
  dimensionGoals: BarRaiserAmplificationDimensionGoal[];
  amplifierMoves: string[];
  proofDemands: string[];
  sourceBankPrompts: string[];
  sectionUpgrades: BarRaiserAmplificationSection[];
  remainingRisks: string[];
}

export interface InterviewCareerProfile {
  currentRole: string;
  currentLevel: string;
  targetRole: string;
  targetLevel: string;
  currentTotalComp: number | null;
  targetTotalComp: number | null;
}

export interface StoryBoundingBox {
  field: BarRaiserAmplificationField;
  label: string;
  text: string;
  classification: "ownership" | "team" | "context" | "evidence" | "fluff";
  reason: string;
}

export interface StoryGhostMetric {
  field: "action" | "result" | "reflection";
  label: string;
  placeholder: string;
  reason: string;
}

export interface StoryZeroWasteSuggestion {
  field: BarRaiserAmplificationField;
  label: string;
  original: string;
  cleaned: string;
  removedTerms: string[];
}

export interface StoryDeliveryMetric {
  id: "estimated_runtime" | "context_share" | "action_share" | "speech_defects";
  label: string;
  value: string;
  note: string;
  status: "good" | "watch" | "risk";
}

export interface StoryRoleScaleAssessment {
  verdict: "aligned" | "at_risk";
  summary: string;
  rewriteMove: string;
}

export interface StoryPlaceholderDefect {
  field: BarRaiserAmplificationField;
  label: string;
  token: string;
  severity: "critical" | "watch";
  detail: string;
  repairMove: string;
}

export interface StoryCalibrationReport {
  strictnessScore: number;
  sourceAnchor: string;
  ownershipBoxes: StoryBoundingBox[];
  ghostMetrics: StoryGhostMetric[];
  placeholderDefects: StoryPlaceholderDefect[];
  zeroWasteSuggestions: StoryZeroWasteSuggestion[];
  redTeamFollowUps: string[];
  deliveryMetrics: StoryDeliveryMetric[];
  roleScale: StoryRoleScaleAssessment;
}

export interface ReadinessForecast {
  levelTarget: string;
  requiredAverageScore: number;
  projectedPassProbability: number;
  daysToPeakReadiness: number;
  momentum: "rising" | "flat" | "slipping";
  summary: string;
  trajectoryNote: string;
  blockers: string[];
}

export interface StorySaturationGap {
  categoryId: string;
  label: string;
  count: number;
  status: "over_indexed" | "starved";
  detail: string;
}

export interface StorySaturationReport {
  summary: string;
  overIndexedCategories: StorySaturationGap[];
  starvedCategories: StorySaturationGap[];
  criticalSignalGaps: string[];
}

export interface StoryPivotNode {
  id: string;
  categoryId: string;
  label: string;
  targetCategoryLabel: string;
  framingMove: string;
  pivotedResult: string;
  pivotedReflection: string;
}

export interface StoryPivotPack {
  summary: string;
  nodes: StoryPivotNode[];
}

export interface EnduranceLoopRound {
  id: string;
  lensId: InterviewerLensId;
  lensLabel: string;
  title: string;
  questionIds: string[];
  promptTitles: string[];
  pressureNote: string;
}

export interface EnduranceLoopPlan {
  summary: string;
  totalRounds: number;
  totalQuestions: number;
  totalMinutes: number;
  rounds: EnduranceLoopRound[];
}

export interface PrepMomentumDashboard {
  burnoutRisk: "low" | "medium" | "high";
  burnoutSummary: string;
  burnoutSignals: string[];
  compDelta: number | null;
  compSummary: string;
  weeklyUpsideAtRisk: number | null;
  cadenceSummary: string;
  repetitionRisk: string;
}

export interface GameFilmEvent {
  timestampSeconds: number;
  label: string;
  detail: string;
  severity: "good" | "watch" | "risk";
}

export interface GameFilmBreakdown {
  estimatedDurationSeconds: number | null;
  fillerHits: number;
  passiveVoiceHits: number;
  weakVerbHits: number;
  summary: string;
  events: GameFilmEvent[];
}

export interface PromptEvalProbe {
  id: string;
  title: string;
  scenario: string;
  requiredSignals: string[][];
  negativeSignals: string[][];
}

export interface PromptEvalProbeResult {
  probeId: string;
  title: string;
  scenario: string;
  baselineScore: number;
  candidateScore: number;
  delta: number;
  matchedSignals: string[];
  missedSignals: string[];
}

export interface PromptAdherenceMatrix {
  controlBatchSize: number;
  baselineScore: number;
  candidateScore: number;
  delta: number;
  autoReject: boolean;
  summary: string;
  results: PromptEvalProbeResult[];
}

export interface XRayWindow {
  id: string;
  start: number;
  end: number;
  text: string;
  label: string;
  severity: "critical" | "watch";
  reason: string;
  repairMove: string;
}

export interface TextXRayReport {
  summary: string;
  windows: XRayWindow[];
}

export interface PrepTrendPoint {
  day: string;
  label: string;
  score: number | null;
  packRate: number | null;
}

export interface InterviewPrepProgress {
  version: 1;
  createdAt: string;
  updatedAt: string;
  streak: number;
  lastPracticeDate: string | null;
  questionStats: Record<string, DrillStat>;
  competencyStats: CompetencyStats;
  drillHistory: DrillHistoryRecord[];
  barRaiserHistory: BarRaiserReviewRecord[];
  stories: StarStory[];
  pitch: PitchPack;
  careerProfile: InterviewCareerProfile;
  checklistDoneIds: string[];
}

export const INTERVIEW_STAGES: readonly InterviewStage[] = [
  {
    id: "screen",
    title: "Recruiter Screen",
    detail:
      "Control the narrative: fit, motivation, compensation posture, and timeline.",
  },
  {
    id: "manager",
    title: "Hiring Manager",
    detail:
      "Show role thesis, execution range, and how you create leverage for the team.",
  },
  {
    id: "panel",
    title: "Panel or Onsite",
    detail:
      "Repeat core stories with sharper calibration for cross-functional interviewers.",
  },
  {
    id: "close",
    title: "Final and Offer",
    detail:
      "Probe for success metrics, team quality, and where the company is truly constrained.",
  },
] as const;

export const NEGOTIATION_REMINDERS = [
  "Express excitement before discussing numbers so the ask reads as calibration, not hesitation.",
  "Anchor on scope, impact, and market data rather than personal need.",
  "Ask about level, bonus, equity refresh, and review cadence before accepting the first package.",
  "Close loops in writing after the call so details do not drift.",
] as const;

export const INTERVIEW_RESCUE_SCRIPTS: readonly RescueScript[] = [
  {
    id: "buy-time",
    title: "Buy a few seconds cleanly",
    scenario: "You need a beat to organize the answer.",
    script:
      "Let me take a second and choose the strongest example, because I want to answer that precisely.",
    whyItWorks:
      "It sounds deliberate and senior, not panicked, and buys you a little structure time.",
  },
  {
    id: "clarify-angle",
    title: "Clarify the angle",
    scenario: "The question is broad and could go in multiple directions.",
    script:
      "I can answer that from a people-leadership angle or an operating-results angle. I will take the operating-results angle unless you would prefer the other.",
    whyItWorks:
      "You reduce ambiguity, show judgment, and avoid wasting time on the wrong story.",
  },
  {
    id: "no-perfect-example",
    title: "When you do not have the perfect example",
    scenario: "You do not have an exact match for the wording of the question.",
    script:
      "I do not have a perfect one-for-one example, but I do have a close situation that tests the same judgment. I will use that and make the tradeoff explicit.",
    whyItWorks:
      "You stay honest without freezing, and you frame the example before the interviewer does.",
  },
  {
    id: "missing-metric",
    title: "When you do not remember the exact number",
    scenario: "You know the impact but not the exact metric offhand.",
    script:
      "I do not want to guess at the exact number. What I can say confidently is that the direction of change was material, and the concrete result was [insert real scope or business effect].",
    whyItWorks:
      "You protect credibility instead of bluffing and still land the outcome.",
  },
  {
    id: "interrupted",
    title: "When you get interrupted",
    scenario: "The interviewer cuts in before you land the result.",
    script:
      "Absolutely. The short version is this: I made the call to [decision], the result was [outcome], and I can unpack the action path if useful.",
    whyItWorks:
      "You recover control by compressing to the business signal immediately.",
  },
  {
    id: "blanked-follow-up",
    title: "When a follow-up catches you flat-footed",
    scenario: "The interviewer attacks a weak seam in the story.",
    script:
      "That is the right follow-up. The tradeoff I was managing was [tradeoff], and the reason I still chose that path was [decision rule].",
    whyItWorks:
      "It re-centers the answer around judgment, which is what senior interviewers usually care about.",
  },
  {
    id: "close-strong",
    title: "Close the answer like a senior operator",
    scenario: "You want to finish strong instead of trailing off.",
    script:
      "The result was [metric or business effect], and the bigger lesson was [lesson], which is now how I approach similar situations.",
    whyItWorks:
      "It closes with proof and repeatability instead of letting the answer die softly.",
  },
] as const;

export const INTERVIEWER_LENSES: readonly InterviewerLens[] = [
  {
    id: "hiring_manager",
    label: "Hiring Manager",
    description:
      "Pushes on role fit, scope readiness, team leadership, and whether your trajectory matches the next-level seat.",
    demands: [
      "Show why this story sounds like next-level scope, not just strong execution.",
      "Make team leverage, judgment, and operating ownership visible.",
      "Close with what this says about how you will perform in the target role.",
    ],
    targetDurationSeconds: 90,
  },
  {
    id: "hrbp",
    label: "HRBP",
    description:
      "Tests trust, people judgment, coaching range, and whether your leadership style is healthy under pressure.",
    demands: [
      "Show how you handled the human dynamic, not just the task.",
      "Make your coaching, trust-building, or conflict move explicit.",
      "End with what changed for the people or team, not just the metric.",
    ],
    targetDurationSeconds: 90,
  },
  {
    id: "l6_ops",
    label: "L6 Ops",
    description:
      "Cares about execution, customer promise, pace, measurable outcomes, and whether your fixes become standard work.",
    demands: [
      "Lead with the number, stake, or miss.",
      "Show the sequence of actions and the operating tradeoff you made.",
      "Close with the metric and the repeatable mechanism that remained after you.",
    ],
    targetDurationSeconds: 90,
  },
  {
    id: "finance_partner",
    label: "Finance Partner",
    description:
      "Tests whether you can frame a decision in ROI, resource tradeoffs, downside risk, and business leverage.",
    demands: [
      "Translate the move into cost, margin, labor, or avoided risk.",
      "State what you chose not to fund, staff, or prioritize.",
      "Show the business case, not only the operational result.",
    ],
    targetDurationSeconds: 90,
  },
  {
    id: "tech_lead",
    label: "Tech Lead",
    description:
      "Pushes on system constraints, failure modes, technical tradeoffs, and how the mechanism survives scale.",
    demands: [
      "Name the system, bottleneck, or failure mode directly.",
      "Explain the tradeoff and why the chosen path scaled better.",
      "Show what changed in the mechanism, not only the momentary fix.",
    ],
    targetDurationSeconds: 120,
  },
  {
    id: "l7_bar_raiser",
    label: "L7 Bar Raiser",
    description:
      "Punishes vague answers. Wants judgment, tradeoffs, repeatability, and proof that your story would survive hard follow-up.",
    demands: [
      "Make the tradeoff and decision rule explicit.",
      "Prove the result with a real delta or scope marker.",
      "Show what became repeatable, what you learned, and why this should scale.",
    ],
    targetDurationSeconds: 120,
  },
] as const;

export const RED_FLAGS = [
  "Interviewers cannot define success for the role in the first six months.",
  "Multiple people describe culture using incompatible language.",
  "Leaders frame burnout or chaos as a badge of honor.",
  "Nobody can explain why the role is open, what changed, or what support exists.",
] as const;

export const INTERVIEW_SOURCE_FAMILY_LABELS: Record<
  InterviewSourceFamily,
  string
> = {
  lp: "Leadership Principles",
  functional: "Functional Competencies",
};

const DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE: Record<
  CompetencyId,
  readonly string[]
> = {
  storytelling: [
    "Clear opening",
    "Relevant context",
    "Role fit",
    "Memorable result",
  ],
  leadership: [
    "Decision quality",
    "Higher standard",
    "Alignment",
    "Lasting impact",
  ],
  ownership: [
    "Ownership",
    "Prioritization",
    "Follow-through",
    "Business result",
  ],
  problem_solving: [
    "Problem frame",
    "Assumptions and options",
    "Tradeoff logic",
    "Outcome",
  ],
  stakeholder_management: [
    "Stakeholder context",
    "Influence move",
    "Trust or alignment",
    "Result",
  ],
  adaptability: ["Change signal", "Reset move", "Learning speed", "Outcome"],
  technical_depth: [
    "System or root cause",
    "Analytical depth",
    "Tradeoff",
    "Measured impact",
  ],
};

export const INTERVIEW_QUESTION_CATEGORIES: readonly InterviewQuestionCategory[] =
  [
    {
      id: "customer-obsession",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Customer Obsession",
      description:
        "Show how you understand customer needs, make tradeoffs well, and improve the customer experience.",
      signalLane: "stakeholder_management",
      defaultListenFors:
        DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management,
    },
    {
      id: "ownership",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Ownership",
      description:
        "Show accountability beyond formal scope and follow-through when the stakes rise.",
      signalLane: "ownership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.ownership,
    },
    {
      id: "invent-and-simplify",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Invent and Simplify",
      description:
        "Show creative problem solving that makes the work or customer experience meaningfully simpler.",
      signalLane: "problem_solving",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.problem_solving,
    },
    {
      id: "are-right-a-lot",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Are Right, a Lot",
      description:
        "Show judgment under uncertainty and how you calibrate decisions with multiple inputs.",
      signalLane: "problem_solving",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.problem_solving,
    },
    {
      id: "learn-and-be-curious",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Learn and Be Curious",
      description:
        "Show how you ramp fast, challenge your assumptions, and apply new learning.",
      signalLane: "adaptability",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.adaptability,
    },
    {
      id: "hire-and-develop-the-best",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Hire and Develop the Best",
      description:
        "Show how you raise talent density, coach others, and strengthen the team around you.",
      signalLane: "leadership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership,
    },
    {
      id: "insist-on-the-highest-standards",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Insist on the Highest Standards",
      description:
        "Show how you raise quality, keep the bar high, and resist false tradeoffs.",
      signalLane: "leadership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership,
    },
    {
      id: "think-big",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Think Big",
      description:
        "Show how you define a larger opportunity, sell the vision, and create leverage.",
      signalLane: "leadership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership,
    },
    {
      id: "bias-for-action",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Bias for Action",
      description:
        "Show how you move quickly with incomplete information while still managing risk.",
      signalLane: "adaptability",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.adaptability,
    },
    {
      id: "frugality",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Frugality",
      description:
        "Show how you deliver meaningful results with constraints, tradeoffs, and creative resourcefulness.",
      signalLane: "ownership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.ownership,
    },
    {
      id: "earn-trust",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Earn Trust",
      description:
        "Show how you influence, communicate honestly, and repair confidence under stress.",
      signalLane: "stakeholder_management",
      defaultListenFors:
        DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management,
    },
    {
      id: "dive-deep",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Dive Deep",
      description:
        "Show root-cause analysis, detail orientation, and fact-based problem solving.",
      signalLane: "technical_depth",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.technical_depth,
    },
    {
      id: "have-backbone-disagree-and-commit",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Have Backbone; Disagree and Commit",
      description:
        "Show principled disagreement, respectful pushback, and commitment once a direction is set.",
      signalLane: "stakeholder_management",
      defaultListenFors:
        DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management,
    },
    {
      id: "deliver-results",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Deliver Results",
      description:
        "Show how you execute through obstacles and land meaningful outcomes.",
      signalLane: "ownership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.ownership,
    },
    {
      id: "strive-to-be-earth-s-best-employer",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Strive to Be Earth’s Best Employer",
      description:
        "Show how you improve the working environment, advocate for others, and build inclusion.",
      signalLane: "leadership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership,
    },
    {
      id: "success-and-scale-bring-broad-responsibility",
      family: "lp",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.lp,
      label: "Success and Scale Bring Broad Responsibility",
      description:
        "Show how you consider downstream, societal, or long-term impacts of your decisions.",
      signalLane: "leadership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership,
    },
    {
      id: "adaptability",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Adaptability",
      description:
        "Show how you reset plans quickly when conditions change and keep the work moving.",
      signalLane: "adaptability",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.adaptability,
    },
    {
      id: "collaboration",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Collaboration",
      description:
        "Show how you coordinate effectively, handle disagreement, and build strong partnerships.",
      signalLane: "stakeholder_management",
      defaultListenFors:
        DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management,
    },
    {
      id: "conscientiousness",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Conscientiousness",
      description:
        "Show reliability, attention to detail, and disciplined follow-through on commitments.",
      signalLane: "ownership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.ownership,
    },
    {
      id: "customer-orientation",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Customer orientation",
      description:
        "Show how you interpret customer needs, respond well, and deliver standout service.",
      signalLane: "stakeholder_management",
      defaultListenFors:
        DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management,
    },
    {
      id: "deal-with-ambiguity",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Deal with Ambiguity",
      description:
        "Show how you create structure and direction when goals or responsibilities are unclear.",
      signalLane: "problem_solving",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.problem_solving,
    },
    {
      id: "influencing",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Influencing",
      description:
        "Show how you persuade without authority and build commitment across perspectives.",
      signalLane: "stakeholder_management",
      defaultListenFors:
        DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.stakeholder_management,
    },
    {
      id: "interpretation-and-analysis",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Interpretation and Analysis",
      description:
        "Show how you analyze complex information, challenge assumptions, and uncover the right insight.",
      signalLane: "technical_depth",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.technical_depth,
    },
    {
      id: "judgment-and-decision-making",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Judgment and Decision Making",
      description:
        "Show how you weigh options well, make decisions, and explain your reasoning clearly.",
      signalLane: "problem_solving",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.problem_solving,
    },
    {
      id: "learning-orientation",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Learning Orientation",
      description:
        "Show how you learn quickly, close skill gaps, and turn feedback into better performance.",
      signalLane: "adaptability",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.adaptability,
    },
    {
      id: "plan-and-prioritize",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Plan and Prioritize",
      description:
        "Show how you sequence work, manage tradeoffs, and focus the team on the right priorities.",
      signalLane: "ownership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.ownership,
    },
    {
      id: "team-and-people-management",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Team and People Management",
      description:
        "Show how you coach, motivate, and manage performance with clarity and fairness.",
      signalLane: "leadership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership,
    },
    {
      id: "vision-and-strategy",
      family: "functional",
      familyLabel: INTERVIEW_SOURCE_FAMILY_LABELS.functional,
      label: "Vision and Strategy",
      description:
        "Show how you set direction, connect work to strategy, and drive adoption for a larger plan.",
      signalLane: "leadership",
      defaultListenFors: DEFAULT_LISTEN_FORS_BY_SIGNAL_LANE.leadership,
    },
  ] as const;

const INTERVIEW_QUESTION_CATEGORY_LOOKUP = Object.fromEntries(
  INTERVIEW_QUESTION_CATEGORIES.map((category) => [category.id, category]),
) as Record<string, InterviewQuestionCategory>;

export function isInterviewSourceFamily(
  value: unknown,
): value is InterviewSourceFamily {
  return value === "lp" || value === "functional";
}

export function isQuestionCategoryId(value: unknown): value is string {
  return (
    typeof value === "string" && value in INTERVIEW_QUESTION_CATEGORY_LOOKUP
  );
}

export function getQuestionCategoryById(
  categoryId: string,
): InterviewQuestionCategory {
  return (
    INTERVIEW_QUESTION_CATEGORY_LOOKUP[categoryId] ??
    INTERVIEW_QUESTION_CATEGORIES[0]
  );
}

export function getQuestionCategoriesByFamily(
  family: InterviewSourceFamily,
): InterviewQuestionCategory[] {
  return INTERVIEW_QUESTION_CATEGORIES.filter(
    (category) => category.family === family,
  );
}

export const GAME_DAY_CHECKLIST: readonly PlaybookChecklistItem[] = [
  {
    id: "check-role-thesis",
    phase: "48_hours",
    title: "Write the role thesis",
    detail:
      "Summarize why you fit this specific role in three sharp sentences.",
  },
  {
    id: "check-star-bank",
    phase: "48_hours",
    title: "Rehearse six STAR stories",
    detail:
      "Cover leadership, conflict, failure, ambiguity, ownership, and impact.",
  },
  {
    id: "check-research",
    phase: "48_hours",
    title: "Research the business",
    detail:
      "Know the product, customer, market pressure, and why the role matters now.",
  },
  {
    id: "check-questions",
    phase: "48_hours",
    title: "Prepare questions to ask",
    detail:
      "Bring at least four non-generic questions calibrated to the stage.",
  },
  {
    id: "check-logistics",
    phase: "60_minutes",
    title: "Clear the environment",
    detail: "Camera, sound, lighting, charger, resume, notes, and water.",
  },
  {
    id: "check-proof-points",
    phase: "60_minutes",
    title: "Review proof points",
    detail:
      "Memorize the numbers, deltas, and stakes tied to your top stories.",
  },
  {
    id: "check-energy",
    phase: "60_minutes",
    title: "Set energy level",
    detail: "Breathe, slow down, and speak at 85% of your normal pace.",
  },
  {
    id: "check-followup",
    phase: "post_round",
    title: "Send a sharp follow-up",
    detail:
      "Reflect one concrete team need you heard and why you can solve it.",
  },
] as const;

export const INTERVIEW_QUESTIONS: readonly InterviewQuestion[] =
  AMAZON_INTERVIEW_QUESTION_BANK_RAW.map((question) => {
    const category =
      INTERVIEW_QUESTION_CATEGORY_LOOKUP[question.sourceCategoryId];

    if (!category) {
      throw new Error(
        `Missing interview question category: ${question.sourceCategoryId}`,
      );
    }

    return {
      ...question,
      competency: category.signalLane,
      signalLane: category.signalLane,
      listenFors: category.defaultListenFors,
      companyTrack: "amazon",
    } satisfies InterviewQuestion;
  });

const INTERVIEW_QUESTION_LOOKUP = Object.fromEntries(
  INTERVIEW_QUESTIONS.map((question) => [question.id, question]),
) as Record<string, InterviewQuestion>;

export function getInterviewQuestionById(
  questionId: string,
): InterviewQuestion | null {
  return INTERVIEW_QUESTION_LOOKUP[questionId] ?? null;
}

const HISTORY_LIMIT = 24;
const BAR_RAISER_HISTORY_LIMIT = 24;
const STORY_LIMIT = 12;
const DAY_MS = 24 * 60 * 60 * 1000;
const FILLER_PATTERN =
  /\b(um+|uh+|like|you know|sort of|kind of|basically|literally|i guess|maybe|honestly)\b/gi;
const OWNERSHIP_PATTERN = /\b(i|me|my|mine)\b/gi;
const TEAM_PATTERN = /\b(we|our|us)\b/gi;
const DECISION_PATTERN =
  /\b(i (?:decided|chose|led|owned|drove|created|rebuilt|aligned|escalated|cut|prioritized|changed|implemented|shipped|reframed|set|designed))\b/gi;
const TRADEOFF_PATTERN =
  /\b(tradeoff|trade-off|constraint|risk|priority|prioritized|balanced|because|instead|chose|decision|scope|timeline|debt|option)\b/gi;
const OUTCOME_PATTERN =
  /\b(result|outcome|impact|improved|improve|reduced|reduce|increased|increase|saved|delivered|launched|grew|won|retention|revenue|latency|churn|quality|reliability|downtime)\b/gi;
const LESSON_PATTERN =
  /\b(learned|would do differently|next time|since then|now i|after that|changed how i)\b/gi;
const STRUCTURE_PATTERN =
  /\b(first|then|next|after that|once|ultimately|in the end|as a result)\b/gi;
const STAKES_PATTERN =
  /\b(deadline|launch|customer|revenue|risk|defect|retention|incident|timeline|scope|quality|growth|quota|migration|downtime)\b/gi;
const ALIGNMENT_PATTERN =
  /\b(stakeholder|partner|design|product|engineering|sales|ops|support|finance|legal|aligned|alignment|buy-in|consensus|trust)\b/gi;
const ADAPTABILITY_PATTERN =
  /\b(changed|pivot|replanned|learned|ramped|adapted|reset|course-corrected)\b/gi;
const TECHNICAL_PATTERN =
  /\b(system|architecture|service|database|api|latency|throughput|scale|scaling|reliability|incident|pipeline)\b/gi;
const PLACEHOLDER_PATTERN =
  /\[(.*?)\]|\b(add|fill in|replace with|insert)\b/gi;
const STANDARD_WORK_PATTERN =
  /\b(standard work|playbook|repeatable|mechanism|cadence|workflow|sop|template|checklist|dashboard|operating rhythm|system)\b/gi;
const PEOPLE_PATTERN =
  /\b(coach|coached|develop|developed|mentor|feedback|trust|conflict|respect|people|team member|associate)\b/gi;
const URGENCY_PATTERN =
  /\b(deadline|pace|window|same day|urgent|truck|launch|recovery|at risk|high volume|peak)\b/gi;
const PASSIVE_VOICE_PATTERN =
  /\b(?:was|were|is|are|been|be)\s+\w+ed\b/gi;
const WEAK_VERB_PATTERN =
  /\b(helped|supported|assisted|worked on|was part of|participated in|handled tasks|involved in)\b/gi;
const SCALE_SIGNAL_PATTERN =
  /\b(associates?|people|team|teams|shift|shifts|sites?|network|cross-functional|org|organization|department|floor|process path|standard work|playbook|mechanism|cadence|system)\b/gi;
const AMBIGUOUS_DATE_PATTERN =
  /\b(recently|lately|a while back|some time ago|last year|earlier this year|months ago|weeks ago|back then|in the past|at one point)\b/gi;
const PLACEHOLDER_METRIC_PATTERN =
  /\[(?:[^\]]*metric[^\]]*|[^\]]*date[^\]]*|[^\]]*timeframe[^\]]*|[^\]]*delta[^\]]*|[^\]]*number[^\]]*|[xyzXYZ])\]|\b[xXyzYZ]%\b/gi;
const SOFT_NUMBER_PATTERN =
  /\b(a lot|several|many|few|some|tons|significant|major|huge|massive)\b/gi;
const DATE_ANCHOR_PATTERN =
  /\b(20\d{2}|q[1-4]\s*20\d{2}|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|prime day|peak|holiday|that day|that week|that month)\b/gi;
const ROI_PATTERN =
  /\b(roi|revenue|margin|cost|costs|costed|budget|overtime|labor|hours saved|savings|expense|headcount|throughput per hour|productivity)\b/gi;
const ZERO_WASTE_TERMS = [
  "really",
  "very",
  "basically",
  "kind of",
  "sort of",
  "actually",
  "clearly",
  "successfully",
  "extremely",
  "highly",
  "huge",
  "massive",
  "significant",
  "impactful",
  "amazing",
  "great",
  "a lot",
] as const;

function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

function clampCount(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function uniqueStrings(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }
  return [
    ...new Set(
      values.filter(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0,
      ),
    ),
  ];
}

function getInitialCompetencyStats(): CompetencyStats {
  return INTERVIEW_COMPETENCIES.reduce((result, competency) => {
    result[competency.id] = { attempted: 0, solid: 0, strong: 0 };
    return result;
  }, {} as CompetencyStats);
}

function getInitialStoryCoverage(): Record<CompetencyId, number> {
  return INTERVIEW_COMPETENCIES.reduce(
    (result, competency) => {
      result[competency.id] = 0;
      return result;
    },
    {} as Record<CompetencyId, number>,
  );
}

function getInitialQuestionCategoryCoverage(): Record<string, number> {
  return INTERVIEW_QUESTION_CATEGORIES.reduce(
    (result, category) => {
      result[category.id] = 0;
      return result;
    },
    {} as Record<string, number>,
  );
}

function touchPracticeDay(
  progress: InterviewPrepProgress,
  now: Date,
): InterviewPrepProgress {
  const dayKey = toDayKey(now);

  if (progress.lastPracticeDate === dayKey) {
    return {
      ...progress,
      updatedAt: now.toISOString(),
    };
  }

  let nextStreak = 1;

  if (progress.lastPracticeDate) {
    const previousDay = new Date(`${progress.lastPracticeDate}T00:00:00.000Z`);
    const currentDay = new Date(`${dayKey}T00:00:00.000Z`);
    const diffDays = Math.round(
      (currentDay.getTime() - previousDay.getTime()) / DAY_MS,
    );

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
    updatedAt: now.toISOString(),
  };
}

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function countMatches(value: string, pattern: RegExp): number {
  const matches = value.match(pattern);
  return matches ? matches.length : 0;
}

function countMetrics(value: string): number {
  return countMatches(
    value,
    /\b(\d+%|\$?\d[\d,.]*|hours?\b|days?\b|weeks?\b|months?\b|years?\b|users?\b|customers?\b|tickets?\b)\b/gi,
  );
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

  return (
    sentences.reduce((sum, sentence) => sum + countWords(sentence), 0) /
    sentences.length
  );
}

function estimateSpokenSeconds(words: number, wordsPerMinute = 135): number {
  if (words <= 0) {
    return 0;
  }

  return Math.round((words / wordsPerMinute) * 60);
}

function formatMoney(value: number | null): string {
  if (value === null) {
    return "Not set";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const PROMPT_EVAL_FAMILIES = [
  {
    title: "Source-bank discipline",
    requiredSignals: [
      ["source bank", "provided questions", "canonical bank"],
      ["only", "strictly", "do not invent"],
    ],
    negativeSignals: [["random", "made-up", "invented"]],
  },
  {
    title: "Brutal honesty",
    requiredSignals: [
      ["brutal", "honest", "hard truth"],
      ["repair plan", "exactly", "specific"],
    ],
    negativeSignals: [["generic praise", "soften", "sugarcoat"]],
  },
  {
    title: "Metric rigor",
    requiredSignals: [
      ["exact metric", "real number", "verifiable"],
      ["no placeholder", "replace", "anti-placeholder"],
    ],
    negativeSignals: [["x%", "[x]", "[metric]"]],
  },
  {
    title: "Chronology rigor",
    requiredSignals: [
      ["exact date", "month", "quarter", "time anchor"],
      ["no vague", "recently", "ambiguous"],
    ],
    negativeSignals: [["recently", "a while back", "some time ago"]],
  },
  {
    title: "Hostile follow-up pressure",
    requiredSignals: [
      ["hostile follow-up", "skeptical", "bar raiser"],
      ["dive deep", "tradeoff", "push back"],
    ],
    negativeSignals: [["friendly", "easy", "softball"]],
  },
  {
    title: "Graceful degradation",
    requiredSignals: [
      ["if unsupported", "fallback", "graceful"],
      ["explain the constraint", "do not hallucinate", "confidence threshold"],
    ],
    negativeSignals: [["guess", "hallucinate", "make up"]],
  },
  {
    title: "Audio-first rigor",
    requiredSignals: [
      ["stream", "chunks", "real-time"],
      ["freeze", "silence", "waveform"],
    ],
    negativeSignals: [["wait until stop", "batch only"]],
  },
  {
    title: "Negative constraints",
    requiredSignals: [
      ["never", "must not", "block"],
      ["negative constraint", "referee", "guardrail"],
    ],
    negativeSignals: [["maybe", "probably", "optional"]],
  },
  {
    title: "Evaluation discipline",
    requiredSignals: [
      ["head-to-head", "control batch", "55"],
      ["auto-reject", "mathematically", "adherence score"],
    ],
    negativeSignals: [["vibes", "manual only"]],
  },
  {
    title: "Persistent correction memory",
    requiredSignals: [
      ["correction ledger", "memory", "persistent"],
      ["never repeat", "user correction", "vector"],
    ],
    negativeSignals: [["forget", "stateless"]],
  },
] as const;

const PROMPT_EVAL_CONTROL_BATCH: readonly PromptEvalProbe[] = Array.from(
  { length: 60 },
  (_, index) => {
    const family = PROMPT_EVAL_FAMILIES[index % PROMPT_EVAL_FAMILIES.length];
    const seededQuestion = INTERVIEW_QUESTIONS[index % INTERVIEW_QUESTIONS.length];

    return {
      id: `probe-${index + 1}`,
      title: family.title,
      scenario: `${seededQuestion.sourceCategoryLabel}: ${seededQuestion.prompt}`,
      requiredSignals: family.requiredSignals.map((group) => [...group]),
      negativeSignals: family.negativeSignals.map((group) => [...group]),
    } satisfies PromptEvalProbe;
  },
);

function countSignalGroupMatches(
  text: string,
  groups: readonly string[][],
): { matched: string[]; missed: string[]; score: number } {
  const matched: string[] = [];
  const missed: string[] = [];

  for (const group of groups) {
    const hit = group.find((signal) => text.includes(signal));
    if (hit) {
      matched.push(hit);
    } else {
      missed.push(group[0] ?? "missing signal");
    }
  }

  const score = groups.length ? matched.length / groups.length : 1;
  return { matched, missed, score };
}

function inferLevelNumber(levelText: string): number {
  const directMatch = levelText.match(/\bL\s*([3-8])\b/i);
  if (directMatch) {
    return Number(directMatch[1]);
  }

  const tierMatch = levelText.match(/\b(?:tier|level)\s*([3-8])\b/i);
  if (tierMatch) {
    return Number(tierMatch[1]);
  }

  return 4;
}

function getLevelCalibrationTargets(levelText: string) {
  const levelNumber = inferLevelNumber(levelText);

  if (levelNumber >= 6) {
    return {
      levelNumber,
      requiredAverageScore: 86,
      targetStoryCount: 10,
      targetManagerReps: 6,
      targetLpCoverage: 12,
      targetFunctionalCoverage: 7,
      storyScoreFloor: 82,
      pressureLabel: "director-grade",
    };
  }

  if (levelNumber >= 5) {
    return {
      levelNumber,
      requiredAverageScore: 80,
      targetStoryCount: 8,
      targetManagerReps: 4,
      targetLpCoverage: 10,
      targetFunctionalCoverage: 5,
      storyScoreFloor: 78,
      pressureLabel: "manager-grade",
    };
  }

  return {
    levelNumber,
    requiredAverageScore: 74,
    targetStoryCount: 6,
    targetManagerReps: 2,
    targetLpCoverage: 8,
    targetFunctionalCoverage: 4,
    storyScoreFloor: 74,
    pressureLabel: "entry-manager-grade",
  };
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function inferVerdict(score: number): BarRaiserVerdict {
  if (score >= 85) {
    return "bar_raiser";
  }
  if (score >= 70) {
    return "hire_signal";
  }
  if (score >= 55) {
    return "borderline";
  }
  return "below_bar";
}

function getVerdictLabel(verdict: BarRaiserVerdict): string {
  switch (verdict) {
    case "bar_raiser":
      return "Bar raiser";
    case "hire_signal":
      return "Hire signal";
    case "borderline":
      return "Borderline";
    default:
      return "Below bar";
  }
}

function getReviewRating(score: number): DrillRating {
  if (score >= 84) {
    return "strong";
  }
  if (score >= 68) {
    return "solid";
  }
  return "needs_work";
}

function getWeakestDimensionIds<
  TDimension extends { id: string; score: number },
>(dimensions: readonly TDimension[], count: number): string[] {
  return [...dimensions]
    .sort((left, right) => left.score - right.score)
    .slice(0, count)
    .map((dimension) => dimension.id);
}

function buildAnswerBrutalTruth(
  verdict: BarRaiserVerdict,
  misses: readonly string[],
): string {
  const primaryMiss =
    misses[0] ?? "The answer is still too easy to doubt under pressure.";

  switch (verdict) {
    case "bar_raiser":
      return `This is strong, but strong is not the same as safe. If you get sloppy on ownership or proof, this answer drops fast. ${primaryMiss}`;
    case "hire_signal":
      return `This can pass, but it is not yet the kind of answer that shuts down skepticism. ${primaryMiss}`;
    case "borderline":
      return `This sounds experienced, but it still reads as fragile. A skeptical interviewer could push this into a no-hire quickly. ${primaryMiss}`;
    default:
      return `If this were a real loop, I would not move you forward from this answer. ${primaryMiss}`;
  }
}

function buildAnswerDebriefReadout(params: {
  interviewerLabel: string;
  verdict: BarRaiserVerdict;
  question: InterviewQuestion;
  dimensions: readonly AnswerReviewDimension[];
  metricsCount: number;
  fillerCount: number;
  misses: readonly string[];
}): string {
  const weakestDimensions = getWeakestDimensionIds(params.dimensions, 2)
    .map((dimensionId) =>
      params.dimensions.find((dimension) => dimension.id === dimensionId)?.label,
    )
    .filter(Boolean)
    .join(" and ");
  const proofLine =
    params.metricsCount > 0
      ? `There was at least some measurable proof in the answer (${params.metricsCount} metric signal${params.metricsCount === 1 ? "" : "s"}).`
      : "There was no hard proof in the answer, which makes the claim set hard to trust.";
  const deliveryLine =
    params.fillerCount > 0
      ? `Delivery still had ${params.fillerCount} hedge or filler signal${params.fillerCount === 1 ? "" : "s"}, which weakens confidence.`
      : "Delivery was reasonably clean.";

  const verdictLine =
    params.verdict === "bar_raiser"
      ? "I would write this up as a strong hire-level answer."
      : params.verdict === "hire_signal"
        ? "I would write this up as passable but not especially calming."
        : params.verdict === "borderline"
          ? "I would write this up as mixed and vulnerable to follow-up."
          : "I would write this up as below bar.";

  return [
    `${params.interviewerLabel} debrief: ${verdictLine}`,
    `The answer targeted ${params.question.sourceCategoryLabel} but the weakest signals were ${weakestDimensions || "not clearly enough demonstrated"}.`,
    proofLine,
    deliveryLine,
    params.misses[0] ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildAnswerRepairPlan(params: {
  dimensions: readonly AnswerReviewDimension[];
  misses: readonly string[];
  rewriteMoves: readonly string[];
  metricsCount: number;
  wordCount: number;
}): string[] {
  const weakDimensionActions: Record<AnswerReviewDimension["id"], string> = {
    structure:
      "Rebuild the answer to four beats only: stake, mandate, action sequence, measured result.",
    ownership:
      'Replace vague team language with the exact calls you made, the push you gave, and the risk you owned.',
    evidence:
      "Add one hard number, one clear before/after delta, and one scope marker before you rerun this.",
    judgment:
      'Say the tradeoff out loud using the sentence frame "I chose X instead of Y because..."',
    delivery:
      "Cut hedge words, shorten the first pass, and rehearse until the answer lands in a clean 90 to 120 seconds.",
  };

  const repairPlan = getWeakestDimensionIds(params.dimensions, 3).map(
    (dimensionId) =>
      weakDimensionActions[dimensionId as AnswerReviewDimension["id"]],
  );

  if (params.metricsCount === 0) {
    repairPlan.push(
      "Do not rehearse this again until you decide which metric, delta, or risk reduction proves the result.",
    );
  }
  if (params.wordCount < 55) {
    repairPlan.push(
      "Lengthen the answer by adding the actual decision point and the business consequence, not extra scene-setting.",
    );
  }

  return [...new Set([...repairPlan, ...params.rewriteMoves, ...params.misses.slice(0, 2)])].slice(
    0,
    6,
  );
}

function buildStoryBrutalTruth(
  verdict: StoryReview["verdict"],
  misses: readonly string[],
): string {
  const primaryMiss =
    misses[0] ?? "The story is still not specific enough to carry real interview weight.";

  switch (verdict) {
    case "elite":
      return `This story is strong enough to use, but only if you keep it crisp and owned. ${primaryMiss}`;
    case "competitive":
      return `This story is usable, but it is not bulletproof yet. ${primaryMiss}`;
    default:
      return `In its current form, this story is not interview-ready. ${primaryMiss}`;
  }
}

function buildStoryDebriefReadout(params: {
  verdict: StoryReview["verdict"];
  story: StoryDraft;
  dimensions: readonly StoryReviewDimension[];
  misses: readonly string[];
}): string {
  const weakestDimensions = getWeakestDimensionIds(params.dimensions, 2)
    .map((dimensionId) =>
      params.dimensions.find((dimension) => dimension.id === dimensionId)?.label,
    )
    .filter(Boolean)
    .join(" and ");
  const verdictLine =
    params.verdict === "elite"
      ? "I would mark this story as strong supporting evidence."
      : params.verdict === "competitive"
        ? "I would mark this story as usable but still a little exposed."
        : "I would not rely on this story in a high-bar loop yet.";

  return [
    `Debrief note on "${params.story.title || "Untitled story"}": ${verdictLine}`,
    `The weakest signals are ${weakestDimensions || "still too vague to trust"}, which means the story can still wobble under follow-up.`,
    params.misses[0] ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildStoryRepairPlan(params: {
  dimensions: readonly StoryReviewDimension[];
  misses: readonly string[];
  upgradeMoves: readonly string[];
  story: StoryDraft;
}): string[] {
  const weakDimensionActions: Record<StoryReviewDimension["id"], string> = {
    clarity:
      "Rewrite the opening so the first two sentences cover only the stake, the risk, and your mandate.",
    ownership:
      'Insert explicit ownership language: "I decided," "I changed," "I escalated," or "I reset."',
    action:
      "Expand the action sequence until an interviewer can hear the order of moves and the tradeoff behind them.",
    evidence:
      "Replace soft outcomes with a real metric, percentage, scope marker, or standard-work change.",
    reflection:
      "End with the operating lesson and what changed in how you now lead or inspect the work.",
  };

  const repairPlan = getWeakestDimensionIds(params.dimensions, 3).map(
    (dimensionId) =>
      weakDimensionActions[dimensionId as StoryReviewDimension["id"]],
  );

  if (!params.story.categoryTags.length) {
    repairPlan.push(
      "Tag the story to the Amazon categories it can credibly answer so you can actually rehearse it against the right prompts.",
    );
  }

  return [...new Set([...repairPlan, ...params.upgradeMoves, ...params.misses.slice(0, 2)])].slice(
    0,
    6,
  );
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
      ? "The answer has a usable arc instead of sounding improvised."
      : "Tighten the sequence so the interviewer hears stakes, action, and outcome faster.";

  return {
    id: "structure",
    label: "Structure",
    score: clampScore(score),
    note,
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
      ? "Your personal contribution is visible instead of buried inside team language."
      : "Say what you personally decided, drove, or changed. Right now ownership is too easy to question.";

  return {
    id: "ownership",
    label: "Ownership",
    score: clampScore(score),
    note,
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
  if (
    /\b(from\b.+\bto\b|reduced|increased|cut|grew|saved|avoided)\b/i.test(
      answer,
    )
  ) {
    score += 12;
  }

  const note =
    score >= 75
      ? "You are proving the story with stakes and outcomes instead of asking for trust."
      : "Add hard proof. A bar raiser will look for a number, delta, scope, or risk reduction.";

  return {
    id: "evidence",
    label: "Evidence",
    score: clampScore(score),
    note,
  };
}

function scoreJudgment(
  question: InterviewQuestion,
  answer: string,
): AnswerReviewDimension {
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
    case "leadership":
    case "ownership":
    case "problem_solving":
    case "technical_depth":
      score += tradeoffSignals >= 1 ? 12 : -12;
      break;
    case "stakeholder_management":
      score += countMatches(answer, ALIGNMENT_PATTERN) >= 1 ? 14 : -10;
      break;
    case "adaptability":
      score += countMatches(answer, ADAPTABILITY_PATTERN) >= 1 ? 14 : -10;
      break;
    case "storytelling":
      score += /\b(why this|why here|this role|background|experience)\b/i.test(
        answer,
      )
        ? 12
        : 0;
      break;
    default:
      break;
  }

  const note =
    score >= 75
      ? "The answer shows why you made the call, not just what happened."
      : "Show your tradeoff logic and the lesson you took forward. That is where seniority shows up.";

  return {
    id: "judgment",
    label: "Judgment",
    score: clampScore(score),
    note,
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
      ? "Delivery is direct enough that the substance gets room to land."
      : "Cut the hedge words and tighten long sentences so confidence reads immediately.";

  return {
    id: "delivery",
    label: "Delivery",
    score: clampScore(score),
    note,
  };
}

function hasPlaceholder(text: string): boolean {
  PLACEHOLDER_PATTERN.lastIndex = 0;
  return PLACEHOLDER_PATTERN.test(text);
}

function ensureSentence(text: string): string {
  const trimmed = text.trim();

  if (!trimmed) {
    return "";
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function normalizeStoryField(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function extractSentenceLikeSegments(text: string): string[] {
  return normalizeStoryField(text)
    .split(/(?<=[.!?])\s+|\n+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function tightenStorySituation(text: string): string {
  const segments = extractSentenceLikeSegments(text);

  if (!segments.length) {
    return "";
  }

  return segments.slice(0, 2).map(ensureSentence).join(" ");
}

function tightenStoryTask(text: string): string {
  const trimmed = normalizeStoryField(text);

  if (!trimmed) {
    return "";
  }

  if (
    /\b(i needed|i had to|my objective|my goal|i was responsible)\b/i.test(
      trimmed,
    )
  ) {
    return ensureSentence(trimmed);
  }

  const lowered =
    trimmed.charAt(0).toLowerCase() + trimmed.slice(1).replace(/[.!?]+$/, "");

  return ensureSentence(`I was responsible for ${lowered}`);
}

function addSequenceCue(segment: string, cue: string): string {
  const trimmed = normalizeStoryField(segment);

  if (!trimmed) {
    return "";
  }

  if (/^(first|then|next|finally|after that|from there)[,:]?\s+/i.test(trimmed)) {
    return ensureSentence(trimmed);
  }

  return ensureSentence(`${cue}, ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`);
}

function tightenStoryAction(text: string): string {
  const segments = extractSentenceLikeSegments(text);

  if (!segments.length) {
    return "";
  }

  if (segments.length === 1) {
    return ensureSentence(segments[0]);
  }

  const cues = ["First", "Then", "Next", "Finally"];

  return segments
    .slice(0, 4)
    .map((segment, index) =>
      addSequenceCue(segment, cues[Math.min(index, cues.length - 1)]),
    )
    .join(" ");
}

function tightenStoryResult(text: string): string {
  const segments = extractSentenceLikeSegments(text);

  if (!segments.length) {
    return "";
  }

  return segments.slice(0, 2).map(ensureSentence).join(" ");
}

function tightenStoryReflection(text: string): string {
  const segments = extractSentenceLikeSegments(text);

  if (!segments.length) {
    return "";
  }

  return ensureSentence(segments[0]);
}

const BAR_RAISER_DIMENSION_TARGETS: Record<StoryReviewDimension["id"], number> = {
  clarity: 92,
  ownership: 92,
  action: 94,
  evidence: 94,
  reflection: 90,
};

function stripTerminalPunctuation(text: string): string {
  return normalizeStoryField(text).replace(/[.!?]+$/, "");
}

function lowerFirst(text: string): string {
  if (!text) {
    return text;
  }

  return text.charAt(0).toLowerCase() + text.slice(1);
}

function chooseStoryField(primary: string, fallback: string): string {
  const primaryValue = normalizeStoryField(primary);

  if (primaryValue) {
    return primaryValue;
  }

  const fallbackValue = normalizeStoryField(fallback);
  return hasPlaceholder(fallbackValue) ? "" : fallbackValue;
}

function extractMetricSnippet(text: string): string {
  const match = normalizeStoryField(text).match(
    /\b(\d+%|\$?\d[\d,.]*|hours?\b|days?\b|weeks?\b|months?\b|years?\b|users?\b|customers?\b|tickets?\b|units?\b)\b/i,
  );

  return match?.[0] ?? "";
}

function extractConstraintPhrase(text: string): string {
  const normalized = stripTerminalPunctuation(text);
  const match = normalized.match(/\b(without|while|despite|under)\b(.+)/i);

  if (!match) {
    return "";
  }

  return `${match[1].toLowerCase()}${match[2]}`.trim();
}

function stripTaskPrefix(text: string): string {
  return stripTerminalPunctuation(text).replace(
    /^i (?:needed to|had to|was responsible for|was tasked with)\s+/i,
    "",
  );
}

function buildAmplifiedTitle(story: StoryDraft, fallbackDraft: StoryDraft): string {
  let title = chooseStoryField(story.title, fallbackDraft.title);

  if (!title) {
    title = chooseStoryField(story.situation, fallbackDraft.situation)
      .split(/\s+/)
      .slice(0, 6)
      .join(" ");
  }

  const metric = extractMetricSnippet(
    chooseStoryField(story.result, fallbackDraft.result),
  );

  if (metric && title && !title.includes(metric)) {
    title = `${title} | ${metric}`;
  }

  if (title.length < 10) {
    const extraContext = chooseStoryField(story.situation, fallbackDraft.situation)
      .split(/\s+/)
      .slice(0, 3)
      .join(" ");
    title = `${title} ${extraContext}`.trim();
  }

  return title;
}

function buildAmplifiedSituation(
  story: StoryDraft,
  fallbackDraft: StoryDraft,
): string {
  const base = chooseStoryField(story.situation, fallbackDraft.situation);
  let situation = tightenStorySituation(base);

  if (!situation) {
    return "";
  }

  if (countWords(situation) < 10) {
    const taskContext = stripTaskPrefix(
      chooseStoryField(story.task, fallbackDraft.task),
    );

    if (taskContext && !situation.includes(taskContext)) {
      situation = `${situation} ${ensureSentence(
        `The mandate was ${lowerFirst(taskContext)}`,
      )}`;
    }
  }

  return situation;
}

function buildAmplifiedTask(story: StoryDraft, fallbackDraft: StoryDraft): string {
  const source = chooseStoryField(story.task, fallbackDraft.task);
  const situationFallback = chooseStoryField(story.situation, fallbackDraft.situation);
  let task = tightenStoryTask(source || situationFallback);

  if (!task) {
    return "";
  }

  if (!/\b(i needed|i had to|my objective|my goal|i was responsible)\b/i.test(task)) {
    task = ensureSentence(`I had to ${lowerFirst(stripTaskPrefix(task))}`);
  }

  const constraint =
    extractConstraintPhrase(story.task) ||
    extractConstraintPhrase(story.situation) ||
    extractConstraintPhrase(fallbackDraft.task);

  if (constraint && !task.toLowerCase().includes(constraint.toLowerCase())) {
    task = ensureSentence(`${stripTerminalPunctuation(task)} ${constraint}`);
  }

  return task;
}

function buildTradeoffSentence(task: string, situation: string, action: string): string {
  const constraint = extractConstraintPhrase(task) || extractConstraintPhrase(situation);

  if (constraint) {
    return ensureSentence(
      `Then, I chose the highest-leverage move first because I still had to ${constraint}`,
    );
  }

  if (/\bbottleneck|symptom/i.test(action)) {
    return "Then, I chose to attack the real bottleneck first because chasing the surface symptom would not have held.";
  }

  if (/\b(deadline|launch|customer|risk|quality|timeline|scope|incident|downtime|peak|quota)\b/i.test(
    `${task} ${situation} ${action}`,
  )) {
    return "Then, I chose the highest-risk move first because speed without control would have created a second problem.";
  }

  return "";
}

function buildAlignmentSentence(text: string): string {
  const actorMatch = normalizeStoryField(text).match(
    /\b(leads?|team|stakeholders?|partners?|engineering|support|ops|finance|product|associates?|managers?|vendors?)\b/i,
  );

  if (!actorMatch) {
    return "";
  }

  return ensureSentence(
    `Next, I aligned ${actorMatch[0].toLowerCase()} on the plan, the watch points, and the next decision checkpoint`,
  );
}

function buildFollowThroughSentence(action: string): string {
  if (/\b(stayed|tracked|monitored|checked|watched|inspected|followed|shadowed|audited|stabilized)\b/i.test(action)) {
    return "Finally, I stayed close to the signal until the fix stabilized and the next handoff was safe.";
  }

  return "Finally, I stayed close to the signal until the reset held and the next handoff was repeatable.";
}

function buildAmplifiedAction(
  story: StoryDraft,
  fallbackDraft: StoryDraft,
): string {
  const source = chooseStoryField(story.action, fallbackDraft.action);
  let action = amplifyStoryAction(source);

  if (!action) {
    return "";
  }

  if (!countMatches(`${story.task} ${action}`, DECISION_PATTERN)) {
    const tradeoffSentence = buildTradeoffSentence(story.task, story.situation, source);

    if (tradeoffSentence && !action.includes(tradeoffSentence)) {
      action = `${action} ${tradeoffSentence}`.trim();
    }
  }

  if (!countMatches(action, TRADEOFF_PATTERN)) {
    const tradeoffSentence = buildTradeoffSentence(story.task, story.situation, source);

    if (tradeoffSentence && !action.includes(tradeoffSentence)) {
      action = `${action} ${tradeoffSentence}`.trim();
    }
  }

  if (!countMatches(action, ALIGNMENT_PATTERN)) {
    const alignmentSentence = buildAlignmentSentence(
      `${source} ${story.task} ${story.situation}`,
    );

    if (alignmentSentence) {
      action = `${action} ${alignmentSentence}`.trim();
    }
  }

  if (countWords(action) < 28) {
    action = `${action} ${buildFollowThroughSentence(source)}`.trim();
  }

  return action
    .split(/(?<=[.!?])\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join(" ");
}

function buildAmplifiedResult(
  story: StoryDraft,
  fallbackDraft: StoryDraft,
): string {
  const source = chooseStoryField(story.result, fallbackDraft.result);
  let result = tightenStoryResult(source);

  if (!result) {
    return "";
  }

  if (!countMatches(result, OUTCOME_PATTERN)) {
    result = `${result} ${ensureSentence(
      "This improved the operating outcome and lowered execution risk",
    )}`.trim();
  }

  if (
    !/\b(from\b.+\bto\b|reduced|increased|cut|grew|saved|avoided|improved)\b/i.test(
      result,
    )
  ) {
    const metric = extractMetricSnippet(result);
    result = `${result} ${ensureSentence(
      metric
        ? `This improved the outcome at ${metric} scale`
        : "This changed the business outcome in a measurable way",
    )}`.trim();
  }

  if (
    !countMatches(
      `${result} ${story.reflection} ${fallbackDraft.reflection}`,
      STANDARD_WORK_PATTERN,
    )
  ) {
    result = `${result} ${ensureSentence(
      "The fix also became a repeatable operating rhythm for the team",
    )}`.trim();
  }

  return result;
}

function buildAmplifiedReflection(
  story: StoryDraft,
  fallbackDraft: StoryDraft,
): string {
  const source = chooseStoryField(story.reflection, fallbackDraft.reflection);
  let reflection = tightenStoryReflection(source);

  if (!reflection) {
    reflection =
      "Since then, I use the same operating rhythm and escalation path earlier so the risk does not repeat.";
  }

  if (!countMatches(reflection, LESSON_PATTERN)) {
    reflection = ensureSentence(
      `Since then, ${lowerFirst(stripTerminalPunctuation(reflection))}`,
    );
  }

  if (countWords(reflection) < 8) {
    reflection = ensureSentence(
      `${stripTerminalPunctuation(reflection)}, and I use it as a repeatable operating rhythm now`,
    );
  }

  if (!countMatches(`${story.result} ${reflection}`, STANDARD_WORK_PATTERN)) {
    reflection = ensureSentence(
      `${stripTerminalPunctuation(reflection)}, and I made it part of the operating rhythm`,
    );
  }

  return reflection;
}

function maximizeStoryForBarRaiser(
  story: StoryDraft,
  fallbackDraft: StoryDraft,
): StoryDraft {
  let nextDraft = sanitizeStoryDraft({
    competency: story.competency,
    categoryTags: story.categoryTags,
    grounding: story.grounding,
    title: buildAmplifiedTitle(story, fallbackDraft),
    situation: buildAmplifiedSituation(story, fallbackDraft),
    task: buildAmplifiedTask(story, fallbackDraft),
    action: buildAmplifiedAction(story, fallbackDraft),
    result: buildAmplifiedResult(story, fallbackDraft),
    reflection: buildAmplifiedReflection(story, fallbackDraft),
  });

  for (let iteration = 0; iteration < 2; iteration += 1) {
    const review = reviewStarStory(nextDraft);
    const clarityNeedsLift =
      review.dimensions.find((dimension) => dimension.id === "clarity")?.score ??
      0;
    const ownershipNeedsLift =
      review.dimensions.find((dimension) => dimension.id === "ownership")?.score ??
      0;
    const actionNeedsLift =
      review.dimensions.find((dimension) => dimension.id === "action")?.score ?? 0;
    const evidenceNeedsLift =
      review.dimensions.find((dimension) => dimension.id === "evidence")?.score ??
      0;
    const reflectionNeedsLift =
      review.dimensions.find((dimension) => dimension.id === "reflection")?.score ??
      0;

    nextDraft = sanitizeStoryDraft({
      competency: nextDraft.competency,
      categoryTags: nextDraft.categoryTags,
      grounding: nextDraft.grounding,
      title:
        clarityNeedsLift < BAR_RAISER_DIMENSION_TARGETS.clarity
          ? buildAmplifiedTitle(nextDraft, fallbackDraft)
          : nextDraft.title,
      situation:
        clarityNeedsLift < BAR_RAISER_DIMENSION_TARGETS.clarity
          ? buildAmplifiedSituation(nextDraft, fallbackDraft)
          : nextDraft.situation,
      task:
        Math.min(clarityNeedsLift, ownershipNeedsLift) <
        BAR_RAISER_DIMENSION_TARGETS.ownership
          ? buildAmplifiedTask(nextDraft, fallbackDraft)
          : nextDraft.task,
      action:
        Math.min(ownershipNeedsLift, actionNeedsLift) <
        BAR_RAISER_DIMENSION_TARGETS.action
          ? buildAmplifiedAction(nextDraft, fallbackDraft)
          : nextDraft.action,
      result:
        evidenceNeedsLift < BAR_RAISER_DIMENSION_TARGETS.evidence
          ? buildAmplifiedResult(nextDraft, fallbackDraft)
          : nextDraft.result,
      reflection:
        Math.min(evidenceNeedsLift, reflectionNeedsLift) <
        BAR_RAISER_DIMENSION_TARGETS.reflection
          ? buildAmplifiedReflection(nextDraft, fallbackDraft)
          : nextDraft.reflection,
    });
  }

  return nextDraft;
}

function buildStoryVerdictLabel(score: number): StoryReview["verdictLabel"] {
  if (score >= 85) {
    return "Elite";
  }
  if (score >= 65) {
    return "Competitive";
  }
  return "Not ready";
}

function inferStoryVerdict(score: number): StoryReview["verdict"] {
  if (score >= 85) {
    return "elite";
  }
  if (score >= 65) {
    return "competitive";
  }
  return "not_ready";
}

function scoreStoryClarity(story: StoryDraft): StoryReviewDimension {
  const setupWords = countWords(story.situation);
  const taskWords = countWords(story.task);
  let score = 16;

  if (story.title.length >= 10) {
    score += 14;
  } else if (story.title.length >= 5) {
    score += 7;
  }
  if (setupWords >= 10 && setupWords <= 35) {
    score += 28;
  } else if (setupWords >= 6) {
    score += 16;
  }
  if (taskWords >= 6 && taskWords <= 24) {
    score += 20;
  } else if (taskWords >= 3) {
    score += 10;
  }
  if (countMatches(`${story.situation} ${story.task}`, STAKES_PATTERN) >= 1) {
    score += 12;
  }
  if (countWords(story.situation) > countWords(story.action) && setupWords > 28) {
    score -= 14;
  }
  if (hasPlaceholder(`${story.title} ${story.situation} ${story.task}`)) {
    score -= 16;
  }

  return {
    id: "clarity",
    label: "Clarity",
    score: clampScore(score),
    note:
      score >= 75
        ? "The setup is clear and fast enough for an interviewer to follow."
        : "Tighten the title, stakes, and mandate so the story starts strong instead of warming up.",
  };
}

function scoreStoryOwnership(story: StoryDraft): StoryReviewDimension {
  const ownershipSignals = countMatches(
    `${story.task} ${story.action}`,
    OWNERSHIP_PATTERN,
  );
  let score = 18;

  if (ownershipSignals >= 4) {
    score += 34;
  } else if (ownershipSignals >= 2) {
    score += 24;
  } else if (ownershipSignals >= 1) {
    score += 12;
  }
  if (/\b(i (?:needed|decided|chose|led|owned|built|created|reset|coached|escalated|aligned|standardized))\b/i.test(
    `${story.task} ${story.action}`,
  )) {
    score += 24;
  }
  if (countMatches(`${story.task} ${story.action}`, TEAM_PATTERN) > ownershipSignals * 2) {
    score -= 12;
  }
  if (hasPlaceholder(`${story.task} ${story.action}`)) {
    score -= 16;
  }

  return {
    id: "ownership",
    label: "Ownership",
    score: clampScore(score),
    note:
      score >= 75
        ? "Your role is explicit enough that the interviewer can see what you personally drove."
        : 'Push harder on "I": what you decided, changed, escalated, or taught should be impossible to miss.',
  };
}

function scoreStoryAction(story: StoryDraft): StoryReviewDimension {
  const actionWords = countWords(story.action);
  let score = 12;

  if (actionWords >= 28) {
    score += 30;
  } else if (actionWords >= 18) {
    score += 20;
  } else if (actionWords >= 10) {
    score += 10;
  }
  if (countMatches(story.action, STRUCTURE_PATTERN) >= 1) {
    score += 12;
  }
  if (countMatches(story.action, TRADEOFF_PATTERN) >= 1) {
    score += 18;
  }
  if (countMatches(story.action, ALIGNMENT_PATTERN) >= 1) {
    score += 10;
  }
  if (hasPlaceholder(story.action)) {
    score -= 18;
  }

  return {
    id: "action",
    label: "Action",
    score: clampScore(score),
    note:
      score >= 75
        ? "The action sequence shows judgment instead of reading like a summary."
        : "Add the sequence, the tradeoff, and the alignment move. Action should be the longest, smartest part.",
  };
}

function scoreStoryEvidence(story: StoryDraft): StoryReviewDimension {
  let score = 12;

  if (hasMetric(story.result)) {
    score += 34;
  }
  if (countMatches(story.result, OUTCOME_PATTERN) >= 1) {
    score += 16;
  }
  if (
    /\b(from\b.+\bto\b|reduced|increased|cut|grew|saved|avoided|improved)\b/i.test(
      story.result,
    )
  ) {
    score += 16;
  }
  if (countMatches(`${story.result} ${story.reflection}`, STANDARD_WORK_PATTERN) >= 1) {
    score += 12;
  }
  if (hasPlaceholder(story.result)) {
    score -= 22;
  }

  return {
    id: "evidence",
    label: "Evidence",
    score: clampScore(score),
    note:
      score >= 75
        ? "The result is proving the story with real outcomes and repeatability."
        : "Add a measurable result and show what changed in the process after the win or miss.",
  };
}

function scoreStoryReflection(story: StoryDraft): StoryReviewDimension {
  let score = 10;

  if (countWords(story.reflection) >= 8) {
    score += 34;
  } else if (countWords(story.reflection) >= 4) {
    score += 20;
  }
  if (countMatches(story.reflection, LESSON_PATTERN) >= 1) {
    score += 18;
  }
  if (countMatches(`${story.result} ${story.reflection}`, STANDARD_WORK_PATTERN) >= 1) {
    score += 12;
  }
  if (hasPlaceholder(story.reflection)) {
    score -= 18;
  }

  return {
    id: "reflection",
    label: "Reflection",
    score: clampScore(score),
    note:
      score >= 72
        ? "The lesson gives the story a more senior signal."
        : "Finish with the lesson or new standard work so the story shows growth, not just activity.",
  };
}

function buildStoryGroundingSnapshot(
  input: Partial<StoryDraft> | Partial<StoryGroundingSnapshot>,
): StoryGroundingSnapshot {
  return {
    title: typeof input.title === "string" ? input.title.trim() : "",
    situation:
      typeof input.situation === "string" ? input.situation.trim() : "",
    task: typeof input.task === "string" ? input.task.trim() : "",
    action: typeof input.action === "string" ? input.action.trim() : "",
    result: typeof input.result === "string" ? input.result.trim() : "",
    reflection:
      typeof input.reflection === "string" ? input.reflection.trim() : "",
  };
}

function isStoryGroundingKind(value: unknown): value is StoryGrounding["kind"] {
  return value === "manual" || value === "prep_bank";
}

function sanitizeStoryGrounding(input: unknown): StoryGrounding | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const raw = input as {
    kind?: unknown;
    sourceId?: unknown;
    sourceLabel?: unknown;
    snapshot?: unknown;
  };
  const snapshotSource =
    raw.snapshot && typeof raw.snapshot === "object" ? raw.snapshot : {};
  const snapshot = buildStoryGroundingSnapshot(
    snapshotSource as Partial<StoryGroundingSnapshot>,
  );

  if (
    !snapshot.title &&
    !snapshot.situation &&
    !snapshot.task &&
    !snapshot.action &&
    !snapshot.result &&
    !snapshot.reflection
  ) {
    return null;
  }

  return {
    kind: isStoryGroundingKind(raw.kind) ? raw.kind : "manual",
    sourceId:
      typeof raw.sourceId === "string" && raw.sourceId.trim().length > 0
        ? raw.sourceId
        : undefined,
    sourceLabel:
      typeof raw.sourceLabel === "string" && raw.sourceLabel.trim().length > 0
        ? raw.sourceLabel.trim()
        : snapshot.title || "Grounded story",
    snapshot,
  };
}

function getStoryGroundingBaseline(story: StoryDraft): StoryDraft {
  const snapshot = story.grounding?.snapshot;

  if (!snapshot) {
    return story;
  }

  return sanitizeStoryDraft({
    competency: story.competency,
    categoryTags: story.categoryTags,
    title: snapshot.title,
    situation: snapshot.situation,
    task: snapshot.task,
    action: snapshot.action,
    result: snapshot.result,
    reflection: snapshot.reflection,
    grounding: story.grounding,
  });
}

function refreshStoryGrounding(story: StoryDraft): StoryGrounding {
  if (story.grounding?.kind === "prep_bank") {
    return story.grounding;
  }

  const snapshot = buildStoryGroundingSnapshot(story);

  return {
    kind: "manual",
    sourceId: story.grounding?.sourceId,
    sourceLabel:
      story.title.trim() ||
      story.grounding?.sourceLabel ||
      "Manual story",
    snapshot,
  };
}

function sanitizeStoryDraft(input: Partial<StoryDraft>): StoryDraft {
  return {
    id: typeof input.id === "string" ? input.id : undefined,
    competency: isCompetencyId(input.competency)
      ? input.competency
      : INTERVIEW_COMPETENCIES[0].id,
    categoryTags: uniqueStrings(input.categoryTags).filter((categoryId) =>
      isQuestionCategoryId(categoryId),
    ),
    title: typeof input.title === "string" ? input.title.trim() : "",
    situation:
      typeof input.situation === "string" ? input.situation.trim() : "",
    task: typeof input.task === "string" ? input.task.trim() : "",
    action: typeof input.action === "string" ? input.action.trim() : "",
    result: typeof input.result === "string" ? input.result.trim() : "",
    reflection:
      typeof input.reflection === "string" ? input.reflection.trim() : "",
    grounding: sanitizeStoryGrounding(input.grounding),
  };
}

function sanitizePitch(input: Partial<PitchPack>): PitchPack {
  return {
    present: typeof input.present === "string" ? input.present.trim() : "",
    proof: typeof input.proof === "string" ? input.proof.trim() : "",
    future: typeof input.future === "string" ? input.future.trim() : "",
    whyHere: typeof input.whyHere === "string" ? input.whyHere.trim() : "",
  };
}

function sanitizeMoneyValue(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.round(value);
}

function sanitizeCareerProfile(
  input: Partial<InterviewCareerProfile> | undefined,
): InterviewCareerProfile {
  return {
    currentRole:
      typeof input?.currentRole === "string"
        ? input.currentRole.trim()
        : "Process Assistant",
    currentLevel:
      typeof input?.currentLevel === "string"
        ? input.currentLevel.trim()
        : "L3 / Tier 3",
    targetRole:
      typeof input?.targetRole === "string"
        ? input.targetRole.trim()
        : "Area Manager",
    targetLevel:
      typeof input?.targetLevel === "string"
        ? input.targetLevel.trim()
        : "L4",
    currentTotalComp: sanitizeMoneyValue(input?.currentTotalComp),
    targetTotalComp: sanitizeMoneyValue(input?.targetTotalComp),
  };
}

function sanitizeDrillStat(input: unknown): DrillStat {
  if (!input || typeof input !== "object") {
    return { attempted: 0, solid: 0, strong: 0 };
  }

  const attempted = clampCount((input as { attempted?: unknown }).attempted);
  const strong = Math.min(
    attempted,
    clampCount((input as { strong?: unknown }).strong),
  );
  const solid = Math.min(
    attempted - strong,
    clampCount((input as { solid?: unknown }).solid),
  );

  return { attempted, solid, strong };
}

function sanitizeCompetencyStats(input: unknown): CompetencyStats {
  const initial = getInitialCompetencyStats();

  if (!input || typeof input !== "object") {
    return initial;
  }

  for (const competency of INTERVIEW_COMPETENCIES) {
    initial[competency.id] = sanitizeDrillStat(
      (input as Record<string, unknown>)[competency.id],
    );
  }

  return initial;
}

function isDrillRating(value: unknown): value is DrillRating {
  return value === "needs_work" || value === "solid" || value === "strong";
}

export function isCompetencyId(value: unknown): value is CompetencyId {
  return INTERVIEW_COMPETENCIES.some((competency) => competency.id === value);
}

export function getCompetencyById(
  competencyId: CompetencyId,
): (typeof INTERVIEW_COMPETENCIES)[number] {
  return (
    INTERVIEW_COMPETENCIES.find(
      (competency) => competency.id === competencyId,
    ) ?? INTERVIEW_COMPETENCIES[0]
  );
}

export function getInterviewerLensById(
  interviewerLensId: InterviewerLensId,
): InterviewerLens {
  return (
    INTERVIEWER_LENSES.find((lens) => lens.id === interviewerLensId) ??
    INTERVIEWER_LENSES[INTERVIEWER_LENSES.length - 1]
  );
}

export function createEmptyStoryDraft(
  competency: CompetencyId = "storytelling",
  categoryTags: string[] = [],
): StoryDraft {
  return {
    competency,
    categoryTags: categoryTags.filter((categoryId) =>
      isQuestionCategoryId(categoryId),
    ),
    title: "",
    situation: "",
    task: "",
    action: "",
    result: "",
    reflection: "",
    grounding: null,
  };
}

export function reviewStarStory(story: Partial<StoryDraft>): StoryReview {
  const safe = sanitizeStoryDraft(story);
  const dimensions = [
    scoreStoryClarity(safe),
    scoreStoryOwnership(safe),
    scoreStoryAction(safe),
    scoreStoryEvidence(safe),
    scoreStoryReflection(safe),
  ];
  const score = clampScore(
    dimensions.reduce((sum, dimension) => {
      const weights: Record<StoryReviewDimension["id"], number> = {
        clarity: 0.2,
        ownership: 0.2,
        action: 0.28,
        evidence: 0.22,
        reflection: 0.1,
      };

      return sum + dimension.score * weights[dimension.id];
    }, 0) +
      ([
        safe.title,
        safe.situation,
        safe.task,
        safe.action,
        safe.result,
        safe.reflection,
      ].every((field) => field.length > 0)
        ? 8
        : 0) +
      (safe.categoryTags.length > 0 ? 4 : 0) +
      (!hasPlaceholder(
        `${safe.title} ${safe.situation} ${safe.task} ${safe.action} ${safe.result} ${safe.reflection}`,
      )
        ? 4
        : 0),
  );

  const strengths: string[] = [];
  const misses: string[] = [];
  const upgradeMoves: string[] = [];

  if (dimensions[0].score >= 75) {
    strengths.push("The setup is clear enough to land quickly in an interview.");
  } else {
    misses.push(
      "The opening still needs a sharper stake and mandate so the story starts with signal instead of scene-setting.",
    );
    upgradeMoves.push(
      "Rewrite the first two sentences so they cover only the business risk and what you were responsible for.",
    );
  }

  if (dimensions[1].score >= 75) {
    strengths.push("Ownership is visible and credible.");
  } else {
    misses.push(
      'Ownership is still too soft. A strong interviewer should hear "I decided," "I changed," or "I escalated" quickly.',
    );
    upgradeMoves.push(
      'Replace weak team language with the two or three moves you personally drove.',
    );
  }

  if (dimensions[2].score >= 75) {
    strengths.push("The action section shows sequence and judgment.");
  } else {
    misses.push(
      "The action section needs more decision quality, tradeoff logic, and sequence detail.",
    );
    upgradeMoves.push(
      "Add one sentence on the tradeoff and one on the order of the actions you drove.",
    );
  }

  if (dimensions[3].score >= 75) {
    strengths.push("The result has enough proof to survive scrutiny.");
  } else {
    misses.push(
      "The story still needs harder proof: a number, delta, scope marker, or standard-work change.",
    );
    upgradeMoves.push(
      "End with a measurable result and what became repeatable afterward.",
    );
  }

  if (dimensions[4].score >= 72) {
    strengths.push("The reflection makes the story sound more senior.");
  } else {
    misses.push(
      "The lesson is too thin. Without reflection, the story sounds finished but not learned from.",
    );
    upgradeMoves.push(
      "Add one line on what changed in how you now lead, escalate, or inspect the work.",
    );
  }

  if (!safe.categoryTags.length) {
    misses.push(
      "This story is not tagged to any Amazon category yet, which makes coverage tracking weaker than it should be.",
    );
  }

  const verdict = inferStoryVerdict(score);
  const brutalTruth = buildStoryBrutalTruth(verdict, misses);
  const debriefReadout = buildStoryDebriefReadout({
    verdict,
    story: safe,
    dimensions,
    misses,
  });
  const repairPlan = buildStoryRepairPlan({
    dimensions,
    misses,
    upgradeMoves,
    story: safe,
  });

  return {
    score,
    verdict,
    verdictLabel: buildStoryVerdictLabel(score),
    dimensions,
    strengths: strengths.slice(0, 4),
    misses: [...new Set(misses)].slice(0, 6),
    upgradeMoves: [...new Set(upgradeMoves)].slice(0, 4),
    brutalTruth,
    debriefReadout,
    repairPlan,
  };
}

export function scoreStarStory(story: Partial<StoryDraft>): number {
  return reviewStarStory(story).score;
}

export function buildEliteStoryDraft(
  input: EliteStoryWriterInput,
): EliteStoryWriterDraft {
  const competency = isCompetencyId(input.competency)
    ? input.competency
    : "storytelling";
  const categoryTags = uniqueStrings(input.categoryTags).filter((categoryId) =>
    isQuestionCategoryId(categoryId),
  );
  const titleHint =
    typeof input.titleHint === "string" ? normalizeStoryField(input.titleHint) : "";
  const context =
    typeof input.context === "string" ? normalizeStoryField(input.context) : "";
  const stakes =
    typeof input.stakes === "string" ? normalizeStoryField(input.stakes) : "";
  const actions =
    typeof input.actions === "string" ? normalizeStoryField(input.actions) : "";
  const result =
    typeof input.result === "string" ? normalizeStoryField(input.result) : "";
  const lesson =
    typeof input.lesson === "string" ? normalizeStoryField(input.lesson) : "";

  const contextSegments = extractSentenceLikeSegments(context);
  const stakeSegments = extractSentenceLikeSegments(stakes);
  const actionSegments = extractSentenceLikeSegments(actions);
  const resultSegments = extractSentenceLikeSegments(result);
  const lessonSegments = extractSentenceLikeSegments(lesson);

  const situation =
    [
      ...contextSegments.slice(0, 2),
      ...stakeSegments.filter(
        (segment) =>
          !/\b(i needed|i had to|my objective|my goal|i was responsible)\b/i.test(
            segment,
          ),
      ),
    ]
      .slice(0, 2)
      .map(ensureSentence)
      .join(" ") ||
    "Set the context in two sentences: what was happening, why it mattered, and what risk was real.";

  const task =
    stakeSegments.find((segment) =>
      /\b(i needed|i had to|my objective|my goal|i was responsible)\b/i.test(
        segment,
      ),
    ) ||
    "I needed to [state the specific outcome you owned] without [state the main constraint or risk].";

  const actionDraft =
    actionSegments.map(ensureSentence).join(" ") ||
    "First, I diagnosed the real bottleneck instead of reacting to the surface symptom. Then I chose the highest-leverage move, aligned the right people, and reset the operating rhythm so the fix would hold.";

  const resultDraft =
    resultSegments.map(ensureSentence).join(" ") ||
    "This led to [insert metric or delta], improved [customer/team/business outcome], and changed the standard work by [insert what became repeatable].";

  const reflectionDraft =
    lessonSegments.map(ensureSentence).join(" ") ||
    "Since then, I [insert what changed in how you lead, inspect, escalate, or coach] so the same miss does not repeat.";

  const title =
    titleHint ||
    (contextSegments[0]
      ? contextSegments[0].split(/\s+/).slice(0, 6).join(" ")
      : "Story draft");

  const draft = sanitizeStoryDraft({
    competency,
    categoryTags,
    title,
    situation,
    task: ensureSentence(task),
    action: actionDraft,
    result: resultDraft,
    reflection: reflectionDraft,
  });

  const missingPieces: string[] = [];
  const interviewerWarnings: string[] = [];
  const polishNotes: string[] = [];

  if (!hasMetric(draft.result)) {
    missingPieces.push(
      "Add a real number, percentage, scope, or time delta so the result is provable.",
    );
  }
  if (!countMatches(draft.action, TRADEOFF_PATTERN)) {
    missingPieces.push(
      "Spell out the hardest tradeoff or decision rule so the story sounds senior.",
    );
  }
  if (!countMatches(`${draft.result} ${draft.reflection}`, STANDARD_WORK_PATTERN)) {
    missingPieces.push(
      "Close the story with the mechanism, standard work, or operating change that remained after you.",
    );
  }
  if (hasPlaceholder(`${draft.task} ${draft.result} ${draft.reflection}`)) {
    missingPieces.push(
      "Replace the bracketed scaffolding with your exact facts before you rehearse this live.",
    );
  }

  if (!countMatches(`${draft.task} ${draft.action}`, OWNERSHIP_PATTERN)) {
    interviewerWarnings.push(
      'A high-level interviewer will ask, "What did you personally do?" unless your ownership is clearer.',
    );
  }
  if (!hasMetric(draft.result)) {
    interviewerWarnings.push(
      'A tough interviewer will ask, "What changed in a way another person could verify?"',
    );
  }
  if (!countMatches(draft.action, TRADEOFF_PATTERN)) {
    interviewerWarnings.push(
      'Expect a follow-up like, "What tradeoff did you make, and why was that the right call?"',
    );
  }

  polishNotes.push(
    "Lead with the stake or number, not the backstory.",
    "Keep Action longer than Situation.",
    "End with the result and the lesson so the story sounds complete.",
  );

  const firstMetricMatch = draft.result.match(
    /\b(\d+%|\$?\d[\d,.]*|hours?\b|days?\b|weeks?\b|months?\b|years?\b|users?\b|customers?\b)\b/i,
  );
  const headline = firstMetricMatch
    ? `${draft.title}: anchored by ${firstMetricMatch[0]}`
    : `${draft.title}: needs one hard proof point`;

  return {
    draft,
    headline,
    missingPieces: [...new Set(missingPieces)].slice(0, 4),
    interviewerWarnings: [...new Set(interviewerWarnings)].slice(0, 4),
    polishNotes: polishNotes.slice(0, 3),
  };
}

export function buildStarCoachTips(story: Partial<StoryDraft>): string[] {
  const safe = sanitizeStoryDraft(story);
  const review = reviewStarStory(safe);
  const tips: string[] = [];

  if (safe.title.length < 8) {
    tips.push(
      "Give the story a specific title so you can recall it instantly in an interview loop.",
    );
  }
  if (countWords(safe.situation) < 10) {
    tips.push(
      "Add just enough context in Situation so the stakes make sense without slowing the answer down.",
    );
  }
  if (countWords(safe.task) < 6) {
    tips.push(
      "Clarify your exact task or responsibility so the interviewer knows what you owned.",
    );
  }
  if (countWords(safe.action) < 20) {
    tips.push(
      "Make Action the longest section. This is where your judgment, sequencing, and leadership show up.",
    );
  }
  if (!hasMetric(safe.result)) {
    tips.push(
      "Quantify the result with a delta, time saved, revenue, quality gain, or risk reduced.",
    );
  }
  if (countWords(safe.reflection) < 6) {
    tips.push(
      "Add a short reflection to show what changed in how you now operate.",
    );
  }
  if (
    countWords(safe.situation) > countWords(safe.action) &&
    countWords(safe.situation) > 30
  ) {
    tips.push(
      "Trim the setup. Too much backstory weakens the signal of what you actually did.",
    );
  }

  if (review.score < 70) {
    tips.push(...review.upgradeMoves.slice(0, 2));
  }

  return [...new Set(tips)].slice(0, 4);
}

export function buildEliteStoryPolish(
  story: Partial<StoryDraft>,
): EliteStoryPolish {
  const safe = sanitizeStoryDraft(story);
  const groundedBaseline = getStoryGroundingBaseline(safe);
  const originalReview = reviewStarStory(safe);
  const draftSuggestion = buildEliteStoryDraft({
    competency: safe.competency,
    categoryTags: safe.categoryTags,
    titleHint: chooseStoryField(safe.title, groundedBaseline.title),
    context: chooseStoryField(safe.situation, groundedBaseline.situation),
    stakes: chooseStoryField(safe.task, groundedBaseline.task),
    actions: chooseStoryField(safe.action, groundedBaseline.action),
    result: chooseStoryField(safe.result, groundedBaseline.result),
    lesson: chooseStoryField(safe.reflection, groundedBaseline.reflection),
  });
  const featureBaseline = sanitizeStoryDraft({
    competency: safe.competency,
    categoryTags: safe.categoryTags,
    title: chooseStoryField(groundedBaseline.title, draftSuggestion.draft.title),
    situation: chooseStoryField(
      groundedBaseline.situation,
      draftSuggestion.draft.situation,
    ),
    task: chooseStoryField(groundedBaseline.task, draftSuggestion.draft.task),
    action: chooseStoryField(
      groundedBaseline.action,
      draftSuggestion.draft.action,
    ),
    result: chooseStoryField(
      groundedBaseline.result,
      draftSuggestion.draft.result,
    ),
    reflection: chooseStoryField(
      groundedBaseline.reflection,
      draftSuggestion.draft.reflection,
    ),
    grounding: safe.grounding,
  });

  const polishedDraft = sanitizeStoryDraft({
    competency: safe.competency,
    categoryTags: safe.categoryTags,
    grounding: safe.grounding,
    title:
      safe.title.trim() ||
      (!hasPlaceholder(featureBaseline.title)
        ? featureBaseline.title
        : ""),
    situation: safe.situation.trim()
      ? tightenStorySituation(safe.situation)
      : !hasPlaceholder(featureBaseline.situation)
        ? tightenStorySituation(featureBaseline.situation)
        : "",
    task: safe.task.trim()
      ? tightenStoryTask(safe.task)
      : !hasPlaceholder(featureBaseline.task)
        ? tightenStoryTask(featureBaseline.task)
        : "",
    action: safe.action.trim()
      ? tightenStoryAction(safe.action)
      : !hasPlaceholder(featureBaseline.action)
        ? tightenStoryAction(featureBaseline.action)
        : "",
    result: safe.result.trim()
      ? tightenStoryResult(safe.result)
      : !hasPlaceholder(featureBaseline.result)
        ? tightenStoryResult(featureBaseline.result)
        : "",
    reflection: safe.reflection.trim()
      ? tightenStoryReflection(safe.reflection)
      : !hasPlaceholder(featureBaseline.reflection)
        ? tightenStoryReflection(featureBaseline.reflection)
        : "",
  });

  const polishedReview = reviewStarStory(polishedDraft);
  const keepOriginal = polishedReview.score < originalReview.score;
  const bestDraft = keepOriginal ? safe : polishedDraft;
  const bestReview = keepOriginal ? originalReview : polishedReview;
  const scoreDelta = bestReview.score - originalReview.score;
  const adjustments: string[] = [];

  if (polishedDraft.situation !== safe.situation) {
    adjustments.push(
      "Trimmed the opening so the setup reaches the stakes faster and drops extra scene-setting.",
    );
  }
  if (polishedDraft.task !== safe.task) {
    adjustments.push(
      "Rewrote the task so your ownership is explicit instead of implied.",
    );
  }
  if (polishedDraft.action !== safe.action) {
    adjustments.push(
      "Tightened the action sequence so the story reads like deliberate leadership, not a rough memory dump.",
    );
  }
  if (polishedDraft.result !== safe.result) {
    adjustments.push(
      "Sharpened the result so the ending lands faster and sounds more credible.",
    );
  }
  if (polishedDraft.reflection !== safe.reflection) {
    adjustments.push(
      "Condensed the lesson so the operating change is easier to hear.",
    );
  }

  const bestDraftText = `${bestDraft.task} ${bestDraft.result} ${bestDraft.reflection}`;
  const bestDraftStillHasPlaceholders = /\[insert|\[state/i.test(bestDraftText);
  const remainingGaps = [
    ...bestReview.misses,
    ...draftSuggestion.missingPieces.filter(
      (item) =>
        bestDraftStillHasPlaceholders || !/\[insert|\[state/i.test(item),
    ),
  ];
  const headline =
    keepOriginal
      ? "The source version is already stronger than the rewrite, so the elite path keeps your original structure and focuses the next lift on proof, tradeoffs, and rehearsal."
      : scoreDelta > 0
      ? `Elite polish lifts the story by ${scoreDelta} point${scoreDelta === 1 ? "" : "s"}, but it still needs real proof where the facts are thin.`
      : bestReview.score >= 85
        ? "This story is already strong. The polish pass mainly tightens the language so it sounds more senior out loud."
        : "The wording is tighter now, but the remaining gap is in the facts, proof, or tradeoff quality rather than the phrasing.";

  return {
    draft: bestDraft,
    polishedReview: bestReview,
    scoreDelta,
    headline,
    adjustments: keepOriginal
      ? [
          "The original story already landed better than the rewrite, so the elite path preserved your strongest version instead of forcing a weaker edit.",
          "The next gain is not more rewriting. It is sharper proof, clearer tradeoffs, and more deliberate rehearsal out loud.",
        ]
      : adjustments.length
        ? adjustments
        : [
            "The story already had a solid structure, so the main lift now is better proof and more deliberate rehearsal.",
          ],
    remainingGaps: [...new Set(remainingGaps)].slice(0, 5),
  };
}

function ensureFirstPersonSegment(segment: string): string {
  const trimmed = normalizeStoryField(segment).replace(/[.!?]+$/, "");

  if (!trimmed) {
    return "";
  }

  if (/\b(i|me|my|mine)\b/i.test(trimmed)) {
    return trimmed;
  }

  if (/^[a-z]/i.test(trimmed)) {
    return `I ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
  }

  return `I ${trimmed}`;
}

function amplifyStoryAction(text: string): string {
  const segments = extractSentenceLikeSegments(text);

  if (!segments.length) {
    return "";
  }

  const cues = ["First", "Then", "Next", "Finally"];

  if (segments.length === 1) {
    return ensureSentence(ensureFirstPersonSegment(segments[0]));
  }

  return segments
    .slice(0, 4)
    .map((segment, index) => {
      const firstPerson = ensureFirstPersonSegment(segment);

      if (!firstPerson) {
        return "";
      }

      if (/^(first|then|next|finally|after that|from there)[,:]?\s+/i.test(firstPerson)) {
        return ensureSentence(firstPerson);
      }

      return ensureSentence(
        `${cues[Math.min(index, cues.length - 1)]}, ${firstPerson}`,
      );
    })
    .filter(Boolean)
    .join(" ");
}

export function buildBarRaiserAmplification(
  story: Partial<StoryDraft>,
): BarRaiserAmplification {
  const safe = sanitizeStoryDraft(story);
  const groundedBaseline = getStoryGroundingBaseline(safe);
  const originalReview = reviewStarStory(safe);
  const draftSuggestion = buildEliteStoryDraft({
    competency: safe.competency,
    categoryTags: safe.categoryTags,
    titleHint: chooseStoryField(safe.title, groundedBaseline.title),
    context: chooseStoryField(safe.situation, groundedBaseline.situation),
    stakes: chooseStoryField(safe.task, groundedBaseline.task),
    actions: chooseStoryField(safe.action, groundedBaseline.action),
    result: chooseStoryField(safe.result, groundedBaseline.result),
    lesson: chooseStoryField(safe.reflection, groundedBaseline.reflection),
  });
  const featureBaseline = sanitizeStoryDraft({
    competency: safe.competency,
    categoryTags: safe.categoryTags,
    title: chooseStoryField(groundedBaseline.title, draftSuggestion.draft.title),
    situation: chooseStoryField(
      groundedBaseline.situation,
      draftSuggestion.draft.situation,
    ),
    task: chooseStoryField(groundedBaseline.task, draftSuggestion.draft.task),
    action: chooseStoryField(
      groundedBaseline.action,
      draftSuggestion.draft.action,
    ),
    result: chooseStoryField(
      groundedBaseline.result,
      draftSuggestion.draft.result,
    ),
    reflection: chooseStoryField(
      groundedBaseline.reflection,
      draftSuggestion.draft.reflection,
    ),
    grounding: safe.grounding,
  });

  const amplifiedDraft = maximizeStoryForBarRaiser(safe, featureBaseline);

  const amplifiedReviewCandidate = reviewStarStory(amplifiedDraft);
  const keepOriginal = amplifiedReviewCandidate.score < originalReview.score;
  const bestDraft = keepOriginal ? safe : amplifiedDraft;
  const bestReview = keepOriginal ? originalReview : amplifiedReviewCandidate;
  const scoreDelta = bestReview.score - originalReview.score;
  const bestPressureTest = buildStoryPressureTest(bestDraft);
  const originalDimensionLookup = Object.fromEntries(
    originalReview.dimensions.map((dimension) => [dimension.id, dimension]),
  ) as Record<StoryReviewDimension["id"], StoryReviewDimension>;

  const sectionMetadata: Array<{
    field: BarRaiserAmplificationField;
    label: string;
    reason: string;
  }> = [
    {
      field: "title",
      label: "Title",
      reason:
        "Made the title easier to recall under pressure so you can pull the story faster in a live loop.",
    },
    {
      field: "situation",
      label: "Situation",
      reason:
        "Cut extra setup so the stakes land faster and the interviewer gets to the real signal sooner.",
    },
    {
      field: "task",
      label: "Task",
      reason:
        "Made your ownership explicit so a skeptical interviewer hears what you personally had to drive.",
    },
    {
      field: "action",
      label: "Action",
      reason:
        "Resequenced the action so judgment, leverage, and pacing are easier to follow under scrutiny.",
    },
    {
      field: "result",
      label: "Result",
      reason:
        "Tightened the ending so the proof lands quickly before the interviewer interrupts or redirects.",
    },
    {
      field: "reflection",
      label: "Reflection",
      reason:
        "Closed with the operating change so the story sounds learned from, not merely finished.",
    },
  ];

  const sectionUpgrades = sectionMetadata.flatMap(
    ({ field, label, reason }): BarRaiserAmplificationSection[] => {
      const before = safe[field];
      const after = bestDraft[field];

      if (!after.trim() || before === after) {
        return [];
      }

      return [
        {
          field,
          label,
          before: before || `${label} was blank.`,
          after,
          reason,
        },
      ];
    },
  );

  const proofDemands: string[] = [];

  if (!hasMetric(bestDraft.result)) {
    proofDemands.push(
      "State the exact metric, percentage, time delta, or scope marker that proves the result mattered.",
    );
  }
  if (!countMatches(bestDraft.action, TRADEOFF_PATTERN)) {
    proofDemands.push(
      "Name the hard tradeoff or decision rule so the story sounds like leadership instead of motion.",
    );
  }
  if (!countMatches(`${bestDraft.result} ${bestDraft.reflection}`, STANDARD_WORK_PATTERN)) {
    proofDemands.push(
      "Explain what remained after you: the mechanism, standard work, cadence, or operating habit that stuck.",
    );
  }
  if (!/\b(i|me|my|mine)\b/i.test(`${bestDraft.task} ${bestDraft.action}`)) {
    proofDemands.push(
      "Strip out team blur and state exactly what you personally drove, decided, escalated, or inspected.",
    );
  }
  if (countWords(bestDraft.reflection) < 6) {
    proofDemands.push(
      "Add the lesson that changed how you now lead so the story ends with growth, not just completion.",
    );
  }
  if (hasPlaceholder(`${bestDraft.task} ${bestDraft.action} ${bestDraft.result} ${bestDraft.reflection}`)) {
    proofDemands.push(
      "Replace every scaffolded line with your exact facts before you trust this story in an interview.",
    );
  }

  const weakestDimension = [...bestReview.dimensions].sort(
    (left, right) => left.score - right.score,
  )[0];
  const dimensionNextLift: Record<StoryReviewDimension["id"], string> = {
    clarity:
      "Lead with the stake and your mandate in two clean sentences so the story lands before the follow-up starts.",
    ownership:
      'Keep the answer anchored in "I decided," "I changed," and "I escalated" so no one can hide your signal inside team language.',
    action:
      "Make the action sequence carry the story: order, tradeoff, alignment, and follow-through all need to be audible.",
    evidence:
      "Close with proof another person could verify: metric, delta, scope, and the repeatable mechanism that remained.",
    reflection:
      "Finish with the operating lesson and the mechanism you now use so the story sounds learned from, not just survived.",
  };
  const dimensionGoals = bestReview.dimensions.map((dimension) => {
    const currentScore = originalDimensionLookup[dimension.id]?.score ?? dimension.score;
    const targetScore = BAR_RAISER_DIMENSION_TARGETS[dimension.id];

    return {
      id: dimension.id,
      label: dimension.label,
      currentScore,
      amplifiedScore: dimension.score,
      targetScore,
      gapToTarget: Math.max(0, targetScore - dimension.score),
      nextLift: dimensionNextLift[dimension.id],
    };
  });

  const headline =
    keepOriginal
      ? "Bar Raiser amplify kept the strongest source wording. The next lift is now in harder proof, sharper tradeoffs, and calmer delivery rather than cosmetic rewriting."
      : scoreDelta > 0
        ? `Bar Raiser amplify lifts the story by ${scoreDelta} point${scoreDelta === 1 ? "" : "s"} and deliberately pushes each dimension toward the elite bar.`
        : bestReview.score >= 85
          ? "The story was already strong. Bar Raiser amplify mostly tightens the pacing and sequencing so the strongest proof lands earlier."
          : "The wording is tighter, but the limiting factor is still the quality of the facts, not the phrasing.";

  const barRaiserReadout =
    bestReview.score >= 85
      ? `If I were the Bar Raiser, I would let this story stay in the loop, but I would still probe ${weakestDimension.label.toLowerCase()} because that is the part that separates polished from truly senior signal.`
      : bestReview.score >= 70
        ? `If I were the Bar Raiser, I would keep pressing on ${weakestDimension.label.toLowerCase()}. This is moving toward a hire signal, but it still needs harder proof before I fully trust it.`
        : `If I were the Bar Raiser, this still would not carry the loop. The weakest signal is ${weakestDimension.label.toLowerCase()}, and until that gets sharper, the story is still exposed.`;

  return {
    draft: bestDraft,
    amplifiedReview: bestReview,
    scoreDelta,
    headline,
    barRaiserReadout,
    dimensionGoals,
    amplifierMoves: [
      ...new Set([
        ...bestReview.upgradeMoves,
        ...bestPressureTest.upgradeMoves,
        ...draftSuggestion.polishNotes,
      ]),
    ].slice(0, 5),
    proofDemands: [...new Set(proofDemands)].slice(0, 5),
    sourceBankPrompts: bestPressureTest.pressureQuestions,
    sectionUpgrades,
    remainingRisks: [
      ...new Set([...bestReview.misses, ...bestPressureTest.vulnerabilities]),
    ].slice(0, 6),
  };
}

export function buildStoryScorecardSuggestions(
  story: Partial<StoryDraft>,
): StoryScorecardSuggestion[] {
  const amplification = buildBarRaiserAmplification(story);
  const dimensionLookup = Object.fromEntries(
    amplification.dimensionGoals.map((dimension) => [dimension.id, dimension]),
  ) as Record<StoryReviewDimension["id"], BarRaiserAmplificationDimensionGoal>;

  return [
    {
      dimensionId: "clarity" as const,
      label: "Clarity",
      eliteTarget: dimensionLookup.clarity.targetScore,
      currentScore: dimensionLookup.clarity.currentScore,
      amplifiedScore: dimensionLookup.clarity.amplifiedScore,
      gapToTarget: dimensionLookup.clarity.gapToTarget,
      exampleLabel: "Example stronger opening",
      exampleText: [amplification.draft.situation, amplification.draft.task]
        .filter(Boolean)
        .join(" "),
      whyThisHelps:
        "A strong opening gets the stakes and your mandate on the table before the interviewer has a chance to think the story is wandering.",
      applyFields: ["situation", "task"],
      applyLabel: "Use stronger opening",
    },
    {
      dimensionId: "ownership" as const,
      label: "Ownership",
      eliteTarget: dimensionLookup.ownership.targetScore,
      currentScore: dimensionLookup.ownership.currentScore,
      amplifiedScore: dimensionLookup.ownership.amplifiedScore,
      gapToTarget: dimensionLookup.ownership.gapToTarget,
      exampleLabel: "Example stronger ownership line",
      exampleText: [amplification.draft.task, amplification.draft.action]
        .filter(Boolean)
        .join(" "),
      whyThisHelps:
        'This makes the story unmistakably yours. A Bar Raiser should hear "I decided," "I changed," and "I aligned" without having to drag it out.',
      applyFields: ["task", "action"],
      applyLabel: "Use stronger ownership",
    },
    {
      dimensionId: "action" as const,
      label: "Action",
      eliteTarget: dimensionLookup.action.targetScore,
      currentScore: dimensionLookup.action.currentScore,
      amplifiedScore: dimensionLookup.action.amplifiedScore,
      gapToTarget: dimensionLookup.action.gapToTarget,
      exampleLabel: "Example stronger action sequence",
      exampleText: amplification.draft.action,
      whyThisHelps:
        "This version carries more judgment: order, tradeoff, alignment, and follow-through instead of a loose recap.",
      applyFields: ["action"],
      applyLabel: "Use stronger action",
    },
    {
      dimensionId: "evidence" as const,
      label: "Evidence",
      eliteTarget: dimensionLookup.evidence.targetScore,
      currentScore: dimensionLookup.evidence.currentScore,
      amplifiedScore: dimensionLookup.evidence.amplifiedScore,
      gapToTarget: dimensionLookup.evidence.gapToTarget,
      exampleLabel: "Example stronger result close",
      exampleText: amplification.draft.result,
      whyThisHelps:
        "This lands the measurable outcome faster and makes the business impact easier to verify.",
      applyFields: ["result"],
      applyLabel: "Use stronger result",
    },
    {
      dimensionId: "reflection" as const,
      label: "Reflection",
      eliteTarget: dimensionLookup.reflection.targetScore,
      currentScore: dimensionLookup.reflection.currentScore,
      amplifiedScore: dimensionLookup.reflection.amplifiedScore,
      gapToTarget: dimensionLookup.reflection.gapToTarget,
      exampleLabel: "Example stronger lesson",
      exampleText: amplification.draft.reflection,
      whyThisHelps:
        "A real lesson makes the story sound senior because it shows how your operating system changed, not just what happened once.",
      applyFields: ["reflection"],
      applyLabel: "Use stronger lesson",
    },
  ];
}

function getStoryFieldLabel(
  field: BarRaiserAmplificationField,
): string {
  switch (field) {
    case "title":
      return "Title";
    case "situation":
      return "Situation";
    case "task":
      return "Task";
    case "action":
      return "Action";
    case "result":
      return "Result";
    case "reflection":
      return "Reflection";
  }
}

function classifyStorySegment(
  field: BarRaiserAmplificationField,
  text: string,
): StoryBoundingBox["classification"] {
  if (countMatches(text, WEAK_VERB_PATTERN) > 0) {
    return "fluff";
  }
  if (field === "result" || hasMetric(text) || countMatches(text, OUTCOME_PATTERN) > 0) {
    return "evidence";
  }
  if (countMatches(text, TEAM_PATTERN) > countMatches(text, OWNERSHIP_PATTERN) && countMatches(text, TEAM_PATTERN) > 0) {
    return "team";
  }
  if (countMatches(text, OWNERSHIP_PATTERN) > 0 || countMatches(text, DECISION_PATTERN) > 0) {
    return "ownership";
  }
  return "context";
}

function getBoundingBoxReason(
  classification: StoryBoundingBox["classification"],
): string {
  switch (classification) {
    case "ownership":
      return "This sentence points at what you personally changed, chose, escalated, or built.";
    case "team":
      return "This sentence leans on team language. Keep it only if it supports your direct leadership move.";
    case "evidence":
      return "This is hard proof or outcome signal. Protect it.";
    case "fluff":
      return "This is mostly soft phrasing or vague effort language. Tighten or replace it with proof.";
    default:
      return "This is contextual setup. Keep it short so it does not crowd out the signal.";
  }
}

function buildZeroWasteSuggestion(
  field: BarRaiserAmplificationField,
  text: string,
): StoryZeroWasteSuggestion | null {
  const lowered = text.toLowerCase();
  const removedTerms = ZERO_WASTE_TERMS.filter((term) =>
    lowered.includes(term),
  );

  let cleaned = text;

  for (const term of removedTerms) {
    cleaned = cleaned.replace(new RegExp(`\\b${term.replace(/\s+/g, "\\s+")}\\b`, "gi"), "");
  }

  cleaned = cleaned
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();

  if (!cleaned || cleaned === text) {
    return null;
  }

  return {
    field,
    label: getStoryFieldLabel(field),
    original: text,
    cleaned,
    removedTerms,
  };
}

function buildPlaceholderDefects(
  story: StoryDraft,
): StoryPlaceholderDefect[] {
  const defects: StoryPlaceholderDefect[] = [];
  const addDefect = (
    field: BarRaiserAmplificationField,
    token: string,
    severity: StoryPlaceholderDefect["severity"],
    detail: string,
    repairMove: string,
  ) => {
    defects.push({
      field,
      label: getStoryFieldLabel(field),
      token,
      severity,
      detail,
      repairMove,
    });
  };

  for (const [field, value] of [
    ["situation", story.situation],
    ["task", story.task],
    ["action", story.action],
    ["result", story.result],
    ["reflection", story.reflection],
  ] as const) {
    const ambiguousDates = value.match(AMBIGUOUS_DATE_PATTERN) ?? [];
    for (const token of ambiguousDates) {
      addDefect(
        field,
        token,
        "critical",
        "This time anchor is too vague. A strong interviewer will ask for the exact period and will trust the story less until you give it.",
        "Replace the fuzzy time phrase with an exact month, quarter, peak period, or named event.",
      );
    }

    const placeholders = value.match(PLACEHOLDER_METRIC_PATTERN) ?? [];
    for (const token of placeholders) {
      addDefect(
        field,
        token,
        "critical",
        "This still reads like a scaffold instead of a real fact.",
        "Replace the placeholder with the exact metric, date, delta, or scope marker before using this story live.",
      );
    }

    if (
      countMatches(value, SOFT_NUMBER_PATTERN) > 0 &&
      !hasMetric(value) &&
      (field === "action" || field === "result")
    ) {
      addDefect(
        field,
        "soft quantity",
        "watch",
        "The story relies on vague magnitude language without a verifiable number.",
        "Swap words like significant or a lot for an exact count, percentage, time saved, or cost avoided.",
      );
    }
  }

  if (
    !countMatches(`${story.situation} ${story.task}`, DATE_ANCHOR_PATTERN) &&
    countWords(`${story.situation} ${story.task}`) >= 8
  ) {
    addDefect(
      "situation",
      "missing time anchor",
      "watch",
      "The opening has no anchored date, peak window, or named period, which makes chronology easier to challenge.",
      "Add the quarter, month, peak event, or named operating window so the story starts on verifiable ground.",
    );
  }

  if (
    countWords(story.action) >= 12 &&
    countMatches(story.action, STRUCTURE_PATTERN) === 0
  ) {
    addDefect(
      "action",
      "flat chronology",
      "watch",
      "The action section has detail, but the sequence is still too flat to audit cleanly.",
      "Break the action into first, then, and after that so the interviewer can follow your decision path.",
    );
  }

  return [...new Map(defects.map((defect) => [`${defect.field}-${defect.token}-${defect.detail}`, defect])).values()].slice(
    0,
    6,
  );
}

function buildRoleScaleAssessment(
  story: StoryDraft,
  careerProfile: InterviewCareerProfile,
): StoryRoleScaleAssessment {
  const targetText = `${careerProfile.targetRole} ${careerProfile.targetLevel}`.toLowerCase();
  const storyText = [
    story.situation,
    story.task,
    story.action,
    story.result,
    story.reflection,
  ].join(" ");
  const scaleSignals = countMatches(storyText, SCALE_SIGNAL_PATTERN);
  const peopleSignals = countMatches(storyText, PEOPLE_PATTERN);
  const mechanismSignals = countMatches(storyText, STANDARD_WORK_PATTERN);

  if (/area manager|l4|l5|manager|operations/i.test(targetText)) {
    if (scaleSignals >= 3 && (peopleSignals > 0 || mechanismSignals > 0)) {
      return {
        verdict: "aligned",
        summary:
          "This story reads closer to manager scope because it shows team leverage, operating rhythm, or system-level ownership.",
        rewriteMove:
          "Keep the focus on the mechanism you built and the broader operating outcome, not only the task execution detail.",
      };
    }

    return {
      verdict: "at_risk",
      summary:
        "This story still reads closer to a strong PA executing well than an Area Manager owning the system at scale.",
      rewriteMove:
        "Rewrite the story so the outcome sounds like shift leadership: bigger scope, clearer system ownership, and the mechanism that scaled after you.",
    };
  }

  return {
    verdict: "aligned",
    summary:
      "The story scope is broadly aligned to the target role you entered.",
    rewriteMove:
      "Keep making the scope and operating leverage explicit so the next-level signal is easy to hear.",
  };
}

export function buildStoryCalibrationReport(
  story: Partial<StoryDraft>,
  careerProfile?: Partial<InterviewCareerProfile>,
): StoryCalibrationReport {
  const safe = sanitizeStoryDraft(story);
  const amplification = buildBarRaiserAmplification(safe);
  const review = reviewStarStory(safe);
  const profile = sanitizeCareerProfile(careerProfile);
  const placeholderDefects = buildPlaceholderDefects(safe);
  const ownershipBoxes: StoryBoundingBox[] = (
    [
      ["situation", safe.situation],
      ["task", safe.task],
      ["action", safe.action],
      ["result", safe.result],
      ["reflection", safe.reflection],
    ] as const
  ).flatMap(([field, value]) =>
    extractSentenceLikeSegments(value).map((segment) => {
      const classification = classifyStorySegment(field, segment);

      return {
        field,
        label: getStoryFieldLabel(field),
        text: ensureSentence(segment),
        classification,
        reason: getBoundingBoxReason(classification),
      } satisfies StoryBoundingBox;
    }),
  );

  const ghostMetrics: StoryGhostMetric[] = [];

  if (!hasMetric(safe.result)) {
    ghostMetrics.push({
      field: "result",
      label: "Ghost metric close",
      placeholder:
        "I increased [Metric X] from [Y] to [Z] over [Timeframe] by implementing [Specific Action], which changed [Business Outcome].",
      reason:
        "This forces the result to land with a measurable delta instead of a vague claim.",
    });
  }
  if (!countMatches(safe.action, TRADEOFF_PATTERN)) {
    ghostMetrics.push({
      field: "action",
      label: "Ghost tradeoff line",
      placeholder:
        "I chose [Option A] over [Option B] because [Decision Rule], even though it meant [Constraint or Risk].",
      reason:
        "This plugs the hardest structural hole in weak stories: missing judgment.",
    });
  }
  if (countWords(safe.reflection) < 6) {
    ghostMetrics.push({
      field: "reflection",
      label: "Ghost lesson line",
      placeholder:
        "Since then, I built [Mechanism or Standard Work] into [Process] so the same miss does not repeat.",
      reason:
        "This gives the story a real leadership lesson instead of ending on activity alone.",
    });
  }

  const zeroWasteSuggestions = (
    [
      ["situation", safe.situation],
      ["task", safe.task],
      ["action", safe.action],
      ["result", safe.result],
      ["reflection", safe.reflection],
    ] as const
  )
    .map(([field, value]) => buildZeroWasteSuggestion(field, value))
    .filter((item): item is StoryZeroWasteSuggestion => item !== null);

  const totalWords =
    countWords(safe.situation) +
    countWords(safe.task) +
    countWords(safe.action) +
    countWords(safe.result) +
    countWords(safe.reflection);
  const estimatedRuntime = estimateSpokenSeconds(totalWords);
  const openingShare =
    totalWords > 0
      ? Math.round(
          ((countWords(safe.situation) + countWords(safe.task)) / totalWords) *
            100,
        )
      : 0;
  const actionShare =
    totalWords > 0
      ? Math.round((countWords(safe.action) / totalWords) * 100)
      : 0;
  const speechDefects =
    countMatches(
      [
        safe.situation,
        safe.task,
        safe.action,
        safe.result,
        safe.reflection,
      ].join(" "),
      PASSIVE_VOICE_PATTERN,
    ) +
    countMatches(
      [
        safe.situation,
        safe.task,
        safe.action,
        safe.result,
        safe.reflection,
      ].join(" "),
      WEAK_VERB_PATTERN,
    );
  const deliveryMetrics: StoryDeliveryMetric[] = [
    {
      id: "estimated_runtime",
      label: "Speech pack rate",
      value: `${estimatedRuntime}s estimated`,
      note:
        estimatedRuntime <= 120
          ? "This should fit a disciplined first answer."
          : "The story is likely too long for a first pass. Zero waste it before you rehearse.",
      status: estimatedRuntime <= 120 ? "good" : "risk",
    },
    {
      id: "context_share",
      label: "Context share",
      value: `${openingShare}%`,
      note:
        openingShare <= 38
          ? "The opening is lean enough to get to the signal fast."
          : "Too much setup. Cut context until the interviewer reaches your action sooner.",
      status: openingShare <= 38 ? "good" : openingShare <= 48 ? "watch" : "risk",
    },
    {
      id: "action_share",
      label: "Action share",
      value: `${actionShare}%`,
      note:
        actionShare >= 35
          ? "Action owns enough of the story to carry judgment."
          : "Action is underpowered. Push more of the runtime into the decisions you made.",
      status: actionShare >= 35 ? "good" : actionShare >= 28 ? "watch" : "risk",
    },
    {
      id: "speech_defects",
      label: "Narrative defects",
      value: `${speechDefects}`,
      note:
        speechDefects === 0
          ? "No obvious passive or weak-verb defects."
          : "Each passive phrase or weak verb dilutes ownership. Replace them before you rehearse this out loud.",
      status: speechDefects === 0 ? "good" : speechDefects <= 2 ? "watch" : "risk",
    },
  ];

  const resultMetric = extractMetricSnippet(safe.result);
  const redTeamFollowUps = [
    resultMetric
      ? `You said you moved ${resultMetric}. What broke downstream when you pushed that hard, and how did you repair it?`
      : "You say the outcome improved. What is the exact metric, and what would the numbers have looked like if your move had failed?",
    countMatches(safe.action, TRADEOFF_PATTERN) > 0
      ? "What option did you reject, and why would that have been the worse call under the same constraints?"
      : "I still do not hear the hard tradeoff. What did you deliberately deprioritize to protect the outcome?",
    countMatches(safe.action, ALIGNMENT_PATTERN) > 0 || countMatches(safe.action, PEOPLE_PATTERN) > 0
      ? "Who pushed back on your approach, and what did you do when alignment was not immediate?"
      : "This still sounds individual. Where did you have to influence other people, and how did you know they were truly aligned?",
  ];

  return {
    strictnessScore: clampScore(
      Math.max(
        0,
        review.score -
          6 -
          placeholderDefects.filter((defect) => defect.severity === "critical").length * 4 -
          placeholderDefects.filter((defect) => defect.severity === "watch").length * 2 +
          (ghostMetrics.length ? 0 : 4),
      ),
    ),
    sourceAnchor:
      safe.grounding?.sourceLabel ||
      safe.title ||
      "Current story draft",
    ownershipBoxes,
    ghostMetrics,
    placeholderDefects,
    zeroWasteSuggestions,
    redTeamFollowUps,
    deliveryMetrics,
    roleScale: buildRoleScaleAssessment(amplification.draft, profile),
  };
}

export function buildPrepMomentumDashboard(
  progress: InterviewPrepProgress,
): PrepMomentumDashboard {
  const recentReviews = progress.barRaiserHistory.slice(0, 8);
  const recentDrills = progress.drillHistory.slice(0, 12);
  const recentDurations = recentReviews
    .map((entry) => entry.durationSeconds)
    .filter((value): value is number => value !== null);
  const averageDuration = recentDurations.length
    ? Math.round(
        recentDurations.reduce((sum, value) => sum + value, 0) /
          recentDurations.length,
      )
    : 0;
  const repeatedCategoryCount = recentReviews.reduce(
    (result, entry) => {
      result[entry.sourceCategoryId] = (result[entry.sourceCategoryId] ?? 0) + 1;
      return result;
    },
    {} as Record<string, number>,
  );
  const heaviestCategory = Object.entries(repeatedCategoryCount).sort(
    (left, right) => right[1] - left[1],
  )[0];
  const burnoutSignals: string[] = [];
  let burnoutRisk: PrepMomentumDashboard["burnoutRisk"] = "low";

  if (recentReviews.length >= 5) {
    burnoutSignals.push(
      `${recentReviews.length} harsh reviews are clustered in your recent window.`,
    );
    burnoutRisk = "medium";
  }
  if (averageDuration >= 150) {
    burnoutSignals.push(
      `Average recent answer length is ${averageDuration}s, which usually means you are rehearsing long and starting to sound scripted.`,
    );
    burnoutRisk = "high";
  }
  if (heaviestCategory && heaviestCategory[1] >= 3) {
    burnoutSignals.push(
      `You are leaning hard on ${heaviestCategory[0]} reps. That is useful until it starts to flatten your range.`,
    );
    burnoutRisk = burnoutRisk === "high" ? "high" : "medium";
  }
  if (!burnoutSignals.length) {
    burnoutSignals.push(
      "Your recent prep load looks sustainable. Keep rotating stories and categories so you stay sharp without sounding rehearsed.",
    );
  }

  const compDelta =
    progress.careerProfile.currentTotalComp !== null &&
    progress.careerProfile.targetTotalComp !== null
      ? Math.max(
          0,
          progress.careerProfile.targetTotalComp -
            progress.careerProfile.currentTotalComp,
        )
      : null;
  const weeklyUpsideAtRisk =
    compDelta !== null ? Math.round(compDelta / 26) : null;

  return {
    burnoutRisk,
    burnoutSummary:
      burnoutRisk === "high"
        ? "You are at risk of rehearsing yourself into robotic delivery. Rotate questions, shorten takes, and stop grinding the same answer."
        : burnoutRisk === "medium"
          ? "Prep load is rising. Keep the quality high, but vary categories and keep answers inside the target box."
          : "Prep cadence is healthy right now. Protect consistency more than volume.",
    burnoutSignals,
    compDelta,
    compSummary:
      compDelta !== null
        ? `${formatMoney(progress.careerProfile.currentTotalComp)} -> ${formatMoney(progress.careerProfile.targetTotalComp)} (${formatMoney(compDelta)} delta)`
        : "Set your current and target total comp to quantify the upside you are chasing.",
    weeklyUpsideAtRisk,
    cadenceSummary:
      recentDrills.length || recentReviews.length
        ? `Recent cadence: ${recentDrills.length} drill reps and ${recentReviews.length} harsh reviews in the current window.`
        : "No recent reps logged yet. The dashboard becomes useful once you start logging drills and harsh reviews.",
    repetitionRisk: heaviestCategory
      ? `${heaviestCategory[0]} shows up ${heaviestCategory[1]} times in your recent harsh-review window.`
      : "No single category is dominating your recent harsh-review window yet.",
  };
}

export function buildReadinessForecast(
  progress: InterviewPrepProgress,
): ReadinessForecast {
  const calibration = getLevelCalibrationTargets(progress.careerProfile.targetLevel);
  const coverage = getAmazonCoverageSummary(progress);
  const recentScores = [...progress.barRaiserHistory]
    .slice(0, 8)
    .reverse()
    .map((entry) => entry.score);
  const averageScore = recentScores.length
    ? Math.round(
        recentScores.reduce((sum, score) => sum + score, 0) /
          recentScores.length,
      )
    : 0;
  const momentumDelta =
    recentScores.length >= 2
      ? recentScores[recentScores.length - 1] - recentScores[0]
      : 0;
  const momentum: ReadinessForecast["momentum"] =
    momentumDelta >= 5 ? "rising" : momentumDelta <= -4 ? "slipping" : "flat";
  const strongStories = progress.stories.filter(
    (story) => reviewStarStory(story).score >= calibration.storyScoreFloor,
  ).length;
  const categoryCoverage = getStoryCategoryCoverage(progress);
  const thinkBigCoverage = categoryCoverage["think-big"] ?? 0;
  const diveDeepCoverage = categoryCoverage["dive-deep"] ?? 0;
  const technicalSignalCount = progress.stories.filter(
    (story) =>
      story.competency === "technical_depth" ||
      story.categoryTags.includes("dive-deep") ||
      story.categoryTags.includes("interpretation-and-analysis"),
  ).length;

  const blockers: string[] = [];
  if (averageScore < calibration.requiredAverageScore) {
    blockers.push(
      `Your recent harsh-review average is ${averageScore}, but ${progress.careerProfile.targetLevel} prep needs roughly ${calibration.requiredAverageScore} to feel safe.`,
    );
  }
  if (strongStories < calibration.targetStoryCount) {
    blockers.push(
      `Only ${strongStories} stories currently clear the ${calibration.storyScoreFloor}+ bar, which is short of the ${calibration.targetStoryCount} story bank this level usually needs.`,
    );
  }
  if (coverage.managerRepCount < calibration.targetManagerReps) {
    blockers.push(
      `Manager-only pressure is undertrained: ${coverage.managerRepCount}/${calibration.targetManagerReps} reps.`,
    );
  }
  if (coverage.lpCovered < calibration.targetLpCoverage) {
    blockers.push(
      `Leadership Principle coverage is still thin at ${coverage.lpCovered}/${calibration.targetLpCoverage} for this target level.`,
    );
  }
  if (coverage.functionalCovered < calibration.targetFunctionalCoverage) {
    blockers.push(
      `Functional coverage is still thin at ${coverage.functionalCovered}/${calibration.targetFunctionalCoverage}.`,
    );
  }
  if (calibration.levelNumber >= 5 && thinkBigCoverage === 0) {
    blockers.push(
      "There is no saved Think Big proof yet, which will read as a missing scale signal at higher levels.",
    );
  }
  if (calibration.levelNumber >= 6 && diveDeepCoverage === 0 && technicalSignalCount === 0) {
    blockers.push(
      "The story bank still lacks Dive Deep / technical-depth proof strong enough for L6 pressure.",
    );
  }

  const scoreProgress = Math.min(
    100,
    Math.round((averageScore / calibration.requiredAverageScore) * 100),
  );
  const storyProgress = Math.min(
    100,
    Math.round((strongStories / calibration.targetStoryCount) * 100),
  );
  const managerProgress = Math.min(
    100,
    Math.round((coverage.managerRepCount / calibration.targetManagerReps) * 100),
  );
  const lpProgress = Math.min(
    100,
    Math.round((coverage.lpCovered / calibration.targetLpCoverage) * 100),
  );
  const functionalProgress = Math.min(
    100,
    Math.round(
      (coverage.functionalCovered / calibration.targetFunctionalCoverage) * 100,
    ),
  );
  const projectedPassProbability = clampScore(
    scoreProgress * 0.36 +
      storyProgress * 0.18 +
      managerProgress * 0.14 +
      lpProgress * 0.14 +
      functionalProgress * 0.08 +
      (momentum === "rising" ? 8 : momentum === "slipping" ? -8 : 0) -
      blockers.length * 4,
  );

  const daysToPeakReadiness = Math.max(
    0,
    Math.round(
      Math.max(0, calibration.requiredAverageScore - averageScore) * 1.4 +
        Math.max(0, calibration.targetStoryCount - strongStories) * 2.5 +
        Math.max(0, calibration.targetManagerReps - coverage.managerRepCount) *
          2.2 +
        Math.max(0, calibration.targetLpCoverage - coverage.lpCovered) * 1.4 +
        Math.max(
          0,
          calibration.targetFunctionalCoverage - coverage.functionalCovered,
        ) *
          1.2 -
        (momentum === "rising" ? 2 : 0),
    ),
  );

  return {
    levelTarget: `${progress.careerProfile.targetRole} ${progress.careerProfile.targetLevel}`.trim(),
    requiredAverageScore: calibration.requiredAverageScore,
    projectedPassProbability,
    daysToPeakReadiness,
    momentum,
    summary:
      projectedPassProbability >= 80
        ? `This looks ${calibration.pressureLabel} competitive right now. Keep drilling the weak seams instead of changing the whole system.`
        : projectedPassProbability >= 60
          ? `You are trending toward ${calibration.pressureLabel} readiness, but the prep still has visible leak points.`
          : `Right now the app would not call you safe for ${calibration.pressureLabel} pressure. The gaps are still material.`,
    trajectoryNote:
      momentum === "rising"
        ? "Recent harsh-review scores are moving up, so the deliberate practice is paying off."
        : momentum === "slipping"
          ? "Recent harsh-review scores are sliding, which usually means either fatigue or too much uncorrected repetition."
          : "The score trajectory is flat. To break through, fix the same weak answer instead of just logging more reps.",
    blockers: blockers.slice(0, 5),
  };
}

export function buildStorySaturationReport(
  progress: InterviewPrepProgress,
  family: InterviewSourceFamily = "lp",
): StorySaturationReport {
  const coverage = getStoryCategoryCoverage(progress);
  const categories = getQuestionCategoriesByFamily(family);
  const totalTagged = categories.reduce(
    (sum, category) => sum + (coverage[category.id] ?? 0),
    0,
  );
  const questionCountByCategory = INTERVIEW_QUESTIONS.reduce(
    (result, question) => {
      result[question.sourceCategoryId] =
        (result[question.sourceCategoryId] ?? 0) + 1;
      return result;
    },
    {} as Record<string, number>,
  );
  const overIndexThreshold = Math.max(
    2,
    Math.ceil(Math.max(1, totalTagged) * 0.28),
  );

  const overIndexedCategories = categories
    .filter((category) => (coverage[category.id] ?? 0) >= overIndexThreshold)
    .sort(
      (left, right) =>
        (coverage[right.id] ?? 0) - (coverage[left.id] ?? 0),
    )
    .slice(0, 3)
    .map((category) => ({
      categoryId: category.id,
      label: category.label,
      count: coverage[category.id] ?? 0,
      status: "over_indexed" as const,
      detail:
        "You are leaning on this signal repeatedly. That helps until it starts making you sound narrow or scripted.",
    }));

  const starvedCategories = categories
    .filter((category) => (coverage[category.id] ?? 0) === 0)
    .sort(
      (left, right) =>
        (questionCountByCategory[right.id] ?? 0) -
        (questionCountByCategory[left.id] ?? 0),
    )
    .slice(0, 4)
    .map((category) => ({
      categoryId: category.id,
      label: category.label,
      count: 0,
      status: "starved" as const,
      detail:
        "There is no saved story coverage here yet, so this signal is still exposed under pressure.",
    }));

  const criticalGapIds =
    family === "lp"
      ? ["think-big", "frugality", "earn-trust", "dive-deep"]
      : [
          "vision-and-strategy",
          "team-and-people-management",
          "interpretation-and-analysis",
          "judgment-and-decision-making",
        ];
  const criticalSignalGaps = criticalGapIds
    .filter((categoryId) => (coverage[categoryId] ?? 0) === 0)
    .map((categoryId) => {
      const category = getQuestionCategoryById(categoryId);
      return `${category.label} has no saved story coverage yet.`;
    })
    .slice(0, 4);

  return {
    summary:
      overIndexedCategories.length || starvedCategories.length
        ? `You are not balanced yet across ${INTERVIEW_SOURCE_FAMILY_LABELS[family]}. Use this to stop hiding in your best lane and close the exposed ones.`
        : `Coverage across ${INTERVIEW_SOURCE_FAMILY_LABELS[family]} is balanced enough that you can keep tightening quality instead of chasing breadth.`,
    overIndexedCategories,
    starvedCategories,
    criticalSignalGaps,
  };
}

export function buildStoryPivotPack(
  story: Partial<StoryDraft>,
): StoryPivotPack {
  const safe = sanitizeStoryDraft(story);
  const preferredCategoryIds = [
    ...safe.categoryTags,
    safe.competency === "ownership" ? "ownership" : "",
    safe.competency === "stakeholder_management" ? "earn-trust" : "",
    safe.competency === "technical_depth" ? "dive-deep" : "",
    "deliver-results",
    "earn-trust",
    "think-big",
  ].filter((value): value is string => Boolean(value) && isQuestionCategoryId(value));
  const categoryIds = [...new Set(preferredCategoryIds)].slice(0, 3);

  const nodes = categoryIds.map((categoryId, index) => {
    const category = getQuestionCategoryById(categoryId);
    const framingMove =
      categoryId === "deliver-results"
        ? "Tell the ending as the business recovery: compress setup, show the operating tradeoff, and land the hard result early."
        : categoryId === "earn-trust"
          ? "Tell the ending through the credibility move: what resistance existed, how you won trust, and what changed after people bought in."
          : categoryId === "think-big"
            ? "Tell the ending as leverage and scale: how the mechanism outlived the moment and changed a broader system."
            : `Retell the ending so ${category.label} is the loudest signal instead of an implied side-effect.`;
    const pivotedResult =
      safe.result.trim().length > 0
        ? categoryId === "earn-trust"
          ? `${safe.result} The result matters here because it also changed how others trusted my judgment and followed the plan.`
          : categoryId === "think-big"
            ? `${safe.result} The bigger signal is that the move changed more than the immediate issue; it created leverage beyond the first save.`
            : `${safe.result} That is the line I would land first because it proves the story worked in the business, not only in the room.`
        : "You still need a real result ending here before this pivot is safe.";
    const pivotedReflection =
      safe.reflection.trim().length > 0
        ? categoryId === "deliver-results"
          ? `${safe.reflection} In this pivot, emphasize the operating habit or cadence that kept the result repeatable.`
          : categoryId === "earn-trust"
            ? `${safe.reflection} In this pivot, emphasize what changed in how you align or coach people after the event.`
            : `${safe.reflection} In this pivot, emphasize the mechanism or scope lesson so the interviewer hears next-level signal.`
        : "Add a clearer lesson so this pivot has an ending that sounds learned from, not merely finished.";

    return {
      id: `pivot-${index + 1}-${categoryId}`,
      categoryId,
      label:
        categoryId === "deliver-results"
          ? "Business result pivot"
          : categoryId === "earn-trust"
            ? "Trust pivot"
            : categoryId === "think-big"
              ? "Scale pivot"
              : `${category.label} pivot`,
      targetCategoryLabel: category.label,
      framingMove,
      pivotedResult,
      pivotedReflection,
    };
  });

  return {
    summary:
      nodes.length > 0
        ? "Use these pivot endings to retell the same grounded facts for different interview angles without crossing stories."
        : "Add category tags or more story detail and the pivot pack will generate multiple safe endings from the same source story.",
    nodes,
  };
}

export function buildPromptAdherenceMatrix(
  baselinePrompt: string,
  candidatePrompt: string,
): PromptAdherenceMatrix {
  const baselineText = baselinePrompt.toLowerCase();
  const candidateText = candidatePrompt.toLowerCase();

  const results = PROMPT_EVAL_CONTROL_BATCH.map((probe) => {
    const baselineRequired = countSignalGroupMatches(
      baselineText,
      probe.requiredSignals,
    );
    const candidateRequired = countSignalGroupMatches(
      candidateText,
      probe.requiredSignals,
    );
    const baselineNegative = countSignalGroupMatches(
      baselineText,
      probe.negativeSignals,
    );
    const candidateNegative = countSignalGroupMatches(
      candidateText,
      probe.negativeSignals,
    );
    const baselineScore = clampScore(
      baselineRequired.score * 80 + baselineNegative.score * 20,
    );
    const candidateScore = clampScore(
      candidateRequired.score * 80 + candidateNegative.score * 20,
    );

    return {
      probeId: probe.id,
      title: probe.title,
      scenario: probe.scenario,
      baselineScore,
      candidateScore,
      delta: candidateScore - baselineScore,
      matchedSignals: [...candidateRequired.matched, ...candidateNegative.matched],
      missedSignals: [...candidateRequired.missed, ...candidateNegative.missed],
    } satisfies PromptEvalProbeResult;
  }).sort((left, right) => left.candidateScore - right.candidateScore);

  const baselineScore = clampScore(
    results.reduce((sum, result) => sum + result.baselineScore, 0) /
      results.length,
  );
  const candidateScore = clampScore(
    results.reduce((sum, result) => sum + result.candidateScore, 0) /
      results.length,
  );
  const delta = candidateScore - baselineScore;

  return {
    controlBatchSize: results.length,
    baselineScore,
    candidateScore,
    delta,
    autoReject: delta < 0,
    summary:
      delta >= 0
        ? `Candidate instructions hold at or above the current adherence bar across ${results.length} control probes.`
        : `Candidate instructions lose adherence against the current baseline and should be rejected until the missed constraints are patched.`,
    results: results.slice(0, 12),
  };
}

export function buildTextXRay(text: string): TextXRayReport {
  const normalized = normalizeStoryField(text);
  const patternSpecs = [
    {
      pattern: PLACEHOLDER_METRIC_PATTERN,
      label: "Placeholder leak",
      severity: "critical" as const,
      reason:
        "This token still looks scaffolded or fabricated. It will collapse under follow-up.",
      repairMove:
        "Replace it with the exact date, metric, delta, or scope marker before using the output.",
    },
    {
      pattern: AMBIGUOUS_DATE_PATTERN,
      label: "Chronology blur",
      severity: "critical" as const,
      reason:
        "The timing is too vague for a senior interviewer to trust without pushing back.",
      repairMove:
        "Swap the fuzzy phrase for the exact month, quarter, peak window, or named event.",
    },
    {
      pattern: WEAK_VERB_PATTERN,
      label: "Ownership leak",
      severity: "watch" as const,
      reason:
        "This wording softens agency and makes your contribution easier to question.",
      repairMove:
        "Replace it with the decision or intervention you personally drove.",
    },
    {
      pattern: FILLER_PATTERN,
      label: "Filler token",
      severity: "watch" as const,
      reason:
        "This weakens confidence and wastes time without adding signal.",
      repairMove:
        "Cut the filler and keep the sentence moving toward the stake, action, or proof.",
    },
    {
      pattern: TEAM_PATTERN,
      label: "Team blur",
      severity: "watch" as const,
      reason:
        "Team language is not wrong, but it becomes dangerous when it hides your direct ownership.",
      repairMove:
        'Pair it with "I decided", "I changed", or "I escalated" so the ownership survives.',
    },
  ];

  const windows = patternSpecs.flatMap((spec, specIndex) => {
    const matches = [...normalized.matchAll(new RegExp(spec.pattern.source, spec.pattern.flags))];
    return matches.map((match, matchIndex) => ({
      id: `xray-${specIndex}-${matchIndex}-${match.index ?? 0}`,
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
      text: match[0],
      label: spec.label,
      severity: spec.severity,
      reason: spec.reason,
      repairMove: spec.repairMove,
    }));
  });

  return {
    summary: windows.length
      ? "These are the exact tokens where the output starts leaking trust, ownership, or precision."
      : "No obvious token-level leaks were detected in this text.",
    windows: windows.slice(0, 16),
  };
}

export function buildPrepTrendSeries(
  progress: InterviewPrepProgress,
  days = 14,
): PrepTrendPoint[] {
  const today = new Date();

  return Array.from({ length: days }, (_, index) => {
    const targetDate = new Date(today.getTime() - (days - index - 1) * DAY_MS);
    const dayKey = toDayKey(targetDate);
    const reviews = progress.barRaiserHistory.filter((entry) =>
      entry.date.startsWith(dayKey),
    );
    const score = reviews.length
      ? Math.round(
          reviews.reduce((sum, entry) => sum + entry.score, 0) / reviews.length,
        )
      : null;
    const packRateValues = reviews
      .filter(
        (
          entry,
        ): entry is typeof entry & {
          durationSeconds: number;
        } => typeof entry.durationSeconds === "number" && entry.durationSeconds > 0,
      )
      .map((entry) =>
        Math.round((entry.wordCount / entry.durationSeconds) * 60),
      );
    const packRate = packRateValues.length
      ? Math.round(
          packRateValues.reduce((sum, value) => sum + value, 0) /
            packRateValues.length,
        )
      : null;

    return {
      day: dayKey,
      label: targetDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score,
      packRate,
    };
  });
}

export function pickEnduranceLoopQuestions(
  questions: readonly InterviewQuestion[],
  count: number,
  random: () => number = Math.random,
): InterviewQuestion[] {
  const remaining = [...questions];
  const picked: InterviewQuestion[] = [];
  const usedCategoryIds = new Set<string>();

  while (remaining.length > 0 && picked.length < count) {
    const unusedCategoryPool = remaining.filter(
      (question) => !usedCategoryIds.has(question.sourceCategoryId),
    );
    const activePool = unusedCategoryPool.length ? unusedCategoryPool : remaining;
    const index = Math.floor(random() * activePool.length);
    const selection = activePool[index];

    if (!selection) {
      break;
    }

    picked.push(selection);
    usedCategoryIds.add(selection.sourceCategoryId);
    const remainingIndex = remaining.findIndex(
      (question) => question.id === selection.id,
    );
    if (remainingIndex >= 0) {
      remaining.splice(remainingIndex, 1);
    }
  }

  return picked;
}

export function buildEnduranceLoopPlan(
  questions: readonly InterviewQuestion[],
  progress: InterviewPrepProgress,
): EnduranceLoopPlan {
  const rounds: Array<{
    id: string;
    lensId: InterviewerLensId;
    title: string;
    preferredCompetencies: CompetencyId[];
  }> = [
    {
      id: "round-1",
      lensId: "hiring_manager",
      title: "Round 1: Hiring manager fit and scope",
      preferredCompetencies: ["leadership", "ownership", "storytelling"],
    },
    {
      id: "round-2",
      lensId: "finance_partner",
      title: "Round 2: ROI and tradeoff pressure",
      preferredCompetencies: ["problem_solving", "ownership", "leadership"],
    },
    {
      id: "round-3",
      lensId: "tech_lead",
      title: "Round 3: Systems and mechanism pressure",
      preferredCompetencies: ["technical_depth", "problem_solving", "adaptability"],
    },
    {
      id: "round-4",
      lensId: "l7_bar_raiser",
      title: "Round 4: Final hostile bar raiser",
      preferredCompetencies: ["leadership", "ownership", "stakeholder_management"],
    },
  ];
  const remaining = [...questions].sort((left, right) => {
    const leftAttempts = progress.questionStats[left.id]?.attempted ?? 0;
    const rightAttempts = progress.questionStats[right.id]?.attempted ?? 0;
    if (leftAttempts !== rightAttempts) {
      return leftAttempts - rightAttempts;
    }
    const managerDelta = Number(right.managerOnly) - Number(left.managerOnly);
    if (managerDelta !== 0) {
      return managerDelta;
    }
    return right.followUps.length - left.followUps.length;
  });
  const usedCategoryIds = new Set<string>();

  const builtRounds: EnduranceLoopRound[] = rounds.map((round, roundIndex) => {
    const preferred = remaining.filter((question) =>
      round.preferredCompetencies.includes(question.competency),
    );
    const sourcePool = preferred.length ? preferred : remaining;
    const unusedCategoryPool = sourcePool.filter(
      (question) => !usedCategoryIds.has(question.sourceCategoryId),
    );
    const selected = pickEnduranceLoopQuestions(
      unusedCategoryPool.length ? unusedCategoryPool : sourcePool,
      3,
      () => 0,
    );

    for (const question of selected) {
      const index = remaining.findIndex((candidate) => candidate.id === question.id);
      if (index >= 0) {
        remaining.splice(index, 1);
      }
      usedCategoryIds.add(question.sourceCategoryId);
    }

    const lens = getInterviewerLensById(round.lensId);

    return {
      id: round.id,
      lensId: round.lensId,
      lensLabel: lens.label,
      title: round.title,
      questionIds: selected.map((question) => question.id),
      promptTitles: selected.map(
        (question) => `${question.sourceCategoryLabel}: ${question.title}`,
      ),
      pressureNote:
        roundIndex === 3
          ? "Do not reuse the same easy story. The last round should attack the seams the earlier rounds exposed."
          : lens.demands[0] ?? "Keep the answer tight, specific, and owned.",
    };
  });

  const totalQuestions = builtRounds.reduce(
    (sum, round) => sum + round.questionIds.length,
    0,
  );

  return {
    summary:
      totalQuestions > 0
        ? "This is the stamina plan: four consecutive rounds, rising pressure, and no hiding in your comfort lane."
        : "There are not enough prompts in the current filter to build the full endurance loop yet.",
    totalRounds: builtRounds.length,
    totalQuestions,
    totalMinutes: builtRounds.length * 45,
    rounds: builtRounds,
  };
}

export function buildGameFilmBreakdown(
  answer: string,
  durationSeconds: number | null,
  targetDurationSeconds: number,
): GameFilmBreakdown {
  const normalized = normalizeStoryField(answer);
  const words = normalized.split(/\s+/).filter(Boolean);
  const estimatedDurationSeconds =
    durationSeconds ?? estimateSpokenSeconds(words.length, 140);
  const fillerHits = countMatches(normalized, FILLER_PATTERN);
  const passiveVoiceHits = countMatches(normalized, PASSIVE_VOICE_PATTERN);
  const weakVerbHits = countMatches(normalized, WEAK_VERB_PATTERN);
  const secondsPerWord =
    estimatedDurationSeconds && words.length
      ? estimatedDurationSeconds / words.length
      : 0;
  const events: GameFilmEvent[] = [];

  const addEvent = (
    wordIndex: number,
    label: string,
    detail: string,
    severity: GameFilmEvent["severity"],
  ) => {
    const timestampSeconds =
      secondsPerWord > 0 ? Math.max(0, Math.round(wordIndex * secondsPerWord)) : 0;
    events.push({
      timestampSeconds,
      label,
      detail,
      severity,
    });
  };

  const fillerMatch = normalized.match(FILLER_PATTERN);
  if (fillerMatch?.length) {
    const firstFiller = fillerMatch[0];
    const fillerIndex = words.findIndex((word) =>
      word.toLowerCase().includes(firstFiller.toLowerCase()),
    );

    addEvent(
      Math.max(0, fillerIndex),
      "Filler leak",
      `The answer starts leaking confidence around "${firstFiller}". Clean that up so the delivery sounds more deliberate.`,
      "risk",
    );
  }

  const metricIndex = words.findIndex((word) => /\d/.test(word));
  if (metricIndex >= 0) {
    addEvent(
      metricIndex,
      "Metric lands",
      "This is where hard proof shows up in the take. The earlier it lands, the safer the answer feels.",
      metricIndex * secondsPerWord <= targetDurationSeconds * 0.7 ? "good" : "watch",
    );
  }

  const ownershipIndex = words.findIndex((word) => /^i$/i.test(word));
  if (ownershipIndex >= 0) {
    addEvent(
      ownershipIndex,
      "Ownership signal",
      "This is where the answer first sounds personal instead of generic. Get this earlier if possible.",
      ownershipIndex * secondsPerWord <= targetDurationSeconds * 0.35 ? "good" : "watch",
    );
  }

  if (passiveVoiceHits > 0) {
    addEvent(
      Math.max(0, Math.round(words.length * 0.55)),
      "Passive phrasing",
      "The take slips into passive voice here, which weakens accountability.",
      "risk",
    );
  }

  if (durationSeconds !== null && durationSeconds > targetDurationSeconds) {
    addEvent(
      targetDurationSeconds,
      "Time-box break",
      "This is where the answer crosses the target duration and starts to feel heavy.",
      "risk",
    );
  }

  return {
    estimatedDurationSeconds,
    fillerHits,
    passiveVoiceHits,
    weakVerbHits,
    summary:
      events.length > 0
        ? "Use the timestamps like game film. Tighten the opening, land ownership sooner, and get the proof on the board earlier."
        : "No obvious timing or language events were flagged yet. Keep recording until the answer still sounds strong without the scorecard.",
    events: events
      .sort((left, right) => left.timestampSeconds - right.timestampSeconds)
      .slice(0, 6),
  };
}

export function reviewInterviewAnswer(
  question: InterviewQuestion,
  answer: string,
  interviewerLensId: InterviewerLensId = "l7_bar_raiser",
): InterviewAnswerReview {
  const normalizedAnswer = answer.trim();
  const wordCount = countWords(normalizedAnswer);
  const fillerCount = countMatches(normalizedAnswer, FILLER_PATTERN);
  const metricsCount = countMetrics(normalizedAnswer);
  const interviewerLens = getInterviewerLensById(interviewerLensId);

  const dimensions = [
    scoreStructure(normalizedAnswer),
    scoreOwnership(normalizedAnswer),
    scoreEvidence(normalizedAnswer),
    scoreJudgment(question, normalizedAnswer),
    scoreDelivery(normalizedAnswer),
  ];

  let score = clampScore(
    dimensions.reduce((sum, dimension) => {
      const weights: Record<AnswerReviewDimension["id"], number> = {
        structure: 0.24,
        ownership: 0.22,
        evidence: 0.22,
        judgment: 0.18,
        delivery: 0.14,
      };

      return sum + dimension.score * weights[dimension.id];
    }, 0),
  );
  const strengths: string[] = [];
  const misses: string[] = [];
  const followUps = question.followUps.length
    ? [...question.followUps]
    : getRelatedQuestionPrompts(question, 3);
  const rewriteMoves: string[] = [];

  if (dimensions[0].score >= 75) {
    strengths.push("The answer has a clear shape instead of wandering.");
  } else {
    misses.push(
      "The story does not land fast enough. Lead with the stakes, then move quickly into your action.",
    );
    rewriteMoves.push(
      "Open with one sentence on the problem, one on your mandate, then spend most of the answer on what you changed.",
    );
  }

  if (dimensions[1].score >= 75) {
    strengths.push(
      "Ownership is visible. The interviewer can point to what you personally drove.",
    );
  } else {
    misses.push(
      "Ownership is blurred by team language. Make your decisions and interventions impossible to miss.",
    );
    rewriteMoves.push(
      'Swap vague "we" language for the two or three moves you personally led, chose, or escalated.',
    );
  }

  if (dimensions[2].score >= 75) {
    strengths.push(
      "You are backing the answer with evidence instead of asking for benefit of the doubt.",
    );
  } else {
    misses.push(
      "The proof is too soft. Add one number, one delta, or one concrete scope marker.",
    );
    rewriteMoves.push(
      "Close with a measured result: revenue, time saved, quality gain, risk reduced, or customer impact.",
    );
  }

  if (dimensions[3].score >= 72) {
    strengths.push(
      "Your reasoning is visible, which makes the answer sound senior.",
    );
  } else {
    misses.push(
      "Judgment is underpowered. Explain the tradeoff, why you chose that path, and what risk you accepted.",
    );
    rewriteMoves.push(
      'Add one sentence that starts with "I chose X instead of Y because..." so your judgment is explicit.',
    );
  }

  if (dimensions[4].score >= 78) {
    strengths.push(
      "The delivery is clean enough that confidence reads through the wording.",
    );
  } else {
    misses.push(
      "The delivery is hedged or overlong. Fewer filler words and shorter sentences will raise confidence fast.",
    );
    rewriteMoves.push(
      'Trim filler phrases like "kind of," "basically," or "maybe" and aim for a tighter 90-120 second take.',
    );
  }

  switch (question.competency) {
    case "leadership":
      if (!/\b(decision|aligned|tradeoff|standard)\b/i.test(normalizedAnswer)) {
        misses.push(
          "For a leadership answer, I still do not hear the decision, the alignment move, and the standard you enforced.",
        );
      }
      break;
    case "ownership":
      if (
        !/\b(mistake|repair|changed|owned|escalated)\b/i.test(normalizedAnswer)
      ) {
        misses.push(
          "For ownership, the answer needs a sharper moment where you stepped in, repaired, or took accountability.",
        );
      }
      break;
    case "problem_solving":
      if (
        !/\b(assumption|option|decision|hypothesis)\b/i.test(normalizedAnswer)
      ) {
        misses.push(
          "For problem solving, spell out the frame: assumptions, options, and the decision rule.",
        );
      }
      break;
    case "stakeholder_management":
      if (
        !/\b(stakeholder|partner|trust|alignment|buy-in)\b/i.test(
          normalizedAnswer,
        )
      ) {
        misses.push(
          "For stakeholder management, show the human dynamic, not just the project mechanics.",
        );
      }
      break;
    case "adaptability":
      if (!/\b(pivot|changed|learned|reset)\b/i.test(normalizedAnswer)) {
        misses.push(
          "For adaptability, make the pivot explicit and explain how you regained control.",
        );
      }
      break;
    case "technical_depth":
      if (
        !/\b(system|architecture|constraint|tradeoff|scale)\b/i.test(
          normalizedAnswer,
        )
      ) {
        misses.push(
          "For technical depth, name the system, the constraint, and the tradeoff instead of keeping it abstract.",
        );
      }
      break;
    case "storytelling":
      if (
        !/\b(role|company|impact|experience|background)\b/i.test(
          normalizedAnswer,
        )
      ) {
        misses.push(
          "For storytelling, the answer still needs a clearer through-line tying your background to this role.",
        );
      }
      break;
    default:
      break;
  }

  if (wordCount < 55) {
    misses.push(
      "This answer is too short to prove range. Expand it until the stakes, action, and result all show up.",
    );
  } else if (wordCount > 280) {
    misses.push(
      "This answer is too long for a first pass. Cut backstory and keep the energy in the action section.",
    );
  }

  if (fillerCount >= 3) {
    misses.push(
      "The filler words will read as uncertainty in a live interview. Clean them up before the next rep.",
    );
  }

  if (countMatches(normalizedAnswer, AMBIGUOUS_DATE_PATTERN) > 0) {
    misses.push(
      "The answer uses fuzzy chronology like recently or months ago. Senior interviewers trust exact dates and named windows more than soft timing language.",
    );
  }

  if (countMatches(normalizedAnswer, PLACEHOLDER_METRIC_PATTERN) > 0) {
    misses.push(
      "Placeholder metrics are still leaking into the answer. Replace every scaffold with a real number or scope marker.",
    );
  }

  if (interviewerLens.id === "hrbp") {
    if (countMatches(normalizedAnswer, PEOPLE_PATTERN) >= 1) {
      strengths.push(
        "This answer includes the people dynamic, which matters in an HRBP-style interview.",
      );
    } else {
      score = clampScore(score - 6);
      misses.push(
        "An HRBP interviewer will want the people dynamic: trust built, coaching move, conflict handled, or the leadership behavior others felt.",
      );
      rewriteMoves.push(
        "Add one sentence on the human dynamic: trust, feedback, coaching, conflict, or morale.",
      );
    }
  }

  if (interviewerLens.id === "hiring_manager") {
    if (
      countMatches(normalizedAnswer, SCALE_SIGNAL_PATTERN) === 0 &&
      countMatches(normalizedAnswer, PEOPLE_PATTERN) === 0
    ) {
      score = clampScore(score - 6);
      misses.unshift(
        "A hiring manager will ask whether this story proves next-level scope. Right now it still sounds too individual and too tactical.",
      );
      rewriteMoves.unshift(
        "Add the team leverage, scope, or operating system you owned so the story sounds like role readiness, not just hustle.",
      );
    }
  }

  if (interviewerLens.id === "l6_ops") {
    if (metricsCount === 0) {
      score = clampScore(score - 5);
      misses.push(
        "An L6 operator will expect a number early. Right now the answer is still too soft on measurable impact.",
      );
    }
    if (!countMatches(normalizedAnswer, STANDARD_WORK_PATTERN)) {
      score = clampScore(score - 4);
      misses.push(
        "An L6 interviewer will ask what became standard work or repeatable after the immediate fix.",
      );
    }
    if (!countMatches(normalizedAnswer, URGENCY_PATTERN)) {
      score = clampScore(score - 3);
      misses.push(
        "Execution pressure is still vague. A strong operations answer should make the window, deadline, or pace pressure visible.",
      );
    }
  }

  if (interviewerLens.id === "finance_partner") {
    if (metricsCount === 0) {
      score = clampScore(score - 6);
      misses.unshift(
        "A finance partner will want the business math. There is still no hard number strong enough to audit.",
      );
    }
    if (countMatches(normalizedAnswer, ROI_PATTERN) === 0) {
      score = clampScore(score - 5);
      misses.unshift(
        "The answer still does not translate into cost, labor, avoided risk, or ROI. A finance interviewer will push on the business case immediately.",
      );
      rewriteMoves.unshift(
        "Add one sentence that translates the move into cost avoided, margin protected, labor saved, or downside risk reduced.",
      );
    }
    if (countMatches(normalizedAnswer, TRADEOFF_PATTERN) === 0) {
      score = clampScore(score - 4);
      misses.unshift(
        "Finance pressure is mostly tradeoff pressure. State what you chose not to fund, staff, or prioritize.",
      );
    }
  }

  if (interviewerLens.id === "tech_lead") {
    if (countMatches(normalizedAnswer, TECHNICAL_PATTERN) === 0) {
      score = clampScore(score - 6);
      misses.unshift(
        "A tech lead will expect the real system constraint or failure mode, and that still is not explicit enough here.",
      );
    }
    if (countMatches(normalizedAnswer, TRADEOFF_PATTERN) === 0) {
      score = clampScore(score - 4);
      misses.unshift(
        "Technical answers need the tradeoff, not only the outcome. Explain why the chosen path scaled better than the alternative.",
      );
    }
    if (!countMatches(normalizedAnswer, STANDARD_WORK_PATTERN)) {
      score = clampScore(score - 3);
      misses.unshift(
        "The answer still lacks the mechanism or system change that survived after the immediate fix.",
      );
    }
  }

  if (interviewerLens.id === "l7_bar_raiser") {
    if (countMatches(normalizedAnswer, TRADEOFF_PATTERN) === 0) {
      score = clampScore(score - 7);
      misses.push(
        "A bar raiser will not give you credit without hearing the tradeoff and why you chose that path.",
      );
    }
    if (!countMatches(normalizedAnswer, STANDARD_WORK_PATTERN)) {
      score = clampScore(score - 5);
      misses.push(
        "The answer still sounds like a one-time save. A bar raiser will ask what became repeatable after you.",
      );
      rewriteMoves.push(
        "Add the mechanism, cadence, dashboard, SOP, or habit that outlasted the moment.",
      );
    }
    if (countMatches(normalizedAnswer, LESSON_PATTERN) === 0) {
      score = clampScore(score - 4);
      misses.push(
        "The lesson is not explicit enough. A high-level interviewer wants to hear how this changed your operating model.",
      );
    }
  }

  const verdict = inferVerdict(score);

  const summary =
    verdict === "bar_raiser"
      ? "This clears a high bar. The answer is specific, owned, and backed by proof."
      : verdict === "hire_signal"
        ? "This is competitive, but there is still room to sharpen proof or decision quality."
        : verdict === "borderline"
      ? "This might survive a friendly interview, but it will struggle with a tough follow-up."
          : "This is below the bar right now. The answer sounds experienced, but the signal is not yet interview-grade.";
  const brutalTruth = buildAnswerBrutalTruth(verdict, misses);
  const debriefReadout = buildAnswerDebriefReadout({
    interviewerLabel: interviewerLens.label,
    verdict,
    question,
    dimensions,
    metricsCount,
    fillerCount,
    misses,
  });
  const repairPlan = buildAnswerRepairPlan({
    dimensions,
    misses,
    rewriteMoves,
    metricsCount,
    wordCount,
  });

  return {
    score,
    rating: getReviewRating(score),
    verdict,
    verdictLabel: getVerdictLabel(verdict),
    interviewerLens: interviewerLens.id,
    interviewerLabel: interviewerLens.label,
    interviewerExpectations: [...interviewerLens.demands],
    summary,
    wordCount,
    fillerCount,
    metricsCount,
    dimensions,
    strengths: strengths.slice(0, 4),
    misses: [...new Set(misses)].slice(0, 6),
    followUps: [...new Set(followUps)].slice(0, 4),
    rewriteMoves: [...new Set(rewriteMoves)].slice(0, 4),
    brutalTruth,
    debriefReadout,
    repairPlan,
  };
}

export function getRelatedQuestionPrompts(
  question: InterviewQuestion,
  limit = 3,
): string[] {
  const sameCategory = INTERVIEW_QUESTIONS.filter(
    (entry) =>
      entry.id !== question.id &&
      entry.sourceCategoryId === question.sourceCategoryId,
  );
  const sameCompetency = INTERVIEW_QUESTIONS.filter(
    (entry) =>
      entry.id !== question.id &&
      entry.competency === question.competency &&
      entry.sourceCategoryId !== question.sourceCategoryId,
  );

  return [...new Set([...sameCategory, ...sameCompetency].map((entry) => entry.prompt))]
    .slice(0, limit);
}

export function getStorySourceBankPrompts(
  story: StoryDraft,
  limit = 4,
): string[] {
  const taggedQuestions = INTERVIEW_QUESTIONS.filter((question) =>
    story.categoryTags.includes(question.sourceCategoryId),
  );
  const competencyQuestions = INTERVIEW_QUESTIONS.filter(
    (question) => question.competency === story.competency,
  );

  return [...new Set([...taggedQuestions, ...competencyQuestions].map((question) => question.prompt))]
    .slice(0, limit);
}

export function buildStoryPressureTest(
  story: Partial<StoryDraft>,
): StoryPressureTest {
  const safe = sanitizeStoryDraft(story);
  const strengths: string[] = [];
  const vulnerabilities: string[] = [];
  const upgradeMoves: string[] = [];

  if (countWords(safe.action) >= 24) {
    strengths.push(
      "The Action section has enough room to show actual judgment.",
    );
  } else {
    vulnerabilities.push(
      "The Action section is still too thin. A hard interviewer will not hear enough decision quality yet.",
    );
    upgradeMoves.push(
      "Expand Action with the sequence you drove, the tradeoff you made, and the people you aligned.",
    );
  }

  if (hasMetric(safe.result)) {
    strengths.push(
      "The result includes proof, which gives the story credibility.",
    );
  } else {
    vulnerabilities.push(
      'The result is soft. If someone asks "how much did it matter?" the story will wobble.',
    );
    upgradeMoves.push(
      "Replace a generic outcome with a measurable one: time saved, quality gained, revenue moved, or risk reduced.",
    );
  }

  if (
    countWords(safe.situation) > countWords(safe.action) &&
    countWords(safe.situation) > 24
  ) {
    vulnerabilities.push(
      "The setup is overweight. Too much context delays the part that proves how you operate.",
    );
    upgradeMoves.push(
      "Trim Situation to the stakes and context only. Move the saved words into the Action section.",
    );
  }

  if (!/\b(i|my|me)\b/i.test(`${safe.task} ${safe.action}`)) {
    vulnerabilities.push(
      "Ownership is blurry. The story still sounds like something a team did, not something you drove.",
    );
  } else {
    strengths.push(
      "Ownership comes through clearly enough that the story sounds personal, not generic.",
    );
  }

  if (!countMatches(safe.action, TRADEOFF_PATTERN)) {
    vulnerabilities.push(
      "The story has motion but not tradeoff quality. Senior stories usually include the hard call.",
    );
    upgradeMoves.push(
      "Add one decision sentence that makes the tradeoff explicit.",
    );
  }

  if (countWords(safe.reflection) < 6) {
    vulnerabilities.push(
      "Reflection is undercooked. Without the lesson, the story does not show growth or self-awareness.",
    );
    upgradeMoves.push("End with one operational lesson you still use today.");
  } else {
    strengths.push(
      "The reflection gives the story a stronger leadership signal.",
    );
  }

  switch (safe.competency) {
    case "leadership":
      break;
    case "ownership":
      break;
    case "problem_solving":
      break;
    case "stakeholder_management":
      break;
    case "adaptability":
      break;
    case "technical_depth":
      if (
        !countMatches(safe.action, TECHNICAL_PATTERN) &&
        !countMatches(safe.result, TECHNICAL_PATTERN)
      ) {
        vulnerabilities.push(
          "The technical signal is still generic. Name the system or constraint more concretely.",
        );
        upgradeMoves.push(
          "Add the key system constraint, architecture choice, or failure mode you had to manage.",
        );
      }
      break;
    default:
      break;
  }

  const baseScore = scoreStarStory(safe);
  const score = clampScore(
    baseScore - vulnerabilities.length * 5 + strengths.length * 2,
  );

  return {
    score,
    strengths: strengths.slice(0, 4),
    vulnerabilities: vulnerabilities.slice(0, 6),
    pressureQuestions: getStorySourceBankPrompts(safe),
    upgradeMoves: [...new Set(upgradeMoves)].slice(0, 4),
  };
}

export function getPromptReadiness(
  progress: InterviewPrepProgress,
  question: InterviewQuestion,
): PromptReadiness {
  const matchedStories = progress.stories.filter((story) =>
    story.categoryTags.includes(question.sourceCategoryId),
  );
  const strongStories = matchedStories.filter(
    (story) => reviewStarStory(story).score >= 78,
  );
  const recentRep = progress.drillHistory.find(
    (entry) => entry.questionId === question.id,
  );
  const recentStrongRep = progress.barRaiserHistory.find(
    (entry) => entry.questionId === question.id && entry.score >= 75,
  );

  let score = 0;

  if (matchedStories.length) {
    score += 40;
  }
  if (strongStories.length) {
    score += 30;
  }
  if (recentRep) {
    score += recentRep.rating === "strong" ? 18 : recentRep.rating === "solid" ? 12 : 6;
  }
  if (recentStrongRep) {
    score += 18;
  }

  const clampedScore = clampScore(score);

  if (clampedScore >= 75) {
    return {
      questionId: question.id,
      score: clampedScore,
      label: "ready",
      detail:
        "You have a tagged story and enough supporting reps that this prompt should not surprise you.",
      matchedStoryIds: matchedStories.map((story) => story.id),
      strongStoryIds: strongStories.map((story) => story.id),
    };
  }

  if (clampedScore >= 40) {
    return {
      questionId: question.id,
      score: clampedScore,
      label: "at_risk",
      detail:
        "You have partial coverage here, but the story or reps still look fragile under hard follow-up.",
      matchedStoryIds: matchedStories.map((story) => story.id),
      strongStoryIds: strongStories.map((story) => story.id),
    };
  }

  return {
    questionId: question.id,
    score: clampedScore,
    label: "uncovered",
    detail:
      "You do not yet have a credible saved story or enough reps tied to this prompt.",
    matchedStoryIds: [],
    strongStoryIds: [],
  };
}

export function buildCurveballPack(question: InterviewQuestion): CurveballPack {
  const prompts: string[] = [];
  let angle = "Judgment under pressure";
  let trap =
    "If you stay generic, the interviewer will assume the result was luck, not skill.";
  let recoveryCue =
    "Name the stake, the decision rule, and the result before you add extra context.";

  switch (question.competency) {
    case "leadership":
      angle = "People leadership under stress";
      trap =
        "Candidates sound inflated here when they talk about team success without naming their direct leadership move.";
      recoveryCue =
        "Say what you coached, what standard you enforced, and what changed in the team after you intervened.";
      prompts.push(
        "What would your team say you did that actually changed performance?",
        "Who pushed back on your approach, and how did you handle that without losing trust?",
        "What became standard work after your intervention?",
      );
      break;
    case "ownership":
      angle = "Personal accountability";
      trap =
        "Ownership answers collapse when the interviewer cannot tell what you personally owned versus what the team did.";
      recoveryCue =
        'Use "I" aggressively here: what you chose, escalated, deprioritized, or refused to ignore.';
      prompts.push(
        "What did you personally own that nobody else was going to fix?",
        "What did you deliberately deprioritize to protect the outcome?",
        "What would have broken if you had waited another day?",
      );
      break;
    case "problem_solving":
      angle = "Tradeoff logic";
      trap =
        "If you only explain the outcome, a strong interviewer will assume you skipped the hard choice.";
      recoveryCue =
        "State the options you considered, why you rejected one, and the decision rule you used.";
      prompts.push(
        "Which option did you reject, and why was it the wrong call?",
        "What assumption turned out to be wrong, and how did you catch it?",
        "If the result had gone the other way, what would you say was the flaw in your decision?",
      );
      break;
    case "stakeholder_management":
      angle = "Influence without authority";
      trap =
        "Stakeholder answers sound weak if there is no tension, disagreement, or credibility risk in the story.";
      recoveryCue =
        "Name the disagreement, the influence move, and how you got alignment without hiding the tension.";
      prompts.push(
        "Who was hardest to win over, and why were they unconvinced?",
        "What did you change in your approach when the first alignment attempt did not land?",
        "How did you protect momentum without steamrolling the relationship?",
      );
      break;
    case "adaptability":
      angle = "Reset speed";
      trap =
        "Adaptability answers die when they sound reactive instead of disciplined.";
      recoveryCue =
        "Describe the trigger, the reset, and how you prevented confusion while conditions changed.";
      prompts.push(
        "What changed so late that your original plan stopped working?",
        "How did you decide what not to change while you were pivoting?",
        "What did you learn that changed how you operate now?",
      );
      break;
    case "technical_depth":
      angle = "Analytical depth";
      trap =
        "Depth answers unravel when you cannot defend the root cause or tradeoff beyond a surface description.";
      recoveryCue =
        "Walk from symptom to root cause, then explain the tradeoff in plain language.";
      prompts.push(
        "How do you know that was the real root cause and not just the visible symptom?",
        "What metric or signal did you trust most, and what signal was noisy?",
        "What technical tradeoff would you revisit if you rebuilt that now?",
      );
      break;
    default:
      angle = "Executive storytelling";
      trap =
        "If the answer opens slowly or closes weakly, the interviewer will tune out before the proof lands.";
      recoveryCue =
        "Open with stake and close with metric plus lesson. Everything else is support.";
      prompts.push(
        "Why should this story make me more confident in you for the role you want next?",
        "What is the single most important business effect from this example?",
        "What is the one sentence version if you had to answer under real time pressure?",
      );
      break;
  }

  if (question.managerOnly) {
    prompts.push(
      "What was the hardest people call you had to make in this situation?",
      "How did you make the standard repeatable through other leaders, not just your own effort?",
    );
    trap =
      "Manager-level prompts expose candidates who can talk about outcomes but not talent, standards, or repeatability.";
  }

  return {
    angle,
    trap,
    prompts: prompts.slice(0, 4),
    recoveryCue,
  };
}

export function getTopPassBlockers(
  progress: InterviewPrepProgress,
  selectedFamily?: InterviewSourceFamily,
  selectedCategoryId?: string | null,
): InterviewPassBlocker[] {
  const blockers: InterviewPassBlocker[] = [];
  const averageBarRaiserScore = progress.barRaiserHistory.length
    ? Math.round(
        progress.barRaiserHistory.reduce((sum, review) => sum + review.score, 0) /
          progress.barRaiserHistory.length,
      )
    : null;
  const amazonCoverage = getAmazonCoverageSummary(progress);
  const weakestCompetencyId = getWeakestCompetency(progress);
  const weakestCompetency = weakestCompetencyId
    ? getCompetencyById(weakestCompetencyId)
    : null;
  const pitchFields = Object.values(progress.pitch).filter(
    (value) => value.trim().length > 0,
  ).length;

  if (pitchFields < 4) {
    blockers.push({
      id: "pitch-pack",
      title: "Your opener is still incomplete.",
      detail:
        "If tell-me-about-yourself is not tight, you start the loop behind before the real questions even begin.",
      tab: "cockpit",
      actionLabel: "Finish pitch",
      urgency: "high",
    });
  }

  if (!progress.stories.length) {
    blockers.push({
      id: "story-bank",
      title: "You do not have a real story bank yet.",
      detail:
        "Without saved STAR stories, you are still improvising instead of reusing proof.",
      tab: "star_lab",
      actionLabel: "Build stories",
      urgency: "high",
    });
  }

  if (!progress.barRaiserHistory.length) {
    blockers.push({
      id: "no-harsh-reviews",
      title: "You have not logged any harsh reviews.",
      detail:
        "If no answers have been stress-tested, you do not know what breaks under pressure yet.",
      tab: "bar_raiser",
      actionLabel: "Run harsh review",
      urgency: "high",
    });
  } else if (averageBarRaiserScore !== null && averageBarRaiserScore < 75) {
    blockers.push({
      id: "low-bar-raiser-average",
      title: "Recent bar-raiser scores are still too soft.",
      detail: `Your recent average is ${averageBarRaiserScore}%. That is not where elite interview consistency lives.`,
      tab: "bar_raiser",
      actionLabel: "Re-record weak answer",
      urgency: "high",
    });
  }

  if (amazonCoverage.managerRepCount < 3) {
    blockers.push({
      id: "manager-reps",
      title: "Manager-level pressure is undertrained.",
      detail:
        "You need more manager-only reps so people leadership, judgment, and standard work survive follow-up pressure.",
      tab: "drills",
      actionLabel: "Run manager drill",
      urgency: "high",
    });
  }

  if (selectedCategoryId) {
    const storiesForCategory = progress.stories.filter((story) =>
      story.categoryTags.includes(selectedCategoryId),
    );

    if (!storiesForCategory.length) {
      blockers.push({
        id: `category-${selectedCategoryId}`,
        title: "The active category still has no saved proof.",
        detail: `You are browsing ${getQuestionCategoryById(selectedCategoryId).label} without a tagged story to carry the lane.`,
        tab: "star_lab",
        actionLabel: "Write category story",
        urgency: "high",
      });
    }
  }

  if (
    selectedFamily &&
    selectedFamily === "lp" &&
    amazonCoverage.lpCovered < Math.ceil(amazonCoverage.lpTotal / 2)
  ) {
    blockers.push({
      id: "lp-breadth",
      title: "Leadership Principle breadth is still thin.",
      detail:
        "Too much of your prep is concentrated in a few safe categories, which makes the loop feel narrower than it should.",
      tab: "frameworks",
      actionLabel: "Broaden LP coverage",
      urgency: "medium",
    });
  }

  if (weakestCompetency) {
    blockers.push({
      id: `weak-${weakestCompetency.id}`,
      title: `Your weakest lane is ${weakestCompetency.title.toLowerCase()}.`,
      detail:
        "That is the signal an interviewer is most likely to expose if the loop gets adversarial.",
      tab: "executive_coach",
      actionLabel: "Coach this gap",
      urgency: "medium",
    });
  }

  if (progress.checklistDoneIds.length < Math.ceil(GAME_DAY_CHECKLIST.length / 2)) {
    blockers.push({
      id: "game-day-rhythm",
      title: "Game-day prep is still too loose.",
      detail:
        "You have not locked enough logistics and final-day prep steps to make the interview day feel controlled.",
      tab: "game_day",
      actionLabel: "Finish game-day prep",
      urgency: "medium",
    });
  }

  return blockers.slice(0, 5);
}

export function buildPitchPreview(pitch: Partial<PitchPack>): string {
  const safe = sanitizePitch(pitch);
  return [safe.present, safe.proof, safe.future, safe.whyHere]
    .filter(Boolean)
    .join(" ");
}

export function createInitialInterviewProgress(
  now: Date = new Date(),
): InterviewPrepProgress {
  const isoNow = now.toISOString();

  return {
    version: 1,
    createdAt: isoNow,
    updatedAt: isoNow,
    streak: 0,
    lastPracticeDate: null,
    questionStats: {},
    competencyStats: getInitialCompetencyStats(),
    drillHistory: [],
    barRaiserHistory: [],
    stories: [],
    pitch: {
      present: "",
      proof: "",
      future: "",
      whyHere: "",
    },
    careerProfile: sanitizeCareerProfile(undefined),
    checklistDoneIds: [],
  };
}

export function coerceInterviewProgress(
  value: unknown,
): InterviewPrepProgress | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const fallback = createInitialInterviewProgress();
  const input = value as Record<string, unknown>;

  const questionStats =
    input.questionStats && typeof input.questionStats === "object"
      ? Object.fromEntries(
          Object.entries(input.questionStats as Record<string, unknown>)
            .filter(([key]) => typeof key === "string" && key.length > 0)
            .map(([key, raw]) => [key, sanitizeDrillStat(raw)]),
        )
      : {};

  const stories = Array.isArray(input.stories)
    ? input.stories
        .filter(
          (entry): entry is Record<string, unknown> =>
            Boolean(entry) && typeof entry === "object",
        )
        .map((entry) => {
          const story = sanitizeStoryDraft(entry);
          if (
            !story.title &&
            !story.situation &&
            !story.action &&
            !story.result
          ) {
            return null;
          }

          return {
            ...story,
            id:
              typeof entry.id === "string" && entry.id.trim().length > 0
                ? entry.id
                : `story-${Math.random().toString(36).slice(2, 9)}`,
            updatedAt: isValidDate(entry.updatedAt)
              ? entry.updatedAt
              : fallback.updatedAt,
          } satisfies StarStory;
        })
        .filter((entry): entry is StarStory => entry !== null)
        .slice(0, STORY_LIMIT)
    : [];

  const drillHistory = Array.isArray(input.drillHistory)
    ? input.drillHistory
        .filter(
          (entry): entry is Record<string, unknown> =>
            Boolean(entry) && typeof entry === "object",
        )
        .filter(
          (entry) =>
            isValidDate(entry.date) &&
            typeof entry.questionId === "string" &&
            isCompetencyId(entry.competency) &&
            isDrillRating(entry.rating),
        )
        .map((entry) => {
          const linkedQuestion = INTERVIEW_QUESTIONS.find(
            (question) => question.id === entry.questionId,
          );

          return {
            date: entry.date as string,
            questionId: entry.questionId as string,
            competency: entry.competency as CompetencyId,
            rating: entry.rating as DrillRating,
            sourceFamily: isInterviewSourceFamily(entry.sourceFamily)
              ? entry.sourceFamily
              : linkedQuestion?.sourceFamily,
            sourceCategoryId:
              typeof entry.sourceCategoryId === "string" &&
              entry.sourceCategoryId.length > 0
                ? entry.sourceCategoryId
                : linkedQuestion?.sourceCategoryId,
            sourceCategoryLabel:
              typeof entry.sourceCategoryLabel === "string" &&
              entry.sourceCategoryLabel.length > 0
                ? entry.sourceCategoryLabel
                : linkedQuestion?.sourceCategoryLabel,
            managerOnly:
              typeof entry.managerOnly === "boolean"
                ? entry.managerOnly
                : linkedQuestion?.managerOnly,
          };
        })
        .slice(0, HISTORY_LIMIT)
    : [];

  const barRaiserHistory = Array.isArray(input.barRaiserHistory)
    ? input.barRaiserHistory
        .filter(
          (entry): entry is Record<string, unknown> =>
            Boolean(entry) && typeof entry === "object",
        )
        .filter(
          (entry) =>
            isValidDate(entry.date) &&
            typeof entry.questionId === "string" &&
            isCompetencyId(entry.competency) &&
            isDrillRating(entry.rating) &&
            typeof entry.score === "number" &&
            Number.isFinite(entry.score) &&
            typeof entry.summary === "string" &&
            entry.summary.trim().length > 0 &&
            typeof entry.wordCount === "number" &&
            typeof entry.metricsCount === "number" &&
            typeof entry.fillerCount === "number",
        )
        .map((entry) => {
          const linkedQuestion = INTERVIEW_QUESTIONS.find(
            (question) => question.id === entry.questionId,
          );

          if (!linkedQuestion) {
            return null;
          }

          return {
            date: entry.date as string,
            questionId: entry.questionId as string,
            competency: entry.competency as CompetencyId,
            rating: entry.rating as DrillRating,
            verdict:
              entry.verdict === "below_bar" ||
              entry.verdict === "borderline" ||
              entry.verdict === "hire_signal" ||
              entry.verdict === "bar_raiser"
                ? entry.verdict
                : inferVerdict(clampScore(entry.score as number)),
            score: clampScore(entry.score as number),
            summary: (entry.summary as string).trim(),
            wordCount: clampCount(entry.wordCount),
            metricsCount: clampCount(entry.metricsCount),
            fillerCount: clampCount(entry.fillerCount),
            durationSeconds:
              typeof entry.durationSeconds === "number" &&
              Number.isFinite(entry.durationSeconds)
                ? Math.max(0, Math.round(entry.durationSeconds))
                : null,
            sourceFamily: linkedQuestion.sourceFamily,
            sourceCategoryId: linkedQuestion.sourceCategoryId,
            sourceCategoryLabel: linkedQuestion.sourceCategoryLabel,
            managerOnly: linkedQuestion.managerOnly,
          } satisfies BarRaiserReviewRecord;
        })
        .filter((entry): entry is BarRaiserReviewRecord => entry !== null)
        .slice(0, BAR_RAISER_HISTORY_LIMIT)
    : [];

  return {
    version: 1,
    createdAt: isValidDate(input.createdAt)
      ? input.createdAt
      : fallback.createdAt,
    updatedAt: isValidDate(input.updatedAt)
      ? input.updatedAt
      : fallback.updatedAt,
    streak: clampCount(input.streak),
    lastPracticeDate: isValidDate(input.lastPracticeDate)
      ? String(input.lastPracticeDate).slice(0, 10)
      : null,
    questionStats,
    competencyStats: sanitizeCompetencyStats(input.competencyStats),
    drillHistory,
    barRaiserHistory,
    stories,
    pitch: sanitizePitch((input.pitch as Partial<PitchPack>) ?? {}),
    careerProfile: sanitizeCareerProfile(
      (input.careerProfile as Partial<InterviewCareerProfile>) ?? undefined,
    ),
    checklistDoneIds: uniqueStrings(input.checklistDoneIds).filter((id) =>
      GAME_DAY_CHECKLIST.some((item) => item.id === id),
    ),
  };
}

export function updatePitchPack(
  progress: InterviewPrepProgress,
  updates: Partial<PitchPack>,
  now: Date = new Date(),
): InterviewPrepProgress {
  return touchPracticeDay(
    {
      ...progress,
      pitch: {
        ...progress.pitch,
        ...sanitizePitch(updates),
      },
    },
    now,
  );
}

export function updateCareerProfile(
  progress: InterviewPrepProgress,
  updates: Partial<InterviewCareerProfile>,
  now: Date = new Date(),
): InterviewPrepProgress {
  return {
    ...progress,
    careerProfile: sanitizeCareerProfile({
      ...progress.careerProfile,
      ...updates,
    }),
    updatedAt: now.toISOString(),
  };
}

export function toggleChecklistItem(
  progress: InterviewPrepProgress,
  itemId: string,
  done: boolean,
  now: Date = new Date(),
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
      checklistDoneIds: [...nextIds],
    },
    now,
  );
}

export function saveStarStory(
  progress: InterviewPrepProgress,
  storyInput: Partial<StoryDraft>,
  now: Date = new Date(),
  createId: () => string = () =>
    `story-${Math.random().toString(36).slice(2, 10)}`,
): InterviewPrepProgress {
  const story = sanitizeStoryDraft(storyInput);
  const id = story.id ?? createId();

  const nextStory: StarStory = {
    ...story,
    grounding: refreshStoryGrounding(story),
    id,
    updatedAt: now.toISOString(),
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
        .slice(0, STORY_LIMIT),
    },
    now,
  );
}

export function deleteStarStory(
  progress: InterviewPrepProgress,
  storyId: string,
  now: Date = new Date(),
): InterviewPrepProgress {
  return touchPracticeDay(
    {
      ...progress,
      stories: progress.stories.filter((story) => story.id !== storyId),
    },
    now,
  );
}

export function recordDrillResult(
  progress: InterviewPrepProgress,
  question: InterviewQuestion,
  rating: DrillRating,
  now: Date = new Date(),
): InterviewPrepProgress {
  const previousQuestionStat = progress.questionStats[question.id] ?? {
    attempted: 0,
    solid: 0,
    strong: 0,
  };
  const previousCompetencyStat = progress.competencyStats[question.competency];

  const questionStat: DrillStat = {
    attempted: previousQuestionStat.attempted + 1,
    solid: previousQuestionStat.solid + (rating === "solid" ? 1 : 0),
    strong: previousQuestionStat.strong + (rating === "strong" ? 1 : 0),
  };

  const competencyStat: CompetencyStat = {
    attempted: previousCompetencyStat.attempted + 1,
    solid: previousCompetencyStat.solid + (rating === "solid" ? 1 : 0),
    strong: previousCompetencyStat.strong + (rating === "strong" ? 1 : 0),
  };

  return touchPracticeDay(
    {
      ...progress,
      questionStats: {
        ...progress.questionStats,
        [question.id]: questionStat,
      },
      competencyStats: {
        ...progress.competencyStats,
        [question.competency]: competencyStat,
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
          managerOnly: question.managerOnly,
        },
        ...progress.drillHistory,
      ].slice(0, HISTORY_LIMIT),
    },
    now,
  );
}

export function recordBarRaiserReview(
  progress: InterviewPrepProgress,
  question: InterviewQuestion,
  review: InterviewAnswerReview,
  durationSeconds: number | null = null,
  now: Date = new Date(),
): InterviewPrepProgress {
  const afterDrill = recordDrillResult(progress, question, review.rating, now);

  return touchPracticeDay(
    {
      ...afterDrill,
      barRaiserHistory: [
        {
          date: now.toISOString(),
          questionId: question.id,
          competency: question.competency,
          rating: review.rating,
          verdict: review.verdict,
          score: review.score,
          summary: review.summary,
          wordCount: review.wordCount,
          metricsCount: review.metricsCount,
          fillerCount: review.fillerCount,
          durationSeconds:
            typeof durationSeconds === "number" &&
            Number.isFinite(durationSeconds)
              ? Math.max(0, Math.round(durationSeconds))
              : null,
          sourceFamily: question.sourceFamily,
          sourceCategoryId: question.sourceCategoryId,
          sourceCategoryLabel: question.sourceCategoryLabel,
          managerOnly: question.managerOnly,
        },
        ...afterDrill.barRaiserHistory,
      ].slice(0, BAR_RAISER_HISTORY_LIMIT),
    },
    now,
  );
}

export function pickDrillQuestions(
  questions: readonly InterviewQuestion[],
  count: number,
  competencies: readonly CompetencyId[],
  random: () => number = Math.random,
): InterviewQuestion[] {
  const pool = questions.filter((question) =>
    competencies.includes(question.competency),
  );
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

export function getStoryCoverage(
  progress: InterviewPrepProgress,
): Record<CompetencyId, number> {
  return progress.stories.reduce((result, story) => {
    result[story.competency] += 1;
    return result;
  }, getInitialStoryCoverage());
}

export function getStoryCategoryCoverage(
  progress: InterviewPrepProgress,
): Record<string, number> {
  return progress.stories.reduce((result, story) => {
    for (const categoryId of story.categoryTags) {
      if (categoryId in result) {
        result[categoryId] += 1;
      }
    }

    return result;
  }, getInitialQuestionCategoryCoverage());
}

function getCoveredCategoryIds(progress: InterviewPrepProgress): Set<string> {
  const storyTaggedCategoryIds = new Set(
    Object.entries(getStoryCategoryCoverage(progress))
      .filter(([, count]) => count > 0)
      .map(([categoryId]) => categoryId),
  );
  const drilledCategoryIds = new Set(
    progress.drillHistory
      .map((entry) => entry.sourceCategoryId)
      .filter(
        (categoryId): categoryId is string =>
          typeof categoryId === "string" && categoryId.length > 0,
      ),
  );

  return new Set([...storyTaggedCategoryIds, ...drilledCategoryIds]);
}

export function getAmazonCoverageSummary(
  progress: InterviewPrepProgress,
): AmazonCoverageSummary {
  const coveredCategoryIds = getCoveredCategoryIds(progress);
  const lpCategories = getQuestionCategoriesByFamily("lp");
  const functionalCategories = getQuestionCategoriesByFamily("functional");

  return {
    lpCovered: lpCategories.filter((category) =>
      coveredCategoryIds.has(category.id),
    ).length,
    lpTotal: lpCategories.length,
    functionalCovered: functionalCategories.filter((category) =>
      coveredCategoryIds.has(category.id),
    ).length,
    functionalTotal: functionalCategories.length,
    managerPromptCount: INTERVIEW_QUESTIONS.filter(
      (question) => question.managerOnly,
    ).length,
    managerRepCount: progress.drillHistory.filter((entry) => entry.managerOnly)
      .length,
    categoryCoverageCount: coveredCategoryIds.size,
    categoryCoverageTotal: INTERVIEW_QUESTION_CATEGORIES.length,
  };
}

export function getCompetencyConfidence(
  progress: InterviewPrepProgress,
  competencyId: CompetencyId,
): number {
  const stats = progress.competencyStats[competencyId];

  if (!stats.attempted) {
    return 0;
  }

  const weighted = stats.strong + stats.solid * 0.7;
  return Math.round((weighted / stats.attempted) * 100);
}

export function getOverallReadiness(progress: InterviewPrepProgress): number {
  const storyCoverageCount = new Set(
    progress.stories.map((story) => story.competency),
  ).size;
  const storyCoverageScore = storyCoverageCount / INTERVIEW_COMPETENCIES.length;
  const amazonCoverage = getAmazonCoverageSummary(progress);
  const categoryCoverageScore = amazonCoverage.categoryCoverageTotal
    ? amazonCoverage.categoryCoverageCount /
      amazonCoverage.categoryCoverageTotal
    : 0;
  const drillScore =
    progress.drillHistory.length > 0
      ? progress.drillHistory.reduce((sum, item) => {
          if (item.rating === "strong") {
            return sum + 1;
          }
          if (item.rating === "solid") {
            return sum + 0.72;
          }
          return sum + 0.35;
        }, 0) / progress.drillHistory.length
      : 0;
  const pitchFields = Object.values(progress.pitch).filter(
    (value) => value.trim().length > 0,
  ).length;
  const pitchScore = pitchFields / Object.keys(progress.pitch).length;
  const checklistScore = GAME_DAY_CHECKLIST.length
    ? progress.checklistDoneIds.length / GAME_DAY_CHECKLIST.length
    : 0;

  return Math.round(
    (storyCoverageScore * 0.24 +
      categoryCoverageScore * 0.26 +
      drillScore * 0.24 +
      pitchScore * 0.16 +
      checklistScore * 0.1) *
      100,
  );
}

export function getWeakestCompetency(
  progress: InterviewPrepProgress,
): CompetencyId | null {
  let weakest: CompetencyId | null = null;
  let weakestScore = Number.POSITIVE_INFINITY;

  for (const competency of INTERVIEW_COMPETENCIES) {
    const stats = progress.competencyStats[competency.id];
    const storyCount = progress.stories.filter(
      (story) => story.competency === competency.id,
    ).length;
    const confidence =
      stats.attempted > 0
        ? getCompetencyConfidence(progress, competency.id)
        : 20;
    const coverageBonus = Math.min(20, storyCount * 10);
    const score = confidence + coverageBonus;

    if (score < weakestScore) {
      weakest = competency.id;
      weakestScore = score;
    }
  }

  return weakest;
}
