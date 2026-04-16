export type SupportedLanguage = 'spanish' | 'french' | 'german' | 'japanese';
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface Phrase {
  id: string;
  topic: string;
  target: string;
  translation: string;
  transliteration?: string;
}

export interface ScheduledCard {
  phraseId: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  dueAt: string;
  lastReviewedAt: string | null;
  lapses: number;
}

export interface SessionRecord {
  date: string;
  minutes: number;
  cardsReviewed: number;
  quizCorrect: number;
  speechScore: number;
  xpEarned: number;
}

export interface LanguageProgress {
  deck: ScheduledCard[];
  xp: number;
  minutes: number;
  streak: number;
  lastStudiedDate: string | null;
  sessions: SessionRecord[];
  bestQuizStreak: number;
  bestSpeechScore: number;
}

export interface LearnerProfile {
  version: 1;
  selectedLanguage: SupportedLanguage;
  dailyGoalMinutes: number;
  nativeLanguage: string;
  languages: Record<SupportedLanguage, LanguageProgress>;
}

export interface StudyEvent {
  minutes?: number;
  cardsReviewed?: number;
  quizCorrect?: number;
  speechScore?: number;
  xpEarned?: number;
}

export interface LanguageDefinition {
  name: string;
  levelPath: string[];
  voiceLocale: string;
  recognitionLocale: string;
  phrases: Phrase[];
}

export interface QuizRound {
  phraseId: string;
  options: string[];
  correctOption: string;
}

export const STORAGE_KEY = 'fluentpath:v1';

