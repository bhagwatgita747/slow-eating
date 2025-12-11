# Claude Code Instructions

> Instructions for Claude Code when working on this project.

## Project Documentation

All project documentation is in the `/tracker` folder:

| File | Purpose |
|------|---------|
| **tracker/PRD.md** | Product Requirements Document - vision, audience, workflows, features |
| **tracker/CHECKLIST.md** | Master list of all tracker systems (start here to see everything) |
| **tracker/SESSION.md** | Recent work context, open items, decisions (read this first!) |
| **tracker/CONTEXT.md** | Technical setup - tech stack, environment, database schema |
| **tracker/ARCHITECTURE.md** | Code structure, quality scores, data flow, known issues |
| **tracker/TESTING.md** | Manual test checklist, workflow tests, integration status |
| **tracker/MILESTONES.md** | Feature backlog, prioritized roadmap, completed milestones |
| **tracker/CONNECTIONS.md** | External services status, credentials location, health checks |

## Tracker System

All trackers are registered in `tracker/CHECKLIST.md`.

**When adding a new tracker file:**
1. Create file in `/tracker` folder
2. Register in CHECKLIST.md with purpose and date
3. Add reference in this file (CLAUDE.md)

## Starting a New Session

1. Read `tracker/SESSION.md` to restore recent context
2. Check open items and continue where we left off

## Before Making Changes

1. Read `tracker/CONTEXT.md` for project understanding
2. Check `tracker/ARCHITECTURE.md` for code structure and known issues
3. Follow existing patterns and naming conventions

## Architecture Audit

Run an architecture audit when:
- User asks for "architecture audit" or "architecture review"
- Every 2 weeks (check last audit date in tracker/ARCHITECTURE.md)
- After major features are added

Audit checklist:
1. Check for dead code (unused files, exports)
2. Check for duplicate code
3. Verify folder structure
4. Review function sizes
5. Update scores in tracker/ARCHITECTURE.md
6. Update the audit date

## Testing

Test checklist is in `tracker/TESTING.md`.

**After adding a new feature:**
1. Add test cases to TESTING.md (happy path + errors + edge cases)
2. Mark new tests as "Untested" until user verifies

**Status icons:**
- Working
- Broken
- Untested

## Milestones

Feature backlog is in `tracker/MILESTONES.md`.

**When user adds a feature idea:**
1. Add to MILESTONES.md
2. Auto-organize by: dependencies -> architecture -> complexity
3. Unless user specifies explicit order

**Priority rules (highest to lowest):**
1. Blockers (dependencies for other features)
2. Architecture fixes (tech debt)
3. Security/stability improvements
4. Small features
5. Large features
6. Nice-to-haves

## Permissions (EXPANDED - Minimal Asking)

**IMPORTANT: Do NOT ask permission for routine operations. Only ask for truly dangerous/irreversible actions.**

**All of these are PRE-APPROVED - just do them:**

| Category | Commands |
|----------|----------|
| **npm** | ALL npm commands - install, run, build, test, publish, etc. |
| **git** | ALL git commands - status, add, commit, push, pull, log, diff, branch, checkout, reset, merge, rebase, stash, tag |
| **Vercel** | ALL vercel commands - deploy, login, ls, inspect, logs, env, pull, build, promote, rollback |
| **Node** | ANY node/npx command |
| **File ops** | ALL file operations - Read, Write, Edit, Delete, Create, Move, Copy |
| **Testing** | ALL test commands - Puppeteer, Playwright, Jest, any test framework |
| **Utilities** | ALL standard utilities - curl, open, lsof, pkill, find, grep, cat, wget, etc. |
| **GitHub CLI** | ALL gh commands - repo create, pr create, issue, release, etc. |
| **Capacitor** | ALL capacitor commands - add, sync, build, run, open |
| **Android** | ALL Android build commands - gradlew, adb, etc. |
| **Project Setup** | Create folders, initialize projects, install dependencies, configure tools |
| **Deployments** | Deploy to Vercel, build APKs, any deployment operation |
| **API Calls** | Use stored tokens for GitHub/Vercel operations |

**ONLY ask permission for these critical operations:**
- `rm -rf` on important directories (not node_modules or build artifacts)
- DROP DATABASE or destructive database operations
- Force push to main/master branch
- Deleting GitHub repositories
- Billing/payment related operations
- Exposing secrets publicly
