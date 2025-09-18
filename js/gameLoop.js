// gameLoop.js
import { ctx, canvas, timerEl } from "./dom.js";
import { gameState, gameStartTime } from "./gameState.js";
import { player, handleInput, movePlayer, resetPlayer } from "./player.js";
import { foods, spawnFood, drawFoods } from "./foods.js";
import { showGameOver } from "./main.js";
import {
  initWaterfall,
  drawWaterfall,
  setWaterfallImage as setWFImage,
} from "./waterfall.js";

let playerImg;
let foodSpawnCounter = 0;
let loopId;
let currentTimeLeft = 60;

// --- キーイベント ---
window.addEventListener("keydown", (e) => handleInput(e, true));
window.addEventListener("keyup", (e) => handleInput(e, false));

// --- プレイヤー初期化 ---
export function initPlayer() {
  resetPlayer(canvas);
}

// --- プレイヤー画像セット ---
export function setPlayerImage(img) {
  playerImg = img;
}

// --- 画像セットまとめ ---
export function setImages(pImg, wImg) {
  setPlayerImage(pImg);
  setWFImage(wImg); // waterfall.js に画像セット
  initWaterfall(); // 粒初期化
  initPlayer();
}

// --- 描画 ---
export function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawWaterfall(); // waterfall.js の描画
  drawFoods(ctx); // フード描画

  if (playerImg) {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(player.angle);

    ctx.shadowColor =
      player.isInvincible && player.isGlowing ? "yellow" : "transparent";
    ctx.shadowBlur = player.isInvincible && player.isGlowing ? 20 : 0;

    ctx.drawImage(
      playerImg,
      -player.width / 2,
      -player.height / 2,
      player.width,
      player.height
    );
    ctx.restore();
  }

  timerEl.textContent = `${currentTimeLeft}秒`;
}

// --- 更新 ---
export function update() {
  if (gameState !== "playing") return;

  const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
  currentTimeLeft = Math.max(60 - elapsed, 0);

  if (currentTimeLeft <= 0) {
    showGameOver();
    return;
  }

  movePlayer(0.5, 12, canvas);

  foodSpawnCounter++;
  if (foodSpawnCounter > 60) {
    spawnFood(canvas, elapsed);
    foodSpawnCounter = 0;
  }

  // 当たり判定（平方距離）
  for (let i = foods.length - 1; i >= 0; i--) {
    const food = foods[i];
    food.move();

    const dx = player.x + player.width * 0.25 - (food.x + food.width * 0.2);
    const dy =
      (player.y + player.height * 0.175 - (food.y + food.height * 0.2)) *
      (0.5 / 0.35);
    const distSq = dx * dx + dy * dy;
    const radiusSum = player.width * 0.25 + food.width * 0.2;

    if (
      distSq < radiusSum * radiusSum &&
      !player.isInvincible &&
      food.isDamage
    ) {
      showGameOver();
      break;
    }

    if (food.y > canvas.height) foods.splice(i, 1);
  }
}

// --- ゲームループ ---
export function gameLoop() {
  if (loopId) cancelAnimationFrame(loopId);
  const loop = () => {
    update();
    draw();
    loopId = requestAnimationFrame(loop);
  };
  loop();
}

// --- ゲームループ停止 ---
export function stopGameLoop() {
  if (loopId) cancelAnimationFrame(loopId);
}

// 開始 
export function startGameLoop() {
  initPlayer();
  gameLoop();
}
