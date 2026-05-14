# Slot Confirmation Delay — Reference

Everything I extracted from the actual Kotlin app to ground the prototype.
Source repo: `C:\Users\saadb\AndroidStudioProjects\wiom-csp-app-apr09\`.

---

## 1. Design tokens (from `core/common/theme/WiomTokens.kt`)

### Colors (most-used for this prototype)
| Token | Hex | Use |
|---|---|---|
| `brand.primary` | `#D9008D` | Primary CTA bg, brand accent (pink) |
| `brand.secondary` | `#4A1535` | Header bg (deep purple/maroon) |
| `brand.tint` | `#FFE5F6` | Brand-tinted bg |
| `text.primary` | `#161021` | Body text |
| `text.secondary` | `#5C5570` | Secondary/label text |
| `text.hint` | `#A7A1B2` | Hint, decorative |
| `text.inverse` | `#FFFFFF` | Text on dark/brand |
| `bg.screen` | `#FAF9FC` | Screen bg |
| `bg.surface` | `#FFFFFF` | Card bg |
| `bg.subtle` | `#F1EDF7` | Neutral tinted bg |
| `bg.urgent` | `#FFF2BF` | Urgent timer strip (yellow) **← also our context-screen yellow** |
| `bg.warning` | `#FFF2BF` | Warning bg |
| `bg.caution` | `#FFF8E1` | Caution bg (paler yellow) |
| `bg.info` | `#F1E5FF` | Info bg (purple tint) — current `AWAITING_CUSTOMER` banner |
| `bg.positive` | `#E1FAED` | Success bg |
| `bg.negative` | `#FFE5E7` | Error/overdue bg |
| `bg.disabled` | `#D7D3E0` | Disabled bg |
| `state.positive` | `#008043` | Success text/icon |
| `state.negative` | `#D92130` | Error text/icon |
| `state.warning` | `#B85C00` | Warning text |
| `state.caution` | `#E65100` | Caution text/icon |
| `state.info` | `#6D17CE` | Info text/icon (purple) |
| `state.warning.icon` | `#E2B203` | Warning glyph (gold) |
| `stroke.primary` | `#E8E4F0` | Card borders, dividers |
| `dialog.bg` | `#F7F5FA` | Bottom-sheet bg (warm) |

### Typography (font: Noto Sans Devanagari)
Weights only: 400 / 600 / 700. **No weight 500.**

| Token | Size · Weight · Line-height | Use |
|---|---|---|
| `heroAmount` | 32 · 700 · 40 | Wallet hero amounts |
| `headingLg` | 24 · 700 · 32 | Page/sheet heading |
| `titleLg` | 20 · 500 · 28 | Top-bar title |
| `titleSm` / `batchCount` | 16 · 700 · 24/28 | Card titles, banner title |
| `cta` | 16 · 600 · 24 | Button label |
| `bodyLg` / `menuItem` | 16 · 400 · 24/28 | Reading text, menu rows |
| `labelMd` | 14 · 600 · 20 | Chips, filter chips, tabs |
| `cardIdentity` / `reasonTimer` | 14 · 600 · 24 | Card line 1 / 2 |
| `body` / `bodyMd` | 14 · 400 · 24/20 | Body text |
| `bodySmall` | 12 · 400 · 20 | Secondary, hints |
| `chipLabel` / `chipState` | 12 · 600 · 20 | Chip labels |
| `metaXs` | 10 · 400 · 16 | Timestamps |

### Spacing (4dp grid; legal: 4, 8, 12, 16, 24, 32, 40, 48, 64, 72, 84)
| Token | dp | Use |
|---|---|---|
| `xs` | 4 | icon-to-text, tight |
| `sm` | 8 | between cards inside group, chip internal |
| `md` | 12 | card content padding |
| `lg` | 16 | screen horizontal margin, **default** |
| `xxl` | 24 | section gap |
| `huge` | 32 | bigger section gap |
| `sheetContentToCta` | 48 | overlay content → CTA |
| `cardPadding` | 16 | card all-sides |
| `interCardGap` | 16 | between cards in feed |

### Radius
| Token | dp | Use |
|---|---|---|
| `tiny` | 4 | Badge |
| `chip` | 8 | Chips |
| `card` | 12 | Card |
| `cta` | 16 | Button |
| `large` | 16 | Banners, cards (DS target) |
| `dialog` | 24 | Bottom-sheet top corners only |

