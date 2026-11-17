import type { Workout } from "@/data/workouts";
import { splitWorkoutLines } from "@/lib/workoutText";

/*
  Turns a workout (plain sentences) into a list of "phases" that the
  guided screen walks through one at a time.

  A phase is either:
    - manual: the person taps when they are ready to move on, or
    - timed:  it has a duration and moves on by itself (a clock).

  If the sentences don't match a pattern we know, we fall back to a
  simple checklist screen, so nothing is ever lost or hidden.
*/

export type Tone = "go" | "rest";

export type Phase = {
  group: string; // groups share one progress bar ("Warm-up", "Block 1"...)
  title: string; // big text
  detail?: string; // line under the title
  counter?: string; // small text top-right ("Round 2 of 5", "Move 1 of 6")
  items?: string[]; // moves shown together on this screen
  itemsStyle?: "check" | "plain";
  notes?: string[]; // coaching tips
  duration?: number; // seconds. Present means the clock runs by itself.
  tone?: Tone;
};

type Block = {
  group: string;
  kind: "emom" | "rounds";
  rounds: number;
  interval?: number; // seconds, for "every 2:00"
  pace?: string; // "at a sustainable pace"
  rest?: number; // seconds between rounds
  items: string[];
  notes: string[];
};

type Segment =
  | { type: "block"; block: Block }
  | { type: "timed"; group: string; title: string; detail: string; seconds: number }
  | { type: "loose"; lines: string[] };

const EMOM =
  /^(?:(Block \d+|Finisher)\s*(?:—|,)\s*)?every (\d+):(\d{2}) for (\d+) rounds?\s*:?\s*$/i;
const ROUNDS =
  /^(?:(Block \d+|Finisher)\s*(?:—|,)\s*)?(\d+) rounds?(?:\s+at\s+(.+?))?\s*:\s*$/i;
const TECHNIQUE = /^Technique practice \((\d+) min\):\s*(.+)$/i;
const TIMED_LINE = /^(\d+(?:\.\d+)?)\s*(min|sec)\s+(.+)$/i;
const REST_BETWEEN =
  /^Rest (\d+)(?::(\d{2}))?\s*(sec|min)\b.*between rounds/i;

