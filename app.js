/* =========================================================
   LoopLogic - Main Application Logic Engine
   Color Palette: Space Cadet (#25344F), Tan (#D5B893), Slate Gray, Tsunami
   Minimalist SVG Icons & Clean Educational Interactions
   6 Simulations (2 Guided Examples + 4 Logic Challenges)
   Ambient Chill BGM & Settings Engine
   ========================================================= */

// ==========================================
// 1. STATE & STORAGE MANAGEMENT
// ==========================================
const DEFAULT_STATE = {
  user: {
    isLoggedIn: true,
    name: "Siswa LoopLogic",
    email: "siswa@sma.belajar.id",
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=LoopLogicStudent&backgroundColor=25344f",
    school: "Kelas X SMA/SMK",
  },
  settings: {
    sfxEnabled: true,
    sfxVolume: 0.8,
    bgmEnabled: false,
    bgmVolume: 0.35,
    language: "id",
  },
  unlockedMaterials: {
    materi1: true,
    materi2: true,
    materi3: true,
    materi4: false, // DO-WHILE (Locked)
    materi5: false, // NESTED LOOP (Locked)
  },
  completedSims: {
    sim1: false,
    sim2: false,
    sim3: false,
    sim4: false,
    sim5: false,
    sim6: false,
  },
  challengeGuesses: {
    sim3: null,
    sim4: null,
    sim5: null,
    sim6: null,
  },
  quizHistory: [],
};

let appState =
  JSON.parse(localStorage.getItem("looplogic_v3_state")) || DEFAULT_STATE;

// Ensure new state fields exist
if (!appState.settings) appState.settings = DEFAULT_STATE.settings;
if (!appState.challengeGuesses)
  appState.challengeGuesses = DEFAULT_STATE.challengeGuesses;
if (!appState.completedSims.sim5) appState.completedSims.sim5 = false;
if (!appState.completedSims.sim6) appState.completedSims.sim6 = false;

function saveState() {
  localStorage.setItem("looplogic_v3_state", JSON.stringify(appState));
  updateUI();
}

// ==========================================
// 2. AUDIO SYNTHESIZER & PROCEDURAL CHILL BGM
// ==========================================
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.isBgmPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!appState.settings.sfxEnabled) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        300,
        this.ctx.currentTime + 0.04,
      );
      gain.gain.setValueAtTime(
        0.08 * appState.settings.sfxVolume,
        this.ctx.currentTime,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.04,
      );
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playCorrect() {
    if (!appState.settings.sfxEnabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(
          0.09 * appState.settings.sfxVolume,
          now + idx * 0.08,
        );
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch (e) {}
  }

  playWrong() {
    if (!appState.settings.sfxEnabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(160, now + 0.1);
      gain.gain.setValueAtTime(0.1 * appState.settings.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  playFanfare() {
    if (!appState.settings.sfxEnabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(
          0.1 * appState.settings.sfxVolume,
          now + idx * 0.1,
        );
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    } catch (e) {}
  }

  playDrop() {
    if (!appState.settings.sfxEnabled) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(360, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        120,
        this.ctx.currentTime + 0.15,
      );
      gain.gain.setValueAtTime(
        0.12 * appState.settings.sfxVolume,
        this.ctx.currentTime,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.15,
      );
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playScan() {
    if (!appState.settings.sfxEnabled) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1760, this.ctx.currentTime); // High pitch supermarket beep
      gain.gain.setValueAtTime(
        0.1 * appState.settings.sfxVolume,
        this.ctx.currentTime,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.08,
      );
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Soft Ambient Chill Lofi Chords Looper
  startBgm() {
    this.init();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    // Chords (Hz): Fmaj9 -> G6 -> Em7 -> Am7
    const chordProgression = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 329.63], // G6
      [164.81, 196.0, 246.94, 293.66], // Em7
      [220.0, 261.63, 329.63, 392.0], // Am7
    ];

    const playChord = () => {
      if (!this.isBgmPlaying || !appState.settings.bgmEnabled) return;
      try {
        const chord = chordProgression[this.bgmStep % chordProgression.length];
        this.bgmStep++;

        const now = this.ctx.currentTime;
        const masterGain = this.ctx.createGain();
        masterGain.gain.value = 0.035 * appState.settings.bgmVolume;

        // Filter for warm lofi sound
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 520;

        chord.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();
          osc.type = i % 2 === 0 ? "sine" : "triangle";
          osc.frequency.value = freq;

          noteGain.gain.setValueAtTime(0, now);
          noteGain.gain.linearRampToValueAtTime(0.2, now + 0.8);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);

          osc.connect(noteGain);
          noteGain.connect(filter);
          osc.start(now);
          osc.stop(now + 3.5);
        });

        filter.connect(masterGain);
        masterGain.connect(this.ctx.destination);
      } catch (e) {}
    };

    playChord();
    this.bgmTimer = setInterval(playChord, 3600);
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleBgm() {
    if (appState.settings.bgmEnabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
  }
}

const audio = new SoundSynth();

// ==========================================
// 3. CONFETTI GENERATOR
// ==========================================
function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ["#D5B893", "#B1C7D4", "#849AAD", "#ffffff", "#6F4D38"];

  for (let i = 0; i < 60; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 4 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 4 - 2,
    });
  }

  let animationFrame;
  let duration = 85;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    duration--;
    if (duration > 0) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  render();
}

// ==========================================
// 4. ROUTER (SPA)
// ==========================================
function navigateTo(pageId) {
  audio.playClick();

  document
    .querySelectorAll(".page-view")
    .forEach((p) => p.classList.add("hidden"));

  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Update navbar active state
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    const isTarget =
      btn.dataset.target === pageId ||
      (pageId.startsWith("sim-") &&
        btn.dataset.target === "simulator-dashboard");
    if (isTarget) {
      btn.classList.add("nav-active");
      btn.classList.remove("nav-inactive");
    } else {
      btn.classList.remove("nav-active");
      btn.classList.add("nav-inactive");
    }
  });

  if (pageId === "kuis") initQuizSession();

  // Refresh Lucide icons
  if (window.lucide) {
    setTimeout(() => lucide.createIcons(), 50);
  }
}

// ==========================================
// 5. SETTINGS MODAL & AUDIO PREFERENCES
// ==========================================
function openSettingsModal() {
  audio.playClick();
  const modal = document.getElementById("settings-modal");
  if (modal) {
    // Sync inputs with state
    const sfxCheck = document.getElementById("setting-sfx-toggle");
    const bgmCheck = document.getElementById("setting-bgm-toggle");
    const sfxVol = document.getElementById("setting-sfx-vol");
    const bgmVol = document.getElementById("setting-bgm-vol");
    const nameInput = document.getElementById("setting-student-name");
    const langSelect = document.getElementById("setting-language-select");

    if (sfxCheck) sfxCheck.checked = appState.settings.sfxEnabled;
    if (bgmCheck) bgmCheck.checked = appState.settings.bgmEnabled;
    if (sfxVol) sfxVol.value = appState.settings.sfxVolume * 100;
    if (bgmVol) bgmVol.value = appState.settings.bgmVolume * 100;
    if (nameInput) nameInput.value = appState.user.name;
    if (langSelect) langSelect.value = appState.settings.language || "id";

    modal.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
  }
}

function closeSettingsModal() {
  audio.playClick();
  const modal = document.getElementById("settings-modal");
  if (modal) modal.classList.add("hidden");
}

