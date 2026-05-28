import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Home, RotateCcw, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AppHeader } from "@/components/app-header";
import { storage } from "@/lib/storage";
import { scoreSession } from "@/lib/engine";
import type { ExamSession } from "@/lib/types";
import { PASS_PCT } from "@/lib/types";

export const Route = createFileRoute("/results")({
  component: Results,
});

function Results() {
  const navigate = useNavigate();
  const [session, setSession] = useState<ExamSession | null>(null);

  useEffect(() => {
    const s = storage.getSession();
    if (!s || !s.finishedAt) navigate({ to: "/" });
    else setSession(s);
  }, [navigate]);

  const summary = useMemo(() => (session ? scoreSession(session) : null), [session]);

  if (!session || !summary) return null;

  const weakCats = Object.entries(summary.categoryStats)
    .map(([cat, s]) => ({ cat, pct: Math.round((s.correct / s.total) * 100), ...s }))
    .sort((a, b) => a.pct - b.pct);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        {/* Hero */}
        <Card
          className={`mb-6 border-2 ${
            summary.passed ? "border-primary/40 bg-primary/5" : "border-destructive/40 bg-destructive/5"
          }`}
        >
          <CardContent className="p-6 sm:p-8 text-center">
            <div
              className={`mx-auto grid h-16 w-16 place-items-center rounded-full mb-4 ${
                summary.passed ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
              }`}
            >
              {summary.passed ? <Trophy className="h-8 w-8" /> : <X className="h-8 w-8" />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              {summary.passed ? "Congratulations — you passed!" : "Not quite there yet"}
            </h1>
            <p className="text-sm text-muted-foreground mb-5">
              Pass mark: {PASS_PCT}% · You scored{" "}
              <span className="font-semibold text-foreground">{summary.scorePct}%</span> (
              {summary.correct} of {summary.total} correct)
            </p>
            <Progress value={summary.scorePct} className="h-2 max-w-md mx-auto mb-5" />
            <div className="flex justify-center gap-2 flex-wrap">
              <Button onClick={() => navigate({ to: "/exam", search: { mode: session.config.mode } })}>
                <RotateCcw className="mr-2 h-4 w-4" /> Try again
              </Button>
              {weakCats.length > 0 && weakCats[0].pct < 100 && (
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/exam", search: { mode: "weakness" } })}
                >
                  Train weak areas
                </Button>
              )}
              <Link to="/">
                <Button variant="ghost">
                  <Home className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Per category */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Performance by category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakCats.map((c) => (
              <div key={c.cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{c.cat}</span>
                  <span className="text-muted-foreground">
                    {c.correct}/{c.total} · {c.pct}%
                  </span>
                </div>
                <Progress value={c.pct} className="h-1.5" />
              </div>
            ))}
            {weakCats[0]?.pct < 60 && (
              <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-xs flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                <span>
                  Focus your next sessions on <strong>{weakCats[0].cat}</strong>. Use Weakness Training mode.
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Question review */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review your answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.questions.map((w, i) => {
              const a = session.answers[i];
              const correctDisplay = w.choiceOrder.indexOf(w.q.correctIndex);
              return (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {a.correct ? (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-destructive shrink-0" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        Q{i + 1} · {w.q.category} · {w.q.difficulty}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium mb-3">{w.q.question}</p>
                  <div className="space-y-1.5 text-sm mb-3">
                    {w.choiceOrder.map((origIdx, dIdx) => {
                      const isCorrect = origIdx === w.q.correctIndex;
                      const isPicked = a.selectedIndex === dIdx;
                      let cls = "px-3 py-1.5 rounded border text-xs flex items-center gap-2";
                      if (isCorrect) cls += " border-primary/50 bg-primary/10";
                      else if (isPicked) cls += " border-destructive/50 bg-destructive/5";
                      else cls += " border-border/50 opacity-70";
                      return (
                        <div key={dIdx} className={cls}>
                          <span className="font-semibold">{String.fromCharCode(65 + dIdx)}.</span>
                          <span>{w.q.choices[origIdx]}</span>
                          {isCorrect && <Check className="ml-auto h-3 w-3 text-primary" />}
                          {isPicked && !isCorrect && <X className="ml-auto h-3 w-3 text-destructive" />}
                        </div>
                      );
                    })}
                  </div>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-primary font-medium">
                      Show explanation
                    </summary>
                    <div className="mt-2 space-y-2 text-muted-foreground leading-relaxed">
                      <p><strong className="text-foreground">Correct:</strong> {w.q.explanation}</p>
                      {w.q.trapExplanation && (
                        <p className="text-amber-700 dark:text-amber-400">
                          <strong>Trap:</strong> {w.q.trapExplanation}
                        </p>
                      )}
                    </div>
                  </details>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
