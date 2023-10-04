const gameContainer = document.querySelector(".game-container");
const popSound = new Audio("bubble-pop-sound.mp3");
const bubblePopSound = new Audio("bubble-pop-6395.mp3"); // Added bubble pop sound
const buttonClickSound = new Audio("button-click-sound.mp3"); // Added button click sound
const backgroundMusic = new Audio("background-music.mp3"); // Added background music

let score = 0;
let timeLeft = 40; // Adjusted initial time to 40 seconds
let bubbleCount = 60;
let timer;
let currentStage = 1;

const stages = [
  { symbols: ["💣", "🎈"], colors: ["bubble-pink", "bubble-green"] },
  { symbols: ["🍕", "🎉"], colors: ["bubble-yellow", "bubble-purple"] },
  { symbols: ["🍇", "🍊"], colors: ["bubble-blue", "bubble-orange"] },
  { symbols: ["🍎", "🍌"], colors: ["bubble-red", "bubble-yellow"] },
  { symbols: ["🍆", "🍅"], colors: ["bubble-purple", "bubble-red"] }
  // Add more stages as needed
];

function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  const currentStageData = stages[currentStage - 1];
  const randomSymbolIndex = Math.floor(Math.random() * currentStageData.symbols.length);
  bubble.innerText = currentStageData.symbols[randomSymbolIndex];

  const randomColorIndex = Math.floor(Math.random() * currentStageData.colors.length);
  bubble.classList.add(currentStageData.colors[randomColorIndex]);

  // Add the bad-bubble class with a 10% chance
  if (Math.random() < 0.1) {
    bubble.classList.add("bad-bubble");
    bubble.innerText = "👻"; // Assign a specific symbol for bad bubbles
  }

  const randomX = Math.random() * (gameContainer.clientWidth - 50);
  const randomY = Math.random() * (gameContainer.clientHeight - 50);

  bubble.style.left = `${randomX}px`;
  bubble.style.top = `${randomY}px`;

  bubble.addEventListener("click", () => {
    if (bubble.classList.contains("bad-bubble")) {
      // Deduct points and reduce time for bad bubbles
      score -= 5;
      timeLeft -= 5;
    } else {
      bubblePopSound.play(); // Play bubble pop sound
    }
    popBubble(bubble);
  });

  gameContainer.appendChild(bubble);
}

function popBubble(bubble) {
  bubble.removeEventListener("click", () => {
    popBubble(bubble);
  });

  bubble.style.transform = "scale(1.5)";
  score++;
  updateScore();
  bubble.style.transition = "transform 0.3s ease";  // Added transition for smooth scaling

  setTimeout(() => {
    bubble.style.opacity = "0";  // Set opacity to 0 for smooth disappearance
    bubble.style.transform = "scale(0)";  // Scale down the bubble for disappearance

    setTimeout(() => {
      gameContainer.removeChild(bubble);

      // Check if the game is over
      if (score === bubbleCount) {
        clearInterval(timer);
        setTimeout(() => {
          endGame();
        }, 500);
      }
    }, 300);
  }, 300);
}

function updateScore() {
  const scoreElement = document.querySelector("#score");
  scoreElement.innerText = `Score: ${score}`;
}

function updateTime() {
  const timeElement = document.querySelector("#time");
  timeElement.innerText = `Time: ${timeLeft}`;
}

function startGame() {
  score = 0;
  timeLeft = 40;
  updateScore();
  updateTime();

  clearInterval(timer);

  // Play background music when the game starts
  backgroundMusic.loop = true;
  backgroundMusic.play();

  const bubbleCreationInterval = bubbleCount > 10 ? 500 : 1000;

  timer = setInterval(() => {
    timeLeft--;
    updateTime();

    if (timeLeft === 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);

  for (let i = 0; i < bubbleCount; i++) {
    createBubble();
  }
}

function endGame() {
  alert(`Stage ${currentStage} - Game Over!\nYour Score: ${score}`);

  // Play clapping hands sound when a stage is finished
  const clappingSound = new Audio("clapping.mp3");
  clappingSound.play();

  const playAgain = confirm("Do you want to play the next stage?");
  if (playAgain) {
    if (currentStage < stages.length) {
      currentStage++;
      bubbleCount += 10; // Increase the number of bubbles for the next stage
      startGame();
    } else {
      alert("Congratulations! You completed all stages.");
      gameContainer.innerHTML = ""; // Clear the game container
    }
  } else {
    gameContainer.innerHTML = ""; // Clear the game container
  }
}

startGame();
