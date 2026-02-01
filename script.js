const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let score = 0;
let direction = "RIGHT";
let game;
let musicStarted = false;

/* ================== SOUNDS ================== */
const bgMusic = new Audio("bgsfx.mp3");
const eatSound = new Audio("eat-sfx.wav");
const gameOverSound = new Audio("gameoversfx.wav");
const replaySound = new Audio("replay.wav");

bgMusic.loop = true;
bgMusic.volume = 0.4;

/* ================== GAME STATE ================== */
let snake = [{ x: 9 * box, y: 10 * box }];

let food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
};

/* ================== CONTROLS ================== */
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {

    // start background music ONLY ONCE
    if (!musicStarted) {
        bgMusic.play().catch(() => {});
        musicStarted = true;
    }

    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

/* ================== COLLISION ================== */
function collision(head, body) {
    for (let part of body) {
        if (head.x === part.x && head.y === part.y) return true;
    }
    return false;
}

/* ================== DRAW GAME ================== */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#00ff88" : "#00cc66";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // food
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
        food.x + box / 2,
        food.y + box / 2,
        box / 2.5,
        0,
        Math.PI * 2
    );
    ctx.fill();

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    // eat food
    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("score").innerText = "Score: " + score;

        eatSound.currentTime = 0;
        eatSound.play();

        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // game over
    if (
        headX < 0 ||
        headY < 0 ||
        headX >= canvas.width ||
        headY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        bgMusic.pause();
        gameOverSound.play();
        document.getElementById("gameOver").classList.remove("hidden");
        return;
    }

    snake.unshift(newHead);
}

/*================== START GAME ==================*/
game = setInterval(draw, 150);

/* ================== RESTART ================== */
function restartGame() {
    replaySound.play();
    setTimeout(() => {
        location.reload();
    }, 300);
}
