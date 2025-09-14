export const foods = [];

// =======================
// 各フードごとに固定サイズを設定（小さい順に並べ替え）
// speed: 落下速度, char: 絵文字, size: サイズ(px)
export const foodData = [
  { speed: 5, char: "🥜", size: 40 },
  { speed: 2, char: "🌰", size: 55 },
  { speed: 3, char: "🍄", size: 60 },
  { speed: 4, char: "🐟", size: 65 },
];

const sweetPotatoData = { speed: 4, char: "🍠", size: 70 };
const appleData = { speed: 7, char: "🍎", size: 75 };

// =======================
// 基底クラス（全てのフードがピンク光で妖艶に光る）
class Food {
  constructor(data, canvas) {
    this.char = data.char;
    this.speed = data.speed;
    this.width = data.size;
    this.height = data.size;
    this.x = Math.random() * Math.max(0, canvas.width - this.width);
    this.y = -this.height;
    this.glowPhase = Math.random() * Math.PI * 2; // 光の位相をランダム化
  }

  // 落下
  move() {
    this.y += this.speed;
  }

  // 描画
  draw(ctx) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const fontSize = Math.floor(this.width * 0.8);

    const glowOffset = Math.sin(this.glowPhase) * 2;
    this.glowPhase += 0.1;

    ctx.save();
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // ピンクの妖艶な光
    ctx.shadowColor = "#FF69B4";
    ctx.shadowBlur = 8 + glowOffset;
    ctx.lineWidth = 2;

    ctx.strokeStyle = "#FF69B4";
    ctx.strokeText(this.char, cx, cy);
    ctx.fillStyle = "white";
    ctx.fillText(this.char, cx, cy);

    ctx.restore();
  }
}

// =======================
// 特殊フードクラス（出現タイミング制御）
class SpecialFood extends Food {
  constructor(data, canvas) {
    super(data, canvas);
  }
}

// =======================
// フード生成
export function spawnFood(canvas, elapsedSeconds) {
  // 経過時間によって一度に落とす量を調整（序盤から少し多め）
  let spawnAmount = 2; // デフォルト2個
  if (elapsedSeconds >= 60) spawnAmount = 5;
  else if (elapsedSeconds >= 40) spawnAmount = 4;
  else if (elapsedSeconds >= 20) spawnAmount = 3;

  for (let i = 0; i < spawnAmount; i++) {
    let food;

    // 30秒以降にりんご出現（確率30%）
    if (elapsedSeconds >= 30 && Math.random() < 0.3) {
      food = new SpecialFood(appleData, canvas);
    }
    // 20秒以降にさつまいも出現（確率30%）
    else if (elapsedSeconds >= 20 && Math.random() < 0.3) {
      food = new SpecialFood(sweetPotatoData, canvas);
    }
    // それ以外は通常フード
    else {
      const data = foodData[Math.floor(Math.random() * foodData.length)];
      food = new Food(data, canvas);
    }

    foods.push(food);
  }
}


// =======================
// フード描画
export function drawFoods(ctx) {
  foods.forEach((food) => food.draw(ctx));
}

// =======================
// リセット（全フードを消去）
export function resetFoods() {
  foods.length = 0;
}
