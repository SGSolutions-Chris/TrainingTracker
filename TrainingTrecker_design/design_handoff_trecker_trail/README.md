# Handoff: TrainingTrecker — Trail direction

## Overview
Reimagined design for **TrainingTrecker**, a training-plan app where coaches assign plans to athletes and athletes log their training. This handoff covers the **Trail** visual direction — a bold, hero-led, asymmetric layout system with a dark forest-green "hero card" anchoring every key screen and white content below.

The design covers 9 screens for both **athlete** and **coach (trainer)** roles, plus a responsive desktop coach workspace. It supports light and dark mode.

## About the design files
The HTML files in this bundle are **design references** — interactive prototypes built in plain React/JSX-via-Babel to communicate look, layout, and interaction. **Do not ship them as-is.** Your job is to **recreate these designs in the existing codebase's stack** (React + CSS Modules, based on the styles folder you shared), reusing the project's conventions, router, state, and any component primitives already in place.

If you're starting from scratch on a particular surface, prefer the existing stack signals: CSS Modules per route (`Login.module.css`, `Plans.module.css`, etc.), a global tokens file, and a single shared layout shell with bottom navigation for mobile.

## Fidelity
**High-fidelity.** Exact hex values, type ramp, spacing, radii, and motion are specified. The prototypes show real interactions (live workout timer, rest timer, set-checkoff, navigation, light/dark, role toggle).

---

## Design tokens

### Colors — light mode
```
--bg:              #ffffff
--surface:         #ffffff
--surface-alt:     #f3f4f1
--surface-deep:    #e9ebe6
--ink:             #0b1610     /* primary text */
--ink-soft:        #3b4a43     /* secondary text */
--ink-muted:       #8a948f     /* tertiary text */
--border:          rgba(11,22,16,0.07)
--border-strong:   rgba(11,22,16,0.14)

--accent:          #0f5132     /* forest green — primary */
--accent-ink:      #ffffff
--accent-soft:     #d8efde
--accent-soft-ink: #0a3a22
--danger:          #dc2626

/* The signature Trail "hero" surface — used as a dark wrapper card */
--hero:            #0a1f15
--hero-ink:        #ecfdf5
--hero-accent:     #4ade80     /* bright green inside hero */
--hero-border:     rgba(74,222,128,0.18)
```

### Colors — dark mode
```
--bg:              #070a08
--surface:         #101512
--surface-alt:     #181d1a
--surface-deep:    #0a0d0b
--ink:             #f0f5f1
--ink-soft:        #b0bcb4
--ink-muted:       #6a746e
--border:          rgba(255,255,255,0.06)
--border-strong:   rgba(255,255,255,0.14)

--accent:          #4ade80     /* shifts from forest to bright green in dark */
--accent-ink:      #062014
--accent-soft:     rgba(74,222,128,0.14)
--accent-soft-ink: #a7f3c8
--danger:          #fb923c

--hero:            #0e2a1c
--hero-ink:        #ecfdf5
--hero-accent:     #4ade80
--hero-border:     rgba(74,222,128,0.22)
```

### Shadows
```
--shadow:    0 1px 2px rgba(11,22,16,0.04), 0 8px 28px rgba(11,22,16,0.06)
--shadow-lg: 0 24px 56px rgba(11,22,16,0.10)
--glow:      0 0 0 1px rgba(74,222,128,0.12), 0 12px 36px rgba(15,81,50,0.22)
```
The `--glow` shadow is the signature Trail effect — apply it to hero cards (the dark green ones).

### Radii
```
--r-lg:  28px   /* hero cards, primary cards */
--r-md:  18px   /* secondary cards, buttons */
--r-sm:  12px   /* inputs, small cards, icons backgrounds */
--r-pill: 999px /* badges, FAB, segmented controls */
```

