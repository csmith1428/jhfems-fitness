# JHFEMS Fitness & Wellness — Project Handoff

**Prepared:** November 17, 2026  
**Audience:** Claude or another development collaborator  
**Status:** Active local Next.js prototype; 12-week pilot concept in development  
**Source of truth:** The Git repository, current source files, and decisions confirmed by the project owner. This document describes intent and reported progress, **not a verified code audit**.

## 1. Purpose and product vision

Build a polished, mobile-first fitness and wellness application for Jackson Hole Fire/EMS (JHFEMS). The application should make it genuinely easy for firefighters and EMS personnel to follow a shared, periodized training program while optionally tracking personal progress.

**Core product principles**

- **Simple participation:** A member should be able to open the app, view this week's workouts, and mark a workout complete with minimal friction.
- **Useful depth, not mandatory data entry:** Members who want to can log sets, repetitions, loads, time, effort, and personal notes. Others can complete the workout in one tap.
- **Shared programming:** All members follow the same calendar-based 12-week cycle, with four prescribed sessions per week.
- **Privacy by design:** A member's personal exercise data is private. Department leaders see adoption/completion **in aggregate**, not identifiable exercise logs or health/profile details.
- **Operational practicality:** The app should work well on phones, including in a station gym where workouts may be accessed by QR code.
- **Professional visual identity:** Purposeful and engaging rather than flashy, gimmicky, or full of motivational slogans.

## 2. Program structure

The planned initial pilot is a **12-week program** with **four workouts per week**:

| Workout | Focus | Typical emphasis |
|---|---|---|
| Strength A | Lower + Push | Squat, press, accessories, core |
| Strength B | Hinge + Pull | Deadlift/hinge, pulls, rows, carries |
| Conditioning | Cardio + Endurance | Aerobic or interval capacity |
| Functional Fitness | Work Capacity | Job-relevant circuits, carries, sled work, mixed modalities |

- Program uses progression and progressive overload across 8–12 weeks, with specific warmups, main work, cooldowns, and appropriate rest guidance.
- Eventually offer scaling tiers: **Beginner / Standard / Advanced**.
- Each member should see **the current program week** by default; don't expose the entire future 12-week workout library by default. A program/calendar screen may show structure and completed history without revealing future prescriptions.
- The department expects **two weekly strength sessions**; the full program comprises four offered workouts.
- Pilot success should be assessed through department-level adoption and usage, not individual surveillance.

### Example programming already discussed (illustrative, not a verified full library)

- Week 1 Strength A: squat, bench, lunge, push-ups, plank.
- Week 1 Strength B: deadlift, pull-ups, dumbbell row, Romanian deadlift, farmer carry.
- Week 1 Conditioning: six rounds of 2:2 on a bike.
- Week 1 Functional Fitness: sled, farmer carry, dumbbell push press, step-ups.
- Week 2 Strength A has been discussed with scaling options and rest guidance.

**Important:** Inspect `src/data/workouts.ts` or equivalent in the repository for the actual current workout prescription and data model. Do not assume these examples match the latest committed code.

## 3. User experience and navigation

### Desired core journey

1. Member scans a QR code or opens the app on a phone.
2. Arrives at **Home**, a personal overview of current week, progress, and next workout.
3. Opens **Workouts**, showing the four current-week workout cards.
4. Opens an individual workout with warmup, exercise instructions, prescribed sets/reps/load or duration, cooldown, and optional logging controls.
5. Taps **Complete Workout**; completion persists reliably for that member.
6. Returns to **Progress** to review personal workout history, notes, and trends.

### Mobile-first navigation target

Persistent bottom navigation:

- **Home** — personal dashboard, next session, weekly compliance, quick start.
- **Workouts** — the four current-week sessions.
- **12-Week Program** — calendar/phase overview without disclosing future workout prescriptions by default.
- **Progress** — personal history, trends, achievements, and optional metrics.

Use clear icons, readable labels, touch-friendly targets, and safe-area padding. On desktop, adapt to a sensible header or side navigation without losing the mobile information architecture.

### Desired dashboard cues

- Week and program-phase orientation.
- Four weekly session statuses; light-touch completion feedback.
- Exercise-level checkmarks where useful.
- Notes and optional logged details.
- Weekly check-ins and subtle, restrained positive reinforcement.
- Department dashboard for **aggregate** engagement only; not a window into individual profiles.

