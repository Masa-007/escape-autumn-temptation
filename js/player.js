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
  rotationSpeed: 0.2,

  startX: 0,
  startY: 0,
  jumpCount: 0,
  maxJumpCount: 15,
  isInvincible: false,
  isGlowing: false,
  isDebugInvincible: false,
  movedBeforeJump: false,
};

export const keys = { left: false, right: false, up: false, down: false };
let touchStartY = 0;

// キーボード入力
export function handleInput(e, isDown) {
  switch (e.code) {
    case "ArrowLeft":
      keys.left = isDown;
      if (isDown && !player.isJumping) player.movedBeforeJump = true;
      break;
    case "ArrowRight":
      keys.right = isDown;
      if (isDown && !player.isJumping) player.movedBeforeJump = true;
      break;
    case "ArrowUp":
    case "Space":
      keys.up = isDown;
      break;
    case "ArrowDown":
      keys.down = isDown;
      break;
  }
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
      e.code
    )
  )
    e.preventDefault();
}

// 初期位置にリセット
export function resetPlayer(canvas) {
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - player.height;
  player.vy = 0;
  player.isJumping = false;
  player.angle = 0;
  player.isRotating = false;

  player.startX = player.x;
  player.startY = player.y;
  player.jumpCount = 0;
  player.isInvincible = false;
  player.isGlowing = false;
  player.isDebugInvincible = false;
  player.movedBeforeJump = false;
}

// プレイヤー移動
export function movePlayer(gravity = 0.5, jumpPower = 12, canvas) {
  let moved = false;

  if (keys.left) {
    player.x -= player.speed;
    moved = true;
  }
  if (keys.right) {
    player.x += player.speed;
    moved = true;
  }

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;

  // ジャンプ処理
  if (keys.up && !player.isJumping) {
    player.vy = -jumpPower;
    player.isJumping = true;

    if (!player.movedBeforeJump) {
      player.jumpCount++;
      if (player.jumpCount >= player.maxJumpCount) {
        player.isInvincible = true;
        player.isGlowing = true;
      }
    }
  }

  if (player.isInvincible && moved) {
    player.isInvincible = false;
    player.isGlowing = false;
  }

  if (keys.down && !player.isRotating) {
    player.isRotating = true;
    player.targetAngle += 2 * Math.PI;
  }

  player.vy += gravity;
  player.y += player.vy;

  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.vy = 0;
    player.isJumping = false;
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

// タッチ開始
export function touchStartHandler(e, canvas) {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  if (
    x >= player.x &&
    x <= player.x + player.width &&
    y >= player.y &&
    y <= player.y + player.height &&
    !player.isJumping
  ) {
    player.vy = -12;
    player.isJumping = true;

    if (!player.movedBeforeJump) {
      player.jumpCount++;
      if (player.jumpCount >= player.maxJumpCount) {
        player.isInvincible = true;
        player.isGlowing = true;
      }
    }
  }

  touchStartY = y;
}

// タッチ移動（空中では横移動不可）
export function touchMoveHandler(e, canvas) {
  e.preventDefault();
  if (player.isJumping) return; // 空中は固定

  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;

  const moved = player.x !== x - player.width / 2;
  player.x = x - player.width / 2;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;

  if (moved) player.movedBeforeJump = true;

  if (player.isInvincible && moved) {
    player.isInvincible = false;
    player.isGlowing = false;
  }
}

// タッチ終了
export function touchEndHandler(e, canvas) {
  const touch = e.changedTouches[0];
  const rect = canvas.getBoundingClientRect();
  const endY = touch.clientY - rect.top;

  if (endY - touchStartY > 30 && !player.isRotating) {
    player.isRotating = true;
    player.targetAngle += 2 * Math.PI;
  }
}

