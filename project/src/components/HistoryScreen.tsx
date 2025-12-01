// History screen showing past sessions

import { SessionSummary } from "../lib/storage";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";

interface HistoryScreenProps {
  history: SessionSummary[];
  onBack: () => void;
  onClear: () => void;
}

export function HistoryScreen({ history, onBack, onClear }: HistoryScreenProps) {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {history.length > 0 && (
          <Button variant="outline" onClick={onClear} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <h1 className="mb-8">Session History</h1>

        {history.length === 0 ? (
          <div className="text-center py-12 opacity-70">
            <p>No sessions completed yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map((session, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <span className="opacity-70">{formatDate(session.timestamp)}</span>
                      {session.completed && (
                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-700 dark:text-green-300">
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <span className="opacity-70">Recall Score: </span>
                        <span>{session.recallScore} / 3</span>
                      </div>
                      <div>
                        <span className="opacity-70">Audio: </span>
                        <span>{session.audioEnabled ? "On" : "Off"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
