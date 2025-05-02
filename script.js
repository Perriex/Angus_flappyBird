let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "Start";
let pipes = [];
let pipe_gap = 250;
let highScore = localStorage.getItem("flappyHighScore") || 0;

let gameInterval = null;

let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game_container");
let start_btn = document.getElementById("start-btn");

function onStartButtonClick() {
  if (game_state !== "Play") {
    game_state = "Play";
    startGame();
  }
}

function startGame() {
  if (gameInterval !== null) return;

  let frame = 0;
  const frame_time = 300;
  backgroundMusic.play();
  highScore = localStorage.getItem("flappyHighScore") || 0;
  score_display.textContent = "Score:" + score + " | Best: " + highScore;

  gameInterval = setInterval(() => {
    applyGravity();
    movePipes();
    checkCollision();
    frame++;
    getDifficultySettings();

    if (frame % frame_time === 0) {
      createPipe();
    }
  }, 10);
}

function applyGravity() {
  bird_dy += gravity;
  let birdTop = bird.offsetTop + bird_dy;

  birdTop = Math.max(birdTop, -50);
  birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);

  bird.style.top = birdTop + "px";

  let angle = Math.min(Math.max(bird_dy * 2, -30), 90);
  bird.style.transform = `rotate(${angle}deg)`;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (game_state !== "Play") {
      game_state = "Play";
      startGame();
    }
    flapSound.play();

    bird_dy = -7;
  }
});

function createPipe() {
  let pipe_position =
    Math.floor(Math.random() * (game_container.offsetHeight - pipe_gap - 100)) +
    50;

  let top_pipe = document.createElement("div");
  top_pipe.className = "pipe";
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_container.appendChild(top_pipe);

  let bottom_pipe = document.createElement("div");
  bottom_pipe.className = "pipe";
  bottom_pipe.style.height =
    game_container.offsetHeight - pipe_gap - pipe_position + "px";
  bottom_pipe.style.bottom = "0px";
  bottom_pipe.style.left = "100%";
  game_container.appendChild(bottom_pipe);

  pipes.push(top_pipe, bottom_pipe);
}

function movePipes() {
  for (let pipe of pipes) {
    pipe.style.left = pipe.offsetLeft - 3 + "px";

    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}

function checkCollision() {
  let birdRect = bird.getBoundingClientRect();
  for (let pipe of pipes) {
    let pipeRect = pipe.getBoundingClientRect();
    if (
      birdRect.left < pipeRect.left + pipeRect.width &&
      birdRect.left + birdRect.width > pipeRect.left &&
      birdRect.top < pipeRect.top + pipeRect.height &&
      birdRect.top + birdRect.height > pipeRect.top
    ) {
      endGame();
      return;
    }
  }
  if (
    bird.offsetTop <= 0 ||
    bird.offsetTop >= game_container.offsetHeight - bird.offsetHeight
  ) {
    endGame();
  }
  pipes.forEach((pipe, index) => {
    if (index % 2 === 0) {
      if (
        pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft &&
        !pipe.passed
      ) {
        pipe.passed = true;
        setScore(score + 1);
      }
    }
  });
}

function setScore(newScore) {
  if (newScore > score) {
    scoreSound.play();
  }
  score = newScore;
  score_display.textContent = "Score: " + score + " | Best: " + highScore
}

function endGame() {
if (Number(score) > Number(highScore)) {
  localStorage.setItem("flappyHighScore", score);
}

  hitSound.play;
  clearInterval(gameInterval);
  gameInterval = null;

  alert("Game Over! Your Score:" + score);
  resetGame();
}

function resetGame() {
  bird.style.top = "50%";
  bird_dy = 0;
  bird.style.transform = `rotate(${0}deg)`;
  for (let pipe of pipes) {
    pipe.remove();
  }
  pipes = [];
  setScore(0);
  frame = 0;
  game_state = "Start";
  score_display.textContent = "";
}

let pipeSpeed = 3;

function getDifficultySettings() {
  const selected = document.getElementById("difficulty-select").ariaValueMax;

  if (selected === "easy") {
    pipeSpeed = 2;
  } else if (selected === "medium") {
    pipeSpeed = 3;
  } else if (selected === "hard") {
    pipeSpeed = 5;
  }
}

const flapSound = new Audio("assets/metal-pipe-329305.mp3");
const scoreSound = new Audio();
const hitSound = new Audio();

const backgroundMusic = new Audio();
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
backgroundMusic.play();

const muteBtn = document.getElementById("mute-btn");

muteBtn.addEventListener("click", () => {
  if (musicMuted) {
    backgroundMusic.play();
    muteBtn.textContent = "Mute Music";
  } else {
    backgroundMusic.pause();
    muteBtn.textContent = "Play Music"
  }
})