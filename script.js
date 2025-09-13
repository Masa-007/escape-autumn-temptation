// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// DOM
const startBtn = document.getElementById("startBtn");
const gameOverEl = document.getElementById("gameOver");
const survivalTimeEl = document.getElementById("survivalTime");
const timerEl = document.getElementById("timer");

// ゲーム状態
let gameState = "ready"; // ready, playing, over
let timeLeft = 60;
let gameStartTime = 0;

// プレイヤー（アイコンを2倍サイズ）
const player = {
  x: canvas.width / 2,
  y: canvas.height - 80,
  width: 80,
  height: 60,
  speed: 10,
  icon: "🏃",
};

// 障害物（秋の味覚と固定速度）
const foods = [];
const foodData = [
  { icon: "🍠", speed: 2 },
  { icon: "🌰", speed: 3 },
  { icon: "🎃", speed: 4 },
  { icon: "🍮", speed: 2.5 },
  { icon: "🐟", speed: 1.5 },
  { icon: "🥜", speed: 6.5 },
];

// 障害物生成
function spawnFood() {
  const data = foodData[Math.floor(Math.random() * foodData.length)];
  const food = {
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 30,
    height: 30,
    speed: data.speed,
    icon: data.icon,
  };
  foods.push(food);
}

// 衝突判定（内側にマージン）
function checkCollision() {
  const marginX = 20;
  const marginY = 15;

  for (let food of foods) {
    if (
      player.x + marginX < food.x + food.width &&
      player.x + player.width - marginX > food.x &&
      player.y + marginY < food.y + food.height &&
      player.y + player.height - marginY > food.y
    ) {
      gameState = "over";
      gameOverEl.style.display = "block";
      survivalTimeEl.innerText = 60 - timeLeft + "秒";
    }
  }
}

// 描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー描画
  ctx.font = "60px Arial";
  ctx.fillText(player.icon, player.x, player.y + 50);

  // 障害物描画
  foods.forEach((food) => {
    food.y += food.speed;
    ctx.font = "30px Arial";
    ctx.fillText(food.icon, food.x, food.y + food.height);
  });
}

// 更新
function update() {
  const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
  timeLeft = Math.max(0, 60 - elapsed);
  timerEl.innerText = timeLeft + "秒";

  checkCollision();

  if (timeLeft <= 0 && gameState === "playing") {
    gameState = "over";
    gameOverEl.style.display = "block";
    survivalTimeEl.innerText = "60秒";
  }
}

// ゲームループ
function gameLoop() {
  if (gameState === "playing") {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}

// キーボード操作
document.addEventListener("keydown", (e) => {
  if (gameState !== "playing") return;
  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
});

// スタートボタン
startBtn.addEventListener("click", () => {
  gameState = "playing";
  gameStartTime = Date.now();
  timeLeft = 60;
  foods.length = 0;
  player.x = canvas.width / 2;
  gameOverEl.style.display = "none";
});

// 障害物自動生成（時間経過で増加）
setInterval(() => {
  if (gameState !== "playing") return;

  const elapsed = (Date.now() - gameStartTime) / 1000;

  // 10秒ごとに1個ずつ増える（最大5個まで）
  let spawnCount = Math.min(5, 1 + Math.floor(elapsed / 10));

  for (let i = 0; i < spawnCount; i++) {
    spawnFood();
  }
}, 1000);

// ゲーム開始
gameLoop();
