import type { ThemeMode } from "./slices/themeSlice";

const STORAGE_KEY = "lullatrack-preferences";

type PersistedState = {
  theme: {
    mode: ThemeMode;
  };
};

export function loadPersistedState(): PersistedState | undefined {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return undefined;
    }

    return JSON.parse(stored) as PersistedState;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return undefined;
  }
}

export function savePersistedState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors.
  }
}
