function Gameboard() {
  const size = 3;
  const board = [];

  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const selectCell = (row, column, player) => {
    if (!board[row][column].getValue) return;

    board[row][column].setValue(player);
  };

  const printBoard = () => {
    for (let i = 0; i < size; i++) {
      console.log(board[i].map((cell) => cell.getValue()).join(" "));
    }
  };

  return { getBoard, selectCell, printBoard };
}

function Cell() {
  let value = " ";

  const getValue = () => value;

  const setValue = (player) => {
    value = player;
  };

  return { getValue, setValue };
}

function GameController() {}