export const LANGUAGE_CATALOG: Record<SupportedLanguage, LanguageDefinition> = {
  spanish: {
    name: 'Spanish',
    levelPath: ['A1 Basics', 'A2 Daily Life', 'B1 Conversations', 'B2 Fluency Drills'],
    voiceLocale: 'es-ES',
    recognitionLocale: 'es-ES',
    phrases: [
      { id: 'es-01', topic: 'Basics', target: 'Hola, mucho gusto', translation: 'Hello, nice to meet you' },
      { id: 'es-02', topic: 'Travel', target: '¿Dónde está la estación?', translation: 'Where is the station?' },
      { id: 'es-03', topic: 'Food', target: 'Quiero una mesa para dos', translation: 'I want a table for two' },
      { id: 'es-04', topic: 'Time', target: '¿Qué hora es?', translation: 'What time is it?' },
      { id: 'es-05', topic: 'Social', target: '¿Cómo te fue hoy?', translation: 'How did your day go?' },
      { id: 'es-06', topic: 'Work', target: 'Necesito enviar este informe', translation: 'I need to send this report' },
      { id: 'es-07', topic: 'Health', target: 'Me duele la cabeza', translation: 'My head hurts' },
      { id: 'es-08', topic: 'Learning', target: 'Estoy practicando todos los dias', translation: 'I am practicing every day' },
      { id: 'es-09', topic: 'Family', target: 'Mi hermana vive cerca', translation: 'My sister lives nearby' },
      { id: 'es-10', topic: 'Planning', target: 'Vamos a empezar a las nueve', translation: 'We are going to start at nine' },
      { id: 'es-11', topic: 'Shopping', target: '¿Cuanto cuesta esto?', translation: 'How much does this cost?' },
      { id: 'es-12', topic: 'Confidence', target: 'Puedo hablar con mas confianza', translation: 'I can speak with more confidence' }
    ]
  },
  french: {
    name: 'French',
    levelPath: ['A1 Basics', 'A2 Daily Life', 'B1 Conversations', 'B2 Fluency Drills'],
    voiceLocale: 'fr-FR',
    recognitionLocale: 'fr-FR',
    phrases: [
      { id: 'fr-01', topic: 'Basics', target: 'Bonjour, enchante', translation: 'Hello, nice to meet you' },
      { id: 'fr-02', topic: 'Travel', target: 'Ou est la gare?', translation: 'Where is the station?' },
      { id: 'fr-03', topic: 'Food', target: 'Je voudrais une table pour deux', translation: 'I would like a table for two' },
      { id: 'fr-04', topic: 'Time', target: 'Quelle heure est-il?', translation: 'What time is it?' },
      { id: 'fr-05', topic: 'Social', target: 'Comment s est passe ta journee?', translation: 'How did your day go?' },
      { id: 'fr-06', topic: 'Work', target: 'Je dois envoyer ce rapport', translation: 'I need to send this report' },
      { id: 'fr-07', topic: 'Health', target: 'J ai mal a la tete', translation: 'My head hurts' },
      { id: 'fr-08', topic: 'Learning', target: 'Je pratique tous les jours', translation: 'I practice every day' },
      { id: 'fr-09', topic: 'Family', target: 'Ma soeur habite tout pres', translation: 'My sister lives very close' },
      { id: 'fr-10', topic: 'Planning', target: 'On commence a neuf heures', translation: 'We start at nine o clock' },
      { id: 'fr-11', topic: 'Shopping', target: 'Combien ca coute?', translation: 'How much does it cost?' },
      { id: 'fr-12', topic: 'Confidence', target: 'Je parle avec plus d assurance', translation: 'I speak with more confidence' }
    ]
  },
  german: {
    name: 'German',
    levelPath: ['A1 Basics', 'A2 Daily Life', 'B1 Conversations', 'B2 Fluency Drills'],
    voiceLocale: 'de-DE',
    recognitionLocale: 'de-DE',
    phrases: [
      { id: 'de-01', topic: 'Basics', target: 'Hallo, freut mich', translation: 'Hello, nice to meet you' },
      { id: 'de-02', topic: 'Travel', target: 'Wo ist der Bahnhof?', translation: 'Where is the station?' },
      { id: 'de-03', topic: 'Food', target: 'Ich mochte einen Tisch fur zwei', translation: 'I would like a table for two' },
      { id: 'de-04', topic: 'Time', target: 'Wie spat ist es?', translation: 'What time is it?' },
      { id: 'de-05', topic: 'Social', target: 'Wie war dein Tag?', translation: 'How was your day?' },
      { id: 'de-06', topic: 'Work', target: 'Ich muss diesen Bericht senden', translation: 'I need to send this report' },
      { id: 'de-07', topic: 'Health', target: 'Ich habe Kopfschmerzen', translation: 'I have a headache' },
      { id: 'de-08', topic: 'Learning', target: 'Ich ube jeden Tag', translation: 'I practice every day' },
      { id: 'de-09', topic: 'Family', target: 'Meine Schwester wohnt in der Nahe', translation: 'My sister lives nearby' },
      { id: 'de-10', topic: 'Planning', target: 'Wir beginnen um neun Uhr', translation: 'We begin at nine o clock' },
      { id: 'de-11', topic: 'Shopping', target: 'Wie viel kostet das?', translation: 'How much does that cost?' },
      { id: 'de-12', topic: 'Confidence', target: 'Ich spreche selbstbewusster', translation: 'I speak more confidently' }
    ]
  },
  japanese: {
    name: 'Japanese',
    levelPath: ['A1 Basics', 'A2 Daily Life', 'B1 Conversations', 'B2 Fluency Drills'],
    voiceLocale: 'ja-JP',
    recognitionLocale: 'ja-JP',
    phrases: [
      { id: 'ja-01', topic: 'Basics', target: 'hajimemashite', translation: 'Nice to meet you', transliteration: 'ha-ji-me-ma-shi-te' },
      { id: 'ja-02', topic: 'Travel', target: 'eki wa doko desu ka', translation: 'Where is the station?', transliteration: 'e-ki wa do-ko de-su ka' },
      { id: 'ja-03', topic: 'Food', target: 'futari desu', translation: 'Table for two', transliteration: 'fu-ta-ri de-su' },
      { id: 'ja-04', topic: 'Time', target: 'ima nanji desu ka', translation: 'What time is it?', transliteration: 'i-ma nan-ji de-su ka' },
      { id: 'ja-05', topic: 'Social', target: 'kyou wa dou deshita ka', translation: 'How was your day?', transliteration: 'kyo-u wa do-u de-shi-ta ka' },
      { id: 'ja-06', topic: 'Work', target: 'kono repooto o okuru hitsuyou ga arimasu', translation: 'I need to send this report', transliteration: 'ko-no re-po-o-to o o-ku-ru hi-tsu-yo-u ga a-ri-ma-su' },
      { id: 'ja-07', topic: 'Health', target: 'atama ga itai desu', translation: 'My head hurts', transliteration: 'a-ta-ma ga i-ta-i de-su' },
      { id: 'ja-08', topic: 'Learning', target: 'mainichi renshuu shiteimasu', translation: 'I practice every day', transliteration: 'ma-i-ni-chi ren-shuu shi-te-i-ma-su' },
      { id: 'ja-09', topic: 'Family', target: 'ane wa chikaku ni sundeimasu', translation: 'My sister lives nearby', transliteration: 'a-ne wa chi-ka-ku ni sun-de-i-ma-su' },
      { id: 'ja-10', topic: 'Planning', target: 'kuji ni hajimemasu', translation: 'We start at nine', transliteration: 'ku-ji ni ha-ji-me-ma-su' },
      { id: 'ja-11', topic: 'Shopping', target: 'ikura desu ka', translation: 'How much is it?', transliteration: 'i-ku-ra de-su ka' },
      { id: 'ja-12', topic: 'Confidence', target: 'motto jishin o motte hanasemasu', translation: 'I can speak with more confidence', transliteration: 'mot-to ji-shin o mot-te ha-na-se-ma-su' }
    ]
  }
};

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function previousDateKey(dateKey: string): string {
  const parts = dateKey.split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const localDate = new Date(year, month - 1, day);
  localDate.setDate(localDate.getDate() - 1);
  return toDateKey(localDate);
}