## 4. Visual direction — confirmed preferences

Visual identity is **off-white / gunmetal / slate blue / restrained red**.

| Element | Preferred treatment |
|---|---|
| Page canvas | `#F8F9F7` off-white |
| Primary accent | `#D83036` true red, not orange/coral |
| Red hover | Darker red than primary |
| Workout cards | `#34424B` slate blue |
| Workout card hover | `#293943` |
| Gunmetal surface (historical secondary nav) | `#393E41`, hover `#303639` |
| Supporting tones | Ivory, charcoal, cool neutral gray, muted steel blue |

Specific requests:

- Four workout cards should be prominent and compelling, with depth and tasteful hover/press states.
- Place the red workout-focus label **below** its workout title.
- Use **“Cardio + Endurance”**, not “Engine,” as the Conditioning focus label.
- Avoid beige/tan/brown/sand palette accents.
- Avoid excessive uppercase, over-tracked text, badges/pills, slogans, and stereotypical AI-generated marketing aesthetics.
- Remove the slogan **“BUILT FOR THE CREW. DRIVEN BY CONSISTENCY.”**
- Prefer a balanced, modern, professional interface: bold enough to feel energetic but not cluttered.
- Aim for mobile UI polish comparable in *usability* to quality fitness apps, while preserving the project's distinct branding.

**Workflow preference:** Approve layout, typography, spacing, and color in high-fidelity wireframes/design files before repeatedly making aesthetic changes in production code. Explain tradeoffs simply and provide constructive design critique.

## 5. Reported technical setup and progress

The project owner is learning software development and appreciates direct, step-by-step instructions and clear explanations of *why* actions matter.

**Reported stack**

- Next.js **16.4.6** with App Router and Turbopack.
- TypeScript.
- Tailwind CSS **v4-related packages** (seen in error output).
- Node.js **v26.13.0** and npm **v11.20.0** in the latest terminal session.
- Intel/x64 macOS: `uname -m` = `x86_64`, `process.arch` = `x64`.
- Git/GitHub intended for collaboration and code review.

**Reported project entry points (verify current tree):**

- `src/app/page.tsx` or other app home page.
- `src/app/workouts/[id]/page.tsx` or equivalent workout details route.
- `src/data/workouts.ts` or equivalent workout data library.
- Program calendar screen.
- Progress/history screen.
- `src/app/brand.css`, `src/app/globals.css`, `src/app/layout.tsx`.

**Already experimented with / reported as implemented in prototype**

- Four current-week workout cards and individual workout detail pages.
- Workout completion actions and a workout history interface.
- Local browser storage using a key named `jhfems-workout-history`.
- Reset and last-session/completion-state handling.
- Notes input, week labels, and navigation improvements.
- Central color variables for visual refinement.

**These are historical implementation notes, not guarantees about current branch state.** Inspect the code and test before making architecture decisions.

### Recent environment issue and working recovery

The project previously lived at `~/Desktop/jhfems-fitness` and repeatedly failed with missing native/module files:

- `Cannot find module '../lightningcss.darwin-x64.node'`
- `node_modules/lightningcss-darwin-x64/lightningcss.darwin-x64.node` missing on disk despite the package appearing in `npm ls`.
- `node_modules/next/dist/server/capsize-font-metrics.json` also reported missing.

The owner restored a working environment by creating a fresh project copy **outside Desktop**:

```bash
mkdir -p ~/Developer
rsync -av --exclude=node_modules --exclude=.next \
  ~/Desktop/jhfems-fitness/ ~/Developer/jhfems-fitness/
cd ~/Developer/jhfems-fitness
npm ci --include=optional --cache "$HOME/.npm-jhfems-fresh"
node -e "require('lightningcss'); console.log('Lightning CSS: SUCCESS')"
ls -l node_modules/next/dist/server/capsize-font-metrics.json
npm run dev
```

The user confirmed this **worked**. The exact underlying cause is unconfirmed; Desktop/iCloud offloading and/or incomplete installed dependencies remain possible factors. Treat `~/Developer/jhfems-fitness` as the active local project unless the owner says otherwise. Do **not** keep switching between Desktop and Developer copies, and do **not** assume the Desktop copy is current. Check the active Git remote/branch and recent commits.

## 6. New requested features and enhancements

These are the next major **product wishes**, not necessarily implemented features.

