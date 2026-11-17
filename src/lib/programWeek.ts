/*
  Program calendar settings.

  PROGRAM_START_DATE is the first day (a Monday) of Week 1.
  To change when the program starts, edit this one line.
  Use the format YYYY-MM-DD.

  NOTE: This date is a placeholder until the real pilot start date
  is confirmed.
*/
export const PROGRAM_START_DATE = "2026-11-09";

export const TOTAL_WEEKS = 12;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/*
  Works out which program week it is today.

  - Before the start date, it returns Week 1.
  - After Week 12, it stays on Week 12.
  - Each week runs Monday through Sunday.
*/
export function getCurrentWeek(now: Date = new Date()): number {
  const [year, month, day] = PROGRAM_START_DATE.split("-").map(Number);

  // Compare calendar days only (ignoring the time of day), using the
  // device's local time zone so the week rolls over at local midnight.
  const startDay = Date.UTC(year, month - 1, day);
  const today = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const daysSinceStart = Math.floor((today - startDay) / MS_PER_DAY);
  const week = Math.floor(daysSinceStart / 7) + 1;

  return Math.min(Math.max(week, 1), TOTAL_WEEKS);
}
