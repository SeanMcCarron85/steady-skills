# Steady Skills RPG

An **80s role-based adventure** for MS patients. You play a character in Sector 7 — quests and story tasks *are* the Steady Skills practice (memory, hand & finger dexterity, problem solving, speech). No Habitica-style exercise cards.

Zero build step. Progress in `localStorage`. Mic never required.

## How to run

```bash
python3 -m http.server 8765 --bind 0.0.0.0
```

Open [http://127.0.0.1:8765/](http://127.0.0.1:8765/).

## Core loop

1. **Character** — callsign + role (Medic Cadet / Scout / Engineer; same skills, flavored copy) · LVL / XP / gold / streak
2. **Hub** — location screen (Neon Plaza, Signal Tower, Cargo Docks, Clinic Outpost) with NPC dialogue + location nav + quest log sidebar
3. **Quest log** — Active / Available / Completed; accept quests from NPCs or the log
4. **Scenes** — short 80s RPG dialogue between tasks
5. **Challenges** — skill games embedded as quest tasks
6. Completing tasks awards XP/gold; finishing a quest awards bonus + story beat

## Story quests

| Quest | Tasks (skills) |
|-------|----------------|
| **Lost Signal** | Sequence (memory) → Broadcast (speech) → Match (memory) |
| **Cargo Run** | Cargo sort (dexterity) → Pattern (problem) → Targets (dexterity) |
| **Clinic Night Shift** | Twister (speech) → Logic (problem) → Match (memory) → Targets (dexterity) |

**Daily Dispatch** rotates by calendar date (beacon / freight / rounds / plaza patrol).

## Accessibility

Large tap targets, high-contrast neon-on-dark, keyboard + touch, short rounds, calm pacing, `prefers-reduced-motion` disables CRT scanlines. Mute toggle for beeps. Speech challenges use optional `speechSynthesis`; mic via `SpeechRecognition` is never required.

## Files

- `index.html` — structure (create → hub → scene → challenge → results)
- `styles.css` — CRT / neon theme
- `app.js` — character, hub, quests, all challenges
