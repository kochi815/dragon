// script.js

// --- HTML要素の取得 (ID変更に合わせて修正) ---
const questionTextElement = document.getElementById('question-text');
const answerInputElement = document.getElementById('answer-input');
const submitAnswerButton = document.getElementById('submit-answer-button'); // ID変更
const resultTextElement = document.getElementById('result-text-display'); // ID変更
const dragonImageElement = document.getElementById('dragon-image');
const dragonNameElement = document.getElementById('dragon-name');
const dragonLevelElement = document.getElementById('dragon-level');
// 経験値バー関連の要素を取得
const dragonExpTextElement = document.getElementById('dragon-exp-text');
const dragonExpBarElement = document.getElementById('dragon-exp-bar');


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

// テンキーパッドのボタンを取得
const numpadButtons = document.querySelectorAll('#numpad-area .numpad-button');

// --- ゲームの状態に関する変数 ---
let currentStage = 2;
let currentQuestion = {};
let dragon = {
    name: "タマゴ",
    level: 1,
    exp: 0,
    nextLevelExp: 10, // 初期値 (evolutionDataに基づいて更新される)
    image: "images/egg.png",
    evolutionStage: 0
};

// 【★難易度調整★】 evolutionData の nextLevelExpBase を調整
const evolutionData = [
    { stage: 0, name: "タマゴ", image: "images/egg.png", requiredLevel: 1, nextLevelExpBase: 8 }, // 例: 10から8に
    { stage: 1, name: "ベビー ドラゴン", image: "images/dragon_baby.png", requiredLevel: 2, nextLevelExpBase: 12 }, // 例: 15から12に
    { stage: 2, name: "チャイルド ドラゴン", image: "images/dragon_child.png", requiredLevel: 5, nextLevelExpBase: 25 },
    { stage: 3, name: "ヤング ドラゴン", image: "images/dragon_young.png", requiredLevel: 10, nextLevelExpBase: 40 },
    { stage: 4, name: "アダルト ドラゴン", image: "images/dragon_adult.png", requiredLevel: 15, nextLevelExpBase: 60 },
    { stage: 5, name: "エルダー ドラゴン", image: "images/dragon_elder.png", requiredLevel: 20, nextLevelExpBase: 100 }
];

// --- 関数 ---

/**
 * ドラゴンのステータス表示を更新する関数
 */
function updateDragonStatusDisplay() {
    dragonNameElement.textContent = dragon.name;
    dragonLevelElement.textContent = dragon.level;
    dragonExpTextElement.textContent = `${dragon.exp} / ${dragon.nextLevelExp}`;
    dragonImageElement.src = dragon.image;
    dragonImageElement.alt = dragon.name;

    const expPercentage = (dragon.exp / dragon.nextLevelExp) * 100;
    dragonExpBarElement.style.width = `${Math.min(expPercentage, 100)}%`;
}

function levelUpDragon() {
    dragon.level++;
    dragon.exp = Math.max(0, dragon.exp - dragon.nextLevelExp); 

    let newEvolution = evolutionData.find(evo => evo.stage === dragon.evolutionStage + 1);
    let didEvolve = false;

    if (newEvolution && dragon.level >= newEvolution.requiredLevel) {
        dragon.evolutionStage = newEvolution.stage;
        dragon.name = newEvolution.name;
        dragon.image = newEvolution.image;
        resultTextElement.textContent = `おめでとう！ ${dragon.name} に進化した！ (レベル ${dragon.level})`;
        resultTextElement.className = 'evolution';
        didEvolve = true;
    } else {
        resultTextElement.textContent = `レベルアップ！ ${dragon.name} はレベル ${dragon.level} になった！`;
        resultTextElement.className = 'levelup';
    }

    const currentEvoData = evolutionData[dragon.evolutionStage];
    const baseExpForNextLevel = (currentEvoData.stage === evolutionData.length -1) ? currentEvoData.nextLevelExpBase * 1.2 : currentEvoData.nextLevelExpBase;
    dragon.nextLevelExp = Math.floor(baseExpForNextLevel * (1 + (dragon.level - currentEvoData.requiredLevel) * 0.25));
    
    updateDragonStatusDisplay();
    return didEvolve;
}

function generateQuestion(stage) {
    if (stage === 'allActive') { 
        const randomDan = Math.floor(Math.random() * 8) + 2; 
        const num1 = randomDan;
        const num2 = Math.floor(Math.random() * 9) + 1;
        return { num1: num1, num2: num2, answer: num1 * num2 };
    } else {
        const num1 = stage;
        const num2 = Math.floor(Math.random() * 9) + 1;
        return { num1: num1, num2: num2, answer: num1 * num2 };
    }
}


