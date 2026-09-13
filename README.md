# Steady Skills RPG

An **80s role-based adventure** for MS patients. You play a character in Sector 7 — quests and story tasks *are* the Steady Skills practice (memory, hand & finger dexterity, problem solving, speech). No Habitica-style exercise cards.

Zero build step. Progress in `localStorage` (`steady-skills-rpg-v3`; migrates from v2). Mic never required.

## How to run

```bash
python3 -m http.server 8765 --bind 0.0.0.0
```

Open [http://127.0.0.1:8765/](http://127.0.0.1:8765/).

## Core loop

1. **Character creator** — callsign + role (Medic Cadet / Scout / Engineer) + composable pixel avatar (skin, hair style/color, outfit tint, face accent, accessory). Live SVG preview. Avatar shown in the status bar and dialogue panels.
2. **Hub** — Neon Plaza, Signal Tower, Cargo Docks, Clinic Outpost with NPC dialogue + quest log
3. **Quest log** — Active / Available / **Side** / Completed
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

## Side quests (picture videos)

Short in-app illustrated “picture videos” (SVG panels, filmstrip/projector frame — not YouTube). Auto-advance + tap-to-continue, subtle Ken Burns (respects `prefers-reduced-motion` + mute). Each ends with **one** light skill challenge.

| Side quest | Skill challenge |
|------------|-----------------|
| **Neon Alley Echo** | Memory (sequence) |
| **Rooftop Parcel** | Dexterity (targets) |
| **Waiting Room Whispers** | Speech (broadcast) |

Open from hub dialogue (**SIDE QUESTS**), quest log **SIDE** tab, or the sidebar **OPEN SIDE BOARD** button.

## Accessibility

Large tap targets, high-contrast neon-on-dark, keyboard + touch, short rounds, calm pacing, `prefers-reduced-motion` disables CRT scanlines and Ken Burns. Mute toggle for beeps. Speech challenges use optional `speechSynthesis`; mic via `SpeechRecognition` is never required.

## Files

- `index.html` — create (avatar) → hub → scene / side video → challenge → results
- `styles.css` — CRT / neon theme + projector frame
- `app.js` — character, avatar, hub, main/daily/side quests, challenges
