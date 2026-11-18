"use client";

import Link from "next/link";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import DoneCard from "@/components/DoneCard";
import { playCue, unlockAudio } from "@/lib/cues";
import { buildPhases, formatClock, type Phase } from "@/lib/guidedPlan";
import { useWorkoutLog } from "@/lib/workoutHistory";
import type { Workout } from "@/data/workouts";

/*
  Guided mode: full screen, dark. One "phase" on screen at a time.
  - Warm-up and cool-down are one checklist screen each.
  - Strength moves are one move per screen.
  - Circuits and intervals run a clock that moves on by itself.
*/

type State = {
  index: number;
  endAt: number | null; // when the running clock hits zero
  pausedLeft: number | null; // milliseconds left while paused
  now: number;
};

type Action =
  | { type: "tick"; now: number }
  | { type: "goto"; index: number; now: number; run: boolean }
  | { type: "pause"; now: number }
  | { type: "resume"; now: number };

function reduce(phases: Phase[], state: State, action: Action): State {
  switch (action.type) {
    case "tick": {
      if (state.endAt === null) return { ...state, now: action.now };

      let index = state.index;
      let endAt: number | null = state.endAt;

      // Catch up if the phone was asleep for a while.
      while (endAt !== null && endAt <= action.now) {
        if (index >= phases.length - 1) {
          return {
            index,
            endAt: null,
            pausedLeft: 0,
            now: action.now,
          };
        }

        index += 1;
        const seconds = phases[index].duration;
        endAt = seconds === undefined ? null : endAt + seconds * 1000;
      }

      return { index, endAt, pausedLeft: null, now: action.now };
    }

    case "goto": {
      const index = Math.min(
        Math.max(action.index, 0),
        phases.length - 1
      );
      const seconds = phases[index].duration;

      if (seconds === undefined) {
        return { index, endAt: null, pausedLeft: null, now: action.now };
      }

      return action.run
        ? {
            index,
            endAt: action.now + seconds * 1000,
            pausedLeft: null,
            now: action.now,
          }
        : {
            index,
            endAt: null,
            pausedLeft: seconds * 1000,
            now: action.now,
          };
    }

    case "pause": {
      if (state.endAt === null) return state;

      return {
        ...state,
        endAt: null,
        pausedLeft: Math.max(state.endAt - action.now, 0),
        now: action.now,
      };
    }

    case "resume": {
      const seconds = phases[state.index].duration;

      if (state.endAt !== null || seconds === undefined) return state;

      return {
        ...state,
        endAt: action.now + (state.pausedLeft ?? seconds * 1000),
        pausedLeft: null,
        now: action.now,
      };
    }
  }
}

