// Summary screen shown at session end

import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface SummaryScreenProps {
  score: number;
  totalQuestions: number;
  audioEnabled: boolean;
  onRestart: () => void;
  onExit: () => void;
}

export function SummaryScreen({
  score,
  totalQuestions,
  audioEnabled,
  onRestart,
  onExit
}: SummaryScreenProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="mb-4">Session Complete</h1>
            <p className="opacity-70">You completed the 3-minute focus reset</p>
          </div>

          <div className="flex flex-col gap-4 py-6 border-y">
            <div className="flex justify-between items-center">
              <span className="opacity-70">Time Completed</span>
              <span>180 seconds</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">Words Recalled</span>
              <span>{score} / {totalQuestions} ({percentage}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">Audio</span>
              <span>{audioEnabled ? "On" : "Off"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={onExit} size="lg" className="w-full">
              Start My Task
            </Button>
            <Button onClick={onRestart} variant="outline" size="lg" className="w-full">
              Restart Session
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}