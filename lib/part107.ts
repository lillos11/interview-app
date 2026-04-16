export const PART107_STORAGE_KEY = 'part107-study-progress-v1';

export const PART107_TOPICS = [
  {
    id: 'regulations',
    title: 'Part 107 Regulations',
    description: 'Operating limits, pilot requirements, and required documentation.'
  },
  {
    id: 'airspace',
    title: 'Airspace',
    description: 'Airspace classes, charts, authorizations, and restrictions.'
  },
  {
    id: 'weather',
    title: 'Weather',
    description: 'METAR/TAF basics, local weather effects, and risk awareness.'
  },
  {
    id: 'loading_performance',
    title: 'Loading & Performance',
    description: 'Weight, balance, density altitude, and battery performance.'
  },
  {
    id: 'operations',
    title: 'Flight Operations',
    description: 'Preflight planning, visual line of sight, and safe procedures.'
  },
  {
    id: 'crew_resource',
    title: 'Crew Resource Management',
    description: 'Team communication, task assignment, and decision discipline.'
  },
  {
    id: 'emergencies',
    title: 'Emergency Procedures',
    description: 'Lost-link, flyaway, battery events, and contingency planning.'
  },
  {
    id: 'airport_ops',
    title: 'Airport Operations',
    description: 'Traffic awareness, communication habits, and runway safety.'
  }
] as const;

export type TopicId = (typeof PART107_TOPICS)[number]['id'];
export type AnswerIndex = 0 | 1 | 2 | 3;

export interface Flashcard {
  id: string;
  topic: TopicId;
  prompt: string;
  answer: string;
}

export interface PracticeQuestion {
  id: string;
  topic: TopicId;
  prompt: string;
  options: readonly [string, string, string, string];
  answerIndex: AnswerIndex;
  explanation: string;
  reference: string;
}

export interface QuestionStat {
  attempted: number;
  correct: number;
}

export interface TopicStat {
  attempted: number;
  correct: number;
}

export interface QuizRecord {
  date: string;
  correct: number;
  total: number;
}

export type TopicStats = Record<TopicId, TopicStat>;

export interface Part107Progress {
  version: 1;
  createdAt: string;
  updatedAt: string;
  streak: number;
  lastStudyDate: string | null;
  masteredCardIds: string[];
  questionStats: Record<string, QuestionStat>;
  topicStats: TopicStats;
  quizHistory: QuizRecord[];
}

