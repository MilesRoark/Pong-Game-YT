const startText = document.getElementById("startText");
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const ball = document.getElementById("ball");
const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");
const lossSound = document.getElementById("lossSound");
const wallSound = document.getElementById("wallSound");
const paddleSound = document.getElementById("paddleSound");
const bgMusic = document.getElementById("bgMusic");
const winnerSound = document.getElementById("winner");

// Game Variables
let gameRunning = false;
let keysPressed = {};
let paddle1Speed = 0;
let paddle1Y = 150;
let paddle2Speed = 0;
let paddle2Y = 150;
let ballX = 290;
let ballSpeedX = 2;
let ballY = 190;
let ballSpeedY = 2;
let player2Score = 0;
let player1Score = 0;

// Game Constants
const paddleAcceleration = 1;
const maxPaddleSpeed = 5;
const paddleDecceleration = 1;
const gameHeight = 400;
const gameWidth = 600;
const winningScore = 6;

document.addEventListener("keydown", startGame);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

//Start game
function startGame() {
  gameRunning = true;
  startText.style.display = "none";
  document.removeEventListener("keydown", startGame);
  gameLoop();
  playMusic();
}

function playMusic() {
  if (bgMusic.paused) {
    bgMusic.currentTime = 0; // Start from the beginning if it's not playing
    bgMusic.play();
  }
}

function gameLoop() {
  if (gameRunning) {
    updatePaddle1();
    updatePaddle2();
    moveBall();
    requestAnimationFrame(gameLoop);
  }
}

function handleKeyDown(e) {
  keysPressed[e.key] = true;
}

function handleKeyUp(e) {
  keysPressed[e.key] = false;
}

function updatePaddle1() {
  if (keysPressed["w"]) {
    paddle1Speed = Math.max(paddle1Speed - paddleAcceleration, -maxPaddleSpeed);
  } else if (keysPressed["s"]) {
    paddle1Speed = Math.min(paddle1Speed + paddleAcceleration, maxPaddleSpeed);
  } else {
    if (paddle1Speed > 0) {
      paddle1Speed = Math.max(paddle1Speed - paddleDecceleration, 0);
    } else if (paddle1Speed < 0) {
      paddle1Speed = Math.min(paddle1Speed + paddleDecceleration, 0);
    }
  }

  paddle1Y += paddle1Speed;

  if (paddle1Y < 0) {
    paddle1Y = 0;
  } else if (paddle1Y > 300) {
    paddle1Y = 300;
  }

  paddle1.style.top = paddle1Y + "px";
}

function updatePaddle2() {
  if (keysPressed["i"]) {
    paddle2Speed = Math.max(paddle2Speed - paddleAcceleration, -maxPaddleSpeed);
  } else if (keysPressed["k"]) {
    paddle2Speed = Math.min(paddle2Speed + paddleAcceleration, maxPaddleSpeed);
  } else {
    if (paddle2Speed > 0) {
      paddle2Speed = Math.max(paddle2Speed - paddleDecceleration, 0);
    } else if (paddle2Speed < 0) {
      paddle2Speed = Math.min(paddle2Speed + paddleDecceleration, 0);
    }
  }

  paddle2Y += paddle2Speed;

  if (paddle2Y < 0) {
    paddle2Y = 0;
  } else if (paddle2Y > 300) {
    paddle2Y = 300;
  }

  paddle2.style.top = paddle2Y + "px";
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY >= gameHeight - ball.clientHeight || ballY <= 0) {
    ballSpeedY = -ballSpeedY;
    playSound(wallSound);
  } else if (ballX >= gameWidth - ball.clientWidth || ballX <= 0) {
    ballSpeedX = -ballSpeedX;
    playSound(wallSound);
  }

  if (
    ballX <= paddle1.clientWidth &&
    ballY >= paddle1Y &&
    ballY <= paddle1Y + paddle1.clientHeight
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(paddleSound);
  }

  if (
    ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth &&
    ballY >= paddle2Y &&
    ballY <= paddle2Y + paddle2.clientHeight
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(paddleSound);
  }

  //   Out of game area
  if (ballX <= 0) {
    player2Score++;
    playSound(lossSound);
    updateScoreboard();
    resetBall();
    pauseGame();
  } else if (ballX >= gameWidth - ball.clientWidth) {
    player1Score++;
    playSound(lossSound);
    updateScoreboard();
    resetBall();
    pauseGame();
  }

  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

function updateScoreboard() {
  player1ScoreElement.textContent = player1Score;
  player2ScoreElement.textContent = player2Score;

  if (player1Score === winningScore) {
    endGame("Player 1 Wins!");
  } else if (player2Score === winningScore) {
    endGame("Player 2 Wins!");
  }
}

function resetBall() {
  ballX = gameWidth / 2 - ball.clientWidth / 2;
  ballY = gameHeight / 2 - ball.clientHeight / 2;
  ballSpeedX = ballSpeedY = 0;

  setTimeout(() => {
    ballSpeedX = Math.random() > 0.5 ? 2 : -2;
    ballSpeedY = Math.random() > 0.5 ? 2 : -2;
  }, 1000);
}

function pauseGame() {
  gameRunning = false;
  document.removeEventListener("keydown", startGame);
  document.addEventListener("keydown", startGame);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function endGame(message) {
  gameRunning = false; // Stop the game loop
  playSound(winnerSound);
  bgMusic.pause();
  startText.style.display = "block"; // Show the start text
  startText.textContent = message + " Press any key to restart."; // Display winner message

  // Reset event listener for restarting the game
  document.addEventListener("keydown", () => location.reload());
}