### Typography
- **UI:** Plus Jakarta Sans — weights 400/500/600/700/800. Use `letter-spacing: -0.01em` on headings, `-0.02em` on large display.
- **Numeric / data:** JetBrains Mono — weights 400/500/600/700, always with `font-variant-numeric: tabular-nums`. Used for: timers, weights/reps, percentages, dates in tables, deltas, IDs.
- **Hierarchy:**
  ```
  Display    28px / 700 / -0.02em   — screen titles inside hero ("Pull A")
  H1         26px / 700 / -0.02em   — screen titles outside hero ("Plans", "Body")
  H2         22px / 700 / -0.01em   — section titles inside hero, exercise names
  H3         18px / 700             — secondary headings
  Body       14px / 500             — default text
  Caption    12px / 500             — secondary metadata
  Tag        11px / 700 / 0.10em uc — uppercase section labels inside hero (use --hero-accent color)
  Label      11px / 600 / 0.08em uc — uppercase section labels outside hero (use --ink-muted)
  Mono num   14–48px / 600 / tnum   — all numerics
  ```

### Spacing
4px base. Common values: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32. Mobile screen padding-x: 16. Card padding: 14 (small) / 18 (medium) / 20 (large). Hero card padding: 20–22.

### Motion
- Standard transition: `0.15s` to `0.18s` for state changes (hover, color swaps).
- Progress ring/bar fill: `0.4s` to `0.6s` linear.
- Toast: `0.25s`, slide up 20px + fade.
- Rest timer pill: appears with fade, ticks every second.
- All easing default to `ease`. No bouncy springs.

---

## The Trail signature

What makes Trail Trail (vs. a generic green app):

1. **Every primary screen has a dark "hero card" at the top** — `--hero` background, `--hero-ink` text, with a radial-gradient green glow in the top-right corner and a `--glow` box-shadow. Hero contains the most important number/object of that screen.
2. **Asymmetric layout inside the hero** — the dominant element (title + ring, big number + sparkline) sits left/center, with a soft glow blob bleeding off the top-right corner.
3. **Below the hero is white space and flat cards** — the contrast between dark hero and bright white content is the whole vibe.
4. **Floating pill-shaped bottom nav** in dark hero color (not a flat bar) — sits 14px off the bottom, 16px inset from edges, has `--glow` shadow.
5. **Radial progress ring** as the dominant data viz — used on Home (plan progress), Workout (sets done), and Athlete profile (adherence).
6. **Numbers in mono with tabular figures** — never proportional digits.
7. **Bold uppercase tag labels inside hero** in bright `--hero-accent` (`#4ade80`), tracking 0.1em.

### The hero card pattern (use everywhere)
```jsx
<div style={{
  background: 'var(--hero)',
  color: 'var(--hero-ink)',
  borderRadius: 28,
  padding: 20,
  boxShadow: 'var(--glow)',
  border: '1px solid var(--hero-border)',
  position: 'relative',
  overflow: 'hidden',
}}>
  {/* Glow blob — top-right corner */}
  <div style={{
    position: 'absolute', top: -40, right: -40,
    width: 200, height: 200, borderRadius: '50%',
    background: 'radial-gradient(closest-side, rgba(74,222,128,0.35), transparent)',
    pointerEvents: 'none',
  }}/>
  {/* Content goes here, with position: relative */}
</div>
```

---

## Screens

All mobile screens are 360×760 (design size). Top has a 38px iOS-style status bar with time + signal + battery — strip in real app, OS handles it. Bottom 14px safe-area for the floating nav.

### 1. Login
- **Purpose:** Sign in / sign up; pick athlete vs. coach role.
- **Layout:** Top 50% of screen is a dark hero panel with the **40px bottom-corner radius** (a full-bleed hero block, not a card), containing logo + display tagline ("Train. / Log. / Repeat." stacked, 28px, 700). White content below. The auth card overlaps the boundary by ~60px and floats with shadow.
- **Components:**
  - **Logo:** "Trecker" wordmark, 800 weight, with a 32×32 green tile to the left containing a stylized dumbbell SVG (3 horizontal bars + 4 plates as small vertical strokes).
  - **Role toggle** (segmented): 2-up grid, 4px padding, active segment has `--surface` background + shadow; inactive is transparent.
  - **Inputs:** 44px tall, `--surface-alt` bg, 18px radius, 14px font.
  - **Primary CTA:** full-width, 52px, `--accent` bg, 999px radius (always pill on Trail).
  - **Toggle link:** "New here? Create an account" — `--ink-muted`, 13px.

