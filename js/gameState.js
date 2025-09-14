// gameState.js
import { resetPlayer } from "./player.js";
import { canvas } from "./dom.js";
import { resetFoods } from "./foods.js"; // フルーツリセット関数をインポート

// =======================
// ゲーム状態とタイマー
export let gameState = "ready"; // "ready" | "playing" | "gameover"
export let gameStartTime = 0;
export let timeLeft = 60;

// =======================
// ゲーム状態をセット
/**
 * ゲーム状態を変更
 * @param {string} state - "ready" | "playing" | "gameover"
 */
export function setGameState(state) {
  gameState = state;
}

// =======================
// ゲームリセット
/**
 * ゲームをリセット
 * - プレイヤーを初期位置に戻す
 * - 落ちているフルーツをリセット
 * - タイマーをリセット
 * - ゲーム状態を "playing" に
 */
export function resetGame() {
  gameState = "playing";
  gameStartTime = Date.now(); // ゲーム開始時刻をセット
  timeLeft = 60;

  resetPlayer(canvas); // プレイヤーを下中央に初期化
  resetFoods(); // フルーツ配列をリセット
}

// =======================
// 経過時間取得
/**
 * ゲーム開始からの経過時間を秒で取得
 * @returns {number} 経過秒数
 */
export function getElapsedTime() {
  if (!gameStartTime) return 0;
  return Math.floor((Date.now() - gameStartTime) / 1000);
}
