# Paste this into Claude Code

Copy the block below into Claude Code (after dropping the `design_handoff_trecker_trail/` folder into your repo). It tells Claude exactly what to do.

---

```
I'm redesigning my TrainingTrecker app. I've added a folder `design_handoff_trecker_trail/`
to the repo with a high-fidelity design reference (the "Trail" direction — bold, hero-led,
asymmetric, dark forest-green hero card on every screen, white content below, floating
pill-shaped bottom nav).

YOUR TASK
1. Read `design_handoff_trecker_trail/README.md` end-to-end first. It is the spec.
2. Open `design_handoff_trecker_trail/TrainingTrecker.html` in a browser and click around
   the "Trail" phone (left of the canvas). Tap Today's session → Start → log a set, switch
   to coach mode, view the athlete profile. The prototype is the source of truth for
   interaction + layout.
3. Recreate the design in THIS codebase, NOT by copy-pasting the JSX from the bundle.
   The bundle is in plain JSX with inline styles for prototype clarity. My real app uses
   React + CSS Modules (see existing `styles/` folder with `global.css`, `Layout.module.css`,
   `Login.module.css`, `Plans.module.css`, `PlanDetail.module.css`, `Trainer.module.css`,
   `UnitDetail.module.css`, `Workout.module.css`, `Navbar.module.css`).
4. Match the existing project conventions:
   - Keep one CSS module per route/component, like the current setup.
   - Replace the current dark-cyan token set in `global.css` with the Trail tokens
     (both light + dark — see "Design tokens" in the README). Add `[data-mode="dark"]`
     scoping so the app can toggle modes via a body/html attribute.
   - Keep the existing routing/state plumbing. Don't introduce new state libraries.
   - Reuse `Layout.module.css`'s shell pattern, but replace the flat bottom bar with the
     floating pill bottom-nav described in the README (Trail section).
5. Component priority — build in this order:
   a. Tokens + global.css refresh
   b. HeroCard primitive (the signature element — glow + radial blob)
   c. ProgressRing, Sparkline, BigNum, Pill, Button, Card, Avatar, Switch, BottomNav, TopBar
   d. Screens, in this order so I can review incrementally:
      i.   Login (sets the visual tone)
      ii.  Athlete Home (Today)
      iii. Active Workout (most interactive, validate primitives)
      iv.  Plan detail + Unit detail
      v.   Body / weight tracking
      vi.  Coach roster + Athlete profile
      vii. Profile / settings
6. After each screen, pause and show me a screenshot or local URL so I can review before
   moving on.

NON-NEGOTIABLES
- Forest green `#0f5132` is the primary accent in light mode. Bright `#4ade80` is the
  hero-accent (inside dark hero cards) AND the accent in dark mode.
- All numbers (timers, weights/reps, percentages, dates in tables, deltas) must use
  JetBrains Mono with `font-variant-numeric: tabular-nums`.
- The hero-card pattern (dark `#0a1f15` bg + radial glow blob top-right + `--glow` shadow)
  appears on Home, Workout (top band, bottom-rounded), Coach roster (summary card), and
  Body (current-weight card). It is the design's signature — do NOT replace with a flat
  card.
- Bottom nav is a floating pill, not a flat bar. Active tab has a `#4ade80` pill behind
  the icon.
- Light AND dark mode are required. Both use a dark hero card.
- Quiet, sporty copy. No emoji, no exclamation marks, no "great job!". Numbers do the
  talking ("12,450 kg moved", "+8% from last week", "Streak · 11 d").

QUESTIONS BEFORE STARTING
- Confirm whether I want you to delete the current cyan/dark-slate styles or keep them
  for fallback during the migration.
- Confirm any features in the "Open questions" section of the README before scaffolding
  them.

When ready, start with step 5a (tokens) and ask me to review before continuing.
```
