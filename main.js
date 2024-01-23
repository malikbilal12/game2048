const scoreElement = document.getElementById("score-value");
const highScoreElement = document.getElementById("high-score-value");
const resetButton = document.getElementById("reset-btn");
const cells = document.querySelectorAll(".cell");

let score = 0;
let highScore = 0;
let numOfRows = 4;
let numOfCol = 4;
let gameBoard = Array.from({ length: numOfRows }, () =>
  Array(numOfCol).fill(0)
);

function createGameBoard() {
  const gameContainer = document.getElementById("game-container");
  gameContainer.innerHTML = "";

  for (let i = 0; i < numOfRows; i++) {
    for (let j = 0; j < numOfCol; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `${i}-${j}`;
      cell.textContent = gameBoard[i][j];
      gameContainer.appendChild(cell);
    }
  }

  gameContainer.style.setProperty("--numOfCol", numOfCol);
}

function initializeGame() {
  createGameBoard();
  startGame();
  resetButton.addEventListener("click", resetGame);
  document.addEventListener("keydown", handleKeyPress);
}

function startGame() {
  score = 0;
  updateScore();
  addTile();
  addTile();
  updateBoard();
}

function updateScore() {
  scoreElement.textContent = score;
  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = highScore;
  }
}
function addTile() {
  const emptyPositions = [];
  gameBoard.forEach(function (row, rowIndex) {
    row.forEach(function (cell, colIndex) {
      if (cell === 0) {
        emptyPositions.push({ row: rowIndex, col: colIndex });
      }
    });
  });
  if (emptyPositions.length > 0) {
    const randomPosition =
      emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4;
    gameBoard[randomPosition.row][randomPosition.col] = newValue;
  }
}

function updateBoard() {
    gameBoard.forEach((row, rowIndex) => {
        row.forEach((cellValue, colIndex) => {
            const cellElement = document.getElementById(`${rowIndex}-${colIndex}`);
            if (cellElement) {
                cellElement.textContent = cellValue === 0 ? '' : cellValue;
                cellElement.style.backgroundColor = getTileColor(cellValue);
            }
        });
    });
}

function getTileColor(cellValue) {
  const colors = {
    2: "#f7891b",
    4: "#d1be3f",
    8: "#f2b179",
    16: "#6bd13f",
    32: "#f67c5f",
    64: "#82bd8e",
    128: "#4a5e55",
    256: "#edcc61",
    512: "#2a39a3",
    1024: "#a32a52",
    2048: "#ed0514",
  };

  return colors[cellValue] || "#cdc1b4";
}
function resetGame() {
  score = 0;
  updateScore();
  gameBoard = Array.from({ length: numOfRows }, () => Array(numOfCol).fill(0));

  addTile();
  addTile();
  updateBoard();
}

function handleKeyPress(event) {
  const keyCodes = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
  };

  if (keyCodes.left === event.keyCode) {
    moveTiles("left");
  } else if (keyCodes.up === event.keyCode) {
    moveTiles("up");
  } else if (keyCodes.right === event.keyCode) {
    moveTiles("right");
  } else if (keyCodes.down === event.keyCode) {
    moveTiles("down");
  }
}

function moveTiles(direction) {
  const previousBoard = JSON.parse(JSON.stringify(gameBoard));

  switch (direction) {
    case "left":
      moveLeft();
      break;
    case "up":
      moveUp();
      break;
    case "right":
      moveRight();
      break;
    case "down":
      moveDown();
      break;
  }

  if (!areBoardsEqual(previousBoard, gameBoard)) {
    addTile();
    updateBoard();
    updateScore();
    if (isGameWon()) {
      setTimeout(function () {
        alert("Congratulations! You won the game!");
        handleGameEnd();
      }, 0);
    }

    if (isGameOver()) {
      setTimeout(function () {
        alert("Game Over!");
        handleGameEnd();
      }, 0);
    }
  }
}

function areBoardsEqual(board1, board2) {
  return JSON.stringify(board1) === JSON.stringify(board2);
}

