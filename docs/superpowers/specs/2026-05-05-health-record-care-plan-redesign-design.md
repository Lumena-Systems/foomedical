# Health record & care plan redesign

**Date:** 2026-05-05
**Scope:** `src/pages/health-record/`, `src/pages/care-plan/`, plus a new `src/components/EmptyState.tsx`
**Out of scope:** detail pages (`LabResult.tsx`, `Measurement.tsx`, etc.), data fetching, route changes, dashboard/landing surfaces.

## Problem

Current Health record and Care plan pages feel "off" because three things stack:

1. **Empty state missing.** When a list returns zero items, only the eyebrow header renders inside `InfoSection` — looks like a render bug.
2. **Two competing left navs.** AppShell already has a primary sidebar (Home, Health record, Care plan, …). Each page then renders its *own* 220px `SideMenu`. Both look similar in weight; the page reads as nav-on-nav.
3. **Centered max-width inside an already-padded shell.** `maxWidth: 1200; margin: 0 auto` (`src/pages/health-record/index.tsx:34`, `src/pages/care-plan/index.tsx:21`) centers content inside `<main>`, leaving large dead zones on both sides — especially obvious when content is empty.

Empty states alone would mask #1 but not #2 or #3.

## Solution

### 1. Page shell (both pages)

Drop the inner `SideMenu` and the centering wrapper. New shell for both `health-record/index.tsx` and `care-plan/index.tsx`:

- Single column inside `<main>`
- `padding: 32px 40px`
- `maxWidth: 960`, **left-pinned** (`margin: 0` — content hugs the AppShell sidebar, with the right side free to whitespace on wide displays)

### 2. Tab bar (Health record only)

Replaces the inner `SideMenu`. Quiet underlined tabs as a `<nav>` row at the top of the content area, before `<Outlet />`.

Tabs:
- Lab results
- Medications
- Questionnaire responses
- Vaccines
- Vitals

Style:
- Active: `var(--ink-900)` text, weight 500, 2px `var(--ink-900)` underline
- Inactive: `var(--fg-muted)`, weight 400, no underline
- Hover: `var(--fg-secondary)`
- Layout: horizontal flex, 24px gap, 12px vertical padding per tab, single 1px `var(--border-quiet)` border-bottom across the row (active tab's 2px underline visually overlaps it)
- Routes via `NavLink` from `react-router`

**Vitals submenu (Blood pressure, Heart rate, etc.) is removed.** The Vitals page already lists all measurements; users drill in by clicking a row. The submenu was redundant.

### 3. Care plan

Only one section ("Action items") — no tab bar at all. Page renders the new shell with no tabs and an `<Outlet />`. The `/care-plan` → `/care-plan/action-items` redirect stays.

### 4. Drop redundant titles

The AppShell header already renders title + subtitle (`Health record / Lab results`). Each subpage currently *also* renders an inner `<h1>` and an `InfoSection title="…"` eyebrow — three repetitions of the same word.

- Remove the inner `<h1>` from each subpage:
  - `LabResults.tsx`, `Medications.tsx`, `Vaccines.tsx`, `Responses.tsx`, `Vitals.tsx`, `ActionItems.tsx`
- Remove the `title` prop from `InfoSection` in those pages (keep the framed container, just no eyebrow)

### 5. Empty states

New component `src/components/EmptyState.tsx`:

```ts
interface Props {
  icon: IconName;        // from src/lumena/icons.ts
  title: string;
  body: string;
  action?: { label: string; onClick: () => void };  // optional CTA
}
```

Visual:
- Container: full content width, ~280px tall, centered content vertically
- Background `var(--bg-card)`, 1px `var(--border-quiet)`, 8px radius (matches `InfoSection`)
- Icon 32px, `var(--fg-muted)`
- Title: serif 18px / weight 500 / `var(--fg-primary)` / 12px top margin
- Body: sans 13px / `var(--fg-muted)` / 6px top margin / max ~360px line length / center-aligned
- Optional CTA: ghost button under body, 16px top margin

Per page (icons constrained to existing `ICONS` keys):

| Page | Icon | Headline | Body |
|---|---|---|---|
| Lab results | `clipboard` | No lab results yet | Results shared by your providers will appear here. |
| Medications | `doc` | No medications on file | Active prescriptions and dosing will show up here. |
| Vaccines | `shield` | No vaccines recorded | Your immunization history will appear here. |
| Questionnaire responses | `doc` | No responses yet | Forms you've completed will be saved here. |
| Vitals | `database` | No vitals recorded | Measurements from visits or your devices will appear here. |
| Action items | `check` | Nothing on your plan yet | Your care team hasn't added items. They'll show up here when they do. |

For Vitals (table), the empty state replaces the table entirely.

No CTAs in this pass — the underlying actions ("connect provider", "schedule visit") aren't wired and adding placeholder buttons would be worse than no button.

## Files changed

**Modified:**
- `src/pages/health-record/index.tsx` — new shell + tab bar, drops `SideMenu`
- `src/pages/care-plan/index.tsx` — new shell, no tabs, drops `SideMenu`
- `src/pages/health-record/LabResults.tsx` — drop h1, drop InfoSection title, add empty state
- `src/pages/health-record/Medications.tsx` — same
- `src/pages/health-record/Vaccines.tsx` — same
- `src/pages/health-record/Responses.tsx` — same
- `src/pages/health-record/Vitals.tsx` — drop h1, add empty state for table
- `src/pages/care-plan/ActionItems.tsx` — drop h1, drop InfoSection title, add empty state

**Added:**
- `src/components/EmptyState.tsx`

**Unchanged:**
- `src/components/SideMenu.tsx` — still used by Account section, not deleted
- All detail pages
- `Router.tsx`, `AppShell.tsx`

## Risk / verification

- Diff is contained; no data, route, or shared-component contract changes.
- `SideMenu` still has callers (Account section), so it stays in place.
- Verification: load each subpage and confirm (a) no double sidebar, (b) tab bar renders correctly with active state, (c) empty state shows when list is empty, (d) populated state still renders rows. Check Vitals table.
