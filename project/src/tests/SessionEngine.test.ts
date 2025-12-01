// Unit tests for SessionEngine timing and question logic

import { SessionEngine, generateQuestions, checkAnswer, Phase } from "../lib/SessionEngine";

describe("SessionEngine", () => {
  test("should start and emit tick events", (done) => {
    const engine = new SessionEngine();
    let tickCount = 0;

    const unsubscribe = engine.subscribe((event) => {
      if (event.type === "tick") {
        tickCount++;
        if (tickCount >= 3) {
          engine.cancel();
          unsubscribe();
          expect(tickCount).toBeGreaterThanOrEqual(3);
          done();
        }
      }
    });

    engine.start();
  }, 10000);

  test("should transition through phases correctly", (done) => {
    const engine = new SessionEngine();
    const phases: Phase[] = [];

    const unsubscribe = engine.subscribe((event) => {
      if (event.type === "phase") {
        phases.push(event.phase);
      }

      // Check first phase transition
      if (phases.length >= 1) {
        engine.cancel();
        unsubscribe();
        expect(phases[0]).toBe("B_FOCUS");
        done();
      }
    });

    engine.start();
  }, 70000);

  test("should pause and resume correctly", (done) => {
    const engine = new SessionEngine();
    let resumeTicked = false;

    engine.start();

    setTimeout(() => {
      engine.pause();
      
      setTimeout(() => {
        const unsubscribe = engine.subscribe((event) => {
          if (event.type === "tick") {
            resumeTicked = true;
            engine.cancel();
            unsubscribe();
            expect(resumeTicked).toBe(true);
            done();
          }
        });

        engine.resume();
      }, 100);
    }, 100);
  }, 5000);

  test("should cancel session", () => {
    const engine = new SessionEngine();
    let tickAfterCancel = false;

    engine.start();
    engine.cancel();

    const unsubscribe = engine.subscribe(() => {
      tickAfterCancel = true;
    });

    setTimeout(() => {
      unsubscribe();
      expect(tickAfterCancel).toBe(false);
    }, 500);
  });
});

describe("generateQuestions", () => {
  test("should generate requested number of questions", () => {
    const questions = generateQuestions(7);
    expect(questions.length).toBe(7);
  });

  test("should return questions with answer fields", () => {
    const questions = generateQuestions(5);
    questions.forEach(q => {
      expect(q.question).toBeDefined();
      expect(q.answer).toBeDefined();
    });
  });
});

describe("checkAnswer", () => {
  test("should correctly validate exact match", () => {
    expect(checkAnswer("12", "12")).toBe(true);
    expect(checkAnswer("24", "24")).toBe(true);
  });

  test("should be case-insensitive", () => {
    expect(checkAnswer("ABC", "abc")).toBe(true);
    expect(checkAnswer("xyz", "XYZ")).toBe(true);
  });

  test("should trim whitespace", () => {
    expect(checkAnswer("  12  ", "12")).toBe(true);
    expect(checkAnswer("24", "  24  ")).toBe(true);
  });

  test("should reject incorrect answers", () => {
    expect(checkAnswer("12", "24")).toBe(false);
    expect(checkAnswer("wrong", "right")).toBe(false);
  });
});