function moveLeft() {
  for (let row = 0; row < numOfRows; row++) {
    const rowValues = gameBoard[row].filter((value) => value !== 0);
    const mergedRowValues = mergeAndFillRow(row, rowValues);
    gameBoard[row] = mergedRowValues.concat(
      Array(numOfCol - mergedRowValues.length).fill(0)
    );
  }
}

function moveRight() {
  for (let row = 0; row < numOfRows; row++) {
    const rowValues = gameBoard[row].filter((value) => value !== 0).reverse();
    const mergedRowValues = mergeAndFillRow(row, rowValues);
    gameBoard[row] = mergedRowValues
      .concat(Array(numOfCol - mergedRowValues.length).fill(0))
      .reverse();
  }
}

function moveUp() {
  for (let col = 0; col < numOfCol; col++) {
    const columnValues = getColumnValues(col);
    const mergedColumnValues = mergeAndFillColumn(col, columnValues);
    setColumnValues(col, Array(numOfRows).fill(0));
    setColumnValues(
      col,
      Array.from({ length: numOfRows }, (_, row) => mergedColumnValues[row])
    );
  }
}

function moveDown() {
  for (let col = 0; col < numOfCol; col++) {
    const reversedColumnValues = getColumnValues(col)
      .filter((value) => value !== 0)
      .reverse();
    const mergedColumnValues = mergeAndFillColumn(col, reversedColumnValues);
    setColumnValues(col, Array(numOfRows).fill(0));
    setColumnValues(
      col,
      Array.from(
        { length: numOfRows },
        (_, row) => mergedColumnValues[row]
      ).reverse()
    );
  }
}

function getColumnValues(col) {
  const columnValues = [];
  for (let row = 0; row < numOfRows; row++) {
    if (gameBoard[row] && gameBoard[row][col] !== undefined) {
      columnValues.push(gameBoard[row][col]);
    }
  }
  return columnValues;
}

function setColumnValues(col, values) {
  for (let row = 0; row < numOfRows; row++) {
    gameBoard[row][col] = values[row];
  }
}

function mergeAndFillRow(row, rowValues) {
  const mergedRowValues = [];
  for (let col = 0; col < rowValues.length; col++) {
    if (rowValues[col] !== 0) {
      if (col < rowValues.length - 1 && rowValues[col] === rowValues[col + 1]) {
        mergedRowValues.push(rowValues[col] * 2);
        rowValues[col + 1] = 0;
        score += mergedRowValues[mergedRowValues.length - 1];
      } else {
        mergedRowValues.push(rowValues[col]);
      }
    }
  }
  return mergedRowValues.concat(
    Array(numOfCol - mergedRowValues.length).fill(0)
  );
}

function mergeAndFillColumn(col, values) {
  const mergedValues = [];
  for (let row = 0; row < values.length; row++) {
    if (values[row] !== 0) {
      if (row < values.length - 1 && values[row] === values[row + 1]) {
        mergedValues.push(values[row] * 2);
        values[row + 1] = 0;
        score += mergedValues[mergedValues.length - 1];
      } else {
        mergedValues.push(values[row]);
      }
    }
  }

  const fillLength = Math.max(numOfRows - mergedValues.length, 0);
  return mergedValues.concat(Array(fillLength).fill(0));
}

function isGameOver() {
  for (let row = 0; row < numOfRows; row++) {
    for (let col = 0; col < numOfCol; col++) {
      if (gameBoard[row][col] === 0) {
        return false;
      }
    }
  }

  for (let row = 0; row < numOfRows; row++) {
    for (let col = 0; col < numOfCol; col++) {
      if (
        (col < numOfCol - 1 &&
          gameBoard[row][col] === gameBoard[row][col + 1]) ||
        (row < numOfRows - 1 && gameBoard[row][col] === gameBoard[row + 1][col])
      ) {
        return false;
      }
    }
  }

  return true;
}

function isGameWon() {
  for (let row = 0; row < numOfRows; row++) {
    for (let col = 0; col < numOfCol; col++) {
      if (gameBoard[row][col] === 2048) {
        return true;
      }
    }
  }
  return false;
}

function handleGameEnd() {
  const playAgain = confirm("Do you want to play again?");

  if (playAgain) {
    resetGame();
  } else {
    alert("Thanks for playing!");
  }
}
initializeGame();
