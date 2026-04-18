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
  storyCode?: string;
  shortLabel: string;
  title: string;
  status?: string;
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
  standardWork?: string;
  whatChanged?: string;
  verificationNotes?: string[];
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
    "id": "story-1",
    "storyNumber": 1,
    "shortLabel": "Department Turnaround",
    "title": "The Department Turnaround",
    "status": "Elite - verify numbers",
    "signalLane": "leadership",
    "categoryIds": [
      "deliver-results",
      "insist-on-the-highest-standards",
      "customer-obsession",
      "ownership",
      "think-big",
      "invent-and-simplify",
      "conscientiousness",
      "customer-orientation",
      "plan-and-prioritize"
    ],
    "keyNumbers": [
      "80% to 110% of plan",
      "37.5% improvement",
      "DPMO dropped 35%",
      "21% productivity jump in 3 months",
      "104-113% sustained month over month"
    ],
    "primaryPrinciples": [
      "Deliver Results"
    ],
    "secondaryPrinciples": [
      "Insist on the Highest Standards",
      "Customer Obsession",
      "Ownership",
      "Think Big"
    ],
    "situation": "When I took ownership of the Pack Singles department at MKC6, the department was consistently operating at 80% of plan — and it had been accepted as normal. ⚠️ VERIFY Leadership turnover had created inconsistent standards across shifts. Every shift was running differently — no standardization, no accountability to a single standard. 80% of plan meant customers weren't receiving packages on time.",
    "task": "I needed to reset the performance standard for the entire department — not just improve the number, but change the culture that had accepted underperformance as the baseline. The department needed standardized processes, consistent execution across all shifts, and a training model that would sustain results without depending on any single leader.",
    "action": "I started by standardizing every workstation — same layout, same setup, every shift. No more variation between corners or between shifts. I locked the SOPs so every associate was following the same process regardless of who was leading the floor that day. I built real-time dashboards for first-hour visibility by associate and process step. Instead of waiting until end-of-shift to find out we missed, I could see within the first hour who was on pace and who wasn't — and intervene immediately. I personally trained 60+ associates ⚠️ VERIFY on the standardized processes. But I knew I couldn't scale by doing all the training myself, so I created a train-the-trainer model — I identified my strongest associates, trained them to coach others, and built a system where coaching scaled without adding headcount. I held the standard myself — I was the first one auditing, the first one coaching, the first one setting the example every single day. I applied the Six Sigma DMAIC framework end-to-end: defined the problem with data, measured the baseline, analyzed root causes by process path, implemented targeted improvements, and built controls to sustain them. I shifted the quality approach from reactive detection to proactive prevention — instead of catching defects downstream, I addressed the root causes at the station level before defects were created.",
    "result": "Pack rate went from 80% to 110% of plan — a 37.5% improvement. ⚠️ VERIFY DPMO dropped 35%. ⚠️ VERIFY Productivity jumped 21% in 3 months. ⚠️ VERIFY We sustained 104-113% of plan month over month. ⚠️ VERIFY Fewer defects meant fewer customer contacts and concessions. The train-the-trainer model ensured the system ran without me — the standard held across shifts because it was built into the process, not dependent on any individual.",
    "reflection": "This taught me that accepting underperformance is a leadership failure, not an associate failure. The associates didn't suddenly become better packers — I gave them a system that made excellence the default instead of the exception. The biggest lesson was that standardization isn't about control — it's about removing the variability that makes failure possible.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "What would you do if an associate refused to follow your standardized process?",
      "How did you handle an associate who was doing it 'their way' and still hitting rate?",
      "How did you get buy-in from other shifts to adopt your standards?",
      "What was the hardest part of sustaining the improvement?",
      "How did you measure the customer impact of the DPMO reduction?"
    ]
  },
  {
    "id": "story-2",
    "storyNumber": 2,
    "shortLabel": "Prime Day SmartPac CPT Recovery",
    "title": "Prime Day SmartPac CPT Recovery",
    "status": "Elite - verify numbers",
    "signalLane": "ownership",
    "categoryIds": [
      "bias-for-action",
      "deliver-results",
      "customer-obsession",
      "are-right-a-lot",
      "ownership",
      "plan-and-prioritize",
      "judgment-and-decision-making",
      "adaptability"
    ],
    "keyNumbers": [
      "5,500 CPTs",
      "2-hour window",
      "5,478 of 5,500 cleared",
      "99.6% recovery"
    ],
    "primaryPrinciples": [
      "Bias for Action"
    ],
    "secondaryPrinciples": [
      "Deliver Results",
      "Customer Obsession",
      "Are Right A Lot"
    ],
    "situation": "During Prime Day at MKC6, the SmartPac line got hit with 5,500 CPTs concentrated in a tight 2-hour window. ⚠️ VERIFY The volume hit all at once instead of being evenly distributed across the shift. The tote line was at risk of backing up to the tote router — which would create recirculation and dry up volume for other departments. The dwell lead was staffed but the pace wasn't matching the incoming volume. Quick math told me: current pace versus growing backlog meant we were at risk of missing truck times and breaking customer promise on thousands of packages.",
    "task": "I needed to clear 5,500 SmartPac CPTs within the 2-hour window without letting the tote line back up to the router — which would have caused a building-wide disruption affecting every department, not just SmartPac.",
    "action": "I read the staffing and productivity data in real time to identify where I could pull resources without impacting other process paths. I added a packer to the SmartPac line to increase pack-out speed. I pulled an extra dwell lead for the remainder of the CPT window and tasked them specifically with hunting down and prioritizing the shipments at highest risk of missing their CPT deadline. I monitored the tote line continuously to ensure we were keeping pace and preventing backup to the router. Every decision was made in minutes, not hours — I didn't have time to escalate and wait for direction.",
    "result": "We pushed out 5,478 out of 5,500 SmartPac CPTs — 99.6% recovery. ⚠️ VERIFY Totes never backed up to the tote router, which protected flow for every other department in the building. We prevented what would have been a building-wide disruption during the highest-volume day of the year. Customers got their Prime Day packages on time.",
    "reflection": "This is the story that connects directly to my failure story — the 258 CPT miss. The buffer check I used on Prime Day exists because I got burned by not having it. The difference between 258 misses and 99.6% recovery is one thing: catching the problem when you still have time to act, not when the numbers turn red.",
    "standardWork": "I built a buffer check into the first 30 minutes of every shift — compare CPT distribution versus pace. If the volume is front-loaded or concentrated, adjust staffing immediately. I shared this with other PAs and it became standard practice for high-volume days.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "How did you know pulling resources from other paths wouldn't hurt them?",
      "What would you have done if the tote line had backed up to the router?",
      "How did you prioritize which CPTs to chase first?",
      "What was the 0.4% you missed? Why couldn't you recover those?"
    ]
  },
  {
    "id": "story-3",
    "storyNumber": 3,
    "shortLabel": "Developing an AA",
    "title": "Developing an AA (50 to 80 UPH Transformation)",
    "status": "Elite",
    "signalLane": "leadership",
    "categoryIds": [
      "hire-and-develop-the-best",
      "earn-trust",
      "insist-on-the-highest-standards",
      "strive-to-be-earth-s-best-employer",
      "team-and-people-management",
      "influencing"
    ],
    "keyNumbers": [
      "50 UPH to 80 UPH",
      "60% improvement",
      "Zero defects",
      "Became a Process Guide"
    ],
    "primaryPrinciples": [
      "Hire and Develop the Best"
    ],
    "secondaryPrinciples": [
      "Earn Trust",
      "Insist on the Highest Standards",
      "Strive to be Earth's Best Employer"
    ],
    "situation": "During one of the slowest seasons at MKC6, when individual productivity rates matter most, I had an associate in Singles who was consistently hitting below expected rate — around 50 UPH. ⚠️ VERIFY But when I looked at their quality metrics, they had flawless execution — minimum errors, zero defects, no double scans. Previous leads had only focused on the overall rate number and overlooked this associate. They felt invisible and had been overlooked for months.",
    "task": "I needed to find a way to increase this associate's speed without sacrificing the flawless quality that made them valuable — and I needed to change their narrative from 'one of the slowest packers' to someone the team looked to as a standard-setter.",
    "action": "I sat down with the associate one-on-one and changed their narrative. I showed them what they were doing well — their accuracy was in the top tier of the department — and explained that flawless quality is the perfect foundation to build speed on. Most people have to slow down to improve quality; they already had quality locked in. I built their confidence first, then paired them with new hires as a quality mentor — giving them a leadership role that matched their strength. This shifted their identity from 'slow packer' to 'quality expert.' Then I watched their physical process — observed them packing for a full cycle and identified wasted movements that were costing time. I coached specific techniques to eliminate unnecessary motion while maintaining their quality standard. I didn't tell them to 'go faster' — I showed them exactly which movements to cut and why. I mapped out a possible career path with them, including the Learning Trainer role, so they could see where their quality-first approach could take them long-term.",
    "result": "Their pack rate climbed from 50 UPH to 80 UPH — a 60% improvement — while maintaining flawless quality. ⚠️ VERIFY They became a Process Guide. They went from being overlooked and invisible to being a trusted mentor that new hires were paired with. I turned someone the department had written off into one of its most valuable contributors.",
    "reflection": "This taught me that the best coaching doesn't start with what someone is doing wrong — it starts with what they're doing right. When you build on strength instead of attacking weakness, people don't just improve — they transform. This associate didn't need pressure. They needed someone to see them.",
    "standardWork": "I started evaluating quality metrics alongside rate for every associate — not just speed. I built this into my coaching framework so no one gets overlooked because they're accurate but not fast. The fastest packer with high defects costs more than a steady packer with zero defects.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "How long did the improvement from 50 to 80 UPH take?",
      "What would you have done if their rate didn't improve despite coaching?",
      "How did you balance investing time in one associate versus the rest of the team?",
      "What specifically were the wasted movements you identified?"
    ]
  },
  {
    "id": "story-4",
    "storyNumber": 4,
    "shortLabel": "Tough Conversation",
    "title": "The Tough Conversation (45 to 70+ UPH Turnaround)",
    "status": "Elite",
    "signalLane": "stakeholder_management",
    "categoryIds": [
      "earn-trust",
      "have-backbone-disagree-and-commit",
      "hire-and-develop-the-best",
      "insist-on-the-highest-standards",
      "influencing",
      "conscientiousness",
      "team-and-people-management"
    ],
    "keyNumbers": [
      "45 UPH to 70+ UPH",
      "15-20 seconds per unit recovered",
      "Improved within a month"
    ],
    "primaryPrinciples": [
      "Earn Trust"
    ],
    "secondaryPrinciples": [
      "Have Backbone",
      "Hire and Develop the Best",
      "Insist on the Highest Standards"
    ],
    "situation": "I had an associate on my team in Singles at MKC6 who was consistently underperforming — hitting around 45 UPH with frequent quality defects. ⚠️ VERIFY Other leaders had already talked to them multiple times, but the feedback was always generic: 'you need to pick it up' or 'your rate is too low.' Nobody had shown them what the actual problem was or given them a real plan to fix it.",
    "task": "I needed to have an honest, direct conversation with this associate about their performance — show them exactly where they were falling short, give them a specific plan to improve, and earn their trust in the process. I also needed a Plan B ready in case coaching didn't work.",
    "action": "I pulled them aside privately — not in front of the team. That was deliberate. Public feedback destroys trust; private feedback builds it. I walked through their individualized data together — not as an accusation, but as a diagnosis. I showed them exactly where they were losing time: 15-20 seconds per unit on one specific step in their packing process. ⚠️ VERIFY That's where the rate gap lived. I coached the corrected technique — I demonstrated it myself, had them practice it while I watched, and gave real-time feedback. I was straight with them: 'Here's where you are, here's where you need to be, here's how we get there together.' I had Plan B ready — if coaching didn't stick within a reasonable timeframe, I was prepared to escalate to a formal performance conversation. But I gave the coaching a real chance first. I checked in daily for a week — not just one conversation and walk away. Every day I stopped by their station, reviewed their numbers, and reinforced the technique correction. I made sure they knew I was invested in their success, not just monitoring their compliance.",
    "result": "Their rate improved from 45 UPH to 70+ UPH within a month — above average for the department. ⚠️ VERIFY They became one of the most engaged team members — volunteering for extra responsibilities, eventually mentoring others. Their quote to me: 'You're the first lead who showed me what to fix instead of just telling me I was slow.' I turned an attrition risk into a contributor.",
    "reflection": "This taught me the difference between feedback and coaching. Feedback is telling someone they're slow. Coaching is showing them the 15 seconds they're losing and how to get it back. One creates resentment. The other creates trust.",
    "standardWork": "Individualized performance reviews became part of my regular coaching rhythm. Every associate gets data-backed feedback on their actual bottleneck — not generic rate pressure. Conversations happen early, with data and a plan.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "What would you have done if the associate didn't improve after your coaching?",
      "How do you distinguish between a will problem and a skill problem?",
      "How did other associates react to seeing this person improve?",
      "What did Plan B look like specifically?"
    ]
  },
  {
    "id": "story-5",
    "storyNumber": 5,
    "shortLabel": "Floor Rescue",
    "title": "The Floor Rescue (10K to 7K Scanned Bucket Recovery)",
    "status": "Elite",
    "signalLane": "ownership",
    "categoryIds": [
      "ownership",
      "bias-for-action",
      "hire-and-develop-the-best",
      "earn-trust",
      "customer-obsession",
      "deliver-results",
      "adaptability",
      "plan-and-prioritize",
      "team-and-people-management"
    ],
    "keyNumbers": [
      "10,000 scanned bucket",
      "12,000 shutdown threshold",
      "3,000-unit recovery",
      "Under 7,000 after recovery",
      "Zero safety incidents"
    ],
    "primaryPrinciples": [
      "Ownership"
    ],
    "secondaryPrinciples": [
      "Bias for Action",
      "Hire and Develop the Best",
      "Earn Trust",
      "Customer Obsession"
    ],
    "situation": "During a high-volume day at MKC6 during peak, the shipping sorter jammed — a mechanical issue that stopped the flow of packages out of the building. Volume immediately started backing up into pack stations. The scanned bucket hit 10,000 units, and the threshold was 12,000 — at 12K, pick stops and the entire building shuts down. ⚠️ VERIFY My counterpart on the other side of the floor was overwhelmed. We were 2,000 units from a building-wide shutdown with no escalation plan for losing the sorter on a high-volume day.",
    "task": "I needed to prevent the scanned bucket from hitting 12K — which would have shut down pick and frozen the entire building — while keeping my own side running safely and helping my overwhelmed counterpart stabilize their side.",
    "action": "I called RME directly — I didn't wait to be told or wait for someone else to escalate. I confirmed I could add support to the other side without compromising my own process paths. Then I made a judgment call that only works if you've invested in developing your people: I gave my radio to an associate I'd been developing on the floor — someone I'd coached in real time during shifts and trusted to make decisions. I told them: watch for jams, help other AAs, call RME if needed. I trusted them to run my side because I'd built them to be ready for exactly this moment. I crossed over and took control alongside my counterpart. I positioned associates to downstack at the SLAM lines and keep volume moving. I positioned other associates to walk pack lines for safety — picking up downstacked packages that were creating floor hazards. I stayed until flow stabilized, RME fixed the sorter, and my counterpart had control.",
    "result": "Scanned bucket went from 10K to under 7K — a 3,000-unit recovery. ⚠️ VERIFY Pick never stopped. The building never shut down. Packers stayed safe the entire time — no interruptions, no safety incidents. My side held — the associate I gave the radio to ran it without a drop in performance. Packages got to customers on time.",
    "reflection": "Two things made this work: the decision to cross over and help — because the customer's packages don't care whose side of the floor they're on — and the fact that I'd already developed someone who could hold my side without me. The crisis proved that investing in people isn't just a development exercise — it's an operational insurance policy.",
    "standardWork": "I built a scanned bucket watch point — proactive downstack support triggers at a certain level instead of waiting until we're in crisis. I built it into the shift handoff template and created a quick-reference guide for mechanical issues: who to call, thresholds, first moves. We now catch at 7-8K instead of scrambling at 10K.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "How did you know the associate was ready to take the radio?",
      "What would you have done if your side started failing while you were helping the other side?",
      "How did you decide which associates to position where?",
      "What was the conversation with your counterpart like?"
    ]
  },
  {
    "id": "story-6",
    "storyNumber": 6,
    "shortLabel": "The Misread",
    "title": "The Misread (258 CPT Miss - Failure Story)",
    "status": "Elite failure story",
    "signalLane": "adaptability",
    "categoryIds": [
      "ownership",
      "learn-and-be-curious",
      "customer-obsession",
      "are-right-a-lot",
      "deliver-results",
      "adaptability",
      "learning-orientation",
      "interpretation-and-analysis"
    ],
    "keyNumbers": [
      "258 CPTs missed",
      "700 CPTs in pipeline",
      "First 30-minute buffer check created"
    ],
    "primaryPrinciples": [
      "Ownership"
    ],
    "secondaryPrinciples": [
      "Learn and Be Curious",
      "Customer Obsession",
      "Are Right A Lot"
    ],
    "situation": "Earlier in my time as a PA at MKC6, I was running a high-volume day with heavy CPT concentration. I checked the numbers at the department level — aggregate data showed we were tracking fine, around 700 CPTs in the pipeline. ⚠️ VERIFY The dwell lead was working it. On the surface, everything looked on pace.",
    "task": "I was responsible for ensuring all CPTs were met — every package out the door by its promised delivery window. The data said we were fine. I trusted it.",
    "action": "I looked at aggregate numbers instead of breaking them down by CPT window and process path. The department-level view masked a concentration problem — too many CPTs were stacked in one window, and the pace that looked fine at the aggregate level wasn't going to hold for that specific window. I didn't treat it with urgency because the surface data said fine. By the time I realized the backlog was building in one window, we were past the point of full recovery. I pulled people in, added support, prioritized the highest-risk packages — the same moves I'd normally make. But I was late. I was reacting instead of anticipating.",
    "result": "I missed 258 CPTs. 258 customers didn't get their packages when promised. ⚠️ VERIFY That number stuck with me. It wasn't a staffing problem. It wasn't a volume problem. It was a visibility problem — I was looking at the wrong level of data at the wrong time. I owned it completely. I didn't blame volume, I didn't blame the plan.",
    "reflection": "Aggregate numbers can lie to you. They smooth out the spikes that kill you. The time to act is when you still have time to recover, not when the numbers turn red. 258 customers paid the price for me learning that lesson. I made sure no one paid that price again.",
    "standardWork": "I built a buffer check into the first 30 minutes of every shift — CPT distribution versus pace, broken down by window, not just department aggregate. If the volume is front-loaded or concentrated in one window, I adjust staffing right then — not when the numbers turn red. I built a dashboard by CPT window, not just department level. I shared it with other PAs. That's why the 5,478/5,500 Prime Day SmartPac recovery worked — I caught it early because I'd been burned by not catching it.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "How did you communicate the 258 miss to leadership?",
      "Did this affect your credibility with your manager? How did you rebuild it?",
      "How do you know your buffer check actually prevents this from happening again?",
      "What's the difference between this failure and the Prime Day success?"
    ]
  },
  {
    "id": "story-7",
    "storyNumber": 7,
    "shortLabel": "Solo Operator",
    "title": "The Solo Operator (3 Months Running Singles Alone)",
    "status": "Elite",
    "signalLane": "leadership",
    "categoryIds": [
      "ownership",
      "deliver-results",
      "hire-and-develop-the-best",
      "think-big",
      "earn-trust",
      "bias-for-action",
      "dive-deep",
      "team-and-people-management",
      "plan-and-prioritize",
      "vision-and-strategy"
    ],
    "keyNumbers": [
      "Q3 2024",
      "40+ associates",
      "3 months solo",
      "3 of 5 PGs became PAs",
      "60% conversion rate"
    ],
    "primaryPrinciples": [
      "Ownership"
    ],
    "secondaryPrinciples": [
      "Deliver Results",
      "Hire and Develop the Best",
      "Think Big",
      "Earn Trust"
    ],
    "situation": "In Q3 2024, I was the sole Process Assistant running the Singles department on night shift at MKC6 — a department of 40+ associates — after our Area Manager transferred out and our only other PA resigned within the same two-week span. ⚠️ VERIFY I had no direct management support, no backfill timeline, and peak season planning was approaching. I was the only leader standing between a functioning department and a performance collapse.",
    "task": "I needed to maintain department performance against our rate targets, quality defect thresholds, and zero CPT misses — while simultaneously onboarding and developing new associates being funneled into Singles to fill headcount gaps. Every metric, every associate, every shift decision was mine to own.",
    "action": "I redesigned how the shift operated from day one. I built a daily operating rhythm — startup checklist, first-hour check, CPT review, scanned bucket monitoring, safety walks — that created structure where there had been none. I identified 5 associates with leadership potential and developed them as Process Guides, giving each one real ownership of a section of the floor — not just tasks, but decision-making authority. I coached them in real time: how to read the floor, make staffing decisions, handle escalations, run safety walks. I was building the next generation of leaders while running the department alone. I ran my own labor planning — staffed paths based on volume forecast and adjusted in real time as volume shifted throughout the shift. I handled all escalations directly: RME coordination, safety issues, associate concerns, CPT recovery. I kept a daily coaching cadence — individualized feedback for associates based on their data, not generic rate pressure. I communicated up to senior leadership on performance, barriers, and what I needed — I didn't absorb the risk silently. When I noticed specific process paths underperforming, I pulled the data, isolated the bottleneck, and intervened surgically — the same approach I use in every story because it works.",
    "result": "Over the three months I ran Singles solo, DPMO stayed steady — quality didn't slip. ⚠️ VERIFY Rate held at or above plan the entire stretch. ⚠️ VERIFY 3 of the 5 Process Guides I developed later became PAs — a 60% conversion rate. ⚠️ VERIFY I built the next generation of leaders while running the department alone. The systems I built — daily rhythm, PG framework, escalation process — stayed in place after leadership was filled. My Senior Ops Manager recognized what I did — senior leadership saw me operating at AM scope.",
    "reflection": "This experience rewired how I lead — I stopped managing within systems and started building the systems themselves, designing staffing models, coaching structures, and escalation frameworks that produced results without depending on a single point of leadership. The biggest shift wasn't operational — it was identity: I walked into MKC6 Singles as a Process Assistant executing someone else's plan and walked out as a leader who creates the plan others execute.\" ## What Changed \"Before this, I measured my value by how well I followed direction; after running a 40-person department solo for three months — holding rate at or above plan, maintaining quality, zero CPT misses, and developing three associates who earned PA promotions — I measure my value by what I leave behind. The incoming AM didn't inherit a department I kept alive; they inherited one I rebuilt stronger than it had ever been.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "What was the hardest decision you made during those 3 months?",
      "Did you ever make a call you regretted? What happened?",
      "How did you decide which 5 associates had leadership potential?",
      "What would you have done differently if you could do it again?",
      "How did you manage your own stress and workload during this period?"
    ]
  },
  {
    "id": "story-8",
    "storyNumber": 8,
    "shortLabel": "Wrong Box Deep Dive",
    "title": "The Wrong Box Deep Dive (DPMO Data Investigation)",
    "status": "Elite",
    "signalLane": "technical_depth",
    "categoryIds": [
      "dive-deep",
      "are-right-a-lot",
      "frugality",
      "ownership",
      "customer-obsession",
      "insist-on-the-highest-standards",
      "invent-and-simplify",
      "interpretation-and-analysis",
      "judgment-and-decision-making"
    ],
    "keyNumbers": [
      "October and November data",
      "70-71% invisible wrong-box errors",
      "Data captured for algorithm improvement"
    ],
    "primaryPrinciples": [
      "Dive Deep"
    ],
    "secondaryPrinciples": [
      "Frugality",
      "Ownership",
      "Are Right A Lot",
      "Customer Obsession"
    ],
    "situation": "DPMO was elevated in the Singles department at MKC6, and a significant portion of the cost impact was coming from boxes being upsized unnecessarily — wrong box adjustments. Nobody had dug into why this was happening. It was accepted as part of the process.",
    "task": "I needed to understand why wrong box errors were so high and determine whether the root cause was associate behavior, system recommendations, or a data capture problem.",
    "action": "I pulled two months of data — October and November — and analyzed the wrong box adjustments in detail. ⚠️ VERIFY What I found surprised me: 70-71% of wrong box adjustments weren't triggering Andon. ⚠️ VERIFY That meant Amazon was losing the data it needed to improve the box sizing algorithm. The system couldn't learn from errors it couldn't see. I broke the errors down by controllable versus uncontrollable defects. Most Singles errors were uncontrollable — the APP pack machine was recommending the wrong box size, and associates were following the recommendation correctly. The bigger issue wasn't the error itself — it was that even when associates followed procedure, the data wasn't being captured because Andon wasn't triggering. I built coaching frameworks so associates would use the problem solve menu every time and trigger Andon consistently — not to fix the immediate error, but to feed the data back into the system so Amazon could improve the algorithm.",
    "result": "We went from 70-71% of wrong box errors being invisible to the system to capturing them properly. ⚠️ VERIFY This gave Amazon the data to improve box sizing recommendations. It reduced cost from unnecessary upsizing. Associates understood the difference between controllable and uncontrollable defects — they knew what was on them and what wasn't, which improved engagement because they weren't being blamed for system errors.",
    "reflection": "If you're not capturing the data, you can't fix the problem. And if nobody's looking, nobody knows the data isn't being captured. The most impactful thing I did wasn't fixing the defect — it was making the defect visible to the system that could fix it at scale.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "How did you determine the 70-71% figure?",
      "What was the cost impact of the unnecessary upsizing?",
      "How did you get associates to consistently trigger Andon?",
      "Did the algorithm actually improve after you started capturing the data?"
    ]
  },
  {
    "id": "story-9",
    "storyNumber": 9,
    "shortLabel": "Station Health Improvements",
    "title": "Station Health Improvements (Equipment Redesign)",
    "status": "Strong - verify PPMix numbers",
    "signalLane": "problem_solving",
    "categoryIds": [
      "invent-and-simplify",
      "insist-on-the-highest-standards",
      "dive-deep",
      "customer-obsession",
      "collaboration",
      "plan-and-prioritize"
    ],
    "keyNumbers": [
      "60-70 UPH vs 85-100 UPH gap",
      "55-60% to 85-90% station health",
      "50-60 UPH to 70-80 UPH",
      "Expected 90% property damage reduction"
    ],
    "primaryPrinciples": [
      "Invent and Simplify"
    ],
    "secondaryPrinciples": [
      "Insist on the Highest Standards",
      "Dive Deep",
      "Customer Obsession"
    ],
    "situation": "In the Singles department at MKC6, I noticed a consistent performance gap between even and odd-numbered workstations. Even stations were producing 60-70 UPH on PPMix while odd stations were hitting 85-100 UPH on PPMix. ⚠️ VERIFY The gap had existed for a long time, but nobody had investigated why — it was just accepted that some stations were 'better' than others. Equipment overlap from dual tape machines was causing space constraints and property damage.",
    "task": "I needed to identify the root cause of the station performance gap and fix the physical environment so every station could produce at the same level.",
    "action": "I investigated the root cause and identified that dual tape machines on even-numbered stations were creating space constraints — associates didn't have enough workspace to move efficiently. The table orientation was also wrong, forcing associates into awkward positioning that slowed their process. I replaced the dual tape machines with single units, which immediately freed up workspace. I rotated the tables 180 degrees, giving associates more room to stage and pack. I worked with the 5S team on floor mat safety improvements to ensure the redesigned stations were safe and ergonomic. I documented the new station configuration as the standard and pushed it across the department.",
    "result": "Station health improved from 55-60% to 85-90%. ⚠️ VERIFY PPMix rates on the affected stations improved from 50-60 UPH to 70-80 UPH. ⚠️ VERIFY Expected to reduce property damage by 90%. ⚠️ VERIFY Expected to increase overall performance by 20%. ⚠️ VERIFY The performance gap between even and odd stations was eliminated.",
    "reflection": "Sometimes the biggest performance gains come from fixing the environment, not coaching the person. I had associates who were being coached on rate when the real problem was that their station was fighting them. Fix the workspace first, then coach the technique.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "How did you identify that the stations were the problem and not the associates?",
      "What was the cost of replacing the tape machines?",
      "Has the 90% property damage reduction been validated?",
      "How did you get approval for the equipment changes?"
    ]
  },
  {
    "id": "story-10",
    "storyNumber": 10,
    "shortLabel": "Continuous Learner",
    "title": "The Continuous Learner (5 Certs + MBA While Working Full-Time)",
    "status": "Strong",
    "signalLane": "technical_depth",
    "categoryIds": [
      "learn-and-be-curious",
      "hire-and-develop-the-best",
      "think-big",
      "learning-orientation",
      "interpretation-and-analysis"
    ],
    "keyNumbers": [
      "3.29 GPA",
      "MBA in Business Analytics",
      "Six professional certifications",
      "35% DPMO reduction"
    ],
    "primaryPrinciples": [
      "Learn and Be Curious"
    ],
    "secondaryPrinciples": [],
    "situation": "When I started at Amazon in 2019 as a Tier 1 associate, I had no formal education in business, data analytics, or process improvement. As I moved into the PA role and started owning department performance, I realized that the gap between where I was and where I wanted to be wasn't effort — it was knowledge. I needed formal frameworks to match the operational instincts I was building on the floor.",
    "task": "I needed to build a professional skill set in data analytics, project management, business intelligence, and process improvement — while working full-time on the floor at MKC6.",
    "action": "I enrolled at Southern New Hampshire University for a Bachelor of Science in Business Administration and Data Analytics. I built a disciplined schedule: full shifts at Amazon, then studying evenings and weekends without exception. While completing my degree, I earned five Google Professional Certificates — Data Analytics, Project Management, Business Intelligence, IT Support, and UX Design Foundations. I also earned my Lean Six Sigma Yellow Belt through Amazon. I didn't treat these as resume lines — I applied every skill back to my work within weeks of learning it. I used SQL and Python skills from my Data Analytics coursework to build faster, more accurate data analyses for quality audits. I applied Google Project Management frameworks to structure my process improvement initiatives more rigorously. The Six Sigma DMAIC methodology became the backbone of my Department Turnaround story.",
    "result": "I maintained a 3.29 GPA while working full-time. ⚠️ VERIFY I'm currently completing my MBA in Business Analytics. Every certification fed directly back into measurable results: the 4.1M unit throughput increase, the 35% DPMO reduction, the training overhaul — all of these were driven by skills I taught myself while working the floor. I went from a Tier 1 associate with no formal education to a PA operating at AM scope with a degree, an MBA in progress, and six professional certifications.",
    "reflection": "Learning isn't something you do when you have free time — it's something you make time for because the alternative is staying where you are. Every hour I spent studying was an investment in becoming the leader I wanted to be, not just the leader my current role required.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "How did you balance full-time work and full-time education?",
      "Give me a specific example of applying something you learned in class to the floor.",
      "Which certification had the biggest impact on your work",
      "How did you balance full-time work and full-time education?",
      "Give me a specific example of applying something you learned in class to the floor.",
      "Which certification had the biggest impact on your work and why?",
      "What's the hardest thing you've learned that changed how you operate?"
    ]
  },
  {
    "id": "story-11",
    "storyNumber": 11,
    "shortLabel": "Blackout",
    "title": "The Blackout (Safety Leadership Under Crisis)",
    "status": "Needs your details - do not use until verified",
    "signalLane": "ownership",
    "categoryIds": [
      "bias-for-action",
      "customer-obsession",
      "ownership",
      "earn-trust",
      "adaptability",
      "plan-and-prioritize",
      "team-and-people-management"
    ],
    "keyNumbers": [
      "40+ associates",
      "Zero safety incidents",
      "All associates accounted for within minutes"
    ],
    "primaryPrinciples": [
      "Bias for Action",
      "Customer Obsession"
    ],
    "secondaryPrinciples": [
      "Ownership",
      "Earn Trust"
    ],
    "situation": "During a shift at MKC6, the Singles department experienced a facility blackout while my Area Manager was absent. I was the only leader on the floor responsible for 40+ associates in an active packing environment with conveyors, machinery, and limited visibility.",
    "task": "I needed to ensure every associate was safe, account for all personnel, and determine whether and when operations could resume — all without direct management support and with no established playbook for this specific scenario.",
    "action": "I immediately stopped all packing operations and directed associates to stay at their stations to prevent movement-related injuries in low visibility. I conducted a headcount to confirm all associates were accounted for. I communicated to keep associates calm and informed. I contacted RME and facilities to get a status update on the power restoration timeline. Once I confirmed the outage would be brief, I used the downtime to conduct safety walkthroughs and brief associates on emergency procedures. When power restored, I verified all equipment was functioning before restarting operations and conducted a safety check at every station before associates resumed packing.",
    "result": "Zero safety incidents during the blackout. All associates were accounted for within minutes. Operations resumed without disruption once power was restored. This event was documented across multiple performance reviews as evidence of my ability to lead independently in crisis situations.",
    "reflection": "Safety leadership isn't about following a checklist — it's about owning the moment when there is no checklist. The associates looked to me because I was the only leader present, and I learned that calm, decisive action in a crisis earns more trust than months of normal operations.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live.",
      "⚠️ THIS STORY NEEDS YOUR SPECIFIC DETAILS — DO NOT USE UNTIL VERIFIED",
      "⚠️ VERIFY: Car — How long was the blackout? What did you do first? Did you contact anyone specific? Were there any near-misses? What was the most difficult decision you made during it?"
    ],
    "followUpQuestions": [
      "What was the first thing you did when the lights went out?",
      "How did you account for all associates?",
      "What would you have done if someone had been injured?",
      "How did you decide when it was safe to resume operations?"
    ]
  },
  {
    "id": "story-12",
    "storyNumber": 12,
    "shortLabel": "Field Sense Survey",
    "title": "The Field Sense Survey (Safety and Development System)",
    "status": "Strong",
    "signalLane": "leadership",
    "categoryIds": [
      "invent-and-simplify",
      "strive-to-be-earth-s-best-employer",
      "customer-obsession",
      "dive-deep",
      "influencing",
      "collaboration",
      "team-and-people-management"
    ],
    "keyNumbers": [
      "29% unfavorable to 20% unfavorable",
      "9-point SLI improvement",
      "Safety and development pipeline"
    ],
    "primaryPrinciples": [
      "Invent and Simplify",
      "Strive to be Earth's Best Employer"
    ],
    "secondaryPrinciples": [],
    "situation": "In mid-2023, our Singles department's SLI (Safety Leadership Index) score showed 29% unfavorable — meaning nearly a third of associates felt their safety concerns weren't being heard. ⚠️ VERIFY At the same time, associates had no formal way to express interest in cross-training or career development paths. Safety concerns were going unreported, and development opportunities were being distributed based on who the leader knew, not who was interested.",
    "task": "I needed to create a mechanism that gave associates a voice on both safety concerns and career development interests — something that didn't exist in our department.",
    "action": "I designed and built the Field Sense Survey from scratch — a dual-purpose tool that served two functions. The first section allowed associates to document and report safety concerns directly, creating a paper trail that I could escalate to leadership with data instead of anecdotes. The second section allowed associates to apply for different training paths — indirect roles, Process Guide, Learning Trainer — giving them agency in their own development. I rolled it out across the Singles department and personally walked associates through how to use it. I committed to reviewing every submission and following up within the week. I tracked the safety concerns that came in, categorized them by severity, and escalated the highest-priority items to leadership with specific recommendations. On the development side, I used the survey responses to build a pipeline of associates interested in growth — which fed directly into my coaching and PG development model.",
    "result": "The SLI score improved from 29% unfavorable to 20% unfavorable — a 9-percentage-point improvement. ⚠️ VERIFY Multiple safety hazards were identified and resolved through the survey that leadership hadn't been aware of. Associates used the survey to apply for indirect path trainings, which created a more equitable development pipeline. The survey became standard practice in Singles.",
    "reflection": "The associates closest to the work see the problems first — they just didn't have a channel to surface them. I didn't need a bigger budget or more headcount. I needed to build a system that turned associate observations into actionable data. The 9-point SLI improvement wasn't because I fixed safety — it was because associates finally felt heard.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "How did you get associates to actually fill out the survey?",
      "What was the most critical safety concern that came through?",
      "How did you handle a safety concern you disagreed with?",
      "How did you ensure the survey didn't become just another form people ignored?"
    ]
  },
  {
    "id": "story-13a",
    "storyNumber": 13,
    "storyCode": "13A",
    "shortLabel": "SmartPac Productivity",
    "title": "SmartPac Productivity Transformation",
    "status": "Elite",
    "signalLane": "problem_solving",
    "categoryIds": [
      "deliver-results",
      "dive-deep",
      "insist-on-the-highest-standards",
      "interpretation-and-analysis",
      "conscientiousness"
    ],
    "keyNumbers": [
      "420 UPH to 470-510 UPH",
      "50+ UPH improvement",
      "12% throughput increase",
      "Zero additional headcount"
    ],
    "primaryPrinciples": [
      "Deliver Results"
    ],
    "secondaryPrinciples": [
      "Dive Deep",
      "Insist on the Highest Standards"
    ],
    "situation": "In early 2023, SmartPac productivity in the Singles department at MKC6 had plateaued at 420 UPH — well below where it needed to be. ⚠️ VERIFY The line had been running at that pace long enough that it was accepted as normal. Nobody had dug into why SmartPac associates weren't hitting higher rates or what specific bottlenecks in the machine-paced workflow were costing us throughput.",
    "task": "I was given ownership of SmartPac productivity with a clear mandate: increase the rate. No additional headcount, no new equipment — I needed to find the gains inside the existing process and the existing people.",
    "action": "I started by observing the SmartPac packing sequence end-to-end, timing each step to identify where associates were losing seconds per unit. I found that the biggest time losses weren't in the packing itself — they were in the transitions: how associates staged items before scanning, how they positioned packages for the machine, and how they handled exceptions when the SmartPac machine flagged an error. I built a streamlined workflow that eliminated unnecessary movements in the staging and positioning steps. I then conducted daily Takt Time coachings at the SmartPac stations — standing with each associate, showing them the corrected technique, and having them practice it while I observed. I didn't coach to a generic standard — I coached to each associate's specific bottleneck based on what I saw in their individual process. I tracked progress weekly and adjusted my coaching focus based on who was improving and who was plateauing. For associates who plateaued, I changed my approach — sometimes it was a technique issue, sometimes it was a workspace setup issue, and I addressed each one differently.",
    "result": "SmartPac productivity increased from 420 UPH to 470-510 UPH — a sustained 50+ UPH improvement across the line. ⚠️ VERIFY That's a 12% increase in throughput with zero additional headcount and zero new equipment. The gains held because they were built into the workflow and reinforced through daily coaching, not dependent on me standing over anyone's shoulder.",
    "reflection": "Machine-paced processes trick you into thinking the machine is the constraint. It's not — it's the human interaction with the machine. The 50 UPH I found was hiding in the seconds between steps, not in the steps themselves.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "How did you identify which transitions were costing the most time?",
      "What did you do when an associate plateaued despite coaching?",
      "How did you sustain the gains after you moved on?",
      "What was the exception handling bottleneck specifically?"
    ]
  },
  {
    "id": "story-13b",
    "storyNumber": 13,
    "storyCode": "13B",
    "shortLabel": "Smalls Campaign",
    "title": "The Smalls Bottom Performer Campaign",
    "status": "Elite",
    "signalLane": "leadership",
    "categoryIds": [
      "hire-and-develop-the-best",
      "insist-on-the-highest-standards",
      "dive-deep",
      "team-and-people-management",
      "interpretation-and-analysis",
      "influencing"
    ],
    "keyNumbers": [
      "15 underperformers down to 7",
      "160 UPH goal",
      "199 to 214 UPH",
      "Only 3 below goal by Apr 2024"
    ],
    "primaryPrinciples": [
      "Hire and Develop the Best"
    ],
    "secondaryPrinciples": [
      "Insist on the Highest Standards",
      "Dive Deep"
    ],
    "situation": "In mid-2023, I had 15 Smalls packers in the Singles department at MKC6 performing below our 160 UPH goal rate. ⚠️ VERIFY Smalls is a manual packing process — associates are packing items into bags and jiffies, not boxes — so speed depends entirely on individual technique and station setup. These weren't new hires — many had been in the role for months but had never been coached individually on their specific bottlenecks. Previous coaching had been generic: 'you need to go faster.' Nobody had diagnosed why each associate was slow.",
    "task": "I set a SMART goal: bring every Smalls packer above 160 UPH by month-end. I needed to close the gap for 15 associates using individualized coaching and data — not write-ups, not pressure, not threats.",
    "action": "I pulled MTR data for every one of the 15 underperformers and ranked them by gap-to-goal. I started with the associates closest to 160 UPH because quick wins would build momentum and prove the approach worked. For each associate, I conducted a Takt Time observation — standing at their station, timing their process step by step, and identifying the exact moment where they were losing time. Some were losing 10-15 seconds per unit on item handling and bag selection. Others were losing time on scan-and-pack transitions — fumbling between scanning the item and placing it into the correct jiffy or bag. One associate was losing time because their station setup forced them to reach across their body for supplies — a workspace issue, not a skill issue. I fixed that station immediately. I built individualized coaching plans: each associate got a specific technique correction and a daily check-in where I measured their progress against their personal baseline — not the department average. I partnered with ELS to develop targeted training for the associates with the largest gaps. I tracked every associate's weekly UPH in MTR and adjusted my coaching focus based on who was responding and who needed a different approach.",
    "result": "Within one month, I cut the number of underperforming Smalls packers from 15 to 7 — more than half moved above the 160 UPH goal. ⚠️ VERIFY Overall Smalls rate increased from 199 to 214 UPH. ⚠️ VERIFY By April 2024, I had pushed 3 more above goal, leaving only 3 regular packers below 160 UPH — and those 3 were on active individualized coaching plans. ⚠️ VERIFY The approach became my standard coaching framework: diagnose the individual bottleneck first, then coach to that — never coach to a generic rate target.",
    "reflection": "Telling someone to 'go faster' is not coaching — it's noise. Real coaching starts with data: where are you losing time, why are you losing it, and what specific change will fix it? When I showed associates their own data and gave them one thing to fix, they fixed it. When I told them to 'hit 160,' nothing changed.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "What did you do with the 3 who were still below goal?",
      "How did you prioritize which associates to coach first?",
      "Did any associate resist the coaching?",
      "How is this different from what previous leaders did?"
    ]
  },
  {
    "id": "story-14",
    "storyNumber": 14,
    "shortLabel": "5S Standardization",
    "title": "The 5S Standardization Project",
    "status": "Strong",
    "signalLane": "problem_solving",
    "categoryIds": [
      "insist-on-the-highest-standards",
      "invent-and-simplify",
      "ownership",
      "collaboration",
      "plan-and-prioritize"
    ],
    "keyNumbers": [
      "All 4 corners",
      "Smalls and SmartPac",
      "Green SLIM station health",
      "Documented as SOW"
    ],
    "primaryPrinciples": [
      "Insist on the Highest Standards"
    ],
    "secondaryPrinciples": [
      "Invent and Simplify",
      "Ownership"
    ],
    "situation": "Across the Singles department at MKC6, workstation setups varied between shifts and between corners. There was no standard 5S configuration for Smalls or SmartPac stations, which meant associates were spending time adjusting their workspace at the start of every shift and station health was inconsistent.",
    "task": "I needed to create a single, standardized 5S setup for Smalls and SmartPac stations and push it to all 4 corners so every associate walked into the same workspace regardless of shift.",
    "action": "I partnered with the 5S team to audit every station configuration across all 4 corners. I identified the setup that produced the best station health scores and the fewest associate complaints, then documented it as the standard. I created a visual reference guide showing exactly how each station should be set up — supply positioning, scanner location, material staging. I personally walked each corner and set up the stations to the new standard, then trained the associates and other PAs on maintaining it. I built the 5S check into my daily startup routine so deviations were caught and corrected before the shift started — not discovered mid-shift when they were already costing rate.",
    "result": "The standardized 5S setup was successfully pushed to all 4 corners for both Smalls and SmartPac stations. Station readiness improved — I tracked station health in SLIM and maintained green status across stations. Associates no longer lost time adjusting workspaces at shift start. The standard was documented as SOW and maintained across shifts.",
    "reflection": "Standardization isn't glamorous, but it's the foundation everything else is built on. You can't coach an associate to hit rate if their workspace is fighting them. Fix the environment first, then coach the person.",
    "verificationNotes": [],
    "followUpQuestions": [
      "How did you get other PAs and shifts to maintain your standard?",
      "What happened when someone deviated from the standard?",
      "How did you measure the impact on rate?",
      "What was the biggest resistance you faced?"
    ]
  },
  {
    "id": "story-15",
    "storyNumber": 15,
    "shortLabel": "Training New Leadership",
    "title": "Training the New Leadership",
    "status": "Strong",
    "signalLane": "stakeholder_management",
    "categoryIds": [
      "earn-trust",
      "think-big",
      "hire-and-develop-the-best",
      "ownership",
      "collaboration",
      "influencing",
      "team-and-people-management",
      "vision-and-strategy"
    ],
    "keyNumbers": [
      "2023-2024 turnover window",
      "15+ performance reviews",
      "Multiple AMs and PAs onboarded"
    ],
    "primaryPrinciples": [
      "Earn Trust",
      "Think Big"
    ],
    "secondaryPrinciples": [
      "Hire and Develop the Best",
      "Ownership"
    ],
    "situation": "Throughout 2023-2024, MKC6 Singles experienced significant leadership turnover. Multiple new Area Managers and Process Assistants rotated into the department with limited knowledge of Singles processes, metrics, or associate dynamics. Each transition risked a performance dip because the new leader had to learn the department from scratch.",
    "task": "I needed to onboard each new leader quickly so the department didn't lose momentum — while technically being below them in the hierarchy.",
    "action": "I built a knowledge transfer approach for every new AM and PA. I walked them through our daily operating rhythm — startup checklist, first-hour check, CPT review, scanned bucket monitoring, safety walks. I shared my metric tracking methods, showed them how to read the SLIM dashboard for station health, and introduced them to the key associates they needed to know. I interchanged with AMs on startups throughout the week so they could observe how I ran the floor. I didn't wait to be asked — I proactively offered my knowledge because I knew the department's performance depended on the new leader getting up to speed fast. I was transparent about what was working and what wasn't — I didn't sugarcoat the department's challenges to make myself look good. I gave them the real picture so they could make informed decisions from day one.",
    "result": "Multiple AMs and PAs were successfully onboarded without performance dips. My Senior Ops Manager acknowledged that I had the ability to run Singles independently. Associates, peers, and AMs trusted me and looked to me for support — documented consistently across 15+ performance reviews. The systems I built — daily rhythm, coaching cadence, metric tracking — survived every leadership transition because they were documented and transferable.",
    "reflection": "Earning trust when you're technically below someone in the hierarchy requires a different approach — you lead with competence, not authority. The fastest way to earn a new manager's trust is to make them successful in their first week, not to prove how much you know.",
    "verificationNotes": [],
    "followUpQuestions": [
      "Tell me about a specific new AM you trained. What did you teach them?",
      "Was there ever a new AM who didn't want your help?",
      "How did you handle it when a new AM wanted to change something you'd built?",
      "Did you ever disagree with a new AM's approach?"
    ]
  },
  {
    "id": "story-16",
    "storyNumber": 16,
    "shortLabel": "Indirect Rotation Advocacy",
    "title": "The Indirect Rotation Advocacy",
    "status": "Needs tension detail",
    "signalLane": "stakeholder_management",
    "categoryIds": [
      "strive-to-be-earth-s-best-employer",
      "have-backbone-disagree-and-commit",
      "hire-and-develop-the-best",
      "ownership",
      "influencing",
      "team-and-people-management"
    ],
    "keyNumbers": [
      "Indirect Acid Feed",
      "Formal training pathway",
      "Deeper cross-trained bench"
    ],
    "primaryPrinciples": [
      "Strive to be Earth's Best Employer",
      "Have Backbone"
    ],
    "secondaryPrinciples": [
      "Hire and Develop the Best"
    ],
    "situation": "In Singles at MKC6, indirect roles — seal checker, water spider, problem solve — were assigned to the same associates repeatedly. Regular indirect associates were experiencing fatigue from doing the same role every shift, while newer associates had no opportunity to learn indirect paths and develop new skills. The system was burning out the experienced people and leaving the newer ones underdeveloped.",
    "task": "I needed to create a fair rotation system for indirect roles that reduced fatigue for regulars and opened growth opportunities for newer associates — even though changing the rotation meant short-term disruption to a system that was 'working.'",
    "action": "I built the Indirect Acid Feed — a structured rotation framework that documented which associates were trained on which indirect paths and created a fair schedule for rotating them. I created the Opportunities Field Sense Survey so associates could formally apply for indirect training they were interested in. I presented the case to my AM: the current system was burning out our best indirect associates and leaving newer ones underdeveloped. I advocated for the rotation even though it meant short-term disruption — pulling experienced indirects out of their comfort zone and putting newer associates into roles where they'd be slower initially.",
    "result": "The Indirect Acid Feed was completed and implemented. Associates had a formal pathway to apply for and receive indirect training. The rotation reduced fatigue complaints from regular indirects and created a deeper bench of cross-trained associates — which made the department more resilient when someone called out or transferred.",
    "reflection": "Advocating for associate well-being sometimes means accepting short-term inefficiency for long-term sustainability. A leader who only optimizes for today's rate will burn out the people who make tomorrow's rate possible.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live.",
      "⚠️ THIS STORY NEEDS TENSION DETAILS — DID YOUR AM PUSH BACK?",
      "⚠️ VERIFY: Car — Did your AM push back on this? Did they say 'we can't afford the disruption'? Was there real tension? That's what makes this a Have Backbone story. If there was no pushback, this story works for Best Employer but NOT for Have Backbone."
    ],
    "followUpQuestions": [
      "What was the short-term impact on productivity when you rotated experienced indirects out?",
      "How did the experienced indirects react to being rotated?",
      "How did you decide which newer associates were ready for indirect training?",
      "What would you have done if the rotation caused a significant performance drop?"
    ]
  },
  {
    "id": "story-17",
    "storyNumber": 17,
    "shortLabel": "Valley Staffing",
    "title": "Valley Staffing Strategy",
    "status": "Strong",
    "signalLane": "problem_solving",
    "categoryIds": [
      "frugality",
      "deliver-results",
      "are-right-a-lot",
      "judgment-and-decision-making",
      "interpretation-and-analysis",
      "plan-and-prioritize"
    ],
    "keyNumbers": [
      "Reduced unnecessary pack support hours",
      "Redeployed associates to direct paths",
      "Recognized for lean and mean staffing"
    ],
    "primaryPrinciples": [
      "Frugality"
    ],
    "secondaryPrinciples": [
      "Deliver Results",
      "Are Right A Lot"
    ],
    "situation": "In mid-2022, as I was developing my labor planning skills in Singles at MKC6, I noticed we were consistently overstaffing our pack support bucket during low-volume periods — spending associate hours where they weren't needed. The default approach was to staff support at a fixed headcount regardless of actual volume, which meant we were paying for idle capacity during valleys.",
    "task": "I needed to reduce unnecessary labor costs in the pack support bucket without compromising department performance or associate experience.",
    "action": "I implemented what I called 'valley staffing' — a strategy where I tracked volume patterns throughout the shift and staffed the pack support bucket based on actual demand rather than a fixed headcount. During valley periods when volume dipped, I reduced support staffing and redeployed those associates to direct packing paths where they could contribute to rate. I tracked indirect staffing daily to ensure we weren't spending hours where they weren't needed. I brought my data to syncs and offered insight on where we could cut back safely — showing the volume patterns that justified the reductions.",
    "result": "We reduced unnecessary hours in the pack support bucket while maintaining department performance. I was recognized for becoming more proficient at running 'lean and mean' based on volume and headcount. The approach was noted in my performance review as a cost-saving strategy that didn't sacrifice results.",
    "reflection": "Frugality isn't about cutting corners — it's about putting every hour where it creates the most value. The associates I redeployed from support to packing weren't losing work — they were doing more impactful work. Every hour should earn its place.",
    "verificationNotes": [],
    "followUpQuestions": [
      "How did you determine the right staffing level during valleys?",
      "What happened when volume spiked unexpectedly during a valley-staffed period?",
      "How much did this save in labor hours?",
      "Did any associates push back on being redeployed?"
    ]
  },
  {
    "id": "story-18",
    "storyNumber": 18,
    "shortLabel": "Recycling Initiative",
    "title": "The Recycling Initiative",
    "status": "Strong - verify numbers",
    "signalLane": "ownership",
    "categoryIds": [
      "success-and-scale-bring-broad-responsibility",
      "ownership",
      "invent-and-simplify",
      "frugality",
      "think-big",
      "vision-and-strategy"
    ],
    "keyNumbers": [
      "75% of metal wires recycled",
      "Rolled out to all 4 corners",
      "30% annual cost savings from broader program"
    ],
    "primaryPrinciples": [
      "Success and Scale Bring Broad Responsibility"
    ],
    "secondaryPrinciples": [
      "Ownership",
      "Invent and Simplify",
      "Frugality"
    ],
    "situation": "In the Singles department at MKC6, our packing process generated metal wires from poly bags and jam poles as waste every shift. These materials were being thrown into general waste — nobody had investigated whether they could be recycled. Amazon has clear sustainability commitments, but at the floor level, nobody was connecting daily operations to those goals.",
    "task": "I needed to determine whether the metal wire waste could be recycled, build a collection process that wouldn't slow down operations, and roll it out across the department.",
    "action": "I researched recycling options for the metal wire waste on my own initiative — this wasn't assigned to me and it wasn't in my job description. I reached out to the Non-Inventory team and coordinated with them on how to route the materials. I designed a collection process that fit into the existing workflow — associates could separate wires at their station without adding steps to their packing process. I built the plan, got buy-in from my AM, and piloted it in one corner. Once I confirmed it worked without impacting rate, I rolled it out to all 4 corners in Smalls. I ensured the process was documented as SOW so it would sustain across shifts and survive leadership transitions. I continued looking into Amazon's environmental compliance scorecard metrics to identify additional opportunities.",
    "result": "Approximately 75% of metal wires are now being recycled instead of going to general waste. ⚠️ VERIFY The recycling program was rolled out to all 4 corners and documented as standard operating work. The initiative contributed to 30% annual cost savings from the broader sustainability program. ⚠️ VERIFY I connected floor-level operations to Amazon's broader sustainability mission — proving that the biggest environmental wins come from the people closest to the process.",
    "reflection": "The biggest sustainability wins come from the people closest to the process — they see the waste every day. I didn't need executive approval to start researching. I needed curiosity and the willingness to own something outside my job description. If you wait for someone to assign you sustainability, you'll wait forever.",
    "verificationNotes": [
      "⚠️ Contains VERIFY tags in the source wording. Confirm every marked number, date, and claim before using live."
    ],
    "followUpQuestions": [
      "What was the exact tonnage or dollar figure of waste reduced?",
      "Who resisted this initiative and how did you overcome it?",
      "How did you measure the 75% recycling rate?",
      "How did you ensure associates actually separated the wires consistently?"
    ]
  }
] as const;