function createInitialDeck(language: SupportedLanguage, now: Date = new Date()): ScheduledCard[] {
  return LANGUAGE_CATALOG[language].phrases.map((phrase) => ({
    phraseId: phrase.id,
    repetitions: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    dueAt: now.toISOString(),
    lastReviewedAt: null,
    lapses: 0
  }));
}

function createLanguageProgress(language: SupportedLanguage, now: Date = new Date()): LanguageProgress {
  return {
    deck: createInitialDeck(language, now),
    xp: 0,
    minutes: 0,
    streak: 0,
    lastStudiedDate: null,
    sessions: [],
    bestQuizStreak: 0,
    bestSpeechScore: 0
  };
}

export function createInitialProfile(now: Date = new Date()): LearnerProfile {
  return {
    version: 1,
    selectedLanguage: 'spanish',
    dailyGoalMinutes: 25,
    nativeLanguage: 'English',
    languages: {
      spanish: createLanguageProgress('spanish', now),
      french: createLanguageProgress('french', now),
      german: createLanguageProgress('german', now),
      japanese: createLanguageProgress('japanese', now)
    }
  };
}

function isSupportedLanguage(value: string): value is SupportedLanguage {
  return value === 'spanish' || value === 'french' || value === 'german' || value === 'japanese';
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function coerceCard(value: unknown): ScheduledCard | null {
  if (!isObject(value)) {
    return null;
  }

  const phraseId = typeof value.phraseId === 'string' ? value.phraseId : null;
  const repetitions = typeof value.repetitions === 'number' ? value.repetitions : null;
  const intervalDays = typeof value.intervalDays === 'number' ? value.intervalDays : null;
  const easeFactor = typeof value.easeFactor === 'number' ? value.easeFactor : null;
  const dueAt = typeof value.dueAt === 'string' ? value.dueAt : null;
  const lastReviewedAt = typeof value.lastReviewedAt === 'string' || value.lastReviewedAt === null ? value.lastReviewedAt : null;
  const lapses = typeof value.lapses === 'number' ? value.lapses : null;

  if (
    phraseId === null ||
    repetitions === null ||
    intervalDays === null ||
    easeFactor === null ||
    dueAt === null ||
    lapses === null
  ) {
    return null;
  }

  return {
    phraseId,
    repetitions,
    intervalDays,
    easeFactor,
    dueAt,
    lastReviewedAt,
    lapses
  };
}

function coerceSession(value: unknown): SessionRecord | null {
  if (!isObject(value)) {
    return null;
  }

  const date = typeof value.date === 'string' ? value.date : null;
  const minutes = typeof value.minutes === 'number' ? value.minutes : null;
  const cardsReviewed = typeof value.cardsReviewed === 'number' ? value.cardsReviewed : null;
  const quizCorrect = typeof value.quizCorrect === 'number' ? value.quizCorrect : null;
  const speechScore = typeof value.speechScore === 'number' ? value.speechScore : null;
  const xpEarned = typeof value.xpEarned === 'number' ? value.xpEarned : null;

  if (date === null || minutes === null || cardsReviewed === null || quizCorrect === null || speechScore === null || xpEarned === null) {
    return null;
  }

  return {
    date,
    minutes,
    cardsReviewed,
    quizCorrect,
    speechScore,
    xpEarned
  };
}

function coerceLanguageProgress(value: unknown, language: SupportedLanguage, now: Date): LanguageProgress {
  if (!isObject(value)) {
    return createLanguageProgress(language, now);
  }

  const deck = Array.isArray(value.deck) ? value.deck.map(coerceCard).filter((card): card is ScheduledCard => card !== null) : [];
  const sessions = Array.isArray(value.sessions)
    ? value.sessions.map(coerceSession).filter((session): session is SessionRecord => session !== null)
    : [];

  const xp = typeof value.xp === 'number' ? value.xp : 0;
  const minutes = typeof value.minutes === 'number' ? value.minutes : 0;
  const streak = typeof value.streak === 'number' ? value.streak : 0;
  const lastStudiedDate = typeof value.lastStudiedDate === 'string' || value.lastStudiedDate === null ? value.lastStudiedDate : null;
  const bestQuizStreak = typeof value.bestQuizStreak === 'number' ? value.bestQuizStreak : 0;
  const bestSpeechScore = typeof value.bestSpeechScore === 'number' ? value.bestSpeechScore : 0;

  if (deck.length === 0) {
    return {
      ...createLanguageProgress(language, now),
      xp,
      minutes,
      streak,
      lastStudiedDate,
      sessions,
      bestQuizStreak,
      bestSpeechScore
    };
  }

  return {
    deck,
    xp,
    minutes,
    streak,
    lastStudiedDate,
    sessions,
    bestQuizStreak,
    bestSpeechScore
  };
}

export function coerceProfile(value: unknown, now: Date = new Date()): LearnerProfile | null {
  if (!isObject(value)) {
    return null;
  }

  if (value.version !== 1) {
    return null;
  }

  const selectedLanguage = typeof value.selectedLanguage === 'string' && isSupportedLanguage(value.selectedLanguage)
    ? value.selectedLanguage
    : null;
  if (selectedLanguage === null) {
    return null;
  }

  const dailyGoalMinutes = typeof value.dailyGoalMinutes === 'number' ? value.dailyGoalMinutes : 25;
  const nativeLanguage = typeof value.nativeLanguage === 'string' ? value.nativeLanguage : 'English';
  const rawLanguages = isObject(value.languages) ? value.languages : {};

  return {
    version: 1,
    selectedLanguage,
    dailyGoalMinutes,
    nativeLanguage,
    languages: {
      spanish: coerceLanguageProgress(rawLanguages.spanish, 'spanish', now),
      french: coerceLanguageProgress(rawLanguages.french, 'french', now),
      german: coerceLanguageProgress(rawLanguages.german, 'german', now),
      japanese: coerceLanguageProgress(rawLanguages.japanese, 'japanese', now)
    }
  };
}

export function getDueCards(progress: LanguageProgress, now: Date = new Date()): ScheduledCard[] {
  return progress.deck.filter((card) => new Date(card.dueAt).getTime() <= now.getTime());
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function calculateInterval(card: ScheduledCard, rating: ReviewRating): { repetitions: number; intervalDays: number; easeFactor: number; lapses: number } {
  if (rating === 'again') {
    return {
      repetitions: 0,
      intervalDays: 1,
      easeFactor: clamp(card.easeFactor - 0.2, 1.3, 3.0),
      lapses: card.lapses + 1
    };
  }

  if (rating === 'hard') {
    return {
      repetitions: card.repetitions + 1,
      intervalDays: Math.max(1, Math.round(Math.max(card.intervalDays, 1) * 1.2)),
      easeFactor: clamp(card.easeFactor - 0.15, 1.3, 3.0),
      lapses: card.lapses
    };
  }

  if (rating === 'good') {
    const repetitions = card.repetitions + 1;
    const intervalDays =
      repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.max(3, Math.round(Math.max(card.intervalDays, 1) * card.easeFactor));

    return {
      repetitions,
      intervalDays,
      easeFactor: clamp(card.easeFactor + 0.03, 1.3, 3.0),
      lapses: card.lapses
    };
  }

  const repetitions = card.repetitions + 1;
  const intervalDays =
    repetitions === 1 ? 2 : repetitions === 2 ? 4 : Math.max(4, Math.round(Math.max(card.intervalDays, 1) * card.easeFactor * 1.3));

  return {
    repetitions,
    intervalDays,
    easeFactor: clamp(card.easeFactor + 0.1, 1.3, 3.0),
    lapses: card.lapses
  };
}

export function reviewScheduledCard(card: ScheduledCard, rating: ReviewRating, now: Date = new Date()): ScheduledCard {
  const next = calculateInterval(card, rating);

  return {
    ...card,
    repetitions: next.repetitions,
    intervalDays: next.intervalDays,
    easeFactor: next.easeFactor,
    dueAt: addDays(now, next.intervalDays).toISOString(),
    lastReviewedAt: now.toISOString(),
    lapses: next.lapses
  };
}

export function nextStreak(currentStreak: number, lastStudiedDate: string | null, todayDate: string): number {
  if (lastStudiedDate === null) {
    return 1;
  }
  if (lastStudiedDate === todayDate) {
    return currentStreak;
  }
  if (lastStudiedDate === previousDateKey(todayDate)) {
    return currentStreak + 1;
  }
  return 1;
}

export function applyStudyEvent(progress: LanguageProgress, event: StudyEvent, now: Date = new Date()): LanguageProgress {
  const minutes = Math.max(0, event.minutes ?? 0);
  const cardsReviewed = Math.max(0, event.cardsReviewed ?? 0);
  const quizCorrect = Math.max(0, event.quizCorrect ?? 0);
  const speechScore = clamp(event.speechScore ?? 0, 0, 100);

  const computedXp = cardsReviewed * 4 + quizCorrect * 6 + Math.round(speechScore / 8) + minutes * 2;
  const xpEarned = Math.max(0, event.xpEarned ?? computedXp);
  const date = toDateKey(now);
  const streak = nextStreak(progress.streak, progress.lastStudiedDate, date);

  const sessionIndex = progress.sessions.findIndex((session) => session.date === date);
  const sessions = [...progress.sessions];

  if (sessionIndex >= 0) {
    const existing = sessions[sessionIndex];
    sessions[sessionIndex] = {
      ...existing,
      minutes: existing.minutes + minutes,
      cardsReviewed: existing.cardsReviewed + cardsReviewed,
      quizCorrect: existing.quizCorrect + quizCorrect,
      speechScore: Math.max(existing.speechScore, speechScore),
      xpEarned: existing.xpEarned + xpEarned
    };
  } else {
    sessions.push({
      date,
      minutes,
      cardsReviewed,
      quizCorrect,
      speechScore,
      xpEarned
    });
  }

  return {
    ...progress,
    xp: progress.xp + xpEarned,
    minutes: progress.minutes + minutes,
    streak,
    lastStudiedDate: date,
    sessions
  };
}

export function reviewCard(progress: LanguageProgress, phraseId: string, rating: ReviewRating, now: Date = new Date()): LanguageProgress {
  const deck = progress.deck.map((card) => (card.phraseId === phraseId ? reviewScheduledCard(card, rating, now) : card));
  const ratingXp: Record<ReviewRating, number> = {
    again: 2,
    hard: 4,
    good: 8,
    easy: 10
  };

  return applyStudyEvent(
    {
      ...progress,
      deck
    },
    {
      minutes: 2,
      cardsReviewed: 1,
      xpEarned: ratingXp[rating]
    },
    now
  );
}

export function countMasteredCards(progress: LanguageProgress): number {
  return progress.deck.filter((card) => card.repetitions >= 4 || card.intervalDays >= 14).length;
}

function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function speechMatchScore(expected: string, spoken: string): number {
  const normalizedExpected = normalize(expected);
  const normalizedSpoken = normalize(spoken);

  if (normalizedExpected.length === 0 || normalizedSpoken.length === 0) {
    return 0;
  }

  if (normalizedSpoken === normalizedExpected) {
    return 100;
  }

  const expectedWords = normalizedExpected.split(' ');
  const spokenWords = normalizedSpoken.split(' ');
  const spokenSet = new Set(spokenWords);

  const wordMatches = expectedWords.reduce((total, word) => (spokenSet.has(word) ? total + 1 : total), 0);
  const ratio = wordMatches / expectedWords.length;

  let score = Math.round(ratio * 100);
  if (normalizedSpoken.includes(normalizedExpected)) {
    score = Math.max(score, 95);
  }

  return clamp(score, 0, 100);
}

function shuffle<T>(items: T[], randomFn: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(randomFn() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function pickUniquePhrases(phrases: Phrase[], size: number, randomFn: () => number): Phrase[] {
  if (phrases.length <= size) {
    return [...phrases];
  }
  return shuffle(phrases, randomFn).slice(0, size);
}

export function createQuizRound(language: SupportedLanguage, randomFn: () => number = Math.random): QuizRound {
  const phraseList = LANGUAGE_CATALOG[language].phrases;
  const selectedPhrase = phraseList[Math.floor(randomFn() * phraseList.length)];

  const distractors = pickUniquePhrases(
    phraseList.filter((phrase) => phrase.id !== selectedPhrase.id),
    3,
    randomFn
  );

  const options = shuffle([selectedPhrase.translation, ...distractors.map((phrase) => phrase.translation)], randomFn);

  return {
    phraseId: selectedPhrase.id,
    options,
    correctOption: selectedPhrase.translation
  };
}