### A. Built-in workout timer

Provide optional timing tools wherever a prescribed workout needs them:

- **Stopwatch** for elapsed effort/time trials.
- **Countdown timer** for prescribed intervals or rest.
- **Interval timer** for work/rest repeats and conditioning blocks.
- Exercise-specific presets from workout data, with manual override when appropriate.
- Clear controls: start, pause, resume, reset; accessible from the workout screen without disruptive navigation.
- Mobile-friendly, readable, and resilient to accidental navigation. Evaluate whether timers should continue while the app is backgrounded; don't promise OS-level background execution or notifications without testing browser limitations.
- Timer outputs should optionally populate the member's workout log, e.g., best interval, round completion time, or overall effort duration.

**Suggested implementation order:** build a reliable stopwatch/countdown, then intervals and timer-driven logging.

### B. More polished mobile interface

- Refine responsive layout, spacing, text hierarchy, and workout card size.
- Prioritize 320–430px phone widths and tap-target accessibility.
- Persistent bottom nav, appropriate safe-area insets, sticky context where useful.
- Streamline workout detail views; consider expandable exercise details so instructions don't bury logging controls.
- Test on real iOS Safari and Android Chrome, not only desktop responsive mode.

### C. Personal workout and profile tracking

The owner wants members to be able to track **times, weights, age, etc.** Clarify product definitions before building everything:

- **Workout metrics:** load/weight lifted, sets, reps, RPE, time, distance, rounds, completed exercises, optional notes.
- **Personal profile (optional):** age or age bracket, body weight, training experience, goal preferences; distinguish `bodyWeight` from `loadWeight` in naming.
- **Performance tracking:** progression by movement, personal bests, trend charts, previous logged performance displayed during workout.
- **Completion:** always permit a one-tap completion without requiring profile or exercise-level metrics.
- Choose measurement units (lb/kg, miles/km) and ensure consistent conversions/display.
- Minimize health/personal data collection, explain purpose, and allow users to view/edit/delete their own information.

**Critical architecture decision:** current browser `localStorage` is device/browser-specific, not a reliable per-user cross-device account system. Plan account identity/authentication and a persistent backend before promising multi-device history or dependable department reporting. Do not treat a localStorage prototype as production-ready.

### D. Workout FAQ and helpful guidance

Add contextual FAQs, not a huge help center users must search through:

- **Program FAQ:** Why two strength days? How should four sessions fit around a fire/EMS shift schedule? Can members swap days? How is progression managed?
- **Workout FAQ:** What if I miss a workout? How much rest between sets? How do I choose weight? How do I scale a movement? What does RPE mean?
- **Technique and safety:** concise exercise descriptions, setup cues, common mistakes, safe alternatives, and when to stop or ask a qualified professional.
- **App FAQ:** How does completion work? Are my metrics private? Can I edit a log? What if I lose connection? How does the program week update?
- Place short FAQs or “?” help controls on workout/exercise screens; keep a searchable general FAQ as a secondary entry point.
- Editorial content should be reviewed by appropriately qualified program staff; do not make unsupported injury-specific or medical claims.

### E. Longer-horizon possibilities (not immediate MVP requirements)

- Nutrition, hydration, calories (only with a clear optional scope and privacy model).
- Garmin/wearable integrations, dependent on actual APIs, permissions, and platform support.
- More granular adherence metrics and check-ins.
- Future pilot refinement based on member feedback.

## 7. Data/privacy and admin requirements

Two distinct modes of data use:

1. **Member experience:** identifiable private history is visible to the member, with optional workout logging and profile details.
2. **Department reporting:** aggregate-only usage/adoption analytics such as unique active members and number of completions over time. Avoid leaderboards or views exposing who did/did not work out unless explicitly discussed and approved with informed participation, policy review, and privacy safeguards.

Before deploying beyond a demo:

- Decide whether members must log in, and how access/identity is provisioned.
- Decide where sensitive personal data lives, who can access it, and retention/deletion procedures.
- Agree on consent/transparency language and how age/bodyweight data is handled.
- Add server-side authorization checks, not only hidden UI controls.
- Define whether completion is voluntary and how department reporting is described to staff.
- Consider what the app can support offline, and how data sync/conflicts behave.

## 8. Suggested prioritized roadmap

