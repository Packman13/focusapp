// Local storage wrapper with typed functions

export interface SessionSummary {
  timestamp: number;
  recallScore: number;
  completed: boolean;
  audioEnabled: boolean;
}

export interface AppSettings {
  audioEnabled: boolean;
  hapticsEnabled: boolean;
  brightnessLevel: "low" | "medium" | "high";
}

const SETTINGS_KEY = "focus_reset_settings";
const HISTORY_KEY = "focus_reset_history";
const MAX_HISTORY = 10;

export function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load settings", e);
  }

  return {
    audioEnabled: true,
    hapticsEnabled: true,
    brightnessLevel: "medium"
  };
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
}

export function getHistory(): SessionSummary[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load history", e);
  }

  return [];
}

export function addSessionToHistory(summary: SessionSummary): void {
  try {
    const history = getHistory();
    history.unshift(summary);
    
    // Keep only last 10
    const trimmed = history.slice(0, MAX_HISTORY);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error("Failed to save session", e);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error("Failed to clear history", e);
  }
}
