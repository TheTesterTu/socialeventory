# SceneLink — Production Readiness Plan (June 2026)

The master plan to take SceneLink from "kinda working demo" to a real,
launchable, RA-quality discovery + community platform. This document is
*the source of truth*. Anything not on this list is out of scope until v1.1.

## North star

> **"The map-first, magazine-grade way to find events worth showing up to —
> and the people worth showing up with."**

Inspiration: Resident Advisor (editorial trust + map browsing), Partiful
(soft, social RSVPs), Eventbrite (breadth), Dice (curation). What we add:
**solo-friendly signals** + **community-first event pages**.

---

## 1. Kill all mocks (P0 — ship today)

| File | Status | Action |
|---|---|---|
| `src/pages/OrganizerProfile.tsx` | Hardcoded `mockOrganizer` | Rewrite to fetch real `profiles` + their `events` by `:id` |
| `src/pages/Profile.tsx` | `mockSavedEvents` fallback | Replace with proper empty state |
| `src/components/home/SmartRecommendations.tsx` | Hardcoded `userInterests` + duplicates `PersonalizedEvents` | **Remove from Landing**; keep file or fold into PersonalizedEvents |
| `src/components/home/PersonalizedEvents.tsx` | Labelled "Recommended" but sorts by `created_at` | Wire into `useEventRecommendations` with real signals |
| `src/pages/Landing.tsx` | SEO/title still "SocialEventory" | Use `APP_CONFIG.name` (SceneLink) |
| `src/lib/audit-report.md` | Stale | Mark superseded by this doc |

## 2. Brand consolidation

- Single name: **SceneLink** everywhere (logo, meta, titles, structured data, footer).
- Remove every literal `"SocialEventory"` string from `src/` and `index.html` head.
- One logo component (`src/components/brand/Logo.tsx`) is the only place renderers reference. No PNG/SVG forks.

## 3. Event page = editorial article, not a form

Current `EventDetailsOptimized` is a wall of bordered cards. Redesign:

```
┌──────────────────────────────────────────────┐
│  Full-bleed hero image (60vh, cinematic)    │
│   ↳ category chips overlay bottom-left       │
│   ↳ date pill overlay top-right              │
└──────────────────────────────────────────────┘
   <h1 large editorial>     | Sticky RSVP card
   Venue · City             | • Going (count + avatars)
   By @organizer            | • Save · Share
                            | • Price / Free
   Long-form description    | • "Going solo? You're not
   (prose, generous leading)|    the only one — 4 others"
   ↳ Tags inline at bottom  |
   ↳ Mini-map (200px)       |
                            |
   Community: comments + "say hi" pre-event chat
   Similar events strip
```

Concrete changes:
- `EventHeader.tsx`: drop the rainbow gradient; use plain `text-foreground` serif-feel headline.
- `EventDetailsOptimized.tsx`: 2-column grid only on desktop; sticky right rail for RSVP/price/share; inline description (no card around prose).
- Add attendee avatars + "going solo" pill (uses `event_attendees` data we already have).
- Add `<StructuredData type="Event">` already exists ✅.

## 4. Map: the headline feature

Already overhauled in `EventMap.tsx` (Supercluster + OSM tiles). Remaining polish:

- Hero map preview on Landing (replaces the static `EventMapPreview` block) — clickable, deep-links into `/nearby` with the camera preserved.
- Persistent "Tonight / Weekend / This week" time pills on `/nearby`.
- Pin colours by category (use `categoryColors.ts`).
- "Add event here" CTA on long-press of the map (mobile) / right-click (desktop).

## 5. Add Event flow

- `/create` is reachable from `FloatingActions` ✅. Make sure it's also a primary CTA in `TopBar` for logged-in users.
- `EventWizard` UX pass: 3 steps max (Basics → When/Where → Vibe). Show preview card alongside.
- Drop image upload into `EventImageUpload` already wired to `event-images` bucket ✅.
- After publish: confetti + share sheet + "Open on map" link.

## 6. Magazine layer (RA-style)

- `Blog` already exists with a real `blog_posts` table ✅.
- Promote it: rename UI label "Blog" → **"Stories"**, put a featured Story strip on Landing above `FeaturedEvents`.
- Each story can deep-link to relevant events (already supports `tags`).
- Admin BlogManagement panel exists ✅; verify rich text + cover upload work end-to-end.

## 7. Community model (DMs decision)

**Decision (user, 2026-05-25): No 1:1 DMs at launch.** Risk of scams, harassment,
no moderation bandwidth. Possibly a paid premium feature later.

What stays:
- **Public event chat** per event (`comments` table, `EventChatModal`) — visible to attendees only.
- **Soft connections**: follow organizers, see who else is going (respect `hide_attendance`).
- **"Say hi" pre-event** = a public comment, no inbox.

This unblocks shipping. Re-evaluate DMs at 1k MAU.

## 8. Solo-friendly layer

The differentiator vs Eventbrite/RA:

- `event_attendees` gets a `going_solo` boolean column (migration below).
- Event card: small "🙋 3 going solo" badge when ≥1.
- Profile setting: "I sometimes go to events alone — show me others doing the same."
- Filter chip on `/search`: "Solo-friendly".

## 9. UX rot fixes (sweep)

- Replace generic emoji category chips with vibe chips: *intimate, outdoor, late-night, family-friendly, queer-safe, alcohol-free, first-timer-friendly*.
- Time-bucket filters everywhere: Tonight · Weekend · Next 7 days · Next month.
- Empty states with personality (illustration + one sentence + CTA), never blank.
- Loading skeletons match final layout (already mostly true ✅).
- Mobile bottom nav: Discover · Map · Create · Stories · You.

## 10. SEO + meta

- Sitemap reflects real routes (events, organizers, stories).
- Per-route `<SEOHead>` populated (component exists ✅).
- `og:image` for events = `imageUrl` ✅.
- Replace any remaining `Lovable Generated Project` strings.

## 11. Performance & a11y

- All images via `<OptimizedImage>` ✅.
- Lighthouse target: 90+ on mobile.
- Focus rings, `aria-label` on all icon buttons.
- Respect `prefers-reduced-motion` (audit `framer-motion` usage).

---

## Rollout order

1. **Today**: mocks killed, branding unified, event page redesign, Landing recomposed.
2. **This week**: solo column migration, vibe chips, map hero on Landing, Stories label.
3. **Next**: Add Event polish, admin tooling pass, perf/a11y sweep.

## Done means

- Zero references to `mock*` data in `src/` outside tests.
- Every primary button leads to a working flow (no `example.com/tickets/…` stubs).
- A first-time visitor on mobile lands on Landing → sees real local events → can RSVP or save in ≤2 taps after sign-up.
- Brand is consistent across head, logo, footer, SEO, structured data.
