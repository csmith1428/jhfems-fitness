/*
  Helpers for reading workout lines like
  "Barbell squat — 4 × 6 at RPE 7".

  A line with " — " is a move (name + how to do it).
  A line without it is a coaching note (like "Rest 90 sec").
*/

export type Move = { name: string; detail: string };

export function splitWorkoutLines(lines: string[]) {
  const moves: Move[] = [];
  const notes: string[] = [];

  for (const line of lines) {
    const at = line.indexOf(" — ");

    if (at === -1) {
      notes.push(line);
    } else {
      moves.push({
        name: line.slice(0, at).trim(),
        detail: line.slice(at + 3).trim(),
      });
    }
  }

  return { moves, notes };
}
