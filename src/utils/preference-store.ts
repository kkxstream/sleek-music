import Storage from "expo-sqlite/kv-store";
import { useSyncExternalStore } from "react";

export function getPreferredLanguages(): string[] {
  const stored = Storage.getItemSync("preferred_languages");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse preferred_languages", e);
    }
  }
  return ["Hindi", "English"];
}

export function getLanguagesParam(): string {
  return getPreferredLanguages()
    .map((l) => l.toLowerCase())
    .join(",");
}

export function getPreferredQuality(): string {
  const stored = Storage.getItemSync("preferred_quality");
  if (stored && ["_320", "_160", "_96", "_48", "_12"].includes(stored)) {
    return stored;
  }
  return "_320";
}

export function getPreferredAutoplay(): boolean {
  const stored = Storage.getItemSync("preferred_autoplay");
  if (stored === "false") {
    return false;
  }
  return true;
}

type PreferenceState = {
  theme: string;
  quality: string;
  languages: string[];
  autoplay: boolean;
};

let state: PreferenceState = {
  theme: Storage.getItemSync("preferred_theme") || "Auto",
  quality: getPreferredQuality(),
  languages: getPreferredLanguages(),
  autoplay: getPreferredAutoplay(),
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export const preferenceStore = {
  getQuality: () => state.quality,
  getAutoplay: () => state.autoplay,
  setTheme: (theme: string) => {
    Storage.setItemSync("preferred_theme", theme);
    state = { ...state, theme };
    listeners.forEach((l) => l());
  },
  setQuality: (quality: string) => {
    Storage.setItemSync("preferred_quality", quality);
    state = { ...state, quality };
    listeners.forEach((l) => l());
  },
  setLanguages: (languages: string[]) => {
    Storage.setItemSync("preferred_languages", JSON.stringify(languages));
    state = { ...state, languages };
    listeners.forEach((l) => l());
  },
  setAutoplay: (autoplay: boolean) => {
    Storage.setItemSync("preferred_autoplay", String(autoplay));
    state = { ...state, autoplay };
    listeners.forEach((l) => l());
  },
};

export function usePreferenceStore() {
  const current = useSyncExternalStore(subscribe, getSnapshot);
  return { ...current, ...preferenceStore };
}
