<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🍂 Escape Autumn Temptation</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="game-container">
        <!-- ゲームタイトル -->
        <header class="game-header">
            <h1>🍂 秋の誘惑から逃げろ！ 🍂</h1>
        </header>
        
        <!-- ゲーム情報表示 -->
        <div class="game-info">
            <div class="score">スコア: <span id="score">0</span></div>
            <div class="timer">残り時間: <span id="timer">60</span>秒</div>
        </div>
        
        <!-- メインゲーム画面（Canvas使用） -->
        <main class="game-area">
            <canvas id="gameCanvas" width="800" height="600"></canvas>
        </main>
        
        <!-- ゲーム操作ボタン -->
        <div class="game-controls">
            <button id="startBtn" class="btn btn-primary">ゲーム開始</button>
            <button id="pauseBtn" class="btn btn-secondary" disabled>一時停止</button>
            <button id="resetBtn" class="btn btn-danger">リセット</button>
        </div>
        
        <!-- ゲーム説明 -->
        <div class="game-instructions">
            <h2>遊び方</h2>
            <ul>
                <li>🎯 矢印キーでプレイヤーを移動</li>
                <li>⚠️ 食べ物に触れた瞬間ゲームオーバー！</li>
                <li>⏰ 制限時間内に生き延びよう</li>
                <li>💀 一撃必殺！慎重に動こう</li>
            </ul>
        </div>
        
        <!-- ゲーム終了画面 -->
        <div class="game-over" id="gameOver" style="display: none;">
            <h2>ゲーム終了！</h2>
            <p>生存時間: <span id="survivalTime">0</span>秒</p>
            <p>最終スコア: <span id="finalScore">0</span></p>
            <button id="restartBtn" class="btn btn-primary">もう一度挑戦</button>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
🎨 2. style.css（基本スタイル）
/* リセットCSS */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #ff9a56, #ff6b35);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.game-container {
    background: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 900px;
    width: 100%;
}

.game-header h1 {
    color: #ff6b35;
    margin-bottom: 20px;
    font-size: 2rem;
}

.game-info {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    background: #f8f9fa;
    padding: 10px;
    border-radius: 10px;
}

.game-info div {
    font-weight: bold;
    color: #333;
}

.game-area {
    margin: 20px 0;
    display: flex;
    justify-content: center;
}

#gameCanvas {
    border: 3px solid #ff6b35;
    border-radius: 10px;
    background: #87CEEB;
}

.game-controls {
    margin: 20px 0;
}

.btn {
    padding: 10px 20px;
    margin: 0 10px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-primary {
    background: #28a745;
    color: white;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-danger {
    background: #dc3545;
    color: white;
}

.btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.game-instructions {
    text-align: left;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
    margin: 20px 0;
}

.game-instructions h2 {
    color: #ff6b35;
    margin-bottom: 10px;
}

.game-instructions ul {
    list-style-position: inside;
}

.game-instructions li {
    margin: 5px 0;
}

.game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
    #gameCanvas {
        width: 100%;
        height: auto;
    }
    
    .game-info {
        flex-direction: column;
        gap: 10px;
    }
    
    .game-header h1 {
        font-size: 1.5rem;
    }
}
🎮 3. script.js（基本構造）
// ゲーム状態管理
let gameState = 'ready'; // ready, playing, paused, over
let score = 0;
let timeLeft = 60;
let gameStartTime = 0;

// Canvas要素とコンテキスト
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// プレイヤーオブジェクト
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    speed: 5,
