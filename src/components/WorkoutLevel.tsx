
"use client";

import { useState } from "react";

type Level = "beginner" | "standard" | "advanced";

export default function WorkoutLevel() {
  const [level, setLevel] = useState<Level>("standard");

  const levels: {
    id: Level;
    title: string;
    description: string;
  }[] = [
    {
      id: "beginner",
      title: "Beginner",
      description: "Build technique and confidence.",
    },
    {
      id: "standard",
      title: "Standard",
      description: "Follow the prescribed workout.",
    },
    {
      id: "advanced",
      title: "Advanced",
      description: "Progress with control and purpose.",
    },
  ];

  return (
    <section className="mb-6 rounded-2xl border border-[#4B4B43] bg-[#30342F] p-6">
      <h2 className="mb-2 text-xl font-bold">
        Choose Your Level
      </h2>

      <p className="mb-5 text-sm text-[#BEB8AF]">
        Select the option that matches your current
        experience and readiness.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {levels.map((option) => (
          <button
            key={option.id}
            onClick={() => setLevel(option.id)}
            aria-pressed={level === option.id}
            className={`rounded-xl border p-4 text-left transition ${
              level === option.id
                ? "border-[#CB8269] bg-[#963C2A]"
                : "border-[#4B4B43] bg-[#202320] hover:border-[#CB8269]"
            }`}
          >
            <p className="font-bold">
              {option.title}
            </p>

            <p className="mt-2 text-sm text-[#D1C8BE]">
              {option.description}
            </p>
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-[#BEB8AF]">
        Selected: {levels.find((item) => item.id === level)?.title}
      </p>
    </section>
  );
}
