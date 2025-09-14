// gameState.js
import { resetPlayer } from "./player.js";
import { canvas } from "./dom.js";
import { resetFoods } from "./foods.js"; // フルーツリセット関数をインポート

export let gameState = "ready"; // "ready" | "playing" | "gameover"
export let gameStartTime = 0;
export let timeLeft = 60;

/**
 * ゲーム状態をセット
 * @param {string} state - "ready" | "playing" | "gameover"
 */
export function setGameState(state) {
  gameState = state;
}

/**
 * ゲームをリセット
 * - プレイヤーを初期位置に戻す
 * - 落ちているフルーツをリセット
 * - タイマーをリセット
 * - ゲーム状態を "playing" に
 */
export function resetGame() {
  gameState = "playing";
  gameStartTime = Date.now();
  timeLeft = 60;

  resetPlayer(canvas); // プレイヤーを下中央に初期化
  resetFoods(); // フルーツ配列をリセット
}
