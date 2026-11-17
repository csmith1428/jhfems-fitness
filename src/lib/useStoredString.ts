"use client";

import { useSyncExternalStore } from "react";

/*
  Reads a localStorage value as React state.

  localStorage lives outside React, so instead of copying it into
  state inside an effect, we subscribe to it with
  useSyncExternalStore. Components re-render whenever the value is
  written through writeStoredString() in this tab, or changed in
  another tab (the browser's "storage" event).
*/

export type StoredString =
  | { status: "loading" } // server render / before hydration
  | { status: "unavailable" } // browser blocked storage access
  | { status: "ready"; value: string | null };

const UNAVAILABLE = Symbol("storage-unavailable");

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useStoredString(key: string): StoredString {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return UNAVAILABLE;
      }
    },
    () => undefined
  );

  if (raw === undefined) return { status: "loading" };
  if (raw === UNAVAILABLE) return { status: "unavailable" };
  return { status: "ready", value: raw };
}

/*
  Writes (or removes, when value is null) a localStorage value and
  notifies every component using useStoredString. Throws if the
  browser refuses the write, so callers can show an error.
*/
export function writeStoredString(key: string, value: string | null) {
  if (value === null) {
    window.localStorage.removeItem(key);
  } else {
    window.localStorage.setItem(key, value);
  }

  listeners.forEach((notify) => notify());
}