### 2. Home (athlete · Today)
- **Purpose:** See today's session, this week at a glance, jump into plans.
- **Layout:** Greeting (date in uppercase mono, then "Good morning, Maya" in 22/700) → **hero card** with today's session → 3-up stat row (Sessions / Volume / Streak) → "Your plans" section with plan rows.
- **Hero card content:**
  - Tag pill (top-left): `TODAY · WEEK 4` in `--hero-accent`, 11/700/0.1em uc.
  - Title: "Pull A" 26/700/-0.02em.
  - Subtitle: "Back · Biceps" — 13px, hero-ink at 0.7 opacity.
  - **Progress ring** (top-right, 70px, 6px stroke): shows plan completion. Ring color = `--hero-accent`, track = `rgba(255,255,255,0.1)`. Center text: percentage as `BigNum`.
  - Bottom row: `52 min` `5 ex` (big numbers, mono, separated by vertical divider) + a **green pill Start button** (`--hero-accent` bg, dark text, 44px, 999px radius).
  - Whole card tappable → unit detail; Start button stops propagation → workout.
- **Stat row (3 cards):** plain white cards, label uppercase 10/700/0.08em + BigNum below with mono unit suffix.
- **Plans section:** "YOUR PLANS" label, then plan rows (see PlanRow spec below).

### 3. Plans list
- **Purpose:** All plans the athlete is assigned to or has self-created.
- **Layout:** Big title "Plans" + subtitle "3 active". List of `PlanRow` cards. Bottom: ghost button "+ New plan".
- **PlanRow** (Trail variant): 42×42 rounded-tile icon (`--accent-soft` bg, dumbbell/bolt/activity icon) + name + meta line ("Week 4 of 8 · Strength") + right-aligned mono percentage + 4px progress bar below.

### 4. Plan detail
- **Purpose:** Drill into a plan and pick a unit to view/start.
- **Layout:** Tag pill (Strength) → 24/700 plan title → "by Roan Vega" → 2-column stats row (Progress · Week) → 6px progress bar → grouped unit list by week.
- **UnitRow:** 36px square index tile (filled green if done, else `--surface-alt` with mono number) + name + "focus · duration" meta + circular green Play button (36px, `--accent` bg, white play icon).

### 5. Unit detail (view-only)
- **Purpose:** Preview a unit's exercises before starting.
- **Layout:** Tag pill → unit name → 3-up stats (Duration · Exercises · Sets) → "EXERCISES" label → exercise rows (mono index + name + sets×reps in mono + target in `--accent`) → sticky bottom "Start workout" CTA (full-width, 52px primary).

### 6. Active workout — **most distinctive Trail screen**
- **Purpose:** Log sets in real time during training.
- **Layout:** Full hero band at top (bottom-rounded to 28px), then scrolling set-log below, then sticky Prev/Next bar at bottom.
- **Hero band content:**
  - Top row: ← back · **mono timer (18px/700, e.g. `15:32`)** · ✕ close. All in hero-ink.
  - Middle: 72px progress ring (sets done / total) on left, exercise meta on right: index tag + name (22/700) + targets line ("4 × 5 @ 110 kg" in mono).
  - Optional rest-timer pill below: `rgba(74,222,128,0.18)` bg, hero-accent text, timer icon + "Rest · 90s".
- **Set log card:** column header row (`SET KG REPS` uppercase 10/700) + N set rows. Each row:
  - mono set number (`01`, `02`…)
  - kg input (centered, mono, `--surface-alt` bg, placeholder = target weight)
  - reps input (same style, placeholder = target reps)
  - circular check button (38px). Inactive: `--surface-alt` bg, muted icon. Active/done: `--accent` bg, white check.
  - On check: marks set done (opacity 0.55), starts rest timer with `ex.rest` seconds, shows toast "Set logged".
