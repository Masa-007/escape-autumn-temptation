import { canvas, startBtn, bgmToggleBtn } from "./dom.js";
import { resetGame, setGameState } from "./gameState.js";
import { draw, setImages, gameLoop, stopGameLoop } from "./gameLoop.js";
import { bgms, bgmIndex, toggleBgm } from "./bgm.js";
import { player } from "./player.js";

export function initGame() {
  const playerImg = new Image();
  playerImg.src = "../assets/images/character.png";

  const waterfallImg = new Image();
  waterfallImg.src = "../assets/images/waterfall.png";

  let loadedCount = 0;
  [playerImg, waterfallImg].forEach((img) => {
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 2) {
        // プレイヤーと滝画像をセット、光の粒も初期化
        setImages(playerImg, waterfallImg);

        // プレイヤー初期化
        player.x = canvas.width / 2 - player.width / 2;
        player.y = canvas.height - player.height;
        player.vy = 0;
        player.isJumping = false;
        player.angle = 0;
        player.isRotating = false;
        player.targetAngle = 0;

        // スタート前描画（粒も描画される）
        draw();
      }
    };
  });

  // スタートボタン
  startBtn.addEventListener("click", () => {
    stopGameLoop();
    resetGame();
    setGameState("playing");
    gameLoop();

    // BGM再生
    if (bgms.length > 0 && bgmIndex < bgms.length) {
      bgms[bgmIndex].play().catch(() => {});
    }
  });

  // BGM切替
  bgmToggleBtn.addEventListener("click", toggleBgm);
}
