import type { ExamSession, UserProgress, ExamResultSummary } from "./types";

const K = {
  progress: "itil4.progress.v1",
  session: "itil4.session.v1",
  settings: "itil4.settings.v1",
};

export interface Settings {
  theme: "light" | "dark";
  sound: boolean;
  pressureMode: boolean;
}

const defaultProgress: UserProgress = {
  history: [],
  weakTopics: {},
  strongTopics: {},
  incorrectQuestionIds: [],
  streak: 0,
  lastExamDate: null,
  achievements: [],
  confidence: 50,
  readinessScore: 0,
  totalAnswered: 0,
  totalCorrect: 0,
};

const defaultSettings: Settings = {
  theme: "light",
  sound: true,
  pressureMode: false,
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const storage = {
  getProgress: () => safeGet<UserProgress>(K.progress, defaultProgress),
  setProgress: (p: UserProgress) => safeSet(K.progress, p),
  resetProgress: () => safeSet(K.progress, defaultProgress),

  getSession: () => safeGet<ExamSession | null>(K.session, null),
  setSession: (s: ExamSession | null) => safeSet(K.session, s),
  clearSession: () => {
    if (typeof window !== "undefined") localStorage.removeItem(K.session);
  },

  getSettings: () => safeGet<Settings>(K.settings, defaultSettings),
  setSettings: (s: Settings) => safeSet(K.settings, s),
};

export function addExamToHistory(result: ExamResultSummary) {
  const p = storage.getProgress();
  const newHistory = [result, ...p.history].slice(0, 50);

  const today = new Date(result.date).toDateString();
  const last = p.lastExamDate ? new Date(p.lastExamDate).toDateString() : null;
  const yesterday = new Date(Date.now() - 86400_000).toDateString();
  let streak = p.streak;
  if (last !== today) {
    streak = last === yesterday ? p.streak + 1 : 1;
  }

  // update topic stats
  const weak = { ...p.weakTopics };
  const strong = { ...p.strongTopics };
  for (const [cat, s] of Object.entries(result.categoryStats)) {
    const wrong = s.total - s.correct;
    weak[cat] = (weak[cat] || 0) + wrong;
    strong[cat] = (strong[cat] || 0) + s.correct;
  }

  const totalAnswered = p.totalAnswered + result.total;
  const totalCorrect = p.totalCorrect + result.correct;
  const accuracy = totalAnswered ? totalCorrect / totalAnswered : 0;
  const recent = newHistory.slice(0, 5);
  const recentAvg = recent.reduce((a, r) => a + r.scorePct, 0) / (recent.length || 1);
  const readiness = Math.round(Math.min(100, accuracy * 60 + (recentAvg / 100) * 40));
  const confidence = Math.round(Math.min(100, Math.max(0, p.confidence * 0.6 + result.scorePct * 0.4)));

  const achievements = new Set(p.achievements);
  if (totalAnswered >= 50) achievements.add("Half Century");
  if (totalAnswered >= 250) achievements.add("Quarter Master");
  if (result.scorePct === 100) achievements.add("Flawless");
  if (result.passed) achievements.add("First Pass");
  if (streak >= 3) achievements.add("On Fire");
  if (streak >= 7) achievements.add("Week Streak");
  if (newHistory.length >= 10) achievements.add("Veteran");

  storage.setProgress({
    ...p,
    history: newHistory,
    weakTopics: weak,
    strongTopics: strong,
    streak,
    lastExamDate: result.date,
    totalAnswered,
    totalCorrect,
    readinessScore: readiness,
    confidence,
    achievements: Array.from(achievements),
  });
}

export function recordIncorrect(ids: string[]) {
  const p = storage.getProgress();
  const set = new Set(p.incorrectQuestionIds);
  ids.forEach((id) => set.add(id));
  storage.setProgress({ ...p, incorrectQuestionIds: Array.from(set).slice(-500) });
}
