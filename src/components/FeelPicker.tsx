"use client";

import type { Feel } from "@/lib/workoutHistory";

const options: { id: Feel; label: string }[] = [
  { id: "easy", label: "Too easy" },
  { id: "just-right", label: "Just right" },
  { id: "tough", label: "Too hard" },
];

// "How did it feel?" (private, optional)
export default function FeelPicker({
  value,
  onChange,
}: {
  value: Feel | undefined;
  onChange: (feel: Feel) => void;
}) {
  return (
    <div className="rounded-2xl bg-[var(--brand-night-card)] p-5">
      <p className="font-label text-[11px] uppercase tracking-widest text-[#AEB6BC]">
        How did it feel?
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {options.map((option) => {
          const selected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={`min-h-12 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                selected
                  ? "bg-[var(--brand-red)] text-white"
                  : "bg-[var(--brand-night)] text-[#F4F5F3] hover:bg-[#2A3136]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-[#AEB6BC]">
        Optional. Private to you.
      </p>
    </div>
  );
}
