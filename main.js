//'use strict';

/* Game Menu Variables */
const markX = document.getElementById('x-mark');
const markO = document.getElementById('o-mark');
const gameCpu = document.getElementById('cpu');
const gameMultiPlayer = document.getElementById('player');

/* Gane Board Variables */
const gameBoard = document.getElementById('board-container');
const gameMenu = document.getElementById('game-window');
const currPlayer = document.querySelector('.cross').classList;
const showTurn = document.getElementById('turn-icon');
const cellElements = document.querySelectorAll('.cell');
const p1Mark = document.querySelector('.selected');
const restartIcon = document.getElementById('restart');
const restartGame = document.querySelector('.game-restart');

const WIN_COMBOS = [ 
		[0, 1, 2], [3, 4, 5], 
		[6, 7, 8], [0, 3, 6], 
		[1, 4, 7], [2, 5, 8],
		[0, 4, 8], [2, 4, 6],
]

let winnerCells, currClass, gameType;

//Game Score
let xScore = 0;
let oScore = 0;
let tieScore = 0;


markX.addEventListener('click', function() {
		markX.classList.add('selected');
		markO.classList.remove('selected');
		p1Mark.id = 'x-mark';
});

markO.addEventListener('click', function() {
		markO.classList.add('selected');
		markX.classList.remove('selected');
		p1Mark.id = 'o-mark';
});

gameCpu.addEventListener('click', startGameCpu);

gameMultiPlayer.addEventListener('click', startGamePlayer);

restartIcon.addEventListener('click', function() {
		restartGame.style.display = 'flex';
		document.querySelector('.restart__no').addEventListener('click', function() {
				restartGame.style.display = 'none';
		});
		document.querySelector('.restart__yes').addEventListener('click', restart);
});

function startGameCpu() {
		gameType = this.id;
		//show board
		drawBoard();
		//initialize Player 1 mark
		initP1Mark(gameType);
		gameStartCondition();
}

function startGamePlayer() {
		gameType = this.id;
		//show board
		drawBoard();
		//initialize Player 1 mark
		initP1Mark(gameType);
		//initialize game
		gameInit(cellElements);
}

function getCpuChoice() {
		const randomCell = getRandomCell();
		
		randomCell.removeEventListener('click', getPlayerChoice, {once : true});
		updateGame(randomCell);
}

function getPlayerChoice() {
		updateGame(this);
}

function drawBoard() {
		gameBoard.style.display = 'block';
		gameMenu.style.display = 'none';
}


function initP1Mark(gameType) {
		const XHeadingEl = document.getElementById('x-heading');
		const OHeadingEl = document.getElementById('o-heading');
		
		const XScoreEl = document.getElementById('x-score');
		const OScoreEl = document.getElementById('o-score');
		
		if (gameType === 'cpu') {				
				if (p1Mark.id === 'o-mark') {
						XHeadingEl.textContent = 'o (you)';
						OHeadingEl.textContent = 'x (cpu)'; 
						XScoreEl.id = 'o-score';
						OScoreEl.id = 'x-score';
				} else {
						XHeadingEl.textContent = 'x (you)';
						OHeadingEl.textContent = 'o (cpu)';
				}
		} 
		else if (gameType === 'player') {
				if (p1Mark.id === 'o-mark') {
						XHeadingEl.textContent = 'o (p1)';
						OHeadingEl.textContent = 'x (p2)';						
						XScoreEl.id = 'o-score';
						OScoreEl.id = 'x-score';
				}
		}
}


function gameInit(container) {
		container.forEach(cell => {
				cell.addEventListener('click', getPlayerChoice, {once : true});
		});
}


function updateGame(cell) {
		currClass = currPlayer[1] === 'cross' ? 'x' : 'o';	
		let gameOver = false;
		//draw user move image
		drawImage(cell);	
		
		//get the winner
		if (checkWin(currClass)) {
				hiLightWinCell(winnerCells);
			 showWinnerWindow(currClass);		
			 
			 //increment score of o
			 if (currClass === 'o') {
			 		oScore += 1;
			 	 incrementScore(oScore, `${currClass}-score`);
			 }
			 //increment score of x
			 else {
			 		xScore += 1;
			   incrementScore(xScore, `${currClass}-score`);
			 }
			 gameOver = true;
		}
		else if (checkTie()) {
				tieScore += 1;
				showTieWindow();
				incrementScore(tieScore, 'tie-score');
				gameOver = true;
		}
		else {
				//swap turn
				swapTurn();		
		}
		
		if (!gameOver) {
				cpuTurn();
		}
}

function drawImage(cell) {
		if (!cell.classList.contains('x') &&  !cell.classList.contains('o')) {
				addImage(cell, currClass);
		}
}

