const cards = document.querySelectorAll('.cell');
const replayBtn = document.getElementById("replayBtn");
const timeCounter = document.querySelector(".timer");
const winningMsg = document.getElementById("instruction");
console.log(cards);
console.log(replayBtn);
console.log(timeCounter);
console.log(winningMsg)

let hasFlippedCard = false;
let lockedBoard = false;
let firstMove = null; 
let secondMove = null;
let winConditionCount = 0; 
// game logic----------------------------------------------------------------

// before game start, shuffle the cards first
shuffle();

// to generate cards at random position
// // disable first - to uncomment later
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

function timer() {
	// 1 count per second, after 60 seconds, convert to 1 min
	time = setInterval(function() {
		seconds++;
		if (seconds === 60) {
				minutes++;
				seconds = 0;
		}
		// update html timer section
		timeCounter.innerHTML = (`<i class="fa-solid fa-hourglass"></i>  ` +`Time: ` + minutes + ` : ` + seconds);
	}, 1000);
}

function stopTimer() {
	clearInterval(time);
}

// player moves 
// add click to all of the cells
cards.forEach(card => card.addEventListener('click', makeMove));

let firstMoveState=[];//<<<<-----------------------------------------------------------to remove?
function makeMove() {
  //timer starts when click on the first card
  if (timeStart === false) {
    timeStart = true; 
    timer();
  };

  if (lockedBoard === true) return;
  if (this === firstMove) return; //Rondell's help
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
  if (winConditionCount == 18) { //<<-------------------------------------------------------to change to 18<<<<<<<
    winningMsg.innerHTML = "Congrats! You Won!";
    replayBtn.innerHTML = "Another One?";
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
  // shuffle the cards
  replayBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate">&nbsp;&nbsp;</i>Play Again';
  winningMsg.innerHTML = 'Find the image pair';
  //clear time;
  minutes = 0;
  seconds = -1;
  // firstMoveState[firstMoveState.length -1].classList.remove('flip');
  cards.forEach(card => card.classList.remove('flip')); //---------------------------------------------<<<<<

  shuffle();
  return null;//---------------------------------------------<<<<<
}


