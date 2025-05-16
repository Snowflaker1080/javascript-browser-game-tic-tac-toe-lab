//1) Define the required variables used to track the state of the game.

//2) Store cached element references.

//3) Upon loading, the game state should be initialized, and a function should 
//   be called to render this game state.

//4) The state of the game should be rendered to the user.

//5) Define the required constants.

//6) Handle a player clicking a square with a `handleClick` function.

//7) Create Reset functionality.

/*-------------------------------- Constants --------------------------------*/
const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],    // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],    // columns
  [0, 4, 8], [2, 4, 6]                // diagonals
];

/*---------------------------- Variables (state) ----------------------------*/
let board, currentPlayer, winner;

/*------------------------ Cached Element References ------------------------*/
const squares = Array.from(document.querySelectorAll('.sqr'));
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('reset');

/*-------------------------------- Functions --------------------------------*/
// Initialize game state and render
function init() {
  board = Array(9).fill('');      // empty board
  currentPlayer = 'X';            // X always starts
  winner = null;                  // no winner yet
  // Clear any active strike-line overlays
  document
    .querySelectorAll('.strike-line.active')
    .forEach(el => el.classList.remove('active'));
  render();                       // show initial state
}

// Render the board and status message
function render() {
  board.forEach((val, idx) => {
    squares[idx].textContent = val;
  });

  if (winner) {
    messageEl.textContent =
      winner === 'T' ? "It's a tie!" : `${winner} wins!`;
  } else {
    messageEl.textContent = `${currentPlayer}'s turn`;
  }
}

// Handle player clicking a square
function handleClick(evt) {
  const idx = parseInt(evt.target.id);
  if (board[idx] || winner) return;  // ignore invalid clicks

  board[idx] = currentPlayer;
  checkWinner();
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  render();
}

// Check for a winner or a tie
function checkWinner() {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      winner = board[a];
      showStrike(combo);
      return;  // exit once we’ve found the winner
    }
  }
  if (board.every(cell => cell)) {
    winner = 'T'; // tie
  }
}

// Show the appropriate strike-out line
function showStrike(combo) {
  // First, remove any previous strike-lines
  document
    .querySelectorAll('.strike-line.active')
    .forEach(el => el.classList.remove('active'));

  let selector;
  const [a, b] = combo;

  // Horizontal
  if (Math.floor(a/3) === Math.floor(b/3)) {
    selector = `.strike-line.row-${Math.floor(a/3)}`;
  }
  // Vertical
  else if (a % 3 === b % 3) {
    selector = `.strike-line.col-${a % 3}`;
  }
  // Diagonal descending
  else if (combo.toString() === [0,4,8].toString()) {
    selector = '.strike-line.diag-desc';
  }
  // Diagonal ascending
  else if (combo.toString() === [2,4,6].toString()) {
    selector = '.strike-line.diag-asc';
  }

  // Activate the selected line
  document.querySelector(selector)?.classList.add('active');
}

/*----------------------------- Event Listeners -----------------------------*/
// Player clicks
squares.forEach(sq => sq.addEventListener('click', handleClick));
// Reset game
resetBtn.addEventListener('click', init);
// Kick off on page load
document.addEventListener('DOMContentLoaded', init);