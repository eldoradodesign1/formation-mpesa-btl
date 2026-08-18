import { describe, expect, it } from "vitest";
import { getPresentationKeyAction } from "./presentationKeyboard";

describe("getPresentationKeyAction", () => {
  it("couvre tous les raccourcis de la présentation", () => {
    expect(getPresentationKeyAction({ key: "ArrowRight" })).toBe("next");
    expect(getPresentationKeyAction({ key: "ArrowLeft" })).toBe("previous");
    expect(getPresentationKeyAction({ key: "Home" })).toBe("start");
    expect(getPresentationKeyAction({ key: "End" })).toBe("end");
    expect(getPresentationKeyAction({ key: "g" })).toBe("sessions");
    expect(getPresentationKeyAction({ key: "?" })).toBe("help");
    expect(getPresentationKeyAction({ key: "f" })).toBe("fullscreen");
    expect(getPresentationKeyAction({ key: "a" })).toBe("assessment");
    expect(getPresentationKeyAction({ key: "Escape" })).toBe("close");
  });

  it("ignore les événements sans touche ou avec modificateur", () => {
    expect(getPresentationKeyAction({})).toBeNull();
    expect(getPresentationKeyAction({ key: undefined })).toBeNull();
    expect(getPresentationKeyAction({ key: "a", ctrlKey: true })).toBeNull();
  });
});
