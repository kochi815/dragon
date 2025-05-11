// script.js

// --- HTML要素の取得 ---
// (前回と同じなので省略)
const questionTextElement = document.getElementById('question-text');
const answerInputElement = document.getElementById('answer-input');
const submitAnswerButton = document.getElementById('submit-answer');
const resultTextElement = document.getElementById('result-text');
const dragonImageElement = document.getElementById('dragon-image');
const dragonNameElement = document.getElementById('dragon-name');
const dragonLevelElement = document.getElementById('dragon-level');
const dragonExpElement = document.getElementById('dragon-exp');
const dragonNextExpElement = document.getElementById('dragon-next-exp');

const stageButtons = {
    2: document.getElementById('stage-2'),
    3: document.getElementById('stage-3'),
    4: document.getElementById('stage-4'),
    5: document.getElementById('stage-5'),
    6: document.getElementById('stage-6'),
    7: document.getElementById('stage-7'),
    8: document.getElementById('stage-8'),
    9: document.getElementById('stage-9'),
    all: document.getElementById('stage-all'),
};

// --- ゲームの状態に関する変数 ---
let currentStage = 2;
let currentQuestion = {};

// 【★修正★】ドラゴンの状態を管理するオブジェクト
let dragon = {
    name: "タマゴ",
    level: 1,
    exp: 0,
    nextLevelExp: 10, // 次のレベルアップに必要な経験値 (初期値)
    image: "images/egg.png",
    evolutionStage: 0 // 現在の進化段階
};

// 【★追加★】ドラゴンの進化情報を定義
const evolutionData = [
    { stage: 0, name: "タマゴ", image: "images/egg.png", requiredLevel: 1, nextLevelExpBase: 10 },
    { stage: 1, name: "ベビー ドラゴン", image: "images/dragon_baby.png", requiredLevel: 2, nextLevelExpBase: 15 },
    { stage: 2, name: "チャイルド ドラゴン", image: "images/dragon_child.png", requiredLevel: 5, nextLevelExpBase: 25 },
    { stage: 3, name: "ヤング ドラゴン", image: "images/dragon_young.png", requiredLevel: 10, nextLevelExpBase: 40 },
    { stage: 4, name: "アダルト ドラゴン", image: "images/dragon_adult.png", requiredLevel: 15, nextLevelExpBase: 60 },
    { stage: 5, name: "エルダー ドラゴン", image: "images/dragon_elder.png", requiredLevel: 20, nextLevelExpBase: 100 } // 最終形態
];


// --- 関数 ---

/**
 * ドラゴンのステータス表示を更新する関数
 * (変更なし)
 */
function updateDragonStatusDisplay() {
    dragonNameElement.textContent = dragon.name;
    dragonLevelElement.textContent = dragon.level;
    dragonExpElement.textContent = dragon.exp;
    dragonNextExpElement.textContent = dragon.nextLevelExp;
    dragonImageElement.src = dragon.image;
    dragonImageElement.alt = dragon.name;
}

/**
 * レベルアップ処理を行う関数 【★追加★】
 */
function levelUpDragon() {
    dragon.level++;
    // 経験値は持ち越しにする (現在の経験値 - レベルアップ前の必要経験値)
    // ただし、0未満にはならないようにする
    dragon.exp = Math.max(0, dragon.exp - dragon.nextLevelExp);

    // 新しい進化段階をチェック
    let newEvolution = evolutionData.find(evo => evo.stage === dragon.evolutionStage + 1);
    let didEvolve = false;

    if (newEvolution && dragon.level >= newEvolution.requiredLevel) {
        dragon.evolutionStage = newEvolution.stage;
        dragon.name = newEvolution.name;
        dragon.image = newEvolution.image;
        resultTextElement.textContent = `おめでとう！ ${dragon.name} に進化した！ (レベル ${dragon.level})`;
        resultTextElement.className = 'correct evolution'; // 進化用のスタイルクラス（後でCSSに追加）
        didEvolve = true;
    } else {
        resultTextElement.textContent = `レベルアップ！ ${dragon.name} はレベル ${dragon.level} になった！`;
        resultTextElement.className = 'correct levelup'; // レベルアップ用のスタイルクラス（後でCSSに追加）
    }

    // 次のレベルアップに必要な経験値を設定
    // 現在の進化段階の基準値 * レベルの倍数のような形で少しずつ増やす (調整可能)
    const currentEvoData = evolutionData[dragon.evolutionStage];
    dragon.nextLevelExp = Math.floor(currentEvoData.nextLevelExpBase * (1 + (dragon.level - currentEvoData.requiredLevel) * 0.2));


    updateDragonStatusDisplay();
    return didEvolve; // 進化したかどうかを返す
}


/**
 * 指定された段の掛け算の問題をランダムに生成する関数
 * (変更なし)
 */
function generateQuestion(stage) {
    const num1 = stage;
    const num2 = Math.floor(Math.random() * 9) + 1;
    return {
        num1: num1,
        num2: num2,
        answer: num1 * num2
    };
}

/**
 * 問題を画面に表示する関数
 * (変更なし)
 */
