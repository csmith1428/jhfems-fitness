"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LEVELS,
  levelInfo,
  saveLevel,
  useSavedLevel,
  type Level,
} from "@/lib/level";

const points = [
  {
    title: "12 weeks, 4 workouts a week.",
    text: "Do them in any order that fits your shifts. Missed one? You can still go back and finish it.",
    icon: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 10h16M9 3v4M15 3v4" />
      </>
    ),
  },
  {
    title: "Tones drop? Hit Pause.",
    text: "Your workout saves and waits for you.",
    icon: <path d="M9 6v12M15 6v12" />,
  },
  {
    title: "Your numbers are yours.",
    text: "Weights, reps and how it felt are private to you. They stay on this phone.",
    icon: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
];

export default function SetupPage() {
  const router = useRouter();
  const saved = useSavedLevel();
  const [picked, setPicked] = useState<Level | null>(null);
  const [error, setError] = useState(false);

  // Someone coming back to change their level sees their current one.
  const level: Level =
    picked ?? (saved.status === "ready" ? saved.level : null) ?? "beginner";

  function start() {
    if (saveLevel(level)) {
      router.push("/");
    } else {
      setError(true);
    }
  }

  return (
    <main className="min-h-dvh bg-[var(--brand-canvas)] text-[var(--brand-ink)]">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-7">
        <div className="flex-1">
          <div>
            <p className="font-label text-[12px] uppercase tracking-widest text-[#C2272D]">
              Welcome
            </p>
            <h1 className="mt-1 font-display text-5xl font-extrabold uppercase leading-[0.95]">
              JHFEMS Fitness
            </h1>
          </div>

          <ul className="mt-6 space-y-4">
            {points.map((point) => (
              <li key={point.title} className="flex items-start gap-3">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D83036"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                >
                  {point.icon}
                </svg>

                <p className="text-[15px] leading-snug">
                  <b>{point.title}</b> {point.text}
                </p>
              </li>
            ))}
          </ul>

          <fieldset className="mt-9 space-y-2.5">
            <legend className="mb-2 font-display text-2xl font-extrabold uppercase">
              Pick your starting level
            </legend>

            {LEVELS.map((option) => {
              const selected = level === option;

              return (
                <label
                  key={option}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-white px-4 py-3.5 ${
                    selected
                      ? "border-[var(--brand-ink)]"
                      : "border-[#E3E6E2]"
                  }`}
                >
                  <input
                    type="radio"
                    name="level"
                    value={option}
                    checked={selected}
                    onChange={() => setPicked(option)}
                    className="ml-0.5 mt-0.5 h-5 w-5 shrink-0 accent-[#D83036]"
                  />

                  <span>
                    <span className="block text-base font-bold">
                      {levelInfo[option].label}
                    </span>
                    <span className="block text-sm leading-snug text-[var(--brand-muted)]">
                      {levelInfo[option].guide}
                    </span>
                  </span>
                </label>
              );
            })}

            <p className="text-[13px] text-[var(--brand-muted)]">
              Not sure? Start with Beginner. You can change it any time.
            </p>
          </fieldset>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-[#B9252B]">
            Your level couldn&apos;t be saved in this browser. You can
            still use the app and pick a level on each workout.
          </p>
        )}

        <button
          type="button"
          onClick={error ? () => router.push("/") : start}
          className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand-red)] text-[17px] font-bold text-white transition-colors hover:bg-[var(--brand-red-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-red)]"
        >
          {error ? "Continue anyway" : "Start Week 1"}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  );
}
