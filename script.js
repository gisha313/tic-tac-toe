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
    if (!board[row][column].getValue) return;

    board[row][column].setValue(player);
  };

  const clearBoard = () => createEmptyBoard();

  const printBoard = () => {
    for (let i = 0; i < size; i++) {
      console.log(board[i].map((cell) => cell.getValue()).join(" "));
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

function GameController() {}