### Component dimensions
- Header: **64dp** height, brand-secondary bg
- Card border: **1dp** stroke.primary
- Card accent border: **4dp** left strip
- Button height: **52dp**
- Banner icon circle: **36dp** with 18dp white glyph
- Confirm-sheet illustration circle: **120dp** with 48dp icon

---

## 2. Component patterns (from real composables)

### TaskCard (the home-feed card)
File: `feature/home/.../feed/TaskCard.kt`

```
┌─────────────────────────────────────┐
│▍ [icon] TYPE · #ID · Locality   ●3  │  line 1 — cardIdentity (14/600)
│▍                                    │
│▍ reason_display_template     2:30PM │  line 2 — reasonTimer (14/600)
└─────────────────────────────────────┘
   ↑ 4dp left accent border (default grey / warning / negative)
```

- 12dp card radius, 1dp stroke.primary border, 16dp card padding
- 16dp horizontal screen margin (the card sits inside `lg` padding)
- Line 2 timer text gets a tinted background (URGENT = bg.urgent / OVERDUE = bg.negative) on **text width only**, not full row.
- Badge (●3) only when `unseen_count > 0`. Brand-pink filled circle.
- No CTA on card. Body tap → drilldown.

### WiomHeader (top bar)
- 64dp tall, **brand.secondary** (#4A1535) bg
- Left: 48dp menu icon (24dp glyph, white)
- Title: white text — `cspName · roleLabel`, titleLg (20/500/28)
- Right: notification bell with badge (debug only today)

### Drilldown layout (full screen)
1. Top bar (purple) with back arrow + title + **MoreVert kebab** (right)
2. Scroll body, 16dp horizontal padding:
   - **Banner** (the variant-tinted strip — see below)
   - **§2 Updates** (timeline SectionCard, expandable, with unseen badge)
   - **§3 Briefing** (SectionCard — booking ID, type)
   - **§4 Location** (SectionCard — address + "मैप पर देखें" link)
   - **§4b Contact** (Call CTA gated by state — "स्लॉट कन्फ़र्म के बाद उपलब्ध होगा" until SLOT_CONFIRMED)
   - **§5 Schedule** (slot + deadline + proposed-slots list + awaiting note)
   - **§6 Executor** (assigned name + "बदलें" link + "कॉल करें" link)
3. Optional sticky CTA bar at bottom (only if state has an actionable CTA)

### Banner variants (drilldown top)
36dp **filled circle** (saturated color) + 18dp white glyph + Title (titleSm 16/700) + Subtitle (body 14/400).

| Tone | Bg | Icon-circle | Used in |
|---|---|---|---|
| Warning | `bg.caution` `#FFF8E1` | `state.caution` `#E65100` | AWAITING_SLOT_PROPOSAL |
| Info | `bg.info` `#F1E5FF` | `state.info` `#6D17CE` | **AWAITING_CUSTOMER_SELECTION** ← today's state |
| Positive | `bg.positive` `#E1FAED` | `state.positive` `#008043` | SLOT_CONFIRMED, RESOLVED |
| Negative | `bg.negative` `#FFE5E7` | `state.negative` `#D92130` | DELEGATED_OVERDUE |

### ExitReasonSheet (bottom sheet — pick a reason)
File: `feature/home/.../install/ExitReasonSheet.kt`

- ModalBottomSheet, top corners 24dp, bg `#F7F5FA`
- Title: headingLg "व्योम को वापस क्यों भेज रहे हैं?"
- Radio list of reasons (LOCATION_UNREACHABLE / CAPACITY_FULL / CUSTOMER_CANCELLED / TECHNICIAN_UNAVAILABLE / OTHERS)
- 2 buttons side-by-side: Secondary "वापस" + Destructive "व्योम को भेजें"

### WiomConfirmBottomSheet (illustration + heading + 2 buttons)
File: `core/common/.../WiomConfirmBottomSheet.kt`
**Exactly the pattern for Flow 3's reassurance sheet.**

```
   ╭─────────╮
   │   ⓘ    │   120dp circle (tone-tinted), 48dp icon
   ╰─────────╯
   Title (24/700, center)
   Body (16/400, secondary, center)
   ┌─────────┐ ┌─────────┐
   │ वापस    │ │ Confirm │   Secondary left, Primary/Destructive right
   └─────────┘ └─────────┘
```

### Kebab (overflow menu)
File: `TaskDrilldownScreen.kt` line 217-225
- `Icons.Outlined.MoreVert` `IconButton`, 24dp tinted white in top bar
- Opens `DropdownMenu` with `DropdownMenuItem`s using bodyLg text
- Existing items include `exit.link` ("व्योम को वापस भेजें"), `overflow.support` (Support)

---

## 3. Copy strategy

The app's voice is **conversational Hindi in Devanagari with Hinglish loanwords**. Key terms:
- Customer = **कनेक्शन** (not ग्राहक)
- Team / technician = **टीम** (not तकनीशियन)
- Wiom = **व्योम** (written in Devanagari)
- Confirm = **कन्फ़र्म** / **कन्फर्म** (both forms used)
- Slot = **स्लॉट**
- Installation = **इंस्टॉलेशन**

### Existing labels we'll reuse (verbatim from `install_labels_v1.4_hi_en.json`)
| Key | Hindi | English |
|---|---|---|
| `banner.awaiting_customer.title` | इंस्टॉलेशन का समय कन्फर्म हो रहा है | Installation time is being confirmed |
| `banner.awaiting_customer.subtitle` | एक समय भेजा है · कनेक्शन से जवाब का इंतज़ार | 1 time slot shared · Awaiting reply from connection |
| `banner.scheduling_failed.title` | कनेक्शन ने स्लॉट कन्फर्म नहीं किया | Connection didn't confirm slots |
| `banner.scheduling_failed.subtitle` | पुराने स्लॉट कैंसल हुए · CSP कोई काम नहीं | Old slots cancelled · No CSP action |
| `schedule.awaiting_customer_pick` | कनेक्शन के कन्फर्मेशन का इंतज़ार है | Awaiting confirmation from the connection |
| `reason.awaiting_customer` | समय कन्फ़र्म होना बाकी | Time yet to be confirmed |
| `reason.scheduling_failed` | कनेक्शन ने कन्फर्म नहीं किया | Connection didn't confirm |
| `exit.link` | व्योम को वापस भेजें | Send back to Wiom |
| `exit.title` | व्योम को वापस क्यों भेज रहे हैं? | Why are you sending this back? |
| `cta.confirm_exit` | व्योम को भेजें | Send to Wiom |
| `cta.back` | वापस | Back |
| `cta.assign_executor` | टीम को भेजें | Send to team |
| `customer_details.mock_address` | G 69, मातामंदिर, तीसरी गली, सेक्टर 22, द्वारका, नई दिल्ली — 110077 | (English version) |
| `slot.expired` | समाप्त | Expired |
| `scheduling_timeline` | अपडेट | Updates |

### NEW copy to write (matching the voice)
For the new SLOT_PROPOSAL_EXPIRED + archive flow:

| Where | Hindi | English | Notes |
|---|---|---|---|
| Archive section header on home | इंतज़ार में ({n}) | Waiting ({n}) | Collapsible bar |
| Archive expanded subtext | कनेक्शन के जवाब का इंतज़ार | Awaiting connection's response | Below header on expand |
| Banner title (new state) | हम कनेक्शन से समय पूछ रहे हैं | We're contacting the connection | Info tone, purple |
| Banner subtitle (new state) | जवाब आते ही आपको बताएंगे · बोनस पर असर नहीं | We'll let you know once they respond · No impact on bonus | |
| Schedule note (auto-rolled) | अब {date} के लिए पूछ रहे हैं | Now asking for {date} | Replaces "awaiting" note |
| Bonus reassurance line (sub-section) | जब तक कनेक्शन जवाब नहीं देता, आपके बोनस पर असर नहीं होगा | Your bonus is protected until the connection responds | Inline in drilldown |
| PN — customer responded | कनेक्शन ने समय पक्का किया! | Connection confirmed the slot! | Title |
| PN — customer responded body | {date} का स्लॉट कन्फर्म हुआ · अब टीम चुनें | Slot for {date} confirmed · Pick a team | |
| PN — scheduling failed | कनेक्शन से जवाब नहीं मिला | Connection didn't respond | Title |
| PN — scheduling failed body | बुकिंग रद्द हो गई · बोनस पर असर नहीं | Booking cancelled · No impact on bonus | |
| Reassurance sheet title (Flow 3) | रुकिए — हम कोशिश कर रहे हैं | Hold on — we're handling this | When CSP taps "व्योम को वापस भेजें" |
| Reassurance sheet body (Flow 3) | हम कनेक्शन से {date} के लिए बात कर रहे हैं। जवाब आते ही आप काम शुरू कर सकते हैं। तब तक आपके बोनस पर असर नहीं होगा। | We're following up with the connection for {date}. You can start work as soon as they respond. Your bonus is protected meanwhile. | |
| Reassurance sheet — back btn | वापस | Back | Secondary |
| Reassurance sheet — confirm btn | फिर भी रद्द करें | Cancel anyway | Destructive |

---

## 4. Screen inventory (every screen in the prototype)

### Cover + index — yellow context
- **C0** — Cover / problem statement (yellow). 1 paragraph + "शुरू करें" CTA
- **C1** — Solution overview (yellow). What we're proposing in 3 lines + "फ्लो चुनें" CTA
- **IDX** — Flow index. 3 cards: "ग्राहक जवाब देता है" / "ग्राहक जवाब नहीं देता" / "पार्टनर रद्द करना चाहता है"

### Flow 1 — Customer responds (happy path)
- **F1-yc1** — Yellow context: "12 तारीख — पार्टनर ने 13 तारीख का स्लॉट भेजा" + start
- **F1-1** — Home feed: card visible, AWAITING_CUSTOMER_SELECTION state, badge=1
- **F1-2** — Drilldown of that card (info-purple banner, slot=13 May, "स्लॉट कन्फ़र्म के बाद..." everywhere)
- **F1-yc2** — Yellow context: "13 बीत गया · कनेक्शन ने जवाब नहीं दिया · हम कार्ड को आर्काइव में डालते हैं"
- **F1-3** — Home feed: active feed has 0–1 items now; collapsed Archive section at bottom shows "इंतज़ात में (1)"; tap to expand inline
- **F1-4** — Home feed: archive expanded inline (card visible inside it, with grey accent)
- **F1-5** — Drilldown of archive card (info banner with new "हम कनेक्शन से समय पूछ रहे हैं" / auto-rolled date 14 May, bonus reassurance line)
- **F1-yc3** — Yellow context: "14 तारीख — कनेक्शन ने जवाब दिया!"
- **F1-6** — Lock screen with push notification: "कनेक्शन ने समय पक्का किया!"
- **F1-7** — Home feed: card is back in active feed at top, accent=positive green, badge=1, banner reflects SLOT_CONFIRMED
- **F1-8** — Drilldown showing SLOT_CONFIRMED state (positive banner, "अब टीम चुनना है", CTA "टीम को भेजें")
- **F1-end** — Yellow recap screen: "हो गया · 3 दिन की चिंता बच गई"

### Flow 2 — Customer doesn't respond → SCHEDULING_FAILED
- **F2-yc1** — Yellow context: "3 दिन तक कनेक्शन ने जवाब नहीं दिया"
- **F2-1** — Home feed with archive expanded, card has been there 3 days
- **F2-2** — Drilldown (showing the auto-rolled latest date, still info banner)
- **F2-yc2** — Yellow context: "3 दिन बीत गए · सिस्टम ने तय किया कि कनेक्शन उपलब्ध नहीं · बुकिंग रद्द"
- **F2-3** — Lock screen with push notification: "कनेक्शन से जवाब नहीं मिला · बुकिंग रद्द"
- **F2-4** — Home feed: card removed from archive (empty archive or 1 less). Toast "बुकिंग रद्द हो गई"
- **F2-end** — Yellow recap: "कार्ड हटाया गया · बोनस पर असर नहीं"

### Flow 3 — Partner tries to cancel during archive
- **F3-yc1** — Yellow context: "मान लीजिए पार्टनर सोचता है — मैं इसे रद्द ही कर दूँ"
- **F3-1** — Home feed with archive expanded, card visible (same as F1-4)
- **F3-2** — Drilldown of archive card (same as F1-5) — with kebab visible top-right
- **F3-3** — Kebab dropdown open: "व्योम को वापस भेजें" + "Support" items
- **F3-4** — Reassurance bottom sheet over the drilldown: 120dp purple-tinted circle + info-purple icon + "रुकिए — हम कोशिश कर रहे हैं" + body explaining bonus + [वापस] [फिर भी रद्द करें]
- **F3-yc2** — Yellow context: "अगर पार्टनर 'वापस' दबाता है → drilldown पर वापस; अगर 'फिर भी रद्द' → existing ExitReasonSheet खुलता है"
- **F3-5a** — Back to drilldown (preserved state)
- **F3-5b** — ExitReasonSheet (the existing one) — radio reasons + "व्योम को भेजें"
- **F3-end** — Yellow recap: "रद्द बंद नहीं किया · सिर्फ़ एक confirmation जोड़ा"

**Total screens: ~26** (3 cover/index + 8 Flow 1 + 5 Flow 2 + 7 Flow 3 + 3 yellow recaps)

---

## 5. Navigation graph

```
C0 → C1 → IDX
            ├─→ F1-yc1 → F1-1 → F1-2 → F1-yc2 → F1-3 → F1-4 → F1-5 → F1-yc3 → F1-6 → F1-7 → F1-8 → F1-end ──→ IDX
            ├─→ F2-yc1 → F2-1 → F2-2 → F2-yc2 → F2-3 → F2-4 → F2-end ──→ IDX
            └─→ F3-yc1 → F3-1 → F3-2 → F3-3 → F3-4 ┬─(वापस)→ F3-5a → F3-end ──→ IDX
                                                    └─(फिर भी)→ F3-5b → F3-end ──→ IDX
```

Every flow ends back at IDX so the reviewer can pick another flow without restart.

---

## 6. File structure to build

```
slot-confirmation-delay/
├── REFERENCE.md       ← this file
├── README.md          ← stakeholder context + decisions
├── index.html         ← cover (C0)
├── _common/
│   ├── tokens.css     ← all colors, type, spacing as CSS variables
│   ├── components.css ← card, banner, button, sheet, header, top-bar classes
│   ├── frame.css      ← 360x800 mobile frame styling
│   └── nav.js         ← simple click-to-next + back nav
├── context/
│   ├── idx.html       ← flow index
│   ├── f1-yc-pre.html, f1-yc-mid.html, f1-yc2.html, f1-yc3.html (Flow 1 yellow)
│   ├── f2-yc-pre.html, f2-yc-mid.html, f2-yc2.html (Flow 2 yellow)
│   └── f3-yc-pre.html, f3-yc-mid.html (Flow 3 yellow)
├── flow1/             ← Flow 1 app screens (mobile-framed)
│   ├── f1-p1.html ... f1-p4.html (slot-send opener: home, drilldown, picker, sent)
│   └── f1-3.html ... f1-8.html (post-day-passed: late reply story)
├── flow2/             ← Flow 2 app screens
│   ├── f2-1.html ... f2-4.html
└── flow3/             ← Flow 3 app screens
    ├── f3-1.html ... f3-5b.html
```

---

## 7. Mobile frame spec

- Outer phone frame: 380 × 820 (visual border, slight rounded shoulders, light shadow). Optional, can be plain.
- Inner viewport: **360 × 800** (matches Android baseline). The screen content lives here.
- Status bar: 24dp at top, gray time/icons mock
- Navigation gesture bar: 24dp at bottom, light grey horizontal pill mock
- All app content sits inside 360 × ~752 (between status + nav bar)

Yellow context screens render full-width on desktop (no phone frame) for storytelling; app screens render inside the phone frame.

---

## 8. Open questions before building (please confirm)

1. **Auto-rolling date math** — when customer doesn't respond on Day N (the proposed slot day), the new proposed date should become N+1, N+2, N+3 over 3 days, then expire. Correct?
2. **Push notification visual** — render as an Android-style PN on a lock screen mockup, or just a system-banner mock over the home feed? I'd lean lock screen for storytelling clarity. OK?
3. **Other archive workflows** — you mentioned the archive section holds tasks from other workflows in similar "waiting" situations. For this prototype, should I show only the one slot-confirmation card in the archive, or also show 1-2 dummy items from other workflows to communicate "this is a shared pattern"? (Lean: 1 dummy item from another workflow, faded, just to indicate the pattern exists.)
4. **Copy review** — the NEW copy in §3 — please flag any phrase that doesn't match the app's voice or that you'd word differently before I bake it into screens.
