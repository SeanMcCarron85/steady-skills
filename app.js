/**
 * Steady Skills RPG — role-based 80s adventure
 * Quests & story tasks ARE the Steady Skills practice.
 * Zero build; localStorage; mic never required.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "steady-skills-rpg-v3";
  const STORAGE_KEY_V2 = "steady-skills-rpg-v2";
  const XP_PER_LEVEL = 100;

  const ROLES = {
    medic: { id: "medic", name: "MEDIC CADET", short: "MEDIC" },
    scout: { id: "scout", name: "SCOUT", short: "SCOUT" },
    engineer: { id: "engineer", name: "ENGINEER", short: "ENGR" },
  };

  const SKILL_LABELS = {
    memory: "MEMORY",
    dexterity: "HAND & FINGER",
    problem: "PROBLEM SOLVING",
    speech: "SPEECH",
  };

  const LOCATIONS = {
    plaza: {
      id: "plaza",
      name: "NEON PLAZA",
      tag: "HUB",
      neon: "NEON PLAZA",
      desc: "City lights flicker. Dispatch boards hum. Operatives gather under pink neon.",
      npc: "DISPATCH",
      line: "Welcome to Sector 7, operative. Check your quest log — steady work keeps the city online.",
    },
    clinic: {
      id: "clinic",
      name: "CLINIC OUTPOST",
      tag: "CARE",
      neon: "CLINIC OUTPOST",
      desc: "Soft monitors. Calm voices. Night shift needs careful hands and clear speech.",
      npc: "DR. REEVES",
      line: "Glad you're here. Patients deserve patience — and practice. Night Shift is on the board.",
    },
    docks: {
      id: "docks",
      name: "CARGO DOCKS",
      tag: "FREIGHT",
      neon: "CARGO DOCKS",
      desc: "Cranes groan. Labels glow. Freight won't sort itself.",
      npc: "FOREMAN KAI",
      line: "Got a Cargo Run ready. Steady fingers, sharp thinking. Don't drop the crate.",
    },
    tower: {
      id: "tower",
      name: "SIGNAL TOWER",
      tag: "COMMS",
      neon: "SIGNAL TOWER",
      desc: "Static crackles. Antennas lean into the night. Someone lost a broadcast.",
      npc: "TECH RIN",
      line: "Lost Signal is still out there. Memory and a clear voice can bring it back.",
    },
  };

  /**
   * Quests: story-driven; each task maps to one skill challenge.
   */
  const QUESTS = {
    "lost-signal": {
      id: "lost-signal",
      name: "LOST SIGNAL",
      location: "tower",
      giver: "TECH RIN",
      blurb: "Restore a dead broadcast with memory and speech.",
      xpBonus: 40,
      goldBonus: 20,
      tasks: [
        {
          id: "ls-1",
          skill: "memory",
          challenge: "sequence",
          title: "RELAY CIPHER",
          introNpc: "TECH RIN",
          intro:
            "The relay pads lit a pattern before the feed died. Watch close — then replay it. Memory first.",
          doneNpc: "TECH RIN",
          done: "Cipher holds! Now we need a human voice on the carrier wave.",
        },
        {
          id: "ls-2",
          skill: "speech",
          challenge: "broadcast",
          title: "VOICE ON THE CARRIER",
          introNpc: "TECH RIN",
          intro:
            "Read the beacon words clearly. Pace yourself. Model audio is there if you want it — mic optional.",
          doneNpc: "TECH RIN",
          done: "Signal locked. Sector 7 can hear the plaza again. Nice work.",
        },
        {
          id: "ls-3",
          skill: "memory",
          challenge: "match",
          title: "FREQUENCY PAIRS",
          introNpc: "TECH RIN",
          intro:
            "One last sync: match the frequency tiles so the backup bank remembers the channel.",
          doneNpc: "TECH RIN",
          done: "Broadcast restored. The tower hums like it should.",
        },
      ],
      completeBeat:
        "Pink neon on the tower winks twice. Somewhere across the plaza, a radio crackles to life. You did that.",
    },
    "cargo-run": {
      id: "cargo-run",
      name: "CARGO RUN",
      location: "docks",
      giver: "FOREMAN KAI",
      blurb: "Sort freight and crack routing locks for a tight delivery.",
      xpBonus: 40,
      goldBonus: 18,
      tasks: [
        {
          id: "cr-1",
          skill: "dexterity",
          challenge: "cargo",
          title: "BAY SORT",
          introNpc: "FOREMAN KAI",
          intro:
            "Chips go in the right bays. Drag them — or select and hit Place. Large targets. No rush.",
          doneNpc: "FOREMAN KAI",
          done: "Bays look clean. Now decode the routing pattern before the crane moves.",
        },
        {
          id: "cr-2",
          skill: "problem",
          challenge: "pattern",
          title: "ROUTE PATTERN",
          introNpc: "FOREMAN KAI",
          intro: "Manifest codes follow a pattern. What's next? Think it through.",
          doneNpc: "FOREMAN KAI",
          done: "Route accepted. One more lock on the outbound crate.",
        },
        {
          id: "cr-3",
          skill: "dexterity",
          challenge: "targets",
          title: "SEAL THE HATCH",
          introNpc: "FOREMAN KAI",
          intro:
            "Tap the seal points as they light. Big hit zones. Miss one? Next seal still comes.",
          doneNpc: "FOREMAN KAI",
          done: "Hatch sealed. Delivery's on time. Docks owe you a coffee.",
        },
      ],
      completeBeat:
        "The freighter lifts. Foreman Kai nods once — high praise on the docks. Cargo secured.",
    },
    "clinic-shift": {
      id: "clinic-shift",
      name: "CLINIC NIGHT SHIFT",
      location: "clinic",
      giver: "DR. REEVES",
      blurb: "A respectful night of patient-care practice across all four skills.",
      xpBonus: 55,
      goldBonus: 25,
      tasks: [
        {
          id: "cs-1",
          skill: "speech",
          challenge: "twister",
          title: "CLEAR CHECK-IN",
          introNpc: "DR. REEVES",
          intro:
            "Patients hear better when we speak clearly. Practice these short phrases. No judgment — just steady voice work. Mic never required.",
          doneNpc: "DR. REEVES",
          done: "Good. Next: the med locker needs its codes in order.",
        },
        {
          id: "cs-2",
          skill: "problem",
          challenge: "logic",
          title: "MED LOCKER ORDER",
          introNpc: "DR. REEVES",
          intro:
            "Sort the locker labels correctly. Careful thinking keeps the night calm.",
          doneNpc: "DR. REEVES",
          done: "Locker open. Now a short memory check on the chart codes.",
        },
        {
          id: "cs-3",
          skill: "memory",
          challenge: "match",
          title: "CHART PAIRS",
          introNpc: "DR. REEVES",
          intro: "Match the chart symbols. Slow is fine. Accuracy helps everyone.",
          doneNpc: "DR. REEVES",
          done: "Charts sync. Last: gentle target taps for hand steadiness.",
        },
        {
          id: "cs-4",
          skill: "dexterity",
          challenge: "targets",
          title: "STEADY HANDS",
          introNpc: "DR. REEVES",
          intro:
            "Tap each soft target. Large zones. This is practice — not a race.",
          doneNpc: "DR. REEVES",
          done: "Night shift held. Patients rested. You made the outpost quieter.",
        },
      ],
      completeBeat:
        "Dawn filters through clinic glass. Dr. Reeves: \"Thank you. Steady work is care.\" You clock out lighter.",
    },
  };

  /** Daily dispatch templates (rotate by date). */
  const DAILY_TEMPLATES = [
    {
      id: "daily-mem-speech",
      name: "DAILY: BEACON CHECK",
      location: "tower",
      giver: "DISPATCH",
      blurb: "Quick memory + speech drill for today's channel.",
      xpBonus: 25,
      goldBonus: 12,
      tasks: [
        {
          id: "d1-a",
          skill: "memory",
          challenge: "sequence",
          title: "PAD RECALL",
          introNpc: "DISPATCH",
          intro: "Daily beacon pad sequence. Watch, then replay.",
          doneNpc: "DISPATCH",
          done: "Pads confirmed. Speak the call signs.",
        },
        {
          id: "d1-b",
          skill: "speech",
          challenge: "broadcast",
          title: "CALL SIGNS",
          introNpc: "DISPATCH",
          intro: "Read today's call signs aloud. Your pace.",
          doneNpc: "DISPATCH",
          done: "Daily beacon clear. Come back tomorrow.",
        },
      ],
      completeBeat: "Dispatch stamps TODAY CLEAR on the board.",
    },
    {
      id: "daily-dex-prob",
      name: "DAILY: FREIGHT SNAP",
      location: "docks",
      giver: "DISPATCH",
      blurb: "Dexterity + problem solving for a short haul.",
      xpBonus: 25,
      goldBonus: 12,
      tasks: [
        {
          id: "d2-a",
          skill: "dexterity",
          challenge: "cargo",
          title: "QUICK SORT",
          introNpc: "DISPATCH",
          intro: "Sort today's chips into bays. Place buttons work great.",
          doneNpc: "DISPATCH",
          done: "Sorted. Crack the short pattern.",
        },
        {
          id: "d2-b",
          skill: "problem",
          challenge: "pattern",
          title: "MANIFEST MATH",
          introNpc: "DISPATCH",
          intro: "What comes next in the freight pattern?",
          doneNpc: "DISPATCH",
          done: "Haul logged. Daily done.",
        },
      ],
      completeBeat: "A crane beep acknowledges. Daily freight snap complete.",
    },
    {
      id: "daily-clinic",
      name: "DAILY: ROUNDS",
      location: "clinic",
      giver: "DISPATCH",
      blurb: "Short clinic practice — speech + logic.",
      xpBonus: 25,
      goldBonus: 12,
      tasks: [
        {
          id: "d3-a",
          skill: "speech",
          challenge: "twister",
          title: "SOFT PHRASES",
          introNpc: "DISPATCH",
          intro: "Practice clear phrases for morning rounds. Mic optional.",
          doneNpc: "DISPATCH",
          done: "Voice warm. Sort one locker.",
        },
        {
          id: "d3-b",
          skill: "problem",
          challenge: "logic",
          title: "SUPPLY ORDER",
          introNpc: "DISPATCH",
          intro: "Put supply labels in the right order.",
          doneNpc: "DISPATCH",
          done: "Rounds logged. Rest well.",
        },
      ],
      completeBeat: "Clinic tablet pings: daily rounds complete.",
    },
    {
      id: "daily-mix",
      name: "DAILY: PLAZA PATROL",
      location: "plaza",
      giver: "DISPATCH",
      blurb: "Memory match + target taps around the plaza.",
      xpBonus: 25,
      goldBonus: 12,
      tasks: [
        {
          id: "d4-a",
          skill: "memory",
          challenge: "match",
          title: "SIGN PAIRS",
          introNpc: "DISPATCH",
          intro: "Match neon sign tiles on the plaza board.",
          doneNpc: "DISPATCH",
          done: "Signs synced. Tap the patrol seals.",
        },
        {
          id: "d4-b",
          skill: "dexterity",
          challenge: "targets",
          title: "PATROL SEALS",
          introNpc: "DISPATCH",
          intro: "Tap each seal light. Large targets.",
          doneNpc: "DISPATCH",
          done: "Plaza patrol complete for today.",
        },
      ],
      completeBeat: "Neon Plaza feels a little steadier. Daily clear.",
    },
  ];


  // ---- Avatar options ----
  const SKIN_TONES = [
    { id: "fair", label: "FAIR", color: "#f5d0b0" },
    { id: "warm", label: "WARM", color: "#d4a574" },
    { id: "tan", label: "TAN", color: "#c68642" },
    { id: "deep", label: "DEEP", color: "#8d5524" },
    { id: "rich", label: "RICH", color: "#5c3317" },
  ];
  const HAIR_STYLES = [
    { id: "short", label: "SHORT" },
    { id: "buzz", label: "BUZZ" },
    { id: "long", label: "LONG" },
    { id: "pony", label: "PONY" },
    { id: "bald", label: "BALD" },
  ];
  const HAIR_COLORS = [
    { id: "black", label: "BLK", color: "#1a1a1a" },
    { id: "brown", label: "BRN", color: "#4a3020" },
    { id: "blonde", label: "BLN", color: "#d4a84b" },
    { id: "red", label: "RED", color: "#a04030" },
    { id: "pink", label: "PNK", color: "#ff71ce" },
    { id: "cyan", label: "CYN", color: "#01cdfe" },
  ];
  const OUTFIT_TINTS = [
    { id: "magenta", label: "MAG", color: "#ff71ce" },
    { id: "cyan", label: "CYN", color: "#01cdfe" },
    { id: "lime", label: "LIM", color: "#05ffa1" },
    { id: "purple", label: "PRP", color: "#b967ff" },
    { id: "yellow", label: "YEL", color: "#fffb96" },
  ];
  const FACE_ACCENTS = [
    { id: "none", label: "NONE" },
    { id: "smile", label: "SMILE" },
    { id: "freckles", label: "FRECK" },
    { id: "glasses", label: "GLASS" },
    { id: "blush", label: "BLUSH" },
  ];
  const ACCESSORIES = [
    { id: "none", label: "NONE" },
    { id: "hat", label: "HAT" },
    { id: "headset", label: "HEAD" },
    { id: "badge", label: "BADGE" },
    { id: "bandana", label: "BAND" },
  ];

  function defaultAvatar() {
    return {
      skin: "warm",
      hairStyle: "short",
      hairColor: "brown",
      outfit: "magenta",
      face: "none",
      accessory: "none",
    };
  }

  /**
   * Side quests: short picture-style videos (SVG panels) + one light challenge.
   */
  const SIDE_QUESTS = {
    "neon-alley": {
      id: "neon-alley",
      name: "NEON ALLEY ECHO",
      blurb: "Follow a soft echo down the alley — then replay the pad pattern.",
      skill: "memory",
      challenge: "sequence",
      challengeTitle: "ECHO PADS",
      xpBonus: 28,
      goldBonus: 14,
      panels: [
        {
          scene: "alleyNight",
          caption: "Pink rain on neon. An alley hums with a half-heard melody.",
          duration: 5000,
        },
        {
          scene: "alleyEcho",
          caption: "Someone left a trail of glowing pad lights on the wet asphalt.",
          duration: 5000,
        },
        {
          scene: "alleyFollow",
          caption: "You walk carefully. No rush. The city waits for steady minds.",
          duration: 4500,
        },
        {
          scene: "alleyDoor",
          caption: "A service door blinks: REMEMBER THE PATTERN. One soft challenge ahead.",
          duration: 5000,
        },
        {
          scene: "alleyReady",
          caption: "Breathe. Watch the echo. Replay what you heard — memory is enough.",
          duration: 4500,
        },
      ],
      completeBeat:
        "The alley goes quiet, then kind. Neon settles. You carried the echo home.",
    },
    "rooftop-parcel": {
      id: "rooftop-parcel",
      name: "ROOFTOP PARCEL",
      blurb: "A gentle rooftop handoff — steady taps seal the parcel.",
      skill: "dexterity",
      challenge: "targets",
      challengeTitle: "SEAL TAPS",
      xpBonus: 28,
      goldBonus: 14,
      panels: [
        {
          scene: "roofSky",
          caption: "Dusk over Sector 7. A courier drone waits on the clinic roof.",
          duration: 5000,
        },
        {
          scene: "roofParcel",
          caption: "The parcel is light — medicine labels, nothing flashy. Care first.",
          duration: 4800,
        },
        {
          scene: "roofPath",
          caption: "Catwalk lights blink in sequence. Large targets. Your pace.",
          duration: 4500,
        },
        {
          scene: "roofWind",
          caption: "Wind brushes the antenna. You steady your hands. Almost there.",
          duration: 4500,
        },
        {
          scene: "roofReady",
          caption: "Tap each seal light as it appears. Miss one? The next still comes.",
          duration: 4800,
        },
      ],
      completeBeat:
        "The drone lifts kindly. Rooftop quiet returns. Parcel delivered — no drama needed.",
    },
    "waiting-whispers": {
      id: "waiting-whispers",
      name: "WAITING ROOM WHISPERS",
      blurb: "Soft voices in the clinic lobby — practice clear, calm speech.",
      skill: "speech",
      challenge: "broadcast",
      challengeTitle: "CALM WORDS",
      xpBonus: 28,
      goldBonus: 14,
      panels: [
        {
          scene: "clinicLobby",
          caption: "Clinic waiting room. Soft chairs. Soft lights. Soft worries.",
          duration: 5000,
        },
        {
          scene: "clinicChat",
          caption: "A volunteer asks if you can help model clear check-in phrases.",
          duration: 4800,
        },
        {
          scene: "clinicBoard",
          caption: "The board says: KIND VOICE PRACTICE. Mic never required.",
          duration: 4500,
        },
        {
          scene: "clinicCalm",
          caption: "You sit. Shoulders ease. Words can be slow and still land.",
          duration: 4500,
        },
        {
          scene: "clinicReady",
          caption: "Read each word at your pace. Model audio is there if you want it.",
          duration: 4800,
        },
      ],
      completeBeat:
        "A patient smiles. The room feels a little kinder. Whisper practice complete.",
    },
  };

  // ---- State ----
  let state = loadState();
  let muted = !!state.muted;
  let audioCtx = null;
  let currentLocation = state.location || "plaza";
  let questTab = "available";
  let activeQuest = null; // runtime: { def, taskIndex, phase: 'intro'|'challenge'|'done' }
  let chalRuntime = null;
  let sideRuntime = null; // { id, def, panelIndex, timer }
  let draftAvatar = defaultAvatar();

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const el = {
    statusBar: $("#status-bar"),
    create: $("#view-create"),
    hub: $("#view-hub"),
    scene: $("#view-scene"),
    challenge: $("#view-challenge"),
    results: $("#view-results"),
    createName: $("#create-name"),
    btnCreate: $("#btn-create"),
    level: $("#stat-level"),
    xpText: $("#stat-xp-text"),
    xpFill: $("#xp-fill"),
    xpBar: $("#xp-bar"),
    gold: $("#stat-gold"),
    streak: $("#stat-streak"),
    role: $("#stat-role"),
    muteBtn: $("#btn-mute"),
    locTitle: $("#loc-title"),
    locDesc: $("#loc-desc"),
    sceneNeon: $("#scene-neon"),
    npcName: $("#npc-name"),
    npcLine: $("#npc-line"),
    dialogueActions: $("#dialogue-actions"),
    locList: $("#loc-list"),
    questLogList: $("#quest-log-list"),
    dailyDate: $("#daily-date"),
    dailySummary: $("#daily-summary"),
    btnDaily: $("#btn-daily"),
    sceneTitle: $("#scene-title"),
    sceneNpc: $("#scene-npc"),
    sceneText: $("#scene-text"),
    sceneActions: $("#scene-actions"),
    questProgress: $("#quest-progress"),
    chalTitle: $("#chal-title"),
    chalInstructions: $("#chal-instructions"),
    chalControls: $("#chal-controls"),
    chalStage: $("#chal-stage"),
    chalFeedback: $("#chal-feedback"),
    chalActions: $("#chal-actions"),
    chalSkill: $("#chal-skill"),
    chalRound: $("#chal-round"),
    chalScore: $("#chal-score"),
    resultsTitle: $("#results-title"),
    resultsMessage: $("#results-message"),
    resultsRewards: $("#results-rewards"),
    levelupFlash: $("#levelup-flash"),
    levelupDetail: $("#levelup-detail"),
    avatarPreview: $("#avatar-preview"),
    statusAvatar: $("#status-avatar"),
    dialogueAvatar: $("#dialogue-avatar"),
    sceneAvatar: $("#scene-avatar"),
    side: $("#view-side"),
    sideTitle: $("#side-title"),
    sideProgress: $("#side-progress"),
    panelScene: $("#panel-scene"),
    panelCaption: $("#panel-caption"),
    btnSideContinue: $("#btn-side-continue"),
    btnSideSkip: $("#btn-side-skip"),
    btnSideMenu: $("#btn-side-menu"),
    sideHint: $("#side-hint"),
  };

  // ---- Persistence ----
  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function defaultState() {
    return {
      created: false,
      name: "Operative",
      role: "medic",
      avatar: defaultAvatar(),
      level: 1,
      xp: 0,
      gold: 0,
      streak: 0,
      lastPlayDate: null,
      muted: false,
      location: "plaza",
      activeQuestIds: [],
      completedQuestIds: [],
      completedSideQuestIds: [],
      questProgress: {}, // questId -> { taskIndex }
      dailyDate: todayKey(),
      dailyCompleted: false,
      dailyId: null,
    };
  }

  function loadState() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      let fromV2 = false;
      if (!raw) {
        const v2 = localStorage.getItem(STORAGE_KEY_V2);
        if (v2) {
          raw = v2;
          fromV2 = true;
        }
      }
      if (!raw) return defaultState();
      const parsed = { ...defaultState(), ...JSON.parse(raw) };
      if (!parsed.avatar || typeof parsed.avatar !== "object") {
        parsed.avatar = defaultAvatar();
      } else {
        parsed.avatar = { ...defaultAvatar(), ...parsed.avatar };
      }
      if (!Array.isArray(parsed.completedSideQuestIds)) {
        parsed.completedSideQuestIds = [];
      }
      refreshDailyFields(parsed);
      if (fromV2) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } catch (_) {}
      }
      return parsed;
    } catch {
      return defaultState();
    }
  }

  function refreshDailyFields(s) {
    const today = todayKey();
    if (s.dailyDate !== today) {
      s.dailyDate = today;
      s.dailyCompleted = false;
      s.dailyId = pickDailyId(today);
    } else if (!s.dailyId) {
      s.dailyId = pickDailyId(today);
    }
  }

  function pickDailyId(dateStr) {
    let n = 0;
    for (let i = 0; i < dateStr.length; i++) n = (n + dateStr.charCodeAt(i) * (i + 1)) % 9973;
    return DAILY_TEMPLATES[n % DAILY_TEMPLATES.length].id;
  }

  function getDailyDef() {
    refreshDailyFields(state);
    return DAILY_TEMPLATES.find((d) => d.id === state.dailyId) || DAILY_TEMPLATES[0];
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function updateStreakOnPlay() {
    const today = todayKey();
    if (state.lastPlayDate === today) return;
    if (state.lastPlayDate) {
      const prev = new Date(state.lastPlayDate + "T12:00:00");
      const now = new Date(today + "T12:00:00");
      const diff = Math.round((now - prev) / 86400000);
      state.streak = diff === 1 ? (state.streak || 0) + 1 : 1;
    } else {
      state.streak = 1;
    }
    state.lastPlayDate = today;
  }

  function award(xp, gold) {
    updateStreakOnPlay();
    const before = state.level;
    state.xp += xp;
    state.gold += gold;
    state.level = Math.floor(state.xp / XP_PER_LEVEL) + 1;
    saveState();
    refreshStatus();
    return { leveled: state.level > before, newLevel: state.level };
  }

  // ---- Audio ----
  function ensureAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (_) {
        audioCtx = null;
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  }

  function beep(freq = 660, dur = 0.08, type = "square", vol = 0.04) {
    if (muted) return;
    ensureAudio();
    if (!audioCtx) return;
    try {
      const t0 = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    } catch (_) {}
  }

  function sfxComplete() {
    beep(523, 0.08);
    setTimeout(() => beep(659, 0.08), 90);
    setTimeout(() => beep(784, 0.12), 180);
  }

  function sfxLevelUp() {
    [392, 523, 659, 784, 1046].forEach((f, i) => {
      setTimeout(() => beep(f, 0.1, "square", 0.05), i * 100);
    });
  }

  function sfxHit() {
    beep(880, 0.05, "square", 0.03);
  }

  function sfxMiss() {
    beep(180, 0.12, "sawtooth", 0.025);
  }


  // ---- Avatar SVG ----
  function avatarColors(av) {
    const skin = (SKIN_TONES.find((s) => s.id === av.skin) || SKIN_TONES[1]).color;
    const hair = (HAIR_COLORS.find((h) => h.id === av.hairColor) || HAIR_COLORS[1]).color;
    const outfit = (OUTFIT_TINTS.find((o) => o.id === av.outfit) || OUTFIT_TINTS[0]).color;
    return { skin, hair, outfit };
  }

  function renderAvatarSVG(av, size) {
    const a = { ...defaultAvatar(), ...(av || {}) };
    const { skin, hair, outfit } = avatarColors(a);
    const s = size || 64;
    let hairLayer = "";
    if (a.hairStyle === "buzz") {
      hairLayer = `<rect x="20" y="10" width="24" height="8" fill="${hair}"/>`;
    } else if (a.hairStyle === "short") {
      hairLayer = `<rect x="18" y="8" width="28" height="12" fill="${hair}"/><rect x="16" y="14" width="6" height="10" fill="${hair}"/><rect x="42" y="14" width="6" height="10" fill="${hair}"/>`;
    } else if (a.hairStyle === "long") {
      hairLayer = `<rect x="16" y="8" width="32" height="14" fill="${hair}"/><rect x="14" y="20" width="8" height="22" fill="${hair}"/><rect x="42" y="20" width="8" height="22" fill="${hair}"/>`;
    } else if (a.hairStyle === "pony") {
      hairLayer = `<rect x="18" y="8" width="28" height="12" fill="${hair}"/><rect x="44" y="18" width="8" height="18" fill="${hair}"/>`;
    }
    let faceLayer = "";
    if (a.face === "smile") {
      faceLayer = `<rect x="26" y="30" width="12" height="2" fill="#3a2030"/><rect x="28" y="32" width="8" height="2" fill="#3a2030"/>`;
    } else if (a.face === "freckles") {
      faceLayer = `<rect x="22" y="28" width="2" height="2" fill="#a06040"/><rect x="40" y="28" width="2" height="2" fill="#a06040"/><rect x="24" y="32" width="2" height="2" fill="#a06040"/><rect x="38" y="32" width="2" height="2" fill="#a06040"/>`;
    } else if (a.face === "glasses") {
      faceLayer = `<rect x="20" y="24" width="10" height="8" fill="none" stroke="${outfit}" stroke-width="2"/><rect x="34" y="24" width="10" height="8" fill="none" stroke="${outfit}" stroke-width="2"/><rect x="30" y="26" width="4" height="2" fill="${outfit}"/>`;
    } else if (a.face === "blush") {
      faceLayer = `<rect x="20" y="30" width="6" height="3" fill="#ff8fab" opacity="0.7"/><rect x="38" y="30" width="6" height="3" fill="#ff8fab" opacity="0.7"/>`;
    }
    let accLayer = "";
    if (a.accessory === "hat") {
      accLayer = `<rect x="16" y="4" width="32" height="6" fill="${outfit}"/><rect x="22" y="0" width="20" height="6" fill="${outfit}"/>`;
    } else if (a.accessory === "headset") {
      accLayer = `<rect x="14" y="18" width="4" height="12" fill="#01cdfe"/><rect x="46" y="18" width="4" height="12" fill="#01cdfe"/><rect x="14" y="16" width="36" height="3" fill="#01cdfe"/>`;
    } else if (a.accessory === "badge") {
      accLayer = `<rect x="38" y="48" width="8" height="8" fill="#fffb96"/><rect x="40" y="50" width="4" height="4" fill="#05ffa1"/>`;
    } else if (a.accessory === "bandana") {
      accLayer = `<rect x="18" y="16" width="28" height="5" fill="${outfit}"/><rect x="42" y="18" width="8" height="4" fill="${outfit}"/>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${s}" height="${s}" shape-rendering="crispEdges" aria-hidden="true">
      <rect width="64" height="64" fill="#0a0414"/>
      <rect x="18" y="14" width="28" height="28" fill="${skin}"/>
      <rect x="24" y="24" width="4" height="4" fill="#1a1020"/>
      <rect x="36" y="24" width="4" height="4" fill="#1a1020"/>
      <rect x="28" y="32" width="8" height="3" fill="#3a2030"/>
      ${hairLayer}
      ${faceLayer}
      <rect x="14" y="42" width="36" height="18" fill="${outfit}"/>
      <rect x="20" y="42" width="24" height="6" fill="${skin}"/>
      ${accLayer}
    </svg>`;
  }

  function paintAvatar(node, av) {
    if (!node) return;
    node.innerHTML = renderAvatarSVG(av || state.avatar, 64);
  }

  function syncAvatarPreviews() {
    paintAvatar(el.avatarPreview, draftAvatar);
    paintAvatar(el.statusAvatar, state.avatar);
    paintAvatar(el.dialogueAvatar, state.avatar);
    paintAvatar(el.sceneAvatar, state.avatar);
  }

  function buildAvatarControls() {
    const layers = {
      skin: SKIN_TONES.map((o) => ({ id: o.id, label: o.label, color: o.color, swatch: true })),
      hairStyle: HAIR_STYLES.map((o) => ({ id: o.id, label: o.label })),
      hairColor: HAIR_COLORS.map((o) => ({ id: o.id, label: o.label, color: o.color, swatch: true })),
      outfit: OUTFIT_TINTS.map((o) => ({ id: o.id, label: o.label, color: o.color, swatch: true })),
      face: FACE_ACCENTS.map((o) => ({ id: o.id, label: o.label })),
      accessory: ACCESSORIES.map((o) => ({ id: o.id, label: o.label })),
    };
    $$("[data-layer]").forEach((row) => {
      const key = row.getAttribute("data-layer");
      const opts = layers[key] || [];
      row.innerHTML = "";
      opts.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "avatar-opt" + (opt.swatch ? " swatch" : "");
        btn.textContent = opt.swatch ? "" : opt.label;
        if (opt.swatch) {
          btn.style.setProperty("--swatch", opt.color);
          btn.setAttribute("aria-label", `${key} ${opt.label}`);
          btn.title = opt.label;
        } else {
          btn.setAttribute("aria-label", `${key} ${opt.label}`);
        }
        btn.setAttribute("aria-pressed", draftAvatar[key] === opt.id ? "true" : "false");
        btn.addEventListener("click", () => {
          draftAvatar[key] = opt.id;
          // Role tint suggestion only on first create if outfit unchanged? keep free choice
          buildAvatarControls();
          paintAvatar(el.avatarPreview, draftAvatar);
          beep(520, 0.04);
        });
        row.appendChild(btn);
      });
    });
  }

  // ---- Status UI ----
  function refreshStatus() {
    el.level.textContent = String(state.level);
    const need = XP_PER_LEVEL;
    const xp = state.xp % need;
    el.xpText.textContent = `${xp}/${need}`;
    el.xpFill.style.width = `${Math.min(100, (xp / need) * 100)}%`;
    el.xpBar.setAttribute("aria-valuenow", String(xp));
    el.gold.textContent = String(state.gold);
    el.streak.textContent = String(state.streak);
    const role = ROLES[state.role] || ROLES.medic;
    el.role.textContent = `${state.name} · ${role.short}`;
    el.muteBtn.setAttribute("aria-pressed", muted ? "true" : "false");
    el.muteBtn.textContent = muted ? "🔇" : "🔊";
    el.muteBtn.setAttribute("aria-label", muted ? "Unmute sounds" : "Mute sounds");
    paintAvatar(el.statusAvatar, state.avatar);
  }

  // ---- Views ----
  function showView(name) {
    const map = {
      create: el.create,
      hub: el.hub,
      scene: el.scene,
      side: el.side,
      challenge: el.challenge,
      results: el.results,
    };
    Object.entries(map).forEach(([k, node]) => {
      const on = k === name;
      node.classList.toggle("hidden", !on);
      if (on) node.removeAttribute("hidden");
      else node.setAttribute("hidden", "");
    });
    const showStatus = name !== "create";
    if (showStatus) {
      el.statusBar.removeAttribute("hidden");
    } else {
      el.statusBar.setAttribute("hidden", "");
    }
  }

  function goHub() {
    cleanupChallenge();
    cleanupSideVideo();
    activeQuest = null;
    showView("hub");
    renderHub();
  }

  // ---- Hub ----
  function renderHub() {
    refreshDailyFields(state);
    saveState();
    refreshStatus();
    renderLocation();
    renderLocList();
    renderQuestLog();
    renderDailyBox();
  }

  function renderLocation() {
    const loc = LOCATIONS[currentLocation] || LOCATIONS.plaza;
    state.location = loc.id;
    el.locTitle.textContent = loc.name;
    el.locDesc.textContent = loc.desc;
    el.sceneNeon.textContent = loc.neon;
    el.npcName.textContent = loc.npc;
    el.npcLine.textContent = flavorLine(loc);
    paintAvatar(el.dialogueAvatar, state.avatar);
    el.dialogueActions.innerHTML = "";

    // Suggest quests at this location
    const here = Object.values(QUESTS).filter(
      (q) =>
        q.location === loc.id &&
        !state.completedQuestIds.includes(q.id) &&
        !state.activeQuestIds.includes(q.id)
    );
    const activeHere = state.activeQuestIds
      .map((id) => QUESTS[id])
      .filter((q) => q && q.location === loc.id);

    if (activeHere.length) {
      const q = activeHere[0];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-arcade btn-primary";
      btn.textContent = `CONTINUE: ${q.name}`;
      btn.addEventListener("click", () => startOrResumeQuest(q.id));
      el.dialogueActions.appendChild(btn);
    } else if (here.length) {
      here.forEach((q) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-arcade btn-secondary";
        btn.textContent = `TALK: ${q.name}`;
        btn.addEventListener("click", () => acceptQuest(q.id));
        el.dialogueActions.appendChild(btn);
      });
    } else {
      const hint = document.createElement("p");
      hint.className = "board-hint";
      hint.style.margin = "0";
      hint.textContent =
        loc.id === "plaza"
          ? "Travel to the Tower, Docks, or Clinic — or check Daily / Side Quests."
          : "No new jobs here. Try another location or the quest log.";
      el.dialogueActions.appendChild(hint);
    }

    if (loc.id === "plaza") {
      const sideBtn = document.createElement("button");
      sideBtn.type = "button";
      sideBtn.className = "btn btn-arcade btn-secondary";
      sideBtn.textContent = "SIDE QUESTS (PICTURE VIDEOS)";
      sideBtn.addEventListener("click", () => {
        questTab = "side";
        $$(".quest-tab").forEach((t) => {
          const on = t.getAttribute("data-tab") === "side";
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        renderQuestLog();
        beep(520, 0.05);
      });
      el.dialogueActions.appendChild(sideBtn);
    }
  }

  function flavorLine(loc) {
    const role = ROLES[state.role] || ROLES.medic;
    const base = loc.line;
    if (role.id === "medic" && loc.id === "clinic") {
      return "Cadet — night shift board is lit. Steady hands, clear words. Patients first.";
    }
    if (role.id === "scout" && loc.id === "tower") {
      return "Scout eyes catch the dead channel first. Lost Signal is yours if you want it.";
    }
    if (role.id === "engineer" && loc.id === "docks") {
      return "Engineer brain likes clean bays. Cargo Run's waiting — patterns and seals.";
    }
    return `${base} (${role.short} on duty.)`;
  }

  function renderLocList() {
    el.locList.innerHTML = "";
    Object.values(LOCATIONS).forEach((loc) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.innerHTML = `<span>${loc.name}</span><span class="loc-tag">${loc.tag}</span>`;
      if (loc.id === currentLocation) btn.setAttribute("aria-current", "true");
      btn.addEventListener("click", () => {
        currentLocation = loc.id;
        state.location = loc.id;
        saveState();
        beep(520, 0.05);
        renderLocation();
        renderLocList();
      });
      li.appendChild(btn);
      el.locList.appendChild(li);
    });
  }

  function resolveQuest(id) {
    return (
      QUESTS[id] ||
      SIDE_QUESTS[id] ||
      DAILY_TEMPLATES.find((d) => d.id === id) ||
      null
    );
  }

  function renderQuestLog() {
    el.questLogList.innerHTML = "";
    let items = [];
    if (questTab === "active") {
      items = state.activeQuestIds.map(resolveQuest).filter(Boolean);
    } else if (questTab === "completed") {
      const mainDone = state.completedQuestIds.map(resolveQuest).filter(Boolean);
      const sideDone = (state.completedSideQuestIds || [])
        .map((id) => SIDE_QUESTS[id])
        .filter(Boolean);
      items = [...mainDone, ...sideDone];
    } else if (questTab === "side") {
      items = Object.values(SIDE_QUESTS);
    } else {
      items = Object.values(QUESTS).filter(
        (q) =>
          !state.activeQuestIds.includes(q.id) &&
          !state.completedQuestIds.includes(q.id)
      );
    }

    if (!items.length) {
      const empty = document.createElement("li");
      empty.className = "quest-log-empty";
      empty.textContent =
        questTab === "active"
          ? "No active quests. Accept one from Available or a location NPC."
          : questTab === "completed"
          ? "No completed story or side quests yet."
          : questTab === "side"
          ? "No side quests loaded."
          : "All story quests accepted or done. Check Daily or Side!";
      el.questLogList.appendChild(empty);
      return;
    }

    items.forEach((q) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      const isSide = !!SIDE_QUESTS[q.id];
      const sideDone =
        isSide && (state.completedSideQuestIds || []).includes(q.id);
      btn.type = "button";
      btn.className =
        "quest-log-item" +
        (questTab === "completed" || sideDone ? " done" : "");
      let skills = "";
      let meta = "";
      if (isSide) {
        skills = SKILL_LABELS[q.skill] || q.skill;
        meta = sideDone
          ? "CLEARED · picture video · " + skills
          : `Picture video · ${q.panels.length} panels · ${skills}`;
      } else {
        skills = [...new Set(q.tasks.map((t) => SKILL_LABELS[t.skill]))].join(" · ");
        const prog = state.questProgress[q.id];
        meta =
          questTab === "active" && prog
            ? `Task ${(prog.taskIndex || 0) + 1}/${q.tasks.length} · ${skills}`
            : questTab === "completed"
            ? "CLEARED · " + skills
            : `${q.tasks.length} tasks · ${skills}`;
      }
      btn.innerHTML = `<span class="ql-title">${q.name}</span><span class="ql-meta">${meta}</span>`;
      btn.addEventListener("click", () => {
        if (isSide) {
          if (sideDone && questTab === "completed") {
            el.npcName.textContent = "SIDE QUEST";
            el.npcLine.textContent = q.completeBeat;
            el.dialogueActions.innerHTML = "";
            paintAvatar(el.dialogueAvatar, state.avatar);
            return;
          }
          startSideQuest(q.id);
          return;
        }
        if (questTab === "completed") {
          el.npcName.textContent = q.giver;
          el.npcLine.textContent = q.completeBeat;
          el.dialogueActions.innerHTML = "";
          paintAvatar(el.dialogueAvatar, state.avatar);
          return;
        }
        if (questTab === "available") acceptQuest(q.id);
        else startOrResumeQuest(q.id);
      });
      li.appendChild(btn);
      el.questLogList.appendChild(li);
    });
  }

  function renderDailyBox() {
    const d = getDailyDef();
    el.dailyDate.textContent = state.dailyDate;
    const skills = d.tasks.map((t) => SKILL_LABELS[t.skill]).join(" + ");
    if (state.dailyCompleted) {
      el.dailySummary.textContent = `${d.name} — CLEARED (${skills})`;
      el.btnDaily.textContent = "DONE TODAY";
      el.btnDaily.disabled = true;
    } else if (state.activeQuestIds.includes(d.id)) {
      el.dailySummary.textContent = `${d.name} — in progress (${skills})`;
      el.btnDaily.textContent = "CONTINUE";
      el.btnDaily.disabled = false;
    } else {
      el.dailySummary.textContent = `${d.name}: ${d.blurb} (${skills})`;
      el.btnDaily.textContent = "ACCEPT";
      el.btnDaily.disabled = false;
    }
  }

  function acceptQuest(id) {
    const def = QUESTS[id] || (getDailyDef().id === id ? getDailyDef() : null);
    if (!def) return;
    if (state.completedQuestIds.includes(id)) return;
    if (id.startsWith("daily") && state.dailyCompleted) return;
    if (!state.activeQuestIds.includes(id)) {
      state.activeQuestIds.push(id);
      state.questProgress[id] = { taskIndex: 0 };
      // Store daily def snapshot fields via progress only; daily uses template
      saveState();
      sfxHit();
    }
    if (def.location) {
      currentLocation = def.location;
      state.location = def.location;
    }
    startOrResumeQuest(id);
  }

  function getQuestDef(id) {
    if (QUESTS[id]) return QUESTS[id];
    const daily = getDailyDef();
    if (daily.id === id) return daily;
    // active daily might match template id
    return DAILY_TEMPLATES.find((d) => d.id === id) || null;
  }

  function startOrResumeQuest(id) {
    const def = getQuestDef(id);
    if (!def) return;
    if (!state.activeQuestIds.includes(id) && !state.completedQuestIds.includes(id)) {
      acceptQuest(id);
      return;
    }
    const prog = state.questProgress[id] || { taskIndex: 0 };
    activeQuest = {
      id,
      def,
      taskIndex: prog.taskIndex || 0,
      isDaily: !!DAILY_TEMPLATES.find((d) => d.id === id),
    };
    showTaskIntro();
  }

  // ---- Quest scene flow ----
  function currentTask() {
    if (!activeQuest) return null;
    return activeQuest.def.tasks[activeQuest.taskIndex] || null;
  }

  function showTaskIntro() {
    const task = currentTask();
    if (!task) {
      finishQuest();
      return;
    }
    cleanupChallenge();
    showView("scene");
    el.sceneTitle.textContent = activeQuest.def.name;
    el.questProgress.textContent = `TASK ${activeQuest.taskIndex + 1}/${activeQuest.def.tasks.length}`;
    el.sceneNpc.textContent = task.introNpc;
    el.sceneText.textContent = task.intro;
    paintAvatar(el.sceneAvatar, state.avatar);
    el.sceneActions.innerHTML = "";
    const go = document.createElement("button");
    go.type = "button";
    go.className = "btn btn-arcade btn-primary";
    go.textContent = `BEGIN: ${task.title} (${SKILL_LABELS[task.skill]})`;
    go.addEventListener("click", () => startChallenge(task));
    el.sceneActions.appendChild(go);
    const back = document.createElement("button");
    back.type = "button";
    back.className = "btn btn-arcade btn-ghost";
    back.textContent = "SAVE & HUB";
    back.addEventListener("click", () => {
      state.questProgress[activeQuest.id] = { taskIndex: activeQuest.taskIndex };
      saveState();
      goHub();
    });
    el.sceneActions.appendChild(back);
  }

  function showTaskDone(task) {
    showView("scene");
    el.sceneTitle.textContent = activeQuest.def.name;
    el.questProgress.textContent = `TASK ${activeQuest.taskIndex + 1}/${activeQuest.def.tasks.length} ✓`;
    el.sceneNpc.textContent = task.doneNpc;
    el.sceneText.textContent = task.done;
    paintAvatar(el.sceneAvatar, state.avatar);
    el.sceneActions.innerHTML = "";
    const next = document.createElement("button");
    next.type = "button";
    next.className = "btn btn-arcade btn-primary";
    const more = activeQuest.taskIndex + 1 < activeQuest.def.tasks.length;
    next.textContent = more ? "NEXT TASK →" : "FINISH QUEST ★";
    next.addEventListener("click", () => {
      activeQuest.taskIndex++;
      state.questProgress[activeQuest.id] = { taskIndex: activeQuest.taskIndex };
      saveState();
      if (more) showTaskIntro();
      else finishQuest();
    });
    el.sceneActions.appendChild(next);
  }

  function finishQuest() {
    if (activeQuest && activeQuest.isSide) {
      finishSideQuestRewards();
      return;
    }
    const def = activeQuest.def;
    const isDaily = activeQuest.isDaily;
    const id = activeQuest.id;

    // Rewards
    let xp = def.xpBonus || 30;
    let gold = def.goldBonus || 15;
    // Per-task already awarded in finishChallenge; quest bonus here
    const { leveled, newLevel } = award(xp, gold);
    sfxComplete();

    state.activeQuestIds = state.activeQuestIds.filter((x) => x !== id);
    delete state.questProgress[id];
    if (isDaily) {
      state.dailyCompleted = true;
    } else if (!state.completedQuestIds.includes(id)) {
      state.completedQuestIds.push(id);
    }
    saveState();

    el.resultsTitle.textContent = isDaily ? "DAILY CLEAR" : "QUEST COMPLETE";
    el.resultsMessage.textContent = def.completeBeat || `Well done, ${state.name}.`;
    el.resultsRewards.innerHTML = `
      <div>QUEST BONUS +${xp} XP</div>
      <div>QUEST BONUS +${gold} GOLD</div>
    `;
    if (leveled) {
      el.levelupFlash.classList.remove("hidden");
      el.levelupFlash.removeAttribute("hidden");
      el.levelupDetail.textContent = `You reached LEVEL ${newLevel}`;
      sfxLevelUp();
    } else {
      el.levelupFlash.classList.add("hidden");
      el.levelupFlash.setAttribute("hidden", "");
    }
    activeQuest = null;
    showView("results");
  }


  // ---- Side quest picture videos ----
  function prefersReducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }

  function panelSceneSVG(sceneId) {
    const scenes = {
      alleyNight: `
        <rect width="320" height="200" fill="#0a0418"/>
        <rect x="0" y="140" width="320" height="60" fill="#1a0a28"/>
        <rect x="20" y="40" width="60" height="100" fill="#16082a"/>
        <rect x="100" y="20" width="80" height="120" fill="#1e0d38"/>
        <rect x="220" y="50" width="70" height="90" fill="#16082a"/>
        <rect x="30" y="70" width="20" height="12" fill="#ff71ce"/>
        <rect x="120" y="50" width="30" height="10" fill="#01cdfe"/>
        <rect x="230" y="80" width="24" height="10" fill="#05ffa1"/>
        <text x="160" y="30" text-anchor="middle" fill="#ff71ce" font-size="10" font-family="monospace">NEON ALLEY</text>
      `,
      alleyEcho: `
        <rect width="320" height="200" fill="#0a0418"/>
        <rect x="0" y="150" width="320" height="50" fill="#12061f"/>
        <circle cx="80" cy="160" r="8" fill="#ff71ce"/>
        <circle cx="140" cy="155" r="8" fill="#01cdfe"/>
        <circle cx="200" cy="162" r="8" fill="#05ffa1"/>
        <circle cx="250" cy="158" r="8" fill="#fffb96"/>
        <rect x="40" y="40" width="50" height="110" fill="#1a0a2e"/>
        <rect x="230" y="30" width="60" height="120" fill="#1e0d38"/>
        <text x="160" y="90" text-anchor="middle" fill="#b967ff" font-size="9" font-family="monospace">PAD ECHO</text>
      `,
      alleyFollow: `
        <rect width="320" height="200" fill="#080314"/>
        <polygon points="160,40 40,180 280,180" fill="#16082a"/>
        <rect x="145" y="100" width="30" height="40" fill="#ff71ce" opacity="0.5"/>
        <circle cx="100" cy="170" r="5" fill="#01cdfe"/>
        <circle cx="160" cy="175" r="5" fill="#05ffa1"/>
        <circle cx="220" cy="170" r="5" fill="#fffb96"/>
        <text x="160" y="30" text-anchor="middle" fill="#01cdfe" font-size="9" font-family="monospace">FOLLOW…</text>
      `,
      alleyDoor: `
        <rect width="320" height="200" fill="#0a0418"/>
        <rect x="110" y="40" width="100" height="140" fill="#1a0a2e" stroke="#ff71ce" stroke-width="3"/>
        <rect x="150" y="100" width="12" height="12" fill="#05ffa1"/>
        <text x="160" y="70" text-anchor="middle" fill="#fffb96" font-size="8" font-family="monospace">SERVICE</text>
        <text x="160" y="185" text-anchor="middle" fill="#01cdfe" font-size="8" font-family="monospace">REMEMBER</text>
      `,
      alleyReady: `
        <rect width="320" height="200" fill="#0d0520"/>
        <rect x="60" y="60" width="40" height="40" fill="#ff71ce"/>
        <rect x="120" y="60" width="40" height="40" fill="#01cdfe"/>
        <rect x="180" y="60" width="40" height="40" fill="#05ffa1"/>
        <rect x="240" y="60" width="40" height="40" fill="#fffb96"/>
        <text x="160" y="140" text-anchor="middle" fill="#f0e6ff" font-size="10" font-family="monospace">READY</text>
      `,
      roofSky: `
        <rect width="320" height="200" fill="#12082a"/>
        <rect x="0" y="130" width="320" height="70" fill="#1a1030"/>
        <rect x="40" y="90" width="100" height="50" fill="#2a1848"/>
        <rect x="200" y="70" width="80" height="70" fill="#241040"/>
        <circle cx="260" cy="40" r="14" fill="#fffb96" opacity="0.8"/>
        <text x="160" y="50" text-anchor="middle" fill="#01cdfe" font-size="9" font-family="monospace">ROOFTOP</text>
      `,
      roofParcel: `
        <rect width="320" height="200" fill="#0e0620"/>
        <rect x="120" y="80" width="80" height="50" fill="#05ffa1" opacity="0.85"/>
        <rect x="130" y="90" width="60" height="8" fill="#0a0414"/>
        <rect x="150" y="60" width="20" height="20" fill="#01cdfe"/>
        <text x="160" y="160" text-anchor="middle" fill="#fffb96" font-size="9" font-family="monospace">PARCEL</text>
      `,
      roofPath: `
        <rect width="320" height="200" fill="#0a0418"/>
        <rect x="20" y="100" width="280" height="16" fill="#3a2060"/>
        <circle cx="70" cy="108" r="10" fill="#ff71ce"/>
        <circle cx="140" cy="108" r="10" fill="#01cdfe"/>
        <circle cx="210" cy="108" r="10" fill="#05ffa1"/>
        <circle cx="270" cy="108" r="10" fill="#fffb96"/>
        <text x="160" y="60" text-anchor="middle" fill="#b967ff" font-size="9" font-family="monospace">CATWALK</text>
      `,
      roofWind: `
        <rect width="320" height="200" fill="#100620"/>
        <rect x="150" y="30" width="20" height="100" fill="#4a3080"/>
        <rect x="140" y="20" width="40" height="12" fill="#01cdfe"/>
        <path d="M40 80 Q80 60 120 80" stroke="#ff71ce" stroke-width="3" fill="none"/>
        <path d="M200 90 Q240 70 280 95" stroke="#05ffa1" stroke-width="3" fill="none"/>
        <text x="160" y="170" text-anchor="middle" fill="#f0e6ff" font-size="9" font-family="monospace">STEADY</text>
      `,
      roofReady: `
        <rect width="320" height="200" fill="#0d0520"/>
        <circle cx="100" cy="100" r="22" fill="#ff71ce"/>
        <circle cx="160" cy="100" r="22" fill="#01cdfe"/>
        <circle cx="220" cy="100" r="22" fill="#05ffa1"/>
        <text x="160" y="160" text-anchor="middle" fill="#fffb96" font-size="10" font-family="monospace">TAP SEALS</text>
      `,
      clinicLobby: `
        <rect width="320" height="200" fill="#0f1a22"/>
        <rect x="0" y="140" width="320" height="60" fill="#1a2830"/>
        <rect x="30" y="100" width="50" height="40" fill="#2a4050"/>
        <rect x="100" y="100" width="50" height="40" fill="#2a4050"/>
        <rect x="200" y="40" width="90" height="100" fill="#1e3040" stroke="#05ffa1" stroke-width="2"/>
        <text x="160" y="30" text-anchor="middle" fill="#05ffa1" font-size="9" font-family="monospace">CLINIC</text>
      `,
      clinicChat: `
        <rect width="320" height="200" fill="#0f1a22"/>
        <circle cx="110" cy="90" r="22" fill="#d4a574"/>
        <circle cx="210" cy="90" r="22" fill="#c68642"/>
        <rect x="90" y="112" width="40" height="30" fill="#01cdfe"/>
        <rect x="190" y="112" width="40" height="30" fill="#b967ff"/>
        <text x="160" y="170" text-anchor="middle" fill="#fffb96" font-size="9" font-family="monospace">VOLUNTEER</text>
      `,
      clinicBoard: `
        <rect width="320" height="200" fill="#0f1a22"/>
        <rect x="60" y="40" width="200" height="110" fill="#1a2830" stroke="#05ffa1" stroke-width="3"/>
        <text x="160" y="80" text-anchor="middle" fill="#05ffa1" font-size="10" font-family="monospace">KIND VOICE</text>
        <text x="160" y="105" text-anchor="middle" fill="#01cdfe" font-size="9" font-family="monospace">PRACTICE</text>
        <text x="160" y="130" text-anchor="middle" fill="#a890c0" font-size="8" font-family="monospace">MIC OPTIONAL</text>
      `,
      clinicCalm: `
        <rect width="320" height="200" fill="#0c1820"/>
        <rect x="100" y="90" width="120" height="50" fill="#243848"/>
        <circle cx="160" cy="70" r="20" fill="#d4a574"/>
        <text x="160" y="170" text-anchor="middle" fill="#b967ff" font-size="9" font-family="monospace">BREATHE</text>
      `,
      clinicReady: `
        <rect width="320" height="200" fill="#0f1a22"/>
        <text x="160" y="70" text-anchor="middle" fill="#05ffa1" font-size="14" font-family="monospace">STEADY</text>
        <text x="160" y="100" text-anchor="middle" fill="#01cdfe" font-size="14" font-family="monospace">BRIGHT</text>
        <text x="160" y="130" text-anchor="middle" fill="#fffb96" font-size="14" font-family="monospace">CALM</text>
        <text x="160" y="170" text-anchor="middle" fill="#a890c0" font-size="9" font-family="monospace">YOUR PACE</text>
      `,
    };
    const body = scenes[sceneId] || scenes.alleyNight;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges">${body}</svg>`;
  }

  function sfxPanel() {
    beep(440, 0.05, "triangle", 0.03);
  }

  function cleanupSideVideo() {
    if (sideRuntime && sideRuntime.timer) {
      clearTimeout(sideRuntime.timer);
    }
    sideRuntime = null;
  }

  function startSideQuest(id) {
    const def = SIDE_QUESTS[id];
    if (!def) return;
    cleanupSideVideo();
    cleanupChallenge();
    sideRuntime = {
      id,
      def,
      panelIndex: 0,
      timer: null,
      fromVideo: true,
    };
    showView("side");
    el.sideTitle.textContent = def.name;
    showSidePanel(0);
  }

  function showSidePanel(index) {
    if (!sideRuntime) return;
    const def = sideRuntime.def;
    const panels = def.panels;
    if (index >= panels.length) {
      beginSideChallenge();
      return;
    }
    sideRuntime.panelIndex = index;
    const panel = panels[index];
    el.sideProgress.textContent = `PANEL ${index + 1}/${panels.length}`;
    el.panelScene.innerHTML = panelSceneSVG(panel.scene);
    el.panelCaption.textContent = panel.caption;
    const reduce = prefersReducedMotion();
    el.panelScene.classList.toggle("ken-burns", !reduce);
    sfxPanel();
    if (sideRuntime.timer) clearTimeout(sideRuntime.timer);
    const dur = reduce ? Math.max(panel.duration, 7000) : panel.duration;
    sideRuntime.timer = setTimeout(() => {
      showSidePanel(index + 1);
    }, dur);
    el.btnSideContinue.textContent =
      index + 1 >= panels.length ? "BEGIN CHALLENGE ▶" : "CONTINUE ▶";
    el.sideHint.textContent = reduce
      ? "Reduced motion on — tap CONTINUE when ready. Auto-advance is slower."
      : "Tap CONTINUE or wait — story auto-advances. Mute respected.";
  }

  function beginSideChallenge() {
    if (!sideRuntime) return;
    if (sideRuntime.timer) {
      clearTimeout(sideRuntime.timer);
      sideRuntime.timer = null;
    }
    const def = sideRuntime.def;
    const task = {
      id: def.id + "-chal",
      skill: def.skill,
      challenge: def.challenge,
      title: def.challengeTitle || def.name,
      introNpc: "SIDE QUEST",
      intro: def.blurb,
      doneNpc: "SIDE QUEST",
      done: def.completeBeat,
      _sideQuestId: def.id,
    };
    // Use a lightweight activeQuest wrapper so finishChallenge -> showTaskDone works,
    // but intercept finish for side quests.
    activeQuest = {
      id: def.id,
      def: {
        id: def.id,
        name: def.name,
        tasks: [task],
        xpBonus: def.xpBonus,
        goldBonus: def.goldBonus,
        completeBeat: def.completeBeat,
      },
      taskIndex: 0,
      isDaily: false,
      isSide: true,
    };
    sideRuntime.fromVideo = false;
    startChallenge(task);
  }

  function finishSideQuestRewards() {
    const def = sideRuntime ? sideRuntime.def : activeQuest && SIDE_QUESTS[activeQuest.id];
    if (!def) {
      goHub();
      return;
    }
    const xp = def.xpBonus || 28;
    const gold = def.goldBonus || 14;
    const { leveled, newLevel } = award(xp, gold);
    sfxComplete();
    if (!state.completedSideQuestIds.includes(def.id)) {
      state.completedSideQuestIds.push(def.id);
    }
    state.activeQuestIds = state.activeQuestIds.filter((x) => x !== def.id);
    delete state.questProgress[def.id];
    saveState();
    el.resultsTitle.textContent = "SIDE QUEST CLEAR";
    el.resultsMessage.textContent = def.completeBeat;
    el.resultsRewards.innerHTML = `
      <div>SIDE BONUS +${xp} XP</div>
      <div>SIDE BONUS +${gold} GOLD</div>
    `;
    if (leveled) {
      el.levelupFlash.classList.remove("hidden");
      el.levelupFlash.removeAttribute("hidden");
      el.levelupDetail.textContent = `You reached LEVEL ${newLevel}`;
      sfxLevelUp();
    } else {
      el.levelupFlash.classList.add("hidden");
      el.levelupFlash.setAttribute("hidden", "");
    }
    cleanupSideVideo();
    activeQuest = null;
    showView("results");
  }

  // ---- Challenges ----
  function setFeedback(msg, ok) {
    el.chalFeedback.textContent = msg;
    el.chalFeedback.style.color = ok === false ? "var(--danger)" : "var(--lime)";
  }

  function clearChal() {
    el.chalStage.innerHTML = "";
    el.chalControls.innerHTML = "";
    el.chalActions.innerHTML = "";
    el.chalFeedback.textContent = "";
  }

  function updateChalMeta() {
    if (!chalRuntime) return;
    el.chalRound.textContent = `ROUND ${chalRuntime.round}`;
    el.chalScore.textContent = `SCORE ${chalRuntime.score}`;
  }

  function cleanupChallenge() {
    if (chalRuntime && chalRuntime._cleanup) {
      try {
        chalRuntime._cleanup();
      } catch (_) {}
    }
    chalRuntime = null;
  }

  function startChallenge(task) {
    cleanupChallenge();
    showView("challenge");
    chalRuntime = { score: 0, round: 1, task };
    el.chalTitle.textContent = task.title;
    el.chalSkill.textContent = SKILL_LABELS[task.skill];
    el.chalInstructions.textContent = "";
    clearChal();
    updateChalMeta();
    const runners = {
      match: runPixelMatch,
      sequence: runSequenceCipher,
      targets: runTargetPractice,
      cargo: runCargoSort,
      pattern: runPatternProtocol,
      logic: runLogicLocker,
      broadcast: runBroadcastBooth,
      twister: runTongueTwister,
    };
    (runners[task.challenge] || runPixelMatch)();
  }

  function finishChallenge(opts = {}) {
    const task = chalRuntime?.task;
    // Task rewards
    const xp = 20 + Math.min(15, Math.floor(opts.bonusXp || 0));
    const gold = 6 + Math.min(8, Math.floor(opts.bonusGold || 0));
    award(xp, gold);
    sfxHit();
    cleanupChallenge();
    if (task) showTaskDone(task);
    else goHub();
  }

  // ---- 1. Pixel Match ----
  function runPixelMatch() {
    clearChal();
    const symbols = ["◆", "●", "▲", "■", "★", "✦"];
    const pairs = symbols.slice(0, 6);
    let cards = [...pairs, ...pairs].map((s, i) => ({
      id: i,
      sym: s,
      flipped: false,
      matched: false,
    }));
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    let flipped = [];
    let lock = false;
    let matches = 0;
    chalRuntime.score = 0;
    updateChalMeta();

    el.chalInstructions.textContent =
      "Flip two cards. Match the neon symbols. Clear all pairs!";
    const startBtn = document.createElement("button");
    startBtn.className = "btn btn-arcade btn-primary";
    startBtn.textContent = "START";
    startBtn.addEventListener("click", () => {
      startBtn.remove();
      render();
    });
    el.chalControls.appendChild(startBtn);

    function render() {
      el.chalStage.innerHTML = "";
      const grid = document.createElement("div");
      grid.className = "match-grid";
      grid.setAttribute("role", "group");
      grid.setAttribute("aria-label", "Memory cards");
      cards.forEach((c, idx) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className =
          "match-card" +
          (c.flipped || c.matched ? " flipped" : "") +
          (c.matched ? " matched" : "");
        b.textContent = c.flipped || c.matched ? c.sym : "?";
        b.setAttribute(
          "aria-label",
          c.flipped || c.matched ? `Card ${c.sym}` : `Hidden card ${idx + 1}`
        );
        b.disabled = c.matched || lock;
        b.addEventListener("click", () => onFlip(idx));
        grid.appendChild(b);
      });
      el.chalStage.appendChild(grid);
    }

    function onFlip(idx) {
      const c = cards[idx];
      if (lock || c.flipped || c.matched) return;
      c.flipped = true;
      flipped.push(idx);
      sfxHit();
      render();
      if (flipped.length === 2) {
        lock = true;
        const [a, b] = flipped;
        if (cards[a].sym === cards[b].sym) {
          cards[a].matched = cards[b].matched = true;
          matches++;
          chalRuntime.score += 10;
          updateChalMeta();
          setFeedback("MATCH!", true);
          flipped = [];
          lock = false;
          render();
          if (matches >= pairs.length) {
            setTimeout(() => finishChallenge({ bonusXp: 5, message: "Grid cleared!" }), 500);
          }
        } else {
          setFeedback("No match — try again.", false);
          sfxMiss();
          setTimeout(() => {
            cards[a].flipped = cards[b].flipped = false;
            flipped = [];
            lock = false;
            render();
          }, 700);
        }
      }
    }
  }

  // ---- 2. Sequence ----
  function runSequenceCipher() {
    clearChal();
    const COLORS = ["MAG", "CYN", "LIM", "YEL"];
    let sequence = [];
    let input = [];
    let accepting = false;
    let level = 1;
    const maxLevel = 4;
    chalRuntime.score = 0;
    updateChalMeta();

    el.chalInstructions.textContent =
      "Watch the light sequence, then replay it on the pads.";

    const display = document.createElement("div");
    display.className = "seq-display";
    display.setAttribute("aria-live", "polite");
    el.chalStage.appendChild(display);

    const pad = document.createElement("div");
    pad.className = "seq-pad";
    COLORS.forEach((label, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "seq-btn";
      b.dataset.c = String(i);
      b.textContent = label;
      b.setAttribute("aria-label", `Pad ${label}`);
      b.addEventListener("click", () => onPad(i, b));
      pad.appendChild(b);
    });
    el.chalStage.appendChild(pad);

    const startBtn = document.createElement("button");
    startBtn.className = "btn btn-arcade btn-primary";
    startBtn.textContent = "START CIPHER";
    startBtn.addEventListener("click", () => {
      startBtn.disabled = true;
      nextRound();
    });
    el.chalControls.appendChild(startBtn);

    function showSeqCells(arr, litIndex) {
      display.innerHTML = "";
      arr.forEach((v, i) => {
        const cell = document.createElement("div");
        cell.className = "seq-cell" + (i === litIndex ? ` on-${v}` : "");
        display.appendChild(cell);
      });
    }

    function playSequence() {
      accepting = false;
      setFeedback("WATCH…", true);
      let i = 0;
      showSeqCells(sequence, -1);
      const step = () => {
        if (i >= sequence.length) {
          showSeqCells(sequence, -1);
          accepting = true;
          input = [];
          setFeedback("YOUR TURN — replay the code!", true);
          return;
        }
        showSeqCells(sequence, i);
        const btn = pad.querySelector(`[data-c="${sequence[i]}"]`);
        if (btn) {
          btn.classList.add("lit");
          setTimeout(() => btn.classList.remove("lit"), 350);
        }
        beep(400 + sequence[i] * 120, 0.12);
        i++;
        setTimeout(step, 550);
      };
      setTimeout(step, 400);
    }

    function nextRound() {
      chalRuntime.round = level;
      updateChalMeta();
      sequence.push(Math.floor(Math.random() * 4));
      playSequence();
    }

    function onPad(i, btn) {
      if (!accepting) return;
      input.push(i);
      btn.classList.add("lit");
      setTimeout(() => btn.classList.remove("lit"), 150);
      beep(400 + i * 120, 0.08);
      const idx = input.length - 1;
      if (input[idx] !== sequence[idx]) {
        accepting = false;
        setFeedback("Wrong pad — partial clear still counts.", false);
        sfxMiss();
        setTimeout(() => {
          finishChallenge({ bonusXp: Math.max(0, (level - 1) * 3) });
        }, 800);
        return;
      }
      if (input.length === sequence.length) {
        accepting = false;
        chalRuntime.score += 15;
        updateChalMeta();
        setFeedback("CODE ACCEPTED!", true);
        if (level >= maxLevel) {
          setTimeout(() => finishChallenge({ bonusXp: 10, bonusGold: 3 }), 600);
        } else {
          level++;
          setTimeout(nextRound, 700);
        }
      }
    }
  }

  // ---- 3. Targets ----
  function runTargetPractice() {
    clearChal();
    const TOTAL = 8;
    let hits = 0;
    let shown = 0;
    let timer = null;
    chalRuntime.score = 0;
    updateChalMeta();

    el.chalInstructions.textContent =
      "Tap or click each neon target. Large hit areas — take your time.";

    const arena = document.createElement("div");
    arena.className = "target-arena";
    arena.setAttribute("aria-label", "Target arena");
    el.chalStage.appendChild(arena);

    const startBtn = document.createElement("button");
    startBtn.className = "btn btn-arcade btn-primary";
    startBtn.textContent = "START";
    startBtn.addEventListener("click", () => {
      startBtn.disabled = true;
      spawn();
    });
    el.chalControls.appendChild(startBtn);

    function spawn() {
      arena.innerHTML = "";
      if (shown >= TOTAL) {
        finishChallenge({ bonusXp: hits });
        return;
      }
      shown++;
      chalRuntime.round = shown;
      updateChalMeta();
      const t = document.createElement("button");
      t.type = "button";
      t.className = "target";
      t.setAttribute("aria-label", `Target ${shown} of ${TOTAL}`);
      t.style.left = 15 + Math.random() * 70 + "%";
      t.style.top = 20 + Math.random() * 60 + "%";
      let hit = false;
      const onHit = () => {
        if (hit) return;
        hit = true;
        hits++;
        chalRuntime.score += 10;
        updateChalMeta();
        sfxHit();
        setFeedback("HIT!", true);
        clearTimeout(timer);
        t.remove();
        setTimeout(spawn, 350);
      };
      t.addEventListener("click", onHit);
      t.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        onHit();
      });
      arena.appendChild(t);
      t.focus();
      timer = setTimeout(() => {
        if (!hit) {
          setFeedback("Missed — next target incoming.", false);
          sfxMiss();
          t.remove();
          spawn();
        }
      }, 2400);
    }

    chalRuntime._cleanup = () => clearTimeout(timer);
  }

  // ---- 4. Cargo ----
  function runCargoSort() {
    clearChal();
    const TYPES = [
      { id: "fuel", label: "FUEL" },
      { id: "ore", label: "ORE" },
      { id: "parts", label: "PARTS" },
    ];
    const chips = [];
    TYPES.forEach((t) => {
      for (let i = 0; i < 2; i++) {
        chips.push({ id: `${t.id}-${i}`, type: t.id, label: t.label });
      }
    });
    for (let i = chips.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chips[i], chips[j]] = [chips[j], chips[i]];
    }
    const placed = { fuel: [], ore: [], parts: [] };
    let selectedId = null;
    chalRuntime.score = 0;
    updateChalMeta();

    el.chalInstructions.textContent =
      "Drag chips into matching bays — or select a chip, then Place. Keyboard friendly.";

    const area = document.createElement("div");
    area.className = "cargo-area";
    el.chalStage.appendChild(area);

    const tray = document.createElement("div");
    tray.className = "chip-tray";
    tray.setAttribute("aria-label", "Unsorted cargo");
    area.appendChild(tray);

    const slots = document.createElement("div");
    slots.className = "slot-row";
    area.appendChild(slots);

    const slotEls = {};
    TYPES.forEach((t) => {
      const slot = document.createElement("div");
      slot.className = "slot";
      slot.dataset.type = t.id;
      slot.innerHTML = `<span class="slot-label">${t.label} BAY</span><div class="slot-chips"></div>`;
      const place = document.createElement("button");
      place.type = "button";
      place.className = "place-btn";
      place.textContent = `PLACE IN ${t.label}`;
      place.addEventListener("click", () => placeSelected(t.id));
      slot.appendChild(place);
      slot.addEventListener("dragover", (e) => {
        e.preventDefault();
        slot.classList.add("over");
      });
      slot.addEventListener("dragleave", () => slot.classList.remove("over"));
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        slot.classList.remove("over");
        tryPlace(e.dataTransfer.getData("text/plain"), t.id);
      });
      slots.appendChild(slot);
      slotEls[t.id] = slot.querySelector(".slot-chips");
    });

    function remaining() {
      return chips.filter((c) => !Object.values(placed).flat().includes(c.id));
    }

    function renderTray() {
      tray.innerHTML = "";
      remaining().forEach((c) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip" + (selectedId === c.id ? " selected" : "");
        chip.draggable = true;
        chip.textContent = c.label;
        chip.setAttribute("aria-pressed", selectedId === c.id ? "true" : "false");
        chip.addEventListener("click", () => {
          selectedId = selectedId === c.id ? null : c.id;
          renderTray();
        });
        chip.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", c.id);
          selectedId = c.id;
        });
        tray.appendChild(chip);
      });
    }

    function renderSlots() {
      TYPES.forEach((t) => {
        slotEls[t.id].innerHTML = "";
        placed[t.id].forEach((id) => {
          const c = chips.find((x) => x.id === id);
          const span = document.createElement("span");
          span.className = "chip";
          span.textContent = c.label;
          span.style.minWidth = "56px";
          span.style.minHeight = "40px";
          span.style.fontSize = "0.4rem";
          slotEls[t.id].appendChild(span);
        });
      });
    }

    function tryPlace(id, type) {
      const c = chips.find((x) => x.id === id);
      if (!c || !remaining().some((r) => r.id === id)) return;
      if (c.type !== type) {
        setFeedback("Wrong bay!", false);
        sfxMiss();
        return;
      }
      placed[type].push(id);
      selectedId = null;
      chalRuntime.score += 8;
      updateChalMeta();
      sfxHit();
      setFeedback("Cargo secured!", true);
      renderTray();
      renderSlots();
      if (remaining().length === 0) {
        setTimeout(() => finishChallenge({ bonusXp: 5 }), 400);
      }
    }

    function placeSelected(type) {
      if (!selectedId) {
        setFeedback("Select a chip first, then Place.", false);
        return;
      }
      tryPlace(selectedId, type);
    }

    renderTray();
    renderSlots();
    const hint = document.createElement("p");
    hint.className = "board-hint";
    hint.textContent = "Tip: click a chip to select, then use PLACE buttons.";
    el.chalActions.appendChild(hint);
  }

  // ---- 5. Pattern ----
  function runPatternProtocol() {
    clearChal();
    const puzzles = [
      { seq: [2, 4, 6, 8], answer: 10, choices: [9, 10, 12, 7] },
      { seq: [1, 1, 2, 3, 5], answer: 8, choices: [6, 7, 8, 9] },
      { seq: ["A", "C", "E", "G"], answer: "I", choices: ["H", "I", "J", "F"] },
      { seq: [3, 6, 9, 12], answer: 15, choices: [14, 15, 16, 18] },
      {
        seq: ["▲", "▲●", "▲●■", "▲●■◆"],
        answer: "▲●■◆★",
        choices: ["▲●■◆★", "▲●■", "◆★", "■■"],
      },
    ];
    const shuffled = [...puzzles].sort(() => Math.random() - 0.5).slice(0, 3);
    let idx = 0;
    let correct = 0;
    chalRuntime.score = 0;
    updateChalMeta();

    el.chalInstructions.textContent = "Study the pattern. Choose what comes next.";

    function showPuzzle() {
      el.chalStage.innerHTML = "";
      el.chalActions.innerHTML = "";
      const p = shuffled[idx];
      chalRuntime.round = idx + 1;
      updateChalMeta();

      const row = document.createElement("div");
      row.className = "pattern-row";
      p.seq.forEach((v) => {
        const cell = document.createElement("div");
        cell.className = "pattern-cell";
        cell.textContent = String(v);
        row.appendChild(cell);
      });
      const q = document.createElement("div");
      q.className = "pattern-cell q";
      q.textContent = "?";
      row.appendChild(q);
      el.chalStage.appendChild(row);

      const grid = document.createElement("div");
      grid.className = "choice-grid";
      [...p.choices]
        .sort(() => Math.random() - 0.5)
        .forEach((ch) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "choice-btn";
          b.textContent = String(ch);
          b.addEventListener("click", () => {
            if (ch === p.answer) {
              correct++;
              chalRuntime.score += 12;
              updateChalMeta();
              setFeedback("PROTOCOL MATCH!", true);
              sfxHit();
            } else {
              setFeedback(`Nope — answer was ${p.answer}.`, false);
              sfxMiss();
            }
            idx++;
            setTimeout(() => {
              if (idx >= shuffled.length) {
                finishChallenge({ bonusXp: correct * 3 });
              } else {
                setFeedback("", true);
                showPuzzle();
              }
            }, 650);
          });
          grid.appendChild(b);
        });
      el.chalStage.appendChild(grid);
    }

    const startBtn = document.createElement("button");
    startBtn.className = "btn btn-arcade btn-primary";
    startBtn.textContent = "START";
    startBtn.addEventListener("click", () => {
      startBtn.remove();
      showPuzzle();
    });
    el.chalControls.appendChild(startBtn);
  }

  // ---- 6. Logic ----
  function runLogicLocker() {
    clearChal();
    const sets = [
      {
        prompt: "Sort codes LOW → HIGH (numbers).",
        items: [
          { id: "a", label: "42", key: 42 },
          { id: "b", label: "7", key: 7 },
          { id: "c", label: "19", key: 19 },
          { id: "d", label: "3", key: 3 },
        ],
      },
      {
        prompt: "Sort callsigns A → Z.",
        items: [
          { id: "a", label: "ZEBRA", key: "ZEBRA" },
          { id: "b", label: "ALPHA", key: "ALPHA" },
          { id: "c", label: "NOVA", key: "NOVA" },
          { id: "d", label: "COMET", key: "COMET" },
        ],
      },
      {
        prompt: "Sort by length SHORT → LONG.",
        items: [
          { id: "a", label: "GO", key: 2 },
          { id: "b", label: "READY", key: 5 },
          { id: "c", label: "OK", key: 2 },
          { id: "d", label: "LAUNCH", key: 6 },
        ],
        compare: (a, b) => a.key - b.key || String(a.label).localeCompare(b.label),
      },
    ];
    const puzzle = sets[Math.floor(Math.random() * sets.length)];
    let order = [...puzzle.items].sort(() => Math.random() - 0.5);
    chalRuntime.score = 0;
    updateChalMeta();

    el.chalInstructions.textContent = puzzle.prompt + " Use ▲ ▼ then CHECK LOCK.";

    const list = document.createElement("ul");
    list.className = "locker-list";
    el.chalStage.appendChild(list);

    function render() {
      list.innerHTML = "";
      order.forEach((item, i) => {
        const li = document.createElement("li");
        li.className = "locker-item";
        li.innerHTML = `<span class="item-label">${item.label}</span>`;
        const moves = document.createElement("div");
        moves.className = "move-btns";
        const up = document.createElement("button");
        up.type = "button";
        up.textContent = "▲";
        up.setAttribute("aria-label", `Move ${item.label} up`);
        up.disabled = i === 0;
        up.addEventListener("click", () => {
          if (i === 0) return;
          [order[i - 1], order[i]] = [order[i], order[i - 1]];
          render();
        });
        const down = document.createElement("button");
        down.type = "button";
        down.textContent = "▼";
        down.setAttribute("aria-label", `Move ${item.label} down`);
        down.disabled = i === order.length - 1;
        down.addEventListener("click", () => {
          if (i >= order.length - 1) return;
          [order[i + 1], order[i]] = [order[i], order[i + 1]];
          render();
        });
        moves.appendChild(up);
        moves.appendChild(down);
        li.appendChild(moves);
        list.appendChild(li);
      });
    }

    function isCorrect() {
      const sorted = [...puzzle.items].sort((a, b) => {
        if (puzzle.compare) return puzzle.compare(a, b);
        if (typeof a.key === "number") return a.key - b.key;
        return String(a.key).localeCompare(String(b.key));
      });
      return order.every((o, i) => o.id === sorted[i].id);
    }

    const check = document.createElement("button");
    check.className = "btn btn-arcade btn-primary";
    check.textContent = "CHECK LOCK";
    check.addEventListener("click", () => {
      if (isCorrect()) {
        chalRuntime.score = 40;
        updateChalMeta();
        setFeedback("LOCK OPEN!", true);
        sfxHit();
        setTimeout(() => finishChallenge({ bonusXp: 8, bonusGold: 2 }), 500);
      } else {
        setFeedback("Still locked. Adjust the order.", false);
        sfxMiss();
      }
    });
    el.chalActions.appendChild(check);
    render();
  }

  // ---- 7. Broadcast ----
  function runBroadcastBooth() {
    clearChal();
    const lists = [
      ["steady", "bright", "calm", "strong", "clear"],
      ["signal", "relay", "beacon", "pulse", "wave"],
      ["focus", "breathe", "speak", "pause", "again"],
    ];
    const words = lists[Math.floor(Math.random() * lists.length)];
    let idx = 0;
    chalRuntime.score = 0;
    updateChalMeta();

    el.chalInstructions.textContent =
      "Read each word aloud at your pace. Tap NEXT when ready. Model audio optional.";

    const progress = document.createElement("div");
    progress.className = "speech-progress";
    el.chalStage.appendChild(progress);

    const wordEl = document.createElement("div");
    wordEl.className = "speech-word";
    wordEl.setAttribute("aria-live", "polite");
    el.chalStage.appendChild(wordEl);

    function speak(text) {
      if (!window.speechSynthesis) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
      } catch (_) {}
    }

    function showWord() {
      progress.textContent = `WORD ${idx + 1} / ${words.length}`;
      wordEl.textContent = words[idx].toUpperCase();
      chalRuntime.round = idx + 1;
      updateChalMeta();
    }

    const playModel = document.createElement("button");
    playModel.className = "btn btn-arcade btn-secondary";
    playModel.textContent = "▶ MODEL AUDIO";
    playModel.addEventListener("click", () => speak(words[idx]));

    const next = document.createElement("button");
    next.className = "btn btn-arcade btn-primary";
    next.textContent = "NEXT WORD";
    next.addEventListener("click", () => {
      chalRuntime.score += 8;
      updateChalMeta();
      sfxHit();
      idx++;
      if (idx >= words.length) finishChallenge({ bonusXp: 5 });
      else showWord();
    });

    el.chalControls.appendChild(playModel);
    el.chalControls.appendChild(next);
    showWord();
  }

  // ---- 8. Twister ----
  function runTongueTwister() {
    clearChal();
    const phrases = [
      "Red leather, yellow leather.",
      "Unique New York.",
      "She sells sea shells.",
      "Bright white light tonight.",
      "Eleven benevolent elephants.",
    ];
    const round = [...phrases].sort(() => Math.random() - 0.5).slice(0, 3);
    let idx = 0;
    let recognition = null;
    chalRuntime.score = 0;
    updateChalMeta();

    el.chalInstructions.textContent =
      "Say each phrase clearly. Model audio optional. Mic never required — tap DONE when finished.";

    const phraseEl = document.createElement("div");
    phraseEl.className = "speech-phrase";
    phraseEl.setAttribute("aria-live", "polite");
    el.chalStage.appendChild(phraseEl);

    const micStatus = document.createElement("div");
    micStatus.className = "mic-status";
    el.chalStage.appendChild(micStatus);

    const progress = document.createElement("div");
    progress.className = "speech-progress";
    el.chalStage.appendChild(progress);

    function speak(text) {
      if (!window.speechSynthesis) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.8;
        window.speechSynthesis.speak(u);
      } catch (_) {}
    }

    function show() {
      phraseEl.textContent = round[idx];
      progress.textContent = `PHRASE ${idx + 1} / ${round.length}`;
      chalRuntime.round = idx + 1;
      updateChalMeta();
      micStatus.textContent = "";
    }

    const modelBtn = document.createElement("button");
    modelBtn.className = "btn btn-arcade btn-secondary";
    modelBtn.textContent = "▶ MODEL AUDIO";
    modelBtn.addEventListener("click", () => speak(round[idx]));

    const micBtn = document.createElement("button");
    micBtn.className = "btn btn-arcade btn-ghost";
    micBtn.textContent = "MIC (OPTIONAL)";
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      micBtn.disabled = true;
      micBtn.title = "Speech recognition not available";
    }
    micBtn.addEventListener("click", () => {
      if (!SR) return;
      try {
        if (recognition) {
          recognition.stop();
          recognition = null;
        }
        recognition = new SR();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        micStatus.textContent = "Listening… say the phrase.";
        recognition.onresult = (ev) => {
          micStatus.textContent = `Heard: “${ev.results[0][0].transcript}” — great effort!`;
          sfxHit();
        };
        recognition.onerror = () => {
          micStatus.textContent = "Mic unavailable — just tap DONE.";
        };
        recognition.onend = () => {
          recognition = null;
        };
        recognition.start();
      } catch (_) {
        micStatus.textContent = "Mic blocked — continue without it.";
      }
    });

    const doneBtn = document.createElement("button");
    doneBtn.className = "btn btn-arcade btn-primary";
    doneBtn.textContent = "DONE — NEXT";
    doneBtn.addEventListener("click", () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (_) {}
        recognition = null;
      }
      chalRuntime.score += 10;
      updateChalMeta();
      sfxHit();
      idx++;
      if (idx >= round.length) finishChallenge({ bonusXp: 5 });
      else show();
    });

    el.chalControls.appendChild(modelBtn);
    el.chalControls.appendChild(micBtn);
    el.chalControls.appendChild(doneBtn);

    chalRuntime._cleanup = () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (_) {}
      }
      if (window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch (_) {}
      }
    };

    show();
  }

  // ---- Events ----
  function bindGlobal() {
    el.btnCreate.addEventListener("click", () => {
      const name = (el.createName.value || "").trim().slice(0, 16) || "Operative";
      const roleInput = document.querySelector('input[name="role"]:checked');
      const role = (roleInput && roleInput.value) || "medic";
      state.created = true;
      state.name = name;
      state.role = role;
      state.avatar = { ...defaultAvatar(), ...draftAvatar };
      state.location = "plaza";
      currentLocation = "plaza";
      saveState();
      sfxComplete();
      refreshStatus();
      showView("hub");
      renderHub();
    });

    // Live avatar: role cards can gently suggest outfit tint (optional, non-destructive)
    $$('input[name="role"]').forEach((inp) => {
      inp.addEventListener("change", () => {
        const map = { medic: "lime", scout: "cyan", engineer: "yellow" };
        if (map[inp.value]) {
          draftAvatar.outfit = map[inp.value];
          buildAvatarControls();
          paintAvatar(el.avatarPreview, draftAvatar);
        }
      });
    });

    el.createName.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        el.btnCreate.click();
      }
    });

    $("#btn-logo").addEventListener("click", () => {
      if (state.created) goHub();
    });

    el.muteBtn.addEventListener("click", () => {
      muted = !muted;
      state.muted = muted;
      saveState();
      refreshStatus();
      if (!muted) beep(660, 0.06);
    });

    $$(".quest-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        questTab = tab.getAttribute("data-tab");
        $$(".quest-tab").forEach((t) => {
          const on = t === tab;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        renderQuestLog();
      });
    });

    el.btnDaily.addEventListener("click", () => {
      const d = getDailyDef();
      if (state.dailyCompleted) return;
      if (state.activeQuestIds.includes(d.id)) startOrResumeQuest(d.id);
      else {
        // Accept daily as active (not in QUESTS map)
        if (!state.activeQuestIds.includes(d.id)) {
          state.activeQuestIds.push(d.id);
          state.questProgress[d.id] = { taskIndex: 0 };
          saveState();
        }
        startOrResumeQuest(d.id);
      }
    });

    if (el.btnSideContinue) {
      el.btnSideContinue.addEventListener("click", () => {
        if (!sideRuntime) return;
        const next = sideRuntime.panelIndex + 1;
        if (sideRuntime.timer) clearTimeout(sideRuntime.timer);
        showSidePanel(next);
      });
    }
    if (el.btnSideSkip) {
      el.btnSideSkip.addEventListener("click", () => {
        if (!sideRuntime) return;
        if (sideRuntime.timer) clearTimeout(sideRuntime.timer);
        beginSideChallenge();
      });
    }
    if (el.btnSideMenu) {
      el.btnSideMenu.addEventListener("click", () => {
        questTab = "side";
        $$(".quest-tab").forEach((t) => {
          const on = t.getAttribute("data-tab") === "side";
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        renderQuestLog();
        beep(520, 0.05);
      });
    }

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      if (action === "back-hub") {
        if (activeQuest && !activeQuest.isSide) {
          state.questProgress[activeQuest.id] = { taskIndex: activeQuest.taskIndex };
          saveState();
        }
        goHub();
      }
      if (action === "abort-challenge") {
        cleanupChallenge();
        if (activeQuest && activeQuest.isSide) {
          // Return to last side panel rather than main task intro
          startSideQuest(activeQuest.id);
        } else if (activeQuest) showTaskIntro();
        else goHub();
      }
    });

    document.addEventListener(
      "pointerdown",
      () => {
        ensureAudio();
      },
      { once: true }
    );
  }

  // Boot
  draftAvatar = { ...defaultAvatar(), ...(state.avatar || {}) };
  bindGlobal();
  buildAvatarControls();
  paintAvatar(el.avatarPreview, draftAvatar);
  muted = !!state.muted;
  currentLocation = state.location || "plaza";
  if (state.created) {
    refreshStatus();
    showView("hub");
    renderHub();
  } else {
    showView("create");
  }
})();
