
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
      <main className="min-h-screen bg-[#F8F9F7] px-6 py-12 text-[#293035]">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">
            Workout not found
          </h1>

          <p className="mt-3 text-[#596A74]">
            This workout isn't available in the program.
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
    <main className="min-h-screen bg-[#F8F9F7] text-[#293035]">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">

        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-6 border-b border-[#D9DEDF] pb-7 md:flex-row md:items-center md:justify-between">

          {/* BRAND */}
          <Link
            href="/"
            className="flex items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E94F37]"
          >
            <div
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#293035]"
            >
              {[0, 1, 2].map((line) => (
                <span
                  key={line}
                  className="h-6 w-1.5 -skew-x-[22deg] bg-[#E94F37]"
                />
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wider text-[#526D7B]">
                JACKSON HOLE FIRE/EMS
              </p>

              <p className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
                FITNESS <span className="text-[#E94F37]">&</span> WELLNESS
              </p>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav
            aria-label="Main navigation"
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/program"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#CBD4D7] bg-white px-4 py-2 text-sm font-semibold transition-colors hover:border-[#34424B] hover:bg-[#EEF2F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E94F37]"
            >
              12-Week Program
            </Link>

            <Link
              href="/progress"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#CBD4D7] bg-white px-4 py-2 text-sm font-semibold transition-colors hover:border-[#34424B] hover:bg-[#EEF2F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E94F37]"
            >
              My Progress
            </Link>
          </nav>
        </header>

        {/* BACK NAVIGATION */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-[#526D7B] transition-colors hover:text-[#C53D2A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E94F37]"
          >
            <span aria-hidden="true">←</span>
            Back to workouts
          </Link>
        </div>

        {/* WORKOUT HERO */}
        <section className="relative mb-10 overflow-hidden rounded-2xl bg-[#292E31] text-[#F6F7EB]">

          {/* ACCENT */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 h-full w-1 bg-[#E94F37]"
          />

          <div className="p-7 sm:p-10">

            {/* WEEK */}
            <p className="mb-5 text-xs font-semibold tracking-wider text-[#A8C0CD]">
              TRAINING CYCLE / WEEK {weekLabel} OF 12
            </p>

            {/* WORKOUT TITLE */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {workout.title}
            </h1>

            {/* TRAINING FOCUS */}
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#FF7863]">
              {focusLabel}
            </p>

            {/* SESSION METADATA */}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/15 pt-6">

              <div>
                <p className="text-xs text-[#A8C0CD]">
                  Estimated duration
                </p>

                <p className="mt-1 text-base font-semibold">
                  {workout.duration}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#A8C0CD]">
                  Program
                </p>

                <p className="mt-1 text-base font-semibold">
                  12-Week Training Cycle
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* WORKOUT CONTENT */}
        <div className="mx-auto max-w-3xl">

          {/* WORKOUT DISPLAY */}
          <section aria-label="Workout prescription">

            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold tracking-wider text-[#526D7B]">
                SESSION DETAILS
              </p>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Today's Training
              </h2>
            </div>

            <WorkoutDisplay workout={workout} />

          </section>

          {/* WORKOUT TRACKING */}
          <section
            aria-label="Workout completion and history"
            className="mt-8"
          >
            <WorkoutCompletion workoutId={workout.id} />
          </section>

        </div>

        {/* FOOTER */}
        <footer className="mt-14 border-t border-[#D9DEDF] pt-6">
          <p className="text-xs text-[#596A74]">
            Jackson Hole Fire/EMS · Fitness & Wellness
          </p>
        </footer>

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