// "8 kettlebell swings" -> big "8" and "KETTLEBELL SWINGS".
function splitItem(item: string) {
  const match = item.match(/^(\d+(?:\.\d+)?(?:\s?(?:m|min|sec))?)\b\s+(.+)$/);

  return match
    ? { amount: match[1], text: match[2] }
    : { amount: "", text: item };
}

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
  const phases = useMemo(
    () => buildPhases(workout, mainLines),
    [workout, mainLines]
  );

  const [state, dispatch] = useReducer(
    (current: State, action: Action) => reduce(phases, current, action),
    { index: 0, endAt: null, pausedLeft: null, now: 0 }
  );
  const [finished, setFinished] = useState(false);
  // Checklist items ticked this session (just for you, not saved).
  const [ticked, setTicked] = useState<string[]>([]);

  const phase = phases[state.index];
  const next = phases[state.index + 1];
  const isLast = state.index === phases.length - 1;
  const timed = phase.duration !== undefined;
  const running = state.endAt !== null;

  const remainingMs = !timed
    ? 0
    : state.endAt !== null
      ? Math.max(state.endAt - state.now, 0)
      : (state.pausedLeft ?? (phase.duration ?? 0) * 1000);

  const notStarted =
    timed && !running && remainingMs === (phase.duration ?? 0) * 1000;

  // Keep the clock ticking while it is running.
  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(
      () => dispatch({ type: "tick", now: Date.now() }),
      250
    );

    return () => window.clearInterval(id);
  }, [running]);

  // Beep when a running clock runs out and the next step begins.
  const lastIndex = useRef(state.index);
  const wasRunning = useRef(false);

  useEffect(() => {
    if (lastIndex.current !== state.index) {
      lastIndex.current = state.index;
      if (wasRunning.current) playCue();
    }

    wasRunning.current = running;
  }, [state.index, running]);

  // Keep the screen awake during the workout.
  useEffect(() => {
    const held: { lock: WakeLockSentinel | null } = { lock: null };
    let cancelled = false;

    async function acquire() {
      try {
        if (!("wakeLock" in navigator)) return;

        const sentinel = await navigator.wakeLock.request("screen");

        if (cancelled) {
          void sentinel.release();
        } else {
          held.lock = sentinel;
        }
      } catch {
        // Not allowed here. The screen may dim, that's all.
      }
    }

    function onVisible() {
      if (document.visibilityState === "visible") void acquire();
    }

    void acquire();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      void held.lock?.release().catch(() => {});
    };
  }, []);

  function go(index: number, run: boolean) {
    unlockAudio();
    dispatch({ type: "goto", index, now: Date.now(), run });
  }

  // Moving forward from a tap-screen, or while the clock runs, keeps going.
  function forward() {
    go(state.index + 1, !timed || running);
  }

  function toggleClock() {
    unlockAudio();
    dispatch({
      type: running ? "pause" : "resume",
      now: Date.now(),
    });
  }

  function toggleItem(key: string) {
    setTicked((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  }

  function finish() {
    if (log.complete("")) {
      setFinished(true);
    }
  }

  // Progress: one bar per group of phases.
  const groups = phases.reduce<
    { name: string; start: number; count: number }[]
  >((list, item, index) => {
    const last = list[list.length - 1];

    if (last && last.name === item.group) {
      last.count += 1;
    } else {
      list.push({ name: item.group, start: index, count: 1 });
    }

    return list;
  }, []);

  const primaryLabel = isLast
    ? "Finish workout"
    : timed
      ? running
        ? "Pause"
        : notStarted
          ? "Start timer"
          : "Resume"
      : phase.counter?.startsWith("Round")
        ? "Round done"
        : `Next · ${next.title}`;

  function onPrimary() {
    if (isLast) finish();
    else if (timed) toggleClock();
    else forward();
  }

  const clockColor =
    phase.tone === "rest" ? "text-[#AEB6BC]" : "text-[#F4F5F3]";

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

            {/* PROGRESS: one bar per group */}
            <div className="mt-6">
              <div className="flex justify-between gap-3 font-label text-[11px] uppercase tracking-widest text-[#AEB6BC]">
                <span>{phase.group}</span>
                <span>{phase.counter ?? ""}</span>
              </div>

              <div className="mt-2 flex gap-1.5" aria-hidden="true">
                {groups.map((group) => {
                  const fill = Math.min(
                    Math.max(
                      (state.index - group.start + 1) / group.count,
                      0
                    ),
                    1
                  );

                  return (
                    <div
                      key={`${group.name}-${group.start}`}
                      style={{
                        flexGrow: Math.min(Math.max(group.count, 2), 6),
                      }}
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

            {/* THIS SCREEN */}
            <div className="flex-1 pt-7">
              {timed && (
                <div role="timer" aria-label="Time left">
                  <p
                    className={`font-label text-[11px] uppercase tracking-widest ${
                      phase.tone === "rest"
                        ? "text-[#AEB6BC]"
                        : "text-[var(--brand-red-soft)]"
                    }`}
                  >
                    {phase.tone === "rest" ? "Rest" : "Go"}
                  </p>

                  <p
                    className={`font-display text-8xl font-extrabold leading-[0.95] tabular-nums ${clockColor}`}
                  >
                    {formatClock(remainingMs / 1000)}
                  </p>
                </div>
              )}

              <h2
                className={`font-display font-extrabold uppercase leading-[0.95] ${
                  timed ? "mt-3 text-3xl" : "text-5xl"
                }`}
              >
                {phase.title}
              </h2>

              {phase.detail && (
                <p
                  className={`leading-snug ${
                    phase.items && phase.itemsStyle === "check"
                      ? "mt-2 text-sm text-[#C9CFD3]"
                      : "mt-3 text-lg text-[#E4E7E9]"
                  }`}
                >
                  {phase.detail}
                </p>
              )}

              {/* CHECKLIST (warm-up, cool-down) */}
              {phase.items && phase.itemsStyle === "check" && (
                <ul className="mt-5 divide-y divide-[#2A3136] rounded-2xl bg-[var(--brand-night-card)]">
                  {phase.items.map((item) => {
                    const key = `${state.index}:${item}`;
                    const isTicked = ticked.includes(key);

                    return (
                      <li key={key}>
                        <button
                          type="button"
                          aria-pressed={isTicked}
                          onClick={() => toggleItem(key)}
                          className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left"
                        >
                          <span
                            aria-hidden="true"
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold ${
                              isTicked
                                ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                                : "border-[#4A535A] text-transparent"
                            }`}
                          >
                            ✓
                          </span>

                          <span
                            className={`text-[15px] leading-snug ${
                              isTicked
                                ? "text-[#8E979D]"
                                : "text-[#F4F5F3]"
                            }`}
                          >
                            {item}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* MOVES FOR THIS ROUND */}
              {phase.items && phase.itemsStyle === "plain" && (
                <ul className="mt-5 border-t border-[#2A3136]">
                  {phase.items.map((item) => {
                    const { amount, text } = splitItem(item);

                    return (
                      <li
                        key={item}
                        className="flex min-h-16 items-center gap-4 border-b border-[#2A3136] py-2"
                      >
                        {amount && (
                          <span className="min-w-14 font-display text-4xl font-extrabold leading-none">
                            {amount}
                          </span>
                        )}

                        <span className="font-display text-2xl font-extrabold uppercase leading-tight">
                          {text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {phase.notes && phase.notes.length > 0 && (
                <div className="mt-5 rounded-2xl bg-[var(--brand-night-card)] p-4">
                  <p className="font-label text-[11px] uppercase tracking-widest text-[#AEB6BC]">
                    Coach notes
                  </p>

                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-[#C9CFD3]">
                    {phase.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {timed && next && next.group !== phase.group && (
                <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[var(--brand-night-card)] px-4 py-3">
                  <span className="font-label text-[11px] uppercase tracking-widest text-[#AEB6BC]">
                    Up next
                  </span>

                  <span className="text-sm font-semibold">
                    {next.group}
                  </span>
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

              <button
                type="button"
                autoFocus
                onClick={onPrimary}
                className={`flex h-14 items-center justify-center gap-2 rounded-2xl px-4 text-base font-bold ${
                  isLast
                    ? "bg-[var(--brand-red)] text-white"
                    : "bg-[#F4F5F3] text-[var(--brand-night)]"
                }`}
              >
                <span className="truncate">{primaryLabel}</span>
                {!isLast && !timed && (
                  <span aria-hidden="true">→</span>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={state.index === 0}
                  onClick={() => go(state.index - 1, false)}
                  className="h-12 rounded-xl border border-[#3A4248] text-sm font-semibold disabled:opacity-40"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={isLast}
                  onClick={forward}
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
