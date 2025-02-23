const categories = {
    Fruits: ["images/apple.jpeg", "images/banana.jpeg", "images/watermelon.jpeg", "images/grapes.jpeg",
        "images/strawberry.jpeg", "images/pineapple.jpeg", "images/mango.jpeg", "images/cherry.jpeg"],

    Emojis: ["images/smile.jpg", "images/sleepy.jpeg", "images/thumb.jpeg", "images/eyes.jpeg",
        "images/crysmile.jpg", "images/gestureemoji.jpeg", "images/angry.jpeg", "images/love.jpeg"],

    Animals: ["images/bear.jpeg", "images/cat.jpeg", "images/dog.jpeg", "images/dog2.jpeg",
        "images/duck.jpeg", "images/giraffie.jpeg", "images/lion.jpeg", "images/monkey.jpeg"],

    Planets: ["images/sun.jpeg", "images/bluePlanet.jpeg", "images/earth.jpeg", "images/galaxy.jpeg",
        "images/saturn.jpeg", "images/space.jpeg", "images/star.jpeg", "images/comet.jpeg"],

    Flags: ["images/america.jpeg", "images/australia.jpeg", "images/brazilk.jpeg", "images/india.jpeg",
        "images/korea.jpeg", "images/london.jpeg", "images/pakistan.jpeg", "images/vietnam.jpeg"]
};

let currentCategory = "";
let firstCard = null;
let secondCard = null;
let moves = 0;
let score = 0;
let timer = 30;
let interval;
let isPaused = false;

// DOM Elements
const landingPage = document.getElementById("landing-page");
const gamePage = document.getElementById("game-page");
const gameBoard = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const pauseButton = document.getElementById("pause-game");
const resumeButton = document.getElementById("resume-game");
const restartButton = document.getElementById("restart-game");
const homeButton = document.getElementById("home");
const categoryButtons = document.querySelectorAll(".category-btn");

// Popup Elements
const gameOverPopup = document.getElementById("gameOverPopup");
const finalScoreDisplay = document.getElementById("finalScore");
const popupRestartButton = document.getElementById("popupRestart");
const popupHomeButton = document.getElementById("popupHome");

// Load Sound Effects
const clickSound = new Audio("sounds/click.mp3");
const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const popupSound = new Audio("sounds/popup.mp3");

// Function to play sound
function playSound(sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
}

// Add Click Sound to All Buttons
const buttonsWithSound = [pauseButton, resumeButton, restartButton, homeButton,
    popupRestartButton, popupHomeButton];

categoryButtons.forEach(button => {
    buttonsWithSound.push(button);
});

buttonsWithSound.forEach(button => {
    button.addEventListener("click", () => playSound(clickSound));
});

// Shuffle function
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Start Game
function startGame(category) {
    currentCategory = category;
    landingPage.style.display = "none";
    gamePage.style.display = "block";
    gameBoard.innerHTML = "";

    moves = 0;
    score = 0;
    timer = 30;
    isPaused = false;

    movesDisplay.innerText = moves;
    scoreDisplay.innerText = score;
    timeDisplay.innerText = timer;

    const selectedCategory = shuffle([...categories[category], ...categories[category]]);

    selectedCategory.forEach(imagePath => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = imagePath;
        card.innerHTML = `
            <div class="front">❓</div>
            <div class="back"><img src="${imagePath}" alt="Memory Image"></div>
        `;
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });

    clearInterval(interval);
    interval = setInterval(() => {
        if (!isPaused) {
            timer--;
            timeDisplay.innerText = timer;
            if (timer === 0) {
                clearInterval(interval);
                showGameOverPopup(score);
            }
        }
    }, 1000);
}

// Flip Card
function flipCard() {
    if (isPaused || this.classList.contains("flipped")) return;
    playSound(flipSound);
    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesDisplay.innerText = moves;

    checkMatch();
}

// Check Match
function checkMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        playSound(matchSound);
        score += 10;
        scoreDisplay.innerText = score;
        resetSelection();

        if (score === 80) {
            clearInterval(interval);
            setTimeout(() => {
                showGameOverPopup(score);
            }, 500);
        }
    } else {
        isPaused = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetSelection();
            isPaused = false;
        }, 1000);
    }
}

// Reset Selection
function resetSelection() {
    firstCard = null;
    secondCard = null;
}

// Stop Game
pauseButton.addEventListener("click", () => {
    isPaused = true;
    clearInterval(interval);
});

// Resume Game
resumeButton.addEventListener("click", () => {
    isPaused = false;
    interval = setInterval(() => {
        if (!isPaused) {
            timer--;
            timeDisplay.innerText = timer;
            if (timer === 0) {
                clearInterval(interval);
                showGameOverPopup(score);
            }
        }
    }, 1000);
});

// Restart Game
restartButton.addEventListener("click", () => {
    if (currentCategory) {
        clearInterval(interval);
        startGame(currentCategory);
    }
});

// Go Back to Home
homeButton.addEventListener("click", () => {
    clearInterval(interval);
    gamePage.style.display = "none";
    landingPage.style.display = "block";
});

// Show Game Over Popup
function showGameOverPopup(score) {
    playSound(popupSound);
    
    if (score === 80) {
        finalScoreDisplay.innerText = "";
        finalScoreDisplay.innerText = "🎉 You Won the Match!";
    } else {
        finalScoreDisplay.innerText = `Your Score: ${score}`;
    }
    
    gameOverPopup.style.display = "flex";
}

// Restart Game from Popup
popupRestartButton.addEventListener("click", () => {
    gameOverPopup.style.display = "none";
    if (currentCategory) {
        startGame(currentCategory);
    }
});

// Go to Home from Popup
popupHomeButton.addEventListener("click", () => {
    gameOverPopup.style.display = "none";
    gamePage.style.display = "none";
    landingPage.style.display = "block";
});

// Event Listeners for Category Selection
categoryButtons.forEach(button => {
    button.addEventListener("click", () => startGame(button.dataset.category));
});