function updateSettingsFromModal() {
  const sfxCheck = document.getElementById("setting-sfx-toggle");
  const bgmCheck = document.getElementById("setting-bgm-toggle");
  const sfxVol = document.getElementById("setting-sfx-vol");
  const bgmVol = document.getElementById("setting-bgm-vol");
  const nameInput = document.getElementById("setting-student-name");
  const langSelect = document.getElementById("setting-language-select");

  if (sfxCheck) appState.settings.sfxEnabled = sfxCheck.checked;
  if (bgmCheck) {
    const prevBgm = appState.settings.bgmEnabled;
    appState.settings.bgmEnabled = bgmCheck.checked;
    if (prevBgm !== appState.settings.bgmEnabled) {
      audio.toggleBgm();
    }
  }
  if (sfxVol) appState.settings.sfxVolume = parseInt(sfxVol.value) / 100;
  if (bgmVol) appState.settings.bgmVolume = parseInt(bgmVol.value) / 100;
  if (nameInput && nameInput.value.trim()) {
    appState.user.name = nameInput.value.trim();
  }
  if (langSelect) appState.settings.language = langSelect.value;

  saveState();
  closeSettingsModal();
}

function resetLearningProgress() {
  if (
    confirm(
      "Apakah Anda yakin ingin mengatur ulang progres modul dan simulasi?",
    )
  ) {
    appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();
    location.reload();
  }
}

