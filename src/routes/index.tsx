import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  Brain,
  Clock,
  Flame,
  Gauge,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppHeader } from "@/components/app-header";
import { storage } from "@/lib/storage";
import { EXAM_MODES, ALL_QUESTIONS } from "@/lib/engine";
import type { ExamMode, UserProgress } from "@/lib/types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ITIL 4 Foundation Mock Exam Trainer" },
      {
        name: "description",
        content:
          "Advanced ITIL 4 Foundation practice exams with adaptive difficulty, scenario questions, and PeopleCert-style traps.",
      },
    ],
  }),
  component: Dashboard,
});

const MODE_ICONS: Record<ExamMode, React.ReactNode> = {
  practice: <BookOpen className="h-4 w-4" />,
  real: <Trophy className="h-4 w-4" />,
  ultra: <Flame className="h-4 w-4" />,
  scenario: <Brain className="h-4 w-4" />,
  weakness: <Target className="h-4 w-4" />,
  timed: <Clock className="h-4 w-4" />,
  quick: <Zap className="h-4 w-4" />,
  full: <Gauge className="h-4 w-4" />,
};

function Dashboard() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(storage.getProgress());
  }, []);

  const accuracy = useMemo(() => {
    if (!progress || progress.totalAnswered === 0) return 0;
    return Math.round((progress.totalCorrect / progress.totalAnswered) * 100);
  }, [progress]);

  const topWeak = useMemo(() => {
    if (!progress) return [] as { name: string; v: number }[];
    return Object.entries(progress.weakTopics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, v]) => ({ name, v }));
  }, [progress]);

  const topStrong = useMemo(() => {
    if (!progress) return [] as { name: string; v: number }[];
    return Object.entries(progress.strongTopics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, v]) => ({ name, v }));
  }, [progress]);

  const historyChart = useMemo(() => {
    if (!progress) return [];
    return [...progress.history]
      .slice(0, 10)
      .reverse()
      .map((h, i) => ({ name: `#${i + 1}`, score: h.scorePct }));
  }, [progress]);

  const categoryChart = useMemo(() => {
    if (!progress) return [];
    const cats = new Set([
      ...Object.keys(progress.weakTopics),
      ...Object.keys(progress.strongTopics),
    ]);
    return Array.from(cats).map((c) => ({
      name: c.length > 14 ? c.slice(0, 12) + "…" : c,
      correct: progress.strongTopics[c] || 0,
      wrong: progress.weakTopics[c] || 0,
    }));
  }, [progress]);

  function startMode(mode: ExamMode) {
    navigate({ to: "/exam", search: { mode } });
  }

  if (!progress) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/20">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="mr-1 h-3 w-3" /> {ALL_QUESTIONS.length}+ question pool
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready for the ITIL 4 Foundation exam?
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Realistic, randomised mock exams with adaptive difficulty, PeopleCert traps, and full
              explanations. Every refresh = a brand new exam.
            </p>
          </div>
          <Button size="lg" onClick={() => startMode("real")} className="shadow-lg">
            <Trophy className="mr-2 h-4 w-4" />
            Start Real Exam
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={<Activity className="h-4 w-4" />}
            label="Accuracy"
            value={`${accuracy}%`}
            sub={`${progress.totalCorrect}/${progress.totalAnswered} answers`}
          />
          <StatCard
            icon={<Gauge className="h-4 w-4" />}
            label="Readiness"
            value={`${progress.readinessScore}%`}
            sub={progress.readinessScore >= 75 ? "Exam-ready" : "Keep practicing"}
          />
          <StatCard
            icon={<Flame className="h-4 w-4" />}
            label="Streak"
            value={`${progress.streak}d`}
            sub={progress.streak >= 3 ? "On fire" : "Build a streak"}
          />
          <StatCard
            icon={<Trophy className="h-4 w-4" />}
            label="Exams"
            value={`${progress.history.length}`}
            sub={progress.achievements.length ? `${progress.achievements.length} badges` : "Just starting"}
          />
        </div>

        {/* Modes */}
        <h2 className="text-lg font-semibold mb-3">Choose an exam mode</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {(Object.keys(EXAM_MODES) as ExamMode[]).map((mode) => {
            const m = EXAM_MODES[mode];
            return (
              <button
                key={mode}
                onClick={() => startMode(mode)}
                className="group relative text-left rounded-xl border bg-card p-4 transition hover:border-primary hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 mb-2 text-primary">
                  {MODE_ICONS[mode]}
                  <span className="text-sm font-semibold text-foreground">{m.label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                <span className="absolute right-3 top-3 text-[10px] uppercase tracking-wider text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                  Start →
                </span>
              </button>
            );
          })}
        </div>

        {/* Charts + topics */}
        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Recent scores</CardTitle>
            </CardHeader>
            <CardContent className="h-56">
              {historyChart.length === 0 ? (
                <EmptyHint text="Finish your first exam to see your score history." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyChart}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--color-primary))" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="hsl(var(--color-primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" fontSize={11} stroke="currentColor" opacity={0.6} />
                    <YAxis domain={[0, 100]} fontSize={11} stroke="currentColor" opacity={0.6} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#088F8F"
                      fill="url(#g1)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Focus areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Weakest</div>
                {topWeak.length === 0 ? (
                  <div className="text-xs text-muted-foreground">No data yet.</div>
                ) : (
                  topWeak.map((t) => (
                    <div key={t.name} className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="truncate">{t.name}</span>
                        <span className="text-muted-foreground">{t.v} wrong</span>
                      </div>
                      <Progress value={Math.min(100, t.v * 12)} className="h-1.5" />
                    </div>
                  ))
                )}
              </div>
              <Separator />
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Strongest</div>
                {topStrong.length === 0 ? (
                  <div className="text-xs text-muted-foreground">No data yet.</div>
                ) : (
                  topStrong.map((t) => (
                    <div key={t.name} className="flex justify-between text-xs mb-1">
                      <span className="truncate">{t.name}</span>
                      <span className="text-primary font-medium">{t.v} correct</span>
                    </div>
                  ))
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => startMode("weakness")}
                disabled={topWeak.length === 0}
              >
                <Target className="mr-2 h-3 w-3" /> Train weak areas
              </Button>
            </CardContent>
          </Card>
        </div>

        {categoryChart.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Category breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChart}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" fontSize={10} stroke="currentColor" opacity={0.6} />
                  <YAxis fontSize={11} stroke="currentColor" opacity={0.6} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="correct" fill="#088F8F" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wrong" fill="#e11d48" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {progress.achievements.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {progress.achievements.map((a) => (
                <Badge key={a} variant="secondary" className="bg-primary/10 text-primary">
                  <Trophy className="mr-1 h-3 w-3" /> {a}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="text-center text-xs text-muted-foreground py-6">
          Built for self-study. Not affiliated with PeopleCert or AXELOS.
          {" · "}
          <button
            className="underline-offset-2 hover:underline"
            onClick={() => {
              if (confirm("Reset all progress?")) {
                storage.resetProgress();
                setProgress(storage.getProgress());
              }
            }}
          >
            Reset progress
          </button>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <span className="text-primary">{icon}</span>
          {label}
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>
      </CardContent>
    </Card>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
      {text}
    </div>
  );
}
