<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# JHFEMS Fitness & Wellness — GitHub Workflow

## Feature Development Rules

When the user requests a new app feature, modification, or substantial UI/UX improvement:

1. Check the current repository status and identify any uncommitted changes.
2. Start from the latest stable `main` branch when safe to do so.
3. Create a new descriptive feature branch before modifying code.
4. Use consistent branch names:
   - `feature/` for new functionality
   - `fix/` for bug fixes
   - `design/` for visual or UX improvements
   - `refactor/` for structural improvements
5. Perform all development work on that branch, never directly on `main`.
6. Create meaningful, focused commits as development progresses.
7. Use Conventional Commit messages, such as:
   - `feat: add weekly workout check-in`
   - `fix: preserve workout completion state`
   - `style: refine mobile navigation spacing`
   - `refactor: extract reusable workout card`
8. When the feature is complete, run applicable lint, type checks, tests, and build validation.
9. If checks pass, push the feature branch to GitHub and create a pull request targeting `main`.
10. Give the pull request a descriptive title and a summary covering what changed, why, testing performed, and any remaining concerns.
11. Report the branch name, commits, test results, and pull request URL.
12. Never automatically merge a pull request or delete a branch without explicit user approval.

## Automation Expectations

- Perform Git operations automatically when an authorized GitHub or development environment is available.
- Never claim a branch, commit, push, or pull request was completed without confirming the operation succeeded.
- Do not discard uncommitted changes, force-push, or overwrite existing work.
- Avoid creating new branches for minor discussion, conceptual planning, or design exploration that does not modify code.
- When GitHub or local repository access is unavailable, provide the exact commands needed rather than claiming actions were performed.

## Approval Rules

The user approves final features and pull request merges.

The assistant handles routine branch creation, meaningful commits, testing, and pull request preparation wherever tool access permits.