function updateUI() {
  document
    .querySelectorAll(".user-name-display")
    .forEach((el) => (el.textContent = appState.user.name));

  // Update material lock icons
  if (appState.unlockedMaterials.materi4) {
    const lock4 = document.getElementById("lock-badge-4");
    if (lock4) lock4.classList.add("hidden");
  }
  if (appState.unlockedMaterials.materi5) {
    const lock5 = document.getElementById("lock-badge-5");
    if (lock5) lock5.classList.add("hidden");
  }

  // Update challenge badges
  ["sim3", "sim4", "sim5", "sim6"].forEach((simKey) => {
    const guess = appState.challengeGuesses[simKey];
    const badge = document.getElementById(`${simKey}-status-tag`);
    if (badge && guess) {
      badge.textContent = `Tebakan: ${guess.toUpperCase()} (${appState.completedSims[simKey] ? "Selesai" : "Aktif"})`;
      badge.className = "badge-clean badge-emerald text-[10px]";
    }
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// ==========================================
// 6. MATERI TABS & TEACHER APPROVAL
// ==========================================
let currentMateriTab = 1;

function switchMateriTab(tabNumber) {
  audio.playClick();

  if (tabNumber === 4 && !appState.unlockedMaterials.materi4) {
    openTeacherApprovalModal(4, "4. Perulangan DO-WHILE");
    return;
  }
  if (tabNumber === 5 && !appState.unlockedMaterials.materi5) {
    openTeacherApprovalModal(5, "5. Perulangan Bersarang (Nested Loop)");
    return;
  }

  currentMateriTab = tabNumber;

  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById(`materi-tab-btn-${i}`);
    const content = document.getElementById(`materi-content-${i}`);
    if (btn && content) {
      if (i === tabNumber) {
        btn.className =
          "materi-tab tab-active flex-1 py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm text-center transition";
        content.classList.remove("hidden");
      } else {
        btn.className =
          "materi-tab tab-inactive flex-1 py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm text-center transition";
        content.classList.add("hidden");
      }
    }
  }

  if (window.lucide) lucide.createIcons();
}

let pendingMateriUnlock = null;
function openTeacherApprovalModal(materiIndex, materiTitle) {
  pendingMateriUnlock = materiIndex;
  document.getElementById("teacher-modal-title").textContent =
    `Persetujuan Guru: ${materiTitle}`;
  document.getElementById("teacher-passcode-input").value = "";
  document.getElementById("teacher-approval-error").classList.add("hidden");
  document.getElementById("teacher-approval-modal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeTeacherApprovalModal() {
  document.getElementById("teacher-approval-modal").classList.add("hidden");
}

function submitTeacherApproval() {
  const code = document
    .getElementById("teacher-passcode-input")
    .value.trim()
    .toUpperCase();
  const validCodes = [
    "GURUHEBAT",
    "LOGIC2026",
    "GURU123",
    "IZINGURU",
    "GURUMTK",
  ];

  if (validCodes.includes(code) || code === "1234") {
    if (pendingMateriUnlock === 4) appState.unlockedMaterials.materi4 = true;
    if (pendingMateriUnlock === 5) appState.unlockedMaterials.materi5 = true;

    saveState();
    closeTeacherApprovalModal();
    audio.playFanfare();
    triggerConfetti();
    alert(`Materi Berhasil Dibuka dengan Persetujuan Guru!`);
    switchMateriTab(pendingMateriUnlock);
  } else {
    audio.playWrong();
    const err = document.getElementById("teacher-approval-error");
    err.textContent =
      "Kode Persetujuan Guru Salah! Minta kode kepada guru pengajar (Contoh: GURUHEBAT / LOGIC2026)";
    err.classList.remove("hidden");
  }
}

// ==========================================
// 7. SIMULASI 1: CONTOH FOR DECREMENT (EKSPEDISI GUNUNG)
// ==========================================
const MOUNTAIN_OBSTACLES = [
  {
    name: "Pos 1: Badai Salju",
    tag: "Suhu Dingin",
    desc: "Suhu turun drastis, stamina terkuras.",
  },
  {
    name: "Pos 2: Longsor Es",
    tag: "Rintangan Fisik",
    desc: "Batu tebing menuntut energi evakuasi.",
  },
  {
    name: "Pos 3: Jurang Terjal",
    tag: "Jalur Kritis",
    desc: "Tali meregang, konsentrasi terkuras.",
  },
  {
    name: "Pos 4: Celah Salju",
    tag: "Bahaya Medan",
    desc: "Crevasse menghadang laju langkah pendaki.",
  },
  {
    name: "Pos 5: Badai Angin",
    tag: "Puncak 4000m",
    desc: "Oksigen tipis menuntut daya tahan tubuh.",
  },
];

let sim1State = {
  initialHp: 5,
  currentHp: 5,
  minHp: 0,
  step: 1,
  iteration: 0,
  altitude: 1000,
  isFinished: false,
};

function initSim1() {
  sim1State.initialHp =
    parseInt(document.getElementById("sim1-start-hp").value) || 5;
  sim1State.minHp = parseInt(document.getElementById("sim1-min-hp").value) || 0;
  sim1State.step = parseInt(document.getElementById("sim1-step").value) || 1;
  sim1State.currentHp = sim1State.initialHp;
  sim1State.iteration = 0;
  sim1State.altitude = 1000;
  sim1State.isFinished = false;

  document.getElementById("sim1-trace-body").innerHTML = "";
  document.getElementById("sim1-console").innerHTML =
    `> [Inisialisasi FOR] Ekspedisi dimulai di Pos 1 (1000 mdpl) dengan ${sim1State.currentHp} Poin Daya Tahan.\n`;
  document.getElementById("sim1-step-btn").disabled = false;
  document
    .getElementById("sim1-step-btn")
    .classList.remove("opacity-50", "cursor-not-allowed");

  renderMountainVisual();
}

function stepSim1() {
  if (sim1State.isFinished) return;

  const { minHp, step } = sim1State;

  if (sim1State.currentHp > minHp) {
    sim1State.iteration++;
    const obstacleIndex = (sim1State.iteration - 1) % MOUNTAIN_OBSTACLES.length;
    const obstacle = MOUNTAIN_OBSTACLES[obstacleIndex];

    const prevHp = sim1State.currentHp;
    sim1State.currentHp -= step;
    if (sim1State.currentHp < minHp) sim1State.currentHp = minHp;
    sim1State.altitude += 600;

    audio.playWrong();

    const consoleLog = document.getElementById("sim1-console");
    consoleLog.innerHTML += `[Iterasi ${sim1State.iteration}] Menghadapi: ${obstacle.name}\n`;
    consoleLog.innerHTML += `➔ Daya tahan: ${prevHp} - ${step} = ${sim1State.currentHp} (${sim1State.altitude} mdpl)\n`;

    const tr = document.createElement("tr");
    tr.className = "border-b border-slate-700/50 hover:bg-tan/10 transition";
    tr.innerHTML = `
      <td class="col-iter font-mono font-bold text-tan">${sim1State.iteration}</td>
      <td class="col-var font-mono text-cloudy">${prevHp}➔<span class="font-bold text-red-400">${sim1State.currentHp}</span></td>
      <td class="col-cond font-mono text-emerald-400 font-bold">${prevHp}&gt;${minHp} (TRUE)</td>
      <td class="col-action text-cloudy"><strong class="text-tan">${obstacle.name}</strong> (-${step} HP)</td>
    `;
    document.getElementById("sim1-trace-body").appendChild(tr);

    renderMountainVisual();

    if (sim1State.currentHp <= minHp) {
      sim1State.isFinished = true;
      document.getElementById("sim1-step-btn").disabled = true;
      document
        .getElementById("sim1-step-btn")
        .classList.add("opacity-50", "cursor-not-allowed");

      consoleLog.innerHTML += `\n> [Loop Berhenti] Syarat (${sim1State.currentHp} > ${minHp}) bernilai FALSE!\n`;
      consoleLog.innerHTML += `> PERINGATAN: Batas minimum tercapai (${sim1State.currentHp} HP)! Tim dievakuasi ke Basecamp.\n`;

      const trFinal = document.createElement("tr");
      trFinal.className = "bg-caput/30 border-b border-caput/50 font-bold";
      trFinal.innerHTML = `
        <td class="col-iter font-mono text-red-300">${sim1State.iteration + 1}</td>
        <td class="col-var font-mono text-cloudy">${sim1State.currentHp}</td>
        <td class="col-cond font-mono text-red-400">${sim1State.currentHp}&gt;${minHp} (FALSE)</td>
        <td class="col-action text-red-300 font-bold">Kondisi FALSE. FOR Loop selesai dan berhenti!</td>
      `;
      document.getElementById("sim1-trace-body").appendChild(trFinal);

      appState.completedSims.sim1 = true;
      saveState();
    }
  }
}

function renderMountainVisual() {
  const container = document.getElementById("sim1-canvas");
  if (!container) return;

  const hpCount = Math.max(0, sim1State.currentHp);
  let heartsHtml = "";
  for (let i = 0; i < hpCount; i++) {
    heartsHtml += `
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-tan/20 border border-tan/60 text-tan shadow-sm" title="1 HP">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      </span>
    `;
  }
  if (hpCount === 0) {
    heartsHtml = `
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-caput/40 border border-caput text-red-300 font-bold text-[10px] font-mono">
        0 HP (Daya Tahan Habis)
      </span>
    `;
  }

  const obstacleIndex = Math.max(
    0,
    (sim1State.iteration - 1) % MOUNTAIN_OBSTACLES.length,
  );
  const currentObs =
    sim1State.iteration > 0
      ? MOUNTAIN_OBSTACLES[obstacleIndex]
      : {
          name: "Pos 0: Basecamp",
          tag: "Persiapan",
          desc: "Bersiap menghadapi rintangan gunung.",
        };

  container.innerHTML = `
    <div class="mountain-scene p-4 text-cloudy flex flex-col justify-between min-h-[190px]">
      <div class="flex justify-between items-center bg-space-cadet/85 backdrop-blur-md p-2.5 rounded-lg border border-white/10 shadow-sm relative z-10">
        <div>
          <div class="text-[10px] font-bold text-slate-gray uppercase tracking-wider">Status Daya Tahan:</div>
          <div class="flex items-center gap-1 mt-1 flex-wrap">${heartsHtml}</div>
        </div>
        <div class="text-right">
          <div class="text-[10px] font-bold text-slate-gray uppercase tracking-wider">Ketinggian:</div>
          <div class="text-sm font-mono font-extrabold text-tan">${sim1State.altitude} mdpl</div>
        </div>
      </div>

      <div class="my-3 text-center relative z-10">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-space-cadet/90 border border-tan/40 text-tan shadow-lg mb-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
        </div>
        <div>
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-tan/15 text-tan border border-tan/30">
            ${currentObs.name}
          </span>
        </div>
        <p class="text-[11px] text-tsunami mt-0.5 font-medium">${currentObs.desc}</p>
      </div>
    </div>
  `;
}

// ==========================================
// 8. SIMULASI 2: CONTOH WHILE LOOP (BRANKAS DIGITAL)
// ==========================================
let sim2SecretPin = "2000";
let sim2Attempts = 0;
const sim2MaxAttempts = 4;

function inputSafeKeypad(digit) {
  audio.playClick();
  const input = document.getElementById("sim2-user-guess");
  if (input.value.length < 6) {
    input.value += digit;
  }
}

function clearSafeKeypad() {
  audio.playClick();
  document.getElementById("sim2-user-guess").value = "";
}

function testSafePin() {
  const userGuess = document.getElementById("sim2-user-guess").value.trim();
  const traceTable = document.getElementById("sim2-trace-body");
  const consoleLog = document.getElementById("sim2-console");
  const safeDoor = document.getElementById("safe-door-status");

  if (!userGuess) {
    alert("Ketik atau gunakan keypad untuk memasukkan PIN tebakanmu!");
    return;
  }

  sim2Attempts++;
  const isMatch = userGuess === sim2SecretPin;

  if (isMatch) {
    audio.playFanfare();
    triggerConfetti();

    safeDoor.innerHTML = `
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
      </div>
      <div class="text-sm font-extrabold text-emerald-400">BRANKAS TERBUKA</div>
      <div class="text-[11px] text-cloudy mt-0.5">Otentikasi Berhasil • Akses Diterima</div>
    `;

    consoleLog.innerHTML += `[Percobaan ${sim2Attempts}] PIN '${userGuess}' COCOK DENGAN KUNCI RAHASIA!\n`;
    consoleLog.innerHTML += `> Syarat WHILE (userGuess !== secretPIN) bernilai FALSE ➔ Loop Berhenti & Akses Diterima!\n`;

    const tr = document.createElement("tr");
    tr.className = "bg-emerald-950/40 border-b border-emerald-500/40 font-bold";
    tr.innerHTML = `
      <td class="col-iter font-mono text-emerald-400">${sim2Attempts}</td>
      <td class="col-var font-mono text-cloudy">'${userGuess}'</td>
      <td class="col-cond font-mono text-emerald-400">'${userGuess}'!=='${sim2SecretPin}' (F)</td>
      <td class="col-action text-emerald-300">PIN Tepat! Kunci Terbuka • Loop Berhenti.</td>
    `;
    traceTable.appendChild(tr);

    document.getElementById("sim2-custom-pin-panel").classList.remove("hidden");
    appState.completedSims.sim2 = true;
    saveState();
  } else {
    audio.playWrong();
    consoleLog.innerHTML += `[Percobaan ${sim2Attempts}] PIN '${userGuess}' SALAH! Brankas tetap terkunci\n`;

    const tr = document.createElement("tr");
    tr.className = "border-b border-slate-700/50 hover:bg-tan/10 transition";
    tr.innerHTML = `
      <td class="col-iter font-mono font-bold text-red-400">${sim2Attempts}</td>
      <td class="col-var font-mono text-cloudy">'${userGuess}'</td>
      <td class="col-cond font-mono text-red-400 font-bold">'${userGuess}'!=='****' (T)</td>
      <td class="col-action text-red-300">PIN Salah! Syarat TRUE ➔ Loop berulang.</td>
    `;
    traceTable.appendChild(tr);

    if (sim2Attempts >= sim2MaxAttempts) {
      safeDoor.innerHTML = `
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-caput/40 border border-caput text-red-400 mb-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="text-sm font-extrabold text-red-400">ALARM SISTEM AKTIF</div>
        <div class="text-[11px] text-red-200 mt-0.5">Batas percobaan habis (${sim2MaxAttempts}x).</div>
      `;
      consoleLog.innerHTML += `\n> [Keamanan Terkunci] Percobaan mencapai batas maksimal (${sim2MaxAttempts}x). Loop berhenti.\n`;
    }
  }

  document.getElementById("sim2-user-guess").value = "";
}

function updateCustomSecretPin() {
  const newPin = document.getElementById("custom-pin-input").value.trim();
  const newHint = document.getElementById("custom-hint-input").value.trim();

  if (newPin.length >= 3) {
    sim2SecretPin = newPin;
    sim2Attempts = 0;
    document.getElementById("sim2-hint-text").textContent =
      newHint || "Petunjuk: Dibuat oleh siswa.";
    document.getElementById("sim2-trace-body").innerHTML = "";
    document.getElementById("sim2-console").innerHTML =
      `> [PIN Baru Disimpan!] Silakan uji tebak PIN baru ini di simulator.\n`;
    document.getElementById("safe-door-status").innerHTML = `
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-space-cadet/80 border border-tan/30 text-tan mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <div class="text-sm font-extrabold text-tan">BRANKAS TERKUNCI</div>
      <div class="text-[11px] text-slate-gray mt-0.5">Gunakan petunjuk logika untuk menebak PIN</div>
    `;

    // 1. Sembunyikan kembali panel kustomisasi agar PIN tidak ketahuan
    document.getElementById("sim2-custom-pin-panel").classList.add("hidden");

    // 2. Bersihkan input form agar rahasia aman
    document.getElementById("custom-pin-input").value = "";
    document.getElementById("custom-hint-input").value = "";

    audio.playFanfare();
    alert("PIN Rahasia Baru Berhasil Disetel! Brankas telah terkunci kembali.");
  } else {
    alert("PIN minimal 3 digit angka!");
  }
}

// ==========================================
// 9. SIMULASI 3: TANTANGAN 1 - VENDING MACHINE
// ==========================================
let sim3Interval = null;
function runSim3() {
  const targetCount =
    parseInt(document.getElementById("sim3-target").value) || 4;
  const drinkSelect = document.getElementById("sim3-drink-type");
  const drinkType = drinkSelect ? drinkSelect.value : "Cola Segar";

  const traceTable = document.getElementById("sim3-trace-body");
  const consoleLog = document.getElementById("sim3-console");
  const tray = document.getElementById("vending-tray-items");
  const chute = document.getElementById("vending-chute-item");

  tray.innerHTML = "";
  traceTable.innerHTML = "";
  consoleLog.innerHTML = `> [Inisialisasi] Memulai proses pengeluaran: ${targetCount}x ${drinkType}\n`;

  let k = 1;
  clearInterval(sim3Interval);
  audio.playClick();

  sim3Interval = setInterval(() => {
    if (k <= targetCount) {
      audio.playDrop();

      chute.innerHTML = `
        <div class="can-drop-anim px-2.5 py-1 rounded bg-tan text-space-cadet font-display font-bold text-[11px] flex items-center gap-1 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>
          ${drinkType}
        </div>
      `;

      setTimeout(() => {
        tray.innerHTML += `
          <div class="can-drop-anim px-2 py-1 rounded bg-space-cadet border border-tan/30 text-tan font-mono text-[10px] flex items-center gap-1">
            #${k}
          </div>
        `;
        chute.innerHTML = "";
      }, 400);

      consoleLog.innerHTML += `[Putaran ${k}] Mengeluarkan kaleng ke-${k} ➔ Sukses!\n`;

      const tr = document.createElement("tr");
      tr.className = "border-b border-slate-700/50 hover:bg-tan/10 transition";
      tr.innerHTML = `
        <td class="col-iter font-mono font-bold text-tan">${k}</td>
        <td class="col-var font-mono text-cloudy">k = ${k}</td>
        <td class="col-cond font-mono text-emerald-400 font-bold">${k} &lt;= ${targetCount} (T)</td>
        <td class="col-action text-cloudy">Keluarkan ${drinkType} #${k}</td>
      `;
      traceTable.appendChild(tr);

      k++;
    } else {
      clearInterval(sim3Interval);
      consoleLog.innerHTML += `\n> [Siklus Berhenti] Syarat (${k} <= ${targetCount}) bernilai FALSE!\n`;
      consoleLog.innerHTML += `> Total ${targetCount} kaleng selesai dikeluarkan.\n`;

      const trFinal = document.createElement("tr");
      trFinal.className = "bg-tan/15 border-b border-tan/30 font-bold";
      trFinal.innerHTML = `
        <td class="col-iter font-mono text-tan">${k}</td>
        <td class="col-var font-mono text-cloudy">k = ${k}</td>
        <td class="col-cond font-mono text-red-400">${k} &lt;= ${targetCount} (F)</td>
        <td class="col-action text-tan font-bold">Kondisi FALSE. Selesai!</td>
      `;
      traceTable.appendChild(trFinal);

      audio.playFanfare();
      triggerConfetti();

      // Show challenge guess panel
      document
        .getElementById("sim3-challenge-panel")
        .classList.remove("hidden");
    }
  }, 900);
}

// ==========================================
// 10. SIMULASI 4: TANTANGAN 2 - DADU LUDO
// ==========================================
let sim4Target = 6;
let sim4RollCount = 0;
let sim4IsFinished = false;

function getDiceSvg(val) {
  const pipMap = {
    1: [[50, 50]],
    2: [
      [25, 25],
      [75, 75],
    ],
    3: [
      [25, 25],
      [50, 50],
      [75, 75],
    ],
    4: [
      [25, 25],
      [25, 75],
      [75, 25],
      [75, 75],
    ],
    5: [
      [25, 25],
      [25, 75],
      [50, 50],
      [75, 25],
      [75, 75],
    ],
    6: [
      [25, 25],
      [25, 50],
      [25, 75],
      [75, 25],
      [75, 50],
      [75, 75],
    ],
  };
  const pips = pipMap[val] || pipMap[6];
  return `
    <svg viewBox="0 0 100 100" class="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="88" height="88" rx="16" fill="#1b263b" stroke="#D5B893" stroke-width="5"/>
      ${pips.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="7" fill="#D5B893" />`).join("")}
    </svg>
  `;
}

function initSim4() {
  sim4Target = parseInt(document.getElementById("sim4-target-dice").value) || 6;
  sim4RollCount = 0;
  sim4IsFinished = false;

  document.getElementById("sim4-trace-body").innerHTML = "";
  document.getElementById("sim4-console").innerHTML =
    `> [Inisialisasi] Target dadu yang dicari: Angka ${sim4Target}\n`;
  document.getElementById("dice-visual").innerHTML = getDiceSvg(sim4Target);
  document.getElementById("dice-status-badge").textContent =
    `Target: Angka ${sim4Target}`;
  document.getElementById("dice-status-badge").className =
    "px-3 py-1 bg-tan/15 text-tan border border-tan/30 font-bold rounded-full text-xs mb-3";
  document.getElementById("sim4-roll-btn").disabled = false;
  document
    .getElementById("sim4-roll-btn")
    .classList.remove("opacity-50", "cursor-not-allowed");
}

function rollDiceStep() {
  if (sim4IsFinished) return;

  const diceElement = document.getElementById("dice-visual");
  const consoleLog = document.getElementById("sim4-console");
  const traceTable = document.getElementById("sim4-trace-body");

  audio.playClick();
  diceElement.classList.add("dice-rolling");

  setTimeout(() => {
    diceElement.classList.remove("dice-rolling");
    sim4RollCount++;

    const rolledValue = Math.floor(Math.random() * 6) + 1;
    diceElement.innerHTML = getDiceSvg(rolledValue);

    const isMatch = rolledValue === sim4Target;
    consoleLog.innerHTML += `[Putaran ${sim4RollCount}] Dadu keluar: ${rolledValue}\n`;

    const tr = document.createElement("tr");
    tr.className = isMatch
      ? "bg-emerald-950/40 border-b border-emerald-500/40 font-bold"
      : "border-b border-slate-700/50 hover:bg-tan/10 transition";
    tr.innerHTML = `
      <td class="col-iter font-mono font-bold text-tan">${sim4RollCount}</td>
      <td class="col-var font-mono text-cloudy font-bold">${rolledValue}</td>
      <td class="col-cond font-mono ${isMatch ? "text-red-400" : "text-emerald-400"} font-bold">${rolledValue} != ${sim4Target} (${!isMatch ? "T" : "F"})</td>
      <td class="col-action ${isMatch ? "text-emerald-300" : "text-cloudy"}">${isMatch ? "Target tercapai!" : "Belum cocok, lempar lagi..."}</td>
    `;
    traceTable.appendChild(tr);

    if (isMatch) {
      sim4IsFinished = true;
      document.getElementById("sim4-roll-btn").disabled = true;
      document
        .getElementById("sim4-roll-btn")
        .classList.add("opacity-50", "cursor-not-allowed");

      document.getElementById("dice-status-badge").textContent =
        `Target Angka ${sim4Target} Tercapai pada Putaran ke-${sim4RollCount}!`;
      document.getElementById("dice-status-badge").className =
        "px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md";

      consoleLog.innerHTML += `\n> [Loop Selesai] Syarat (${rolledValue} != ${sim4Target}) bernilai FALSE!\n`;
      audio.playFanfare();
      triggerConfetti();

      // Show challenge guess panel
      document
        .getElementById("sim4-challenge-panel")
        .classList.remove("hidden");
    }
  }, 220);
}

// ==========================================
// 11. SIMULASI 5: TANTANGAN 3 - BARCODE SCANNER KASIR (BARU)
// ==========================================
const SUPERMARKET_ITEMS = [
  { name: "Susu Kotak UHT 1L", price: 18000, code: "89927531" },
  { name: "Roti Gandum Serat", price: 16500, code: "89910042" },
  { name: "Cokelat Batang Hazelnut", price: 21000, code: "89988210" },
  { name: "Apel Fuji Segar 1kg", price: 32000, code: "89945199" },
  { name: "Biskuit Gandum Madu", price: 12500, code: "89932014" },
  { name: "Teh Hijau Celup 25s", price: 14000, code: "89955120" },
  { name: "Susu Ultramilk Stoberi", price: 18000, code: "89927531" },
  { name: "Sariroti", price: 16500, code: "89910042" },
  { name: "Cokelat Silverqueen", price: 21000, code: "89988210" },
  { name: "Mangga Indramayu Segar 1kg", price: 32000, code: "89945199" },
  { name: "Biskuit Roma", price: 12500, code: "89932014" },
  { name: "Matcha", price: 14000, code: "89955120" },
];

let sim5State = {
  cartIndex: 0,
  totalItems: 0,
  totalPrice: 0,
  isFinished: false,
};

function initSim5() {
  sim5State = {
    cartIndex: 0,
    totalItems: 0,
    totalPrice: 0,
    isFinished: false,
  };

  document.getElementById("sim5-trace-body").innerHTML = "";
  document.getElementById("sim5-console").innerHTML =
    `> [Kasir Siap] Keranjang pelanggan berisi barang belanjaan.\n`;
  document.getElementById("sim5-console").innerHTML +=
    `> Tekan 'Scan Barang' untuk memeriksa barang satu per satu.\n`;
  document.getElementById("sim5-total-price").textContent = "Rp 0";
  document.getElementById("sim5-item-count").textContent = "0 Barang";
  document.getElementById("sim5-receipt-list").innerHTML =
    `<div class="text-slate-gray italic text-[11px]">Belum ada barang discan</div>`;

  document.getElementById("sim5-scan-btn").disabled = false;
  document
    .getElementById("sim5-scan-btn")
    .classList.remove("opacity-50", "cursor-not-allowed");
  document.getElementById("sim5-pay-btn").disabled = false;
  document
    .getElementById("sim5-pay-btn")
    .classList.remove("opacity-50", "cursor-not-allowed");
}

function scanNextSupermarketItem() {
  if (sim5State.isFinished) return;

  const itemIndex = sim5State.cartIndex % SUPERMARKET_ITEMS.length;
  const item = SUPERMARKET_ITEMS[itemIndex];
  sim5State.cartIndex++;
  sim5State.totalItems++;
  sim5State.totalPrice += item.price;

  audio.playScan();

  const receipt = document.getElementById("sim5-receipt-list");
  if (sim5State.totalItems === 1) receipt.innerHTML = "";
  receipt.innerHTML += `
    <div class="flex justify-between items-center text-[11px] py-1 border-b border-white/5">
      <span class="text-cloudy">${sim5State.totalItems}. ${item.name}</span>
      <span class="font-mono text-tan">Rp ${item.price.toLocaleString("id-ID")}</span>
    </div>
  `;

  document.getElementById("sim5-total-price").textContent =
    `Rp ${sim5State.totalPrice.toLocaleString("id-ID")}`;
  document.getElementById("sim5-item-count").textContent =
    `${sim5State.totalItems} Barang`;

  const consoleLog = document.getElementById("sim5-console");
  consoleLog.innerHTML += `[Scan #${sim5State.totalItems}] '${item.name}' (Barcode: ${item.code}) ➔ Rp ${item.price.toLocaleString("id-ID")}\n`;

  const tr = document.createElement("tr");
  tr.className = "border-b border-slate-700/50 hover:bg-tan/10 transition";
  tr.innerHTML = `
    <td class="col-iter font-mono font-bold text-tan">${sim5State.totalItems}</td>
    <td class="col-var font-mono text-cloudy">${item.name.substring(0, 10)}..</td>
    <td class="col-cond font-mono text-emerald-400 font-bold">adaBarang (T)</td>
    <td class="col-action text-cloudy">+Rp ${item.price.toLocaleString("id-ID")} (Scan OK)</td>
  `;
  document.getElementById("sim5-trace-body").appendChild(tr);
}

function finishSupermarketShopping() {
  if (sim5State.isFinished) return;
  if (sim5State.totalItems === 0) {
    alert("Scan minimal 1 barang belanjaan terlebih dahulu!");
    return;
  }

  sim5State.isFinished = true;
  document.getElementById("sim5-scan-btn").disabled = true;
  document
    .getElementById("sim5-scan-btn")
    .classList.add("opacity-50", "cursor-not-allowed");
  document.getElementById("sim5-pay-btn").disabled = true;
  document
    .getElementById("sim5-pay-btn")
    .classList.add("opacity-50", "cursor-not-allowed");

  const consoleLog = document.getElementById("sim5-console");
  consoleLog.innerHTML += `\n> [Selesai Belanja] Pelanggan menekan tombol Bayar! Kondisi (adaBarangDiKeranjang) bernilai FALSE.\n`;
  consoleLog.innerHTML += `> Total Belanja Akhir: Rp ${sim5State.totalPrice.toLocaleString("id-ID")} (${sim5State.totalItems} item). Transaksi Sukses!\n`;

  const trFinal = document.createElement("tr");
  trFinal.className =
    "bg-emerald-950/40 border-b border-emerald-500/40 font-bold";
  trFinal.innerHTML = `
    <td class="col-iter font-mono text-emerald-400">Final</td>
    <td class="col-var font-mono text-cloudy">${sim5State.totalItems} Item</td>
    <td class="col-cond font-mono text-red-400">adaBarang (F)</td>
    <td class="col-action text-emerald-300 font-bold">Bayar ditekan. Kasir selesai!</td>
  `;
  document.getElementById("sim5-trace-body").appendChild(trFinal);

  audio.playFanfare();
  triggerConfetti();

  // Show challenge guess panel
  document.getElementById("sim5-challenge-panel").classList.remove("hidden");
}

// ==========================================
// 12. SIMULASI 6: TANTANGAN 4 - COUNTDOWN TRAFFIC LIGHT (BARU)
// ==========================================
let sim6Timer = null;
let sim6State = {
  currentSecond: 10,
  startSecond: 10,
  isRunning: false,
};

function initSim6() {
  clearInterval(sim6Timer);
  sim6State.startSecond =
    parseInt(document.getElementById("sim6-start-sec").value) || 10;
  sim6State.currentSecond = sim6State.startSecond;
  sim6State.isRunning = false;

  document.getElementById("sim6-trace-body").innerHTML = "";
  document.getElementById("sim6-console").innerHTML =
    `> [Traffic Controller] Lampu Merah aktif. Durasi pasti: ${sim6State.startSecond} detik.\n`;
  document.getElementById("sim6-countdown-display").textContent =
    `${sim6State.currentSecond}s`;

  // Set visual lights
  setTrafficLightColor("red");
  document.getElementById("sim6-start-btn").disabled = false;
  document
    .getElementById("sim6-start-btn")
    .classList.remove("opacity-50", "cursor-not-allowed");
}

function setTrafficLightColor(color) {
  const red = document.getElementById("traffic-red");
  const yellow = document.getElementById("traffic-yellow");
  const green = document.getElementById("traffic-green");

  if (red)
    red.className = `traffic-light red ${color === "red" ? "active" : ""}`;
  if (yellow)
    yellow.className = `traffic-light yellow ${color === "yellow" ? "active" : ""}`;
  if (green)
    green.className = `traffic-light green ${color === "green" ? "active" : ""}`;
}

function startTrafficCountdown() {
  if (sim6State.isRunning) return;
  sim6State.isRunning = true;
  document.getElementById("sim6-start-btn").disabled = true;
  document
    .getElementById("sim6-start-btn")
    .classList.add("opacity-50", "cursor-not-allowed");

  audio.playClick();
  const consoleLog = document.getElementById("sim6-console");
  consoleLog.innerHTML += `> Memulai loop FOR countdown: detik = ${sim6State.startSecond} s.d. 0...\n`;

  sim6Timer = setInterval(() => {
    if (sim6State.currentSecond > 0) {
      const prevSec = sim6State.currentSecond;
      sim6State.currentSecond--;
      audio.playClick();

      document.getElementById("sim6-countdown-display").textContent =
        `${sim6State.currentSecond}s`;
      consoleLog.innerHTML += `[Detik ${prevSec}] Lampu Merah aktif, tersisa ${sim6State.currentSecond} detik.\n`;

      if (sim6State.currentSecond <= 2 && sim6State.currentSecond > 0) {
        setTrafficLightColor("yellow");
      }

      const tr = document.createElement("tr");
      tr.className = "border-b border-slate-700/50 hover:bg-tan/10 transition";
      tr.innerHTML = `
        <td class="col-iter font-mono font-bold text-tan">${sim6State.startSecond - prevSec + 1}</td>
        <td class="col-var font-mono text-cloudy">sec = ${prevSec}</td>
        <td class="col-cond font-mono text-emerald-400 font-bold">${prevHp || prevSec} &gt; 0 (T)</td>
        <td class="col-action text-cloudy">Lampu Merah: Berhenti (-1s)</td>
      `;
      document.getElementById("sim6-trace-body").appendChild(tr);
    } else {
      clearInterval(sim6Timer);
      sim6State.isRunning = false;
      setTrafficLightColor("green");
      document.getElementById("sim6-countdown-display").textContent = "GO!";

      consoleLog.innerHTML += `\n> [Loop Selesai] Syarat (detik > 0) bernilai FALSE!\n`;
      consoleLog.innerHTML += `> Waktu lampu merah habis. Lampu Hijau MENYALA! Kendaraan melaju.\n`;

      const trFinal = document.createElement("tr");
      trFinal.className =
        "bg-emerald-950/40 border-b border-emerald-500/40 font-bold";
      trFinal.innerHTML = `
        <td class="col-iter font-mono text-emerald-400">Done</td>
        <td class="col-var font-mono text-cloudy">sec = 0</td>
        <td class="col-cond font-mono text-red-400">0 &gt; 0 (F)</td>
        <td class="col-action text-emerald-300 font-bold">Kondisi FALSE. Lampu Hijau!</td>
      `;
      document.getElementById("sim6-trace-body").appendChild(trFinal);

      audio.playFanfare();
      triggerConfetti();

      // Show challenge guess panel
      document
        .getElementById("sim6-challenge-panel")
        .classList.remove("hidden");
    }
  }, 850);
}

// ==========================================
// 13. INTERACTIVE LOGIC CHALLENGE (TEBAK PERULANGAN)
// ==========================================
const CHALLENGE_ANSWERS = {
  sim3: {
    correct: "for",
    title: "Mesin Vending Kaleng Minuman",
    explanation:
      "Tepat sekali! Karena jumlah kaleng pesanan sudah diketahui dengan pasti sejak awal (Counted Loop), struktur FOR Loop adalah yang paling efisien.",
  },
  sim4: {
    correct: "while",
    title: "Kocok Dadu Ludo Target",
    explanation:
      "Hebat, tebakanmu benar! Kita tidak bisa memprediksi berapa kali dadu harus dikocok sebelum angka 6 keluar (Uncounted). Perulangan bersyarat WHILE Loop adalah struktur yang tepat.",
  },
  sim5: {
    correct: "while",
    title: "Barcode Scanner Kasir Supermarket",
    explanation:
      "Tepat sekali! Kasir tidak mengetahui jumlah barang belanjaan di keranjang pembeli sejak awal. Proses scan terus berjalan selama kondisi (adaBarang) bernilai TRUE hingga pembeli menekan Bayar.",
  },
  sim6: {
    correct: "for",
    title: "Countdown Timer Lampu Lalu Lintas",
    explanation:
      "Benar sekali! Durasi hitung mundur lampu merah sudah ditentukan secara pasti (misal 10 detik ke 0 dengan decrement -1). Ini adalah karakteristik utama FOR Loop (Counted Loop).",
  },
};

function submitLoopGuess(simKey, chosenType) {
  audio.playClick();
  const challenge = CHALLENGE_ANSWERS[simKey];
  if (!challenge) return;

  const feedbackBox = document.getElementById(`${simKey}-guess-feedback`);
  const isCorrect = chosenType.toLowerCase() === challenge.correct;

  appState.challengeGuesses[simKey] = chosenType;
  if (isCorrect) {
    appState.completedSims[simKey] = true;
    audio.playCorrect();
    triggerConfetti();
  } else {
    audio.playWrong();
  }
  saveState();

  // Style buttons
  document
    .querySelectorAll(`#${simKey}-challenge-panel .guess-btn`)
    .forEach((btn) => {
      btn.disabled = true;
      const type = btn.dataset.loopType;
      if (type === challenge.correct) {
        btn.className = "guess-btn correct";
      } else if (type === chosenType && !isCorrect) {
        btn.className = "guess-btn wrong";
      }
    });

  if (feedbackBox) {
    feedbackBox.classList.remove("hidden");
    if (isCorrect) {
      feedbackBox.className =
        "mt-3 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs";
      feedbackBox.innerHTML = `
        <div class="font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          Tebakan Benar! (${chosenType.toUpperCase()} Loop)
        </div>
        <p class="leading-relaxed text-cloudy">${challenge.explanation}</p>
      `;
    } else {
      feedbackBox.className =
        "mt-3 p-3.5 rounded-xl bg-caput/40 border border-caput/60 text-red-200 text-xs";
      feedbackBox.innerHTML = `
        <div class="font-bold text-red-300 flex items-center gap-1.5 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Kurang Tepat, yang Benar adalah: ${challenge.correct.toUpperCase()} Loop
        </div>
        <p class="leading-relaxed text-cloudy">${challenge.explanation}</p>
      `;
    }
  }
}

// ==========================================
// 14. KUIS INTERAKTIF (CLEAN OPTIONS & REFINED SVG)
// ==========================================
const QUIZ_BANK = [
  {
    id: 1,
    q: "Apa fungsi utama dari struktur kontrol perulangan (looping) dalam algoritma pemrograman?",
    opts: [
      "Menyimpan data ke dalam database secara permanen.",
      "Menjalankan sekumpulan instruksi kode yang sama berulang kali selama kondisi terpenuhi.",
      "Menghapus variabel yang sudah tidak digunakan di memori.",
      "Mengubah tipe data teks menjadi bilangan desimal.",
    ],
    ans: 1,
    exp: "Perulangan berfungsi mengeksekusi blok instruksi secara berulang berdasarkan kondisi tertentu tanpa perlu mengetik ulang kodenya.",
  },
  {
    id: 2,
    q: "Perulangan FOR paling tepat dan ideal diklasifikasikan sebagai jenis perulangan...",
    opts: [
      "Counted Loop (Perulangan terhitung dengan batas pasti)",
      "Uncounted Loop (Perulangan tak terhitung)",
      "Endless / Infinite Loop",
      "Branching Condition",
    ],
    ans: 0,
    exp: "FOR loop adalah 'Counted Loop' karena batas awal, syarat batas akhir, dan langkah perubahannya (step) sudah ditentukan secara eksplisit sejak awal.",
  },
  {
    id: 3,
    q: "Perhatikan struktur sintaksis FOR berikut:\nfor (A; B; C) { ... }\nManakah urutan nama komponen yang BENAR untuk bagian A, B, dan C?",
    opts: [
      "A: Kondisi Terminasi, B: Modifier/Step, C: Inisialisasi",
      "A: Inisialisasi Variabel, B: Kondisi Terminasi, C: Modifier/Step",
      "A: Output Console, B: Inisialisasi, C: Kondisi Terminasi",
      "A: Modifier, B: Kondisi Terminasi, C: Output",
    ],
    ans: 1,
    exp: "Sintaks FOR terdiri dari: (1) Inisialisasi awal `let i = 0`, (2) Kondisi uji `i < 10`, dan (3) Modifier penambah/pengurang `i++`.",
  },
  {
    id: 4,
    q: "Perhatikan potongan kode berikut:\nfor (let i = 2; i <= 8; i += 2) {\n  console.log(i);\n}\nBerapa kali teks angka akan dicetak ke layar?",
    opts: ["3 kali", "4 kali (Angka 2, 4, 6, 8)", "7 kali", "8 kali"],
    ans: 1,
    exp: "Nilai `i` dimulai dari 2, bertambah 2 setiap putaran: putaran 1 (i=2), putaran 2 (i=4), putaran 3 (i=6), putaran 4 (i=8). Total 4 kali cetak!",
  },
  {
    id: 5,
    q: "Kapan kode di dalam badan perulangan WHILE (Pre-test Loop) akan dieksekusi?",
    opts: [
      "Selalu dieksekusi minimal satu kali tanpa memeriksa kondisi.",
      "Hanya dieksekusi JIKA kondisi yang diuji di awal bernilai TRUE (Benar).",
      "Hanya dieksekusi saat komputer mendeteksi error.",
      "Hanya dieksekusi saat kondisi bernilai FALSE.",
    ],
    ans: 1,
    exp: "WHILE adalah 'Pre-test Loop', artinya syarat kondisi diuji terlebih dahulu di bagian atas. Blok kode hanya jalan jika kondisi bernilai TRUE.",
  },
  {
    id: 6,
    q: "Perhatikan kode perulangan WHILE berikut:\nlet angka = 5;\nwhile (angka > 2) {\n  angka--;\n}\nBerapakah nilai akhir variabel `angka` saat perulangan telah berhenti?",
    opts: ["5", "3", "2", "0"],
    ans: 2,
    exp: "Putaran 1: angka jadi 4 (4>2 TRUE). Putaran 2: angka jadi 3 (3>2 TRUE). Putaran 3: angka jadi 2. Syarat (2>2) bernilai FALSE, loop berhenti dengan nilai `angka = 2`.",
  },
  {
    id: 7,
    q: "Apa yang menyebabkan terjadinya 'Infinite Loop' (Perulangan Tak Terbatas) pada perulangan WHILE?",
    opts: [
      "Nilai variabel kondisi di dalam badan loop tidak pernah diperbarui sehingga kondisinya selalu TRUE.",
      "Nilai awal variabel disetel ke angka 0.",
      "Menggunakan tipe data integer.",
      "Perulangan ditutup dengan tanda kurung kurawal.",
    ],
    ans: 0,
    exp: "Infinite loop terjadi ketika kondisi perulangan tidak pernah berubah menjadi FALSE, umumnya karena programmer lupa memberikan instruksi pembaru/modifier variabel di dalam badan loop.",
  },
  {
    id: 8,
    q: "Perhatikan algoritma berikut:\n'Kasir menscan barang belanjaan pembeli satu demi satu sampai keranjang kosong dan pembeli menekan tombol Bayar.'\nStruktur perulangan manakah yang PALING TEPAT untuk kasus ini?",
    opts: [
      "Perulangan FOR Increment 1 sampai 100",
      "Perulangan WHILE dengan kondisi (adaBarangBelanjaan)",
      "Percabangan IF-ELSE tunggal tanpa loop",
      "Algoritma Pengurutan (Sorting)",
    ],
    ans: 1,
    exp: "Karena jumlah barang belanjaan tiap pembeli berbeda dan tidak bisa diketahui secara pasti sebelum selesai, perulangan kondisional tak terhitung (WHILE loop) adalah pilihan yang paling tepat.",
  },
  {
    id: 9,
    q: "Perhatikan kode perulangan FOR berikut:\nfor (let i = 5; i > 0; i--) {\n  // Instruksi\n}\nKode di atas merupakan contoh perulangan...",
    opts: [
      "FOR Increment (Hitung Maju)",
      "FOR Decrement (Hitung Mundur)",
      "Nested Loop Bersarang",
      "Infinite Loop Error",
    ],
    ans: 1,
    exp: "Modifier `i--` mengurangi nilai variabel sebesar 1 pada setiap putaran dari 5 ke 1, yang merupakan karakteristik perulangan FOR Decrement (hitung mundur).",
  },
  {
    id: 10,
    q: "Manakah pernyataan yang BENAR mengenai perbedaan mendasar perulangan FOR dan WHILE?",
    opts: [
      "FOR dipakai saat jumlah iterasi pasti, sedangkan WHILE dipakai saat iterasi bergantung pada pemenuhan kondisi logika.",
      "WHILE hanya bisa dipakai untuk data teks, FOR untuk angka.",
      "FOR tidak memerlukan variabel pencatat.",
      "WHILE selalu berhenti otomatis setelah 10 kali putaran.",
    ],
    ans: 0,
    exp: "FOR loop optimal untuk iterasi dengan jumlah pasti (counted), sedangkan WHILE loop optimal saat kondisi berhenti bergantung pada evaluasi logika dinamis (uncounted).",
  },
];

let quizSession = {
  currentIdx: 0,
  score: 0,
  userAnswers: [],
};

function initQuizSession() {
  quizSession.currentIdx = 0;
  quizSession.score = 0;
  quizSession.userAnswers = [];
  renderQuizQuestion();
}

function cleanOptionText(text) {
  // Strip any leading "A. ", "B. ", "C. ", "D. " prefix
  return text.replace(/^[A-D]\.\s*/i, "").trim();
}

function renderQuizQuestion() {
  const container = document.getElementById("quiz-card-container");
  const qData = QUIZ_BANK[quizSession.currentIdx];

  if (!qData) {
    renderQuizFinish();
    return;
  }

  const progressPercent =
    ((quizSession.currentIdx + 1) / QUIZ_BANK.length) * 100;
  const pBar = document.getElementById("quiz-progress-bar");
  if (pBar) pBar.style.width = `${progressPercent}%`;

  const pText = document.getElementById("quiz-progress-text");
  if (pText)
    pText.textContent = `Soal ${quizSession.currentIdx + 1} dari ${QUIZ_BANK.length}`;

  const letters = ["A", "B", "C", "D"];

  container.innerHTML = `
    <div class="glass-card p-5 sm:p-7">
      <div class="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
        <span class="text-xs font-mono font-bold text-tan bg-space-cadet px-2.5 py-1 rounded-lg border border-tan/30">
          Soal ${quizSession.currentIdx + 1} / ${QUIZ_BANK.length}
        </span>
      </div>

      <h3 class="text-sm sm:text-base md:text-lg font-bold text-white leading-relaxed mb-5 whitespace-pre-line">${qData.q}</h3>

      <div class="space-y-2.5" id="quiz-option-list">
        ${qData.opts
          .map((opt, idx) => {
            const cleanText = cleanOptionText(opt);
            return `
            <button onclick="handleQuizPick(${idx})" 
                    class="quiz-opt-btn group">
              <div class="flex items-center gap-3">
                <span class="quiz-opt-pill group-hover:border-tan group-hover:bg-tan group-hover:text-space-cadet transition">
                  ${letters[idx]}
                </span>
                <span class="text-xs sm:text-sm font-medium text-cloudy leading-snug">${cleanText}</span>
              </div>
            <div id="quiz-opt-indicator-${idx}" class="quiz-opt-icon"></div>
            </button>
          `;
          })
          .join("")}
      </div>

      <div id="quiz-instant-feedback" class="hidden mt-5 p-4 rounded-xl border"></div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

function handleQuizPick(chosenIdx) {
  const qData = QUIZ_BANK[quizSession.currentIdx];
  const isCorrect = chosenIdx === qData.ans;

  if (isCorrect) {
    quizSession.score += 10;
    audio.playCorrect();
  } else {
    audio.playWrong();
  }

  quizSession.userAnswers.push({
    q: qData.q,
    chosen: chosenIdx,
    correct: qData.ans,
    isCorrect: isCorrect,
  });

  // Update button indicators with clean precise SVGs
  const indicator = document.getElementById(`quiz-opt-indicator-${chosenIdx}`);
  if (indicator) {
    if (isCorrect) {
      indicator.className =
        "quiz-opt-icon bg-emerald-500 border-emerald-400 text-white";
      indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
    } else {
      indicator.className = "quiz-opt-icon bg-caput border-red-400 text-white";
      indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

      // Also highlight correct answer indicator
      const correctIndicator = document.getElementById(
        `quiz-opt-indicator-${qData.ans}`,
      );
      if (correctIndicator) {
        correctIndicator.className =
          "quiz-opt-icon bg-emerald-500/30 border-emerald-400 text-emerald-300";
        correctIndicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
      }
    }
  }

  const feedback = document.getElementById("quiz-instant-feedback");
  feedback.classList.remove("hidden");

  const letters = ["A", "B", "C", "D"];
  const correctClean = cleanOptionText(qData.opts[qData.ans]);

  if (isCorrect) {
    feedback.className =
      "mt-5 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200";
    feedback.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <div>
          <h4 class="font-bold text-white text-xs sm:text-sm">Jawaban Tepat!</h4>
          <p class="text-xs mt-0.5 text-emerald-300/90 leading-relaxed">${qData.exp}</p>
        </div>
      </div>
      <button onclick="nextQuizQuestion()" class="mt-3 px-5 py-2 bg-tan text-space-cadet rounded-lg font-display font-bold text-xs hover:bg-tan-light transition w-full sm:w-auto">
        Lanjut ke Soal Berikutnya ➔
      </button>
    `;
  } else {
    feedback.className =
      "mt-5 p-4 rounded-xl bg-caput/30 border border-caput/60 text-red-200";
    feedback.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-7 h-7 rounded-lg bg-caput/40 border border-caput flex items-center justify-center text-red-300 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div>
          <h4 class="font-bold text-white text-xs sm:text-sm">Jawaban Belum Tepat</h4>
          <p class="text-xs mt-0.5 text-cloudy">Kunci Jawaban: <strong class="text-tan">${letters[qData.ans]}. ${correctClean}</strong></p>
          <p class="text-[11px] mt-1.5 text-cloudy/80 bg-space-cadet/80 p-2.5 rounded-lg border border-white/5 leading-relaxed">${qData.exp}</p>
        </div>
      </div>
      <button onclick="nextQuizQuestion()" class="mt-3 px-5 py-2 bg-tan text-space-cadet rounded-lg font-display font-bold text-xs hover:bg-tan-light transition w-full sm:w-auto">
        Pahami &amp; Lanjut ➔
      </button>
    `;
  }

  document.querySelectorAll("#quiz-option-list button").forEach((b) => {
    b.disabled = true;
    b.classList.add("opacity-60", "cursor-not-allowed");
  });
}

function nextQuizQuestion() {
  quizSession.currentIdx++;
  renderQuizQuestion();
}

function renderQuizFinish() {
  const container = document.getElementById("quiz-card-container");
  const finalScore = quizSession.score;

  if (finalScore >= 80) {
    audio.playFanfare();
    triggerConfetti();
  }

  container.innerHTML = `
    <div class="glass-card p-6 sm:p-8 text-center max-w-lg mx-auto">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-tan/15 border border-tan/30 text-tan mb-3 shadow-lg">
        ${
          finalScore >= 80
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`
        }
      </div>
      <h2 class="text-xl sm:text-2xl font-extrabold text-white">Evaluasi Pembelajaran Selesai</h2>
      <p class="text-xs text-tsunami mt-1">10 Soal Logika Perulangan Telah Diselesaikan</p>

      <div class="my-5 p-5 rounded-xl bg-space-cadet border border-tan/25 shadow-inner">
        <div class="text-4xl sm:text-5xl font-black text-tan font-mono">${finalScore} / 100</div>
        <div class="text-xs font-bold text-cloudy mt-2">
          ${finalScore >= 80 ? "Penguasaan Konsep Sangat Baik! Siap melanjutkan materi lanjutan." : "Tetap semangat, tinjau kembali materi simulator untuk memperkuat pemahaman."}
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-2.5 justify-center">
        <button onclick="initQuizSession()" class="btn-primary text-xs">
          Ulangi Evaluasi
        </button>
        <button onclick="navigateTo('materi')" class="btn-secondary text-xs">
          Kembali ke Modul
        </button>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 15. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  switchMateriTab(1);

  // Default initial page: HOME (Beranda)
  navigateTo("home");

  // Init simulations
  initSim1();
  initSim4();
  initSim5();
  initSim6();

  if (window.lucide) {
    lucide.createIcons();
  }
});