export const PART107_FLASHCARDS: readonly Flashcard[] = [
  {
    id: 'reg-001',
    topic: 'regulations',
    prompt: 'Part 107 maximum groundspeed',
    answer: '100 mph (87 knots) groundspeed.'
  },
  {
    id: 'reg-002',
    topic: 'regulations',
    prompt: 'Part 107 maximum altitude rule',
    answer: '400 feet AGL, unless within 400 feet of a structure.'
  },
  {
    id: 'reg-003',
    topic: 'regulations',
    prompt: 'Minimum flight visibility for Part 107',
    answer: 'At least 3 statute miles.'
  },
  {
    id: 'reg-004',
    topic: 'regulations',
    prompt: 'Recurrent training cadence',
    answer: 'Complete FAA recurrent training every 24 calendar months.'
  },
  {
    id: 'reg-005',
    topic: 'regulations',
    prompt: 'Remote ID baseline requirement',
    answer: 'Broadcast Remote ID unless operating in an FAA-recognized exemption area.'
  },
  {
    id: 'air-001',
    topic: 'airspace',
    prompt: 'Part 107 in Class G airspace',
    answer: 'Allowed without prior ATC authorization unless restricted by NOTAM/TFR.'
  },
  {
    id: 'air-002',
    topic: 'airspace',
    prompt: 'Controlled airspace under Part 107',
    answer: 'Class B, C, D, and surface E require FAA authorization.'
  },
  {
    id: 'air-003',
    topic: 'airspace',
    prompt: 'LAANC purpose',
    answer: 'Provides near real-time authorization for eligible controlled airspace operations.'
  },
  {
    id: 'air-004',
    topic: 'airspace',
    prompt: 'What is a TFR?',
    answer: 'A Temporary Flight Restriction that can prohibit or limit UAS operations.'
  },
  {
    id: 'air-005',
    topic: 'airspace',
    prompt: 'Blue dashed ring on sectional chart',
    answer: 'Typically identifies Class D airspace around a towered airport.'
  },
  {
    id: 'wx-001',
    topic: 'weather',
    prompt: 'Small temperature-dew point spread means',
    answer: 'High chance of low clouds or fog as air approaches saturation.'
  },
  {
    id: 'wx-002',
    topic: 'weather',
    prompt: 'METAR wind group example 22012G20KT',
    answer: 'Wind from 220 degrees at 12 knots, gusting to 20 knots.'
  },
  {
    id: 'wx-003',
    topic: 'weather',
    prompt: 'Cumulonimbus clouds indicate',
    answer: 'Thunderstorm potential with severe turbulence, rain, and wind shear.'
  },
  {
    id: 'wx-004',
    topic: 'weather',
    prompt: 'Why monitor local weather trends before launch?',
    answer: 'To identify worsening conditions that can reduce control margin and visibility.'
  },
  {
    id: 'wx-005',
    topic: 'weather',
    prompt: 'Microburst hazard to small UAS',
    answer: 'Sudden downdraft and outflow winds can overpower the aircraft rapidly.'
  },
  {
    id: 'perf-001',
    topic: 'loading_performance',
    prompt: 'Effect of high density altitude',
    answer: 'Reduced propeller efficiency and climb performance.'
  },
  {
    id: 'perf-002',
    topic: 'loading_performance',
    prompt: 'Why payload mass matters',
    answer: 'More mass increases power demand and can shorten endurance.'
  },
  {
    id: 'perf-003',
    topic: 'loading_performance',
    prompt: 'Battery behavior in cold weather',
    answer: 'Voltage sag and reduced available energy can occur earlier.'
  },
  {
    id: 'perf-004',
    topic: 'loading_performance',
    prompt: 'Center of gravity check',
    answer: 'Improper CG can degrade stability and control authority.'
  },
  {
    id: 'perf-005',
    topic: 'loading_performance',
    prompt: 'Preflight change after adding payload',
    answer: 'Validate takeoff weight, control response, and expected flight time.'
  },
  {
    id: 'ops-001',
    topic: 'operations',
    prompt: 'Who has final authority for safe operation?',
    answer: 'The Remote Pilot in Command (RPIC).'
  },
  {
    id: 'ops-002',
    topic: 'operations',
    prompt: 'Visual line of sight requirement',
    answer: 'RPIC or VO must maintain unaided visual contact with the UAS.'
  },
  {
    id: 'ops-003',
    topic: 'operations',
    prompt: 'Right-of-way rule with manned aircraft',
    answer: 'UAS must always yield to all manned aircraft.'
  },
  {
    id: 'ops-004',
    topic: 'operations',
    prompt: 'Night operation baseline',
    answer: 'Night flight is allowed with compliant anti-collision lighting and proper training.'
  },
  {
    id: 'ops-005',
    topic: 'operations',
    prompt: 'Preflight action before each sortie',
    answer: 'Assess site hazards, airspace status, weather, and aircraft condition.'
  },
  {
    id: 'crm-001',
    topic: 'crew_resource',
    prompt: 'Core CRM principle',
    answer: 'Assign clear roles and maintain concise, closed-loop communication.'
  },
  {
    id: 'crm-002',
    topic: 'crew_resource',
    prompt: 'Sterile cockpit concept for UAS crew',
    answer: 'Limit nonessential conversation during critical phases of operation.'
  },
  {
    id: 'crm-003',
    topic: 'crew_resource',
    prompt: 'Best response to overload',
    answer: 'Slow down, delegate tasks, and use checklists.'
  },
  {
    id: 'crm-004',
    topic: 'crew_resource',
    prompt: 'Hazardous attitude: macho antidote',
    answer: 'Taking chances is foolish.'
  },
  {
    id: 'crm-005',
    topic: 'crew_resource',
    prompt: 'What should a visual observer report?',
    answer: 'Traffic, obstacles, and loss of visual conditions immediately.'
  },
  {
    id: 'emg-001',
    topic: 'emergencies',
    prompt: 'Lost-link contingency',
    answer: 'Follow prebriefed lost-link behavior and protect people/critical assets.'
  },
  {
    id: 'emg-002',
    topic: 'emergencies',
    prompt: 'Flyaway first priority',
    answer: 'Protect people: warn crew/public and clear the risk area.'
  },
  {
    id: 'emg-003',
    topic: 'emergencies',
    prompt: 'Battery thermal event sign',
    answer: 'Swelling, heat rise, or unusual odor requires immediate mitigation.'
  },
  {
    id: 'emg-004',
    topic: 'emergencies',
    prompt: 'Why practice emergency procedures?',
    answer: 'Prepared crews react faster with fewer errors under stress.'
  },
  {
    id: 'emg-005',
    topic: 'emergencies',
    prompt: 'Post-incident action',
    answer: 'Document details and file required reports when thresholds are met.'
  },
  {
    id: 'apt-001',
    topic: 'airport_ops',
    prompt: 'CTAF use near non-towered airports',
    answer: 'Monitor and announce position/intentions when appropriate.'
  },
  {
    id: 'apt-002',
    topic: 'airport_ops',
    prompt: 'Airport surface movement priority',
    answer: 'Avoid runways and movement areas unless operation is authorized and safe.'
  },
  {
    id: 'apt-003',
    topic: 'airport_ops',
    prompt: 'Towered airport concern',
    answer: 'Stay within approved limits and maintain situational awareness for manned traffic.'
  },
  {
    id: 'apt-004',
    topic: 'airport_ops',
    prompt: 'Runway approach path awareness',
    answer: 'Keep clear of final approach and departure corridors whenever possible.'
  },
  {
    id: 'apt-005',
    topic: 'airport_ops',
    prompt: 'Best chart habit before airport-area flight',
    answer: 'Review sectional symbols, frequencies, and nearby traffic patterns.'
  }
];

