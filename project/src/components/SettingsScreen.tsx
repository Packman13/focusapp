// Settings screen for app configuration

import { AppSettings } from "../lib/storage";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ArrowLeft } from "lucide-react";

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
  onBack: () => void;
}

export function SettingsScreen({ settings, onUpdate, onBack }: SettingsScreenProps) {
  const handleToggleAudio = (checked: boolean) => {
    onUpdate({ ...settings, audioEnabled: checked });
  };

  const handleToggleHaptics = (checked: boolean) => {
    onUpdate({ ...settings, hapticsEnabled: checked });
  };

  const handleBrightnessChange = (value: string) => {
    onUpdate({ ...settings, brightnessLevel: value as "low" | "medium" | "high" });
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <h1 className="mb-8">Settings</h1>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="audio-toggle">Audio Cues</Label>
                <p className="opacity-70">Play soft tones during breathing phases</p>
              </div>
              <Switch
                id="audio-toggle"
                checked={settings.audioEnabled}
                onCheckedChange={handleToggleAudio}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="haptics-toggle">Haptic Feedback</Label>
                <p className="opacity-70">Vibrate at phase transitions</p>
              </div>
              <Switch
                id="haptics-toggle"
                checked={settings.hapticsEnabled}
                onCheckedChange={handleToggleHaptics}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div>
                <Label>Brightness Level</Label>
                <p className="opacity-70">Adjust in-session brightness</p>
              </div>
              <RadioGroup
                value={settings.brightnessLevel}
                onValueChange={handleBrightnessChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High</Label>
                </div>
              </RadioGroup>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
