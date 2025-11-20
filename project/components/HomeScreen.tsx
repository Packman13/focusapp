// Home screen with start button and navigation

import { Button } from "./ui/button";
import { Settings, History } from "lucide-react";

interface HomeScreenProps {
  onStart: () => void;
  onSettings: () => void;
  onHistory: () => void;
}

export function HomeScreen({ onStart, onSettings, onHistory }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Navigation */}
      <div className="absolute top-8 right-8 flex gap-4">
        <Button variant="outline" size="icon" onClick={onHistory} aria-label="View history">
          <History className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={onSettings} aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-12 max-w-lg text-center">
        <div>
          <h1 className="mb-4">3-Minute Focus Reset</h1>
          <p className="opacity-70">
            Regain focus in a single 3-minute session through guided meditation,
            attention training, and performance preparation.
          </p>
        </div>

        <Button onClick={onStart} size="lg" className="px-12">
          Start Session
        </Button>

        <div className="grid grid-cols-3 gap-8 w-full mt-8">
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl">1</div>
            <div className="opacity-70">Meditation Reset</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl">2</div>
            <div className="opacity-70">Focus Activation</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl">3</div>
            <div className="opacity-70">Performance</div>
          </div>
        </div>
      </div>
    </div>
  );
}
