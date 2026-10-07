import { describe, expect, it } from "vitest";
import { formatRating, starFillPercent } from "./rating";

describe("stelle e voto", () => {
  it("4,4 su 5 riempie l'88% delle stelle", () => expect(starFillPercent(4.4)).toBe(88));
  it("5 su 5 riempie tutto", () => expect(starFillPercent(5)).toBe(100));
  it("0 non riempie nulla", () => expect(starFillPercent(0)).toBe(0));
  it("il voto si scrive con la virgola", () => expect(formatRating(4.4)).toBe("4,4"));
});
