"use client";

import { useSyncExternalStore } from "react";
import { Eye, EyeOff } from "lucide-react";
import { clsx } from "clsx";

const STORAGE_KEY = "supportnest_theme";
const SENSORY_THEME = "sensory";

function applyTheme(enabled: boolean) {
  const root = document.documentElement;

  if (enabled) {
    root.dataset.theme = SENSORY_THEME;
    window.localStorage.setItem(STORAGE_KEY, SENSORY_THEME);
    window.dispatchEvent(new Event("supportnest-theme-change"));
    return;
  }

  root.removeAttribute("data-theme");
  window.localStorage.setItem(STORAGE_KEY, "default");
  window.dispatchEvent(new Event("supportnest-theme-change"));
}

function subscribe(callback: () => void) {
  window.addEventListener("supportnest-theme-change", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("supportnest-theme-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getThemeSnapshot() {
  return document.documentElement.dataset.theme === SENSORY_THEME;
}

function getServerSnapshot() {
  return false;
}

export default function SensoryModeToggle({
  className,
}: {
  className?: string;
}) {
  const enabled = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerSnapshot
  );

  function toggleTheme() {
    applyTheme(!enabled);
  }

  const Icon = enabled ? EyeOff : Eye;

  return (
    <button
      type="button"
      aria-pressed={enabled}
      aria-label={
        enabled
          ? "Disable Sensory Friendly Mode"
          : "Enable Sensory Friendly Mode"
      }
      onClick={toggleTheme}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-raised)] px-3 py-2 text-xs font-semibold text-[var(--theme-text)] shadow-sm transition-colors hover:bg-[var(--theme-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:ring-offset-2 focus:ring-offset-[var(--theme-background)] aria-pressed:bg-[var(--theme-primary)] aria-pressed:text-[var(--theme-on-primary)]",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span>Sensory Mode</span>
      <span className="hidden rounded-full bg-[var(--theme-surface)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--theme-muted-text)] sm:inline">
        {enabled ? "On" : "Off"}
      </span>
    </button>
  );
}
