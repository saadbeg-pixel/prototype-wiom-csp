# Slot Confirmation Delay — Prototype

HTML clickable prototype for the CSP-side fix when a customer doesn't respond to a proposed install slot.

**Status:** Ready for stakeholder review.
**Date:** 2026-05-12.

## How to open

Double-click `index.html`. Walks through 360×800 mobile-framed screens on desktop; collapses to fullscreen on a real phone (just open the file URL).

Recommended for review: open it on a phone or in a narrow desktop window so the mobile frame disappears and you read it as the real app.

## The problem in 1 line

When a CSP proposes a slot (e.g. May 13) and the customer doesn't respond, the slot date goes stale, the customer sees a past date, and the CSP gets anxious with no clear next step.

## The proposed fix in 4 points

1. **Card moves to "इंतज़ार में" archive** on the CSP home feed after the slot day passes. Collapsed section at bottom, expand inline.
2. **Auto-rolling date** — customer-side proposed date advances one day at a time. Customer never sees a past date.
3. **Bonus protected** — partner's bonus is unaffected during the wait window.
4. **PN when customer responds** — card jumps back to active feed, partner picks up where they left off. After 3 calendar days without response, `SCHEDULING_FAILED` — booking removed, partner notified, bonus still safe.

## Three flows in the prototype

| # | Flow | Outcome |
|---|---|---|
| 1 | Customer responds (Day 2) | Card returns to active feed via PN |
| 2 | Customer doesn't respond for 3 days | Booking removed cleanly |
| 3 | Partner tries to cancel during the wait | Reassurance bottom sheet, then partner's choice |

## Walkthrough order (for review)

```
index.html                    ← problem statement
  ↓
context/c1.html               ← solution overview (4 points)
  ↓
context/idx.html              ← pick a flow
  ↓
[Flow 1 / 2 / 3]              ← all return to idx
```

Each flow ends with a yellow recap and a "next flow" CTA back to the index.

## File map

```
slot-confirmation-delay/
├── REFERENCE.md       ← design tokens + copy + Kotlin source pointers
├── README.md          ← this file
├── index.html         ← cover (entry)
├── _common/           ← shared CSS + JS (tokens, frame, components, nav)
├── context/           ← yellow story-arc screens (cover, idx, yc1/yc2/yc3 per flow)
├── flow1/             ← happy path — 9 screens
├── flow2/             ← scheduling failed — 5 screens
└── flow3/             ← cancel attempt — 7 screens
```

Total: 30 screens.

## Design fidelity

All tokens (color, type, spacing, radius) extracted **verbatim** from the main app's `core/common/theme/WiomTokens.kt`. Component patterns (TaskCard, banner, drilldown sections, bottom sheets, kebab dropdown) match the actual Compose composables 1:1. Existing Hindi labels lifted from `install_labels_v1.4_hi_en.json`; new labels written in the same voice ("कनेक्शन" for customer, "व्योम" for Wiom, conversational Devanagari).

See `REFERENCE.md` §3 for the full copy bank — existing labels reused + new labels needing review.

## What's intentionally fake / not real

- Only the action-on-the-flow buttons are wired. Drawer, chips, notifications bell, "मैप पर देखें", etc. are inert.
- The "अगला फ्रेम →" black pill that floats on app screens is a **prototype-only nav aid** — it wouldn't ship.
- Status bar time, battery, signal are static mocks.
- The lockscreen wallpaper is a brand-tinted gradient — real app uses whatever the partner has set.

## Open items for review

- [ ] Copy review — flag anything in §3 of `REFERENCE.md` that doesn't fit the app's voice
- [ ] "इंतज़ार में" naming — alternatives could be "लंबित" or "रुका हुआ" but lean on the simpler word
- [ ] Day-1 archive vs Day-3 archive visual differentiation — currently both look the same. Consider a small "3 दिन से" pill if Day 3 needs to stand out.
- [ ] What if the customer responds with **a different slot than what we auto-rolled to**? Current prototype assumes they confirm the auto-rolled date. Edge case to spec later.
