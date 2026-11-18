
import { Suspense } from "react";
import Link from "next/link";
import WorkoutCompletion from "@/components/WorkoutCompletion";
import WorkoutDisplay from "@/components/WorkoutDisplay";
import { workoutLibrary } from "@/data/workouts";

async function WorkoutDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const workout = workoutLibrary.find(
    (item) =>
      item.id === id ||
      item.id === `week-01-${id}`
  );

  if (!workout) {
    return (
      <main className="min-h-screen bg-[var(--brand-canvas)] px-6 py-12 text-[var(--brand-ink)]">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">
            Workout not found
          </h1>

          <p className="mt-3 text-[#596A74]">
            This workout isn&apos;t available in the program.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block font-semibold text-[#C53D2A]"
          >
            ← Back to workouts
          </Link>
        </div>
      </main>
    );
  }

  const weekLabel = String(workout.week).padStart(2, "0");

  const focusLabel =
    workout.category.toUpperCase() === "ENGINE"
      ? "CARDIO + ENDURANCE"
      : workout.category;

  return (
    <main className="min-h-screen bg-[var(--brand-canvas)] pb-28 text-[var(--brand-ink)] md:pb-10">
      <div className="mx-auto max-w-2xl px-5 pt-6 sm:px-8 sm:pt-9">

        {/* BACK */}
        <div className="mb-5 flex items-center gap-3">
          <Link
            href="/workouts"
            aria-label="Back to workouts"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(20,24,27,0.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>

          <p className="font-label text-[11px] uppercase tracking-widest text-[var(--brand-muted)]">
            Week {weekLabel} of 12
          </p>
        </div>

        {/* WORKOUT TITLE */}
        <section className="mb-5">
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95]">
            {workout.title}
          </h1>

          <p className="mt-2 font-label text-[11px] uppercase tracking-widest text-[var(--brand-red)]">
            {focusLabel}
          </p>

          <p className="mt-1 font-label text-xs text-[var(--brand-muted)]">
            {workout.duration}
          </p>
        </section>

        {/* WORKOUT CONTENT */}
        <section aria-label="Workout prescription">
          <WorkoutDisplay workout={workout} />
        </section>

        {/* WORKOUT TRACKING */}
        <section
          aria-label="Workout completion and history"
          className="mt-6"
        >
          <WorkoutCompletion
            key={workout.id}
            workoutId={workout.id}
          />
        </section>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return [
    { id: "strength-a" },
    { id: "strength-b" },
    { id: "conditioning" },
    { id: "functional" },
    ...workoutLibrary.map((workout) => ({
      id: workout.id,
    })),
  ];
}

export default function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8F9F7] p-10 text-[#293035]">
          Loading workout...
        </main>
      }
    >
      <WorkoutDetails params={params} />
    </Suspense>
  );
}
