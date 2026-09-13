/**
 * Steady Skills RPG — role-based 80s adventure
 * Quests & story tasks ARE the Steady Skills practice.
 * Zero build; localStorage; mic never required.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "steady-skills-rpg-v2";
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

  // ---- State ----
  let state = loadState();
  let muted = !!state.muted;
  let audioCtx = null;
  let currentLocation = state.location || "plaza";
  let questTab = "available";
  let activeQuest = null; // runtime: { def, taskIndex, phase: 'intro'|'challenge'|'done' }
  let chalRuntime = null;

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
      level: 1,
      xp: 0,
      gold: 0,
      streak: 0,
      lastPlayDate: null,
      muted: false,
      location: "plaza",
      activeQuestIds: [],
      completedQuestIds: [],
      questProgress: {}, // questId -> { taskIndex }
      dailyDate: todayKey(),
      dailyCompleted: false,
      dailyId: null,
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = { ...defaultState(), ...JSON.parse(raw) };
      refreshDailyFields(parsed);
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
  }

  // ---- Views ----
  function showView(name) {
    const map = {
      create: el.create,
      hub: el.hub,
      scene: el.scene,
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
          ? "Travel to the Tower, Docks, or Clinic — or check Daily Dispatch."
          : "No new jobs here. Try another location or the quest log.";
      el.dialogueActions.appendChild(hint);
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
    return QUESTS[id] || DAILY_TEMPLATES.find((d) => d.id === id) || null;
  }

  function renderQuestLog() {
    el.questLogList.innerHTML = "";
    let items = [];
    if (questTab === "active") {
      items = state.activeQuestIds.map(resolveQuest).filter(Boolean);
    } else if (questTab === "completed") {
      items = state.completedQuestIds.map(resolveQuest).filter(Boolean);
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
          ? "No completed story quests yet."
          : "All story quests accepted or done. Check Daily!";
      el.questLogList.appendChild(empty);
      return;
    }

    items.forEach((q) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quest-log-item" + (questTab === "completed" ? " done" : "");
      const skills = [...new Set(q.tasks.map((t) => SKILL_LABELS[t.skill]))].join(" · ");
      const prog = state.questProgress[q.id];
      const meta =
        questTab === "active" && prog
          ? `Task ${(prog.taskIndex || 0) + 1}/${q.tasks.length} · ${skills}`
          : questTab === "completed"
          ? "CLEARED · " + skills
          : `${q.tasks.length} tasks · ${skills}`;
      btn.innerHTML = `<span class="ql-title">${q.name}</span><span class="ql-meta">${meta}</span>`;
      btn.addEventListener("click", () => {
        if (questTab === "completed") {
          el.npcName.textContent = q.giver;
          el.npcLine.textContent = q.completeBeat;
          el.dialogueActions.innerHTML = "";
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
      state.location = "plaza";
      currentLocation = "plaza";
      saveState();
      sfxComplete();
      showView("hub");
      renderHub();
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

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      if (action === "back-hub") {
        if (activeQuest) {
          state.questProgress[activeQuest.id] = { taskIndex: activeQuest.taskIndex };
          saveState();
        }
        goHub();
      }
      if (action === "abort-challenge") {
        // Return to task intro without losing progress
        cleanupChallenge();
        if (activeQuest) showTaskIntro();
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
  bindGlobal();
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
