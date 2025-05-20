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
      return "win";

    //check for column win
    let currentColumn = currentBoard
      .flat()
      .map((cell) => cell.getValue())
      .filter((cell, index) => index % 3 === column);
    if (
      currentColumn[0] === currentColumn[1] &&
      currentColumn[0] === currentColumn[2]
    )
      return "win";

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
      return "win";
    if (
      diagonal2.includes(activePlayer.sign) &&
      diagonal2[0] === diagonal2[1] &&
      diagonal2[0] === diagonal2[2]
    )
      return "win";

    //check for tie
    if (
      !currentBoard
        .flat()
        .map((cell) => cell.getValue())
        .includes(" ")
    )
      return "tie";

    return "";
  };

  const playRound = (row, column) => {
    let playerMove = gameboard.selectCell(row, column, activePlayer.sign);

    if (!playerMove) {
      console.log("Invalid move!");
      return;
    }

    printNewRound();

    const currentStatus = checkStatus(row, column);

    if (!currentStatus) {
      switchPlayer();
    } else if (currentStatus === "win") {
      console.log(`${activePlayer.name} won!`);
      newGame();
    } else {
      console.log("It's a tie!");
      newGame();
    }
  };

  return { getActivePlayer, playRound };
}

const game = GameController("Ognjen", "Ognjen 2");
