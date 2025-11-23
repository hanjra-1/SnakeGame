// Selecting DOM elements
const board = document.querySelector(".board");
const startGame = document.querySelector(".start-game");
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");
const modal = document.querySelector(".modal");
const restart = document.querySelector(".restart");

// Selecting score and time elements
let highScoreElement = document.querySelector("#highscore");
let scoreElement = document.querySelector("#score");
let timeElement = document.querySelector("#time");

// Game constants
const blockHeight = 50;
const blockWidth = 50;

// Game variables
let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`;
highScoreElement.innerText = highScore;

// Calculating board dimensions
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

// Game state variables
let intervelId = null;
let timerIntervalId = null;
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
const blocks = [];
let snake = [
    { x: 1, y: 3 }
];
let direction = "right";

// Creating the game board
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

// Main render function
function render() {
    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add("food");

    // Calculating the new head position based on the direction
    if (direction === "left") { head = { x: snake[0].x, y: snake[0].y - 1 } }
    else if (direction === "right") { head = { x: snake[0].x, y: snake[0].y + 1 } }
    else if (direction === "up") { head = { x: snake[0].x - 1, y: snake[0].y } }
    else if (direction === "down") { head = { x: snake[0].x + 1, y: snake[0].y } }

    // Wall collision detection
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        modal.style.display = "flex";
        startGame.style.display = "none";
        restart.style.display = "flex";
        clearInterval(intervelId);
        clearInterval(timerIntervalId);
        return;
    }

    // Self-collision detection
    for (const segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            modal.style.display = "flex";
            startGame.style.display = "none";
            restart.style.display = "flex";
            clearInterval(intervelId);
            clearInterval(timerIntervalId);
            return;
        }
    }

    // Food consumption
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.push(head);
        score += 10;
        scoreElement.innerText = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
        };
    }

    // Moving the snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    });
    snake.unshift(head);
    snake.pop();
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
};

// Event listener for the start button
startButton.addEventListener("click", () => {
    modal.style.display = "none";
    intervelId = setInterval(render, 500);
    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);
        if (sec == 59) { min += 1; sec = 0; } else { sec += 1; }
        time = `${min}-${sec}`;
        timeElement.innerText = time;
    }, 1000);
});

// Event listener for the restart button
restartButton.addEventListener("click", restartGame);

// Function to restart the game
function restartGame() {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    });
    score = 0;
    time = `00-00`;
    highScoreElement.innerText = highScore;
    scoreElement.innerText = score;
    timeElement.innerText = time;

    modal.style.display = "none";
    snake = [{ x: 1, y: 3 }];
    direction = "down";
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

    intervelId = setInterval(render, 500);
    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);
        if (sec == 59) { min += 1; sec = 0; } else { sec += 1; }
        time = `${min}-${sec}`;
        timeElement.innerText = time;
    }, 1000);
}

// Event listener for keyboard input
addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { direction = "left" }
    else if (e.key === "ArrowRight") { direction = "right" }
    else if (e.key === "ArrowUp") { direction = "up" }
    else if (e.key === "ArrowDown") { direction = "down" }
});