// Breathing cue component with 4-4 second inhale-exhale cycle

import { useEffect, useState } from "react";

interface BreathingCueProps {
  active: boolean;
}

export function BreathingCue({ active }: BreathingCueProps) {
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!active) {
      setScale(1);
      setPhase("inhale");
      return;
    }

    let startTime = Date.now();
    let currentPhase: "inhale" | "exhale" = "inhale";
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cycleTime = elapsed % 8000; // 8 second cycle (4s inhale + 4s exhale)
      
      if (cycleTime < 4000) {
        // Inhale: 0-4 seconds
        currentPhase = "inhale";
        const progress = cycleTime / 4000;
        // Smooth ease-in-out curve
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        setScale(1 + eased * 0.8); // Scale from 1 to 1.8
      } else {
        // Exhale: 4-8 seconds
        currentPhase = "exhale";
        const progress = (cycleTime - 4000) / 4000;
        // Smooth ease-in-out curve
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        setScale(1.8 - eased * 0.8); // Scale from 1.8 to 1
      }
      
      setPhase(currentPhase);
      
      if (active) {
        requestAnimationFrame(animate);
      }
    };
    
    const frameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <div
        className="w-72 h-72 rounded-full bg-slate-400/50 backdrop-blur-sm shadow-xl border border-slate-300/20"
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 0.1s ease-out',
        }}
        aria-label={phase === "inhale" ? "Inhale" : "Exhale"}
      />
      <p className="text-3xl text-center text-muted-foreground font-light tracking-widest uppercase">
        {phase === "inhale" ? "Inhale" : "Exhale"}
      </p>
    </div>
  );
}
