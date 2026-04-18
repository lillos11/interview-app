import {
  buildEliteStoryPolish,
  reviewStarStory,
} from "./interview";
import type {
  CompetencyId,
  InterviewSourceFamily,
  PitchPack,
  StoryDraft,
} from "./interview";

export interface PrepDeckStoryTemplate {
  id: string;
  storyNumber: number;
  shortLabel: string;
  title: string;
  signalLane: CompetencyId;
  categoryIds: string[];
  keyNumbers: string[];
  primaryPrinciples: string[];
  secondaryPrinciples: string[];
  situation: string;
  task: string;
  action: string;
  result: string;
  reflection: string;
  whatChanged?: string;
  followUpQuestions: string[];
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

export interface PrepDeckElitePreview {
  sourceDraft: StoryDraft;
  sourceScore: number;
  polishedDraft: StoryDraft;
  polishedScore: number;
  scoreDelta: number;
  headline: string;
  adjustments: string[];
  remainingGaps: string[];
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
    shortLabel: "Solo Operator",
    title: "The Solo Operator",
    signalLane: "leadership",
    categoryIds: [
      "ownership",
      "deliver-results",
      "bias-for-action",
      "dive-deep",
      "hire-and-develop-the-best",
      "have-backbone-disagree-and-commit",
      "think-big",
      "team-and-people-management",
      "plan-and-prioritize",
      "vision-and-strategy",
    ],
    keyNumbers: [
      "97.2 UPH vs 95 target",
      "Defects down 14%",
      "Zero CPT misses over 3 months",
      "2 associates promoted to Tier 3",
    ],
    primaryPrinciples: ["Ownership", "Deliver Results"],
    secondaryPrinciples: [
      "Bias for Action",
      "Dive Deep",
      "Hire and Develop the Best",
      "Have Backbone",
    ],
    situation:
      "In Q3 2024, I was the only Process Assistant left running Pack Singles on night shift at MKC6 after our Area Manager transferred and the only other PA resigned within two weeks.",
    task:
      "I had to hold a 40-person department to a 95 UPH target, keep defects under control, hit zero CPT misses, and onboard new associates with no direct management support.",
    action:
      "I rebuilt the shift rhythm: a staffing plan by skill level, a 10-minute start-of-shift standup, peer coaches for the strongest associates, and tighter data pulls by process path. When small singles fell to 72 UPH, I built a visual job aid and paired new hires with top performers. I also escalated the leadership gap with a risk summary for peak and traced a recurring mislabel issue to scanner calibration, getting it fixed that night and adding a start-of-shift scanner check to standard work.",
    result:
      "Over the three months I ran Singles solo, the department averaged 97.2 UPH against a 95 target, defects dropped 14%, we had zero CPT misses, and two associates I developed earned Tier 3 promotions.",
    reflection:
      "This experience changed how I think about leadership. I stopped operating inside someone else's system and started building the system myself.",
    whatChanged:
      "Before this, I measured my value by how well I followed direction. After running a 40-person department solo for three months, I measure it by what I leave behind.",
    followUpQuestions: [
      "How did you know small singles was the bottleneck? - Walk through the 72 UPH versus 95 target discovery.",
      "What was in the risk summary you sent to the Ops Manager? - Explain the peak planning shortfall risk you quantified.",
      "How did you keep morale up with no AM? - Cover the standups, clarity of direction, and peer-coaching model.",
      "What happened with the two associates you promoted? - Be ready with the path they moved into and what coaching got them there.",
      "How did you verify the 14% defect reduction? - Tie it back to your audit data and prior-quarter comparison.",
    ],
  },
  {
    id: "story-2",
    storyNumber: 2,
    shortLabel: "Department Turnaround",
    title: "The Department Turnaround",
    signalLane: "leadership",
    categoryIds: [
      "deliver-results",
      "insist-on-the-highest-standards",
      "customer-obsession",
      "invent-and-simplify",
      "conscientiousness",
      "customer-orientation",
      "plan-and-prioritize",
    ],
    keyNumbers: [
      "80% to 110% of plan",
      "21% productivity gain",
      "DPMO down 35%",
      "Station health up to 85% to 90%",
    ],
    primaryPrinciples: [
      "Deliver Results",
      "Insist on the Highest Standards",
    ],
    secondaryPrinciples: ["Customer Obsession", "Invent and Simplify"],
    situation:
      "When I took ownership of Pack Singles at MKC6, the department was only running at 80% of plan, defects were high, and workstation and coaching standards varied across corners.",
    task:
      "I had to turn the department around without extra headcount by resetting what good looked like and building a system that would hold across shifts.",
    action:
      "I audited every corner using the SLIM dashboard, found that layout inconsistencies were costing 8 to 12 seconds per unit, standardized the workstation setup, and created a visual guide for all shifts. I also trained more than 60 associates through a train-the-trainer model and used VOC and DPMO data to run targeted quality coaching instead of generic feedback.",
    result:
      "Pack rate rose from 80% of plan to 110% in three months, sustained between 104% and 113% month over month, DPMO dropped 35%, and station health improved from 55% to 60% up to 85% to 90%.",
    reflection:
      "Standards do not raise themselves. Someone has to decide that underperformance is not acceptable and then build the system that makes the higher bar stick.",
    followUpQuestions: [
      "How did you identify the workstation issues as the root cause? - Walk through the station health audit and timing study.",
      "What resistance did you face when standardizing across corners? - Be ready with a real pushback example.",
      "How did you train 60+ associates without losing productivity? - Explain the train-the-trainer model and scheduling approach.",
      "How do you define quality as a customer promise? - Show how VOC data changed your coaching priorities.",
    ],
  },
  {
    id: "story-3",
    storyNumber: 3,
    shortLabel: "Prime Day CPT Recovery",
    title: "The Prime Day CPT Recovery",
    signalLane: "ownership",
    categoryIds: [
      "bias-for-action",
      "deliver-results",
      "dive-deep",
      "ownership",
      "plan-and-prioritize",
      "judgment-and-decision-making",
      "adaptability",
    ],
    keyNumbers: [
      "5,478 of 5,500 CPTs cleared",
      "99.6% recovery",
      "2-hour window",
      "Zero preventable CPT misses",
    ],
    primaryPrinciples: ["Bias for Action"],
    secondaryPrinciples: ["Deliver Results", "Dive Deep", "Ownership"],
    situation:
      "During Prime Day at MKC6, I had 5,500 CPTs due inside a two-hour window with no extra headcount available to pull.",
    task:
      "I had to clear the window on time using the people and stations already on the floor while making staffing calls quickly enough to recover in flight.",
    action:
      "I tracked the scanned bucket and actual throughput against the required pace, spotted that we were trending short, moved a packer from a lower-priority path to Singles, and added a dwell lead to remove the handoff delay between packing and dock.",
    result:
      "We cleared 5,478 of 5,500 CPTs, a 99.6% recovery rate. The 22 that missed were late-arriving volume outside our control, so we had zero preventable CPT misses.",
    reflection:
      "In a live operation, waiting for perfect information is usually the same thing as choosing to lose. Speed matters when the data already tells you what lever to pull.",
    followUpQuestions: [
      "How did you calculate that you were trending short? - Explain the real-time rate math.",
      "Why did you add a dwell lead specifically? - Describe the handoff delay between packing and dock.",
      "What happened to the path you pulled the packer from? - Walk through the tradeoff decision.",
      "What would you have done differently if you had missed? - Show how you think after the fact.",
    ],
  },
  {
    id: "story-4",
    storyNumber: 4,
    shortLabel: "Wrong Box Deep Dive",
    title: "The Wrong Box Deep Dive",
    signalLane: "technical_depth",
    categoryIds: [
      "dive-deep",
      "are-right-a-lot",
      "insist-on-the-highest-standards",
      "invent-and-simplify",
      "interpretation-and-analysis",
      "judgment-and-decision-making",
    ],
    keyNumbers: [
      "70% to 71% of errors were invisible",
      "2 months of data analyzed",
      "Wrong-box coaching redirected to controllable defects",
    ],
    primaryPrinciples: ["Dive Deep", "Are Right, A Lot"],
    secondaryPrinciples: [
      "Insist on the Highest Standards",
      "Invent and Simplify",
    ],
    situation:
      "Wrong-box defects kept showing up in the department, and the standing belief was that associates simply needed more coaching.",
    task:
      "I needed to test that assumption, find the real root cause, and stop us from coaching the wrong problem.",
    action:
      "I pulled two months of wrong-box data, broke it down by error type, and found that 70% to 71% of the errors were invisible to our quality tracking. I rebuilt the classification approach so we could separate controllable from uncontrollable defects and coach only the errors associates could actually prevent.",
    result:
      "Wrong-box defects became visible in the data, coaching got more precise, and leaders stopped blaming associates for errors they could not control.",
    reflection:
      "The most dangerous assumption in operations is thinking you know the problem before you look at the data. That mindset keeps teams stuck.",
    followUpQuestions: [
      "How did you discover the 70% to 71% were invisible? - Walk through the data breakdown.",
      "How did you build the new coaching framework? - Explain the controllable versus uncontrollable split.",
      "Did anyone push back when you challenged the current approach? - Be ready to show backbone if that happened.",
    ],
  },
  {
    id: "story-5",
    storyNumber: 5,
    shortLabel: "Developing an Associate",
    title: "Developing an Associate",
    signalLane: "leadership",
    categoryIds: [
      "hire-and-develop-the-best",
      "earn-trust",
      "insist-on-the-highest-standards",
      "team-and-people-management",
      "influencing",
    ],
    keyNumbers: [
      "50 UPH to 80 UPH",
      "60% improvement",
      "Quality defects to zero",
      "Associate became a PG",
    ],
    primaryPrinciples: ["Hire and Develop the Best"],
    secondaryPrinciples: ["Earn Trust", "Insist on the Highest Standards"],
    situation:
      "I had an associate in Pack Singles running at 50 UPH with elevated defects. The usual move would have been escalation, but the real issue was technique, not effort.",
    task:
      "I needed to raise their performance without crushing confidence, and I had to fix quality before trying to force speed.",
    action:
      "I coached privately with their personal data, fixed the two main defect types first, required two clean shifts before shifting to speed, and then used takt-time observations to remove wasted motion one change at a time with daily follow-ups.",
    result:
      "The associate improved from 50 UPH to 80 UPH, defects dropped to zero, and they later became a Process Guide.",
    reflection:
      "Speed without quality is fake progress. Once quality is stable, speed usually follows because the associate stops wasting motion correcting mistakes.",
    followUpQuestions: [
      "Why did you choose quality-first instead of rate-first? - Explain why quality issues cost more time overall.",
      "What was the associate's reaction when you showed them their data? - Be ready with the actual conversation.",
      "How long did the improvement take? - Walk through the timeline week by week.",
    ],
  },
  {
    id: "story-6",
    storyNumber: 6,
    shortLabel: "Tough Conversation",
    title: "The Tough Conversation",
    signalLane: "stakeholder_management",
    categoryIds: [
      "earn-trust",
      "hire-and-develop-the-best",
      "insist-on-the-highest-standards",
      "influencing",
      "conscientiousness",
      "team-and-people-management",
    ],
    keyNumbers: [
      "45 UPH to 70+ UPH",
      "Near-zero defects",
      "Improvement in 2 weeks",
    ],
    primaryPrinciples: ["Earn Trust"],
    secondaryPrinciples: [
      "Hire and Develop the Best",
      "Insist on the Highest Standards",
    ],
    situation:
      "I had an associate at 45 UPH with recurring defects, and prior coaching on the floor had created defensiveness instead of improvement.",
    task:
      "I needed to have a direct but productive conversation that changed behavior rather than just documented the gap.",
    action:
      "I pulled them aside privately, reviewed individualized data with them, opened by asking what they thought was getting in the way, and narrowed the plan to two specific changes with daily follow-ups for a week.",
    result:
      "Within two weeks they improved to over 70 UPH, defects dropped near zero, and they became one of the most engaged people on the shift.",
    reflection:
      "Trust gets built in private. The moment feedback becomes public, people start defending themselves instead of hearing you.",
    followUpQuestions: [
      "What did they say when you asked what was getting in the way? - Be ready with the actual answer.",
      "Did they push back during the conversation? - Explain how you handled resistance if there was any.",
      "How did you decide on just two things to change? - Show why focused coaching beats overwhelming feedback.",
    ],
  },
  {
    id: "story-7",
    storyNumber: 7,
    shortLabel: "Floor Rescue",
    title: "The Floor Rescue",
    signalLane: "ownership",
    categoryIds: [
      "bias-for-action",
      "ownership",
      "deliver-results",
      "earn-trust",
      "adaptability",
      "plan-and-prioritize",
      "team-and-people-management",
    ],
    keyNumbers: [
      "Scanned bucket 10,000 to under 7,000",
      "Avoided 12,000 shutdown threshold",
      "No CPT misses from the jam",
    ],
    primaryPrinciples: ["Bias for Action", "Ownership"],
    secondaryPrinciples: ["Deliver Results", "Earn Trust"],
    situation:
      "During a shift at MKC6, the sorter jammed and the scanned bucket spiked to 10,000. We were only 2,000 packages from a building shutdown threshold and there was no AM present.",
    task:
      "I needed to get the sorter issue fixed, stabilize the scanned bucket, and keep my own floor moving without dropping one area while I handled the other.",
    action:
      "I called RME directly, handed my radio to a Process Guide I had developed so they could own my side of the floor, crossed over to the sorter area, and coordinated the response while getting bucket updates every two minutes.",
    result:
      "We recovered the scanned bucket from 10,000 to under 7,000, avoided a shutdown, and had no CPT misses from the jam.",
    reflection:
      "You cannot be in two places at once, but your development investments can. The handoff only worked because I had already built capability in the PG I trusted.",
    followUpQuestions: [
      "How did you decide to bypass the standard notification chain? - Explain the time-sensitive threshold call.",
      "What was the PG's background? - Be ready with specifics on who you trusted with the floor.",
      "What was the building shutdown threshold? - Know the exact threshold and your remaining margin.",
    ],
  },
  {
    id: "story-8",
    storyNumber: 8,
    shortLabel: "The Misread",
    title: "The Misread",
    signalLane: "adaptability",
    categoryIds: [
      "ownership",
      "learn-and-be-curious",
      "are-right-a-lot",
      "deliver-results",
      "adaptability",
      "learning-orientation",
      "interpretation-and-analysis",
    ],
    keyNumbers: [
      "258 CPTs missed",
      "New per-path check every 30 minutes",
      "Failure turned into Prime Day playbook",
    ],
    primaryPrinciples: ["Ownership", "Learn and Be Curious"],
    secondaryPrinciples: ["Are Right, A Lot", "Deliver Results"],
    situation:
      "On a shift where I owned a CPT window with 258 packages, I misread the pacing data and waited too long to pull the staffing lever needed to recover.",
    task:
      "I had to own the miss, explain exactly why it happened, and make sure I never repeated it.",
    action:
      "I ran a root-cause analysis on my own decision making, realized I had been watching aggregate throughput instead of per-path productivity, and rebuilt my monitoring cadence around per-path checks every 30 minutes with an immediate staffing trigger if any path dropped below threshold.",
    result:
      "The 258 CPT miss remained a real failure, but the monitoring system I built afterward became the basis for later recoveries, including clearing 5,478 of 5,500 CPTs on Prime Day.",
    reflection:
      "The difference between a mistake and a failure is what you do after it. I did not hide the miss. I turned it into operating standard.",
    followUpQuestions: [
      "What specifically did you misread in the data? - Explain the aggregate versus per-path gap.",
      "How did you tell your AM about the miss? - Show direct accountability.",
      "What leading indicator threshold did you set afterward? - Know the number you used.",
      "Have you missed a CPT since then? - Connect the answer to Prime Day.",
    ],
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
      "collaboration",
      "plan-and-prioritize",
    ],
    keyNumbers: [
      "55% to 60% up to 85% to 90%",
      "25 to 30 point station health lift",
      "Rate and quality variability reduced",
    ],
    primaryPrinciples: ["Invent and Simplify"],
    secondaryPrinciples: ["Insist on the Highest Standards", "Dive Deep"],
    situation:
      "Station health in Pack Singles was only 55% to 60%, so associates were losing time at shift start and setup variability was driving rate and quality gaps across corners.",
    task:
      "I needed to find the root cause, redesign the setup, and make the fix stick even when I was not on shift.",
    action:
      "I compared high-performing and low-performing stations, found that dual tape-machine placement and table orientation were the biggest variables, redesigned the setup, created a visual guide, and trained Process Guides to verify station health at startup.",
    result:
      "Station health improved to 85% to 90%, associates stopped losing time fixing workstations at shift start, and rate and quality variability between corners dropped.",
    reflection:
      "You cannot coach someone to hit rate if their workspace is fighting them. Fix the environment first, then coach the person.",
    followUpQuestions: [
      "How did you identify dual tape placement as the root cause? - Explain the comparison study.",
      "What customer impact did the station improvements have? - Connect the fix to quality and downstream experience.",
      "How did you sustain it across shifts you were not on? - Explain the Process Guide verification routine.",
    ],
  },
  {
    id: "story-10",
    storyNumber: 10,
    shortLabel: "Continuous Learner",
    title: "The Continuous Learner",
    signalLane: "technical_depth",
    categoryIds: [
      "learn-and-be-curious",
      "hire-and-develop-the-best",
      "think-big",
      "learning-orientation",
      "interpretation-and-analysis",
    ],
    keyNumbers: [
      "BS in Business Administration and Data Analytics",
      "MBA in Business Analytics in progress",
      "5 Google certificates",
      "Lean Six Sigma Yellow Belt",
    ],
    primaryPrinciples: ["Learn and Be Curious"],
    secondaryPrinciples: ["Hire and Develop the Best", "Think Big"],
    situation:
      "I knew operations experience alone would not be enough to move into Area Manager and beyond, especially if I wanted a stronger analytical and business toolkit.",
    task:
      "I needed to build that capability on my own time while still working full-time night shifts.",
    action:
      "I completed a Business Administration and Data Analytics degree with a 3.29 GPA, started an MBA in Business Analytics, earned five Google professional certificates, and added Lean Six Sigma training. I applied the learning directly to quality deep dives, SmartPac analysis, and station health work instead of treating school as separate from the floor.",
    result:
      "I built a real analytical foundation while working full time, and the new toolkit directly improved how I approached operational decisions and root-cause analysis.",
    reflection:
      "Curiosity is not a trait. It is a habit. I did not wait for someone to train me in analytics. I went and built that capability myself.",
    followUpQuestions: [
      "Give me an example where your education changed a decision on the floor. - Link it to the wrong-box or SmartPac work.",
      "Why data analytics as a focus? - Connect it to the role you want next.",
      "How did you manage school with full-time shifts? - Be ready with your actual routine.",
    ],
  },
  {
    id: "story-11",
    storyNumber: 11,
    shortLabel: "Blackout",
    title: "The Blackout",
    signalLane: "ownership",
    categoryIds: [
      "bias-for-action",
      "customer-obsession",
      "ownership",
      "earn-trust",
      "adaptability",
      "plan-and-prioritize",
      "team-and-people-management",
    ],
    keyNumbers: [
      "40+ associates",
      "Zero safety incidents",
      "10+ performance reviews referenced it",
    ],
    primaryPrinciples: ["Bias for Action", "Customer Obsession"],
    secondaryPrinciples: ["Ownership", "Earn Trust"],
    situation:
      "During a shift at MKC6, the Singles department lost power while my Area Manager was absent and I was the only leader responsible for more than 40 associates in an active packing environment.",
    task:
      "I had to secure the floor, account for every associate, and decide whether operations could safely resume without a playbook for that exact situation.",
    action:
      "I stopped all packing immediately, directed associates to stay at station to prevent low-visibility injuries, conducted a headcount, communicated over the PA system, contacted RME and facilities for restoration status, used the downtime for safety walkthroughs, and verified every station before restart.",
    result:
      "We had zero safety incidents, all associates were accounted for within minutes, and operations resumed cleanly once power was restored.",
    reflection:
      "Safety leadership is what you do when there is no checklist in front of you. Calm, decisive action in a crisis builds trust faster than months of normal operations.",
    followUpQuestions: [
      "Walk me through the first 60 seconds after the lights went out. - Know the order of your actions cold.",
      "How did you communicate with 40+ associates without power? - Explain the PA and direct communication approach.",
      "Did anyone panic or refuse direction? - Be ready with a real interaction if one happened.",
    ],
  },
  {
    id: "story-12",
    storyNumber: 12,
    shortLabel: "Field Sense Survey",
    title: "The Field Sense Survey",
    signalLane: "leadership",
    categoryIds: [
      "invent-and-simplify",
      "strive-to-be-earth-s-best-employer",
      "customer-obsession",
      "dive-deep",
      "influencing",
      "collaboration",
      "team-and-people-management",
    ],
    keyNumbers: [
      "SLI unfavorable 29% to 20%",
      "9-point improvement",
      "Dual-purpose survey for safety and development",
    ],
    primaryPrinciples: [
      "Invent and Simplify",
      "Strive to be Earth's Best Employer",
    ],
    secondaryPrinciples: ["Customer Obsession", "Dive Deep"],
    situation:
      "Singles had a 29% unfavorable SLI score and associates had no formal path to raise safety concerns or express interest in cross-training.",
    task:
      "I needed to create a mechanism for associate voice that covered both safety concerns and development interest because no structured channel existed.",
    action:
      "I designed and launched the Field Sense Survey, walked associates through how to use it, reviewed every submission, categorized safety concerns by severity, and escalated the highest-priority items with specific recommendations.",
    result:
      "The unfavorable SLI score improved from 29% to 20%, multiple safety issues surfaced and got resolved, and the same tool created a development pipeline for indirect-path training.",
    reflection:
      "Associates closest to the work usually see the problems first. The gap was not awareness. It was the lack of a channel to turn that awareness into action.",
    followUpQuestions: [
      "What triggered you to build this instead of using existing channels? - Describe the gap you saw.",
      "How did you follow up on the safety concerns that came in? - Walk through one specific example.",
      "Did leadership resist when you escalated issues they had not flagged? - Be ready if there was tension.",
    ],
  },
  {
    id: "story-13",
    storyNumber: 13,
    shortLabel: "SmartPac Productivity",
    title: "SmartPac Productivity Transformation",
    signalLane: "problem_solving",
    categoryIds: [
      "deliver-results",
      "dive-deep",
      "insist-on-the-highest-standards",
      "interpretation-and-analysis",
      "conscientiousness",
    ],
    keyNumbers: [
      "420 UPH to 470-510 UPH",
      "50+ UPH improvement",
      "12% throughput lift",
    ],
    primaryPrinciples: ["Deliver Results"],
    secondaryPrinciples: ["Dive Deep", "Insist on the Highest Standards"],
    situation:
      "SmartPac productivity had plateaued at 420 UPH for long enough that it was treated as normal, and nobody had broken down where the workflow was losing time.",
    task:
      "I was given ownership of SmartPac productivity and had to raise the rate without extra headcount or equipment.",
    action:
      "I timed the full sequence end to end, found the biggest losses in transitions and exception handling rather than packing itself, redesigned the workflow around staging and positioning, and coached each associate to their specific bottleneck through daily takt-time observation.",
    result:
      "SmartPac productivity rose from 420 UPH to 470-510 UPH, a sustained 50+ UPH gain and about a 12% lift in throughput with no extra labor or equipment.",
    reflection:
      "Machine-paced processes can trick you into blaming the machine. Most of the real loss was in how people interacted with the machine between steps.",
    followUpQuestions: [
      "How did you identify which transitions were costing the most time? - Walk through the observation method.",
      "What did you do when an associate plateaued despite coaching? - Explain how you changed your approach.",
      "How did you sustain the gains after you moved on? - Show how it became workflow, not heroics.",
    ],
  },
  {
    id: "story-14",
    storyNumber: 14,
    shortLabel: "Smalls Campaign",
    title: "The Smalls Bottom Performer Campaign",
    signalLane: "leadership",
    categoryIds: [
      "hire-and-develop-the-best",
      "insist-on-the-highest-standards",
      "dive-deep",
      "team-and-people-management",
      "interpretation-and-analysis",
      "influencing",
    ],
    keyNumbers: [
      "15 underperformers down to 7 in 1 month",
      "Smalls rate 199 to 214 UPH",
      "Only 3 regular packers below goal by Apr 2024",
    ],
    primaryPrinciples: ["Hire and Develop the Best"],
    secondaryPrinciples: ["Insist on the Highest Standards", "Dive Deep"],
    situation:
      "I had 15 Smalls packers below the 160 UPH goal, many of whom had been in role for months and had only ever heard generic feedback like go faster.",
    task:
      "I set a goal to get every Smalls packer above 160 UPH through individualized coaching and data, not pressure or write-ups.",
    action:
      "I ranked each underperformer by gap to goal, started with the quickest wins, ran takt-time observations on every associate, fixed layout issues where the workstation was part of the problem, and built individual coaching plans with daily check-ins tied to each person's baseline.",
    result:
      "Within one month I cut the number of underperforming Smalls packers from 15 to 7, raised the overall Smalls rate from 199 to 214 UPH, and later pushed three more above goal.",
    reflection:
      "Telling someone to go faster is not coaching. Real coaching starts with where the time loss is and what one change will remove it.",
    followUpQuestions: [
      "What did you do with the three still below goal? - Explain the escalation and continued coaching path.",
      "How did you prioritize who to coach first? - Walk through the gap-to-goal ranking logic.",
      "How was this different from what previous leaders did? - Contrast generic coaching with individualized, data-backed coaching.",
    ],
  },
  {
    id: "story-15",
    storyNumber: 15,
    shortLabel: "5S Standardization",
    title: "The 5S Standardization Project",
    signalLane: "problem_solving",
    categoryIds: [
      "insist-on-the-highest-standards",
      "invent-and-simplify",
      "ownership",
      "collaboration",
      "plan-and-prioritize",
    ],
    keyNumbers: [
      "Standardized all 4 corners",
      "Smalls and SmartPac included",
      "Green station readiness maintained in SLIM",
    ],
    primaryPrinciples: ["Insist on the Highest Standards"],
    secondaryPrinciples: ["Invent and Simplify", "Ownership"],
    situation:
      "Smalls and SmartPac stations varied by shift and corner, so associates were wasting time reorienting themselves at the start of each shift and station health stayed inconsistent.",
    task:
      "I needed to create one standard 5S setup for both station types and push it across all four corners.",
    action:
      "I partnered with the 5S team to audit current setups, chose the configuration that produced the best station health and fewest complaints, documented it visually, reset every corner, and trained both associates and other PAs on maintaining it with Process Guide startup checks.",
    result:
      "The standard was pushed to all four corners for Smalls and SmartPac, SLIM station readiness stayed green, and associates stopped burning time adjusting workstations at shift start.",
    reflection:
      "Consistency does not happen because people remember to be consistent. It happens when you take the setup decision out of their hands and make the right setup the default.",
    followUpQuestions: [
      "What was wrong with the previous setups? - Describe the exact variation hurting performance.",
      "How did you get other PAs to maintain the standard? - Explain the Process Guide routine and visual guide.",
    ],
  },
  {
    id: "story-16",
    storyNumber: 16,
    shortLabel: "Training New Leadership",
    title: "Training the New Leadership",
    signalLane: "stakeholder_management",
    categoryIds: [
      "earn-trust",
      "think-big",
      "hire-and-develop-the-best",
      "ownership",
      "collaboration",
      "influencing",
      "team-and-people-management",
      "vision-and-strategy",
    ],
    keyNumbers: [
      "2023 to 2024 turnover window",
      "15+ performance reviews referenced trust",
      "Multiple AMs and PAs onboarded",
    ],
    primaryPrinciples: ["Earn Trust", "Think Big"],
    secondaryPrinciples: ["Hire and Develop the Best", "Ownership"],
    situation:
      "MKC6 Singles saw heavy leadership turnover, so new Area Managers and Process Assistants kept entering the department with limited knowledge of the process, metrics, and people.",
    task:
      "I needed to get each new leader effective quickly so department performance did not dip, even though most of them were technically above me in the hierarchy.",
    action:
      "I built a consistent knowledge-transfer approach around startup rhythm, first-hour checks, CPT review, scanned-bucket monitoring, safety walks, SLIM station health, and key associate context. I proactively shared it, interchanged with new AMs at startup, and led with competence instead of waiting to be asked.",
    result:
      "Multiple AMs and PAs were successfully onboarded, my Senior Ops Manager said I could run Singles independently, and the systems I built survived each transition because they were documented and transferable.",
    reflection:
      "When you are below someone in the hierarchy, you earn trust through competence. The fastest way to win a new leader's trust is to make them successful early.",
    followUpQuestions: [
      "Tell me about a specific new AM you trained. - Be ready with a named example.",
      "What happened when a new AM wanted to do things differently? - Be ready for a backbone or disagree-and-commit follow-up.",
    ],
  },
  {
    id: "story-17",
    storyNumber: 17,
    shortLabel: "Indirect Rotation Advocacy",
    title: "The Indirect Rotation Advocacy",
    signalLane: "stakeholder_management",
    categoryIds: [
      "strive-to-be-earth-s-best-employer",
      "have-backbone-disagree-and-commit",
      "hire-and-develop-the-best",
      "ownership",
      "influencing",
      "team-and-people-management",
    ],
    keyNumbers: [
      "Formal indirect rotation framework launched",
      "Opportunities survey tied into training",
      "Deeper bench of cross-trained associates",
    ],
    primaryPrinciples: [
      "Strive to be Earth's Best Employer",
      "Have Backbone",
    ],
    secondaryPrinciples: ["Hire and Develop the Best", "Ownership"],
    situation:
      "Indirect roles in Singles kept going to the same people, which was burning out the regular indirects and leaving newer associates with no real growth path.",
    task:
      "I needed to create a fair rotation system that reduced fatigue, opened new development opportunities, and still won leadership support despite short-term disruption.",
    action:
      "I built the Indirect Acid Feed to track who was trained on which indirect paths, created a fair rotation cadence, and paired it with an Opportunities Field Sense Survey so associates could formally apply for indirect training. I then made the case to my AM that a cross-trained team was more resilient than a specialized one.",
    result:
      "The rotation framework was implemented, fatigue complaints from regular indirects eased, associates had a formal path into indirect training, and the team built a deeper cross-trained bench.",
    reflection:
      "If you only optimize for today's rate, you burn out the people who make tomorrow's rate possible. Sometimes the right leadership call accepts short-term inefficiency for long-term team health.",
    followUpQuestions: [
      "What was the AM's reaction when you proposed the rotation? - Be ready to show backbone if there was pushback.",
      "How did the experienced indirects react to being rotated out? - Explain the associate conversations.",
    ],
  },
  {
    id: "story-18",
    storyNumber: 18,
    shortLabel: "Valley Staffing",
    title: "The Valley Staffing Strategy",
    signalLane: "problem_solving",
    categoryIds: [
      "frugality",
      "deliver-results",
      "are-right-a-lot",
      "judgment-and-decision-making",
      "interpretation-and-analysis",
      "plan-and-prioritize",
    ],
    keyNumbers: [
      "Support staffing reduced in valley periods",
      "Direct packing capacity increased",
      "Recognized for lean and mean staffing",
    ],
    primaryPrinciples: ["Frugality"],
    secondaryPrinciples: ["Deliver Results", "Are Right A Lot"],
    situation:
      "I noticed we were consistently overstaffing the pack-support bucket during low-volume periods and spending hours where they were not creating value.",
    task:
      "I needed to reduce unnecessary labor spend without hurting department performance or associate experience.",
    action:
      "I tracked volume patterns across the shift, defined valley periods, reduced pack-support staffing only when demand truly dipped, and redeployed those hours to direct packing paths where they could drive rate. I used the data in syncs to show where it was safe to cut back.",
    result:
      "We reduced wasted support hours while maintaining performance, and the redeployed associates improved direct-path output instead of sitting in low-value support time.",
    reflection:
      "Frugality is not about cutting corners. It is about putting every hour where it creates the most value.",
    followUpQuestions: [
      "How did you define valley periods? - Explain the volume method and thresholds.",
      "Did leadership question why you were cutting support staffing? - Show the data-backed case you made.",
    ],
  },
  {
    id: "story-19",
    storyNumber: 19,
    shortLabel: "Recycling Initiative",
    title: "The Recycling Initiative",
    signalLane: "ownership",
    categoryIds: [
      "success-and-scale-bring-broad-responsibility",
      "ownership",
      "invent-and-simplify",
      "frugality",
      "think-big",
      "vision-and-strategy",
    ],
    keyNumbers: [
      "75% of metal wire recycled",
      "Rolled out to all 4 corners",
      "30% annual cost savings from the broader program",
    ],
    primaryPrinciples: ["Success and Scale Bring Broad Responsibility"],
    secondaryPrinciples: ["Ownership", "Invent and Simplify", "Frugality"],
    situation:
      "The Singles department generated metal wire waste every shift, and it was going into general waste even though Amazon had broader sustainability commitments.",
    task:
      "I needed to find out whether the material could be recycled, build a collection process that would not slow the operation, and launch it on my own initiative.",
    action:
      "I researched recycling options, coordinated with Non-Inventory, designed a collection flow that fit normal work, got buy-in from my AM, piloted it in one corner, and then rolled it out to all four Smalls corners once I confirmed it did not hurt rate.",
    result:
      "About 75% of the metal wire is now recycled, the process was documented as standard work across all four corners, and the broader sustainability program tracked 30% annual cost savings.",
    reflection:
      "The biggest sustainability wins come from the people closest to the process. You do not need executive sponsorship to start seeing waste and owning it.",
    followUpQuestions: [
      "How did you confirm recycling would not slow down rate? - Explain the pilot test in one corner.",
      "What environmental compliance metric did you investigate next? - Be ready with the next step you explored.",
      "Why did you take this on when it was not your job? - Connect it to broad responsibility and ownership.",
    ],
  },
] as const;