export const AMAZON_PREP_DECK_ROUTER: readonly PrepDeckRouterEntry[] = [
  {
    cue: "Customer, promise, package, on time",
    categoryId: "customer-obsession",
    primaryStoryIds: ["story-1", "story-2", "story-11"],
  },
  {
    cue: "Own it, outside your area, long term",
    categoryId: "ownership",
    primaryStoryIds: ["story-7", "story-5", "story-6"],
  },
  {
    cue: "Speed, risk, act fast, no guidance",
    categoryId: "bias-for-action",
    primaryStoryIds: ["story-2", "story-5", "story-11"],
  },
  {
    cue: "Results, deadline, goal, deliver",
    categoryId: "deliver-results",
    primaryStoryIds: ["story-1", "story-13a", "story-2"],
  },
  {
    cue: "Standards, quality, improve, not good enough",
    categoryId: "insist-on-the-highest-standards",
    primaryStoryIds: ["story-1", "story-14", "story-13b"],
  },
  {
    cue: "Develop, coach, feedback, grow people",
    categoryId: "hire-and-develop-the-best",
    primaryStoryIds: ["story-3", "story-13b", "story-15"],
  },
  {
    cue: "Trust, honest, hard conversation, respect",
    categoryId: "earn-trust",
    primaryStoryIds: ["story-4", "story-15", "story-3"],
  },
  {
    cue: "Data, root cause, dig in, analyze",
    categoryId: "dive-deep",
    primaryStoryIds: ["story-8", "story-13a", "story-13b"],
  },
  {
    cue: "Disagree, push back, defend, commit",
    categoryId: "have-backbone-disagree-and-commit",
    primaryStoryIds: ["story-16", "story-4"],
  },
  {
    cue: "Learn, mistake, curious, new skill",
    categoryId: "learn-and-be-curious",
    primaryStoryIds: ["story-10", "story-6"],
  },
  {
    cue: "Simple, innovate, fix, redesign",
    categoryId: "invent-and-simplify",
    primaryStoryIds: ["story-9", "story-12", "story-15"],
  },
  {
    cue: "Big picture, vision, scale, beyond your team",
    categoryId: "think-big",
    primaryStoryIds: ["story-7", "story-15", "story-1"],
  },
  {
    cue: "Decision, judgment, incomplete info",
    categoryId: "are-right-a-lot",
    primaryStoryIds: ["story-8", "story-17", "story-6"],
  },
  {
    cue: "Cost, waste, do more with less",
    categoryId: "frugality",
    primaryStoryIds: ["story-17", "story-18", "story-8"],
  },
  {
    cue: "Inclusive, best employer, overlooked people",
    categoryId: "strive-to-be-earth-s-best-employer",
    primaryStoryIds: ["story-12", "story-16", "story-3"],
  },
  {
    cue: "Sustainability, broader responsibility, company mission",
    categoryId: "success-and-scale-bring-broad-responsibility",
    primaryStoryIds: ["story-18", "story-1"],
  },
] as const;

