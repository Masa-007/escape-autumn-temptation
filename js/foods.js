export const foods = [];

export const foodData = [
  { speed: 2, char: "🌰" },
  { speed: 3, char: "🍎" },
  { speed: 4, char: "🐠" },
  { speed: 5, char: "🍇" },
  { speed: 4, char: "🐟" },
  { speed: 6, char: "🥜" }, // ピーナッツ
  { speed: 3, char: "🍄" },
];

let spawnCounter = 0;

/**
 * フルーツを生成
 * 落下速度は固定
 * 時間経過に応じて生成量を増やす
 * 🥜 は 30 秒以降にのみ出現
 */
export function spawnFood(canvas, elapsedSeconds) {
  // 経過時間に応じて生成量を変化
  let spawnAmount = 2;
  if (elapsedSeconds >= 30) {
    spawnAmount = 4;
  } else if (elapsedSeconds >= 10) {
    spawnAmount = 3;
  }

  for (let i = 0; i < spawnAmount; i++) {
    // 出現可能なフルーツを絞る
    const availableFood = foodData.filter(
      (f) => f.char !== "🥜" || elapsedSeconds >= 30
    );
    const data =
      availableFood[Math.floor(Math.random() * availableFood.length)];

    const size = 40 + Math.random() * 40;

    foods.push({
      x: Math.random() * (canvas.width - size),
      y: -size,
      speed: data.speed, // 固定速度
      char: data.char,
      width: size,
      height: size,
    });
  }
}

/**
 * すべてのフルーツをリセット
 * ・生成カウンターもリセット
 */
export function resetFoods() {
  foods.length = 0;
  spawnCounter = 0;
}