export const AMAZON_PREP_DECK_ROUTER: readonly PrepDeckRouterEntry[] = [
  {
    cue: "Customer, promise, package, on time",
    categoryId: "customer-obsession",
    primaryStoryIds: ["story-2", "story-11", "story-12"],
  },
  {
    cue: "Own it, outside your area, long term",
    categoryId: "ownership",
    primaryStoryIds: ["story-1", "story-7", "story-8"],
  },
  {
    cue: "Speed, risk, act fast, no guidance",
    categoryId: "bias-for-action",
    primaryStoryIds: ["story-3", "story-7", "story-11"],
  },
  {
    cue: "Results, deadline, goal, deliver",
    categoryId: "deliver-results",
    primaryStoryIds: ["story-1", "story-2", "story-13"],
  },
  {
    cue: "Standards, quality, improve, not good enough",
    categoryId: "insist-on-the-highest-standards",
    primaryStoryIds: ["story-2", "story-9", "story-15"],
  },
  {
    cue: "Develop, coach, feedback, grow people",
    categoryId: "hire-and-develop-the-best",
    primaryStoryIds: ["story-5", "story-14", "story-16"],
  },
  {
    cue: "Trust, honest, hard conversation, respect",
    categoryId: "earn-trust",
    primaryStoryIds: ["story-6", "story-16", "story-1"],
  },
  {
    cue: "Data, root cause, dig in, analyze",
    categoryId: "dive-deep",
    primaryStoryIds: ["story-4", "story-13", "story-12"],
  },
  {
    cue: "Disagree, push back, defend, commit",
    categoryId: "have-backbone-disagree-and-commit",
    primaryStoryIds: ["story-17", "story-1"],
  },
  {
    cue: "Learn, mistake, curious, new skill",
    categoryId: "learn-and-be-curious",
    primaryStoryIds: ["story-10", "story-8"],
  },
  {
    cue: "Simple, innovate, fix, redesign",
    categoryId: "invent-and-simplify",
    primaryStoryIds: ["story-9", "story-12", "story-15"],
  },
  {
    cue: "Big picture, vision, scale, beyond your team",
    categoryId: "think-big",
    primaryStoryIds: ["story-16", "story-1", "story-19"],
  },
  {
    cue: "Decision, judgment, incomplete info",
    categoryId: "are-right-a-lot",
    primaryStoryIds: ["story-4", "story-18", "story-8"],
  },
  {
    cue: "Cost, waste, do more with less",
    categoryId: "frugality",
    primaryStoryIds: ["story-18", "story-19", "story-2"],
  },
  {
    cue: "Inclusive, best employer, overlooked people",
    categoryId: "strive-to-be-earth-s-best-employer",
    primaryStoryIds: ["story-12", "story-17", "story-5"],
  },
  {
    cue: "Sustainability, broader responsibility, company mission",
    categoryId: "success-and-scale-bring-broad-responsibility",
    primaryStoryIds: ["story-19", "story-1"],
  },
] as const;

