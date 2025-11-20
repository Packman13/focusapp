// Basic E2E test script for full 180 second session

import { SessionEngine, Phase } from "../lib/SessionEngine";

describe("E2E Session Flow", () => {
  test("should complete full 180 second session with all phases", (done) => {
    const engine = new SessionEngine();
    const phasesEncountered: Phase[] = [];
    let endEventReceived = false;

    const unsubscribe = engine.subscribe((event) => {
      if (event.type === "phase") {
        phasesEncountered.push(event.phase);
      }

      if (event.type === "end") {
        endEventReceived = true;
        unsubscribe();

        // Verify all phases were encountered
        expect(phasesEncountered).toContain("B_FOCUS");
        expect(phasesEncountered).toContain("C_PERF");
        expect(phasesEncountered).toContain("DONE");
        expect(endEventReceived).toBe(true);

        done();
      }
    });

    engine.start();
  }, 185000); // Give extra time for completion

  test("should maintain correct timing across phases", (done) => {
    const engine = new SessionEngine();
    const phaseTimings: { phase: Phase; elapsedMs: number }[] = [];

    const unsubscribe = engine.subscribe((event) => {
      if (event.type === "phase") {
        phaseTimings.push({
          phase: event.phase,
          elapsedMs: event.elapsedMs
        });
      }

      if (event.type === "end") {
        unsubscribe();

        // Check Phase B starts at ~60s
        const phaseB = phaseTimings.find(p => p.phase === "B_FOCUS");
        expect(phaseB).toBeDefined();
        if (phaseB) {
          expect(phaseB.elapsedMs).toBeGreaterThanOrEqual(59000);
          expect(phaseB.elapsedMs).toBeLessThanOrEqual(61000);
        }

        // Check Phase C starts at ~120s
        const phaseC = phaseTimings.find(p => p.phase === "C_PERF");
        expect(phaseC).toBeDefined();
        if (phaseC) {
          expect(phaseC.elapsedMs).toBeGreaterThanOrEqual(119000);
          expect(phaseC.elapsedMs).toBeLessThanOrEqual(121000);
        }

        done();
      }
    });

    engine.start();
  }, 185000);
});
