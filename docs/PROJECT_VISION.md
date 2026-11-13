# Project vision & product requirements

**Updated:** 2026-11-10  
**Decision state:** Core purpose approved; several later-stage features remain proposed.

## 1. Purpose

Build an enjoyable, practical fitness and wellness application that makes occupationally relevant exercise easier to start and sustain. The first audience is Jackson Hole Fire/EMS (JHFEMS) personnel. The product should work for different fitness backgrounds and fit around shift work rather than enforcing one rigid calendar.

The experience should feel like a quality training product, **not** like compliance software or an employee-ranking system.

## 2. Intended users

- **Primary:** Firefighters, EMTs, paramedics, and other JHFEMS members participating voluntarily.
- **Secondary (future opportunity):** Other fire/EMS departments, then potentially nurses, law-enforcement personnel, and other shift-based workers.
- **Program steward:** An authorized department wellness/program coordinator who manages program content.
- **Department leadership (future):** May receive high-level participation summaries only after secure aggregation and access controls exist.

Design for capable adult users who may have limited time, different equipment, varied experience, or temporary training constraints. Do not frame beginner or modified workouts as lesser accomplishments.

## 3. Core product principles

1. **Prescribed, adaptable programming.** Everyone is offered the same four weekly session categories, with practical adjustments for experience, available equipment, fatigue, or injury-related restrictions.
2. **Consistency over punishment.** Make progress and recovery visible without shaming missed days or encouraging inappropriate training through pain.
3. **Useful to shift workers.** A member can complete the week's sessions in a flexible order rather than being tied to a Monday–Friday calendar.
4. **Fast on the station floor.** A mobile-first interface with readable session instructions, minimal taps, and immediate, restrained feedback.
5. **Professional and approachable.** Confident design language with no clutter, aggressive macho framing, or unnecessary administrative tasks.
6. **Respect personal privacy.** No individual performance surveillance or department-visible injury details.

## 4. Initial training experience

**Planned program:** 12 weeks × 4 sessions/week = **48 prescribed workouts** when the cycle is complete.

| Session | Core intent |
| --- | --- |
| Strength A | Strength training emphasis, often lower-body + push |
| Strength B | Complementary strength emphasis, often hinge + pull |
| Conditioning | Aerobic / interval / work-capacity training |
| Functional Fitness | Multi-movement circuits, AMRAPs, MetCons, or practical capacity |

The intent is to balance training stimulus and recovery, not to promise that every user should perform every exercise as written. Specific progression, work:rest ratios, and individual prescriptions belong in the workout library and require a training-content review.

### Member journey

1. Open a weekly plan and see the four assigned sessions.
2. Select a session and review its purpose, estimated duration, warm-up, main work, and cooldown.
3. Choose a scaling level and/or an appropriate substitution.
4. Follow an easy-to-scan workout display with correctly grouped intervals/circuits.
5. Optionally record loads, rounds, times, or comments, and mark the session complete.
6. See personal progress without comparison to coworkers.

## 5. Pilot scope versus future scope

| Capability | Product decision | Delivery status as of documentation |
| --- | --- | --- |
| 12-week schedule / four sessions per week | **Approved target** | Weeks 1–2 reported in Next.js; remaining weeks not complete |
| Beginner / Standard / Advanced scales | **Approved** | Reported in current workout data/display; verify in repo |
| Workout selection and detail pages | **Approved** | Reported in local Next.js build |
| Completion and personal progress | **Approved** | Reported using browser-local storage |
| Optional training log | **Approved intent** | Some prototype support; verify current Next.js fields |
| Equipment substitutions and injury-related adaptation | **Approved principle** | Content and UI coverage require review |
| Persistent, secure user accounts | **Future implementation** | Not yet implemented / verified |
| Real departmental aggregate metrics | **Future implementation** | Older HTML prototype displayed illustrative numbers only |
| Publish/manage workouts through an admin interface | **Proposed later phase** | Not implemented / verified |
| Wider paid product or commercial rollout | **Possible longer-term opportunity** | No commitment, pricing, or go-to-market decision |

## 6. Privacy, trust, and safety

- Personal workout performance, logs, notes, and any health-related details should not be available to supervisors or coworkers by default.
- Future admin reporting should expose **aggregate participation**, not individual weights, scores, diagnoses, accommodations, or comparative rankings. Define minimum group sizes and access controls before releasing reports.
- Do not collect medical diagnoses merely to offer alternatives. A user should be able to choose an easier or alternate movement without explaining why.
- Training content is general fitness education; users remain responsible for following their clinical restrictions and professional care guidance where applicable.
- Support clear low-impact alternatives, rest, recovery, and stopping when an exercise is unsafe.
- Browser `localStorage` is a temporary pilot technique, **not** secure user authentication or cross-device data storage. Avoid storing sensitive health details in it.

## 7. Success signals for the pilot

Assess usability and voluntary engagement rather than raw workout intensity. Useful measures include opt-in participation, percentage of users who start a session, completion consistency, difficulty finding/scaling sessions, accessibility feedback, and whether the program fits shift schedules. Decide consent, access, and reporting practices before collecting organization-level metrics. There are **no approved numeric targets yet**.

## 8. Naming and identity

**Approved:** Tactical Energy visual direction and five-color palette, detailed in [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).

**Not finalized:** Product name and logo. *Summit Shift* is an illustrative name printed on the brand board. *Ironshift* is an appealing candidate because it could extend beyond firefighting. *FireFit OS* should not be reintroduced as the name without a new decision. An emoji flame is explicitly not the chosen branding approach.

## 9. Non-goals for the first pilot

Do not turn the MVP into a medical-record system, HR compliance monitor, competitive employee leaderboard, full nutrition tracker, or large fitness marketplace. Keep the early product focused on good workout content, a useful interface, simple private progress, and reliable operation.
