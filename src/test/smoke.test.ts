import { describe, expect, it } from "vitest";
import { render } from "../entry-server";

describe("render", () => {
  it("produce l'HTML della pagina con il <main>", () => {
    expect(render()).toContain("<main");
  });
});
