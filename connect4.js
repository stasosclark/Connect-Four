/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// defines height and width of game board
let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for (i=1; i<=HEIGHT; i++) {
    let row = [] // creates an array (row) on each loop
    for (j=1; j<=WIDTH; j++) {
      row.push(null) // adds cells to the row
    }
  board.push(row) // adds completed row to the in-memory board
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board")

  // adds an additional row ('top') to the top of the board which the player will use to select which column to insert their piece
  let top = document.createElement("tr");

  // sets the ID of this new top row to "column-top"
  top.setAttribute("id", "column-top");

  // creates an event listener for when this new top row is clicked. A click will cause the handleClick function to run.
  top.addEventListener("click", handleClick);

  // a loop to fill top row with cells/create columns
  for (let x = 0; x < WIDTH; x++) {

    // creates a cell in the row and assigns it to 'headCell'
    let headCell = document.createElement("td");

    // assigns 'headCell' the ID of whatever the value of x is
    headCell.setAttribute("id", x);

    // adds the cell to the top row
    top.append(headCell);
  }

  // adds the top row to the html board
  htmlBoard.append(top);

  // a loop to create the rest of the board below the top row
  for (let y = 0; y < HEIGHT; y++) {

    // creates another row and assigns it to 'row'
    const row = document.createElement("tr");

    // a loop to fill the new row w/ cells
    for (let x = 0; x < WIDTH; x++) {

      // creates a cell and assigns it to 'cell'
      const cell = document.createElement("td");

      // sets the ID of cell to the values of y and x, respectively
      cell.setAttribute("id", `${y}-${x}`);

      // adds the cell to the new row
      row.append(cell);
    }

    // adds the new row to the html board
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  if (board[0][x] !== null) {
    return null
  }
  for (i=HEIGHT-1; i > -1; i--) {
    if (board[i][x] === null) {
        return i;
      }
    }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let pieceDiv = document.createElement("div"); // make div for a newly placed game piece
  let location = document.getElementById(`${y}-${x}`) // identify where div will be position on game board
  pieceDiv.classList.add("piece")
  pieceDiv.classList.add(`p${currPlayer}`) // give div the id of the player who placed the piece
  location.append(pieceDiv); // add div (piece) to the game board
}

/** endGame: announce game end */

function endGame(msg) {

  // remove event listener when the game ends
  let top = document.querySelector("#column-top");
  top.removeEventListener('click', handleClick);

  // clear in-memory board when the game ends
  board = [];
  makeBoard();

  // clear game board when the game ends
  let htmlBoard = document.getElementById("board")
  htmlBoard.innerHTML = ''
  makeHtmlBoard();

  // pop up alert message
  return alert(`${msg} Click OK to start a new game!`);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  let filledCounter = 0; // tally of number of rows that are full
  for (i = 0; i < board.length; i++) {
    if (board[i].every(cell => cell !== null)) {
      filledCounter ++;
    }
  }
  if (filledCounter === HEIGHT) {
    return endGame("It's a TIE!")
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // loops through every cell in the table
  for (let y = 0; y < HEIGHT; y++) { // all the rows
    for (let x = 0; x < WIDTH; x++) { // all the columns
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; // the format of a horizontal 4-in-a-row win
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; // the format of a vertical 4-in-a-row win
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; // the format of a diagonal (down and to the right) win
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; // the format of a diagonal (down and to the left) win

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { // checks if any of the 4 winning formats listed above have occurred
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