- **Next up section:** "NEXT UP" label + 3 compact exercise rows.
- **Bottom bar:** "← Prev" ghost button + "Next →" primary button, equal width, 10px gap, 16px padding-x, 14px top padding, 14px bottom (above safe area).
- **No bottom nav** on workout — replaced by Prev/Next.

### 7. Coach roster (trainer home)
- **Purpose:** See all athletes, their adherence, last activity.
- **Layout:** Title "Athletes" + subtitle "4 active · 1 idle" + soft "Invite" button → **hero card** with 3-up summary (Active · Sessions/wk · Adherence%) → "ROSTER" label with count → athlete rows.
- **AthleteRow:** 40px circular avatar (initials) + name (with optional flame+streak number to right) + plan & last-session meta + right-side big mono percentage colored green if ≥ 70%, danger orange below.

### 8. Athlete profile (coach view)
- **Purpose:** Detailed view of one athlete, with quick actions.
- **Layout:** 56px avatar + name (22/700) + plan & sessions → 2-up actions: "Edit plan" + "Message" (both soft buttons) → "SNAPSHOT" 2-up cards (Adherence% + 4px bar, Streak days with status text) → "VOLUME · 4 WEEKS" hero-ish card with big number + delta pill + sparkline → "RECENT SESSIONS" rows.
- **Sparkline:** 280×56 area chart, `--accent` stroke, `--accent-soft` fill, 1.6–3px dots, optional dashed `goal` line at `--ink-muted` 0.25 opacity.

### 9. Body / weight tracking
- **Purpose:** Log bodyweight, see trend, track goal.
- **Layout:** Title "Body" + subtitle entry count + "+ Log" soft button → **hero card** with current weight (48/700 mono with `kg` unit) + delta + sparkline with goal line + date range → "GOAL" card with target icon, distance to goal, ETA, progress bar → "RECENT" entry list (date / weight, alternating-free rows separated by 1px border).
- **Log modal:** floating card above bottom nav, slides up. Single big mono input + Save button.

### 10. Profile / settings
- **Purpose:** Account, appearance, danger zone.
- **Layout:** Title "Profile" → user card (56px avatar accent + name + handle in mono + edit icon, then a divider and a row of 3 stats for athletes: Weight / Height / Joined) → "APPEARANCE" group with Dark mode + Notifications switches → "ACCOUNT" group with rows → red ghost Sign out button.
- **SettingRow:** 32px rounded-square icon tile + label + optional value (muted) + chevron or switch.
- **Switch:** 40×24 pill, knob slides 16px, `--accent` when on, `--surface-alt` when off.

---

## Bottom navigation (Trail)
- **Floating pill** — `position: absolute; left: 16; right: 16; bottom: 14`.
- 60px tall, 999px radius, `--hero` background, `--glow` shadow, `1px solid --hero-border`.
- 4 items, equal flex, each a 48px round button.
- **Athlete tabs:** Today (home) · Plans · Body (trend) · You (user).
- **Coach tabs:** Athletes (home) · Library (plans) · Trends · Profile.
- Active state: button has `--hero-accent` (`#4ade80`) background, dark `#06120b` icon color. Inactive: transparent bg, hero-ink color.

---

## Top navigation
- For routes that aren't `login` or `workout`, show a slim 52px top bar with back arrow on left (if applicable) and a title centered, plus an optional trailing icon button.
- On the **workout screen**, top chrome is the hero band itself — no separate top bar.

---

## Interactions & behavior

### Live workout
- Timer increments every second from a starting elapsed (in mock data it starts at 932s to show "15:32").
- Tapping the round check on a set: marks it done, decreases opacity, triggers rest timer with the exercise's `rest` value, shows toast "Set logged" for 1.5s.
- Rest pill counts down, disappears at 0.
- Prev/Next at bottom navigates to previous/next exercise in the unit (clamped).

### Navigation
- Single stack with `history` array; back arrow pops one step.
- Tapping a plan in any list → plan detail. Tapping a unit → unit detail. "Start" from unit or hero → workout.

### Light/dark
- Toggle in Profile screen → swaps the entire token set. Hero card stays dark in both modes but bg/surface/ink invert.

### Touch targets
- All interactive elements ≥ 36px on shortest axis (most are 38–44px).

