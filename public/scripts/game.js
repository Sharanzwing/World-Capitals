/* GeoQuest - Interactive Client Game Logic & Audio FX */
document.addEventListener("DOMContentLoaded", () => {
  // 1. High Score Persistence via localStorage
  const HIGH_SCORE_KEY = "geoquest_high_score";
  const SOUND_KEY = "geoquest_sound_enabled";

  let savedBest = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || "0", 10);
  const currentScore = parseInt(gameState.totalScore || 0, 10);

  if (currentScore > savedBest) {
    savedBest = currentScore;
    localStorage.setItem(HIGH_SCORE_KEY, savedBest.toString());
  }

  const bestScoreEl = document.getElementById("bestScore");
  if (bestScoreEl) bestScoreEl.textContent = savedBest;

  const summaryBestEl = document.getElementById("summaryBestScore");
  if (summaryBestEl) summaryBestEl.textContent = savedBest;

  // Set playful rank title on game over screen
  const rankSubtitleEl = document.getElementById("rankSubtitle");
  if (rankSubtitleEl && gameState.gameOver) {
    if (currentScore >= 16) {
      rankSubtitleEl.textContent = "🏆 Legendary Geographer! Outstanding world knowledge.";
    } else if (currentScore >= 10) {
      rankSubtitleEl.textContent = "🗺️ Atlas Master! You truly know your world capitals.";
    } else if (currentScore >= 5) {
      rankSubtitleEl.textContent = "🧭 Continental Explorer! Impressive streak.";
    } else if (currentScore >= 2) {
      rankSubtitleEl.textContent = "🎒 Rising Traveler! Great effort, keep exploring.";
    } else {
      rankSubtitleEl.textContent = "🌱 Every grand journey begins with a single step!";
    }
  }

  // 2. Sound Effects Engine (Web Audio API - No external assets required)
  let soundEnabled = localStorage.getItem(SOUND_KEY) !== "false";
  const soundToggleBtn = document.getElementById("soundToggle");
  const soundIcon = document.getElementById("soundIcon");

  function updateSoundUI() {
    if (soundIcon) {
      soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
    }
    if (soundToggleBtn) {
      soundToggleBtn.title = soundEnabled ? "Mute Sound" : "Enable Sound";
      soundToggleBtn.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
    }
  }
  updateSoundUI();

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem(SOUND_KEY, soundEnabled ? "true" : "false");
      updateSoundUI();
      if (soundEnabled) playChime(587.33, 0.1, "sine"); // Quick test beep
    });
  }

  function getAudioCtx() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!window.geoAudioCtx) {
      window.geoAudioCtx = new AudioCtx();
    }
    if (window.geoAudioCtx.state === "suspended") {
      window.geoAudioCtx.resume();
    }
    return window.geoAudioCtx;
  }

  function playChime(freq, duration = 0.15, type = "sine") {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio policy errors
    }
  }

  function playSuccessSound() {
    if (!soundEnabled) return;
    playChime(523.25, 0.12, "triangle"); // C5
    setTimeout(() => playChime(659.25, 0.12, "triangle"), 100); // E5
    setTimeout(() => playChime(783.99, 0.25, "triangle"), 200); // G5
  }

  function playGameOverSound() {
    if (!soundEnabled) return;
    playChime(349.23, 0.18, "sawtooth"); // F4
    setTimeout(() => playChime(293.66, 0.35, "sawtooth"), 150); // D4
  }

  // Trigger sound effects on page load based on gameState
  if (gameState.wasCorrect === true) {
    playSuccessSound();
    triggerConfetti();
  } else if (gameState.gameOver === true) {
    playGameOverSound();
  }

  // 3. Input UX Improvements (Clear button & Auto-focus)
  const inputEl = document.getElementById("userInput");
  const clearBtn = document.getElementById("clearBtn");

  if (inputEl) {
    inputEl.focus();
    inputEl.addEventListener("input", () => {
      if (clearBtn) {
        if (inputEl.value.trim().length > 0) {
          clearBtn.classList.remove("hidden");
        } else {
          clearBtn.classList.add("hidden");
        }
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        inputEl.value = "";
        clearBtn.classList.add("hidden");
        inputEl.focus();
      });
    }
  }

  // 4. Hint Accordion Toggle
  const hintBtn = document.getElementById("hintBtn");
  const hintBox = document.getElementById("hintBox");
  if (hintBtn && hintBox) {
    hintBtn.addEventListener("click", () => {
      const isHidden = hintBox.classList.contains("hidden");
      if (isHidden) {
        hintBox.classList.remove("hidden");
        hintBtn.setAttribute("aria-expanded", "true");
        hintBtn.innerHTML = '<span class="hint-icon">💡</span> Hide hint';
      } else {
        hintBox.classList.add("hidden");
        hintBtn.setAttribute("aria-expanded", "false");
        hintBtn.innerHTML = '<span class="hint-icon">💡</span> Need a hint?';
      }
    });
  }

  // 5. Lightweight Canvas Confetti Particles
  function triggerConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const colors = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#fbbf24"];
    const particles = [];
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 300,
        y: height / 2 - 50 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 1) * 14 - 2,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        alpha: 1,
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, width, height);
      let aliveCount = 0;

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravity
        p.vx *= 0.98; // Drag
        p.rotation += p.rSpeed;
        p.alpha -= 0.012; // Fade

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      }

      if (aliveCount > 0) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        cancelAnimationFrame(animationFrame);
      }
    }
    render();
  }
});
