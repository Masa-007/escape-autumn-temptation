import { canvas, startBtn, bgmToggleBtn } from "./dom.js";
import { resetGame, setGameState, getElapsedTime } from "./gameState.js";
import { draw, setImages, gameLoop, stopGameLoop } from "./gameLoop.js";
import { bgms, bgmIndex, toggleBgm } from "./bgm.js";
import { player } from "./player.js";

// ゲームオーバーバナー要素
const gameOverEl = document.getElementById("gameOver");
const resultTextEl = document.getElementById("resultText");
const restartBtn = document.getElementById("restartBtn");
const shareXLink = document.getElementById("shareX");

// ======================
// コメント生成関数
function getComment(elapsed) {
  if (elapsed < 10) return "[もはや食事に来たヤツ級!!]<br>むにゃむにゃ。栗ご飯もう食べられないぜ・・";
  if (elapsed < 30) return "[イメトレ級!]<br>天の声<br>しっかりせい!!<br>焼き芋くわえたまま気絶しとるぞ!！";
  if (elapsed < 40) return "[妄想プロ級!]<br>天の声<br>運ゲー??<br>運は実力でもぎ取るもんじゃよ??<br>果物だけにのｯ!!";
  if (elapsed < 50) return "[インハイ級!!]<br>不覚!!<br>志半ばで,りんごに手を出してしまうとはｯ!!";
  if (elapsed < 60) return "[天の声級!!!]<br>極みまであと一歩！!<br>ワシもあの時キノコに手を出さなければのう・・・<br>";
  return "[全知全能の神級!!!]<br>天の声<br>なんとッ!!運命を覆しお主こそが新たなAKIじゃ!!<br>もしや裏コマンドに気付いたわけではあるまいな?";
}

// =======================
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
        setImages(playerImg, waterfallImg);
        resetPlayer();
        draw();
      }
    };
  });

  startBtn.addEventListener("click", startGame);
  bgmToggleBtn.addEventListener("click", toggleBgm);
  restartBtn.addEventListener("click", () => {
    hideGameOver();
    startGame();
  });

  shareXLink.addEventListener("click", (e) => {
    e.preventDefault();
    const elapsed = getElapsedTime(); // ゲーム開始からの秒数を正確に取得
    const comment = getComment(elapsed);
    const text = encodeURIComponent(
      `私は「EAT」で${elapsed}秒生き延びました！${comment} #EATGame`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  });
}

// =======================
function resetPlayer() {
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - player.height;
  player.vy = 0;
  player.isJumping = false;
  player.angle = 0;
  player.isRotating = false;
  player.targetAngle = 0;
}

// =======================
function startGame() {
  stopGameLoop();
  resetGame();
  setGameState("playing");
  hideGameOver();
  resetPlayer();
  gameLoop();

  if (bgms.length > 0 && bgmIndex < bgms.length) {
    bgms[bgmIndex].play().catch(() => {});
  }
}

// =======================
// ゲームオーバー表示
let finalElapsed = 0; // ゲームオーバー時の経過時間を保持

export function showGameOver() {
  stopGameLoop();
  setGameState("gameover");

  // ゲームが止まった直後の経過時間を固定
  finalElapsed = getElapsedTime();
  const comment = getComment(finalElapsed);

  resultTextEl.innerHTML = `耐久時間: ${finalElapsed}秒<br><span style="font-size:18px; color:#ffcc00;">${comment}</span>`;
  gameOverEl.style.display = "block";

  shareXLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `私は「EAT」で${finalElapsed}秒耐えました！${comment} #EATGame`
  )}`;
}

// X共有時
shareXLink.addEventListener("click", (e) => {
  e.preventDefault();
  const elapsed = finalElapsed; // ゲームオーバー時の時間を使う
  const comment = getComment(elapsed);
  const text = encodeURIComponent(
    `私は「EAT」で${elapsed}秒耐えました！${comment} #EAT #escapeautumntemptation #RUNTEQ #ミニアプリweek`
  );
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

// =======================
function hideGameOver() {
  gameOverEl.style.display = "none";
}
