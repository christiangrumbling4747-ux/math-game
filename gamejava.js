document.addEventListener('DOMContentLoaded', () => {
    const maxScoreBtn = document.getElementById('max-score-btn');
    const threeOutBtn = document.getElementById('three-out-btn');
    const gameModesDiv = document.getElementById('game-modes');
    const settingsDiv = document.getElementById('settings');
    const mediumBtn = document.getElementById('medium-btn');
    const easyBtn = document.getElementById('easy-btn');
    const hardBtn = document.getElementById('hard-btn');
    const answerInput = document.getElementById('answer-input');
    const endGameMessageDiv = document.getElementById('end-game-message');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');
    const submitBtn = document.getElementById('submit-btn');
    const skipBtn = document.getElementById('skip-btn');
    const scoreDisplay = document.getElementById('score-display');
    const statusDisplay = document.getElementById('status-display');
    const startGameBtn = document.getElementById('start-game-btn');
    const gameAreaDiv = document.getElementById('game-area');
    const questionDisplay = document.getElementById('question-display');

    let score = 0;
    let questionCount = 0;
    let strikes = 0;
    let currentAnswer = null;
    let gameMode = '';
    let difficulty = '';

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateQuestion() {
        let num1, num2, operator;
        const easyOps = ['+', '-'];
        const allOps = ['+', '-', '*', '/', '%'];

        if (difficulty === 'easy') {
            num1 = getRandomInt(1, 9);
            num2 = getRandomInt(1, 9);
            operator = easyOps[getRandomInt(0, easyOps.length - 1)];
        } else if (difficulty === 'medium') {
            operator = allOps[getRandomInt(0, allOps.length - 1)];
            if (operator === '+' || operator === '-') {
                num1 = getRandomInt(1, 99);
                num2 = getRandomInt(1, 99);
            } else {
                num1 = getRandomInt(1, 9);
                num2 = getRandomInt(1, 9);
            }
        } else { // hard
            operator = allOps[getRandomInt(0, allOps.length - 1)];
            if (operator === '+' || operator === '-') {
                num1 = getRandomInt(1, 999);
                num2 = getRandomInt(1, 999);
            } else {
                num1 = getRandomInt(1, 99);
                num2 = getRandomInt(1, 9);
            }
        }

        let answer;
        let questionStr;
        if (operator === '/' || operator === '%') {
            if (num2 === 0) {
                return generateQuestion();
            }
            const tempNum1 = num1 * num2;
            if (operator === '/') {
                answer = tempNum1 / num2;
                questionStr = `${tempNum1} ${operator} ${num2} = ?`;
            } else {
                answer = tempNum1 % num2;
                questionStr = `${tempNum1} ${operator} ${num2} = ?`;
            }
        } else {
            switch (operator) {
                case '+':
                    answer = num1 + num2;
                    break;
                case '-':
                    answer = num1 - num2;
                    break;
                case '*':
                    answer = num1 * num2;
                    break;
            }
            questionStr = `${num1} ${operator} ${num2} = ?`;
        }
        if (gameMode === 'max-score') {
            questionDisplay.textContent = `Question ${questionCount + 1}: ${questionStr}`;
        } else {
            questionDisplay.textContent = `${questionCount + 1}) ${questionStr}`;
        }
        currentAnswer = answer;
    }

    function updateScoreDisplay() {
        if (gameMode === 'max-score') {
            scoreDisplay.textContent = `Score: ${score} | Question: ${questionCount}/20`;
        } else if (gameMode === 'three-out') {
            scoreDisplay.textContent = `Score: ${score} | Strikes: ${strikes}/3`;
        }
    }

    function isCorrect(user, answer) {
        // Accept answers within 0.01 for floats, exact for integers
        if (typeof answer === "number") {
            return Math.abs(Number(user) - answer) < 0.01;
        }
        return false;
    }

    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        answerInput.value = '';
        let feedback = '';
        let scoreChange = 0;

        if (gameMode === 'max-score') {
            if (userAnswer === 'skip' || userAnswer === '') {
                feedback = "Skipped!";
                scoreChange = 0;
            } else {
                if (isCorrect(userAnswer, currentAnswer)) {
                    feedback = "Correct!";
                    scoreChange = 10;
                } else {
                    feedback = "Wrong!";
                    scoreChange = -5;
                }
            }
            statusDisplay.textContent = `${feedback} Your score: ${score} ${scoreChange >= 0 ? '+' : ''}${scoreChange} = ${score + scoreChange}`;
            score += scoreChange;
            questionCount++;
        } else if (gameMode === 'three-out') {
            if (isCorrect(userAnswer, currentAnswer)) {
                feedback = `Correct! Your score: ${score} + 10 = ${score + 10}. ${3 - strikes} chance(s) left`;
                score += 10;
            } else {
                strikes++;
                feedback = `Wrong! Your score: ${score} + 0 = ${score}. ${3 - strikes} chance(s) left`;
            }
            questionCount++;
        }
        statusDisplay.textContent = feedback;
        updateScoreDisplay();
        setTimeout(nextTurn, 1000);
    }

    function nextTurn() {
        if (gameMode === 'max-score') {
            if (questionCount < 20) {
                generateQuestion();
                answerInput.focus();
            } else {
                endGame();
            }
        } else if (gameMode === 'three-out') {
            if (strikes < 3) {
                generateQuestion();
                answerInput.focus();
            } else {
                endGame();
            }
        }
    }

    function endGame() {
        gameAreaDiv.classList.add('hidden');
        endGameMessageDiv.classList.remove('hidden');
        finalScoreDisplay.textContent = `Your final score is: ${score}`;
    }

    function resetGame() {
        score = 0;
        questionCount = 0;
        strikes = 0;
        currentAnswer = null;
        gameMode = '';
        difficulty = '';
        gameModesDiv.classList.remove('hidden');
        gameAreaDiv.classList.add('hidden');
        endGameMessageDiv.classList.add('hidden');
        statusDisplay.textContent = '';
        scoreDisplay.textContent = '';
    }

    function selectDifficulty(level) {
        difficulty = level;
        document.querySelectorAll('.difficulty-options button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${level}-btn`).classList.add('active');
        startGameBtn.disabled = false;
    }

    function startGame() {
        settingsDiv.classList.add('hidden');
        gameAreaDiv.classList.remove('hidden');
        generateQuestion();
        updateScoreDisplay();
        answerInput.focus();
    }

    maxScoreBtn.addEventListener('click', () => {
        gameMode = 'max-score';
        gameModesDiv.classList.add('hidden');
        settingsDiv.classList.remove('hidden');
        skipBtn.style.display = 'inline-block';
        answerInput.placeholder = "Type your answer or 'skip'";
    });

    threeOutBtn.addEventListener('click', () => {
        gameMode = 'three-out';
        gameModesDiv.classList.add('hidden');
        settingsDiv.classList.remove('hidden');
        skipBtn.style.display = 'none';
        answerInput.placeholder = "Type your answer";
    });

    easyBtn.addEventListener('click', () => selectDifficulty('easy'));
    mediumBtn.addEventListener('click', () => selectDifficulty('medium'));
    hardBtn.addEventListener('click', () => selectDifficulty('hard'));
    startGameBtn.addEventListener('click', startGame);

    submitBtn.addEventListener('click', checkAnswer);
    skipBtn.addEventListener('click', () => {
        if (gameMode === 'max-score') {
            answerInput.value = 'skip';
            checkAnswer();
        }
    });
    restartBtn.addEventListener('click', resetGame);

    answerInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
});