import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => storage.getSettings().theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    storage.setSettings({ ...storage.getSettings(), theme });
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    setTheme,
  };
}
