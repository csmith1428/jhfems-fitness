# Workout content & presentation standards

**Updated:** 2026-11-10  
**Purpose:** Preserve workout programming intent and the display decisions made during initial coding.

## 1. Program framework

**Planned cycle:** 12 weeks, four prescribed workout sessions each week (48 total when authored). Sessions are flexible within the week and do not require a fixed sequence tied to shift days.

1. **Strength A** — typically lower-body + push emphasis.
2. **Strength B** — typically hinge + pull emphasis.
3. **Conditioning** — aerobic, intervals, or structured work capacity.
4. **Functional Fitness** — functional movement, circuits, AMRAP, EMOM, or MetCon format.

**Current reported content:** Weeks 1 and 2 (eight workouts) have been entered into the Next.js workout library. These are **not** the complete 12-week program. Verify in `src/data/workouts.ts` before expanding or revising content.

A complete cycle should follow a coherent progression, alternate appropriate training stress, and support recovery. Exact load, volume, progression phases, deloads, and exercise suitability should be reviewed by the program author before publication; do not fill unfinished weeks with unsupported prescriptions just to reach 48.

## 2. Standard session anatomy

Every workout should clearly identify:

- Week, session type, name, and approximate duration.
- Training objective or intended stimulus (recommended addition).
- Warm-up with practical movement preparation.
- Main work, including strength sets or well-defined conditioning blocks.
- Cooldown/recovery suggestion.
- Scaling for **Beginner**, **Standard**, and **Advanced** where applicable.
- Substitutions or adaptations as content becomes available.

Write complete prescriptions: sets × reps, time, rest, equipment, distance, intensity, or round count as relevant. Avoid vague instructions like “do some cardio” when a more useful dose can be stated.

## 3. Existing data model (reported from November 9 coding)

The current TypeScript workout library uses a simple string-array structure. This shape is **source guidance based on prior coding**, not a fresh inspection of the Mac repository:

```ts
export type Workout = {
  id: string;
  week: number;
  title: string;
  category: string;
  duration: string;
  warmup: string[];
  main: string[];
  cooldown: string[];
  scaling?: {
    beginner: string[];
    standard: string[];
    advanced: string[];
  };
};

export const workoutLibrary: Workout[] = [
  // Week 1–2 workouts currently reported; inspect live data before editing.
];
```

**Primary source:** `src/data/workouts.ts` (reported existing). Do not paste this sample over the actual library. The design below proposes a non-breaking way to extend it.

## 4. Formatting contract

### Strength blocks

Number strength movements **individually**, with subtle numbers and a readable prescription:

```text
STRENGTH A
01  Goblet squat                 3 × 8   Rest 90 s
02  Dumbbell bench press        3 × 10  Rest 75 s
03  Chest-supported row         3 × 10  Rest 75 s
```

These are formatting examples, **not assigned program exercises**.

### AMRAP, MetCon, and circuits

Give each coherent block **one subtle number**. Show movements as unnumbered lines beneath the block:

```text
FUNCTIONAL FITNESS
02  AMRAP · 12 minutes
    8 box step-ups
    10 push-ups
    12 kettlebell deadlifts
```

**Never** number each movement as a separate primary exercise inside the AMRAP/MetCon. Maintain the intended order and movement quantities. If several blocks exist, they can each have a block number.

### EMOM / interval work

```text
CONDITIONING
01  EMOM · 12 minutes
    Minute 1: 10 calories on bike
    Minute 2: 8 controlled step-ups
    Minute 3: Rest
    Repeat for 4 cycles
```

Include precise work/rest and rounds; don't imply that an interval is free-form. Examples are schematic, not part of the program.

### Numbering hierarchy

Small block or exercise number → prominent movement/block title → secondary prescription → optional coaching/safety note. Block headers must be visually distinct from the movements they contain. See [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md#5-critical-workout-numbering-rule-approved).

## 5. PROPOSED structured block model

The current `main: string[]` format is convenient but cannot reliably distinguish a standalone exercise from a grouped circuit. A **future code change** could add structured workout blocks. Do not introduce this as if it already exists.

```ts
type WorkoutBlock = {
  id: string;
  type: "strength" | "circuit" | "amrap" | "emom" | "intervals" | "metcon";
  title: string;
  duration?: string;
  rounds?: string;
  rest?: string;
  movements: { name: string; prescription: string; notes?: string }[];
};

// Proposal: add `blocks?: WorkoutBlock[]` to Workout,
// while temporarily supporting the existing `main: string[]`.
```

**Migration approach:** First inspect the current UI and workout data. Add typed block rendering with a fallback for existing workouts. Convert one Functional Fitness session and one Strength session, verify correct grouping, then migrate the remaining entries. Do not rewrite all eight sessions blindly.

## 6. Scaling and modifications

- Maintain three clear levels (the TypeScript keys are `beginner`, `standard`, `advanced`). Older HTML prototypes sometimes used the word **Foundation**; avoid mixing keys and labels unless the mapping is explicit.
- Scaling should preserve the session's intended training effect by modifying load, range of motion, complexity, volume, intensity, or rest as appropriate.
- Provide useful low-impact/no-jumping/equipment alternatives where warranted.
- A user may modify a workout due to an injury or another limitation without entering a diagnosis, posting a reason, or losing credit.
- Never encourage pushing through sharp or escalating pain. Personal rehab restrictions and clinician guidance take precedence over generic workouts.
- Do not assume that beginner means universally easy or advanced means universally appropriate.

## 7. Completion and logging

The session can be marked complete without requiring performance data. Optional fields may include load, rounds, duration, or personal notes. Completion must be tied to the actual session identifier, with a reviewable history and no accidental multiple-counting. In the current pilot, state has been reported as browser-local; verify storage keys and UI behavior before changing persistence.

**Do not** build department-level leaderboards or expose individual performance information under the guise of wellness engagement.

## 8. Content QA before publishing a week

- Every session has an explicit purpose and reasonable expected duration.
- Warm-up and cooldown exist and are relevant.
- Prescriptions are unambiguous and use consistent units.
- Exercises, progression, and recovery have received appropriate domain review.
- Beginner / Standard / Advanced entries are useful, not copy-pasted labels.
- Grouped circuits and intervals render as **one block**, not a number per movement.
- Mobile layout preserves ordered steps, times, and notes.
- No training advice contradicts an individual's clinical restrictions; clear adaptations exist where needed.
- Exercises are not added solely to satisfy a visual layout.

## 9. Editorial voice

Direct, encouraging, concise. Use ordinary exercise terminology rather than exaggerated motivational slogans. Explain the *why* when helpful, keep prescriptions easy to follow at a glance, and avoid punishing language around skipped sessions or accommodations.
