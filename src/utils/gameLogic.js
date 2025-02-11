
// src/utils/gameLogic.js

/**
 * Checks if a move at (row, col) for the given player produces 4 in a row.
 * (This function works independent of whether index 0 is top or bottom.)
 */
export const checkWin = (board, row, col, player) => {
  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 }
  ];
  for (let { dr, dc } of directions) {
    let count = 1;
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }
    r = row - dr; c = col - dc;
    while (r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === player) {
      count++;
      r -= dr;
      c -= dc;
    }
    if (count >= 4) return true;
  }
  return false;
};

/**
 * Returns the lowest available row in the given column.
 * (Since board index 0 is the top, we search from board.length - 1 downward.)
 */
export const getAvailableRow = (board, columnIndex) => {
  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i][columnIndex] === 0) {
      return i;
    }
  }
  return -1;
};

