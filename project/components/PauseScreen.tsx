// Pause/Resume screen shown when app loses focus

import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface PauseScreenProps {
  remainingSeconds: number;
  onResume: () => void;
  onCancel: () => void;
}

export function PauseScreen({ remainingSeconds, onResume, onCancel }: PauseScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col gap-6 text-center">
          <div>
            <h1 className="mb-4">Session Paused</h1>
            <p className="opacity-70">
              Your session was paused to maintain accurate timing.
            </p>
          </div>

          <div className="py-6 border-y">
            <div className="text-5xl tabular-nums mb-2">{remainingSeconds}s</div>
            <p className="opacity-70">Remaining</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={onResume} size="lg" className="w-full">
              Resume Session
            </Button>
            <Button onClick={onCancel} variant="outline" size="lg" className="w-full">
              Cancel Session
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
