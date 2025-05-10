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
let currentStage = 2; // 現在挑戦中のステージ（段）最初は2の段
let currentQuestion = {}; // 現在出題中の問題 { num1: ?, num2: ?, answer: ? }

// --- 関数 ---

/**
 * 指定された段の掛け算の問題をランダムに生成する関数
 * @param {number} stage - 掛け算の段 (例: 2の段なら2)
 * @returns {object} 問題オブジェクト { num1, num2, answer }
 */
function generateQuestion(stage) {
    const num1 = stage;
    const num2 = Math.floor(Math.random() * 9) + 1; // 1から9までのランダムな数
    return {
        num1: num1,
        num2: num2,
        answer: num1 * num2
    };
}

/**
 * 問題を画面に表示する関数
 */
function displayQuestion() {
    currentQuestion = generateQuestion(currentStage);
    questionTextElement.textContent = `${currentQuestion.num1} × ${currentQuestion.num2} = ?`;
    resultTextElement.textContent = ''; // 結果表示をクリア
    resultTextElement.className = ''; // 結果表示のスタイルクラスをクリア
    answerInputElement.value = '';
    answerInputElement.focus();
    // 回答ボタンと入力欄を有効化
    submitAnswerButton.disabled = false;
    answerInputElement.disabled = false;
}

/**
 * 回答をチェックする関数
 */
function checkAnswer() {
    const userAnswerText = answerInputElement.value;

    // 入力が空かどうかをチェック
    if (userAnswerText.trim() === '') {
        resultTextElement.textContent = "こたえをいれてね！";
        resultTextElement.className = 'incorrect';
        answerInputElement.focus();
        return;
    }

    const userAnswer = parseInt(userAnswerText);

    // 入力が数値でない場合は処理を中断
    if (isNaN(userAnswer)) {
        resultTextElement.textContent = "数字をいれてね！";
        resultTextElement.className = 'incorrect';
        answerInputElement.value = ''; // 無効な入力をクリア
        answerInputElement.focus();
        return;
    }

    // 正誤判定
    if (userAnswer === currentQuestion.answer) {
        resultTextElement.textContent = "せいかい！すごい！";
        resultTextElement.className = 'correct';
        // 正解したら、少し待ってから次の問題へ
        submitAnswerButton.disabled = true;
        answerInputElement.disabled = true;
        setTimeout(() => {
            displayQuestion();
        }, 1500); // 1.5秒後に次の問題を表示
    } else {
        resultTextElement.textContent = `おしい！こたえは ${currentQuestion.answer} でした。もういちどやってみよう！`;
        resultTextElement.className = 'incorrect';
        answerInputElement.focus();
        answerInputElement.select();
    }
}

// --- イベントリスナー ---
// ステージ選択ボタンがクリックされたときの処理
for (const stageKey in stageButtons) {
    const button = stageButtons[stageKey];
    if (button) { // ボタン要素が存在するか確認
        button.addEventListener('click', function() {
            if (this.disabled) {
                return;
            }

            // 他のボタンのアクティブ状態を解除
            for (const btnKey in stageButtons) {
                if (stageButtons[btnKey]) {
                    stageButtons[btnKey].classList.remove('active');
                }
            }
            // クリックされたボタンをアクティブにする
            this.classList.add('active');

            // ステージを更新して新しい問題を表示
            if (stageKey === 'all') {
                // 「ぜんぶの段」はまだ実装していないので、一旦2の段にする (後で変更)
                currentStage = 2; // この部分は後でランダムな段の出題ロジックに変更します
                alert("「ぜんぶの段」はまだ準備中です！");
            } else {
                currentStage = parseInt(stageKey); // 文字列のキーを数値に変換
            }
            displayQuestion();
        });
    }
}

// 回答ボタンがクリックされたときの処理
submitAnswerButton.addEventListener('click', checkAnswer);

// Enterキーでも回答できるようにする
answerInputElement.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        // 回答ボタンが有効な場合のみEnterキーを機能させる
        if (!submitAnswerButton.disabled) {
            checkAnswer();
        }
    }
});

// --- 初期化処理 ---
// ページが読み込まれたら、最初の問題を表示する
window.addEventListener('load', () => {
    // 初期状態では2の段ボタンをアクティブ表示
    if (stageButtons[2]) {
        stageButtons[2].classList.add('active');
        // 他のボタンから念のため active クラスを削除（HTMLで直接指定している場合も考慮）
        for (const stageKey in stageButtons) {
            if (stageKey !== "2" && stageButtons[stageKey]) {
                stageButtons[stageKey].classList.remove('active');
            }
        }
    }
    currentStage = 2; // 明示的に初期ステージを2の段に設定
    displayQuestion();
});