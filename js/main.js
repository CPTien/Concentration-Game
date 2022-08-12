const cards = document.querySelectorAll('.cell');
const replayBtn = document.getElementById("replayBtn");
const timeCounter = document.querySelector(".timer");
const winningMsg = document.getElementById("instruction");

let hasFlippedCard = false;
let lockedBoard = false;
let firstMove = null; 
let secondMove = null;
let winConditionCount = 0; 

// before game start, shuffle the cards first
shuffle();

// to generate cards at random position
function shuffle() {
  cards.forEach(card => {
    let randomCell = Math.floor(Math.random() * 36);
    card.style.order = randomCell;
  });
};

//timer functions
let time = null;
let minutes = 0;
let seconds = 0;
let timeStart = false;
let showTime = null;

//timer format reference: <https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers/31466357#31466357>
showTime = setInterval(function() {
  timeCounter.innerHTML = (`<i class="fa-solid fa-hourglass"></i>Time<br>` + (minutes).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + `-` + (seconds).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
},1000);

function timer() {
	// 1 count per second, after 60 seconds, convert to 1 min
	time = setInterval(function() {
		seconds++;
		if (seconds === 60) {
				minutes++;
				seconds = 0;
		}
	}, 1000);
};

function stopTimer() {
	clearInterval(time);
};

// player moves: add click to all of the cells
cards.forEach(card => card.addEventListener('click', makeMove));

function makeMove() {
  //timer starts when click on the first card
  if (timeStart === false) {
    timeStart = true; 
    timer();
  };

  if (lockedBoard === true) return;
  if (this === firstMove) return; 
  this.classList.add('flip');
// if the card has not been selected, make it the first move
  if (hasFlippedCard === false) {
    hasFlippedCard = true;
    firstMove = this;
    return;
  } else {
    // if has flipped = true, that means we are on the second move
    secondMove = this;
  }
  checkPairs();
}

function checkPairs() {
  // if they are the same, cannot click on it again
  if (firstMove.dataset.image === secondMove.dataset.image) {
    firstMove.removeEventListener('click', makeMove);
    secondMove.removeEventListener('click', makeMove);
    winConditionCount++;
    winCondition();
    resetBoard();
  } else {
    //if different, reset it to facedown position
  lockedBoard = true;
  setTimeout(() => {
    firstMove.classList.remove('flip');
    secondMove.classList.remove('flip');
    resetBoard();
  }, 1000);
  }
}

// if cards does not match, reset the condition 
function resetBoard() {
  hasFlippedCard = false;
  lockedBoard = false;
  firstMove = null;
  secondMove = null;
}

//win condition function
function winCondition() {
  if (winConditionCount == 18) { 
    winningMsg.innerHTML = "Congrats! You Won!";
    replayBtn.innerHTML = "Again?";
    stopTimer();
  }
}

// restart game button functions 
replayBtn.addEventListener('click', replay)

  // to reset everything after clicking the play again btn
function replay() {
  lockedBoard = false;
  firstMove = null; 
  secondMove = null;
  //restart win condition count
  winConditionCount = 0;
  // shuffle the cards
  replayBtn.innerHTML = 'Reply';
  winningMsg.innerHTML = 'Find all of the image pairs!!';
  //clear time;
  timeStart = false;
  seconds = 0;
  minutes = 0;
  stopTimer();
  //make all the cards clickable and to face-down position
  cards.forEach(card => card.classList.remove('flip')); 
  cards.forEach(card => card.addEventListener('click', makeMove));
  //generate random position
  shuffle();
  return null;
}