export const AMAZON_PREP_DECK_PANEL_PLAN: readonly PrepDeckPanelPlanEntry[] = [
  {
    interviewer: "HRBP",
    categoryId: "earn-trust",
    primaryStoryId: "story-6",
    backupStoryId: "story-16",
  },
  {
    interviewer: "HRBP",
    categoryId: "have-backbone-disagree-and-commit",
    primaryStoryId: "story-17",
    backupStoryId: "story-1",
  },
  {
    interviewer: "HRBP",
    categoryId: "hire-and-develop-the-best",
    primaryStoryId: "story-5",
    backupStoryId: "story-14",
  },
  {
    interviewer: "HRBP",
    categoryId: "learn-and-be-curious",
    primaryStoryId: "story-10",
    backupStoryId: "story-8",
  },
  {
    interviewer: "L6",
    categoryId: "bias-for-action",
    primaryStoryId: "story-3",
    backupStoryId: "story-7",
  },
  {
    interviewer: "L6",
    categoryId: "deliver-results",
    primaryStoryId: "story-1",
    backupStoryId: "story-2",
  },
  {
    interviewer: "L6",
    categoryId: "insist-on-the-highest-standards",
    primaryStoryId: "story-2",
    backupStoryId: "story-9",
  },
  {
    interviewer: "L6",
    categoryId: "ownership",
    primaryStoryId: "story-1",
    backupStoryId: "story-8",
  },
  {
    interviewer: "L7",
    categoryId: "are-right-a-lot",
    primaryStoryId: "story-4",
    backupStoryId: "story-18",
  },
  {
    interviewer: "L7",
    categoryId: "dive-deep",
    primaryStoryId: "story-4",
    backupStoryId: "story-13",
  },
  {
    interviewer: "L7",
    categoryId: "invent-and-simplify",
    primaryStoryId: "story-9",
    backupStoryId: "story-12",
  },
  {
    interviewer: "L7",
    categoryId: "think-big",
    primaryStoryId: "story-16",
    backupStoryId: "story-1",
  },
] as const;

