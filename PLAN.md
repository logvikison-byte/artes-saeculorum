# Stillpoint — Meditation Progress & Technique Companion

## Planning Document (v1)

---

## 1. Vision

A website that turns meditation from "a chore I keep abandoning" into a habit people
genuinely look forward to. It does three things:

1. **Tracks progress** — sessions, streaks, minutes, mood, focus quality — and shows it
   back to the user in a way that feels rewarding, not judgmental.
2. **Suggests techniques** — a recommendation engine that rotates fresh, short,
   beginner-friendly techniques matched to the user's mood, available time, and history,
   so practice never goes stale.
3. **Teaches visually** — every technique ships with an animated visual guide (breathing
   circles, body-scan highlights, pacing bars) so users *follow along* instead of reading
   instructions.

### Target user

People who **get distracted easily** and have failed to build a meditation habit before.
This shapes every decision:

| Constraint of the user | Design response |
|---|---|
| Short attention span | Sessions start at 1–3 minutes; nothing requires more than 10 at first |
| Gets bored fast | Novelty engine: never suggests the same technique twice in a row; unlockable techniques |
| Abandons habits after missing a day | Forgiving streaks ("freeze days"), progress framed as lifetime totals, never guilt |
| Won't read long instructions | Animated visual guides do the teaching; text is optional and minimal |
| Needs quick wins | Instant feedback after every session: confetti, badge progress, a stat that moved |

---

## 2. Core Features

