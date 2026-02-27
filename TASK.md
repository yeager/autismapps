# Fas 2: Build 8 new AAC apps + profile system

## CONTEXT
SvelteKit PWA for NPF/IF/AAC tools. 3 apps exist: board-builder, talk-board, picture-schedule.
- Svelte 5 runes ($state, $derived, $effect)
- ARASAAC API (src/lib/arasaac/) — FREE, CC-BY-NC-SA 3.0
- TTS via Web Speech API (src/lib/tts/)
- IndexedDB/Dexie (src/lib/storage/) — Profile + AppProgress tables defined
- i18n (src/lib/i18n/) en.json + sv.json
- a11y stores (src/lib/a11y/)
- App registry: src/lib/apps.ts

## LICENSING & CREDITS
- ARASAAC: CC-BY-NC-SA 3.0 — show "Pictograms: ARASAAC (arasaac.org) — CC BY-NC-SA" footer in every app
- All material FREE and open. No copyrighted content.
- Sounds: Web Audio API only (no audio files)
- Animations: CSS/SVG only

## AAC / SPEECH THERAPY FOCUS
Professional tool for speech therapists, special ed teachers, parents, children.
- Core vocabulary (50+ most-used words always accessible)
- PECS phases 1-6
- Fitzgerald Key color coding (yellow=people, green=verbs, orange=objects, blue=descriptions)
- Consistent symbol placement (motor planning)
- Progressive complexity

## 8 APPS TO BUILD (src/routes/apps/<id>/+page.svelte)

### 1. situation-cards
Themed AAC boards: school, home, food, hygiene, doctor, playground, transport, feelings. ~12 ARASAAC pictograms per theme. Core words bar at bottom (yes, no, more, stop, help, I want). TTS on tap.

### 2. talking-mat
Three zones: positive(green)/neutral(yellow)/negative(red). Topic with pictogram at top. Drag options into zones. Save results. Session logging.
Credit: "Inspired by Talking Mats™ framework — talkingmats.com"

### 3. visual-timer
Circular countdown. Presets: 1,2,5,10,15,30 min. Green→yellow→red fill. First-Then board with ARASAAC pictograms. Web Audio chime. Vibration API. Fullscreen. Token economy (earn star).

### 4. pecs-trainer
PECS Phase 1-6: physical exchange → distance → discrimination → sentence strip → responsive requesting → commenting. Progress tracking. Celebration animations. Data logging.
Credit: "Based on PECS® methodology by Frost & Bondy (1994). PECS® is a trademark of Pyramid Educational Consultants."

### 5. point-talk
Core vocabulary AAC board (PODD-inspired). ~50 core words always visible. Category tabs: people, actions, descriptions, things, places, feelings, questions, social. Sentence strip + TTS.
Credit: "Inspired by core vocabulary research (Cross et al., 2006)"

### 6. phrase-builder
Subject + Verb + Object columns with pictograms. Fitzgerald Key colors. Sentence preview strip. TTS. Save favorites. Templates.
Credit: "Uses Fitzgerald Key color coding"

### 7. emotion-map
16 emotions with pictograms. Emotion Zones (Green=calm, Yellow=frustrated, Orange=angry, Red=meltdown). Body map ("where do you feel it?"). Coping strategies per zone. Emotion diary (saved per profile).

### 8. calm-room
Sensory regulation: breathing (4-7-8 animated), deep pressure (hold circle), sound machine (Web Audio synthesized: white noise, rain, heartbeat), color flow (HSL transitions), grounding (5-4-3-2-1 exercise), muscle relaxation. Soft pastels, minimal UI.

## PROFILE SYSTEM
- src/routes/profiles/+page.svelte — big emoji avatar cards, new profile (name + emoji + optional PIN)
- PIN: 4-digit, dots display, number pad
- Role: Child/Parent/Teacher/Therapist
- src/lib/stores/profile.ts — writable store with active profile
- PIN gate on Settings advanced mode
- Profile info shown in launcher header

## I18N — add to BOTH en.json and sv.json
Key Swedish: Situationskort, Samtalsmatta, Visuell timer, PECS-träning, Pekprat, Meningsbyggare, Känslokarta, Lugna rummet, Profil/Profiler, Pinkod, Kärnord, Meningsremsa, Logoped, Speciallärare, Fas, Framsteg, Andning, Jordning, Grön/Gul/Orange/Röd zon

## DESIGN
- Professional AAC quality, Apple+IKEA aesthetic
- Touch targets min 48px, high contrast
- CSS only (no Tailwind), match existing style
- TTS on all interactive elements
- prefers-reduced-motion respected
- Back button + title + ARASAAC credit footer on every app

## AFTER BUILDING
- Set ready: true in apps.ts for each built app
- Do NOT modify existing apps
- Commit with clear messages
- Run `npm run build` — must pass clean

When finished run: openclaw system event --text "Fas 2 done: 8 AAC apps + profile system" --mode now