export const AMAZON_PREP_DECK_INTERVIEW_DAY_REMINDERS = [
  "Pause three seconds before answering so you sound controlled, not rushed.",
  'Lead with the number when you can, because "97.2 UPH against 95" is stickier than a soft setup.',
  'Say "I" instead of "we" so your personal contribution is impossible to miss.',
  "Spend the most time on Actions because that is where interviewers score how you think.",
  "End every answer with what changed: the result, the standard work, or the lesson.",
  "If they probe deeper, slow down instead of panicking. More probing usually means they are interested.",
  "Do not recycle the same story across interviewers when you can avoid it. Debriefs compare notes.",
] as const;

export const AMAZON_PREP_DECK_QUESTIONS_TO_ASK = [
  "What is the biggest challenge you would want a new Area Manager to take on first?",
  "How do you measure success for an Area Manager in the first 90 days?",
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
    reflection: story.whatChanged || story.reflection,
  };
}

export function buildPrepDeckElitePreview(
  story: PrepDeckStoryTemplate,
): PrepDeckElitePreview {
  const sourceDraft = buildPrepDeckStoryDraft(story);
  const sourceScore = reviewStarStory(sourceDraft).score;
  const polish = buildEliteStoryPolish(sourceDraft);

  return {
    sourceDraft,
    sourceScore,
    polishedDraft: polish.draft,
    polishedScore: polish.polishedReview.score,
    scoreDelta: polish.scoreDelta,
    headline: polish.headline,
    adjustments: polish.adjustments,
    remainingGaps: polish.remainingGaps,
  };
}

export function buildPrepDeckEliteStoryDraft(
  story: PrepDeckStoryTemplate,
): StoryDraft {
  return buildPrepDeckElitePreview(story).polishedDraft;
}
