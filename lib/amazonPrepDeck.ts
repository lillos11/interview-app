import type { CompetencyId, InterviewSourceFamily, PitchPack, StoryDraft } from "./interview";

export interface PrepDeckStoryTemplate {
  id: string;
  storyNumber: number;
  shortLabel: string;
  title: string;
  signalLane: CompetencyId;
  categoryIds: string[];
  keyNumbers: string[];
  bestFor: string[];
  challenge: string;
  lesson: string;
  standardWork: string[];
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface PrepDeckRouterEntry {
  cue: string;
  categoryId: string;
  primaryStoryIds: string[];
}

export interface PrepDeckPanelPlanEntry {
  interviewer: string;
  categoryId: string;
  primaryStoryId: string;
  backupStoryId: string;
}

export const AMAZON_PREP_DECK_PITCH_TEMPLATE: {
  fullIntro: string;
  pack: PitchPack;
} = {
  fullIntro:
    "Hi, my name is Carlos McCain. Born and raised in Kansas City, MO. I started at Amazon in 2019 at MKC6 as a Tier 1 associate in Singles and worked my way into leadership as a Tier 3 Process Assistant in Singles in 2022. In my current role, I have reduced defects by 35 percent, improved pack rate from 80 percent to 110 percent of the plan and led up to 200 associates across three shifts. I am also completing my MBA in Business Analytics, which has strengthened my ability to use data to improve performance and support teams effectively. I am ready to step into an Area Manager role and apply my operational experience, leadership skills, and results-driven mindset to deliver strong performance.",
  pack: {
    present:
      "I started at Amazon in 2019 at MKC6 as a Tier 1 associate in Singles and worked into leadership as a Tier 3 Process Assistant in 2022.",
    proof:
      "In my current role I reduced defects by 35%, improved pack rate from 80% to 110% of plan, and led up to 200 associates across three shifts.",
    future:
      "I am ready to step into an Area Manager role and bring stronger operational ownership, coaching, and data-based decision making.",
    whyHere:
      "Amazon is where I have already built range and results, and I want to scale that impact by leading larger teams and broader execution.",
  },
};

export const AMAZON_PREP_DECK_STORIES: readonly PrepDeckStoryTemplate[] = [
  {
    id: "story-1",
    storyNumber: 1,
    shortLabel: "Department Turnaround",
    title: "The Department Turnaround",
    signalLane: "leadership",
    categoryIds: [
      "deliver-results",
      "insist-on-the-highest-standards",
      "customer-obsession",
      "ownership",
      "think-big",
      "frugality",
      "invent-and-simplify",
      "conscientiousness",
      "influencing",
      "interpretation-and-analysis",
      "vision-and-strategy",
    ],
    keyNumbers: [
      "Pack rate 80% to 110% of plan",
      "DPMO down 35%",
      "Productivity up 21% in 3 months",
      "Sustained 104% to 113% of plan",
    ],
    bestFor: [
      "Deliver Results",
      "Highest Standards",
      "Customer Obsession",
    ],
    challenge:
      "Complacency was the real blocker because people genuinely believed 80% was good enough.",
    lesson:
      "Complacency is the most expensive problem in any operation because nobody thinks it's a problem.",
    standardWork: [
      "Locked SOPs and standardized workstations across all shifts.",
      "Built a train-the-trainer model so the system scaled without extra cost.",
      "Used daily audits and first-hour visibility dashboards to reinforce standards.",
    ],
    situation:
      "The Singles department at MKC6 was stuck at the 80% network average because standards varied across shifts and turnover was high.",
    task:
      "Reset baseline standards across the whole department and make output stable across shifts.",
    action:
      "I standardized workstation layouts to remove shift-to-shift variance, built real-time dashboards for first-hour visibility by associate and process step, and implemented a train-the-trainer model to coach more than 60 associates without adding cost.",
    result:
      "Productivity jumped 21% in three months, performance stayed well above network average, and DPMO dropped 35%.",
  },
  {
    id: "story-2",
    storyNumber: 2,
    shortLabel: "Prime Day CPT Recovery",
    title: "The Prime Day CPT Recovery",
    signalLane: "ownership",
    categoryIds: [
      "deliver-results",
      "bias-for-action",
      "customer-obsession",
      "are-right-a-lot",
      "adaptability",
      "customer-orientation",
      "judgment-and-decision-making",
      "plan-and-prioritize",
    ],
    keyNumbers: [
      "5,478 out of 5,500 CPTs recovered",
      "99.6% recovery",
      "2-hour window",
    ],
    bestFor: ["Deliver Results", "Bias for Action", "Customer Obsession"],
    challenge:
      "Volume landed in one front-loaded wave, so a late staffing move would have missed truck times and customer promise.",
    lesson:
      "Reacting isn't enough. Build systems that catch problems before they start.",
    standardWork: [
      "Run a CPT buffer check in the first 30 minutes of every shift.",
      "Compare CPT distribution versus pace and adjust staffing early if the demand is front-loaded.",
      "Share the playbook with peer PAs so it becomes standard for high-volume days.",
    ],
    situation:
      "During Prime Day at MKC6, 5,500 SmartPac CPTs hit inside a tight two-hour window and risked backing up the tote router.",
    task:
      "Push at-risk shipments out on time without creating a new bottleneck somewhere else in the building.",
    action:
      "I re-read staffing and productivity in real time, pulled support only from safe areas, added a packer to the line, assigned an extra dwell lead, and had that lead prioritize shipments at highest risk of missing first.",
    result:
      "We pushed out 5,478 of 5,500 CPTs, kept totes off the tote router, and protected other departments from drying up.",
  },
  {
    id: "story-3",
    storyNumber: 3,
    shortLabel: "Developing an AA",
    title: "Developing an AA",
    signalLane: "leadership",
    categoryIds: [
      "hire-and-develop-the-best",
      "earn-trust",
      "insist-on-the-highest-standards",
      "customer-obsession",
      "strive-to-be-earth-s-best-employer",
      "influencing",
      "learning-orientation",
      "team-and-people-management",
    ],
    keyNumbers: [
      "Pack rate 50 UPH to 80 UPH",
      "60% improvement",
      "Became a PG",
    ],
    bestFor: ["Hire and Develop", "Earn Trust", "Best Employer"],
    challenge:
      "The associate had been overlooked for months because leaders only valued speed, not quality plus potential.",
    lesson:
      "The best development starts with changing how someone sees themselves.",
    standardWork: [
      "Review quality metrics alongside rate during coaching.",
      "Use coaching frameworks that do not overlook quieter high-potential associates.",
    ],
    situation:
      "During one of the slowest seasons, an associate was below expected rate but had flawless quality and zero defects.",
    task:
      "Develop that untapped potential into someone who could help elevate the rest of the team.",
    action:
      "I showed them the strengths hidden by surface metrics, reframed flawless quality as a foundation for speed, coached their physical process to remove wasted motion, paired them with new hires as a quality mentor, and mapped a career path with them.",
    result:
      "Their pack rate climbed from 50 to 80 UPH while maintaining flawless quality, and they grew into a trusted PG.",
  },
  {
    id: "story-4",
    storyNumber: 4,
    shortLabel: "Tough Conversation",
    title: "The Tough Conversation",
    signalLane: "stakeholder_management",
    categoryIds: [
      "earn-trust",
      "have-backbone-disagree-and-commit",
      "hire-and-develop-the-best",
      "insist-on-the-highest-standards",
      "deliver-results",
      "conscientiousness",
      "influencing",
      "team-and-people-management",
    ],
    keyNumbers: [
      "15 to 20 seconds per unit gap",
      "Improved to 70 UPH",
      "Turned an attrition risk into a contributor",
    ],
    bestFor: ["Earn Trust", "Have Backbone", "Hire and Develop"],
    challenge:
      "Other leaders avoided the real conversation, and being honest only mattered if I paired it with a concrete plan.",
    lesson:
      "The conversations leaders avoid are usually the ones that matter most.",
    standardWork: [
      "Run individualized performance reviews as part of the regular coaching rhythm.",
      "Use data-backed feedback to pinpoint the actual bottleneck early.",
    ],
    situation:
      "One associate consistently underperformed with both rate and quality issues, and prior coaching had been generic and ineffective.",
    task:
      "Have an honest, respectful conversation, build a real improvement plan, and give them a fair path back to contribution.",
    action:
      "I met privately, walked through their own data, isolated the exact process step costing 15 to 20 seconds per unit, demonstrated the better technique, had them practice it, set clear expectations, prepared a Plan B if coaching failed, and checked in every day for a week.",
    result:
      "Within a month they improved to above-average performance, became more engaged, and later mentored others.",
  },
  {
    id: "story-5",
    storyNumber: 5,
    shortLabel: "Floor Rescue",
    title: "The Floor Rescue",
    signalLane: "ownership",
    categoryIds: [
      "ownership",
      "bias-for-action",
      "hire-and-develop-the-best",
      "earn-trust",
      "deliver-results",
      "customer-obsession",
      "insist-on-the-highest-standards",
      "adaptability",
      "collaboration",
      "customer-orientation",
      "judgment-and-decision-making",
      "plan-and-prioritize",
    ],
    keyNumbers: [
      "Scanned bucket 10K to under 7K",
      "Avoided 12K shutdown threshold",
      "3,000-unit recovery",
    ],
    bestFor: ["Ownership", "Bias for Action", "Customer Obsession"],
    challenge:
      "I had to leave my own side of the floor without losing control there while solving a building-wide shutdown risk.",
    lesson:
      "The best time to invest in people is before you need them.",
    standardWork: [
      "Monitor scanned-bucket watch points and intervene at 7K to 8K instead of scrambling at 10K.",
      "Build issue-response thresholds into the shift handoff template.",
      "Keep a quick-reference guide for mechanical issues and escalation paths.",
    ],
    situation:
      "On a peak day at MKC6, the shipping sorter jammed and scanned bucket volume climbed toward the 12K point where pick would stop across the building.",
    task:
      "Restore flow before the shutdown threshold while protecting safety, keeping my own side stable, and getting RME engaged immediately.",
    action:
      "I called RME directly, handed my radio to an associate I had developed to hold my area, crossed to stabilize the overwhelmed side, placed associates to downstack at the SLAM lines, assigned runners to protect safety hazards, and stayed until the sorter was repaired and control returned.",
    result:
      "We cut scanned bucket from 10K to under 7K, prevented pick from stopping, recovered roughly 3,000 units, and kept the floor safe without performance drop on my side.",
  },
  {
    id: "story-6",
    storyNumber: 6,
    shortLabel: "The Misread",
    title: "The Misread (Failure)",
    signalLane: "adaptability",
    categoryIds: [
      "customer-obsession",
      "ownership",
      "learn-and-be-curious",
      "insist-on-the-highest-standards",
      "deliver-results",
      "are-right-a-lot",
      "conscientiousness",
      "customer-orientation",
      "interpretation-and-analysis",
      "learning-orientation",
    ],
    keyNumbers: [
      "Missed 258 CPTs",
      "High-volume day",
      "Failure became standard-work redesign",
    ],
    bestFor: ["Ownership", "Learn and Be Curious", "Are Right, a Lot"],
    challenge:
      "I had to own a visible miss instead of blaming the plan, staffing, or timing.",
    lesson:
      "Aggregate numbers can lie to you. The time to act is when you still have time to recover.",
    standardWork: [
      "Run a first-30-minute CPT distribution versus pace check every shift.",
      "Watch CPT windows and process paths instead of relying on department-level aggregate numbers.",
      "Share the lesson with other PAs so the same miss does not repeat elsewhere.",
    ],
    situation:
      "Early in my time as a PA, I looked at department-level numbers on a high-volume day and assumed heavy CPT volume was still under control.",
    task:
      "Get CPTs out on time, even though the surface data made the situation look safer than it really was.",
    action:
      "I reacted late, pulled extra support, and prioritized the highest-risk packages, but I only made the right moves after the backlog was already beyond full recovery.",
    result:
      "We missed 258 CPTs. I owned it, rebuilt the visibility model around CPT windows and path-level pacing, and used that failure to prevent repeats.",
  },
  {
    id: "story-7",
    storyNumber: 7,
    shortLabel: "Solo Operator",
    title: "The Solo Operator",
    signalLane: "leadership",
    categoryIds: [
      "ownership",
      "deliver-results",
      "hire-and-develop-the-best",
      "earn-trust",
      "think-big",
      "customer-obsession",
      "bias-for-action",
      "success-and-scale-bring-broad-responsibility",
      "adaptability",
      "collaboration",
      "deal-with-ambiguity",
      "judgment-and-decision-making",
      "plan-and-prioritize",
      "team-and-people-management",
      "vision-and-strategy",
    ],
    keyNumbers: [
      "3 months as the only leader in Singles",
      "Up to 200 associates",
      "5 PGs developed",
      "3 of 5 PGs became PAs",
    ],
    bestFor: ["Ownership", "Hire and Develop", "Think Big"],
    challenge:
      "The hardest part was building the operating rhythm for work that normally would have been shared across multiple leaders.",
    lesson:
      "The real test of a leader is how you perform when you do not have support.",
    standardWork: [
      "Use a daily operating rhythm: startup checklist, first-hour check, CPT review, scanned-bucket monitoring, and safety walks.",
      "Give PGs real ownership of floor sections early and coach them in real time.",
      "Keep a daily review and individualized feedback cadence even during leadership gaps.",
    ],
    situation:
      "For three months on FHD at MKC6, I ran Singles without an AM or another PA while covering all process paths and escalations.",
    task:
      "Keep performance at standard or better, protect customers and associates, and build leadership depth around me so the floor did not depend on one person.",
    action:
      "I built a repeatable operating rhythm, identified five associates with leadership potential, coached them as PGs with real floor ownership, and kept daily reviews and feedback loops in place while making all department-level calls.",
    result:
      "Quality held, rate stayed at or above plan, and three of the five PGs later became PAs, leaving behind systems that outlasted the leadership gap.",
  },
  {
    id: "story-8",
    storyNumber: 8,
    shortLabel: "Wrong Box Deep Dive",
    title: "The Wrong Box Deep Dive",
    signalLane: "technical_depth",
    categoryIds: [
      "dive-deep",
      "frugality",
      "ownership",
      "are-right-a-lot",
      "customer-obsession",
      "interpretation-and-analysis",
    ],
    keyNumbers: [
      "70% to 71% of wrong-box errors were invisible",
      "Two months of data analyzed",
    ],
    bestFor: ["Dive Deep", "Frugality", "Are Right, a Lot"],
    challenge:
      "The deeper issue was not only the defect itself, but the fact that the system was missing the data needed to fix it.",
    lesson:
      "If you are not capturing the data, you cannot fix the problem.",
    standardWork: [
      "Require associates to use the problem-solve menu and trigger Andon every time the condition appears.",
      "Teach the difference between controllable and uncontrollable defects.",
    ],
    situation:
      "DPMO in Singles was elevated because boxes were being upsized unnecessarily, and no one had dug into the cause.",
    task:
      "Find the driver, quantify the cost, and give Amazon usable data to improve the box-sizing algorithm.",
    action:
      "I pulled two months of data, broke wrong-box adjustments down into controllable versus uncontrollable causes, discovered that 70% to 71% of errors were not triggering Andon, and built a coaching framework so associates captured the defect correctly every time.",
    result:
      "We moved from invisible defects to properly captured ones, gave Amazon better input data for box-sizing improvements, and reduced waste from unnecessary upsizing.",
  },
  {
    id: "story-9",
    storyNumber: 9,
    shortLabel: "Station Health",
    title: "Station Health Improvements",
    signalLane: "problem_solving",
    categoryIds: [
      "invent-and-simplify",
      "insist-on-the-highest-standards",
      "dive-deep",
      "customer-obsession",
      "collaboration",
    ],
    keyNumbers: [
      "Station health 55% to 60% up to 85% to 90%",
      "PPmix rates 50 to 60 UPH up to 70 to 80 UPH",
      "Expected property damage down 90%",
    ],
    bestFor: ["Invent and Simplify", "Highest Standards", "Dive Deep"],
    challenge:
      "The floor looked like a people-performance problem until the workstation design revealed itself as the real blocker.",
    lesson:
      "Sometimes the biggest performance gains come from fixing the environment, not coaching the person.",
    standardWork: [
      "Use station-health checks to look for environment constraints before defaulting to coaching the associate.",
      "Partner with 5S for safety and layout improvements when design limits performance.",
    ],
    situation:
      "Even-numbered stations consistently underperformed odd-numbered stations because equipment overlap and dual tape machines created a poor layout.",
    task:
      "Fix station design so every station could perform at roughly the same level without creating new safety issues.",
    action:
      "I identified the layout root cause, replaced dual tape machines with single units, rotated tables 180 degrees for more workspace, and partnered with the 5S team on floor-mat safety improvements.",
    result:
      "Station health rose to roughly 85% to 90%, PPmix rates climbed to 70 to 80 UPH, and the layout was expected to cut property damage by 90%.",
  },
  {
    id: "story-10",
    storyNumber: 10,
    shortLabel: "Recycling Initiative",
    title: "The Recycling Initiative",
    signalLane: "leadership",
    categoryIds: [
      "success-and-scale-bring-broad-responsibility",
      "ownership",
      "think-big",
      "frugality",
      "invent-and-simplify",
      "vision-and-strategy",
    ],
    keyNumbers: [
      "Around 75% of metal wires recycled",
      "Department waste tied back to carbon-footprint goals",
    ],
    bestFor: ["Success and Scale", "Ownership", "Think Big"],
    challenge:
      "Nobody had connected a small daily waste stream to the larger company responsibility, so the opportunity was easy to ignore.",
    lesson:
      "The biggest sustainability wins come from the people closest to the process.",
    standardWork: [
      "Create a collection and routing process that fits the normal daily workflow.",
      "Coordinate with Non Inventory so the recycle path is repeatable, not ad hoc.",
    ],
    situation:
      "Metal wires from the packaging process were being thrown away even though Amazon had a broader sustainability mission.",
    task:
      "Find a practical way to recycle the wire waste without slowing down operations.",
    action:
      "I researched recycling options, built a collection and routing process, got team buy-in, and coordinated with Non Inventory so the new flow fit into normal work.",
    result:
      "Roughly 75% of metal wires were recycled, and the department’s daily work aligned better with Amazon’s broader sustainability goals.",
  },
] as const;

export const AMAZON_PREP_DECK_ROUTER: readonly PrepDeckRouterEntry[] = [
  {
    cue: "Customer, promise, package, on time",
    categoryId: "customer-obsession",
    primaryStoryIds: ["story-2", "story-5"],
  },
  {
    cue: "Own it, outside your area, long term",
    categoryId: "ownership",
    primaryStoryIds: ["story-7", "story-1"],
  },
  {
    cue: "Speed, risk, act fast, no guidance",
    categoryId: "bias-for-action",
    primaryStoryIds: ["story-5"],
  },
  {
    cue: "Results, deadline, goal, deliver",
    categoryId: "deliver-results",
    primaryStoryIds: ["story-2", "story-1"],
  },
  {
    cue: "Standards, quality, improve, not good enough",
    categoryId: "insist-on-the-highest-standards",
    primaryStoryIds: ["story-1", "story-8"],
  },
  {
    cue: "Develop, coach, feedback, grow people",
    categoryId: "hire-and-develop-the-best",
    primaryStoryIds: ["story-7", "story-3"],
  },
  {
    cue: "Trust, honest, hard conversation, respect",
    categoryId: "earn-trust",
    primaryStoryIds: ["story-3", "story-4"],
  },
  {
    cue: "Data, root cause, dig in, analyze",
    categoryId: "dive-deep",
    primaryStoryIds: ["story-8", "story-6"],
  },
  {
    cue: "Disagree, push back, defend, commit",
    categoryId: "have-backbone-disagree-and-commit",
    primaryStoryIds: ["story-4"],
  },
  {
    cue: "Learn, mistake, curious, new skill",
    categoryId: "learn-and-be-curious",
    primaryStoryIds: ["story-6"],
  },
  {
    cue: "Simple, innovate, fix, redesign",
    categoryId: "invent-and-simplify",
    primaryStoryIds: ["story-9"],
  },
  {
    cue: "Big picture, vision, scale, beyond your team",
    categoryId: "think-big",
    primaryStoryIds: ["story-7", "story-1"],
  },
  {
    cue: "Decision, judgment, incomplete info",
    categoryId: "are-right-a-lot",
    primaryStoryIds: ["story-6", "story-5"],
  },
  {
    cue: "Cost, waste, do more with less",
    categoryId: "frugality",
    primaryStoryIds: ["story-8", "story-1"],
  },
  {
    cue: "Sustainability, broader responsibility, company mission",
    categoryId: "success-and-scale-bring-broad-responsibility",
    primaryStoryIds: ["story-10"],
  },
  {
    cue: "Inclusive, best employer, overlooked people",
    categoryId: "strive-to-be-earth-s-best-employer",
    primaryStoryIds: ["story-3"],
  },
] as const;

export const AMAZON_PREP_DECK_PANEL_PLAN: readonly PrepDeckPanelPlanEntry[] = [
  {
    interviewer: "HRBP",
    categoryId: "earn-trust",
    primaryStoryId: "story-3",
    backupStoryId: "story-4",
  },
  {
    interviewer: "HRBP",
    categoryId: "have-backbone-disagree-and-commit",
    primaryStoryId: "story-4",
    backupStoryId: "story-1",
  },
  {
    interviewer: "HRBP",
    categoryId: "hire-and-develop-the-best",
    primaryStoryId: "story-7",
    backupStoryId: "story-3",
  },
  {
    interviewer: "HRBP",
    categoryId: "learn-and-be-curious",
    primaryStoryId: "story-6",
    backupStoryId: "story-6",
  },
  {
    interviewer: "L6",
    categoryId: "bias-for-action",
    primaryStoryId: "story-5",
    backupStoryId: "story-2",
  },
  {
    interviewer: "L6",
    categoryId: "deliver-results",
    primaryStoryId: "story-2",
    backupStoryId: "story-1",
  },
  {
    interviewer: "L6",
    categoryId: "insist-on-the-highest-standards",
    primaryStoryId: "story-1",
    backupStoryId: "story-8",
  },
  {
    interviewer: "L6",
    categoryId: "ownership",
    primaryStoryId: "story-1",
    backupStoryId: "story-7",
  },
  {
    interviewer: "L7",
    categoryId: "are-right-a-lot",
    primaryStoryId: "story-6",
    backupStoryId: "story-5",
  },
  {
    interviewer: "L7",
    categoryId: "dive-deep",
    primaryStoryId: "story-8",
    backupStoryId: "story-1",
  },
  {
    interviewer: "L7",
    categoryId: "invent-and-simplify",
    primaryStoryId: "story-9",
    backupStoryId: "story-1",
  },
  {
    interviewer: "L7",
    categoryId: "think-big",
    primaryStoryId: "story-7",
    backupStoryId: "story-10",
  },
] as const;

export const AMAZON_PREP_DECK_INTERVIEW_DAY_REMINDERS = [
  "Pause three seconds before answering so you sound controlled, not rushed.",
  'Lead with the number when you can, because "80% to 110%" is stickier than a soft setup.',
  'Say "I" instead of "we" so your personal contribution is impossible to miss.',
  "Spend the most time on Actions because that is where interviewers score how you think.",
  "End every answer with what changed: the result, the standard work, or the lesson.",
  "If they probe deeper, slow down instead of panicking. More probing usually means they are interested.",
  "Do not repeat the same story across interviewers if you can avoid it because they compare notes in debrief.",
] as const;

export const AMAZON_PREP_DECK_QUESTIONS_TO_ASK = [
  "What's the biggest challenge you'd want a new AM to tackle first?",
  "How do you measure success for an AM in the first 90 days?",
] as const;

const PREP_DECK_STORY_LOOKUP = Object.fromEntries(
  AMAZON_PREP_DECK_STORIES.map((story) => [story.id, story]),
) as Record<string, PrepDeckStoryTemplate>;

const LP_CATEGORY_IDS = new Set([
  "customer-obsession",
  "ownership",
  "invent-and-simplify",
  "are-right-a-lot",
  "learn-and-be-curious",
  "hire-and-develop-the-best",
  "insist-on-the-highest-standards",
  "think-big",
  "bias-for-action",
  "frugality",
  "earn-trust",
  "dive-deep",
  "have-backbone-disagree-and-commit",
  "deliver-results",
  "strive-to-be-earth-s-best-employer",
  "success-and-scale-bring-broad-responsibility",
]);

const FUNCTIONAL_CATEGORY_IDS = new Set([
  "adaptability",
  "collaboration",
  "conscientiousness",
  "customer-orientation",
  "deal-with-ambiguity",
  "influencing",
  "interpretation-and-analysis",
  "judgment-and-decision-making",
  "learning-orientation",
  "plan-and-prioritize",
  "team-and-people-management",
  "vision-and-strategy",
]);

export function getPrepDeckStoryById(
  storyId: string,
): PrepDeckStoryTemplate | null {
  return PREP_DECK_STORY_LOOKUP[storyId] ?? null;
}

export function getPrepDeckRouteByCategory(
  categoryId: string,
): PrepDeckRouterEntry | null {
  return (
    AMAZON_PREP_DECK_ROUTER.find((entry) => entry.categoryId === categoryId) ??
    null
  );
}

export function getPrepDeckStoriesForCategory(
  categoryId: string,
): PrepDeckStoryTemplate[] {
  return AMAZON_PREP_DECK_STORIES.filter((story) =>
    story.categoryIds.includes(categoryId),
  );
}

export function getPrepDeckStoriesForFamily(
  family: InterviewSourceFamily,
): PrepDeckStoryTemplate[] {
  const categoryIds =
    family === "lp" ? LP_CATEGORY_IDS : FUNCTIONAL_CATEGORY_IDS;

  return AMAZON_PREP_DECK_STORIES.filter((story) =>
    story.categoryIds.some((categoryId) => categoryIds.has(categoryId)),
  );
}

export function buildPrepDeckStoryDraft(
  story: PrepDeckStoryTemplate,
): StoryDraft {
  return {
    competency: story.signalLane,
    categoryTags: [...story.categoryIds],
    title: story.title,
    situation: story.situation,
    task: story.task,
    action: story.action,
    result: story.result,
    reflection: story.lesson,
  };
}
