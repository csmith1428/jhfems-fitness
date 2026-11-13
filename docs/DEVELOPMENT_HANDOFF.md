# Development handoff — November 10, 2026

> **Read first:** This document combines a history of the November 9 coding session with decisions from the subsequent brand discussion. The current Mac repository **was not mounted or inspected** when these Markdown files were generated. All source-file and completion claims below are **REPORTED / VERIFY IN REPO**, not an audit.

## Snapshot

- **Working project:** JHFEMS fitness / wellness application; personal Mac directory reported as `~/Desktop/jhfems-fitness`.
- **Framework reported:** Next.js 16.4.6, React / TypeScript (confirm exact installed versions via `package.json`).
- **Program plan:** 12 weeks, four workout categories each week; **Weeks 1–2 (8 sessions)** reported in the Next.js library.
- **Design selected:** **Tactical Energy**, the middle brand board. Five-color design contract in [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).
- **Name status:** *Summit Shift* appears on the reference board but has not been approved; *Ironshift* was liked as a candidate. Do not change app name automatically.
- **Backend status:** No Supabase or authenticated shared database was connected at this snapshot.
- **Storage reported:** Browser `localStorage` for workout completion/session history; not cross-device sync and not suitable for sensitive information.

## Source-file map

| Reported path | Purpose | Confidence / action |
| --- | --- | --- |
| `src/data/workouts.ts` | `Workout` interface and `workoutLibrary` | **Reported exact path**, from code excerpt; inspect before editing |
| `src/app/page.tsx` | Homepage / weekly plan | **Reported path**; inspect |
| `src/app/workouts/[id]/page.tsx` | Per-workout route / detail | **Reported path**; inspect |
| `src/app/progress/page.tsx` | Personal progress | **Reported path**; inspect |
| `src/components/WorkoutCompletion.tsx` | Completion control and local persistence flow | **Reported path**; inspect |
| `WorkoutDisplay` component | Renders workout sections and scaling | **Component name reported; path not confirmed**; locate in `src/components/` or via search |
| `src/app/globals.css` or relevant styles | Existing colors / spacing / typography | **Likely Next.js convention, not verified**; find actual stylesheet |
| `src/app/layout.tsx` | App-wide layout and typography | **Likely Next.js convention, not verified** |
| `package.json` | Scripts and dependencies | Inspect live repo before setup instructions or dependency changes |
| Older standalone `index.html` prototype | One demo week and illustrative department view | **Separate earlier prototype**; not equivalent to the active Next.js implementation |

### Commands to verify live files (run on Callie's Mac)

```bash
cd ~/Desktop/jhfems-fitness
pwd
find src -maxdepth 5 -type f | sort
cat package.json
```

Only after inspecting the repository, update this map with actual filenames. The user should not need to reconstruct the project from memory.

## Reported work completed during the November 9 session

- Initial local Next.js app scaffold and workout navigation.
- Four sessions per week pattern: Strength A, Strength B, Conditioning, Functional Fitness.
- Data-driven workout library supporting week, category, duration, warm-up, main, cooldown, and optional three-level scaling.
- Weeks 1 and 2 entered (**eight workouts**), with scaling described as functional for Week 2.
- Individual workout route rendering and a common workout display were developed.
- Workout completion and personal progress/history with local persistence were developed; undo/reset was exercised in testing earlier in the session.
- Exercise-numbering layout refined toward compact numbers. **Last approved presentation rule:** number standalone strength movements individually; use only one small number for a multi-movement AMRAP/MetCon/circuit, with workouts listed beneath.

### Important uncertainty

The prototype artifacts also include a **static HTML** JHFEMS wellness demonstration with one demo week, `localStorage`, scaling, and fictional admin aggregates. That artifact should **not** be treated as proof the Next.js version has a secure admin dashboard, all 12 weeks, or an authenticated backend. The Next.js state above is based on prior collaborative development history, not a fresh code audit.

## Most important next implementation step

**Implement block-aware workout rendering without losing the current working app.**

1. Inspect `src/data/workouts.ts` and locate the current `WorkoutDisplay` component.
2. Confirm how `main: string[]` entries encode strength, AMRAP, MetCon, and circuit work.
3. Add an explicit block model or safe parsing strategy, retaining backward compatibility with the existing string-array data.
4. Convert **one** Functional Fitness entry as a proof of concept. Verify it shows **one small number for the whole AMRAP/MetCon**, not one number per movement.
5. Confirm standalone strength exercises still display their own compact numbers.
6. Validate Week 1 and Week 2, desktop and mobile, and scaling controls before mass conversion.

See [`WORKOUT_STANDARDS.md`](WORKOUT_STANDARDS.md#5-proposed-structured-block-model) for a **proposed** typed model, not implemented code.

## Suggested work queue after that

| Priority | Work | Definition of done |
| --- | --- | --- |
| P0 | Confirm actual repository & baseline | App runs, `package.json` and source map reviewed; known working screens recorded |
| P1 | Structured groups / numbering | Strength rows and grouped circuits use the approved visual rules |
| P1 | Apply Tactical Energy tokens | Five colors centralized and tested; no unapproved extra hues |
| P1 | Workout QA | All existing eight sessions render properly with useful scales |
| P2 | Author and review Weeks 3–12 | 48 total sessions authored, reviewed, and navigable (not assumed done) |
| P2 | Account/auth and secure database decision | Privacy model specified before implementation; no claims of security until tested |
| P2 | Robust persistence | Workouts and personal progress survive intended navigation/device use when backend chosen |
| P3 | Program administration and aggregate engagement | Authorized role, access control, aggregation thresholds, no individual performance surveillance |
| P3 | Pilot deployment & feedback | Tested on common mobile/desktop devices, feedback process defined |

## Known constraints / guardrails

- **Do not** overwrite the source library with example code from these docs.
- No secure account creation, Supabase integration, real organization analytics, or real multi-user data should be marked as done without working code and tests.
- Department engagement figures in earlier prototypes were **illustrative**, not actual member data.
- Keep private performance notes out of department-wide metrics and out of shared browser demonstrations.
- Keep the program flexible for shift schedules and reasonable exercise accommodations.
- Do not reintroduce huge repetitive exercise numbers or separate numbers for every AMRAP movement.
- Do not finalize *Summit Shift* solely because it appears on the brand board.

## Decisions log

| Date | Decision | Status |
| --- | --- | --- |
| 2026-11-09 | Build the JHFEMS fitness/wellness app as a learning/development project | In progress |
| 2026-11-09 | 12-week program, four sessions per week; adaptable/scalable participation | Approved target |
| 2026-11-09 | Number strength movements individually, grouped MetCon/AMRAP once | Approved UI rule |
| 2026-11-09 | Keep branding extensible beyond firefighters; *Ironshift* positively received | Directional preference, name open |
| 2026-11-10 | Select **middle** brand board: Tactical Energy (`#F6F7EB`, `#E94F37`, `#393E41`, `#8AA3B2`, `#D8C8B0`) | **Approved palette / visual direction** |
| 2026-11-10 | Create core Markdown source-of-truth documents | Completed as a docs bundle |

## Handoff update template for next session

```md
### Session [YYYY-MM-DD]
- Repo/branch inspected:
- Files changed:
- Working features verified:
- Tests or manual checks performed:
- Decisions approved (link to updated docs):
- Open bugs / unknowns:
- Exact next coding step:
```

**Session start checklist:** Open the repo, read [`../README.md`](../README.md) and these docs, verify the codebase, then make the smallest working change. **Session end:** Update this handoff and any product/design/training docs affected.
