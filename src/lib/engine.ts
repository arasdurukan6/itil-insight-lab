import type {
  Question,
  ExamConfig,
  ExamMode,
  ExamSession,
  Difficulty,
  Category,
} from "./types";
import { SEED_QUESTIONS } from "./seed-questions";

// Generated pool is imported lazily so the dataset stays large.
import GENERATED from "./questions.generated.json";

const GEN: Question[] = (GENERATED as any[]).map((q, i) => ({
  ...q,
  id: q.id ?? `gen-${i}`,
}));

export const ALL_QUESTIONS: Question[] = [...SEED_QUESTIONS, ...GEN];

// --- RNG with seed (so refresh = new exam, but mid-exam refresh is stable) ---
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const EXAM_MODES: Record<
  ExamMode,
  { label: string; description: string; build: (opts?: any) => ExamConfig }
> = {
  practice: {
    label: "Practice Mode",
    description: "Immediate feedback after every question. Learn as you go.",
    build: () => ({
      mode: "practice",
      count: 20,
      showFeedback: true,
      difficultyMix: { easy: 0.35, medium: 0.4, hard: 0.2, trap: 0.05 },
    }),
  },
  real: {
    label: "Real Exam Simulation",
    description: "40 questions, 60 minutes, PeopleCert pass mark of 65%.",
    build: () => ({
      mode: "real",
      count: 40,
      durationSec: 60 * 60,
      showFeedback: false,
      difficultyMix: { easy: 0.25, medium: 0.45, hard: 0.2, trap: 0.1 },
    }),
  },
  ultra: {
    label: "Ultra Hard Mode",
    description: "Brutal: only hard questions and traps. No mercy.",
    build: () => ({
      mode: "ultra",
      count: 25,
      durationSec: 35 * 60,
      showFeedback: false,
      difficultyMix: { hard: 0.55, trap: 0.45 },
    }),
  },
  scenario: {
    label: "Scenario-Based Only",
    description: "Real-world scenarios that test applied judgement.",
    build: () => ({
      mode: "scenario",
      count: 20,
      showFeedback: true,
      difficultyMix: { medium: 0.5, hard: 0.35, trap: 0.15 },
    }),
  },
  weakness: {
    label: "Weakness Training",
    description: "Targets your weakest categories based on past results.",
    build: () => ({
      mode: "weakness",
      count: 20,
      showFeedback: true,
      difficultyMix: { easy: 0.2, medium: 0.4, hard: 0.3, trap: 0.1 },
    }),
  },
  timed: {
    label: "Timed Mode",
    description: "30 questions in 30 minutes. Build exam stamina.",
    build: () => ({
      mode: "timed",
      count: 30,
      durationSec: 30 * 60,
      showFeedback: false,
      difficultyMix: { easy: 0.3, medium: 0.4, hard: 0.2, trap: 0.1 },
    }),
  },
  quick: {
    label: "Quick 10",
    description: "A fast 10-question warm-up.",
    build: () => ({
      mode: "quick",
      count: 10,
      showFeedback: true,
      difficultyMix: { easy: 0.4, medium: 0.4, hard: 0.15, trap: 0.05 },
    }),
  },
  full: {
    label: "Full 40 Exam",
    description: "Full-length 40-question exam without the strict timer.",
    build: () => ({
      mode: "full",
      count: 40,
      showFeedback: false,
      difficultyMix: { easy: 0.3, medium: 0.4, hard: 0.2, trap: 0.1 },
    }),
  },
};

interface SelectOpts {
  weakCategories?: Category[];
  recentQuestionIds?: Set<string>;
}

