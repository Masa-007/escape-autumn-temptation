import { ctx, canvas, timerEl } from "./dom.js";
import {
  gameState,
  setGameState,
  gameStartTime,
} from "./gameState.js";
import { player, handleInput, movePlayer } from "./player.js";
import { foods, spawnFood, drawFoods } from "./foods.js";
import {
  drawWaterfall,
  setWaterfallImage,
  initWaterfall,
} from "./waterfall.js";
import { showGameOver } from "./main.js";

let playerImg; // プレイヤー画像
let foodSpawnCounter = 0;
let loopId;
let currentTimeLeft = 60;

// =======================
// プレイヤー画像セット関数
export function setPlayerImage(img) {
  playerImg = img;
}

// =======================
// 画像をセット（プレイヤー & 滝）
export function setImages(pImg, wImg) {
  setPlayerImage(pImg);
  setWaterfallImage(wImg);
  initWaterfall(); // 光の粒初期化
}

// =======================
// キーイベント
window.addEventListener("keydown", (e) => handleInput(e, true));
window.addEventListener("keyup", (e) => handleInput(e, false));

// =======================
// 描画
export function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 滝描画（背景 + フチ + 光の粒）
  drawWaterfall();

  // 食べ物描画
  drawFoods(ctx);

  // プレイヤー描画
  if (playerImg) {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(player.angle);

    if (player.isInvincible && player.isGlowing) {
      ctx.shadowColor = "yellow";
      ctx.shadowBlur = 20;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.drawImage(
      playerImg,
      -player.width / 2,
      -player.height / 2,
      player.width,
      player.height
    );
    ctx.restore();
  }

  // タイマー
  timerEl.textContent = `${currentTimeLeft}秒`;
}

// =======================
// 更新
export function update() {
  if (gameState !== "playing") return;

  const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
  currentTimeLeft = Math.max(60 - elapsed, 0);

  // タイムアップ
  if (currentTimeLeft <= 0) {
    showGameOver(); // バナー表示
    return;
  }

  // プレイヤー移動
  movePlayer(0.5, -12, canvas);

  // 食べ物生成
  foodSpawnCounter++;
  if (foodSpawnCounter > 60) {
    spawnFood(canvas, elapsed);
    foodSpawnCounter = 0;
  }

  // 食べ物移動と衝突判定
  for (let i = foods.length - 1; i >= 0; i--) {
    const food = foods[i];
    food.move();

    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const foodCenterX = food.x + food.width / 2;
    const foodCenterY = food.y + food.height / 2;

    const playerRadiusX = (player.width / 2) * 0.50;
    const playerRadiusY = (player.height / 2) * 0.35;
    const foodRadiusX = (food.width / 2) * 0.40;
    const foodRadiusY = (food.height / 2) * 0.40;

    const dx = playerCenterX - foodCenterX;
    const dy = (playerCenterY - foodCenterY) * (playerRadiusX / playerRadiusY);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const isColliding = distance < playerRadiusX + foodRadiusX;

    if (isColliding && !player.isInvincible) {
      showGameOver(); // バナー表示
      break;
    }

    // 画面外に出た食べ物を削除
    if (food.y > canvas.height) foods.splice(i, 1);
  }
}

// =======================
// ゲームループ開始
export function gameLoop() {
  if (loopId) cancelAnimationFrame(loopId);
  const loop = () => {
    update();
    draw();
    loopId = requestAnimationFrame(loop);
  };
  loop();
}

// =======================
// ゲームループ停止
export function stopGameLoop() {
  if (loopId) cancelAnimationFrame(loopId);
}
