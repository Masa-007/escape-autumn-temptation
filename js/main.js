import { canvas, startBtn, bgmToggleBtn } from "./dom.js";
import {
  resetGame,
  setGameState,
  getGameState,
  getElapsedTime,
} from "./gameState.js";
import { draw, setImages, gameLoop, stopGameLoop } from "./gameLoop.js";
import { bgms, bgmIndex, toggleBgm } from "./bgm.js";
import {
  resetPlayer,
  touchStartHandler,
  touchMoveHandler,
  touchEndHandler,
} from "./player.js";

// ゲームオーバー要素
const gameOverEl = document.getElementById("gameOver");
const resultTextEl = document.getElementById("resultText");
const restartBtn = document.getElementById("restartBtn");
const shareXLink = document.getElementById("shareX");
const viewEndingBtn = document.getElementById("viewEndingBtn");

let finalElapsed = 0;

function getComment(elapsed) {
  if (elapsed < 10)
    return "[もはや食事に来たヤツ級!!]<br>むにゃむにゃ。栗ご飯もう食べられないぜ・・🍚";
  if (elapsed < 20)
    return "[なんだコイツ!?]<br>👀<br>👃<br>👄<br>誰かが仲間になりたそうな顔でこちらもみている";
  if (elapsed < 30)
    return "[イメトレ級!]<br>天の声<br>しっかりせい!!<br>焼き芋くわえたまま気絶しとるぞ!！🍠";
  if (elapsed < 40)
    return "[妄想プロ級!]<br>天の声<br>運ゲー??<br>運は実力でもぎ取るもんじゃよ??<br>果物だけにのｯ!!🍇";
  if (elapsed < 50)
    return "[インハイ級!!]<br>不覚!!<br>志半ばでりんごに手を出してしまうとはｯ!!🍎";
  if (elapsed < 60)
    return "[天の声級!!!]<br>極みまであと一歩！!<br>ワシもあの時キノコに手を出さなければのう・・・🍄<br>";
  return "[全知全能の神級!!!]<br>天の声<br>なんとッ!!運命を覆したじゃと!!<br>お主こそ真の求道者じゃ!!<br>もしや裏コマンドに気付いたわけではあるまいな?👀";
}

export function startGame() {
  stopGameLoop();
  resetGame();
  setGameState("playing");
  hideGameOver();
  gameLoop();

  if (bgms.length > 0 && bgmIndex < bgms.length) {
    bgms[bgmIndex].play().catch(() => {});
  }
}

export function showGameOver() {
  stopGameLoop();
  setGameState("gameover");
  finalElapsed = getElapsedTime();

  const comment = getComment(finalElapsed);
  resultTextEl.innerHTML = `耐久時間: ${finalElapsed}秒<br><span style="font-size:18px; color:#ffcc00;">${comment}</span>`;
  gameOverEl.style.display = "block";

  if (finalElapsed >= 60) {
    viewEndingBtn.style.display = "inline-block";
    shareXLink.style.display = "none";
  } else {
    viewEndingBtn.style.display = "none";
    shareXLink.style.display = "inline-block";
  }
}

function hideGameOver() {
  gameOverEl.style.display = "none";
  shareXLink.style.display = "none";
  viewEndingBtn.style.display = "none";
}

export function restartGame() {
  hideGameOver();
  startGame();
}

export function initGame() {
  const playerImg = new Image();
  playerImg.src = "./assets/images/character.png";
  const waterfallImg = new Image();
  waterfallImg.src = "./assets/images/waterfall.png";

  let loadedCount = 0;
  [playerImg, waterfallImg].forEach((img) => {
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setImages(playerImg, waterfallImg);
        resetPlayer(canvas); // スタート前に下中央に配置
        draw(); // 描画
      }
    };
  });

  // ボタン操作
  startBtn.addEventListener("click", startGame);
  bgmToggleBtn.addEventListener("click", toggleBgm);
  restartBtn.addEventListener("click", restartGame);

  // キーボード操作
  document.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      const state = getGameState();
      if (state === "ready") startGame();
      else if (state === "gameover") restartGame();
    }
  });

  // タッチ操作（スマホ対応）
  canvas.addEventListener("touchstart", (e) => touchStartHandler(e, canvas));
  canvas.addEventListener("touchmove", (e) => touchMoveHandler(e, canvas));
  canvas.addEventListener("touchend", (e) => touchEndHandler(e, canvas));

  // Xシェア
  shareXLink.addEventListener("click", (e) => {
    e.preventDefault();
    const comment = getComment(finalElapsed);

    // 「なんだコイツ!?」の場合だけ改行文字 \n に置換
    let plainComment;
    if (comment.startsWith("[なんだコイツ!?]")) {
      plainComment = comment.replace(/<br>/g, "\n");
    } else {
      // それ以外は改行を削除して一行で表示
      plainComment = comment.replace(/<br>/g, "");
    }

    const text = encodeURIComponent(
      `私は「EAT」で${finalElapsed}秒耐えました！${plainComment} #EAT #escapeautumntemptation #RUNTEQ #ミニアプリ https://masa-007.github.io/escape-autumn-temptation/`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  });

  viewEndingBtn.addEventListener("click", () => {
    window.location.href = "clear.html";
  });
}