function displayQuestion() {
    if (currentStage === 'all') {
        currentQuestion = generateQuestion('allActive');
    } else {
        currentQuestion = generateQuestion(currentStage);
    }

    questionTextElement.textContent = `${currentQuestion.num1} × ${currentQuestion.num2} = ?`;
    answerInputElement.value = ''; 
    // answerInputElement.focus(); // スマホ等でキーボードが一瞬出るのを避けるためコメントアウトも検討
    submitAnswerButton.disabled = false;
    resultTextElement.textContent = ''; // 新しい問題表示時にメッセージをクリア
    resultTextElement.className = '';   // メッセージスタイルもクリア
}

function checkAnswer() {
    const userAnswerText = answerInputElement.value;

    if (userAnswerText.trim() === '') {
        resultTextElement.textContent = "こたえをいれてね！";
        resultTextElement.className = 'incorrect';
        return;
    }
    const userAnswer = parseInt(userAnswerText);
    if (isNaN(userAnswer)) {
        resultTextElement.textContent = "数字をいれてね！";
        resultTextElement.className = 'incorrect';
        answerInputElement.value = '';
        return;
    }

    if (userAnswer === currentQuestion.answer) {
        const expGained = 10; // 【★難易度調整★】獲得経験値を5から10に増加
        dragon.exp += expGained;
        resultTextElement.textContent = `せいかい！ +${expGained}けいけんち`;
        resultTextElement.className = 'correct';
        updateDragonStatusDisplay();

        submitAnswerButton.disabled = true;
        numpadButtons.forEach(btn => btn.disabled = true); // テンキーも無効化

        setTimeout(() => {
            let evolvedThisTurn = false;
            while (dragon.exp >= dragon.nextLevelExp && dragon.evolutionStage < evolutionData.length - 1) {
                if (levelUpDragon()) {
                    evolvedThisTurn = true;
                }
                // updateDragonStatusDisplay(); // levelUpDragon内で呼ばれる
            }
            updateDragonStatusDisplay(); // 最終的な状態を表示
            displayQuestion();
            numpadButtons.forEach(btn => btn.disabled = false); // テンキーを再度有効化
        }, evolvedThisTurn ? 2500 : 1000); // 進化時はメッセージを長めに

    } else {
        resultTextElement.textContent = `おしい！正解は ${currentQuestion.answer} でした。`;
        resultTextElement.className = 'incorrect';
        answerInputElement.value = ''; 
    }
}

// --- イベントリスナー ---
for (const stageKey in stageButtons) {
    const button = stageButtons[stageKey];
    if (button) {
        button.addEventListener('click', function() {
            if (this.disabled) { return; }
            for (const btnKey in stageButtons) {
                if (stageButtons[btnKey]) { stageButtons[btnKey].classList.remove('active'); }
            }
            this.classList.add('active');

            if (stageKey === 'all') {
                currentStage = 'all';
            } else {
                currentStage = parseInt(stageKey);
            }
            // resultTextElement.textContent = ''; // displayQuestion内でクリアされる
            // resultTextElement.className = '';
            displayQuestion();
        });
    }
}

submitAnswerButton.addEventListener('click', checkAnswer);

numpadButtons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        if (button.classList.contains('numpad-clear')) {
            answerInputElement.value = '';
        } else if (button.classList.contains('numpad-backspace')) {
            answerInputElement.value = answerInputElement.value.slice(0, -1);
        } else {
            if (answerInputElement.value.length < 3) {
                answerInputElement.value += value;
            }
        }
    });
});

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
        dragon.level = initialEvo.requiredLevel;
        dragon.nextLevelExp = initialEvo.nextLevelExpBase; // ここで初期のnextLevelExpを設定
    }

    if (stageButtons[2]) { 
        stageButtons[2].classList.add('active');
        currentStage = 2;
    } else { 
        const firstEnabledButtonKey = Object.keys(stageButtons).find(key => stageButtons[key] && !stageButtons[key].disabled);
        if (firstEnabledButtonKey) {
            stageButtons[firstEnabledButtonKey].classList.add('active');
            currentStage = (firstEnabledButtonKey === 'all') ? 'all' : parseInt(firstEnabledButtonKey);
        }
    }
    
    updateDragonStatusDisplay();
    displayQuestion();
});