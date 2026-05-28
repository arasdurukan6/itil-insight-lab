import { Link } from "@tanstack/react-router";
import { Moon, Sun, GraduationCap } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">ITIL 4 Trainer</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Foundation Mock Exam
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition"
          >
            Dashboard
          </Link>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
