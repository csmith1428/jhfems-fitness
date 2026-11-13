
"use client";

import { useEffect, useState } from "react";
import { workoutLibrary } from "@/data/workouts";

type Workout = (typeof workoutLibrary)[number];
type Level = "beginner" | "standard" | "advanced";

const levels: Level[] = [
  "beginner",
  "standard",
  "advanced",
];

function SectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="text-xs font-bold tracking-wider text-[#D83036]">
        {number}
      </span>

      <h3 className="text-xl font-bold text-[#292E31]">
        {title}
      </h3>
    </div>
  );
}

export default function WorkoutDisplay({
  workout,
}: {
  workout: Workout;
}) {
  const [level, setLevel] = useState<Level>("standard");
  const [checked, setChecked] = useState<number[]>([]);
  const [loadedKey, setLoadedKey] = useState("");
  const [saveError, setSaveError] = useState(false);

  const exercises = workout.scaling
    ? workout.scaling[level]
    : workout.main;

  const grouped =
    workout.format !== undefined &&
    workout.format !== "strength" &&
    exercises.length > 1;

  const groupTitle = grouped ? exercises[0] : null;

  const mainItems = grouped
    ? exercises.slice(1)
    : exercises;

  const storageKey =
    `jhfems-exercise-checks:${workout.id}:${level}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed: unknown = saved
        ? JSON.parse(saved)
        : [];

      if (
        !Array.isArray(parsed) ||
        !parsed.every(
          (item) =>
            Number.isInteger(item) &&
            item >= 0
        )
      ) {
        throw new Error("Invalid checklist data");
      }

      setChecked(
        [...new Set(parsed as number[])].filter(
          (index) => index < mainItems.length
        )
      );

      setSaveError(false);
    } catch {
      setChecked([]);
      setSaveError(true);
    }

    setLoadedKey(storageKey);
  }, [storageKey, mainItems.length]);

  const currentChecked =
    loadedKey === storageKey ? checked : [];

  const completedCount = currentChecked.length;
  const totalCount = mainItems.length;

  const progress =
    totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : 0;

  function toggleExercise(index: number) {
    const next = currentChecked.includes(index)
      ? currentChecked.filter((item) => item !== index)
      : [...currentChecked, index];

    setChecked(next);

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(next)
      );
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }

  function resetChecklist() {
    setChecked([]);

    try {
      localStorage.removeItem(storageKey);
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }

  return (
    <div className="space-y-4">

      {/* TRAINING LEVEL */}
      {workout.scaling && (
        <section className="rounded-2xl bg-[#303639] p-5 text-white sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold">
              Choose Your Level
            </h3>

            <p className="mt-1 text-sm text-[#C3D0D6]">
              Select the variation that fits your training today.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {levels.map((option) => {
              const selected = level === option;

              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setLevel(option)}
                  className={`min-h-12 rounded-lg border px-2 py-3 text-xs font-semibold capitalize transition-all sm:text-sm ${
                    selected
                      ? "border-[#D83036] bg-[#D83036] text-white"
                      : "border-[#637179] bg-[#3D484D] text-[#D2DEE2] hover:border-[#A6B6BE]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* WARM-UP */}
      <section className="rounded-2xl border border-[#DEE4E6] bg-white p-5 sm:p-6">
        <SectionHeading number="01" title="Warm-up" />

        <ul className="space-y-3">
          {workout.warmup.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm leading-relaxed text-[#45565E]"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B9BA3]"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* MAIN WORK */}
      <section className="rounded-2xl border border-[#DEE4E6] bg-[#F6F7EB] p-5 sm:p-6">
        <SectionHeading number="02" title="Main Work" />

        {/* PROGRESS */}
        <div className="mb-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#45565E]">
              Exercise checklist
            </p>

            <span className="text-xs font-semibold text-[#657780]">
              {completedCount} of {totalCount} checked
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="Exercise checklist progress"
            aria-valuemin={0}
            aria-valuemax={totalCount || 1}
            aria-valuenow={completedCount}
            className="h-2 overflow-hidden rounded-full bg-[#DCE2E2]"
          >
            <div
              className="h-full rounded-full bg-[#D83036] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* GROUPED CONDITIONING / CIRCUIT TITLE */}
        {groupTitle && (
          <div className="mb-3 rounded-xl border border-[#DCE2E3] bg-white p-4">
            <p className="text-xs font-bold tracking-wider text-[#D83036]">
              SESSION FORMAT
            </p>

            <p className="mt-2 text-sm font-semibold leading-relaxed text-[#292E31]">
              {groupTitle}
            </p>
          </div>
        )}

        {/* EXERCISE CHECKLIST */}
        <div className="space-y-2">
          {mainItems.map((exercise, index) => {
            const isChecked =
              currentChecked.includes(index);

            return (
              <button
                key={`${level}-${index}`}
                type="button"
                aria-pressed={isChecked}
                aria-label={`${isChecked ? "Uncheck" : "Check off"} exercise ${index + 1}: ${exercise}`}
                onClick={() => toggleExercise(index)}
                className={`flex min-h-16 w-full items-center gap-3 rounded-xl border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D83036] ${
                  isChecked
                    ? "border-[#E3C4C6] bg-[#FFF8F8]"
                    : "border-[#DEE4E6] bg-white hover:border-[#B2C0C6]"
                }`}
              >
                {/* CHECK ICON */}
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                    isChecked
                      ? "border-[#D83036] bg-[#D83036] text-white"
                      : "border-[#A6B3BA] bg-white text-transparent"
                  }`}
                >
                  ✓
                </span>

                {/* EXERCISE CONTENT */}
                <div className="min-w-0 flex-1">
                  {!grouped && (
                    <span className="mb-1 block text-[10px] font-bold tracking-wider text-[#8A989F]">
                      EXERCISE {String(index + 1).padStart(2, "0")}
                    </span>
                  )}

                  <p
                    className={`text-sm font-semibold leading-relaxed ${
                      isChecked
                        ? "text-[#657780]"
                        : "text-[#292E31]"
                    }`}
                  >
                    {exercise}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* RESET */}
        {completedCount > 0 && (
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={resetChecklist}
              className="text-xs font-semibold text-[#667780] underline underline-offset-4 hover:text-[#D83036]"
            >
              Reset exercise checks
            </button>
          </div>
        )}

        {saveError && (
          <p role="alert" className="mt-4 text-xs text-[#B9252B]">
            Checklist changes couldn't be saved in this browser.
          </p>
        )}
      </section>

      {/* COOLDOWN */}
      <section className="rounded-2xl border border-[#DEE4E6] bg-white p-5 sm:p-6">
        <SectionHeading number="03" title="Cooldown" />

        <ul className="space-y-3">
          {workout.cooldown.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm leading-relaxed text-[#45565E]"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B9BA3]"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* GUIDANCE */}
      <p className="px-1 text-xs leading-relaxed text-[#71818A]">
        Exercise checkmarks help you track your session.
        They do not log workout completion. Use
        &quot;Mark workout complete&quot; below when you finish.
      </p>
    </div>
  );
}
