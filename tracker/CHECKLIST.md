# Tracker Checklist

> Master list of all tracking systems in this project.
> When a new tracker file is added, register it here.
> Say "show checklist" to see all systems at a glance.

---

## Last Reviewed
**2025-12-11**

---

## Best Practices

| # | Practice | When to Apply | Following? | Notes |
|---|----------|---------------|------------|-------|
| 1 | **Plan milestones before execution** | Features requiring 3+ steps | ? | Break into modules, execute one by one |
| 2 | **Browser test with BrowserBase** | After UI changes, before deployment | ? | Catches bugs Claude can't see |
| 3 | **Update SESSION.md before closing** | Every session | ? | Prevents context loss between sessions |

---

## Tracker Systems

| # | File | Purpose | Last Updated | Status |
|---|------|---------|--------------|--------|
| 1 | **PRD.md** | Product Requirements - vision, audience, workflows, features | 2025-12-11 | New |
| 2 | **SESSION.md** | Recent work context, open items, decisions | 2025-12-11 | Active |
| 3 | **CONTEXT.md** | Technical setup - tech stack, environment, database | 2025-12-11 | Active |
| 4 | **ARCHITECTURE.md** | Code structure, quality scores, known issues | 2025-12-11 | Active |
| 5 | **TESTING.md** | Manual test checklist, workflow & integration tests | 2025-12-11 | Active |
| 6 | **MILESTONES.md** | Feature backlog, prioritized roadmap | 2025-12-11 | Active |
| 7 | **CONNECTIONS.md** | External services status, credentials location | 2025-12-11 | Active |
| 8 | **CHECKLIST.md** | This file - master list of all trackers | 2025-12-11 | Active |

---

## Status Icons
- Active - File exists and is maintained
- Stale - Needs update (>2 weeks old)
- Missing - Should exist but doesn't
- New - Recently added

---

## Update Frequency

| File | How Often to Update |
|------|---------------------|
| SESSION.md | Every session (before closing Claude) |
| CONTEXT.md | When tech stack or setup changes |
| ARCHITECTURE.md | Every 2 weeks or after major changes |
| TESTING.md | After adding new features |
| MILESTONES.md | When adding/completing features |
| CONNECTIONS.md | When integrations change or break |
| CHECKLIST.md | When adding new tracker files |

---

## Quick Descriptions

### PRD.md
Product Requirements Document. Contains the business vision, target audience, user workflows, feature specifications, and onboarding flows. Read this to understand what we're building and why.

### SESSION.md
Preserves conversation context between Claude Code sessions. Contains what was being worked on, open items, recent decisions. Read this first when starting a new session.

### CONTEXT.md
Technical setup documentation. Tech stack, folder structure, environment variables, database schema, deployment info. For product requirements, see PRD.md.

### ARCHITECTURE.md
Code quality tracking. Scores the codebase on 12 principles (DRY, no dead code, etc.). Updated during architecture audits every 2 weeks.

### TESTING.md
Manual test checklist. Lists all user workflows, integrations, and edge cases with pass/fail status. Update after testing features.

### MILESTONES.md
Feature backlog and roadmap. Completed milestones, in-progress work, and prioritized "up next" list. Auto-organized by dependencies and complexity.

### CONNECTIONS.md
External service status. Shows what's connected (GitHub, Vercel, Supabase, etc.), where credentials are stored, and how to verify each.

### CHECKLIST.md
This file. Meta-tracker that lists all tracker systems. Helps maintain the tracking system itself.

---

## How to Add a New Tracker

When adding a new tracking system:

1. Create the file in `/tracker` folder
2. Add a row to the table above
3. Add description in "Quick Descriptions" section
4. Update `CLAUDE.md` to reference the new file

---

## How to Use

| You Say | I Do |
|---------|------|
| "Show checklist" | Display all trackers with status |
| "Which trackers are stale?" | Check dates, flag old ones |
| "Add X tracker" | Create file, register here, update CLAUDE.md |
| "Remove X tracker" | Delete file, remove from this list |
