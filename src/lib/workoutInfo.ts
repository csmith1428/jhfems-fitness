/*
  Plain-language helpers that read a workout's sentences:
    - which equipment it needs
    - how many sets and reps a strength move has
*/

const EQUIPMENT: { label: string; test: RegExp }[] = [
  { label: "Barbell and rack", test: /barbell|squat rack|trap bar/i },
  { label: "Dumbbells", test: /\bDBs?\b|dumbbell|farmer carry|goblet/i },
  { label: "Kettlebell", test: /kettlebell|\bKBs?\b/i },
  { label: "Bench or box", test: /bench|\bbox\b|step-ups?|box jump/i },
  { label: "Pull-up bar", test: /pull-?ups?|chin-?ups?|dead hang/i },
  { label: "Bands", test: /\bbands?\b|band pull|banded/i },
  { label: "Cardio machine", test: /\bbike\b|assault|\brow\b|rower|row erg|ski erg|skierg|treadmill/i },
  { label: "Med or slam ball", test: /med(icine)? ball|slam ball|wall ball/i },
  { label: "Jump rope", test: /jump rope|skipping/i },
  { label: "Cable", test: /\bcable/i },
  { label: "Landmine", test: /landmine/i },
  { label: "Weighted vest", test: /\bvest\b/i },
  { label: "Mat", test: /\bmat\b|plank|dead bug|glute bridge|bird dog/i },
];

export function equipmentFor(...groups: string[][]) {
  const text = groups.flat().join("\n");

  return EQUIPMENT.filter((item) => item.test.test(text)).map(
    (item) => item.label
  );
}

export type SetPlan = {
  sets: number;
  reps: string; // e.g. "6 reps at RPE 7", "40 sec", "8 each leg"
};

// "4 × 6 at RPE 7" -> { sets: 4, reps: "6 reps at RPE 7" }
export function parseSets(detail: string): SetPlan | null {
  const match = detail.match(/^(\d+)\s*[×x]\s*(.+)$/i);

  if (!match) return null;

  const amount = match[2].trim();
  // "6 at RPE 7" -> "6 reps at RPE 7"; "40 sec" and "8 each leg" stay.
  const plain = amount.match(
    /^(\d+(?:[–-]\d+)?)\b(?!\s*(?:sec|min|each|reps?))(.*)$/i
  );

  return {
    sets: Number(match[1]),
    reps: plain ? `${plain[1]} reps${plain[2]}` : amount,
  };
}

// Rest between sets, in seconds. Reads "Rest 90 sec between sets".
// Falls back to 90 seconds.
export function restBetweenSets(notes: string[]) {
  for (const note of notes) {
    const match = note.match(/^Rest (\d+) (sec|min) between sets/i);

    if (match) {
      return Number(match[1]) * (match[2].toLowerCase() === "min" ? 60 : 1);
    }
  }

  return 90;
}

// Short "4 × 6" label for the preview list; the rest of the sentence
// still shows under it.
export function shortSets(detail: string) {
  const match = detail.match(
    /^\d+\s*[×x]\s*[\d–-]+(?:\s*(?:sec|min))?(?:\s*each (?:leg|side|arm))?/i
  );

  return match ? match[0] : null;
}
