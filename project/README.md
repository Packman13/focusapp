# 3-Minute Focus Reset

A minimal, reliable web application for regaining focus through a structured 3-minute session. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Strict 180-second session timing** with no drift
- **Three structured phases:**
  - Phase A (0-60s): Meditation Reset with breathing cues (4-second cycles)
  - Phase B (60-120s): Focus Activation with quick-fire questions (7 questions, 8s each)
  - Phase C (120-180s): Performance Meditation
- **App-level focus mode** with grayscale overlay and brightness control
- **Offline-first** with local storage for history and settings
- **Accessibility** with screen reader support, high contrast, and haptic feedback
- **Mobile-first responsive design**

## Project Structure

```
├── lib/
│   ├── SessionEngine.ts       # Core timing and phase management
│   ├── WordList.ts            # 500 common words for recall phase
│   └── storage.ts             # Local storage with typed functions
├── components/
│   ├── HomeScreen.tsx         # Landing screen
│   ├── SessionScreen.tsx      # Main session with all phases
│   ├── SummaryScreen.tsx      # Post-session summary
│   ├── SettingsScreen.tsx     # User preferences
│   ├── HistoryScreen.tsx      # Session history
│   ├── PauseScreen.tsx        # Pause/resume handling
│   ├── GrayscaleOverlay.tsx   # Visual focus mode
│   └── BreathingCue.tsx       # Animated breathing guide
├── tests/
│   ├── SessionEngine.test.ts  # Unit tests
│   └── e2e.test.ts           # End-to-end tests
└── App.tsx                    # Main application component
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open browser to `http://localhost:5173`

## Building

```bash
npm run build
```

## Testing

The project includes unit tests for SessionEngine timing and Phase B recall logic.

### Running Tests

If using Vitest:
```bash
npm test
```

If using Jest:
```bash
npx jest tests/
```

### Test Coverage

- **SessionEngine.test.ts**: Tests timing accuracy, phase transitions, pause/resume, cancellation, and question generation
- **e2e.test.ts**: Tests full 180-second session flow with phase timing validation

## Core Modules

### SessionEngine

Manages session timing using monotonic clock (performance.now()) and requestAnimationFrame for accurate phase transitions.

```typescript
const engine = new SessionEngine();

engine.subscribe((event: SessionEvent) => {
  console.log(event.phase, event.remainingMs);
});

engine.start();
```

### Question Logic

Phase B generates quick mental arithmetic questions:

```typescript
const questions = generateQuestions(7);
// Returns array of { question: "7 + 5", answer: "12" }

checkAnswer("12", "12"); // Returns: true
```

### Storage

Local persistence for settings and session history (last 10 sessions):

```typescript
const settings = getSettings();
const history = getHistory();
addSessionToHistory(summary);
```

## Session Flow

1. **Start**: User initiates session from home screen
2. **Phase A (60s)**: Breathing meditation with animated circle (4s inhale/4s exhale) and rotating prompts
3. **Phase B (60s)**: Quick-fire focus questions
   - 7 mental arithmetic questions
   - 8 seconds per question
   - Immediate feedback on each answer
   - Dynamic progress tracking
4. **Phase C (60s)**: Performance meditation with final focus prompt
5. **Summary**: Display completion stats (score, percentage) with restart/exit options

## Accessibility

- Large text and high contrast default styling
- Full keyboard navigation
- ARIA labels and screen reader support
- Haptic feedback at phase transitions (optional)
- No permissions required, works offline

## Technical Details

- **No external dependencies** beyond React, TypeScript, and Tailwind
- **Monotonic timing** prevents drift when app is backgrounded
- **Grayscale mode** uses CSS backdrop-filter for visual focus
- **Local-only storage** with no PII collection
- **500-word bank** included in code, no network calls
- **PWA-ready** for mobile installation

## Browser Support

- Modern Chrome, Firefox, Safari, Edge
- iOS Safari 13+
- Android Chrome 80+

## License

MIT
