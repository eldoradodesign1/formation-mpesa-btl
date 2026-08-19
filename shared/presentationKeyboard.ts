export type PresentationKeyAction = "next" | "previous" | "start" | "end" | "sessions" | "help" | "fullscreen" | "assessment" | "close" | null;

type EditableTarget = {
  tagName?: unknown;
  isContentEditable?: unknown;
};

export function isEditableKeyboardTarget(target: EditableTarget | null | undefined) {
  if (!target) return false;
  if (target.isContentEditable === true) return true;
  if (typeof target.tagName !== "string") return false;
  return ["input", "textarea", "select"].includes(target.tagName.toLowerCase());
}

type KeyboardInput = {
  key?: unknown;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

export function getPresentationKeyAction(event: KeyboardInput): PresentationKeyAction {
  if (event.metaKey || event.ctrlKey || event.altKey || typeof event.key !== "string") return null;
  const key = event.key;
  const normalized = key.toLowerCase();
  if (key === "ArrowRight" || key === "PageDown" || key === " ") return "next";
  if (key === "ArrowLeft" || key === "PageUp" || key === "Backspace") return "previous";
  if (key === "Home") return "start";
  if (key === "End") return "end";
  if (normalized === "g" || normalized === "m") return "sessions";
  if (key === "?" || (key === "/" && event.shiftKey)) return "help";
  if (normalized === "f") return "fullscreen";
  if (normalized === "a") return "assessment";
  if (key === "Escape") return "close";
  return null;
}
