import { describe, expect, it } from "vitest";
import { getOpenStatus } from "./hours";
import { CLINIC } from "@/data/site";

const at = (iso: string) => getOpenStatus(new Date(iso), CLINIC.schedule);

describe("getOpenStatus — ora di Roma, qualunque sia il fuso del telefono", () => {
  it("mercoledì 10:00 (estate): aperto, chiude alle 12:00", () => {
    expect(at("2026-10-07T08:00:00Z")).toMatchObject({ open: true, detail: "chiude alle 12:00" });
  });
  it("mercoledì 12:30: chiuso, riapre oggi alle 15:00", () => {
    expect(at("2026-10-07T10:30:00Z")).toMatchObject({ open: false, detail: "riapre oggi alle 15:00" });
  });
  it("venerdì 19:30: riapre lunedì alle 9:00", () => {
    expect(at("2026-10-09T17:30:00Z")).toMatchObject({ open: false, detail: "riapre lunedì alle 9:00" });
  });
  it("domenica 20:00: riapre domani alle 9:00", () => {
    expect(at("2026-10-11T18:00:00Z")).toMatchObject({ open: false, detail: "riapre domani alle 9:00" });
  });
  it("mercoledì 9:30 con l'ora solare (inverno): aperto", () => {
    expect(at("2026-12-02T08:30:00Z")).toMatchObject({ open: true });
  });
});
