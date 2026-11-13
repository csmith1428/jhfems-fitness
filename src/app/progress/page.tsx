
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { workoutLibrary } from "@/data/workouts";

type WorkoutSession = {
  id: string;
  workoutId: string;
  completedAt: string;
  notes: string;
};

const STORAGE_KEY = "jhfems-workout-history";

const workoutNames: Record<string, string> = {
  "strength-a": "Strength A",
  "strength-b": "Strength B",
  conditioning: "Conditioning",
  functional: "Functional Fitness",
};

function getWorkoutName(workoutId: string) {
  const workout = workoutLibrary.find(
    (item) => item.id === workoutId
  );

  return workout?.title ?? workoutNames[workoutId] ?? workoutId;
}

function isWorkoutSession(value: unknown): value is WorkoutSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<WorkoutSession>;

  return (
    typeof item.id === "string" &&
    typeof item.workoutId === "string" &&
    typeof item.completedAt === "string" &&
    typeof item.notes === "string"
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProgressPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const history: unknown = saved ? JSON.parse(saved) : [];

      if (
        !Array.isArray(history) ||
        !history.every(isWorkoutSession)
      ) {
        throw new Error("Invalid workout history format");
      }

      setSessions(history);
    } catch (error) {
      console.error("Unable to load workout history:", error);
      setLoadError(true);
    }

    setLoaded(true);
  }, []);

  const sortedSessions = [...sessions].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() -
      new Date(a.completedAt).getTime()
  );

  // Count distinct local calendar days.
  const trainingDays = new Set(
    sessions.flatMap((session) => {
      const date = new Date(session.completedAt);

      if (Number.isNaN(date.getTime())) {
        return [];
      }

      return [
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      ];
    })
  ).size;

  return (
    <main className="min-h-screen bg-[#F8F9F7] text-[#293035]">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">

        {/* HEADER */}
        <header className="mb-9 flex flex-col gap-6 border-b border-[#D9DEDF] pb-7 md:flex-row md:items-center md:justify-between">
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
              aria-current="page"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#293035] bg-[#293035] px-4 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E94F37]"
            >
              My Progress
            </Link>
          </nav>
        </header>

        {/* PAGE HERO */}
        <section className="relative mb-10 overflow-hidden rounded-2xl bg-[#292E31] p-7 text-[#F6F7EB] sm:p-10">
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 h-full w-1 bg-[#E94F37]"
          />

          <p className="mb-4 text-xs font-semibold tracking-wider text-[#A8C0CD]">
            PERSONAL TRAINING
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            My Progress
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#CBD5D9] sm:text-base">
            Your completed workouts, training consistency,
            and personal performance notes in one place.
          </p>
        </section>

        {!loaded ? (
          <section
            role="status"
            className="rounded-2xl border border-[#D9DEDF] bg-white p-8 text-sm text-[#596A74]"
          >
            Loading your training history...
          </section>
        ) : loadError ? (
          <section
            role="alert"
            className="rounded-2xl border border-[#E94F37] bg-white p-8"
          >
            <h2 className="text-lg font-bold">
              Unable to load workout history
            </h2>

            <p className="mt-2 text-sm text-[#596A74]">
              Your stored records have not been changed.
              Please check your browser storage before
              recording another workout.
            </p>
          </section>
        ) : (
          <>
            {/* TRAINING OVERVIEW */}
            <section className="mb-10">
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold tracking-wider text-[#526D7B]">
                  TRAINING OVERVIEW
                </p>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Your Activity
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">

                {/* TOTAL WORKOUTS */}
                <div className="rounded-2xl bg-[#34424B] p-5 text-[#F6F7EB] sm:p-8">
                  <p className="text-xs font-semibold text-[#C4D3DB] sm:text-sm">
                    Total Workouts
                  </p>

                  <p className="mt-5 text-4xl font-extrabold tabular-nums sm:text-6xl">
                    {sessions.length}
                  </p>

                  <div className="mt-6 border-t border-white/15 pt-4">
                    <p className="text-xs leading-relaxed text-[#CBD5D9] sm:text-sm">
                      Completed training sessions
                    </p>
                  </div>
                </div>

                {/* TRAINING DAYS */}
                <div className="rounded-2xl bg-[#34424B] p-5 text-[#F6F7EB] sm:p-8">
                  <p className="text-xs font-semibold text-[#C4D3DB] sm:text-sm">
                    Training Days
                  </p>

                  <p className="mt-5 text-4xl font-extrabold tabular-nums sm:text-6xl">
                    {trainingDays}
                  </p>

                  <div className="mt-6 border-t border-white/15 pt-4">
                    <p className="text-xs leading-relaxed text-[#CBD5D9] sm:text-sm">
                      Days with recorded activity
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* WORKOUT HISTORY */}
            <section className="overflow-hidden rounded-2xl border border-[#D9DEDF] bg-white">

              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E0E5E7] p-6 sm:p-8">
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wider text-[#526D7B]">
                    PERSONAL TRAINING RECORD
                  </p>

                  <h2 className="text-2xl font-bold tracking-tight">
                    Workout History
                  </h2>

                  <p className="mt-2 text-sm text-[#596A74]">
                    Most recent sessions first.
                  </p>
                </div>

                <span className="text-sm font-medium text-[#596A74]">
                  {sessions.length} recorded
                </span>
              </div>

              <div className="p-5 sm:p-8">
                {sortedSessions.length === 0 ? (
                  <div className="py-10 text-center">
                    <h3 className="text-lg font-bold">
                      No workouts recorded yet
                    </h3>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#596A74]">
                      Complete a workout to begin building
                      your personal training history.
                    </p>

                    <Link
                      href="/"
                      className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#E94F37] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C53D2A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E94F37]"
                    >
                      View Workouts →
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E0E5E7]">
                    {sortedSessions.map((session) => (
                      <article
                        key={session.id}
                        className="py-6 first:pt-0 last:pb-0"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">

                            <span
                              aria-hidden="true"
                              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E94F37] text-sm font-bold text-white"
                            >
                              ✓
                            </span>

                            <div>
                              <h3 className="text-lg font-bold tracking-tight text-[#293035]">
                                {getWorkoutName(session.workoutId)}
                              </h3>

                              <p className="mt-1 text-xs text-[#596A74]">
                                Completed session
                              </p>
                            </div>
                          </div>

                          <time
                            dateTime={session.completedAt}
                            className="text-sm text-[#596A74]"
                          >
                            {formatDate(session.completedAt)}
                          </time>
                        </div>

                        {session.notes && (
                          <div className="mt-4 rounded-lg bg-[#F1F4F5] p-4 sm:ml-10">
                            <p className="mb-2 text-xs font-semibold text-[#526D7B]">
                              Session notes
                            </p>

                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[#34424B]">
                              {session.notes}
                            </p>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* FOOTER */}
        <footer className="mt-14 border-t border-[#D9DEDF] pt-6">
          <p className="text-xs text-[#596A74]">
            Jackson Hole Fire/EMS · Fitness & Wellness
          </p>

          <p className="mt-3 max-w-xl text-xs leading-relaxed text-[#718087]">
            Development preview: Workout history is stored
            in this browser only. It does not sync between
            devices, and clearing browser data may remove it.
            Avoid entering sensitive personal information.
          </p>
        </footer>
      </div>
    </main>
  );
}