function capital(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toSeconds(amount: number, unit: string) {
  return Math.round(unit.toLowerCase() === "min" ? amount * 60 : amount);
}

function parseSegments(lines: string[]): Segment[] {
  const segments: Segment[] = [];
  let block: Block | null = null;
  let loose: string[] = [];

  function closeBlock() {
    if (block) segments.push({ type: "block", block });
    block = null;
  }

  function closeLoose() {
    if (loose.length > 0) segments.push({ type: "loose", lines: loose });
    loose = [];
  }

  for (const line of lines) {
    const emom = line.match(EMOM);
    const rounds = line.match(ROUNDS);
    const technique = line.match(TECHNIQUE);
    const isDigitLed = /^\d/.test(line);
    const finishLine = /\bto finish\b/i.test(line)
      ? line.match(TIMED_LINE)
      : null;

    if (finishLine) {
      // e.g. "5 min easy cycling or walking to finish"
      closeBlock();
      closeLoose();
      segments.push({
        type: "timed",
        group: "Finish",
        title: "Easy finish",
        detail: capital(line),
        seconds: toSeconds(Number(finishLine[1]), finishLine[2]),
      });
    } else if (emom) {
      closeBlock();
      closeLoose();
      block = {
        group: emom[1] ?? "Main work",
        kind: "emom",
        rounds: Number(emom[4]),
        interval: Number(emom[2]) * 60 + Number(emom[3]),
        items: [],
        notes: [],
      };
    } else if (rounds) {
      closeBlock();
      closeLoose();
      block = {
        group: rounds[1] ?? "Intervals",
        kind: "rounds",
        rounds: Number(rounds[2]),
        pace: rounds[3],
        items: [],
        notes: [],
      };
    } else if (technique) {
      closeBlock();
      closeLoose();
      segments.push({
        type: "timed",
        group: "Technique",
        title: "Technique practice",
        detail: technique[2],
        seconds: Number(technique[1]) * 60,
      });
    } else if (block) {
      const rest = line.match(REST_BETWEEN);

      if (rest) {
        const amount =
          rest[2] !== undefined
            ? Number(rest[1]) * 60 + Number(rest[2])
            : Number(rest[1]);
        block.rest = toSeconds(amount, rest[3]);
      } else if (isDigitLed) {
        block.items.push(line);
      } else {
        block.notes.push(line);
      }
    } else {
      loose.push(line);
    }
  }

  closeBlock();
  closeLoose();

  return segments;
}

function blockPhases(block: Block): Phase[] {
  const phases: Phase[] = [];
  const notes = block.notes;
  const timedItems = block.items.map((item) => item.match(TIMED_LINE));
  const allTimed =
    block.kind === "rounds" &&
    block.items.length > 0 &&
    timedItems.every((match) => match !== null);

  for (let round = 1; round <= block.rounds; round++) {
    const counter = `Round ${round} of ${block.rounds}`;

    if (block.kind === "emom") {
      phases.push({
        group: block.group,
        title: block.group,
        detail: `Every ${formatClock(block.interval ?? 0)}`,
        counter,
        items: block.items,
        itemsStyle: "plain",
        notes,
        duration: block.interval,
        tone: "go",
      });
    } else if (allTimed) {
      timedItems.forEach((match) => {
        if (!match) return;
        const text = match[3];
        const easy = /recovery|easy/i.test(text);

        phases.push({
          group: block.group,
          title: capital(text),
          counter,
          notes: easy ? undefined : notes,
          duration: toSeconds(Number(match[1]), match[2]),
          tone: easy ? "rest" : "go",
        });
      });
    } else {
      phases.push({
        group: block.group,
        title: block.group === "Intervals" ? "Main work" : block.group,
        detail: block.pace ? capital(block.pace) : undefined,
        counter,
        items: block.items,
        itemsStyle: "plain",
        notes,
        tone: "go",
      });

      if (block.rest && round < block.rounds) {
        phases.push({
          group: block.group,
          title: "Rest",
          detail: `Next up: Round ${round + 1} of ${block.rounds}`,
          counter,
          duration: block.rest,
          tone: "rest",
        });
      }
    }
  }

  return phases;
}

export function formatClock(totalSeconds: number) {
  const safe = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function buildPhases(
  workout: Workout,
  mainLines: string[]
): Phase[] {
  const phases: Phase[] = [];

  if (workout.warmup.length > 0) {
    phases.push({
      group: "Warm-up",
      title: "Warm-up",
      detail: "Do these in order. Tap to tick them off.",
      items: workout.warmup,
      itemsStyle: "check",
    });
  }

  if (workout.format === "strength") {
    const { moves, notes } = splitWorkoutLines(mainLines);

    moves.forEach((move, index) => {
      phases.push({
        group: "Main work",
        title: move.name,
        detail: move.detail,
        counter: `Move ${index + 1} of ${moves.length}`,
        notes,
      });
    });
  } else {
    const segments = parseSegments(mainLines);
    const understood = segments.some((s) => s.type !== "loose");

    if (!understood) {
      phases.push({
        group: "Main work",
        title: "Main work",
        detail: "Tap to tick them off.",
        items: mainLines,
        itemsStyle: "check",
      });
    } else {
      for (const segment of segments) {
        if (segment.type === "block") {
          phases.push(...blockPhases(segment.block));
        } else if (segment.type === "timed") {
          phases.push({
            group: segment.group,
            title: segment.title,
            detail: segment.detail,
            duration: segment.seconds,
            tone: "go",
          });
        } else {
          phases.push({
            group: "Main work",
            title: "Main work",
            items: segment.lines,
            itemsStyle: "check",
          });
        }
      }
    }
  }

  if (workout.cooldown.length > 0) {
    phases.push({
      group: "Cool-down",
      title: "Cool-down",
      detail: "Slow down and breathe. Tap to tick them off.",
      items: workout.cooldown,
      itemsStyle: "check",
    });
  }

  // The last screen must be one the person finishes by tapping.
  if (phases.length === 0 || phases[phases.length - 1].duration) {
    phases.push({
      group: "Finish",
      title: "Nice work",
      detail: "Tap finish to save your workout.",
    });
  }

  return phases;
}
