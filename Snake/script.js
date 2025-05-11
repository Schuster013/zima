const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = 20;
canvas.width = canvas.height = gridSize * tileCount;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let velocity = { x: 0, y: 0 };
let score = 0;
let gameInterval;

document.addEventListener('keydown', changeDirection);

function gameLoop() {
    update();
    draw();
}

function update() {
    // Move snake
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
    snake.unshift(head);

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }

    // Check for collision with walls or self
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || checkSelfCollision(head)) {
        clearInterval(gameInterval);
        alert('Game Over! Score: ' + score);
        resetGame();
        return;
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw score (optional)
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, canvas.height - 10);
}

function changeDirection(event) {
    const { keyCode } = event;
    // Left arrow
    if (keyCode === 37 && velocity.x === 0) {
        velocity = { x: -1, y: 0 };
    }
    // Up arrow
    else if (keyCode === 38 && velocity.y === 0) {
        velocity = { x: 0, y: -1 };
    }
    // Right arrow
    else if (keyCode === 39 && velocity.x === 0) {
        velocity = { x: 1, y: 0 };
    }
    // Down arrow
    else if (keyCode === 40 && velocity.y === 0) {
        velocity = { x: 0, y: 1 };
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Ensure food doesn't spawn on the snake
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            placeFood();
        }
    });
}

function checkSelfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    velocity = { x: 0, y: 0 };
    score = 0;
    startGame();
}

function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    placeFood(); // Place initial food
    gameInterval = setInterval(gameLoop, 100); // Game speed: 100ms
}

startGame(); 