| Priority | Deliverable | Reason / acceptance criterion |
|---|---|---|
| P0 | Audit active repo, stabilize development workflow | App starts reliably; dependency health test and basic checks documented |
| P0 | Confirm current screens and 12-week program data model | Avoid rebuilding features already present; current week is computed correctly |
| P1 | Mobile-first navigation and workout detail polish | Phone-sized pages are readable and fast to use; persistent nav works |
| P1 | Timer MVP | Stopwatch/countdown work reliably within workout context |
| P1 | Optional exercise logging | Save/edit weights, reps, sets, times, RPE, and notes; one-tap completion remains |
| P1 | Workout/program FAQs | Concise contextual help accessible from relevant screens |
| P2 | Accounts and durable cross-device data | Private profile/workout history persist correctly across sessions/devices |
| P2 | Privacy-safe department adoption analytics | Only aggregation available to department admin roles |
| P2 | Interval timer, richer trends, scaling tiers | Preset conditioning sessions; progression and alternatives supported |
| P3 | Wearables, nutrition, hydration | Evaluate demand and implementation risk after pilot |

Priorities can change after repository review. Avoid taking on authentication, wearables, timers, and redesign simultaneously.

## 9. Git and collaboration workflow

Requested standard feature workflow:

1. Start from a clean, updated base branch; **create a dedicated feature branch before changes**. Examples: `feat/workout-timer`, `feat/mobile-navigation`, `feat/workout-logging`.
2. Define user story, acceptance criteria, data changes, and testing approach.
3. Implement incremental changes; use meaningful **conventional commits** (e.g., `feat(timer): add countdown controls`).
4. Run applicable checks (`npm run lint`, `npm run build`, tests, type checks — inspect available scripts first).
5. Push the branch and open a GitHub pull request with a concise description, screenshots for UI changes, and test results.
6. **Do not auto-merge.** Owner reviews and approves changes.

The owner also asked for repository Markdown documentation describing this workflow. Check for an existing workflow file before creating a duplicate.

## 10. Recommended next session with Claude

1. Open the **active** local project: `~/Developer/jhfems-fitness`.
2. Inspect `package.json`, lockfile, `src/app`, data model, styling files, and Git status/remote.
3. Produce a short **current-state audit** separating *implemented*, *partially implemented*, and *planned* functionality.
4. Identify mobile UX issues with screenshots or a screen inventory and propose high-fidelity wireframes before code changes.
5. Recommend **one** first feature branch (likely timer MVP or mobile nav polish), plus scope and acceptance criteria.
6. Begin implementation only after the owner approves the plan; explain commands and changes for a beginner learning the stack.

### Starter prompt to paste into Claude

> You are taking over development collaboration on my JHFEMS Fitness & Wellness Next.js project. Read `JHFEMS_FITNESS_HANDOFF.md` first, then audit my actual repository before changing any code. Separate confirmed codebase facts from assumptions in the handoff. I am learning development, so explain important decisions plainly but do not overexplain basics. Preserve the established styling (off-white, slate blue, true red), the four-workout 12-week program, optional one-tap completion, personal privacy, and aggregate-only department analytics. I want a polished mobile-first interface, future integrated stopwatch/countdown/interval timers, optional tracking of sets/loads/times/RPE and age/bodyweight as appropriate, and contextual FAQs. Recommend a small, prioritized first task. Follow a feature-branch → meaningful commits → checks → push → PR workflow and **never merge automatically**. Do not overwrite or redesign working features without showing me a plan and explaining why.

## 11. Open questions to confirm before implementation

- Is **Tailboard** the final app name, a collaborator nickname, or a separate product? Use **JHFEMS Fitness & Wellness** as the working title until confirmed.
- What is the pilot launch date and who controls the program's “current week” rollover?
- Is the current login/account mechanism nonexistent, prototype-only, or already in progress?
- Which personal metrics are most valuable initially? Are age and body weight truly needed, or merely optional ideas?
- Does the department want aggregate analytics on workout completions only, or also page/app usage?
- Should the timer persist between screens / backgrounding, and should members be able to save its result automatically?
- Who will review workout FAQs and movement substitutions?
- Is a high-fidelity wireframing tool (such as Figma) being used yet?

---

**Handoff rule:** This file records the project's history and intentions. The Git repository remains authoritative for current implementation; the owner is authoritative for product decisions. When they conflict, stop and confirm rather than silently replacing working functionality.
