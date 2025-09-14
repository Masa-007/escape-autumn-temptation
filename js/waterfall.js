// waterfall.js
import { ctx, canvas } from "./dom.js";

const particles = [];
const PARTICLE_COUNT = 30;
let frameCount = 0;
let waterfallImg;

// =======================
// プレイヤー画像セット
export function setWaterfallImage(img) {
  waterfallImg = img;
}

// =======================
// 光の粒初期化（画像とは独立）
export function initWaterfall() {
  if (particles.length === 0) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2 + Math.random() * 3,
        alpha: 0.3 + Math.random() * 0.7,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
      });
    }
  }
}

// =======================
// 描画
export function drawWaterfall() {
  frameCount++;

  // 背景滝
  if (waterfallImg) {
    ctx.save();
    ctx.shadowColor = "rgba(255,150,0,0.5)";
    ctx.shadowBlur = 20;
    ctx.drawImage(waterfallImg, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  drawFrameAndParticles();
}

// =======================
// フチと粒描画
function drawFrameAndParticles() {
  const lineWidth = 6;
  const maxOffset = 8;
  const waveOffset = Math.sin(frameCount / 10) * maxOffset;

  ctx.save();
  ctx.strokeStyle = "#aee";
  ctx.lineWidth = lineWidth;
  ctx.shadowColor = "rgba(173,216,230,0.6)";
  ctx.shadowBlur = 12;

  // 上下左右
  ctx.beginPath();
  for (let i = 0; i <= canvas.width; i += 10)
    ctx.lineTo(i, waveOffset * Math.sin(i / 15));
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= canvas.width; i += 10)
    ctx.lineTo(i, canvas.height - waveOffset * Math.sin(i / 15));
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= canvas.height; i += 10)
    ctx.lineTo(waveOffset * Math.sin(i / 15), i);
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= canvas.height; i += 10)
    ctx.lineTo(canvas.width - waveOffset * Math.sin(i / 15), i);
  ctx.stroke();
  ctx.restore();

  // 光の粒
  particles.forEach((p) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    ctx.shadowColor = "rgba(173,216,230,0.7)";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();

    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
}
