const gameboard = (function () {
  const size = 3;
  const board = [];

  const createEmptyBoard = () => {
    for (let i = 0; i < size; i++) {
      board[i] = [];
      for (let j = 0; j < size; j++) {
        board[i].push(Cell());
      }
    }
  };

  const getBoard = () => board;

  const selectCell = (row, column, player) => {
    if (board[row][column].getValue() !== " ") return false;

    board[row][column].setValue(player);
    return true;
  };

  const clearBoard = () => createEmptyBoard();

  const printBoard = () => {
    console.log("-------");
    for (let i = 0; i < size; i++) {
      console.log(
        "|" + board[i].map((cell) => cell.getValue()).join("|") + "|"
      );
      console.log("-------");
    }
  };

  //inital creation of the board
  createEmptyBoard();

  return { getBoard, selectCell, clearBoard, printBoard };
})();

function Cell() {
  let value = " ";

  const getValue = () => value;

  const setValue = (player) => {
    value = player;
  };

  return { getValue, setValue };
}

function GameController(player1 = "Player One", player2 = "Player Two") {
  const players = [
    {
      name: player1,
      sign: "X",
    },
    {
      name: player2,
      sign: "O",
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const newGame = () => {
    activePlayer = players[0];
    gameboard.clearBoard();
  };

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const printNewRound = () => gameboard.printBoard();

  const checkStatus = (row, column) => {
    const currentBoard = gameboard.getBoard();

    //check for row win
    if (
      activePlayer.sign === currentBoard[row][(column + 1) % 3].getValue() &&
      activePlayer.sign === currentBoard[row][(column + 2) % 3].getValue()
    )
      return { status: "win", condition: `row ${row}` };

    //check for column win
    let currentColumn = currentBoard
      .flat()
      .map((cell) => cell.getValue())
      .filter((cell, index) => index % 3 === column);
    if (
      currentColumn[0] === currentColumn[1] &&
      currentColumn[0] === currentColumn[2]
    )
      return { status: "win", condition: `column ${column}` };

    //check diagonals

    const diagonal1 = [
      currentBoard[0][0].getValue(),
      currentBoard[1][1].getValue(),
      currentBoard[2][2].getValue(),
    ];

    const diagonal2 = [
      currentBoard[2][0].getValue(),
      currentBoard[1][1].getValue(),
      currentBoard[0][2].getValue(),
    ];

    if (
      diagonal1.includes(activePlayer.sign) &&
      diagonal1[0] === diagonal1[1] &&
      diagonal1[0] === diagonal1[2]
    )
      return { status: "win", condition: `diagonal 1` };
    if (
      diagonal2.includes(activePlayer.sign) &&
      diagonal2[0] === diagonal2[1] &&
      diagonal2[0] === diagonal2[2]
    )
      return { status: "win", condition: `diagonal 2` };

    //check for tie
    if (
      !currentBoard
        .flat()
        .map((cell) => cell.getValue())
        .includes(" ")
    )
      return { status: "tie" };

    return "";
  };

  const playRound = (row, column) => {
    let playerMove = gameboard.selectCell(row, column, activePlayer.sign);

    if (!playerMove) {
      return;
    }

    printNewRound();

    const currentStatus = checkStatus(row, column);
    let msg;

    if (!currentStatus.status) {
      switchPlayer();
      msg = `${activePlayer.name}'s turn.`;
    } else if (currentStatus.status === "win") {
      msg = `${activePlayer.name} won!`;
    } else {
      msg = "It's a tie!";
    }
    return { msg, currentStatus };
  };

  return { getActivePlayer, playRound, newGame };
}

function screenController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const boardDiv = document.querySelector(".board");
  const playAgainBtn = document.querySelector(".play-again-btn");
  const msgDiv = document.querySelector(".msg");
  const overlayDiv = document.querySelector(".overlay");

  const game = GameController(playerOneName, playerTwoName);

  const updateBoard = (status) => {
    boardDiv.innerHTML = "";
    gameboard.getBoard().forEach((row, indexRow) => {
      row.forEach((cell, indexColumn) => {
        const newCell = document.createElement("button");
        newCell.classList = "cell";

        newCell.dataset.row = indexRow;
        newCell.dataset.column = indexColumn;
        if (indexRow === indexColumn) newCell.dataset.diagonal1 = true;
        if (indexRow + indexColumn === 2) newCell.dataset.diagonal2 = true;

        newCell.textContent = cell.getValue();
        boardDiv.appendChild(newCell);
      });
    });

    if (status) {
      overlayDiv.style.display = "block";
      playAgainBtn.textContent = "PLAY AGAIN?";
      playAgainBtn.style.fontSize = "1.6rem";
    }
    if (status && status.status === "win") colorWinningCells(status);
  };

  const colorWinningCells = (status) => {
    const winningCondition = status.condition.split(" ");
    switch (winningCondition[0]) {
      case "row":
        const winningRows = document.querySelectorAll(
          `.cell[data-row="${winningCondition[1]}"]`
        );
        winningRows.forEach(
          (cell) => (cell.style.background = "rgb(0, 160, 0, 0.5)")
        );
        break;

      case "column":
        const winningColumns = document.querySelectorAll(
          `.cell[data-column="${winningCondition[1]}"]`
        );
        winningColumns.forEach(
          (cell) => (cell.style.background = "rgb(0, 160, 0, 0.5)")
        );
        break;

      case "diagonal":
        const winningDiagonal = document.querySelectorAll(
          `.cell[data-diagonal${winningCondition[1]}="true"]`
        );
        winningDiagonal.forEach(
          (cell) => (cell.style.background = "rgb(0, 160, 0, 0.5)")
        );
      default:
        break;
    }
  };

  const displayMsg = (msg) => {
    msgDiv.textContent = msg;
  };

  const restartGame = () => {
    game.newGame();
    displayMsg(`${game.getActivePlayer().name}'s turn.`);
    playAgainBtn.textContent = "RESTART";
    playAgainBtn.style.fontSize = "1.5rem";
    overlayDiv.style.display = "none";
    updateBoard("");
  };

  boardDiv.addEventListener("click", placeOnClick);
  playAgainBtn.addEventListener("click", restartGame);

  function placeOnClick(e) {
    const target = e.target;
    const row = parseInt(target.dataset.row);
    const column = parseInt(target.dataset.column);

    const round = game.playRound(row, column);

    if (round) {
      updateBoard(round.currentStatus);
      displayMsg(round.msg);
    }
  }

  restartGame();

  return { restartGame };
}

const startGameController = (function () {
  const playerOneInput = document.querySelector("#player-one");
  const playerTwoInput = document.querySelector("#player-two");
  const startGameBtn = document.querySelector(".start-game-btn");
  const startGame = document.querySelector(".start-game");
  const gameWrapper = document.querySelector(".game-wrapper");

  startGameBtn.addEventListener("click", startGameHandler);

  function startGameHandler() {
    const playerOneName = playerOneInput.value || "Player One";
    const playerTwoName = playerTwoInput.value || "Player Two";

    startGame.classList = "start-game";
    gameWrapper.classList.add("active");
    screenController(playerOneName, playerTwoName);
  }
})();
