import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Check,
  X,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AppHeader } from "@/components/app-header";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { buildSession, EXAM_MODES, MOTIVATIONAL, scoreSession } from "@/lib/engine";
import type { ExamMode, ExamSession } from "@/lib/types";
import { storage, addExamToHistory, recordIncorrect } from "@/lib/storage";

// zod is bundled by tanstack; if missing fall back to passthrough
const search = z.object({
  mode: z.string().optional(),
});

export const Route = createFileRoute("/exam")({
  validateSearch: (s) => search.parse(s),
  component: ExamRunner,
});

function ExamRunner() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [session, setSession] = useState<ExamSession | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const motivation = useRef(
    MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)],
  );

  // Build session once per mount (refresh = new exam)
  useEffect(() => {
    const m: ExamMode = (mode as ExamMode) || "real";
    const cfg = EXAM_MODES[m]?.build() || EXAM_MODES.real.build();
    const progress = storage.getProgress();
    const weak = Object.entries(progress.weakTopics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([c]) => c as any);
    const recent = new Set(progress.incorrectQuestionIds);
    const s = buildSession(
      cfg,
      { weakCategories: m === "weakness" ? weak : undefined, recentQuestionIds: recent },
      Date.now() ^ Math.floor(Math.random() * 1e9),
    );
    setSession(s);
    startedAt.current = Date.now();
  }, [mode]);

  // Timer
  useEffect(() => {
    if (!session?.config.durationSec) return;
    const i = setInterval(() => {
      setSession((prev) => {
        if (!prev || prev.remainingSec == null) return prev;
        const r = prev.remainingSec - 1;
        if (r <= 0) {
          clearInterval(i);
          finish(prev);
          return { ...prev, remainingSec: 0 };
        }
        return { ...prev, remainingSec: r };
      });
    }, 1000);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!session) return;
      if (["1", "2", "3", "4"].includes(e.key)) {
        select(parseInt(e.key) - 1);
      } else if (e.key === "ArrowRight" || e.key === "n") goto(session.currentIndex + 1);
      else if (e.key === "ArrowLeft" || e.key === "p") goto(session.currentIndex - 1);
      else if (e.key === "m") toggleMark();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-muted-foreground">Building your exam…</div>
      </div>
    );
  }

  const idx = session.currentIndex;
  const current = session.questions[idx];
  const answer = session.answers[idx];
  const showFeedback = session.config.showFeedback && answer.selectedIndex !== null;

  const mins = session.remainingSec != null ? Math.floor(session.remainingSec / 60) : null;
  const secs = session.remainingSec != null ? session.remainingSec % 60 : null;
  const lowTime = (session.remainingSec ?? 99999) < 60;

  function select(displayIdx: number) {
    setSession((prev) => {
      if (!prev) return prev;
      const cur = prev.questions[prev.currentIndex];
      const originalIdx = cur.choiceOrder[displayIdx];
      const correct = originalIdx === cur.q.correctIndex;
      const answers = [...prev.answers];
      answers[prev.currentIndex] = {
        ...answers[prev.currentIndex],
        selectedIndex: displayIdx,
        correct,
        timeMs: Date.now() - startedAt.current,
      };
      return { ...prev, answers };
    });
  }

  function toggleMark() {
    setSession((prev) => {
      if (!prev) return prev;
      const answers = [...prev.answers];
      answers[prev.currentIndex] = {
        ...answers[prev.currentIndex],
        marked: !answers[prev.currentIndex].marked,
      };
      return { ...prev, answers };
    });
  }

  function goto(i: number) {
    if (i < 0 || i >= session.questions.length) return;
    setSession((prev) => (prev ? { ...prev, currentIndex: i } : prev));
    startedAt.current = Date.now();
  }

  function finish(s: ExamSession | null = session) {
    if (!s) return;
    const finished: ExamSession = { ...s, finishedAt: Date.now() };
    const sum = scoreSession(finished);
    const result = {
      id: finished.id,
      date: Date.now(),
      mode: finished.config.mode,
      ...sum,
    };
    addExamToHistory(result);
    recordIncorrect(
      finished.questions
        .filter((_, i) => !finished.answers[i].correct && finished.answers[i].selectedIndex !== null)
        .map((w) => w.q.id),
    );
    storage.setSession(finished); // keep last session for review
    navigate({ to: "/results" });
  }

  const answeredCount = session.answers.filter((a) => a.selectedIndex !== null).length;
  const markedCount = session.answers.filter((a) => a.marked).length;
  const correctDisplayIdx = current.choiceOrder.indexOf(current.q.correctIndex);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-3 sm:px-6 py-6">
        {/* top bar */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="capitalize">
              {EXAM_MODES[session.config.mode].label}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {current.q.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">{current.q.category}</Badge>
          </div>
          <div className="flex items-center gap-3">
            {mins != null && (
              <div
                className={`flex items-center gap-1.5 text-sm font-mono ${
                  lowTime ? "text-destructive animate-pulse" : ""
                }`}
              >
                <Clock className="h-4 w-4" />
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowSubmit(true)}>
              Submit
            </Button>
          </div>
        </div>

        <Progress
          value={((idx + 1) / session.questions.length) * 100}
          className="h-1.5 mb-6"
        />

        <div className="grid lg:grid-cols-[1fr_240px] gap-6">
          {/* Question card */}
          <div>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5 sm:p-7">
                <div className="text-xs text-muted-foreground mb-3">
                  Question {idx + 1} of {session.questions.length}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold leading-snug mb-5">
                  {current.q.question}
                </h2>
                <div className="space-y-2.5">
                  {current.choiceOrder.map((origIdx, displayIdx) => {
                    const isSelected = answer.selectedIndex === displayIdx;
                    const isCorrect = origIdx === current.q.correctIndex;
                    let cls =
                      "w-full text-left px-4 py-3 rounded-lg border transition flex items-start gap-3 hover:border-primary/60 hover:bg-accent/40";
                    if (showFeedback) {
                      if (isCorrect)
                        cls += " border-primary bg-primary/10 text-foreground";
                      else if (isSelected && !isCorrect)
                        cls += " border-destructive bg-destructive/10 text-foreground";
                      else cls += " opacity-70";
                    } else if (isSelected) {
                      cls += " border-primary bg-primary/5";
                    }
                    return (
                      <button
                        key={displayIdx}
                        className={cls}
                        onClick={() => !showFeedback && select(displayIdx)}
                        disabled={showFeedback}
                      >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border bg-background text-[11px] font-semibold">
                          {String.fromCharCode(65 + displayIdx)}
                        </span>
                        <span className="text-sm leading-relaxed">{current.q.choices[origIdx]}</span>
                        {showFeedback && isCorrect && (
                          <Check className="ml-auto h-4 w-4 text-primary" />
                        )}
                        {showFeedback && isSelected && !isCorrect && (
                          <X className="ml-auto h-4 w-4 text-destructive" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {showFeedback && (
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="rounded-lg border bg-accent/30 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
                        Why this is correct
                      </div>
                      <p className="leading-relaxed">{current.q.explanation}</p>
                    </div>
                    {current.q.wrongExplanations?.length > 0 && (
                      <div className="rounded-lg border p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Why the others are wrong
                        </div>
                        <ul className="space-y-1.5 list-disc pl-5">
                          {current.q.wrongExplanations.map((w, i) => (
                            <li key={i} className="leading-relaxed text-muted-foreground">{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {current.q.trapExplanation && (
                      <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> PeopleCert trap
                        </div>
                        <p className="leading-relaxed">{current.q.trapExplanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-4 flex items-center justify-between gap-2">
              <Button variant="outline" onClick={() => goto(idx - 1)} disabled={idx === 0}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleMark} className="text-xs">
                <Flag
                  className={`mr-1 h-3.5 w-3.5 ${
                    answer.marked ? "fill-amber-500 text-amber-500" : ""
                  }`}
                />
                {answer.marked ? "Marked" : "Mark for review"}
              </Button>
              {idx === session.questions.length - 1 ? (
                <Button onClick={() => setShowSubmit(true)}>Finish exam</Button>
              ) : (
                <Button onClick={() => goto(idx + 1)}>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground italic">
              "{motivation.current}"
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <Card className="border-border/60">
              <CardContent className="p-4">
                <div className="flex justify-between text-xs mb-3">
                  <span className="text-muted-foreground">
                    {answeredCount}/{session.questions.length} answered
                  </span>
                  {markedCount > 0 && (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Flag className="h-3 w-3" /> {markedCount}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-8 lg:grid-cols-5 gap-1.5">
                  {session.questions.map((_, i) => {
                    const a = session.answers[i];
                    const isCurrent = i === idx;
                    let cls =
                      "h-8 rounded text-[11px] font-medium border transition relative";
                    if (isCurrent) cls += " ring-2 ring-primary ring-offset-1 ring-offset-background";
                    if (a.selectedIndex !== null)
                      cls += " bg-primary/15 border-primary/40 text-foreground";
                    else cls += " bg-background border-border text-muted-foreground";
                    return (
                      <button
                        key={i}
                        onClick={() => goto(i)}
                        className={cls}
                        aria-label={`Question ${i + 1}`}
                      >
                        {i + 1}
                        {a.marked && (
                          <Flag className="absolute -top-1 -right-1 h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t text-[10px] text-muted-foreground space-y-1">
                  <div>Shortcuts:</div>
                  <div><kbd className="px-1 border rounded">1</kbd>–<kbd className="px-1 border rounded">4</kbd> answer</div>
                  <div><kbd className="px-1 border rounded">←</kbd>/<kbd className="px-1 border rounded">→</kbd> navigate</div>
                  <div><kbd className="px-1 border rounded">M</kbd> mark</div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <Dialog open={showSubmit} onOpenChange={setShowSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit exam?</DialogTitle>
            <DialogDescription>
              {answeredCount === session.questions.length
                ? "All questions answered. Submit for grading?"
                : `You have ${session.questions.length - answeredCount} unanswered question(s). They will be marked wrong.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmit(false)}>Keep going</Button>
            <Button onClick={() => finish()}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
