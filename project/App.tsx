// Main App component - 3-Minute Focus Reset

import { useState, useEffect } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { SessionScreen } from "./components/SessionScreen";
import { SummaryScreen } from "./components/SummaryScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { HistoryScreen } from "./components/HistoryScreen";
import { PauseScreen } from "./components/PauseScreen";
import { GrayscaleOverlay } from "./components/GrayscaleOverlay";
import {
  AppSettings,
  SessionSummary,
  getSettings,
  saveSettings,
  getHistory,
  addSessionToHistory,
  clearHistory
} from "./lib/storage";

type Screen = "home" | "session" | "summary" | "settings" | "history" | "paused";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [history, setHistory] = useState<SessionSummary[]>(getHistory());
  const [sessionScore, setSessionScore] = useState(0);
  const [totalPossible] = useState(30); // User can complete many rounds in 60s, max 10 rounds × 3 words
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(180);

  // Handle page visibility for pause/resume
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (currentScreen === "session") {
        if (document.hidden) {
          setIsPaused(true);
          setCurrentScreen("paused");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentScreen]);

  const handleStartSession = () => {
    setCurrentScreen("session");
    setSessionScore(0);
  };

  const handleSessionComplete = (score: number) => {
    setSessionScore(score);

    const summary: SessionSummary = {
      timestamp: Date.now(),
      recallScore: score,
      completed: true,
      audioEnabled: settings.audioEnabled
    };

    addSessionToHistory(summary);
    setHistory(getHistory());
    setCurrentScreen("summary");
  };

  const handleSessionCancel = () => {
    setCurrentScreen("home");
  };

  const handleRestartSession = () => {
    setCurrentScreen("session");
    setSessionScore(0);
  };

  const handleExitToHome = () => {
    setCurrentScreen("home");
  };

  const handleOpenSettings = () => {
    setCurrentScreen("settings");
  };

  const handleOpenHistory = () => {
    setCurrentScreen("history");
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleResumeSession = () => {
    setIsPaused(false);
    setCurrentScreen("session");
  };

  const handleCancelFromPause = () => {
    setIsPaused(false);
    setCurrentScreen("home");
  };

  const grayscaleStrength = currentScreen === "session" ? 0.8 : 0;

  return (
    <>
      <GrayscaleOverlay strength={grayscaleStrength} />
      
      <div className="min-h-screen">
        {currentScreen === "home" && (
          <HomeScreen
            onStart={handleStartSession}
            onSettings={handleOpenSettings}
            onHistory={handleOpenHistory}
          />
        )}

        {currentScreen === "session" && !isPaused && (
          <SessionScreen
            settings={settings}
            onComplete={handleSessionComplete}
            onCancel={handleSessionCancel}
          />
        )}

        {currentScreen === "paused" && (
          <PauseScreen
            remainingSeconds={remainingSeconds}
            onResume={handleResumeSession}
            onCancel={handleCancelFromPause}
          />
        )}

        {currentScreen === "summary" && (
          <SummaryScreen
            score={sessionScore}
            totalQuestions={totalPossible}
            audioEnabled={settings.audioEnabled}
            onRestart={handleRestartSession}
            onExit={handleExitToHome}
          />
        )}

        {currentScreen === "settings" && (
          <SettingsScreen
            settings={settings}
            onUpdate={handleUpdateSettings}
            onBack={handleExitToHome}
          />
        )}

        {currentScreen === "history" && (
          <HistoryScreen
            history={history}
            onBack={handleExitToHome}
            onClear={handleClearHistory}
          />
        )}
      </div>
    </>
  );
}