// script.js

// --- HTML要素の取得 ---
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

// 【★追加★】ドラゴンの状態を管理するオブジェクト
let dragon = {
    name: "タマゴ",
    level: 1,
    exp: 0,
    nextLevelExp: 10, // 次のレベルアップに必要な経験値
    image: "images/egg.png",
    // 将来の進化段階のための情報 (例: 進化レベル、進化後の名前や画像など)
    // evolutionStage: 0, // 0: タマゴ, 1: ベビー, ...
};

// --- 関数 ---

/**
 * ドラゴンのステータス表示を更新する関数 【★追加★】
 */
function updateDragonStatusDisplay() {
    dragonNameElement.textContent = dragon.name;
    dragonLevelElement.textContent = dragon.level;
    dragonExpElement.textContent = dragon.exp;
    dragonNextExpElement.textContent = dragon.nextLevelExp;
    dragonImageElement.src = dragon.image;
    dragonImageElement.alt = dragon.name; // 画像の代替テキストも更新
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
    resultTextElement.textContent = '';
    resultTextElement.className = '';
    answerInputElement.value = '';
    answerInputElement.focus();
    submitAnswerButton.disabled = false;
    answerInputElement.disabled = false;
}

/**
 * 回答をチェックする関数 【★修正★】
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
        resultTextElement.textContent = "せいかい！すごい！ +5けいけんち"; // 【★変更★】獲得経験値を表示
        resultTextElement.className = 'correct';

        // 【★追加★】経験値を加算
        dragon.exp += 5; // 1問正解で5経験値獲得 (この値は調整可能です)

        // 【★追加★】レベルアップ判定 (詳細は次のステップで)
        if (dragon.exp >= dragon.nextLevelExp) {
            // 本来はここでレベルアップ処理を行う
            console.log("レベルアップの条件を満たしました！"); // とりあえずコンソールに表示
            // (次のステップで、実際にレベルアップさせ、表示を更新し、
            //  次の必要経験値を設定するなどの処理をここに追加します)
        }

        // 【★追加★】ドラゴンのステータス表示を更新
        updateDragonStatusDisplay();

        submitAnswerButton.disabled = true;
        answerInputElement.disabled = true;
        setTimeout(() => {
            displayQuestion();
        }, 1500);
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
    if (button) { // ボタン要素が存在するか確認
        button.addEventListener('click', function() {
            if (this.disabled) {
                return;
            }
            for (const btnKey in stageButtons) {
                if (stageButtons[btnKey]) {
                    stageButtons[btnKey].classList.remove('active');
                }
            }
            this.classList.add('active');
            if (stageKey === 'all') {
                currentStage = 2;
                alert("「ぜんぶの段」はまだ準備中です！");
            } else {
                currentStage = parseInt(stageKey);
            }
            displayQuestion();
        });
    }
}

submitAnswerButton.addEventListener('click', checkAnswer);

answerInputElement.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        if (!submitAnswerButton.disabled) {
            checkAnswer();
        }
    }
});

// --- 初期化処理 ---
window.addEventListener('load', () => {
    if (stageButtons[2]) {
        stageButtons[2].classList.add('active');
        for (const stageKey in stageButtons) {
            if (stageKey !== "2" && stageButtons[stageKey]) {
                stageButtons[stageKey].classList.remove('active');
            }
        }
    }
    currentStage = 2;
    updateDragonStatusDisplay(); // 【★追加★】初期のドラゴンステータスを表示
    displayQuestion();
});