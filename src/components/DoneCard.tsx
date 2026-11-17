"use client";

import FeelPicker from "@/components/FeelPicker";
import type { Feel } from "@/lib/workoutHistory";

// The "WORKOUT DONE." card, shown after a workout is saved.
export default function DoneCard({
  title,
  level,
  week,
  weekDone,
  weekTotal,
  feel,
  onFeel,
}: {
  title: string;
  level?: string;
  week: number;
  weekDone: number;
  weekTotal: number;
  feel: Feel | undefined;
  onFeel: (feel: Feel) => void;
}) {
  return (
    <div className="text-[#F4F5F3]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-red)] shadow-[0_10px_24px_rgba(216,48,54,0.35)]">
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>

      <h2 className="mt-6 font-display text-6xl font-extrabold uppercase leading-[0.92]">
        Workout done.
      </h2>

      <p className="mt-3 font-label text-[11px] uppercase tracking-widest text-[#AEB6BC]">
        {title}
        {level ? ` · ${level}` : ""} · Week {week}
      </p>

      <div className="mt-8 border-t border-[#2A3136] pt-5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-extrabold leading-none">
            {weekDone}
          </span>
          <span className="font-display text-3xl font-bold leading-none text-[#AEB6BC]">
            /{weekTotal}
          </span>
          <span className="ml-2 text-sm text-[#C9CFD3]">
            workouts this week
          </span>
        </div>

        <div className="mt-3 flex gap-1" aria-hidden="true">
          {Array.from({ length: weekTotal }, (_, i) => (
            <div
              key={i}
              className={`h-3 flex-1 rounded ${
                i < weekDone ? "bg-[#F4F5F3]" : "bg-[#2A3136]"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <FeelPicker value={feel} onChange={onFeel} />
      </div>
    </div>
  );
}
