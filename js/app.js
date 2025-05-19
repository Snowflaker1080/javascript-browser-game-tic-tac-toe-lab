//1) Define the required variables used to track the state of the game.

//2) Store cached element references.

//3) Upon loading, the game state should be initialized, and a function should 
//   be called to render this game state.

//4) The state of the game should be rendered to the user.

//5) Define the required constants.

//6) Handle a player clicking a square with a `handleClick` function.

//7) Create Reset functionality.

/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],    // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],    // columns
  [0, 4, 8], [2, 4, 6]                // diagonals
];

/*---------------------------- Variables (state) ----------------------------*/
let board;
let turn;
let winner;
let tie;
let xScore = 0;
let oScore = 0;


document.addEventListener('DOMContentLoaded', () => {
/*------------------------ Cached Element References ------------------------*/
const squareEls = Array.from(document.querySelectorAll('.sqr'));
const messageEl = document.getElementById('message');
const resetBtnEl = document.getElementById('reset');  
const xScoreEl = document.getElementById('x-score');
const oScoreEl = document.getElementById('o-score');

/*-------------------------------- Functions --------------------------------*/
function init() {
  board = Array(9).fill('');
  turn = 'X';
  winner = false;
  tie = false;
  clearStrikeLines();
  render();
  console.log("Game initialized");
}

function render() {
  updateBoard();
  updateMessage();
  updateScores();
}

function updateBoard() {
  board.forEach((value, index) => {
    squareEls[index].textContent = value;
  });
}

function updateMessage() {
  if (!winner && !tie) {
    messageEl.textContent = `${turn}'s turn`;
  } else if (!winner && tie) {
    messageEl.textContent = "It's a tie!";
  } else {
    messageEl.textContent = `${turn} wins!`;
  }
}

function updateScores() {
  xScoreEl.textContent = `X: ${xScore}`;
  oScoreEl.textContent = `O: ${oScore}`;
}

function handleClick(evt) {
  const squareIndex = parseInt(evt.target.id);

  if (board[squareIndex] || winner) return;

  placePiece(squareIndex);
  checkForWinner();
  checkForTie();
  switchPlayerTurn();
  render();
}

function placePiece(index) {
  board[index] = turn;
  console.log(board);
}

function checkForWinner() {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = true;
      showStrike(combo);
      if (turn === 'X') xScore++;
      if (turn === 'O') oScore++;
      break;
    }
  }
  console.log("Winner:", winner);
}

function checkForTie() {
  if (winner) return;
  tie = board.every(cell => cell !== '');
  console.log("Tie:", tie);
}

function switchPlayerTurn() {
  if (winner) return;
  turn = turn === 'X' ? 'O' : 'X';
  console.log("Turn:", turn);
}

function showStrike(combo) {
  clearStrikeLines();

  let selector;
  const [a, b] = combo;

  // Horizontal
  if (Math.floor(a / 3) === Math.floor(b / 3)) {
    selector = `.strike-line.row-${Math.floor(a / 3)}`;
  }
  // Vertical
  else if (a % 3 === b % 3) {
    selector = `.strike-line.col-${a % 3}`;
  }
  // Diagonal descending
  else if (combo.toString() === [0, 4, 8].toString()) {
    selector = '.strike-line.diag-desc';
  }
  // Diagonal ascending
  else if (combo.toString() === [2, 4, 6].toString()) {
    selector = '.strike-line.diag-asc';
  }

  document.querySelector(selector)?.classList.add('active');
}

function clearStrikeLines() {
  document.querySelectorAll('.strike-line.active')
  .forEach(el => el.classList.remove('active'));
}

/*----------------------------- Event Listeners -----------------------------*/
squareEls.forEach(sq => sq.addEventListener('click', handleClick));
resetBtnEl.addEventListener('click', init);
  init();
});
