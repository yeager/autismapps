# Autismappar 🧩

**SvelteKit PWA with 42 AAC/TEACCH apps for children with autism, ADHD and verbal dyspraxia**

🌐 **Live:** [yeager.github.io/autismapps](https://yeager.github.io/autismapps/)  
🇸🇪 **Swedish name:** Autismappar  
📄 **License:** CC BY-NC-SA 4.0

---

## What is this?

A free, open-source collection of evidence-based apps designed for children with autism spectrum disorder, ADHD, and speech-language difficulties. Built as a single Progressive Web App that works offline on any device.

### Design Principles

- **Professional AAC quality** — Apple + IKEA aesthetic, not childish
- **Evidence-based** — AAC, TEACCH, LAMP, PECS, DTTC, Fitzgerald Key
- **Accessible** — 48px touch targets, high contrast, `prefers-reduced-motion`
- **Multimodal** — Image + text + TTS on every interaction
- **LAMP positioning** — Buttons never change position across sessions
- **Core vocabulary** — ~200-400 words covering 80% of communication
- **Free forever** — No cost, no ads, no tracking, open source

## Apps (42)

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

- **1105 translation keys**
- **Swedish (sv):** 100% ✅
- **10 more languages** available on [Transifex](https://app.transifex.com/danielnylander/autismapps/)
- da, de, es, fi, fr, it, nb_NO, nl, pl, pt_BR

## Development

```bash
npm install
npm run dev -- --host --port 5225
```

Build:
```bash
npm run build    # Output in build/
npm run preview  # Preview built site
```

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
