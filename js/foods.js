// =======================
// グローバル配列
export const foods = [];

// =======================
// 各フードデータ
export const foodData = [
  { speed: 5, char: "🍇", size: 40, isDamage: true },
  { speed: 2, char: "🌰", size: 45, isDamage: true },
  { speed: 3, char: "🍄", size: 60, isDamage: true },
  { speed: 4, char: "🐟", size: 65, isDamage: true },
];

const sweetPotatoData = { speed: 4, char: "🍠", size: 68, isDamage: true };
const appleData = { speed: 7, char: "🍎", size: 75, isDamage: true };
const bikiniData = { speed: 3, char: "👙", size: 50, isDamage: false }; // 無害フード（光らない）
const pumpkinPieData = { speed: 2, char: "🥧", size: 80, isDamage: true }; // パンプキンパイ、大きめ遅め
const absurdData = {
  speed: 2,
  char: "世の理不尽",
  size: 80,
  isDamage: true,
}; // ごく僅か

// =======================
// 基底クラス（光るフード）
class Food {
  constructor(data, canvas, elapsedSeconds) {
    this.char = data.char;
    this.speed = data.speed;
    this.width = data.size;
    this.height = data.size;
    this.x = Math.random() * Math.max(0, canvas.width - this.width);
    this.y = -this.height;
    this.glowPhase = Math.random() * Math.PI * 2;
    this.isDamage = data.isDamage !== undefined ? data.isDamage : true;

    // 30秒経過後に揺れる
    if (elapsedSeconds >= 30) {
      this.swayPhase = Math.random() * Math.PI * 2;
      this.swayAmplitude = 10;
    } else {
      this.swayPhase = 0;
      this.swayAmplitude = 0;
    }
  }

  move() {
    this.y += this.speed;
    if (this.swayAmplitude > 0) {
      this.x += Math.sin(this.swayPhase) * 0.5; // ゆらゆら
      this.swayPhase += 0.05;
    }
  }

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

    // 光る演出
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
// ビキニクラス（光らない）
class BikiniFood {
  constructor(data, canvas) {
    this.char = data.char;
    this.speed = data.speed;
    this.width = data.size;
    this.height = data.size;
    this.x = Math.random() * Math.max(0, canvas.width - this.width);
    this.y = -this.height;
    this.isDamage = data.isDamage !== undefined ? data.isDamage : false;
  }

  move() {
    this.y += this.speed;
  }

  draw(ctx) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const fontSize = Math.floor(this.width * 0.8);

    ctx.save();
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white"; // 光なし
    ctx.fillText(this.char, cx, cy);
    ctx.restore();
  }
}

// =======================
// 特殊フードクラス（光るフード）
class SpecialFood extends Food {
  constructor(data, canvas, elapsedSeconds) {
    super(data, canvas, elapsedSeconds);
  }
}

// =======================
// フード生成
export function spawnFood(canvas, elapsedSeconds) {
  let spawnAmount = 2;
  if (elapsedSeconds >= 65) spawnAmount = 5;
  else if (elapsedSeconds >= 50) spawnAmount = 4;
  else if (elapsedSeconds >= 30) spawnAmount = 3;

  for (let i = 0; i < spawnAmount; i++) {
    let food;

    if (Math.random() < 0.005) {
      food = new SpecialFood(absurdData, canvas, elapsedSeconds);
    } else if (elapsedSeconds >= 20 && Math.random() < 0.1) {
      food = new SpecialFood(pumpkinPieData, canvas, elapsedSeconds); // パンプキンパイ🥧
    } else if (elapsedSeconds >= 20 && Math.random() < 0.05) {
      food = new BikiniFood(bikiniData, canvas); // 光らないビキニ
    } else if (elapsedSeconds >= 53 && Math.random() < 0.15) {
      food = new SpecialFood(appleData, canvas, elapsedSeconds);
    } else if (elapsedSeconds >= 25 && Math.random() < 0.25) {
      food = new SpecialFood(sweetPotatoData, canvas, elapsedSeconds);
    } else {
      const data = foodData[Math.floor(Math.random() * foodData.length)];
      food = new Food(data, canvas, elapsedSeconds);
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
// フード移動
export function moveFoods() {
  foods.forEach((food) => food.move());
}

// =======================
// 衝突判定
export function checkCollision(player, foods) {
  foods.forEach((food) => {
    if (!food.isDamage) return; // 無害フードは無視

    if (
      player.x < food.x + food.width &&
      player.x + player.width > food.x &&
      player.y < food.y + food.height &&
      player.y + player.height > food.y
    ) {
      if (player.hp !== undefined) player.hp -= 1;
      foods.splice(foods.indexOf(food), 1);
    }
  });
}

// =======================
// リセット（全フード消去）
export function resetFoods() {
  foods.length = 0;
}
