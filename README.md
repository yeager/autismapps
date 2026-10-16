# Autismappar 🧩

**SvelteKit PWA with 72 AAC and learning tools for children with neurodevelopmental conditions (NPF), intellectual disabilities (IF) and verbal dyspraxia**

🌐 **Live:** [yeager.github.io/autismapps](https://yeager.github.io/autismapps/)  
🇸🇪 **Swedish name:** Autismappar (NPF-appar)
🇬🇧 **English name:** Autismapps ([autismapps.online](https://autismapps.online/))
📄 **License:** CC BY-NC-SA 4.0

---

## What is this?

A free, open-source collection of evidence-based apps designed for children with neurodevelopmental conditions (NPF/NDD — autism, ADHD), intellectual disabilities (IF/ID), and speech-language difficulties. Built as a single Progressive Web App that works offline on any device.

### Design Principles

- **Calm and consistent** — clear typography, steady layouts, and large touch targets
- **Grounded in established approaches** — AAC, TEACCH, PECS, DTTC, and Fitzgerald Key
- **Accessible** — 48px touch targets, high contrast, `prefers-reduced-motion`
- **Multimodal** — Image + text + TTS on every interaction
- **LAMP positioning** — Buttons never change position across sessions
- **Core vocabulary** — ~200-400 words covering 80% of communication
- **Free to use** — No ads or account required; preferences stay on the device. External services may process technical request data.

## Featured tools

The launcher currently contains **72 tools** across eight categories. The lists below highlight core workflows; the live catalogue in the app registry is the source of truth for the complete set.

### Communication (AAC)
| App | Description |
|-----|-------------|
| 🗣️ Talk Board | Core vocabulary grid with Fitzgerald Key colors |
| 🖼️ PECS Board | Picture exchange communication boards |
| 💬 Conversation Aid | Ready-made phrases for everyday conversations |
| 📝 Phrase Builder | Build sentences from pictograms |
| 👆 Point Talk | Point-to-communicate board |
| 🤟 Sign Dictionary | Swedish Sign Language videos (SU lexikon) |

### Emotions & Self-Regulation
| App | Description |
|-----|-------------|
| 😊 Emotion Map | Emotion zones, diary, quiz mode |
| 🌊 Calm Room | Breathing exercises (4 patterns), grounding, emergency button |
| 🌋 Anger Manager | Anger thermometer with calming strategies |
| ⚡ Energy Meter | Track and regulate energy levels |
| ⏸️ Break Check | Guided sensory break exercises |

### Daily Life & Routines
| App | Description |
|-----|-------------|
| 📅 Day Planner | Visual daily timeline |
| 📋 My Schedule | Custom visual schedule builder |
| 🗓️ Routine Buddy | Step-by-step morning/evening/school routines |
| 📸 Picture Schedule | Visual activity schedules |
| 🏫 School Day | Follow your school timetable |
| 📋 Practice Board | Daily task checklists |
| 📖 Step Guide | Visual step-by-step instructions |
| 📓 Diary | Mood-based daily diary |
| 👔 Clothes Chooser | Pick clothes by weather |

### Learning
| App | Description |
|-----|-------------|
| 🔤 Letter Journey | Letter learning with coarticulation (DTTC/CAS) |
| 📚 Picture Dictionary | 72 words, flashcards, quiz |
| 🔤 Word Builder | Build words letter by letter |
| 📝 Sentence Builder | Color-coded sentence construction |
| 🧩 Memory Game | Match pairs (4 themes) |
| 🔢 Math Aid | Visual addition/subtraction |
| 🕐 Clock Teacher | Learn analog clock, quiz mode |
| 💰 Money Check | Swedish currency counting |
| 🔊 Sound Library | Animal, vehicle, nature sounds |
| 🍳 Cooking Helper | Step-by-step recipes |

### Social & Situations
| App | Description |
|-----|-------------|
| 📖 Social Stories | Visual stories (school, doctor, store, etc.) |
| 🃏 Situation Cards | Social situation practice |
| 🗺️ Talking Mat | Place items on opinion scales |
| 🧑‍🤝‍🧑 PECS Trainer | Practice PECS exchange flow |

### Tools
| App | Description |
|-----|-------------|
| ⏱️ Visual Timer | Countdown with visual feedback |
| ⏱️ Time Tracker | Activity timers with presets |
| ⭐ Reward Chart | Star chart for positive reinforcement |
| 🎯 Chooser | Visual choice maker |
| 🧠 Focus Buddy | Focus/attention tools |
| 👁️ Visual Support | Visual schedule templates |
| 🔨 Board Builder | Create custom communication boards |

## Tech Stack

- **SvelteKit** (Svelte 5 runes) with static adapter
- **Piper WASM** — Offline text-to-speech (Swedish/English)
- **Web Speech API** — Fallback TTS
- **Dexie** (IndexedDB) — Offline storage, profiles
- **ARASAAC** — Pictogram search (CC BY-NC-SA 3.0)
- **Svenskt teckenspråkslexikon** — Sign language videos (CC BY-NC-SA 4.0)
- **PWA** — Installable, works offline
- **CSS only** — No Tailwind, no component library

## i18n

- **Swedish (sv) and English (en):** 3,366 strings in each source catalog
- The app name, page language, share metadata, and installable PWA manifest follow the selected language: Autismappar in Swedish and Autismapps in English
- Additional translation work is managed through [Transifex](https://app.transifex.com/danielnylander/autismapps/)

## Development

```bash
npm install
npm run dev -- --host --port 5225
```

Build for GitHub Pages:
```bash
npm run build    # Output in build/
npm run preview  # Preview built site
```

Build for the launcher hosted at `autismappar.se/launcher/` and `autismapps.online/launcher/`:
```bash
npm run build:launcher
```
Upload the **contents** of `build/` into the website's `/launcher/` directory. This build uses `/launcher` for its assets and keeps the prerendered home page in `index.html`; `fallback.html` handles unknown routes. It also emits directory indexes for extensionless routes such as `/launcher/about` so they continue to work if the host has an older directory at that path. Keep `.htaccess` enabled for the slash behavior and cache headers.

Desktop app (Tauri 2) on Windows — prerequisites, bundled voices and local build: see [docs/build-desktop-windows.md](docs/build-desktop-windows.md).

## TTS Configuration

- **Default engine:** Piper WASM (offline, ~5MB model download)
- **Default rate:** 0.5x (configurable, optimized for children with language disorders)
- **Swedish voice:** `sv_SE-nst-medium`
- **English voice:** `en_US-hfc_female-medium`
- **Fallback:** Web Speech API (browser built-in)

## Credits

- [ARASAAC](https://arasaac.org/) — Pictograms (CC BY-NC-SA 3.0)
- [Svenskt teckenspråkslexikon](https://teckensprakslexikon.su.se/) — Sign language (CC BY-NC-SA 4.0, Stockholms universitet)
- PECS® — Frost & Bondy
- Talking Mats™
- Core vocabulary research (Banajee, Dicarlo & Stricklin, 2003)
- Fitzgerald Key color coding

## License

CC BY-NC-SA 4.0

---

Made with ❤️ for children who communicate differently.