function displayQuestion() {
    currentQuestion = generateQuestion(currentStage);
    questionTextElement.textContent = `${currentQuestion.num1} × ${currentQuestion.num2} = ?`;
    // resultTextElement.textContent = ''; // メッセージがすぐ消えないように、ここではクリアしない
    // resultTextElement.className = '';
    answerInputElement.value = '';
    answerInputElement.focus();
    submitAnswerButton.disabled = false;
    answerInputElement.disabled = false;
}

/**
 * 回答をチェックする関数 【★大幅修正★】
 */
function checkAnswer() {
    const userAnswerText = answerInputElement.value;

    if (userAnswerText.trim() === '') {
        resultTextElement.textContent = "こたえをいれてね！";
        resultTextElement.className = 'incorrect';
        answerInputElement.focus();
        return;
    }
    const userAnswer = parseInt(userAnswerText);
    if (isNaN(userAnswer)) {
        resultTextElement.textContent = "数字をいれてね！";
        resultTextElement.className = 'incorrect';
        answerInputElement.value = '';
        answerInputElement.focus();
        return;
    }

    if (userAnswer === currentQuestion.answer) {
        const expGained = 5; // 1問正解で5経験値獲得
        dragon.exp += expGained;
        resultTextElement.textContent = `せいかい！ +${expGained}けいけんち`;
        resultTextElement.className = 'correct';
        updateDragonStatusDisplay(); // まず現在の経験値を表示

        submitAnswerButton.disabled = true;
        answerInputElement.disabled = true;

        // レベルアップ判定 (複数回レベルアップする可能性も考慮)
        // setTimeoutを使って、レベルアップ/進化のメッセージを見せる時間を確保する
        setTimeout(() => {
            let evolvedThisTurn = false;
            while (dragon.exp >= dragon.nextLevelExp && dragon.evolutionStage < evolutionData.length -1) { // 最終進化後はレベルアップのみ
                if (levelUpDragon()) { // levelUpDragonが進化したらtrueを返す
                    evolvedThisTurn = true;
                }
                // レベルアップ/進化メッセージを表示するために、一度updateDragonStatusDisplayを呼ぶ
                updateDragonStatusDisplay();
                 // もし進化したら、そのメッセージを優先して表示し、ループを一旦抜けるか、
                 // もしくは連続レベルアップのメッセージは上書きされる形になる。
                 // ここではlevelUpDragon内でメッセージ更新しているので、それを待つ。
            }
            // 最終進化後もレベルは上がり続けるが、nextLevelExpの計算は上記ループ外で行う必要がある場合がある。
            // 現在はevolutionDataの最終要素のnextLevelExpBaseを使い続ける。

            // レベルアップや進化がなかった場合でも、経験値は更新されているので表示を更新
            // (levelUpDragonの中で既に呼ばれているので、基本的には不要だが念のため)
            updateDragonStatusDisplay();

            // 新しい問題を表示
            displayQuestion();

        }, evolvedThisTurn ? 2500 : 1000); // 進化したらメッセージを長めに表示

    } else {
        resultTextElement.textContent = `おしい！こたえは ${currentQuestion.answer} でした。もういちどやってみよう！`;
        resultTextElement.className = 'incorrect';
        answerInputElement.focus();
        answerInputElement.select();
    }
}

// --- イベントリスナー ---
// (変更なし)
for (const stageKey in stageButtons) {
    // ... (前回のコードと同じ) ...
    const button = stageButtons[stageKey];
    if (button) {
        button.addEventListener('click', function() {
            if (this.disabled) { return; }
            for (const btnKey in stageButtons) {
                if (stageButtons[btnKey]) { stageButtons[btnKey].classList.remove('active'); }
            }
            this.classList.add('active');
            if (stageKey === 'all') {
                currentStage = 2;
                alert("「ぜんぶの段」はまだ準備中です！");
            } else {
                currentStage = parseInt(stageKey);
            }
            // ステージ変更時はメッセージをクリア
            resultTextElement.textContent = '';
            resultTextElement.className = '';
            displayQuestion();
        });
    }
}
submitAnswerButton.addEventListener('click', checkAnswer);
answerInputElement.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        if (!submitAnswerButton.disabled) { checkAnswer(); }
    }
});

// --- 初期化処理 ---
window.addEventListener('load', () => {
    // 初期進化段階に基づいてドラゴン情報を設定
    const initialEvo = evolutionData.find(evo => evo.stage === dragon.evolutionStage);
    if (initialEvo) {
        dragon.name = initialEvo.name;
        dragon.image = initialEvo.image;
        dragon.level = initialEvo.requiredLevel; // 初期レベルも進化段階に合わせる
        dragon.nextLevelExp = initialEvo.nextLevelExpBase;
    }

    if (stageButtons[2]) {
        stageButtons[2].classList.add('active');
        for (const stageKey in stageButtons) {
            if (stageKey !== "2" && stageButtons[stageKey]) {
                stageButtons[stageKey].classList.remove('active');
            }
        }
    }
    currentStage = 2;
    updateDragonStatusDisplay();
    displayQuestion();
});