function addImage(cell, currentClass) {	
		cell.innerHTML = `<img src="img/icon-${currentClass}.svg">`;
		showTurn.src = `img/icon-${currentClass === 'x' ? 'o' : 'x'}-default.svg`;
		cell.classList.add(currentClass);
}

function checkWin(currentClass) {
		return WIN_COMBOS.some(combo => {
				winnerCells = combo;
				return combo.every(index => { 
				return cellElements[index].classList.contains(currentClass);
				});
		});
}

function showTieWindow() {
document.querySelector('.game-winner').style.display = 'flex';
		document.querySelector('.winner-modal-window').innerHTML = `
		<h1 class="label">round tied<h1>
		<button href="" class="quit-game">quit</button>
		<button href="" class="play-again">next round</button>`;
		
		quitGame();
	 playAgain();
} 

function resetBoard() {
		cellElements.forEach(cell => {
						cell.innerHTML = '';
						cell.classList.remove('x', 'o', 'win-box');
						cell.removeEventListener('click', getPlayerChoice, {once : true});
  });
}


function incrementScore(scoreVar, scoreClass) {
		let score = document.querySelector(`#${scoreClass}`);
		score.textContent = scoreVar;
}

function resetTurn() {
		currPlayer.remove('cross', 'circle');
		currPlayer.add('cross');
		showTurn.src = `img/icon-x-default.svg`;
}

function swapTurn() {
		if (currPlayer.contains('cross')) {
				currPlayer.remove('cross');
				currPlayer.add('circle');
		}
		else {
				currPlayer.remove('circle');
				currPlayer.add('cross');
		}
}

function getRandomCell() {
		const emptyCells = getEmptyCells();
		const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
		return randomCell;
}

function getEmptyCells() {
		const emptyCells = [];
		
		cellElements.forEach(cell => {
				let containClass = cell.classList.contains('x') || cell.classList.contains('o');
				if (!containClass) {
						emptyCells.push(cell);
				}
		});
		
		return emptyCells;
}

function cpuTurn() {
		if (gameType === 'cpu') {
			 const cpuMark = p1Mark.id === 'x-mark' && currPlayer.contains('cross') || p1Mark.id === 'o-mark' && currPlayer.contains('circle');
			 const emptyCells = getEmptyCells();
			 if (cpuMark) {		 		
			 		gameInit(emptyCells);
			 }
			 else {
			 		emptyCells.forEach(cell => {
			 				cell.removeEventListener('click', getPlayerChoice, {once : true});
			 		})
			 		setTimeout(getCpuChoice, 500);
			 }
		}
}
function hiLightWinCell(winArr) {
		winArr.forEach(index => {
				cellElements[index].classList.add('win-box');
				cellElements[index].querySelector('img').src = `img/icon-${currClass}-win.svg`;
		});
}


function showWinnerWindow(winnerClass) {
			document.querySelector('.game-winner').style.display = 'flex';
		document.querySelector('.winner-modal-window').innerHTML = `
		<h4 class="winner__heading">player ${winnerClass === 'x' ? '1' : '2'} wins!</h4>
		<div class="winner__box" data-winner-box>
				<img src="img/icon-${winnerClass}.svg" alt="" class="winner__icon" >
				<label class="label">takes the round</label>
		</div>
		<button href="" class="quit-game">quit</button>
		<button href="" class="play-again">next round</button>`;
		
		quitGame();
		playAgain();
} 


function quitGame() {
		const quitGame = document.querySelector('.quit-game');
		
		quitGame.addEventListener('click', function() {
				gameBoard.style.display = 'none';
				gameMenu.style.display = 'block';
				document.querySelector('.game-winner').style.display = 'none';
				
				xScore = 0;
				oScore = 0;
				tieScore = 0;
				document.querySelector('#x-score').textContent = '0';
				document.querySelector('#o-score').textContent = '0';
				document.querySelector('#tie-score').textContent = '0';
				
				resetBoard();
				resetTurn();
		});
}


//when game is tie or a player wins
function playAgain() {
	const playAgainBtn = document.querySelector('.play-again');
	
	playAgainBtn.addEventListener('click', () => {
				resetBoard();				
				
				//x always plays first, set turn to x
			 resetTurn();			 
			 gameStartCondition();
			 document.querySelector('.game-winner').style.display = 'none';
		});
}

function checkTie() {
		return [...cellElements].every(cell => {
				return cell.classList.contains('x') || cell.classList.contains('o');
		});
}

function restart() {
		resetBoard();
		resetTurn();
		gameStartCondition();
		restartGame.style.display = 'none';
}

function gameStartCondition() {
		if (gameType === 'cpu' && p1Mark.id === 'o-mark') {
			 		setTimeout(getCpuChoice, 500);
		}
		else {
			 //initialize game
				gameInit(cellElements)
		}
}
