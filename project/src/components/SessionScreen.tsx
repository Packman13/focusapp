// Session screen managing all three phases

import { useEffect, useState, useRef, useCallback } from "react";
import { SessionEngine, SessionEvent, Phase, FocusQuestion, generateQuestions, checkAnswer } from "../lib/SessionEngine";
import { AppSettings } from "../lib/storage";
import { BreathingCue } from "./BreathingCue";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface SessionScreenProps {
  settings: AppSettings;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

const PHASE_A_PROMPTS = [
  "Inhale calm",
  "Exhale noise",
  "Find your center",
  "Release tension",
  "Breathe deeply",
  "Let go"
];

// Phase B: Simple submission-based rounds (no complex timing)
const SHOW_DURATION_MS = 4000; // 4 seconds to memorize
const TOTAL_ROUNDS = 10; // As many rounds as user can complete in 60 seconds

type RecallSubPhase = "show" | "recall" | "waiting";

export function SessionScreen({ settings, onComplete, onCancel }: SessionScreenProps) {
  const [phase, setPhase] = useState<Phase>("A_RESET");
  const [remainingSeconds, setRemainingSeconds] = useState(180);
  const [elapsedMs, setElapsedMs] = useState(0);
  
  // Phase A
  const [promptIndex, setPromptIndex] = useState(0);
  
  // Phase B - Word Memorization (submission-based)
  const [wordSets, setWordSets] = useState<FocusQuestion[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [subPhase, setSubPhase] = useState<RecallSubPhase>("waiting");
  const [userAnswer, setUserAnswer] = useState("");
  const [totalWordsCorrect, setTotalWordsCorrect] = useState(0);
  const [totalWordsPossible, setTotalWordsPossible] = useState(0);
  const [roundResults, setRoundResults] = useState<{ score: number; total: number }[]>([]);
  
  // Use refs to avoid closure/stale state issues
  const engineRef = useRef<SessionEngine | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const showTimerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseBStartedRef = useRef(false);
  const currentRoundRef = useRef(0);
  const totalWordsCorrectRef = useRef(0);
  const totalWordsPossibleRef = useRef(0);

  // Initialize session - runs ONCE
  useEffect(() => {
    const engine = new SessionEngine();
    engineRef.current = engine;

    // Generate word sets ONCE
    const generatedWords = generateQuestions(TOTAL_ROUNDS);
    setWordSets(generatedWords);

    // Start session
    engine.start();

    const unsubscribe = engine.subscribe((event: SessionEvent) => {
      setPhase(event.phase);
      setRemainingSeconds(Math.ceil(event.remainingMs / 1000));
      setElapsedMs(event.elapsedMs);

      // Trigger haptics on phase change
      if (event.type === "phase" && settings.hapticsEnabled) {
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }

      // Phase A: Rotate prompts every 10 seconds
      if (event.phase === "A_RESET") {
        const phaseElapsed = event.elapsedMs;
        const newPromptIndex = Math.floor(phaseElapsed / 10000) % PHASE_A_PROMPTS.length;
        setPromptIndex(newPromptIndex);
      }

      // Phase B: Start first round when entering phase (ONCE)
      if (event.phase === "B_FOCUS" && !phaseBStartedRef.current) {
        phaseBStartedRef.current = true;
        
        // Show first words
        setSubPhase("show");
        setUserAnswer("");
        
        // After 4 seconds, switch to recall
        showTimerRef.current = setTimeout(() => {
          setSubPhase("recall");
          setTimeout(() => inputRef.current?.focus(), 100);
        }, SHOW_DURATION_MS);
      }

      if (event.type === "end") {
        onComplete(totalWordsCorrectRef.current);
      }
    });

    return () => {
      unsubscribe();
      engine.cancel();
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
    };
  }, []); // Empty deps - run ONCE

  // Sync refs with state
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  useEffect(() => {
    totalWordsCorrectRef.current = totalWordsCorrect;
    totalWordsPossibleRef.current = totalWordsPossible;
  }, [totalWordsCorrect, totalWordsPossible]);

  const handleSubmitAnswer = useCallback(() => {
    if (currentRoundRef.current >= wordSets.length) return;
    if (phase !== "B_FOCUS") return;
    
    const currentWords = wordSets[currentRoundRef.current].words;
    const result = checkAnswer(userAnswer, currentWords);
    
    const newCorrect = totalWordsCorrectRef.current + result.score;
    const newPossible = totalWordsPossibleRef.current + currentWords.length;
    
    setTotalWordsCorrect(newCorrect);
    setTotalWordsPossible(newPossible);
    setRoundResults(prev => [...prev, { score: result.score, total: currentWords.length }]);
    
    // Update refs immediately
    totalWordsCorrectRef.current = newCorrect;
    totalWordsPossibleRef.current = newPossible;
    
    // Brief vibration for feedback
    if (settings.hapticsEnabled) {
      const allCorrect = result.score === currentWords.length;
      navigator.vibrate?.(allCorrect ? [50] : [100, 50, 100]);
    }
    
    // Clear any existing timer
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    
    // Move to next round immediately
    const nextRound = currentRoundRef.current + 1;
    if (nextRound < TOTAL_ROUNDS && phase === "B_FOCUS") {
      setCurrentRound(nextRound);
      currentRoundRef.current = nextRound;
      
      // Show new words
      setSubPhase("show");
      setUserAnswer("");
      
      // After 4 seconds, switch to recall
      showTimerRef.current = setTimeout(() => {
        setSubPhase("recall");
        setTimeout(() => inputRef.current?.focus(), 100);
      }, SHOW_DURATION_MS);
    } else {
      // No more rounds - just wait for phase to end
      setSubPhase("waiting");
    }
  }, [phase, userAnswer, wordSets, settings.hapticsEnabled]);

  const handleAnswerKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userAnswer.trim() && subPhase === "recall") {
      handleSubmitAnswer();
    }
  };

  const handleCancel = () => {
    if (engineRef.current) {
      engineRef.current.cancel();
    }
    onCancel();
  };

  const getBrightnessClass = () => {
    switch (settings.brightnessLevel) {
      case "low":
        return "brightness-75";
      case "high":
        return "brightness-125";
      default:
        return "brightness-100";
    }
  };

  const currentWordSet = wordSets[currentRound];

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative bg-background text-foreground ${getBrightnessClass()}`}>
      {/* Timer */}
      <div className="absolute top-6 right-6 z-50">
        <div className="text-6xl font-light tabular-nums tracking-tighter">{remainingSeconds}s</div>
      </div>

      {/* Cancel Button */}
      <div className="absolute top-6 left-6 z-50">
        <Button variant="ghost" onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
          Cancel
        </Button>
      </div>

      {/* Phase Content */}
      <div className="flex-1 flex items-center justify-center w-full max-w-4xl">
        {phase === "A_RESET" && (
          <div className="flex flex-col items-center gap-16 animate-in fade-in duration-700">
            <h1 className="text-4xl font-medium tracking-tight text-center">Meditation Reset</h1>
            <BreathingCue active={true} />
            <p className="text-3xl text-center text-muted-foreground font-light tracking-wide">{PHASE_A_PROMPTS[promptIndex]}</p>
          </div>
        )}

        {phase === "B_FOCUS" && (
          <div className="flex flex-col items-center w-full max-w-3xl animate-in fade-in duration-500">
            {/* Header Row */}
            <div className="w-full flex items-center justify-between mb-12 px-4">
              <h1 className="text-2xl font-medium">Word Recall</h1>
              <div className="text-2xl text-muted-foreground">
                Round {currentRound + 1}
              </div>
            </div>
            
            {/* Score display */}
            <div className="text-center mb-16">
              <div className="text-4xl font-light">
                {totalWordsCorrect} / {totalWordsPossible} correct
              </div>
            </div>

            {currentWordSet && subPhase !== "waiting" ? (
              <div className="flex flex-col items-center w-full">
                {subPhase === "show" && (
                  <div className="flex flex-col items-center gap-12 animate-in zoom-in-95 duration-300">
                    <p className="text-2xl text-muted-foreground">Memorize these words:</p>
                    <div className="flex flex-col items-center gap-6">
                      {currentWordSet.words.map((word, index) => (
                        <div key={index} className="text-6xl font-semibold capitalize tracking-tight">
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {subPhase === "recall" && (
                  <div className="flex flex-col items-center gap-8 w-full max-w-xl animate-in slide-in-from-bottom-4 duration-300">
                    <p className="text-2xl text-muted-foreground">Type the words you remember:</p>
                    <div className="w-full flex flex-col gap-6">
                      <Input
                        ref={inputRef}
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleAnswerKeyPress}
                        placeholder="word1, word2, word3..."
                        className="text-3xl text-center h-20 rounded-xl border-2 focus-visible:ring-0 focus-visible:border-primary"
                        autoFocus
                      />
                      
                      <Button 
                        onClick={handleSubmitAnswer} 
                        disabled={!userAnswer.trim()}
                        size="lg"
                        className="w-full h-16 text-xl font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        Submit & Continue
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8 animate-in fade-in">
                <div className="text-3xl font-light">Great work! Waiting for next phase...</div>
              </div>
            )}
          </div>
        )}

        {phase === "C_PERF" && (
          <div className="flex flex-col items-center gap-16 animate-in fade-in duration-700">
            <h1 className="text-4xl font-medium tracking-tight text-center">Performance Meditation</h1>
            <BreathingCue active={true} />
            {remainingSeconds > 10 ? (
              <p className="text-3xl text-center text-muted-foreground font-light tracking-wide">Center yourself</p>
            ) : (
              <p className="text-3xl text-center text-muted-foreground font-light tracking-wide">Focus on performance</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
