/*
  Where someone stopped in a guided workout, saved in this browser so
  a call-out never loses their place.
*/

export type GuidedProgress = {
  index: number;
  savedAt: number;
  title: string;
  sub: string;
};

export function progressKey(workoutId: string, levelLabel: string) {
  return `jhfems-guided-progress:${workoutId}:${levelLabel.toLowerCase()}`;
}

export function parseProgress(
  saved: string | null
): GuidedProgress | null {
  if (!saved) return null;

  try {
    const value: unknown = JSON.parse(saved);

    if (
      value &&
      typeof value === "object" &&
      Number.isInteger((value as GuidedProgress).index) &&
      (value as GuidedProgress).index > 0 &&
      typeof (value as GuidedProgress).title === "string" &&
      typeof (value as GuidedProgress).sub === "string"
    ) {
      return value as GuidedProgress;
    }
  } catch {
    // Unreadable. Treat it as nothing saved.
  }

  return null;
}

export function readProgress(key: string): GuidedProgress | null {
  try {
    return parseProgress(window.localStorage.getItem(key));
  } catch {
    return null;
  }
}
