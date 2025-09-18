import { resetPlayer } from "./player.js";
import { canvas } from "./dom.js";
import { resetFoods } from "./foods.js"; // フルーツリセット関数をインポート

// ゲーム状態とタイマー
export let gameState = "ready"; // "ready" | "playing" | "gameover"
export let gameStartTime = 0; // ゲーム開始時刻（ミリ秒）
export let timeLeft = 60; // 残り時間（秒）

// ゲーム状態操作関数

/**
 * ゲーム状態を変更
 * @param {string} state - "ready" | "playing" | "gameover"
 */
export function setGameState(state) {
  gameState = state;
}

/**
 * 現在のゲーム状態を取得
 * @returns {string} ゲーム状態
 */
export function getGameState() {
  return gameState;
}

// ゲームリセット

export function resetGame() {
  gameState = "playing";
  gameStartTime = Date.now(); // ゲーム開始時刻をセット
  timeLeft = 60;

  resetPlayer(canvas); // プレイヤーを下中央に初期化
  resetFoods(); // フルーツ配列をリセット
}

/**
 * ゲーム開始からの経過時間を秒で取得
 * @returns {number} 経過秒数
 */
export function getElapsedTime() {
  if (!gameStartTime) return 0;
  return Math.floor((Date.now() - gameStartTime) / 1000);
}
