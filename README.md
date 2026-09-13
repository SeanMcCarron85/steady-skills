# Steady Skills RPG

An **80s role-based adventure** for MS patients. You play a character in Sector 7 — quests and story tasks *are* the Steady Skills practice (memory, hand & finger dexterity, problem solving, speech). No Habitica-style exercise cards.

Zero build step. Progress in `localStorage` (`steady-skills-rpg-v4`; migrates from v3/v2). Mic never required.

## How to run

```bash
python3 -m http.server 8765 --bind 0.0.0.0
```

Open [http://127.0.0.1:8765/](http://127.0.0.1:8765/).

## Core loop

1. **Character creator** — callsign + role (Medic Cadet / Scout / Engineer) + composable pixel avatar (skin, hair style/color, outfit style + tint, eyes, face/paint, accessory). Live SVG preview. Avatar shown in the status bar and dialogue panels.
2. **Hub** — Neon Plaza, Signal Tower, Cargo Docks, Clinic Outpost with NPC dialogue + quest log
3. **Quest log** — Active / Available / **Side** / Completed
4. **Loadout** — equip treasures for gentle accessibility buffs
5. **Scenes** — short 80s RPG dialogue between tasks
6. **Challenges** — skill games embedded as quest tasks
7. Completing tasks awards XP/gold; finishing a quest awards bonus + story beat (+ treasure on first clear)

## Story quests

| Quest | Tasks (skills) |
|-------|----------------|
| **Lost Signal** | Sequence (memory) → Broadcast (speech) → Match (memory) |
| **Cargo Run** | Cargo sort (dexterity) → Pattern (problem) → Targets (dexterity) |
| **Clinic Night Shift** | Twister (speech) → Logic (problem) → Match (memory) → Targets (dexterity) |

**Daily Dispatch** rotates by calendar date (beacon / freight / rounds / plaza patrol). First daily clear can award **Gold Charm**.

## Side quests (picture videos)

Short in-app illustrated “picture videos” (SVG panels, filmstrip/projector frame — not YouTube). Auto-advance + tap-to-continue, subtle Ken Burns (respects `prefers-reduced-motion` + mute). Each ends with **one** light skill challenge and may grant a treasure on first clear.

| Side quest | Skill challenge | Treasure |
|------------|-----------------|----------|
| **Neon Alley Echo** | Memory (sequence) | Memory Crystal |
| **Rooftop Parcel** | Dexterity (targets) | Steady Gloves |
| **Waiting Room Whispers** | Speech (broadcast) | Voice Amulet |
| **Signal Ghost** | Memory (match) | Memory Crystal |
| **Dockside Puzzle** | Problem (pattern) | Logic Prism |
| **Clinic Lullaby** | Speech (twister) | Voice Amulet |
| **Plaza Relay** | Dexterity (targets) | Steady Gloves |

Open from hub dialogue (**SIDE QUESTS**), quest log **SIDE** tab, or the sidebar **OPEN SIDE BOARD** button.

## Treasures / loadout

Open **OPEN LOADOUT** in the hub sidebar, or **LOADOUT / TREASURES** from Neon Plaza dialogue.

| Treasure | Buff |
|----------|------|
| **Memory Crystal** | Slower sequence display + peek; one free mismatch forgive on match |
| **Steady Gloves** | Larger tap targets + slower despawn (base targets already large) |
| **Logic Prism** | One hint on pattern / logic puzzles |
| **Voice Amulet** | Slower model audio + highlight current word/phrase |
| **Gold Charm** | ~10% XP/gold bonus |

Equipped + owned treasures persist in save. Active buffs show on the loadout character panel.

## Accessibility

Large tap targets, high-contrast neon-on-dark, keyboard + touch, short rounds, calm pacing, `prefers-reduced-motion` disables CRT scanlines and Ken Burns. Mute toggle for beeps. Speech challenges use optional `speechSynthesis`; mic via `SpeechRecognition` is never required.

## Files

- `index.html` — create (avatar) → hub → loadout / side video → scene → challenge → results
- `styles.css` — CRT / neon theme + projector frame + loadout
- `app.js` — character, avatar, hub, main/daily/side quests, treasures, challenges
