
// src/components/Board.js
import React from 'react';
import Cell from './Cell';

const Board = ({ board, onCellClick }) => {
  const columns = board[0].length;

  const renderColumnSelectors = () => (
    <div className="column-selectors">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div key={colIndex} className="column-selector" onClick={() => onCellClick(colIndex)}>
          <span className="arrow">▼</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="board-container">
      {renderColumnSelectors()}
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <Cell key={colIndex} value={cell} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;

