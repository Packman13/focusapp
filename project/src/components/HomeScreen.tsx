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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-background text-foreground">
      {/* Navigation */}
      <div className="absolute top-6 right-6 flex gap-4 z-50">
        <Button variant="ghost" size="icon" onClick={onHistory} aria-label="View history">
          <History className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onSettings} aria-label="Settings">
          <Settings className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-8 max-w-lg text-center z-0 mt-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">3-Minute Focus Reset</h1>
          <p className="text-lg text-muted-foreground">
            Regain focus in a single 3-minute session through guided meditation,
            attention training, and performance preparation.
          </p>
        </div>

        <Button onClick={onStart} size="lg" className="px-12 text-lg h-12">
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
