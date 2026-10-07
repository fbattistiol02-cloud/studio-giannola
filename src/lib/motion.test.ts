import { afterEach, describe, expect, it, vi } from "vitest";
import { INTRO_KEY, markIntroSeen, readIntroSeen, shouldPlayIntro } from "./motion";

describe("shouldPlayIntro", () => {
  it("parte solo con movimento permesso e prima visita", () => {
    expect(shouldPlayIntro({ motionOk: true, seen: false })).toBe(true);
    expect(shouldPlayIntro({ motionOk: true, seen: true })).toBe(false);
    expect(shouldPlayIntro({ motionOk: false, seen: false })).toBe(false);
    expect(shouldPlayIntro({ motionOk: false, seen: true })).toBe(false);
  });
});

describe("memoria dell'apertura già vista", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("legge e scrive la chiave sg-intro-v1", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    });
    expect(INTRO_KEY).toBe("sg-intro-v1");
    expect(readIntroSeen()).toBe(false);
    markIntroSeen();
    expect(readIntroSeen()).toBe(true);
  });

  it("se lo storage è bloccato non lancia errori e risponde false", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(readIntroSeen()).toBe(false);
    expect(() => markIntroSeen()).not.toThrow();
  });
});
