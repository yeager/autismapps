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
- **Piper WASM** — Offline text-to-speech (Swedish, English, Brazilian Portuguese)
- **Web Speech API** — Fallback TTS
- **Dexie** (IndexedDB) — Offline storage, profiles
- **Piktali and ARASAAC** — Local pictogram catalogue and online pictogram search
- **Svenskt teckenspråkslexikon** — Sign language videos (CC BY-NC-SA 4.0)
- **PWA** — Installable, works offline
- **CSS only** — No Tailwind, no component library

## i18n

- **Swedish (sv), English (en), and Brazilian Portuguese (pt-BR)** are available locales. Some pt-BR pronunciation content, including tongue-viewer sequences, is still awaiting speech-language specialist review.
- Swedish pages use the Autismappar name; English and pt-BR pages use Autismapps. Page language, share metadata, and the installable PWA manifest follow the selected locale.
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

Build localized launcher trees for Loopia:
```bash
npm run build:launcher:domains # English in build/, Swedish in build-sv/
npm run verify:launcher:locales
npm run audit:links
```

Generate the bilingual legacy app-detail pages used at `/apps/<id>.html` on Loopia:
```bash
npm run build:loopia-app-pages # 72 pages in build-loopia-root/apps/
```
These pages use the app registry and Swedish/English message catalogs as their source, select the brand from the hostname, and link to the matching app through a relative same-domain launcher path. Both public hostnames use the shared Loopia document root `autismappar.se/public_html/`.

The source is shared in this repository, and the active Loopia launchers are also in the shared document root. Upload the **contents** of each build, preserving its relative paths:

- `build-sv/` → `autismappar.se/public_html/launcher-sv/` for `autismappar.se`
- `build/` → `autismappar.se/public_html/launcher/` for `autismapps.online`

The root `.htaccess` rewrites Swedish `/launcher/` requests to `launcher-sv/`; English `/launcher/` requests use the shared `launcher/` directory. The separate FTPS tree `autismapps.online/public_html/` is not the active web root for the public English hostname. Preserve the shared root and launcher `.htaccess` files and do not delete extra server files when deploying. The launcher build keeps the prerendered home page in `index.html`, uses `fallback.html` for unknown routes, and emits directory indexes for extensionless app routes.

If preparing a partial upload, include both versioned search catalogs from each build: `arasaac-sv-<revision>.json` and `piktali-pictograms/manifest-<revision>.json`. They are required by the launcher search code; omitting them makes pictogram searches return no results. `npm run verify:launcher:locales` checks these files in both language builds before upload.

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
