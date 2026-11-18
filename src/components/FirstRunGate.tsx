"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LEVEL_KEY, isLevel } from "@/lib/level";
import { useStoredString } from "@/lib/useStoredString";

// Sends someone who hasn't picked a level yet to the setup screen.
// If the browser blocks storage we can't remember a choice, so we
// leave them on the home screen instead of sending them in circles.
export default function FirstRunGate() {
  const router = useRouter();
  const stored = useStoredString(LEVEL_KEY);
  const needsSetup = stored.status === "ready" && !isLevel(stored.value);

  useEffect(() => {
    if (needsSetup) router.replace("/setup");
  }, [needsSetup, router]);

  return null;
}