export function pickQuestions(
  config: ExamConfig,
  rng: () => number,
  opts: SelectOpts = {},
): Question[] {
  const pool = ALL_QUESTIONS.filter(
    (q) => !config.categories || config.categories.includes(q.category),
  );

  // Bucket by difficulty
  const byDiff: Record<Difficulty, Question[]> = { easy: [], medium: [], hard: [], trap: [] };
  for (const q of pool) byDiff[q.difficulty].push(q);

  // Shuffle each bucket
  (Object.keys(byDiff) as Difficulty[]).forEach((d) => {
    byDiff[d] = shuffle(byDiff[d], rng);
  });

  // De-prioritise recent
  const recent = opts.recentQuestionIds ?? new Set<string>();
  (Object.keys(byDiff) as Difficulty[]).forEach((d) => {
    byDiff[d] = [
      ...byDiff[d].filter((q) => !recent.has(q.id)),
      ...byDiff[d].filter((q) => recent.has(q.id)),
    ];
  });

  const target = config.count;
  const mix = config.difficultyMix;
  const totalWeight = Object.values(mix).reduce((a: number, b: any) => a + (b ?? 0), 0) || 1;

  const picks: Question[] = [];
  const used = new Set<string>();

  const pickFrom = (d: Difficulty, n: number) => {
    for (const q of byDiff[d]) {
      if (picks.length >= target) return;
      if (used.has(q.id)) continue;
      // bias toward weak categories if requested
      picks.push(q);
      used.add(q.id);
      if (picks.filter((x) => x.difficulty === d).length >= n) return;
    }
  };

  (Object.entries(mix) as [Difficulty, number][]).forEach(([d, w]) => {
    if (!w) return;
    const n = Math.max(1, Math.round((w / totalWeight) * target));
    pickFrom(d, n);
  });

  // If weak categories provided, swap in extra weak-category questions
  if (opts.weakCategories?.length) {
    const weakSet = new Set(opts.weakCategories);
    const weakPool = shuffle(
      pool.filter((q) => weakSet.has(q.category) && !used.has(q.id)),
      rng,
    );
    const swapCount = Math.min(Math.floor(target * 0.5), weakPool.length);
    for (let i = 0; i < swapCount; i++) {
      // replace last non-weak entry
      const idx = picks.findIndex((p) => !weakSet.has(p.category));
      if (idx === -1) break;
      used.delete(picks[idx].id);
      picks[idx] = weakPool[i];
      used.add(weakPool[i].id);
    }
  }

  // Fill any remaining slots from the broader pool
  if (picks.length < target) {
    const rest = shuffle(pool.filter((q) => !used.has(q.id)), rng);
    for (const q of rest) {
      if (picks.length >= target) break;
      picks.push(q);
      used.add(q.id);
    }
  }

  return shuffle(picks.slice(0, target), rng);
}

export function buildSession(
  config: ExamConfig,
  opts: SelectOpts = {},
  seed: number = Date.now(),
): ExamSession {
  const rng = mulberry32(seed);
  const questions = pickQuestions(config, rng, opts);

  const wrapped = questions.map((q) => {
    const order = shuffle([0, 1, 2, 3], rng);
    return { q, choiceOrder: order };
  });

  return {
    id: `s-${seed.toString(36)}`,
    startedAt: Date.now(),
    config,
    questions: wrapped,
    answers: wrapped.map((w) => ({
      questionId: w.q.id,
      selectedIndex: null,
      correct: false,
      marked: false,
      timeMs: 0,
    })),
    currentIndex: 0,
    remainingSec: config.durationSec,
  };
}

export function scoreSession(session: ExamSession) {
  const total = session.questions.length;
  const correct = session.answers.filter((a) => a.correct).length;
  const scorePct = Math.round((correct / total) * 100);
  const passed = scorePct >= 65;

  const categoryStats: Record<string, { correct: number; total: number }> = {};
  const difficultyStats: Record<string, { correct: number; total: number }> = {};
  session.questions.forEach((w, i) => {
    const cat = w.q.category;
    const diff = w.q.difficulty;
    categoryStats[cat] = categoryStats[cat] || { correct: 0, total: 0 };
    categoryStats[cat].total += 1;
    if (session.answers[i].correct) categoryStats[cat].correct += 1;
    difficultyStats[diff] = difficultyStats[diff] || { correct: 0, total: 0 };
    difficultyStats[diff].total += 1;
    if (session.answers[i].correct) difficultyStats[diff].correct += 1;
  });

  const durationSec = Math.round(((session.finishedAt ?? Date.now()) - session.startedAt) / 1000);
  return { total, correct, scorePct, passed, categoryStats, difficultyStats, durationSec };
}

export const MOTIVATIONAL = [
  "Service value is co-created — and so is mastery. Keep going.",
  "Every wrong answer is a trap you'll spot on exam day.",
  "Focus on the principle, not the keyword. PeopleCert rewards understanding.",
  "Read each option twice. The trap is always in the second-most-tempting answer.",
  "Standard, normal, emergency — say it like a mantra.",
  "Utility = useful. Warranty = works well. You've got this.",
  "Optimize, THEN automate. Never the other way around.",
  "You're closer to certification than you were yesterday.",
];
