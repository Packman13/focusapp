// SessionEngine.ts - Core timing and phase management

export type Phase = "A_RESET" | "B_FOCUS" | "C_PERF" | "DONE";

export interface SessionEvent {
  type: "tick" | "phase" | "end";
  nowMs: number;
  remainingMs: number;
  phase: Phase;
  elapsedMs: number;
}

type EventCallback = (e: SessionEvent) => void;

const TOTAL_DURATION_MS = 180000; // 180 seconds
const PHASE_A_END_MS = 60000;
const PHASE_B_END_MS = 120000;
const PHASE_C_END_MS = 180000;

export class SessionEngine {
  private running = false;
  private paused = false;
  private startTimeMs = 0;
  private pausedAtMs = 0;
  private accumulatedPauseMs = 0;
  private listeners: EventCallback[] = [];
  private animationFrameId: number | null = null;
  private currentPhase: Phase = "A_RESET";
  private phaseBStartMs = 0;

  start(): void {
    if (this.running) return;

    this.running = true;
    this.paused = false;
    this.startTimeMs = performance.now();
    this.accumulatedPauseMs = 0;
    this.currentPhase = "A_RESET";
    this.phaseBStartMs = 0;

    this.tick();
  }

  pause(): void {
    if (!this.running || this.paused) return;

    this.paused = true;
    this.pausedAtMs = performance.now();

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resume(): void {
    if (!this.running || !this.paused) return;

    this.paused = false;
    const pauseDuration = performance.now() - this.pausedAtMs;
    this.accumulatedPauseMs += pauseDuration;

    this.tick();
  }

  cancel(): void {
    this.running = false;
    this.paused = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.currentPhase = "A_RESET";
  }

  subscribe(cb: EventCallback): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private tick = (): void => {
    if (!this.running || this.paused) return;

    const nowMs = performance.now();
    const elapsedMs =
      nowMs - this.startTimeMs - this.accumulatedPauseMs;
    const remainingMs = Math.max(
      0,
      TOTAL_DURATION_MS - elapsedMs,
    );

    // Determine current phase
    const newPhase = this.determinePhase(elapsedMs);
    const phaseChanged = newPhase !== this.currentPhase;

    if (phaseChanged) {
      this.currentPhase = newPhase;
    }

    // Emit events
    const event: SessionEvent = {
      type: phaseChanged ? "phase" : "tick",
      nowMs,
      remainingMs,
      phase: this.currentPhase,
      elapsedMs,
    };

    this.emit(event);

    // Check if session is complete
    if (remainingMs === 0) {
      this.running = false;
      this.emit({ ...event, type: "end" });
      return;
    }

    // Schedule next tick
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private determinePhase(elapsedMs: number): Phase {
    if (elapsedMs >= PHASE_C_END_MS) {
      return "DONE";
    } else if (elapsedMs >= PHASE_B_END_MS) {
      return "C_PERF";
    } else if (elapsedMs >= PHASE_A_END_MS) {
      return "B_FOCUS";
    } else {
      return "A_RESET";
    }
  }

  private emit(event: SessionEvent): void {
    this.listeners.forEach((cb) => cb(event));
  }

  getPhaseElapsedMs(totalElapsedMs: number): number {
    const phase = this.determinePhase(totalElapsedMs);

    switch (phase) {
      case "A_RESET":
        return totalElapsedMs;
      case "B_FOCUS":
        return totalElapsedMs - PHASE_A_END_MS;
      case "C_PERF":
        return totalElapsedMs - PHASE_B_END_MS;
      default:
        return 0;
    }
  }
}

// Question generation for Phase B
export interface FocusQuestion {
  words: string[];
}

const WORD_BANK = [
  "ocean",
  "mountain",
  "river",
  "forest",
  "desert",
  "sunset",
  "thunder",
  "breeze",
  "crystal",
  "shadow",
  "anchor",
  "compass",
  "journey",
  "horizon",
  "beacon",
  "velvet",
  "marble",
  "copper",
  "silver",
  "golden",
  "whisper",
  "echo",
  "rhythm",
  "melody",
  "harmony",
  "courage",
  "wisdom",
  "justice",
  "freedom",
  "honor",
  "phoenix",
  "dragon",
  "tiger",
  "eagle",
  "falcon",
  "ember",
  "frost",
  "spark",
  "flame",
  "storm",
  "castle",
  "tower",
  "bridge",
  "temple",
  "garden",
  "mystic",
  "cosmic",
  "lunar",
  "solar",
  "stellar",
];

export function generateQuestions(
  count: number,
): FocusQuestion[] {
  const questions: FocusQuestion[] = [];

  for (let i = 0; i < count; i++) {
    // Shuffle word bank and pick 3-4 words per round
    const shuffled = [...WORD_BANK].sort(
      () => Math.random() - 0.5,
    );
    const wordCount = 3; // 3 words per round
    const words = shuffled.slice(0, wordCount);
    questions.push({ words });
  }

  return questions;
}

export function checkAnswer(
  userAnswer: string,
  correctWords: string[],
): { correct: boolean; score: number } {
  // Split user input by spaces/commas and normalize
  const userWords = userAnswer
    .toLowerCase()
    .split(/[\s,]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

  const correctWordsLower = correctWords.map((w) =>
    w.toLowerCase(),
  );

  // Count how many correct words the user recalled
  let score = 0;
  userWords.forEach((word) => {
    if (correctWordsLower.includes(word)) {
      score++;
    }
  });

  const correct = score === correctWords.length;
  return { correct, score };
}