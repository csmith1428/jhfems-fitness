# JHFEMS Fitness & Wellness App

> **Project documentation — 2026-11-10**  
> **Stage:** Local Next.js pilot in development  
> **Brand direction:** Tactical Energy **approved**; final product name **not approved**

A voluntary, adaptable fitness and wellness experience initially designed for Jackson Hole Fire/EMS personnel, with the potential to serve other shift-based occupations later.

## Start here

| Document | Purpose | Authority |
| --- | --- | --- |
| [`docs/PROJECT_VISION.md`](docs/PROJECT_VISION.md) | Users, goals, constraints, privacy, scope | Product intent and requirements |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Approved palette, UI conventions, accessibility | Visual and interaction design |
| [`docs/WORKOUT_STANDARDS.md`](docs/WORKOUT_STANDARDS.md) | Program structure, scaling, formatting, content model | Workout content and presentation |
| [`docs/DEVELOPMENT_HANDOFF.md`](docs/DEVELOPMENT_HANDOFF.md) | Known files, current implementation, open items, next steps | Time-stamped implementation snapshot |
| [`docs/assets/tactical-energy-reference.png`](docs/assets/tactical-energy-reference.png) | Selected *middle* brand-direction visual | Inspiration only; not functional UI specification |

## Decisions that should not silently change

- **Five-color brand palette:** Ivory `#F6F7EB`, Fiery Terracotta `#E94F37`, Gunmetal `#393E41`, Steel Blue `#8AA3B2`, Muted Sand `#D8C8B0`. The last two are the only supplementary brand colors.
- **Visual direction:** Tactical Energy — bold and performance-focused, but polished, legible, and not needlessly militaristic.
- **Programming:** A planned 12-week cycle with four prescribed workout categories each week: Strength A, Strength B, Conditioning, and Functional Fitness.
- **Accommodation:** Members may scale or adapt sessions; avoid treating injuries, abilities, or missed sessions as failures.
- **Workout numbering:** Strength movements can be numbered individually; AMRAPs, MetCons, circuits, and other grouped work get **one small block number** with their movements beneath.
- **Privacy:** Individual results/notes are private; any future departmental view must be aggregated and appropriately access-controlled.
- **Brand naming:** *Summit Shift* appeared in mockups but is **not** a chosen name. *Ironshift* was positively received as a possibility. *FireFit OS* was rejected. No emoji flame in the final mark; if fire symbolism is used, it should be custom-designed.

## Source-of-truth rules

1. **User-approved decisions** take precedence over earlier mockups or speculative suggestions.
2. **Vision / design / workout documents** set intended behavior. They do **not** prove it is implemented.
3. **The live repository** is authoritative about what the app actually does. If a document disagrees with code, flag the discrepancy and resolve it deliberately; do not quietly overwrite either.
4. **Development handoff** is a dated snapshot, not an audit of files that were not supplied to this documentation session.
5. Keep design suggestions labeled `PROPOSED` until explicitly approved. Keep unverified implementation claims labeled `REPORTED / VERIFY IN REPO`.

## Current codebase and setup

The application was developed locally on Callie's Mac in a project **reported** as `~/Desktop/jhfems-fitness`. The current chat did **not** receive that folder or inspect its contents. Known/reported paths and their roles appear in [`docs/DEVELOPMENT_HANDOFF.md`](docs/DEVELOPMENT_HANDOFF.md#source-file-map).

For an existing Next.js project, the usual local startup is:

```bash
cd ~/Desktop/jhfems-fitness
npm install
npm run dev
```

Verify these commands against that repository's `package.json`; they have not been run in this documentation session. **Do not replace existing source files with this docs bundle.** Copy `README.md` to the project root and `docs/` beside `src/`, merging carefully if either already exists.

## Workflow for the next session

Read this `README.md`, the three standards documents, and the newest handoff. Then inspect the actual local source files **before editing code**. Record changes to user-facing standards in the relevant docs and update the handoff at the end of each session.
