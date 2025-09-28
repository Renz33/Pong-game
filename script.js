const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 15, paddleHeight = 80;
const ballSize = 16;

let leftPaddle = { x: 15, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, speed: 0 };
let rightPaddle = { x: canvas.width - paddleWidth - 15, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, speed: 5 };

let ball = {
  x: canvas.width / 2 - ballSize / 2,
  y: canvas.height / 2 - ballSize / 2,
  size: ballSize,
  speedX: 5 * (Math.random() > 0.5 ? 1 : -1),
  speedY: 4 * (Math.random() > 0.5 ? 1 : -1)
};

// Mouse control for left paddle
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddle.y = mouseY - leftPaddle.height / 2;
  // Clamp paddle within the canvas
  if (leftPaddle.y < 0) leftPaddle.y = 0;
  if (leftPaddle.y + leftPaddle.height > canvas.height) leftPaddle.y = canvas.height - leftPaddle.height;
});

// AI control for right paddle
function moveRightPaddle() {
  let center = rightPaddle.y + rightPaddle.height / 2;
  if (center < ball.y) {
    rightPaddle.y += rightPaddle.speed;
  } else if (center > ball.y) {
    rightPaddle.y -= rightPaddle.speed;
  }
  // Clamp
  if (rightPaddle.y < 0) rightPaddle.y = 0;
  if (rightPaddle.y + rightPaddle.height > canvas.height) rightPaddle.y = canvas.height - rightPaddle.height;
}

// Ball movement and collision
function moveBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Wall collision (top/bottom)
  if (ball.y < 0) {
    ball.y = 0;
    ball.speedY *= -1;
  }
  if (ball.y + ball.size > canvas.height) {
    ball.y = canvas.height - ball.size;
    ball.speedY *= -1;
  }

  // Paddle collision (left)
  if (
    ball.x < leftPaddle.x + leftPaddle.width &&
    ball.y + ball.size > leftPaddle.y &&
    ball.y < leftPaddle.y + leftPaddle.height
  ) {
    ball.x = leftPaddle.x + leftPaddle.width;
    ball.speedX *= -1;
    // Add spin based on where the ball hits the paddle
    let collidePoint = (ball.y + ball.size / 2) - (leftPaddle.y + leftPaddle.height / 2);
    ball.speedY = collidePoint * 0.2;
  }

  // Paddle collision (right)
  if (
    ball.x + ball.size > rightPaddle.x &&
    ball.y + ball.size > rightPaddle.y &&
    ball.y < rightPaddle.y + rightPaddle.height
  ) {
    ball.x = rightPaddle.x - ball.size;
    ball.speedX *= -1;
    let collidePoint = (ball.y + ball.size / 2) - (rightPaddle.y + rightPaddle.height / 2);
    ball.speedY = collidePoint * 0.2;
  }

  // Score (left or right wall)
  if (ball.x < 0 || ball.x + ball.size > canvas.width) {
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width / 2 - ball.size / 2;
  ball.y = canvas.height / 2 - ball.size / 2;
  ball.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
  ball.speedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Render everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x + ball.size / 2, ball.y + ball.size / 2, ball.size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // Draw middle line
  ctx.fillStyle = "#888";
  for (let i = 0; i < canvas.height; i += 30) {
    ctx.fillRect(canvas.width / 2 - 2, i, 4, 18);
  }
}

// Main game loop
function loop() {
  moveRightPaddle();
  moveBall();
  draw();
  requestAnimationFrame(loop);
}

loop();