---

## State management
Per the existing app structure, keep state local to routes where possible. Suggested shape:

```ts
type Role = 'athlete' | 'trainer';
type Mode = 'light' | 'dark';
type Route =
  | { name: 'login' }
  | { name: 'home' }
  | { name: 'plans' }
  | { name: 'plan'; planId: string }
  | { name: 'unit'; unitId: string }
  | { name: 'workout'; unitId: string }
  | { name: 'trainer' }
  | { name: 'athlete'; athleteId: string }
  | { name: 'weight' }
  | { name: 'profile' };

// Workout-screen-local state
type LoggedSet = { kg?: string; reps?: string; done?: boolean };
type WorkoutState = {
  exIdx: number;
  logged: Record<string, LoggedSet>;   // key: `${exIdx}-${setIdx}`
  elapsedSec: number;
  restSec: number;
};
```

Persist `mode`, the user's `role`, and any logged-but-not-submitted sets to localStorage. Server is the source of truth for plans/units/exercises.

---

## Components to build (suggested module breakdown)

Match the existing CSS Modules pattern. New files:

```
src/styles/tokens.css            — :root variables for light, [data-mode="dark"] for dark
src/styles/hero.module.css       — .heroCard with glow + radial blob
src/styles/global.module.css     — body, scrollbar, status bar styles
src/components/
  HeroCard.tsx                   — wraps children, optional glow-blob slot
  ProgressRing.tsx               — SVG ring, value 0..1, size/stroke props
  Sparkline.tsx                  — SVG area chart with optional dots + goal line
  BigNum.tsx                     — mono number + small unit suffix
  Pill.tsx                       — 4 kinds: soft, ghost, solid, deep
  Button.tsx                     — kind: primary | ghost | soft | plain | danger; sizes sm/md/lg
  Card.tsx                       — flat card with token border + radius
  Avatar.tsx                     — initials, accent variant
  BottomNav.tsx                  — floating pill, role-aware
  TopBar.tsx                     — slim bar with back + title + trailing
  SectionLabel.tsx               — uppercase tracked label with right slot
  Switch.tsx                     — 40×24 toggle
src/screens/                     — one .tsx per route
src/icons.tsx                    — single Icon component with named SVG paths
```

The existing `global.css` has variable names that almost match (`--bg`, `--accent`, `--radius`, etc.) — adapt the names, but extend the token set with the hero/glow tokens above.

---

## Reference files (in this bundle)

- `TrainingTrecker.html` — the canvas viewer with all variants (use this for visual reference; open it in a browser).
- `src/theme.jsx` — Token definitions; the `trail` object is the source of truth for Trail tokens.
- `src/data.jsx` — Seed data + Icon library (copy the icon paths; they're stroke-based, 24px viewBox).
- `src/ui.jsx` — All shared primitives (Card, Button, Pill, ProgressRing, Sparkline, BigNum, etc.).
- `src/screens-main.jsx` — Home, Plans list, Plan detail, Unit detail, Workout.
- `src/screens-meta.jsx` — Login, Profile, Trainer roster, Athlete profile, Body/weight.
- `src/app.jsx` — App shell, routing, desktop coach workspace.
- `src/design-canvas.jsx`, `src/ios-frame.jsx` — Demo scaffolding; ignore for implementation.

The prototype components branch on `t.variant` (`'garden' | 'field' | 'trail'`). For your implementation, **only follow the `t.variant === 'trail'` branches.** Other branches are alternate directions that were not selected.

---

## Assets
No external assets. All icons are inline stroke-SVG paths (see `data.jsx`, the `Icon` component). The Trecker wordmark uses pure CSS + a hand-drawn SVG dumbbell glyph; reproduce it or hand off to a designer for a proper mark.

## Fonts
Load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
```

## Open questions / not yet designed
- Plan builder (creating a new plan or editing units) — only the entry point is in the design.
- Invite acceptance flow.
- Notifications inbox.
- Exercise library / search.
- Onboarding for new athletes.
- Goal-setting flow (weight goal currently just shows the target).

Confirm scope with the design team before implementing these.
