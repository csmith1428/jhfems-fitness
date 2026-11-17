"use client";

import Link from "next/link";
import { useState } from "react";
import DoneCard from "@/components/DoneCard";
import { splitWorkoutLines } from "@/lib/workoutText";
import { useWorkoutLog } from "@/lib/workoutHistory";
import type { Workout } from "@/data/workouts";

type Step = {
  section: "Warm-up" | "Main work" | "Cool-down";
  name: string;
  detail: string;
};

function toSteps(
  section: Step["section"],
  lines: string[]
): Step[] {
  return lines.map((line) => {
    const at = line.indexOf(" — ");

    return at === -1
      ? { section, name: line, detail: "" }
      : {
          section,
          name: line.slice(0, at).trim(),
          detail: line.slice(at + 3).trim(),
        };
  });
}

/*
  Gym mode: one move at a time, full screen, dark.
  Used for strength workouts. Warm-up, main work and
  cool-down all appear as steps, in order.
*/
export default function GuidedWorkout({
  workout,
  levelLabel,
  mainLines,
  onClose,
}: {
  workout: Workout;
  levelLabel: string;
  mainLines: string[];
  onClose: () => void;
}) {
  const log = useWorkoutLog(workout.id);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const { moves: mainMoves, notes } = splitWorkoutLines(mainLines);

  const steps: Step[] = [
    ...toSteps("Warm-up", workout.warmup),
    ...mainMoves.map((move) => ({
      section: "Main work" as const,
      name: move.name,
      detail: move.detail,
    })),
    ...toSteps("Cool-down", workout.cooldown),
  ];

  const step = steps[index];
  const isLast = index === steps.length - 1;
  const next = steps[index + 1];

  const sections: Step["section"][] = [
    "Warm-up",
    "Main work",
    "Cool-down",
  ];

  function finish() {
    if (log.complete("")) {
      setFinished(true);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${workout.title} guided workout`}
      className="fixed inset-0 z-[70] overflow-y-auto bg-[var(--brand-night)] text-[#F4F5F3]"
    >
      <div className="mx-auto flex min-h-full max-w-md flex-col px-5 pb-7 pt-5">
        {finished ? (
          <>
            <div className="flex-1 pt-10">
              {log.error && (
                <p
                  role="alert"
                  className="mb-4 rounded-xl border border-[var(--brand-red)] p-3 text-sm"
                >
                  {log.error}
                </p>
              )}

              <DoneCard
                title={workout.title}
                level={levelLabel}
                week={workout.week}
                weekDone={log.weekDone}
                weekTotal={log.weekTotal}
                feel={log.lastSession?.feel}
                onFeel={(feel) => log.updateLast({ feel })}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/"
                className="flex h-14 items-center justify-center rounded-2xl bg-[#F4F5F3] text-base font-bold text-[var(--brand-night)]"
              >
                Back to my week
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-xl border border-[#3A4248] text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            {/* TOP BAR */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                aria-label="Leave guided workout"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-night-card)]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <p className="font-label text-[11px] uppercase tracking-widest text-[#AEB6BC]">
                {workout.title} · {levelLabel}
              </p>

              <div className="w-11" />
            </div>

            {/* PROGRESS: one bar per section */}
            <div className="mt-6">
              <div className="flex justify-between font-label text-[11px] uppercase tracking-widest text-[#AEB6BC]">
                <span>{step.section}</span>
                <span>
                  Step {index + 1} of {steps.length}
                </span>
              </div>

              <div className="mt-2 flex gap-1.5" aria-hidden="true">
                {sections.map((section) => {
                  const start = steps.findIndex(
                    (s) => s.section === section
                  );
                  const count = steps.filter(
                    (s) => s.section === section
                  ).length;

                  if (count === 0) return null;

                  const fill = Math.min(
                    Math.max((index - start + 1) / count, 0),
                    1
                  );

                  return (
                    <div
                      key={section}
                      style={{ flexGrow: count }}
                      className="h-2 basis-0 overflow-hidden rounded bg-[#2A3136]"
                    >
                      <div
                        className="h-full bg-[var(--brand-red)] transition-all"
                        style={{ width: `${fill * 100}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* THE MOVE */}
            <div className="flex-1 pt-8">
              <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.95]">
                {step.name}
              </h2>

              {step.detail && (
                <p className="mt-4 text-lg leading-snug text-[#E4E7E9]">
                  {step.detail}
                </p>
              )}

              {step.section === "Main work" && notes.length > 0 && (
                <div className="mt-6 rounded-2xl bg-[var(--brand-night-card)] p-4">
                  <p className="font-label text-[11px] uppercase tracking-widest text-[#AEB6BC]">
                    Coach notes
                  </p>

                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-[#C9CFD3]">
                    {notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex flex-col gap-3">
              {log.error && (
                <p
                  role="alert"
                  className="rounded-xl border border-[var(--brand-red)] p-3 text-sm"
                >
                  {log.error}
                </p>
              )}

              {isLast ? (
                <button
                  type="button"
                  autoFocus
                  onClick={finish}
                  className="flex h-14 items-center justify-center rounded-2xl bg-[var(--brand-red)] text-base font-bold text-white"
                >
                  Finish workout
                </button>
              ) : (
                <button
                  type="button"
                  autoFocus
                  onClick={() => setIndex(index + 1)}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#F4F5F3] px-4 text-base font-bold text-[var(--brand-night)]"
                >
                  <span className="truncate">Next · {next.name}</span>
                  <span aria-hidden="true">→</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => setIndex(index - 1)}
                  className="h-12 rounded-xl border border-[#3A4248] text-sm font-semibold disabled:opacity-40"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={isLast}
                  onClick={() => setIndex(index + 1)}
                  className="h-12 rounded-xl border border-[#3A4248] text-sm font-semibold disabled:opacity-40"
                >
                  Skip
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