export const PART107_QUESTIONS: readonly PracticeQuestion[] = [
  {
    id: 'q-reg-001',
    topic: 'regulations',
    prompt: 'Under Part 107, what is the maximum allowed groundspeed for a small UAS?',
    options: ['70 knots', '87 knots', '100 knots', '120 knots'],
    answerIndex: 1,
    explanation: 'Part 107 limits small UAS groundspeed to 87 knots (100 mph).',
    reference: '14 CFR Part 107 operating limitations'
  },
  {
    id: 'q-reg-002',
    topic: 'regulations',
    prompt: 'What minimum flight visibility is required for standard Part 107 operations?',
    options: ['1 statute mile', '2 statute miles', '3 statute miles', '5 statute miles'],
    answerIndex: 2,
    explanation: 'Part 107 requires at least 3 statute miles of visibility.',
    reference: '14 CFR Part 107 weather minimums'
  },
  {
    id: 'q-reg-003',
    topic: 'regulations',
    prompt: 'How often must a Part 107 remote pilot complete recurrent training to remain current?',
    options: ['Every 12 months', 'Every 18 months', 'Every 24 calendar months', 'Every 36 months'],
    answerIndex: 2,
    explanation: 'FAA recurrent training is required every 24 calendar months.',
    reference: 'FAA remote pilot currency guidance'
  },
  {
    id: 'q-reg-004',
    topic: 'regulations',
    prompt: 'The standard maximum altitude under Part 107 is:',
    options: ['300 feet AGL', '400 feet AGL', '500 feet AGL', '600 feet AGL'],
    answerIndex: 1,
    explanation: 'The baseline altitude limit is 400 feet AGL unless near a structure with the allowed offset.',
    reference: '14 CFR Part 107 altitude limits'
  },
  {
    id: 'q-air-001',
    topic: 'airspace',
    prompt: 'Where can a remote pilot generally fly without prior ATC authorization (if no TFR/NOTAM restriction applies)?',
    options: ['Class B', 'Class C', 'Class D', 'Class G'],
    answerIndex: 3,
    explanation: 'Class G is uncontrolled airspace and typically does not require prior ATC authorization.',
    reference: 'FAA UAS airspace basics'
  },
  {
    id: 'q-air-002',
    topic: 'airspace',
    prompt: 'LAANC is primarily used to obtain what?',
    options: [
      'Drone registration waivers',
      'Near real-time controlled airspace authorization',
      'Remote ID waivers',
      'Night operation certificates'
    ],
    answerIndex: 1,
    explanation: 'LAANC provides streamlined authorization in eligible controlled airspace.',
    reference: 'FAA LAANC program guidance'
  },
  {
    id: 'q-air-003',
    topic: 'airspace',
    prompt: 'A blue dashed circle around an airport on a sectional chart usually indicates:',
    options: ['Class A airspace', 'Class B airspace', 'Class D airspace', 'Class G only zone'],
    answerIndex: 2,
    explanation: 'A blue dashed boundary is commonly used for Class D around towered airports.',
    reference: 'Sectional chart legend'
  },
  {
    id: 'q-air-004',
    topic: 'airspace',
    prompt: 'Before launching in controlled airspace, a remote pilot should first:',
    options: [
      'Call 911',
      'Check local weather only',
      'Obtain required authorization',
      'Increase payload to improve stability'
    ],
    answerIndex: 2,
    explanation: 'Authorization is required before operating in controlled airspace under Part 107.',
    reference: '14 CFR Part 107 airspace authorization requirements'
  },
  {
    id: 'q-wx-001',
    topic: 'weather',
    prompt: 'A very small spread between temperature and dew point suggests:',
    options: [
      'Strong clear-air turbulence only',
      'High likelihood of fog/low cloud formation',
      'No risk of moisture-related visibility issues',
      'Guaranteed severe icing'
    ],
    answerIndex: 1,
    explanation: 'As temperature nears dew point, saturation is likely and visibility can drop quickly.',
    reference: 'FAA weather theory fundamentals'
  },
  {
    id: 'q-wx-002',
    topic: 'weather',
    prompt: 'In METAR format, "22012G20KT" means:',
    options: [
      'Wind from 220 degrees at 20 knots, gusting to 12',
      'Wind variable at 12 to 20 knots',
      'Wind from 220 degrees at 12 knots, gusting to 20',
      'Crosswind limit is 20 knots'
    ],
    answerIndex: 2,
    explanation: 'METAR wind group format is direction/speed with gust value following G.',
    reference: 'FAA METAR decoding standards'
  },
  {
    id: 'q-wx-003',
    topic: 'weather',
    prompt: 'Cumulonimbus clouds should be treated as a warning for:',
    options: ['Stable smooth air', 'Thunderstorm activity', 'Improved GPS performance', 'Low humidity'],
    answerIndex: 1,
    explanation: 'Cumulonimbus development is associated with thunderstorms and hazardous turbulence.',
    reference: 'FAA thunderstorm hazard guidance'
  },
  {
    id: 'q-wx-004',
    topic: 'weather',
    prompt: 'A microburst is dangerous to UAS because it can:',
    options: [
      'Create sudden, strong downdrafts and wind shear',
      'Increase battery life unexpectedly',
      'Reduce all wind to calm',
      'Improve visibility to unlimited'
    ],
    answerIndex: 0,
    explanation: 'Microbursts can produce abrupt vertical and horizontal wind changes beyond control margins.',
    reference: 'FAA convective weather hazards'
  },
  {
    id: 'q-perf-001',
    topic: 'loading_performance',
    prompt: 'How does high density altitude typically affect small UAS performance?',
    options: [
      'Improves climb and hover efficiency',
      'No effect at all',
      'Reduces lift and propeller efficiency',
      'Automatically stabilizes the aircraft'
    ],
    answerIndex: 2,
    explanation: 'Thinner air reduces lift/thrust efficiency and can lower climb and hover margins.',
    reference: 'FAA performance factors guidance'
  },
  {
    id: 'q-perf-002',
    topic: 'loading_performance',
    prompt: 'After adding a new payload, what is the best immediate planning action?',
    options: [
      'Skip preflight to preserve battery',
      'Re-check weight, balance, and expected endurance',
      'Ignore manufacturer limits',
      'Fly only in sport mode'
    ],
    answerIndex: 1,
    explanation: 'Payload changes affect handling, power use, and endurance. Revalidation is required.',
    reference: 'FAA preflight and loading best practices'
  },
  {
    id: 'q-perf-003',
    topic: 'loading_performance',
    prompt: 'Cold-soaked batteries most often increase risk of:',
    options: [
      'Voltage sag and reduced usable capacity',
      'Unlimited thrust margin',
      'Improved cell balancing',
      'Automatic de-icing'
    ],
    answerIndex: 0,
    explanation: 'Low temperature can reduce battery output and trigger earlier low-voltage conditions.',
    reference: 'FAA and manufacturer battery safety guidance'
  },
  {
    id: 'q-perf-004',
    topic: 'loading_performance',
    prompt: 'A center-of-gravity problem can lead to:',
    options: [
      'Improved communication range',
      'Reduced control stability',
      'Faster firmware updates',
      'Automatic obstacle avoidance'
    ],
    answerIndex: 1,
    explanation: 'Improper CG can cause unstable flight and reduced control authority.',
    reference: 'FAA aircraft loading principles'
  },
  {
    id: 'q-ops-001',
    topic: 'operations',
    prompt: 'Who holds final responsibility for safe operation during a Part 107 mission?',
    options: ['Visual observer', 'Client', 'Remote Pilot in Command', 'Payload operator'],
    answerIndex: 2,
    explanation: 'The RPIC is ultimately responsible for operation safety and compliance.',
    reference: '14 CFR Part 107 responsibilities'
  },
  {
    id: 'q-ops-002',
    topic: 'operations',
    prompt: 'If a manned aircraft approaches your operating area, you should:',
    options: [
      'Maintain altitude and hold position',
      'Yield immediately and keep clear',
      'Accelerate to exit first',
      'Continue if you are below 400 feet'
    ],
    answerIndex: 1,
    explanation: 'Small UAS must always yield right-of-way to manned aircraft.',
    reference: 'Part 107 right-of-way rules'
  },
  {
    id: 'q-ops-003',
    topic: 'operations',
    prompt: 'Visual line of sight requirements are met when:',
    options: [
      'The aircraft is visible only on FPV feed',
      'Only telemetry is available',
      'RPIC or VO maintains unaided visual contact',
      'The mission area is geofenced'
    ],
    answerIndex: 2,
    explanation: 'Part 107 requires direct visual contact by RPIC and/or VO without relying solely on devices.',
    reference: 'Part 107 visual line of sight requirements'
  },
  {
    id: 'q-ops-004',
    topic: 'operations',
    prompt: 'A strong preflight risk-control habit is to:',
    options: [
      'Skip briefing to save time',
      'Launch first and evaluate later',
      'Review weather, airspace, and site hazards before takeoff',
      'Avoid checklists to reduce workload'
    ],
    answerIndex: 2,
    explanation: 'Structured preflight planning reduces preventable hazards and task saturation.',
    reference: 'FAA risk management principles'
  },
  {
    id: 'q-crm-001',
    topic: 'crew_resource',
    prompt: 'What CRM behavior most improves crew effectiveness?',
    options: [
      'Assume everyone understands the plan silently',
      'Use clear role assignments and verbal callouts',
      'Keep hazard concerns private',
      'Avoid readbacks'
    ],
    answerIndex: 1,
    explanation: 'Explicit role assignment and closed-loop communication reduce mistakes.',
    reference: 'FAA crew resource management guidance'
  },
  {
    id: 'q-crm-002',
    topic: 'crew_resource',
    prompt: 'The best antidote to the hazardous "macho" attitude is:',
    options: [
      'I can do it faster than anyone',
      'Taking chances is foolish',
      'Rules are for others',
      'Push through at all costs'
    ],
    answerIndex: 1,
    explanation: 'FAA ADM guidance identifies "taking chances is foolish" as the macho antidote.',
    reference: 'FAA aeronautical decision making attitudes'
  },
  {
    id: 'q-crm-003',
    topic: 'crew_resource',
    prompt: 'During critical phases, sterile cockpit discipline means:',
    options: [
      'All communication stops',
      'Only nonessential conversation is encouraged',
      'Only safety-relevant communication is allowed',
      'Only the client may speak'
    ],
    answerIndex: 2,
    explanation: 'Sterile communication avoids distractions during high workload tasks.',
    reference: 'CRM communication discipline'
  },
  {
    id: 'q-crm-004',
    topic: 'crew_resource',
    prompt: 'When workload spikes unexpectedly, the best first move is to:',
    options: [
      'Add more mission objectives',
      'Delegate, stabilize, and use a checklist',
      'Ignore the observer',
      'Fly farther to gain perspective'
    ],
    answerIndex: 1,
    explanation: 'Task delegation and checklist discipline reduce cognitive overload.',
    reference: 'FAA workload management guidance'
  },
  {
    id: 'q-emg-001',
    topic: 'emergencies',
    prompt: 'What should a pilot do first after a lost-link event starts?',
    options: [
      'Disable failsafe logic',
      'Follow the preplanned lost-link procedure',
      'Fly closer to crowds to regain signal',
      'Ignore telemetry warnings'
    ],
    answerIndex: 1,
    explanation: 'Lost-link response should follow prebriefed procedures to preserve safety margins.',
    reference: 'FAA contingency planning guidance'
  },
  {
    id: 'q-emg-002',
    topic: 'emergencies',
    prompt: 'If an aircraft flyaway threatens people, the top priority is to:',
    options: [
      'Protect people and clear the hazard area',
      'Keep recording video',
      'Continue the mission until battery warning',
      'Switch to a larger payload'
    ],
    answerIndex: 0,
    explanation: 'People and property protection comes first in emergency response decisions.',
    reference: 'FAA emergency response priorities'
  },
  {
    id: 'q-emg-003',
    topic: 'emergencies',
    prompt: 'Which sign can indicate potential battery thermal runaway?',
    options: [
      'Cool battery surface and normal odor',
      'Swelling with rapid heat increase',
      'Consistent voltage under load',
      'Balanced storage voltage'
    ],
    answerIndex: 1,
    explanation: 'Swelling and heat rise are warning signs requiring immediate action.',
    reference: 'Battery safety guidance'
  },
  {
    id: 'q-emg-004',
    topic: 'emergencies',
    prompt: 'Why run emergency drills before real missions?',
    options: [
      'To reduce crew readiness',
      'To increase improvisation under stress',
      'To speed and standardize response quality',
      'To bypass checklists'
    ],
    answerIndex: 2,
    explanation: 'Practice drills improve reaction time and execution accuracy under pressure.',
    reference: 'FAA safety culture best practices'
  },
  {
    id: 'q-apt-001',
    topic: 'airport_ops',
    prompt: 'Near a non-towered airport, CTAF is useful for:',
    options: [
      'Ordering weather reports only',
      'Announcing and monitoring traffic intentions',
      'Replacing airspace authorization',
      'Bypassing right-of-way rules'
    ],
    answerIndex: 1,
    explanation: 'CTAF supports traffic awareness and deconfliction at non-towered fields.',
    reference: 'Airport traffic communication practices'
  },
  {
    id: 'q-apt-002',
    topic: 'airport_ops',
    prompt: 'A practical runway safety rule for UAS teams is to:',
    options: [
      'Cross movement areas whenever convenient',
      'Keep clear of runways and approach/departure paths',
      'Assume manned pilots can always see your drone',
      'Rely only on obstacle sensors'
    ],
    answerIndex: 1,
    explanation: 'Avoiding runways and approach corridors reduces collision risk with manned traffic.',
    reference: 'Airport surface safety practices'
  },
  {
    id: 'q-apt-003',
    topic: 'airport_ops',
    prompt: 'At towered airports, the pilot should:',
    options: [
      'Operate first, request approval later',
      'Stay within approved limits and monitor for traffic conflicts',
      'Ignore charted frequencies',
      'Assume LAANC is optional in controlled areas'
    ],
    answerIndex: 1,
    explanation: 'Compliance with approved parameters and active traffic awareness are essential.',
    reference: 'Controlled airport UAS operation guidance'
  },
  {
    id: 'q-apt-004',
    topic: 'airport_ops',
    prompt: 'Before flying near airports, sectional chart review helps identify:',
    options: [
      'Only battery chemistry',
      'Airspace boundaries and traffic-relevant features',
      'Mobile signal strength only',
      'Client contract terms'
    ],
    answerIndex: 1,
    explanation: 'Charts provide critical context for airspace and airport-area risk controls.',
    reference: 'FAA chart interpretation fundamentals'
  }
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNonNegativeWholeNumber(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function toDateOrNull(dateKey: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function differenceInDays(left: Date, right: Date): number {
  const leftMidnight = new Date(left.getFullYear(), left.getMonth(), left.getDate());
  const rightMidnight = new Date(right.getFullYear(), right.getMonth(), right.getDate());
  const dayMillis = 1000 * 60 * 60 * 24;
  return Math.round((leftMidnight.getTime() - rightMidnight.getTime()) / dayMillis);
}

function createTopicStats(): TopicStats {
  return PART107_TOPICS.reduce((result, topic) => {
    result[topic.id] = { attempted: 0, correct: 0 };
    return result;
  }, {} as TopicStats);
}

function touchStudyDate(progress: Part107Progress, now: Date): Part107Progress {
  const todayKey = toDateKey(now);
  if (progress.lastStudyDate === todayKey) {
    return {
      ...progress,
      updatedAt: now.toISOString()
    };
  }

  let nextStreak = 1;
  if (progress.lastStudyDate) {
    const previousDate = toDateOrNull(progress.lastStudyDate);
    if (previousDate) {
      const gap = differenceInDays(now, previousDate);
      nextStreak = gap === 1 ? progress.streak + 1 : 1;
    }
  }

  return {
    ...progress,
    updatedAt: now.toISOString(),
    lastStudyDate: todayKey,
    streak: nextStreak
  };
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createInitialPart107Progress(now: Date = new Date()): Part107Progress {
  const iso = now.toISOString();
  return {
    version: 1,
    createdAt: iso,
    updatedAt: iso,
    streak: 0,
    lastStudyDate: null,
    masteredCardIds: [],
    questionStats: {},
    topicStats: createTopicStats(),
    quizHistory: []
  };
}

export function coercePart107Progress(value: unknown): Part107Progress | null {
  if (!isRecord(value)) {
    return null;
  }

  const fallback = createInitialPart107Progress();
  const now = new Date();

  const createdAt =
    typeof value.createdAt === 'string' && !Number.isNaN(new Date(value.createdAt).getTime())
      ? value.createdAt
      : fallback.createdAt;
  const updatedAt =
    typeof value.updatedAt === 'string' && !Number.isNaN(new Date(value.updatedAt).getTime())
      ? value.updatedAt
      : now.toISOString();

  const streak = toNonNegativeWholeNumber(value.streak);
  const lastStudyDate =
    typeof value.lastStudyDate === 'string' && toDateOrNull(value.lastStudyDate) ? value.lastStudyDate : null;

  const masteredCardIds = Array.isArray(value.masteredCardIds)
    ? value.masteredCardIds.filter((entry): entry is string => typeof entry === 'string')
    : [];

  const questionStats: Record<string, QuestionStat> = {};
  if (isRecord(value.questionStats)) {
    for (const [questionId, statsValue] of Object.entries(value.questionStats)) {
      if (!isRecord(statsValue)) {
        continue;
      }
      const attempted = toNonNegativeWholeNumber(statsValue.attempted);
      const correct = Math.min(attempted, toNonNegativeWholeNumber(statsValue.correct));
      questionStats[questionId] = { attempted, correct };
    }
  }

  const topicStats = createTopicStats();
  if (isRecord(value.topicStats)) {
    for (const topic of PART107_TOPICS) {
      const rawTopic = value.topicStats[topic.id];
      if (!isRecord(rawTopic)) {
        continue;
      }
      const attempted = toNonNegativeWholeNumber(rawTopic.attempted);
      const correct = Math.min(attempted, toNonNegativeWholeNumber(rawTopic.correct));
      topicStats[topic.id] = { attempted, correct };
    }
  }

  const quizHistory: QuizRecord[] = Array.isArray(value.quizHistory)
    ? value.quizHistory
        .filter((entry): entry is Record<string, unknown> => isRecord(entry))
        .map((entry) => {
          const total = Math.max(1, toNonNegativeWholeNumber(entry.total));
          const correct = Math.min(total, toNonNegativeWholeNumber(entry.correct));
          const dateValue =
            typeof entry.date === 'string' && !Number.isNaN(new Date(entry.date).getTime())
              ? entry.date
              : now.toISOString();
          return {
            date: dateValue,
            correct,
            total
          };
        })
        .slice(0, 30)
    : [];

  return {
    version: 1,
    createdAt,
    updatedAt,
    streak,
    lastStudyDate,
    masteredCardIds: [...new Set(masteredCardIds)],
    questionStats,
    topicStats,
    quizHistory
  };
}

export function accuracyPercent(correct: number, attempted: number): number {
  if (attempted <= 0) {
    return 0;
  }
  return Math.round((correct / attempted) * 100);
}

export function getOverallScore(progress: Part107Progress): { attempted: number; correct: number } {
  let attempted = 0;
  let correct = 0;
  for (const topic of PART107_TOPICS) {
    attempted += progress.topicStats[topic.id].attempted;
    correct += progress.topicStats[topic.id].correct;
  }
  return { attempted, correct };
}

export function getWeakestTopic(progress: Part107Progress): TopicId | null {
  let weakest: TopicId | null = null;
  let weakestAccuracy = Number.POSITIVE_INFINITY;
  let weakestAttempted = Number.POSITIVE_INFINITY;

  for (const topic of PART107_TOPICS) {
    const stats = progress.topicStats[topic.id];
    if (stats.attempted <= 0) {
      continue;
    }
    const accuracy = stats.correct / stats.attempted;
    if (accuracy < weakestAccuracy || (accuracy === weakestAccuracy && stats.attempted < weakestAttempted)) {
      weakest = topic.id;
      weakestAccuracy = accuracy;
      weakestAttempted = stats.attempted;
    }
  }

  return weakest;
}

export function getTopicById(topicId: TopicId): (typeof PART107_TOPICS)[number] {
  return PART107_TOPICS.find((topic) => topic.id === topicId) ?? PART107_TOPICS[0];
}

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const pool = [...items];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
  }
  return pool;
}

export function pickPracticeQuestions(
  questionBank: readonly PracticeQuestion[],
  count: number,
  topics: readonly TopicId[],
  random: () => number = Math.random
): PracticeQuestion[] {
  const topicSet = new Set(topics.length ? topics : PART107_TOPICS.map((topic) => topic.id));
  const eligible = questionBank.filter((question) => topicSet.has(question.topic));
  const randomized = shuffle(eligible, random);
  const safeCount = Math.max(1, Math.min(Math.round(count), randomized.length));
  return randomized.slice(0, safeCount);
}

export function recordQuestionAnswer(
  progress: Part107Progress,
  question: PracticeQuestion,
  selectedIndex: number,
  now: Date = new Date()
): { progress: Part107Progress; isCorrect: boolean } {
  const normalizedChoice = Math.max(0, Math.min(3, Math.round(selectedIndex)));
  const isCorrect = normalizedChoice === question.answerIndex;

  const existingQuestionStat = progress.questionStats[question.id] ?? { attempted: 0, correct: 0 };
  const updatedQuestionStat: QuestionStat = {
    attempted: existingQuestionStat.attempted + 1,
    correct: existingQuestionStat.correct + (isCorrect ? 1 : 0)
  };

  const existingTopicStat = progress.topicStats[question.topic];
  const updatedTopicStat: TopicStat = {
    attempted: existingTopicStat.attempted + 1,
    correct: existingTopicStat.correct + (isCorrect ? 1 : 0)
  };

  const updatedProgress: Part107Progress = {
    ...progress,
    questionStats: {
      ...progress.questionStats,
      [question.id]: updatedQuestionStat
    },
    topicStats: {
      ...progress.topicStats,
      [question.topic]: updatedTopicStat
    }
  };

  return {
    progress: touchStudyDate(updatedProgress, now),
    isCorrect
  };
}

export function recordQuizResult(
  progress: Part107Progress,
  correct: number,
  total: number,
  now: Date = new Date()
): Part107Progress {
  const normalizedTotal = Math.max(1, toNonNegativeWholeNumber(total));
  const normalizedCorrect = Math.min(normalizedTotal, toNonNegativeWholeNumber(correct));
  const nextHistory: QuizRecord[] = [
    {
      date: now.toISOString(),
      correct: normalizedCorrect,
      total: normalizedTotal
    },
    ...progress.quizHistory
  ].slice(0, 30);

  return touchStudyDate(
    {
      ...progress,
      quizHistory: nextHistory
    },
    now
  );
}

export function toggleMasteredCard(
  progress: Part107Progress,
  cardId: string,
  mastered: boolean,
  now: Date = new Date()
): Part107Progress {
  const current = new Set(progress.masteredCardIds);
  if (mastered) {
    current.add(cardId);
  } else {
    current.delete(cardId);
  }

  return touchStudyDate(
    {
      ...progress,
      masteredCardIds: [...current]
    },
    now
  );
}