### 2.1 Progress Tracking
- **Session log**: date, technique used, duration, self-rated focus (1–5), mood before/after.
- **Dashboard**:
  - Current streak + longest streak (with "streak freeze" tokens so one missed day doesn't reset everything).
  - Total minutes meditated (lifetime — a number that only ever goes up).
  - Calendar heat-map of practice days.
  - Mood-shift chart (before vs. after, over time) — the most persuasive stat for retention: it *shows* the user meditation is working.
  - Focus-quality trend line.
- **Milestones**: 1st session, 3-day streak, 7-day streak, 60 lifetime minutes, 5 techniques tried, etc. Each unlocks a badge and sometimes a new technique.

### 2.2 Technique Suggestion Engine
The anti-boredom core. Rules-based at first (no ML needed):

- **Inputs**: time available (user picks 1 / 3 / 5 / 10 min), current mood (one-tap emoji), techniques recently used, focus ratings per technique, experience level.
- **Rules**:
  - Never repeat the last technique used.
  - Prefer techniques the user rated well, but inject a *new* technique at least every 3rd session ("Today's discovery").
  - Match mood → technique family (anxious → extended-exhale breathing; sluggish → energizing breath; restless → movement/walking meditation; scattered → counting/anchor techniques).
  - Short attention span first: default suggestions are ≤5 minutes until a 7-day streak exists.
- **"Surprise me"** button — one tap, zero decisions, starts a session immediately. (Decision fatigue is a major drop-off point for this audience.)

### 2.3 Visual Technique Guides (the teaching layer)
Every technique is a **guided, animated experience**, not an article:

| Technique | Visual guide |
|---|---|
| Box Breathing (4-4-4-4) | A square traced edge-by-edge in sync with inhale–hold–exhale–hold; the moving dot is the breath pacer |
| 4-7-8 Breathing | Expanding/contracting circle with a color shift per phase and a countdown ring |
| Body Scan | A human silhouette that glows region-by-region from toes to head as the scan progresses |
| Counting Breaths (1–10) | Large animated numerals that fade in with each exhale; a gentle "start over" ripple if the user taps "lost count" |
| 5-4-3-2-1 Grounding | Animated icon cards (see/hear/feel/smell/taste) that flip in one at a time |
| Candle Gazing (Trataka) | A softly flickering animated flame as the fixation point |
| Loving-Kindness | Concentric ripples expanding outward (self → loved one → everyone) with phrase prompts |
| Walking Meditation | Footstep animation with a left-right rhythm bar |

- All guides built as **SVG + CSS/JS animations** (no video files — instant load, crisp on any screen, easy to theme).
- Each guide has a 15–30 second "how it works" animated preview before the session starts.
- Audio is optional (soft chime per phase), never required.

### 2.4 Anti-Boredom / Habit-Formation Features
- **Technique unlocks**: start with 4 techniques; streaks and milestones unlock more. Curiosity ("what's next?") keeps users returning.
- **Daily variety card**: "Today's suggestion" changes daily even if the user doesn't practice.
- **Micro-sessions count**: even a 60-second session extends the streak. The habit loop matters more than the duration.
- **Post-session moment**: mood check-in → one satisfying animation → one stat that visibly moved. Under 10 seconds total.
- **Gentle return flow**: after an absence, no guilt messaging — "Welcome back, your 340 lifetime minutes are right where you left them. Try a 1-minute reset?"
- **Themes**: unlockable color themes (dawn, forest, ocean, night) as cosmetic rewards.

---

## 3. Technical Plan

### 3.1 Stack
- **Frontend**: React 18 + TypeScript + Vite — fast dev loop, componentized technique guides.
- **Styling**: Tailwind CSS + CSS keyframe animations; Framer Motion for the guide animations that need orchestration (phase sequencing, springs).
- **Charts**: Recharts (heat-map, trend lines, mood-shift chart).
- **State/Storage**: localStorage via a small typed persistence layer (Zustand + persist middleware). **No backend and no accounts in v1** — zero-friction start matters more than sync for this audience. The storage layer is abstracted so a backend (Supabase or similar) can slot in at v2 for cross-device sync.
- **Routing**: React Router — `/` (dashboard), `/session` (active guide), `/techniques` (library), `/progress` (stats), `/settings`.
- **Deployment**: static build → GitHub Pages / Netlify / Vercel.

### 3.2 Data Model (v1, localStorage)

```ts
type Session = {
  id: string;
  techniqueId: string;
  startedAt: string;        // ISO
  durationSec: number;
  completed: boolean;
  moodBefore?: 1|2|3|4|5;
  moodAfter?: 1|2|3|4|5;
  focusRating?: 1|2|3|4|5;
};

type Technique = {
  id: string;
  name: string;
  family: 'breath'|'body'|'grounding'|'visual'|'compassion'|'movement';
  minDurationSec: number;
  phases: Phase[];          // drives the animation engine
  moodTags: Mood[];         // what it's recommended for
  unlockRule?: UnlockRule;  // null = available from day 1
};

type Phase = {
  label: string;            // "Inhale", "Hold", "Exhale"...
  durationSec: number;
  animation: string;        // key into the guide component's animation map
};

type UserState = {
  sessions: Session[];
  unlockedTechniqueIds: string[];
  earnedBadgeIds: string[];
  streakFreezesAvailable: number;
  settings: { theme: string; soundOn: boolean; defaultDuration: number };
};
```

The `phases` array is the key design decision: **one generic guide engine** steps through
phases on a timer and drives per-technique animation components, so adding a new
technique is mostly data + one SVG animation component, not new app logic.

### 3.3 Pages / Components

```
App
├── Dashboard        — streak, today's suggestion card, quick-start, recent stats
├── SessionPlayer    — fullscreen guide: animation canvas, phase engine, timer,
│                      pause/end, post-session check-in flow
├── TechniqueLibrary — cards (locked/unlocked), animated previews, filters by mood/time
├── ProgressPage     — calendar heat-map, charts, badges, lifetime totals
└── Settings         — theme, sound, reminders (browser notifications), data export/reset
```

---

## 4. Build Roadmap

### Phase 1 — MVP (first milestone)
- Project scaffold (Vite + React + TS + Tailwind).
- Phase-driven session engine + timer.
- 4 launch techniques with full animated guides: Box Breathing, 4-7-8, Counting Breaths, Body Scan.
- Session logging, streak (with freeze), lifetime minutes, calendar heat-map.
- Simple suggestion logic (mood + time + no-repeat rule) and "Surprise me".
- Post-session mood check-in + reward animation.

### Phase 2 — Habit loop deepening
- Badges/milestones + technique unlocks (add 4 more techniques: 5-4-3-2-1, Loving-Kindness, Candle Gazing, Walking).
- Mood-shift and focus-trend charts.
- Browser notification reminders; unlockable themes.
- Gentle-return flow for lapsed users.

### Phase 3 — Growth
- Optional accounts + cloud sync (Supabase).
- Weekly recap ("Your calmest day was Tuesday").
- Adaptive suggestions (weight by the user's own focus ratings).
- PWA install (offline sessions, home-screen icon).

---

## 5. Success Criteria

- A brand-new user reaches their **first completed session in under 60 seconds** from landing (no signup, max two taps).
- **Technique variety**: median user has tried ≥4 techniques by day 14.
- **Retention proxy**: 7-day streak achievement rate — the single metric the whole design serves.
- Every technique is learnable **without reading**: the animated preview alone is sufficient instruction.
