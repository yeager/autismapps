# Autism Apps — Phase 1 Build

Build a complete SvelteKit PWA project called "Autism Apps" — a launcher for ~39 specialized apps for children/youth with autism, ADHD, and verbal dyspraxia.

## Tech Stack
- **SvelteKit** with TypeScript
- **PWA** with Service Worker (offline-first)
- **Piper WASM** for TTS (primary), Web Speech API fallback
- **ARASAAC API** for pictograms (https://api.arasaac.org/v1/)
- **IndexedDB** for local storage (via idb or Dexie)
- CSS with clean, professional design — NOT childish, think Apple-quality accessibility

## What to Build

### 1. Project Structure
```
autismapps/
├── src/
│   ├── lib/
│   │   ├── tts/           # Piper WASM + fallback engine
│   │   ├── i18n/          # Translation system (English default, Swedish, 18 languages)
│   │   ├── a11y/          # Accessibility: screen reader toggle, contrast, text size
│   │   ├── arasaac/       # ARASAAC API client (search, fetch pictograms, cache)
│   │   ├── storage/       # IndexedDB wrapper for user data
│   │   └── components/    # Shared UI components
│   ├── routes/
│   │   ├── +layout.svelte     # Global layout with back button, settings access
│   │   ├── +page.svelte       # LAUNCHER — grid of app cards with categories
│   │   ├── settings/          # Settings page (simple + advanced modes)
│   │   └── apps/
│   │       ├── board-builder/     # AAC Board Builder (FULL APP)
│   │       ├── talk-board/        # Interactive talk board (FULL APP)  
│   │       ├── picture-schedule/  # Picture Schedule (FULL APP)
│   │       └── [placeholder routes for remaining 36 apps with "coming soon"]
│   └── app.html
├── static/
│   ├── icons/          # App icons (generate SVG icons for all 39 apps)
│   ├── manifest.json   # PWA manifest
│   └── sw.js          # Service worker
├── messages/           # i18n JSON files (en.json, sv.json)
└── package.json
```

### 2. Launcher Design
- Big grid of illustrated cards, each app has unique SVG icon
- 6 categories with color coding:
  - 🟠 Communication (AAC) — orange
  - 🔵 Daily Routines — blue
  - 🟢 Time & Planning — green
  - 🟣 Emotions & Calm — purple
  - 🟡 Learning — yellow
  - 🔴 Memory & Play — red
- Category filter bar at top
- Search bar with TTS (speak search query)
- Large, clear cards (min 120x120px touch targets)
- Smooth animations (respects prefers-reduced-motion)
- Back button ALWAYS visible, same position

### 3. Accessibility (CRITICAL — this is for disabled children)
- Screen reader on/off toggle (global)
- TTS reads EVERYTHING on hover/focus (slow speed, 0.7x default)
- Phonetic emphasis mode — over-clear pronunciation
- High contrast mode / Dark mode / Normal
- Text size: 3 steps (normal, large, extra large)
- Reduced motion mode
- Keyboard navigation throughout
- ARIA labels on everything
- Simple mode (fewer options) / Advanced mode (all settings)

### 4. TTS Engine
- Primary: Piper WASM (download voice models on first use)
  - Swedish: `sv_SE-nst-medium` 
  - English: `en_US-amy-medium`
- Fallback: Web Speech API / espeak-ng
- Slow speech rate (0.7x default, adjustable)
- Visual word highlighting while speaking
- Repeat on tap/click

### 5. Board Builder (FULL IMPLEMENTATION)
The flagship AAC app. Like the image shown — a communication board builder:
- ARASAAC pictogram search (with Swedish + English keywords)
- Drag-and-drop pictograms onto a grid
- Configurable grid size (3x3, 4x4, 5x5, 6x6, custom)
- Category color borders (like in the reference image — orange for daily life, etc)
- Center topic area with title + icon
- Text labels under each pictogram (editable)
- TTS on tap (tap any cell → speak the word)
- Export: PDF, PNG, Print
- Save/load boards to IndexedDB
- Pre-made template boards (Home, School, Food, Hygiene, Emotions, etc)

### 6. Talk Board (FULL IMPLEMENTATION)
Interactive communication board for daily use:
- Load boards created in Board Builder
- Full-screen mode for tablet use
- Quick-access bar: Yes / No / Help / Toilet / More / Stop
- TTS on every tap
- Sentence strip at top (tap multiple → builds sentence → speak all)
- Scanning mode (auto-highlight cells for switch access)
- Large touch targets, high contrast

### 7. Picture Schedule (FULL IMPLEMENTATION)
Visual daily schedule:
- Drag ARASAAC pictograms to create schedule
- "Now" marker that moves through the day
- Check off completed items (satisfying animation)
- Timer per activity
- TTS reads each activity
- Morning/Afternoon/Evening sections
- Print schedule

### 8. Settings Page
Simple mode:
- Language (en/sv)
- Voice selection
- Text size
- Theme (light/dark/high contrast)

Advanced mode:
- TTS speed (0.3x — 1.5x)
- Phonetic emphasis on/off
- Screen reader on/off
- Animation on/off
- ARASAAC style (color/BW)
- Which apps to show/hide
- Export/import user data
- Clear all data

### 9. i18n
- English as default
- Swedish translation for all UI strings
- Structure ready for 18+ languages
- Use $t('key') pattern throughout
- All app names in English with translations

### 10. Generated Assets
Create SVG icons for ALL 39 apps. Each icon should be:
- Simple, recognizable, professional
- Consistent style (rounded, friendly but not childish)
- Category color as accent
- 512x512 SVG with proper viewBox

The 39 apps:
**Communication**: Board Builder, Talk Board, Situation Cards, Sign Dictionary, Talking Mat, PECS Trainer, Point Talk, Phrase Builder, PECS Board, Conversation Aid, Social Stories
**Daily Routines**: Day Planner, Picture Schedule, My Schedule, Routine Buddy, Step Guide, Clothes Chooser, Cooking Helper
**Time & Planning**: Visual Timer, Time Tracker, Clock Teacher, Break Check, Practice Board, School Day
**Emotions & Calm**: Emotion Map, Calm Room, Focus Buddy, Energy Meter, Anger Manager, Reward Chart
**Learning**: Word Builder, Sentence Builder, Letter Journey, Math Aid, Money Check
**Memory & Play**: Memory Game, Sound Library, Diary, Chooser

### Design Philosophy
- Professional but warm — think Apple + IKEA
- Not "baby" design — these are tools, not toys
- Clear visual hierarchy
- Consistent spacing and typography
- System font stack for speed
- Colors from a carefully chosen accessible palette
- Every interaction gives feedback (visual + audio)
- Error states are gentle and helpful

## IMPORTANT
- This is for REAL users with disabilities. Quality matters more than speed.
- Test with keyboard navigation
- Ensure all images have alt text
- No placeholder "lorem ipsum" — real content everywhere
- Make it actually work offline after first load
- Board Builder must be fully functional with ARASAAC search

When completely finished, run this command to notify me:
openclaw system event --text "Done: Autism Apps Phase 1 — SvelteKit launcher + Board Builder + Talk Board + Picture Schedule fully built" --mode now