export const AMAZON_PREP_DECK_PANEL_PLAN: readonly PrepDeckPanelPlanEntry[] = [
  {
    interviewer: "HRBP",
    categoryId: "earn-trust",
    primaryStoryId: "story-4",
    backupStoryId: "story-15",
  },
  {
    interviewer: "HRBP",
    categoryId: "have-backbone-disagree-and-commit",
    primaryStoryId: "story-16",
    backupStoryId: "story-4",
  },
  {
    interviewer: "HRBP",
    categoryId: "hire-and-develop-the-best",
    primaryStoryId: "story-3",
    backupStoryId: "story-13b",
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
    primaryStoryId: "story-2",
    backupStoryId: "story-5",
  },
  {
    interviewer: "L6",
    categoryId: "deliver-results",
    primaryStoryId: "story-1",
    backupStoryId: "story-13a",
  },
  {
    interviewer: "L6",
    categoryId: "insist-on-the-highest-standards",
    primaryStoryId: "story-1",
    backupStoryId: "story-14",
  },
  {
    interviewer: "L6",
    categoryId: "ownership",
    primaryStoryId: "story-7",
    backupStoryId: "story-5",
  },
  {
    interviewer: "L7",
    categoryId: "are-right-a-lot",
    primaryStoryId: "story-8",
    backupStoryId: "story-17",
  },
  {
    interviewer: "L7",
    categoryId: "dive-deep",
    primaryStoryId: "story-8",
    backupStoryId: "story-13a",
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
    primaryStoryId: "story-7",
    backupStoryId: "story-15",
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
  const reflection = [story.standardWork, story.whatChanged || story.reflection]
    .filter(Boolean)
    .join(" ");

  return {
    competency: story.signalLane,
    categoryTags: [...story.categoryIds],
    title: story.title,
    situation: story.situation,
    task: story.task,
    action: story.action,
    result: story.result,
    reflection,
    grounding: {
      kind: "prep_bank",
      sourceId: story.id,
      sourceLabel: `Story bank ${story.storyCode ?? story.storyNumber}: ${story.title}`,
      snapshot: {
        title: story.title,
        situation: story.situation,
        task: story.task,
        action: story.action,
        result: story.result,
        reflection,
      },
    },
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
