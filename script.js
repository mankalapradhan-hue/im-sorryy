document.addEventListener("DOMContentLoaded", () => {
  const typingText = document.getElementById("typingText");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const successScreen = document.getElementById("successScreen");
  const restartBtn = document.getElementById("restart");
  const heartsLayer = document.getElementById("hearts");
  const sparklesLayer = document.getElementById("sparkles");
  const confettiCanvas = document.getElementById("confetti");
  const ctx = confettiCanvas.getContext("2d");

  const message = "Sometimes words are small, but my apology is real. I hope this page can make you smile a little. 💖";
  let typingIndex = 0;
  let typingDone = false;
  let noMoveCooldown = false;
  let confettiPieces = [];
  let confettiRunning = false;

  function typeMessage() {
    if (!typingText || typingDone) return;
    typingText.textContent = message.slice(0, typingIndex);
    typingIndex++;

    if (typingIndex <= message.length) {
      setTimeout(typeMessage, 35);
    } else {
      typingDone = true;
      typingText.style.opacity = "1";
    }
  }

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFloatingHeart() {
    if (!heartsLayer) return;

    const heart = document.createElement("span");
    heart.className = "float-heart";
    heart.textContent = ["💗", "💖", "💞", "💘", "✨"][Math.floor(Math.random() * 5)];

    const size = randomBetween(14, 42);
    const left = randomBetween(0, 100);
    const duration = randomBetween(7, 15);
    const delay = randomBetween(0, 4);

    heart.style.left = `${left}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;

    heartsLayer.appendChild(heart);

    setTimeout(() => heart.remove(), (duration + delay) * 1000);
  }

  function createSparkle() {
    if (!sparklesLayer) return;

    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.textContent = "✦";

    sparkle.style.left = `${randomBetween(0, 100)}vw`;
    sparkle.style.top = `${randomBetween(0, 100)}vh`;
    sparkle.style.animationDuration = `${randomBetween(2, 5)}s`;
    sparkle.style.fontSize = `${randomBetween(10, 18)}px`;

    sparklesLayer.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 5000);
  }

  function spawnBackgroundEffects() {
    for (let i = 0; i < 18; i++) {
      setTimeout(createFloatingHeart, i * 180);
    }

    setInterval(createFloatingHeart, 1200);
    setInterval(createSparkle, 500);
  }

  function moveNoButton() {
    if (!noBtn || noMoveCooldown) return;

    noMoveCooldown = true;

    const padding = 20;
    const btnRect = noBtn.getBoundingClientRect();
    const maxX = window.innerWidth - btnRect.width - padding;
    const maxY = window.innerHeight - btnRect.height - padding;

    let x = randomBetween(padding, Math.max(padding + 1, maxX));
    let y = randomBetween(padding, Math.max(padding + 1, maxY));

    const safeTop = window.innerHeight * 0.35;
    if (y < safeTop) y = safeTop + randomBetween(0, 120);

    noBtn.style.position = "fixed";
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.zIndex = "999";

    setTimeout(() => {
      noMoveCooldown = false;
    }, 250);
  }

  function burstConfetti() {
    resizeCanvas();
    confettiPieces = [];

    const colors = ["#ff6fa5", "#ffd166", "#ffffff", "#b5f1ff", "#ff8fab"];

    for (let i = 0; i < 180; i++) {
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height * 0.35,
        vx: randomBetween(-4, 4),
        vy: randomBetween(-8, -1),
        g: randomBetween(0.12, 0.22),
        size: randomBetween(5, 10),
        rot: randomBetween(0, Math.PI * 2),
        vr: randomBetween(-0.15, 0.15),
        color: colors[Math.floor(Math.random() * colors.length)],
        life: randomBetween(80, 140)
      });
    }

    if (!confettiRunning) {
      confettiRunning = true;
      animateConfetti();
    }
  }

  function drawConfettiPiece(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle
