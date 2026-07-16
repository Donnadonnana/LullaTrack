import type { User } from "./slices/authSlice";
import type { Baby } from "./slices/babySlice";
import type { ThemeMode } from "./slices/themeSlice";

const STORAGE_KEY = "lullatrack-state";

export type PersistedState = {
  auth: {
    user: User | null;
  };
  babies: {
    babies: Baby[];
    activeBabyId: string | null;
  };
  theme: {
    mode: ThemeMode;
  };
};

export function loadPersistedState(): PersistedState | undefined {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);

    if (!serializedState) {
      return undefined;
    }

    return JSON.parse(serializedState) as PersistedState;
  } catch (error) {
    console.error("Unable to load persisted state:", error);
    return undefined;
  }
}

export function savePersistedState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Unable to save persisted state:", error);
  }
}

export function clearPersistedState(): void {
  localStorage.removeItem(STORAGE_KEY);
}