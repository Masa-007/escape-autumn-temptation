export const player = {
  x: 0,
  y: 0,
  width: 80,
  height: 80,
  speed: 3,
  vy: 0,
  isJumping: false,
  angle: 0,
  isRotating: false,
  targetAngle: 0,
  rotationSpeed: 0.1,

  // --- 追加 ---
  jumpCount: 0, // ジャンプ回数カウント
  isInvincible: false, // 
  initialX: 0, // 初期位置X
  initialY: 0, // 初期位置Y
  isGlowing: false, // 光る演出用フラグ
};

export const keys = { left: false, right: false, up: false, down: false };

export function handleInput(e, isDown) {
  if (
    e.code === "ArrowUp" ||
    e.code === "ArrowDown" ||
    e.code === "ArrowLeft" ||
    e.code === "ArrowRight"
  ) {
    e.preventDefault();
  }

  switch (e.code) {
    case "ArrowLeft":
      keys.left = isDown;
      break;
    case "ArrowRight":
      keys.right = isDown;
      break;
    case "ArrowUp":
      keys.up = isDown;
      break;
    case "ArrowDown":
      keys.down = isDown;
      break;
  }
}

export function resetPlayer(canvas) {
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - player.height;
  player.vy = 0;
  player.isJumping = false;
  player.angle = 0;
  player.isRotating = false;
  player.targetAngle = 0;
  keys.left = keys.right = keys.down = keys.up = false;

  
  player.jumpCount = 0;
  player.isInvincible = false;
  player.isGlowing = false;
  player.initialX = player.x;
  player.initialY = player.y;
}

export function movePlayer(gravity, jumpPower, canvas) {
  // 左右移動
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;

  // 動いたら無敵解除
  if (player.isInvincible && Math.abs(player.x - player.initialX) > 0.1) {
    player.isInvincible = false;
    player.isGlowing = false;
    console.log("無敵解除！");
  }

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;

  // ジャンプ
  if (keys.up && !player.isJumping) {
    player.vy = jumpPower;
    player.isJumping = true;
    player.jumpCount++;


    if (player.jumpCount >= 15 && Math.abs(player.x - player.initialX) < 0.1) {
      player.isInvincible = true;
      player.isGlowing = true;
    }
  }

  // 重力
  player.vy += gravity;
  player.y += player.vy;

  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.vy = 0;
    player.isJumping = false;
  }

  // 下キー回転
  if (keys.down && !player.isRotating) {
    player.isRotating = true;
    player.targetAngle = player.angle + 2 * Math.PI;
  }

  if (player.isRotating) {
    const diff = player.targetAngle - player.angle;
    if (Math.abs(diff) < 0.05) {
      player.angle = 0;
      player.isRotating = false;
      player.targetAngle = 0;
    } else {
      player.angle += diff * player.rotationSpeed;
    }
  }
}
